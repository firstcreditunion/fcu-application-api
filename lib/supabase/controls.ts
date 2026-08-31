'use server'

import { createClient } from '@/utils/supabase/server'

/**
 * RETIRED as a send gate — do not use it for one.
 *
 * It returns `undefined` for BOTH a query error and an empty table, and every
 * caller wrote `if (list && !list.includes(to))`, which then skipped the check
 * entirely. That is a whitelist that stops protecting you exactly when the
 * database is unhappy. `@/lib/email-guard/test-whitelist.ts` is the gate now:
 * it tells those two cases apart, fails CLOSED on both, and normalises casing
 * before comparing.
 *
 * Left in place as a plain read for anything that legitimately just wants the
 * rows (a diagnostic, a screen). Never branch a send on it.
 */
export async function getEmailWhitelist() {
  const supabase = await createClient()

  try {
    const { data } = await supabase
      .schema('api')
      .from('tblEmailWhitelistForComms')
      .select('email_address')

    if (!data) return

    return data
  } catch (error) {
    console.log('Error fetching email whitelist: ', error)
  }
}
