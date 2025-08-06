import { getExactAddressFromPxid } from '@/lib/externalActions/addressFinder'
import { verifyEmailAddress } from '@/lib/externalActions/emailVerification'
import {
  verifyMobileNumber,
  verifyPhoneNumber,
} from '@/lib/externalActions/phoneVerification'
import { preparePrimeOnlineJson } from '@/lib/occ/preparePrimeOnlyOnlineJson'
import { insertDraftLoanApplication } from '@/lib/supabase/draft-loan-application/update'
import {
  tblClientAddressMetadataUpdate,
  tblClientEmailVerificationUpdate,
  tblClientPhoneUpdatePhoneVerificationDetails,
} from '@/lib/supabase/membership/update'
import { insert_tblDraftApplicationInsert } from '@/types/supabase/draftApplication'
import {
  updateType_tblClientAddress,
  updateType_tblClientEmail,
  updateType_tblClientPhone,
} from '@/types/supabase/membership'
import { convertToUTCTime } from '@/utils/constants'
import { processMobileNumber } from '@/utils/occUtils'

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json()
  const {
    loanApplicationNumber,
    primeClientNumber,
    supabaseIntegrityState,
    supabaseIntegrityJointState,

    primePreliminaryQuestions,
    primeDriversLicence,
    primePassport,
    primeFirearmsLicence,
    primeBirthCertificate,
    primeKiwiAccessCard,
    primeCommunityServiceCard,
    goldCard,
    studentID,
    primePersonalDetails,
    primeEmployment,
    primeContactDetails,
    formFinancialDetails,
    vehicleSecurity,
    providentInsurance,
  } = body

  const primeMobileNumber = primeContactDetails?.mobileNumber

  const primeClientMobileUniqueID =
    supabaseIntegrityState?.primeClientMobileUniqueID

  const primeMobileVerificationCompleted =
    supabaseIntegrityState?.mobileVerificationCompleted === true

  //* Work Phone Number Verification
  const primeWorkPhoneNumber = primeContactDetails?.workPhoneNumber

  const primeClientWorkPhoneUniqueID =
    supabaseIntegrityState?.primeClientWorkPhoneUniqueID

  const primeWorkPhoneVerificationCompleted =
    supabaseIntegrityState?.workPhoneVerificationCompleted === true

  //* Email Verification
  const primeEmail = primeContactDetails?.workPhoneNumber

  const primeEmailUniqueID = supabaseIntegrityState?.primeEmailUniqueID

  const primeEmailVerificationCompleted =
    supabaseIntegrityState?.emailVerificationCompleted === true

  //* Residential Address Verification
  const primeResidentialAddressPxid =
    primeContactDetails?.residentialAddressPxid

  const primeResidentialAddressUniqueID =
    supabaseIntegrityState?.primeResidentialAddressUniqueID

  const primeResidentialAddressVerificationCompleted =
    supabaseIntegrityState?.residentialAddressVerificationCompleted === true

  //* Mailing Address Verification
  const primeMailingAddressPxid = primeContactDetails?.mailingAddressPxid

  const primeMailingAddressUniqueID =
    supabaseIntegrityState?.primeMailingAddressUniqueID

  const primeMailingAddressVerificationCompleted =
    supabaseIntegrityState?.mailingAddressVerificationCompleted === true

  //? API Call - Prime Mobile
  if (
    primeMobileVerificationCompleted === false &&
    primeMobileNumber !== undefined &&
    primeMobileNumber !== null &&
    primeMobileNumber !== ''
  ) {
    const primeMobileVerificationMetaData = await verifyMobileNumber({
      phoneNumber: primeMobileNumber,
    })

    if (
      primeMobileVerificationMetaData &&
      primeMobileVerificationMetaData?.success === true
    ) {
      //* Update Supabase
      const phoneVerificationResultData: typeof updateType_tblClientPhone = {
        is_verified: primeMobileVerificationMetaData?.is_verified,
        line_type: primeMobileVerificationMetaData?.line_type,
        line_status: primeMobileVerificationMetaData?.line_status,
        line_status_reason: primeMobileVerificationMetaData?.line_status_reason,
        country_code: primeMobileVerificationMetaData?.country_code,
        calling_code: primeMobileVerificationMetaData?.calling_code,
        raw_national: primeMobileVerificationMetaData?.raw_national,
        formatted_national: primeMobileVerificationMetaData?.formatted_national,
        raw_international: primeMobileVerificationMetaData?.raw_international,
        formatted_international:
          primeMobileVerificationMetaData?.formatted_international,
        not_verified_code: primeMobileVerificationMetaData?.not_verified_code,
        not_verified_reason:
          primeMobileVerificationMetaData?.not_verified_reason,
        updated_datetime: convertToUTCTime(),
        sov_networkCode: primeMobileVerificationMetaData?.formatted_national
          ? processMobileNumber(
              primeMobileVerificationMetaData?.formatted_national
            ).sov_networkCode
          : '',
        sov_number: primeMobileVerificationMetaData?.formatted_national
          ? processMobileNumber(
              primeMobileVerificationMetaData?.formatted_national
            ).sov_number
          : '',
        metadata: JSON.stringify(primeMobileVerificationMetaData),
      }

      if (
        primeClientMobileUniqueID !== null &&
        primeClientMobileUniqueID !== undefined
      ) {
        await tblClientPhoneUpdatePhoneVerificationDetails(
          primeClientMobileUniqueID,
          phoneVerificationResultData
        )
      }
    }
  }

  //       //? API Call - Prime Work Phone
  if (
    primeWorkPhoneVerificationCompleted === false &&
    primeWorkPhoneNumber !== undefined &&
    primeWorkPhoneNumber !== null &&
    primeWorkPhoneNumber !== ''
  ) {
    const primeWorkPhoneVerificationMetaData = await verifyPhoneNumber({
      phoneNumber: primeWorkPhoneNumber,
    })

    if (
      primeWorkPhoneVerificationMetaData &&
      primeWorkPhoneVerificationMetaData?.success === true
    ) {
      //* Update Supabase
      const phoneVerificationResultData: typeof updateType_tblClientPhone = {
        is_verified: primeWorkPhoneVerificationMetaData?.is_verified,
        line_type: primeWorkPhoneVerificationMetaData?.line_type,
        line_status: primeWorkPhoneVerificationMetaData?.line_status,
        line_status_reason:
          primeWorkPhoneVerificationMetaData?.line_status_reason,
        country_code: primeWorkPhoneVerificationMetaData?.country_code,
        calling_code: primeWorkPhoneVerificationMetaData?.calling_code,
        raw_national: primeWorkPhoneVerificationMetaData?.raw_national,
        formatted_national:
          primeWorkPhoneVerificationMetaData?.formatted_national,
        raw_international:
          primeWorkPhoneVerificationMetaData?.raw_international,
        formatted_international:
          primeWorkPhoneVerificationMetaData?.formatted_international,
        not_verified_code:
          primeWorkPhoneVerificationMetaData?.not_verified_code,
        not_verified_reason:
          primeWorkPhoneVerificationMetaData?.not_verified_reason,
        updated_datetime: convertToUTCTime(),
        sov_stdCode: primeWorkPhoneVerificationMetaData?.formatted_national
          ? processMobileNumber(
              primeWorkPhoneVerificationMetaData?.formatted_national
            ).sov_networkCode
          : '',
        sov_number: primeWorkPhoneVerificationMetaData?.formatted_national
          ? processMobileNumber(
              primeWorkPhoneVerificationMetaData?.formatted_national
            ).sov_number
          : '',
        metadata: JSON.stringify(primeWorkPhoneVerificationMetaData),
      }

      if (
        primeClientWorkPhoneUniqueID !== null &&
        primeClientWorkPhoneUniqueID !== undefined
      ) {
        await tblClientPhoneUpdatePhoneVerificationDetails(
          primeClientWorkPhoneUniqueID,
          phoneVerificationResultData
        )
      }
    }
  }

  if (
    primeEmailVerificationCompleted === false &&
    primeEmail !== undefined &&
    primeEmail !== null &&
    primeEmail !== ''
  ) {
    const primeEmailVerificationMetaData = await verifyEmailAddress({
      emailAddress: primeEmail,
    })

    if (
      primeEmailVerificationMetaData &&
      primeEmailVerificationMetaData?.success === true
    ) {
      //* Update Supabase
      const emailVerificationResultData: typeof updateType_tblClientEmail = {
        verified_email: primeEmailVerificationMetaData?.verified_email,
        email_account: primeEmailVerificationMetaData?.email_account,
        email_domain: primeEmailVerificationMetaData?.email_domain,
        email_provider_domain:
          primeEmailVerificationMetaData?.email_provider_domain,
        is_verified: primeEmailVerificationMetaData?.is_verified,
        is_disposable: primeEmailVerificationMetaData?.is_disposable,
        is_role: primeEmailVerificationMetaData?.is_role,
        is_public: primeEmailVerificationMetaData?.is_public,
        is_catch_all: primeEmailVerificationMetaData?.is_catch_all,
        not_verified_reason:
          primeEmailVerificationMetaData?.not_verified_reason,
        not_verified_code: primeEmailVerificationMetaData?.not_verified_code,
        success: primeEmailVerificationMetaData?.success,
        email_verification_triggered: true,
        metadata: JSON.stringify(primeEmailVerificationMetaData),
      }

      if (primeEmailUniqueID !== null && primeEmailUniqueID !== undefined) {
        await tblClientEmailVerificationUpdate(
          primeEmailUniqueID,
          emailVerificationResultData
        )
      }
    }

    if (
      primeResidentialAddressVerificationCompleted === false &&
      primeResidentialAddressPxid !== undefined &&
      primeResidentialAddressPxid !== null &&
      primeResidentialAddressPxid !== ''
    ) {
      const primeResidentialAddressVerificationMetaData =
        await getExactAddressFromPxid({
          pxid: primeResidentialAddressPxid,
        })

      if (
        primeResidentialAddressVerificationMetaData &&
        primeResidentialAddressVerificationMetaData.success === true
      ) {
        const primeResidentialAddressVerificationResultData: typeof updateType_tblClientAddress =
          {
            metadata: JSON.stringify(
              primeResidentialAddressVerificationMetaData
            ),
          }

        if (
          primeResidentialAddressUniqueID !== null &&
          primeResidentialAddressUniqueID !== undefined
        ) {
          await tblClientAddressMetadataUpdate(
            primeResidentialAddressUniqueID,
            primeResidentialAddressVerificationResultData
          )
        }
      }

      //       //? API Call - Prime Mailing Address
      if (
        primeMailingAddressVerificationCompleted === false &&
        primeMailingAddressPxid !== undefined &&
        primeMailingAddressPxid !== null &&
        primeMailingAddressPxid !== ''
      ) {
        const primeMailingAddressVerificationMetaData =
          await getExactAddressFromPxid({
            pxid: primeMailingAddressPxid,
          })

        if (
          primeMailingAddressVerificationMetaData &&
          primeMailingAddressVerificationMetaData.success === true
        ) {
          const primeMailingAddressVerificationResultData: typeof updateType_tblClientAddress =
            {
              metadata: JSON.stringify(primeMailingAddressVerificationMetaData),
            }

          if (
            primeMailingAddressUniqueID !== null &&
            primeMailingAddressUniqueID !== undefined
          ) {
            await tblClientAddressMetadataUpdate(
              primeMailingAddressUniqueID,
              primeMailingAddressVerificationResultData
            )
          }
        }
      }

      const primeOnlineJson = await preparePrimeOnlineJson({
        primePreliminaryQuestions,
        primeDriversLicence,
        primePassport,
        primeFirearmsLicence,
        primeBirthCertificate,
        primeKiwiAccessCard,
        primeCommunityServiceCard,
        goldCard,
        studentID,
        primePersonalDetails,
        primeEmployment,
        primeContactDetails,
        formFinancialDetails,
        vehicleSecurity,
        providentInsurance,
      })

      const draftApplicationInsertData: typeof insert_tblDraftApplicationInsert =
        {
          application_name:
            primePersonalDetails?.title +
            ' ' +
            primePersonalDetails?.firstName +
            ' ' +
            primePersonalDetails?.lastName,
          dateOfBirth: primePersonalDetails?.dateOfBirth,
          datetime: convertToUTCTime(),
          email: primeEmail,
          portal_application_number: loanApplicationNumber,
          trading_branch: 'VIR',
          online_json: JSON.stringify(primeOnlineJson),
        }

      await insertDraftLoanApplication(draftApplicationInsertData)
    }
  }

  return new Response(JSON.stringify({}), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
