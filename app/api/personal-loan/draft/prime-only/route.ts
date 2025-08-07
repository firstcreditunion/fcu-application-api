import z from 'zod'
import { format } from 'date-fns'
import { headers } from 'next/headers'
import { convertToUTCTime } from '@/utils/constants'
import { processMobileNumber } from '@/utils/occUtils'

//* Unique IDS
import { supabaseIntegritySchemaJoint } from '@/app/personal-loan/schema/supabaseIntegrityJointSchema'
import { supabaseIntegritySchemaPrime } from '@/app/personal-loan/schema/supabaseIntegrityPrimeSchema'

//* Prime
import { personalDetailsSchema } from '@/app/personal-loan/schema/prime/personalDetailsSchema'
import { preliminaryQuestionSchema } from '@/app/personal-loan/schema/prime/preliminaryQuestionsSchema'
import { securitySchema } from '@/app/personal-loan/schema/prime/securitySchema'
import { contactDetailsSchema } from '@/app/personal-loan/schema/prime/conactSchema'
import { employmentSchema } from '@/app/personal-loan/schema/prime/employment'

import {
  birthCertificateSchema,
  communityServiceCardSchema,
  currentStudentCardSchema,
  driversLicenceSchema,
  firearmsLicenceSchema,
  goldCardSchema,
  kiwiAccessCardSchema,
  passportSchema,
} from '@/app/personal-loan/schema/prime/identificationsSchema'

//* Common
import { financialDetialsSchema } from '@/app/personal-loan/schema/prime/financialDetailsSchema'

//External Actions
import { getExactAddressFromPxid } from '@/lib/externalActions/addressFinder'
import { verifyEmailAddress } from '@/lib/externalActions/emailVerification'
import {
  verifyMobileNumber,
  verifyPhoneNumber,
} from '@/lib/externalActions/phoneVerification'

//* OCC
import { preparePrimeOnlineJson } from '@/lib/occ/preparePrimeOnlyOnlineJson'

//* Supabase
import { insertDraftLoanApplication } from '@/lib/supabase/draft-loan-application/update'
import {
  tblClientAddressMetadataUpdate,
  tblClientEmailVerificationUpdate,
  tblClientPhoneUpdatePhoneVerificationDetails,
} from '@/lib/supabase/membership/update'

//* Types
import { insert_tblDraftApplicationInsert } from '@/types/supabase/draftApplication'
import { row_tblProvidentInsuranceCoverTypes } from '@/types/supabase/insurance/row'
import {
  updateType_tblClientAddress,
  updateType_tblClientEmail,
  updateType_tblClientPhone,
} from '@/types/supabase/membership'

//* Unique Ids
type supabaseIntegrityState = z.infer<typeof supabaseIntegritySchemaPrime>
type supabaseIntegrityJointState = z.infer<typeof supabaseIntegritySchemaJoint>

//* Prime
type primePreliminaryQuestions = z.infer<typeof preliminaryQuestionSchema>
type primePersonalDetails = z.infer<typeof personalDetailsSchema>
type primeEmployment = z.infer<typeof employmentSchema>
type primeContactDetails = z.infer<typeof contactDetailsSchema>
type primeDriversLicence = z.infer<typeof driversLicenceSchema>
type primePassport = z.infer<typeof passportSchema>
type primeFirearmsLicence = z.infer<typeof firearmsLicenceSchema>
type primeBirthCertificate = z.infer<typeof birthCertificateSchema>
type primeKiwiAccessCard = z.infer<typeof kiwiAccessCardSchema>
type primeCommunityServiceCard = z.infer<typeof communityServiceCardSchema>
type primegoldCard = z.infer<typeof goldCardSchema>
type primestudentID = z.infer<typeof currentStudentCardSchema>

//* Common
type formFinancialDetails = z.infer<typeof financialDetialsSchema>
type vehicleSecurity = z.infer<typeof securitySchema>
type providentInsurance = (typeof row_tblProvidentInsuranceCoverTypes)[]

