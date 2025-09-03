'use server'

import { insertType_tblMembershipApplicationErrors } from '@/types/supabase/membership'
import { getSchemaToUse } from '@/utils/schemToUse'

import { createClient } from '@/utils/supabase/server'

export async function tblInsertError(
  errorData: typeof insertType_tblMembershipApplicationErrors
) {
  const supabase = await createClient()
  const schema = await getSchemaToUse()

  const { data } = await supabase
    .schema(schema)
    .from('tblMembershipApplicationErrors')
    .insert({
      error_text: errorData.error_text,
      table_name: errorData.table_name,
      update_time: errorData.update_time,
      action: errorData.action,
      additional_details: errorData.additional_details,
    })
    .select()

  if (!data) return undefined

  return data
}
