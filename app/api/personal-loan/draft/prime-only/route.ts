import z from 'zod'
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
import { NextRequest, NextResponse } from 'next/server'

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

// Retrieve the API Secret from environment variables on the server.
// This is done once when the server starts.
const API_SECRET = process.env.API_SECRET

export async function POST(request: NextRequest) {
  // First, check if the secret is even configured on the server.
  if (!API_SECRET) {
    // This is a server configuration error, so we return a 500.
    console.error('API_SECRET is not set in the environment variables.')
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error: Service not configured.',
      },
      { status: 500 }
    )
  }

  const headersList = await headers()
  // Get the secret from the request's 'X-API-Secret' header.
  const providedSecret = headersList.get('X-API-Secret')

  // Handle missing or incorrect secret.
  if (!providedSecret) {
    return NextResponse.json(
      { success: false, error: 'API Secret is missing from headers.' },
      { status: 401 } // Unauthorized
    )
  }

  if (providedSecret === API_SECRET) {
    console.log('API SECRET IS VALID')
  }

  // IMPORTANT: Use a secure comparison if timing attacks are a concern.
  // For this example, a direct comparison is shown for simplicity.
  if (providedSecret !== API_SECRET) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid API Secret.',
      },
      {
        status: 403,
      } // Forbidden
    )
  }

  // --- Verification Successful ---
  // If the secret is valid, proceed with your main logic.

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

  console.log('Financial Detials')
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

  const [
    primeMobileVerificationMetaData,
    primeWorkPhoneVerificationMetaData,
    primeEmailVerificationMetaData,
    primeResidentialAddressVerificationMetaData,
    primeMailingAddressVerificationMetaData,
  ] = await Promise.all([
    // Mobile number verification
    primeMobileNumber !== undefined &&
    primeMobileNumber !== null &&
    primeMobileNumber !== ''
      ? verifyMobileNumber({ phoneNumber: primeMobileNumber })
      : Promise.resolve(undefined),

    // Work phone verification
    primeWorkPhoneNumber !== undefined &&
    primeWorkPhoneNumber !== null &&
    primeWorkPhoneNumber !== ''
      ? verifyPhoneNumber({ phoneNumber: primeWorkPhoneNumber })
      : Promise.resolve(undefined),

    // Email verification
    primeEmail !== undefined && primeEmail !== null && primeEmail !== ''
      ? verifyEmailAddress({ emailAddress: primeEmail })
      : Promise.resolve(undefined),

    // Residential address verification
    primeResidentialAddressPxid !== undefined &&
    primeResidentialAddressPxid !== null &&
    primeResidentialAddressPxid !== ''
      ? getExactAddressFromPxid({ pxid: primeResidentialAddressPxid })
      : Promise.resolve(undefined),

    // Mailing address verification
    primeMailingAddressPxid !== undefined &&
    primeMailingAddressPxid !== null &&
    primeMailingAddressPxid !== ''
      ? getExactAddressFromPxid({ pxid: primeMailingAddressPxid })
      : Promise.resolve(undefined),
  ])

  //** ============ PRIME UPDATE SUPABASE ============ */

  const supabaseUpdatePromises = []

  // Mobile phone update
  if (
    primeMobileVerificationMetaData &&
    primeMobileVerificationMetaData?.success === true &&
    primeClientMobileUniqueID !== null &&
    primeClientMobileUniqueID !== undefined
  ) {
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
      not_verified_reason: primeMobileVerificationMetaData?.not_verified_reason,
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

    supabaseUpdatePromises.push(
      tblClientPhoneUpdatePhoneVerificationDetails(
        primeClientMobileUniqueID,
        phoneVerificationResultData
      )
    )
  }

  // Work phone update
  if (
    primeWorkPhoneVerificationMetaData &&
    primeWorkPhoneVerificationMetaData?.success === true &&
    primeClientWorkPhoneUniqueID !== null &&
    primeClientWorkPhoneUniqueID !== undefined
  ) {
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
      raw_international: primeWorkPhoneVerificationMetaData?.raw_international,
      formatted_international:
        primeWorkPhoneVerificationMetaData?.formatted_international,
      not_verified_code: primeWorkPhoneVerificationMetaData?.not_verified_code,
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

    supabaseUpdatePromises.push(
      tblClientPhoneUpdatePhoneVerificationDetails(
        primeClientWorkPhoneUniqueID,
        phoneVerificationResultData
      )
    )
  }

  // Email update
  if (
    primeEmailVerificationMetaData &&
    primeEmailVerificationMetaData?.success === true &&
    primeEmailUniqueID !== null &&
    primeEmailUniqueID !== undefined
  ) {
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
      not_verified_reason: primeEmailVerificationMetaData?.not_verified_reason,
      not_verified_code: primeEmailVerificationMetaData?.not_verified_code,
      success: primeEmailVerificationMetaData?.success,
      email_verification_triggered: true,
      metadata: JSON.stringify(primeEmailVerificationMetaData),
    }

    supabaseUpdatePromises.push(
      tblClientEmailVerificationUpdate(
        primeEmailUniqueID,
        emailVerificationResultData
      )
    )
  }

  // Residential address update
  if (
    primeResidentialAddressVerificationMetaData &&
    primeResidentialAddressVerificationMetaData.success === true &&
    primeResidentialAddressUniqueID !== null &&
    primeResidentialAddressUniqueID !== undefined
  ) {
    const primeResidentialAddressVerificationResultData: typeof updateType_tblClientAddress =
      {
        metadata: JSON.stringify(primeResidentialAddressVerificationMetaData),
      }

    supabaseUpdatePromises.push(
      tblClientAddressMetadataUpdate(
        primeResidentialAddressUniqueID,
        primeResidentialAddressVerificationResultData
      )
    )
  }

  // Mailing address update
  if (
    primeMailingAddressVerificationMetaData &&
    primeMailingAddressVerificationMetaData.success === true &&
    primeMailingAddressUniqueID !== null &&
    primeMailingAddressUniqueID !== undefined
  ) {
    const primeMailingAddressVerificationResultData: typeof updateType_tblClientAddress =
      {
        metadata: JSON.stringify(primeMailingAddressVerificationMetaData),
      }

    supabaseUpdatePromises.push(
      tblClientAddressMetadataUpdate(
        primeMailingAddressUniqueID,
        primeMailingAddressVerificationResultData
      )
    )
  }

  // Execute all Supabase updates in parallel
  if (supabaseUpdatePromises.length > 0) {
    await Promise.all(supabaseUpdatePromises)
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
    dateOfBirth: primePersonalDetails?.dateOfBirth
      ? String(primePersonalDetails.dateOfBirth).split('T')[0]
      : '',
    datetime: convertToUTCTime(),
    email: primeEmail,
    portal_application_number: loanApplicationNumber,
    trading_branch: primePreliminaryQuestions?.tradingBranch ?? 'VIR',
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
