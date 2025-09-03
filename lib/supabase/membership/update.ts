'use server'

import {
  insertType_tblMembershipApplicationErrors,
  updateType_tblClientAddress,
  updateType_tblClientEmail,
  updateType_tblClientPhone,
} from '@/types/supabase/membership'
import { convertToUTCTime } from '@/utils/constants'
// import { getSchemaToUse } from '@/utils/globalUtils'
import { createClient } from '@/utils/supabase/server'
import { tblInsertError } from '../error.actions'
import { getSchemaToUse } from '@/utils/schemToUse'

//? Client Address Metadata Update
export async function tblClientAddressMetadataUpdate(
  cid_address: number,
  _data: typeof updateType_tblClientAddress
) {
  const supabase = await createClient()
  const schema = await getSchemaToUse()

  try {
    const { data, error } = await supabase
      .schema(schema)
      .from('s$tblClientAddress')
      .update({
        metadata: _data.metadata,
      })
      .eq('CID_Address', cid_address)

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

//? Client Email Verification Update
export async function tblClientEmailVerificationUpdate(
  cid_contact: number,
  _data: typeof updateType_tblClientEmail
) {
  const supabase = await createClient()
  const schema = await getSchemaToUse()

  try {
    const { data, error } = await supabase
      .schema(schema)
      .from('s$tblClientEmail')
      .update({
        verified_email: _data.verified_email,
        email_account: _data.email_account,
        email_domain: _data.email_domain,
        email_provider_domain: _data.email_provider_domain,
        is_verified: _data.is_verified,
        is_disposable: _data.is_disposable,
        is_role: _data.is_role,
        is_public: _data.is_public,
        is_catch_all: _data.is_catch_all,
        not_verified_reason: _data.not_verified_reason,
        not_verified_code: _data.not_verified_code,
        success: _data.success,
        email_verification_triggered: _data.email_verification_triggered,
        metadata: _data.metadata,
      })
      .eq('CID_Contact', cid_contact)

    // // console.log('Prime Email Update Data & Error: ', data, error)

    if (error) {
      const errorData: typeof insertType_tblMembershipApplicationErrors = {
        error_text: JSON.stringify(error),
        table_name: 's$tblClientEmail',
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
        table_name: 's$tblClientEmail',
        update_time: convertToUTCTime(),
      }

      await tblInsertError(errorData)
    }
  }
}

//? Client phone Verification Update
export async function tblClientPhoneUpdatePhoneVerificationDetails(
  cid_phone: number,
  _data: typeof updateType_tblClientPhone
) {
  const supabase = await createClient()
  const schema = await getSchemaToUse()

  try {
    const { data, error } = await supabase
      .schema(schema)
      .from('s$tblClientPhone')
      .update({
        is_verified: _data?.is_verified,
        line_type: _data?.line_type,
        line_status: _data?.line_status,
        line_status_reason: _data?.line_status_reason,
        country_code: _data?.country_code,
        calling_code: _data?.calling_code,
        raw_national: _data?.raw_national,
        formatted_national: _data?.formatted_national,
        raw_international: _data?.raw_international,
        formatted_international: _data?.formatted_international,
        not_verified_code: _data?.not_verified_code,
        not_verified_reason: _data?.not_verified_reason,
        success: _data?.success,
        updated_datetime: _data?.updated_datetime,
        sov_networkCode: _data?.sov_networkCode,
        sov_number: _data?.sov_number,
        sov_stdCode: _data?.sov_stdCode,
        metadata: _data?.metadata,
      })
      .eq('CID_Phone', cid_phone)

    if (error) {
      const errorData: typeof insertType_tblMembershipApplicationErrors = {
        error_text: JSON.stringify(error),
        table_name: 's$tblClientPhone',
        update_time: convertToUTCTime(),
        additional_details: JSON.stringify(_data),
      }

      await tblInsertError(errorData)
    }

    if (!data) return

    return data
  } catch (error) {
    if (error) {
      const errorData: typeof insertType_tblMembershipApplicationErrors = {
        error_text: JSON.stringify(error),
        table_name: 's$tblClientPhone',
        update_time: convertToUTCTime(),
        additional_details: JSON.stringify(_data),
      }

      await tblInsertError(errorData)
    }
  }
}
