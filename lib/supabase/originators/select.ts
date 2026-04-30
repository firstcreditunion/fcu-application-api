'use server'

import { createClient } from '@/utils/supabase/server'

/**
 * Look up an active originator by its app_originator code (PK).
 * Returns the row if found and `is_active = true`, otherwise null.
 *
 * The car-loan route handlers use this to validate that the appOriginator
 * value in the request body corresponds to a real, currently-enabled
 * dealership before persisting anything.
 *
 * Always queries the `api` schema (originators are administered there;
 * production reads happen via service role from the same table). When the
 * production schema gets its own copy of tblOriginators, swap to
 * getSchemaToUse() like the rest of the codebase.
 */
export async function getActiveOriginatorByCode(code: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    // TODO(originator-supabase): when production schema gains tblOriginators,
    // switch to getSchemaToUse(). Until then, originators live only in `api`.
    .schema('api')
    .from('tblOriginators')
    .select('app_originator, frontend_value, is_active, is_test')
    .eq('app_originator', code)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    console.error('getActiveOriginatorByCode error: ', error)
    return null
  }

  return data
}
