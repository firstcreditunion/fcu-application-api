'use server'

import { convertToUTCTime } from '@/utils/constants'

import { createClient } from '@/utils/supabase/server'
import { tblInsertError } from '../error.actions'

import { insert_tblDraftApplicationInsert } from '@/types/supabase/draftApplication'
import { insertType_tblMembershipApplicationErrors } from '@/types/supabase/membership'
import { triggerDraftApplicationMatching } from '@/lib/occ/triggerDraftApplicationMatching'
import { getSchemaToUse } from '@/utils/schemToUse'

/**
 * Car-loan-specific draft loan application INSERT.
 * Differs from insertDraftLoanApplication only by persisting `app_originator`,
 * the dealership originator code (PK from api.tblOriginators).
 *
 * The personal-loan version is intentionally untouched. Once the column appears
 * in regenerated database.types.ts, the `as` cast on the insert payload can be
 * removed.
 */
export async function insertCarLoanDraftApplication(
  _data: typeof insert_tblDraftApplicationInsert & { app_originator: string },
) {
  const supabase = await createClient()
  const schema = await getSchemaToUse()

  console.log('SCHEMA: ', schema)

  console.log('INSERT CAR LOAN DRAFT APPLICATION DATA: ', _data)

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
        // Car-loan addition: dealership originator (FK-like to api.tblOriginators).
        app_originator: _data.app_originator,
      })
      .select()

    if (data && data.length > 0) {
      await triggerDraftApplicationMatching(data[0].application_number)
    }

    console.log('Car-loan draft INSERT data & error: ', data, error)

    if (error) {
      const errorData: typeof insertType_tblMembershipApplicationErrors = {
        error_text: JSON.stringify(error),
        table_name: 'tblDraftLoanApplication',
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
        table_name: 'tblDraftLoanApplication',
        update_time: convertToUTCTime(),
      }

      await tblInsertError(errorData)
    }
  }
}