export async function POST(request: Request) {
  const headersList = await headers()
  const authHeader = headersList.get('Authorization')

  console.log('headersList PRIME', headersList)

  console.log('authHeader PRIME', authHeader)

  console.log('Secret Key: PRIME', process.env.FCU_API_SECRET_KEY)

  if (!authHeader || authHeader !== process.env.FCU_API_SECRET_KEY!) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Parse the request body
  const body = await request.json()

  const {
    loanApplicationNumber,
    supabaseIntegrityState,

    primePreliminaryQuestions,
    primeDriversLicence,
    primePassport,
    primeFirearmsLicence,
    primeBirthCertificate,
    primeKiwiAccessCard,
    primeCommunityServiceCard,
    primegoldCard,
    primestudentID,
    primePersonalDetails,
    primeEmployment,
    primeContactDetails,
    formFinancialDetails,
    vehicleSecurity,
    providentInsurance,
  }: {
    loanApplicationNumber: number
    primeClientNumber: number
    supabaseIntegrityState: supabaseIntegrityState
    supabaseIntegrityJointState: supabaseIntegrityJointState
    primePreliminaryQuestions: primePreliminaryQuestions
    primeDriversLicence: primeDriversLicence
    primePassport: primePassport
    primeFirearmsLicence: primeFirearmsLicence
    primeBirthCertificate: primeBirthCertificate
    primeKiwiAccessCard: primeKiwiAccessCard
    primeCommunityServiceCard: primeCommunityServiceCard
    primegoldCard: primegoldCard
    primestudentID: primestudentID
    primePersonalDetails: primePersonalDetails
    primeEmployment: primeEmployment
    primeContactDetails: primeContactDetails
    formFinancialDetails: formFinancialDetails
    vehicleSecurity: vehicleSecurity
    providentInsurance: providentInsurance
  } = body

  // e.g. Insert new user into your DB

  //* --------- Mobile Number Verification ---------
  const primeMobileNumber = primeContactDetails.mobileNumber

  const primeClientMobileUniqueID =
    supabaseIntegrityState.primeClientMobileUniqueID

  //* Work Phone Number Verification
  const primeWorkPhoneNumber = primeContactDetails.workPhoneNumber

  const primeClientWorkPhoneUniqueID =
    supabaseIntegrityState.primeClientWorkPhoneUniqueID

  //* Email Verification
  const primeEmail = primeContactDetails.workPhoneNumber

  const primeEmailUniqueID = supabaseIntegrityState.primeEmailUniqueID

  //* Residential Address Verification
  const primeResidentialAddressPxid = primeContactDetails.residentialAddressPxid

  const primeResidentialAddressUniqueID =
    supabaseIntegrityState.primeResidentialAddressUniqueID

  //* Mailing Address Verification
  const primeMailingAddressPxid = primeContactDetails.mailingAddressPxid

  const primeMailingAddressUniqueID =
    supabaseIntegrityState.primeMailingAddressUniqueID

  //? API Call - Prime Mobile
  if (
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

  //? API Call - Prime Work Phone
  if (
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

  if (primeEmail !== undefined && primeEmail !== null && primeEmail !== '') {
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
  }

  if (
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
          metadata: JSON.stringify(primeResidentialAddressVerificationMetaData),
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
  }

  //? API Call - Prime Mailing Address
  if (
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
    supabaseIntegrityState,
    primePreliminaryQuestions,
    primeDriversLicence,
    primePassport,
    primeFirearmsLicence,
    primeBirthCertificate,
    primeKiwiAccessCard,
    primeCommunityServiceCard,
    primegoldCard,
    primestudentID,
    primePersonalDetails,
    primeEmployment,
    primeContactDetails,
    formFinancialDetails,
    vehicleSecurity,
    providentInsurance,
  })

  const draftApplicationInsertData: typeof insert_tblDraftApplicationInsert = {
    application_name:
      primePersonalDetails?.title +
      ' ' +
      primePersonalDetails?.firstName +
      ' ' +
      primePersonalDetails?.lastName,
    dateOfBirth: format(primePersonalDetails?.dateOfBirth, 'yyyy-MM-dd'),
    datetime: convertToUTCTime(),
    email: primeEmail,
    portal_application_number: loanApplicationNumber,
    trading_branch: 'VIR',
    online_json: JSON.stringify(primeOnlineJson),
  }

  await insertDraftLoanApplication(draftApplicationInsertData)

  return new Response(JSON.stringify({}), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
