import { createClient } from '@supabase/supabase-js'
import { getSchemaToUse } from '@/utils/schemToUse'

/**
 * TEST-ENVIRONMENT EMAIL WHITELIST.
 *
 * THE RULE (standing, from Isaac, 2026-08-31): on the TEST environment NO email
 * may leave unless its recipient is a row in `api."tblEmailWhitelistForComms"`.
 *
 * WHAT THIS REPLACES, and why it is not just a tidy-up. Both confirmation-email
 * routes already read that table, but the check was:
 *
 *     const emailsOnly = emailWhiteList?.map((e) => e.email_address)
 *     if (emailsOnly && !emailsOnly.includes(recipientEmail)) { refuse }
 *
 * which FAILS OPEN twice over. `getEmailWhitelist()` returns `undefined` for
 * BOTH "the query errored" and "there are no rows", and `emailsOnly &&` then
 * skips the check entirely — so a transient Supabase blip, a changed RLS policy
 * or an accidentally emptied table all mean the test API happily emails a real
 * member. And `includes()` is exact, while four of the seventeen rows carry
 * mixed casing (Richard.ORegan@…, Simon.Scott@…, Stephen.Hawkins@…,
 * Mark.Beaudoin@…), so those people were refused with an error that told them
 * nothing about why.
 *
 * This module fails CLOSED on both counts and normalises before comparing.
 *
 * Mirrors lib/email-guard/test-whitelist.ts in the staff portal, the loan
 * application and the Loan Status Hub, and WhitelistedOtpMailer in the mobile
 * auth service. Separate deployments, duplicated code — but the BEHAVIOUR must
 * not diverge.
 *
 * WHICH ENVIRONMENT. `getSchemaToUse()` resolves 'production' for
 * fcu-portal-api-prod.vercel.app and 'api' (= TEST) for everything else,
 * including this deployment and any host nobody has thought of. Production
 * passes straight through — it mails real members by design.
 *
 * DELIBERATELY UNTYPED CLIENT. The generated `Database` type has no
 * `tblEmailWhitelistForComms`, so a typed read does not compile; the shape is
 * validated here instead. It is also cookie-free — this is a
 * machine-to-machine route with no user session to carry.
 */

type WhitelistRow = { email_address: string | null }

const CACHE_TTL_MS = 60_000
let cache: { loadedAt: number; allowed: Set<string> } | null = null

/** `"Jane Doe <jane@x.com>"` -> `"jane@x.com"`, lowercased. */
function normalizeAddress(raw: string): string {
  const trimmed = raw.trim()
  const angled = trimmed.match(/<([^>]+)>/)
  return (angled?.[1] ?? trimmed).trim().toLowerCase()
}

async function loadWhitelist(): Promise<Set<string> | null> {
  const now = Date.now()
  if (cache && now - cache.loadedAt < CACHE_TTL_MS) return cache.allowed

  try {
    // Pinned to `api`: the whitelist is a property of the TEST sandbox, not of
    // whichever schema this request happens to be serving.
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { db: { schema: 'api' }, auth: { persistSession: false } }
    )
    const { data, error } = await supabase
      .from('tblEmailWhitelistForComms')
      .select('email_address')

    if (error || !data) {
      console.error(
        '[email-guard] could not read api."tblEmailWhitelistForComms" — BLOCKING all test email:',
        error?.message ?? 'no rows returned'
      )
      return null
    }

    const allowed = new Set(
      (data as WhitelistRow[])
        .map((row) => (row.email_address ? normalizeAddress(row.email_address) : ''))
        .filter((address) => address !== '')
    )

    if (allowed.size === 0) {
      // An empty table is not "allow everything" — it is a truncation accident
      // or an RLS policy hiding every row, and both should stop the mail.
      console.error(
        '[email-guard] api."tblEmailWhitelistForComms" returned zero usable rows — BLOCKING all test email'
      )
      return null
    }

    cache = { loadedAt: now, allowed }
    return allowed
  } catch (e) {
    console.error('[email-guard] whitelist read threw — BLOCKING all test email:', e)
    return null
  }
}

export type EmailGuardDecision =
  | { allowed: true }
  | { allowed: false; blocked: string[]; reason: string }

/** Pass EVERY recipient the message will reach — To, Cc and Bcc alike. */
export async function checkEmailRecipients(
  recipients: (string | null | undefined)[]
): Promise<EmailGuardDecision> {
  if ((await getSchemaToUse()) === 'production') return { allowed: true }

  const addresses = recipients
    .filter((v): v is string => typeof v === 'string' && v.trim() !== '')
    .map(normalizeAddress)
  if (addresses.length === 0) return { allowed: true }

  const allowed = await loadWhitelist()
  if (!allowed) {
    return {
      allowed: false,
      blocked: addresses,
      reason:
        'The TEST email whitelist could not be read, so no email may be sent. ' +
        'Check api."tblEmailWhitelistForComms".',
    }
  }

  const blocked = addresses.filter((address) => !allowed.has(address))
  if (blocked.length === 0) return { allowed: true }

  return {
    allowed: false,
    blocked,
    reason:
      `Blocked on TEST: ${blocked.join(', ')} ${blocked.length === 1 ? 'is' : 'are'} not in ` +
      'api."tblEmailWhitelistForComms". Add the address in the staff portal at ' +
      '/admin/platform/email-whitelist.',
  }
}
