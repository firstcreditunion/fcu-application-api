'use server'

import { convertToUTCTime } from '@/utils/constants'
// import { getSchemaToUse } from '@/utils/globalUtils'
import { createClient } from '@/utils/supabase/server'
import { tblInsertError } from '../error.actions'

import { insert_tblDraftApplicationInsert } from '@/types/supabase/draftApplication'
import { insertType_tblMembershipApplicationErrors } from '@/types/supabase/membership'

export async function insertDraftLoanApplication(
  _data: typeof insert_tblDraftApplicationInsert
) {
  const supabase = await createClient()
  // const schema = await getSchemaToUse()
  const schema = 'api'

  try {
    const { data, error } = await supabase
      .schema(schema)
      .from('tblDraftLoanApplication')
      .insert({
        application_name: _data.application_name,
        application_number: _data.application_number,
        dateOfBirth: _data.dateOfBirth,
        datetime: _data.datetime,
        email: _data.email,
        portal_application_number: _data.portal_application_number,
        trading_branch: _data.trading_branch,
        online_raw_json: _data.online_json,
      })

    // // console.log('Prime Email Update Data & Error: ', data, error)

    if (error) {
      const errorData: typeof insertType_tblMembershipApplicationErrors = {
        error_text: JSON.stringify(error),
        table_name: 's$tblClientAddress',
        update_time: convertToUTCTime(),
      }

      await tblInsertError(errorData)
    }

    if (!data) return

    return data
  } catch (error) {
    if (error) {
      const errorData: typeof insertType_tblMembershipApplicationErrors = {
        error_text: JSON.stringify(error),
        table_name: 's$tblClientAddress',
        update_time: convertToUTCTime(),
      }

      await tblInsertError(errorData)
    }
  }
}
