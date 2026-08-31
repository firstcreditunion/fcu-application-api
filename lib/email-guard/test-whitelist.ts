import { createClient } from '@supabase/supabase-js'
import { getSchemaToUse } from '@/utils/schemToUse'

/**
 * TEST-ENVIRONMENT EMAIL WHITELIST.
 *
 * THE RULE (standing, from Isaac, 2026-08-31): on the TEST environment NO email
 * may leave unless its recipient is a row in `api."tblEmailWhitelistForComms"`.
 *
 * WHAT THIS REPLACES, and why it is not a tidy-up. Both confirmation-email
 * routes already "checked" that table:
 *
 *     const emailsOnly = emailWhiteList?.map((e) => e.email_address)
 *     if (emailsOnly && !emailsOnly.includes(recipientEmail)) { refuse }
 *
 * `getEmailWhitelist()` returns `undefined` for BOTH a query error and an empty
 * result, and `emailsOnly &&` then skips the check entirely. That is not a
 * hypothetical weakness — it is the LIVE STATE. This app reads Supabase with the
 * ANON key, and the `api` schema revoked anon's grants on that table, so the
 * read has been returning `permission denied` and the gate has been doing
 * NOTHING. Every test confirmation email has gone out unchecked.
 *
 * WHY AN RPC AND NOT A TABLE READ. Keeping anon locked out of the table is
 * right: it holds staff email addresses and mobile numbers, and this app's anon
 * key is `NEXT_PUBLIC_*` — public by construction. So the question is answered
 * by a SECURITY DEFINER function instead: `api.fn_email_is_whitelisted(text)`
 * takes an address the caller already knows and returns a boolean. Nobody can
 * enumerate the list through it, the table stays closed, and this app needs no
 * new secret in its environment.
 *
 * The function is created by `lib/email-guard/migration-email-whitelist-rls.sql`.
 * Until that migration is applied, every call below fails and — correctly — NO
 * test confirmation email is sent.
 *
 * FAIL CLOSED, in every direction: the RPC erroring, the RPC missing, a null
 * answer, or a `false` answer all BLOCK. The one thing that sends is an explicit
 * `true`.
 *
 * Mirrors lib/email-guard/test-whitelist.ts in the staff portal, the loan
 * application and the Loan Status Hub, and WhitelistedOtpMailer in the mobile
 * auth service — all of which read the table directly because they hold a
 * service-role key and this app does not. Different mechanism, same behaviour;
 * the behaviour must not diverge.
 *
 * WHICH ENVIRONMENT. `getSchemaToUse()` resolves 'production' for
 * fcu-portal-api-prod.vercel.app and 'api' (= TEST) for everything else,
 * including this deployment and any host nobody has thought of. Production
 * passes straight through — it mails real members by design.
 */

/** `"Jane Doe <jane@x.com>"` -> `"jane@x.com"`. The RPC lowercases and trims on
 *  its side too; doing it here as well keeps the logged `blocked` list tidy. */
function normalizeAddress(raw: string): string {
  const trimmed = raw.trim()
  const angled = trimmed.match(/<([^>]+)>/)
  return (angled?.[1] ?? trimmed).trim().toLowerCase()
}

function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: 'api' }, auth: { persistSession: false } }
  )
}

async function isWhitelisted(address: string): Promise<boolean> {
  try {
    const { data, error } = await anonClient().rpc('fn_email_is_whitelisted', {
      p_email: address,
    })

    if (error) {
      console.error(
        '[email-guard] api.fn_email_is_whitelisted failed — BLOCKING this send:',
        error.message
      )
      return false
    }
    // Anything other than an explicit `true` is a refusal. A null answer means
    // the function returned something unexpected, which is not permission.
    return data === true
  } catch (e) {
    console.error('[email-guard] whitelist RPC threw — BLOCKING this send:', e)
    return false
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

  // Sequential rather than concurrent: every send this app makes has exactly
  // one recipient, so a Promise.all would add machinery for a case that does
  // not occur. The loop is here so a future Cc cannot slip past unchecked.
  const blocked: string[] = []
  for (const address of addresses) {
    if (!(await isWhitelisted(address))) blocked.push(address)
  }
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
