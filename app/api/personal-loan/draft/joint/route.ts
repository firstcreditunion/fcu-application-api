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

//* Joint
import { jointPersonalDetailsSchema } from '@/app/personal-loan/schema/joint/personalDetailsSchema'
import { jointPreliminaryQuestionSchema } from '@/app/personal-loan/schema/joint/preliminaryQuestionsSchema'
import { jointcontactDetailsSchema } from '@/app/personal-loan/schema/joint/conactSchema'
import { jointEmploymentSchema } from '@/app/personal-loan/schema/joint/employment'

import {
  jointBirthCertificateSchema,
  jointCommunityServiceCardSchema,
  jointCurrentStudentCardSchema,
  jointDriversLicenceSchema,
  jointFirearmsLicenceSchema,
  jointGoldCardSchema,
  jointKiwiAccessCardSchema,
  jointPassportSchema,
} from '@/app/personal-loan/schema/joint/identificationsSchema'

//* Common
import { financialDetialsSchema } from '@/app/personal-loan/schema/prime/financialDetailsSchema'
import { securitySchema } from '@/app/personal-loan/schema/prime/securitySchema'

//External Actions
import { getExactAddressFromPxid } from '@/lib/externalActions/addressFinder'
import { verifyEmailAddress } from '@/lib/externalActions/emailVerification'
import {
  verifyMobileNumber,
  verifyPhoneNumber,
} from '@/lib/externalActions/phoneVerification'

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
import { prepareJointApplicationJson } from '@/lib/occ/prepareJointApplicationJson'
import { NextResponse } from 'next/server'

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

//* Joint
type jointPreliminaryQuestions = z.infer<typeof jointPreliminaryQuestionSchema>
type jointPersonalDetails = z.infer<typeof jointPersonalDetailsSchema>
type jointEmployment = z.infer<typeof jointEmploymentSchema>
type jointContactDetails = z.infer<typeof jointcontactDetailsSchema>
type jointDriversLicence = z.infer<typeof jointDriversLicenceSchema>
type jointPassport = z.infer<typeof jointPassportSchema>
type jointFirearmsLicence = z.infer<typeof jointFirearmsLicenceSchema>
type jointBirthCertificate = z.infer<typeof jointBirthCertificateSchema>
type jointKiwiAccessCard = z.infer<typeof jointKiwiAccessCardSchema>
type jointCommunityServiceCard = z.infer<typeof jointCommunityServiceCardSchema>
type jointgoldCard = z.infer<typeof jointGoldCardSchema>
type jointstudentID = z.infer<typeof jointCurrentStudentCardSchema>

//* Common
type formFinancialDetails = z.infer<typeof financialDetialsSchema>
type vehicleSecurity = z.infer<typeof securitySchema>
type providentInsurance = (typeof row_tblProvidentInsuranceCoverTypes)[]

// Retrieve the API Secret from environment variables on the server.
// This is done once when the server starts.
const API_SECRET = process.env.API_SECRET

export async function POST(request: Request) {
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

  // if (API_SECRET) {
  //   return NextResponse.json(
  //     {
  //       success: false,
  //       error: 'Warning: Production Not ready yet!',
  //     },
  //     { status: 500 }
  //   )
  // }

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
    console.log('API SECRET IS VALID FOR JOINT')
  }

  // IMPORTANT: Use a secure comparison if timing attacks are a concern.
  // For this example, a direct comparison is shown for simplicity.
  if (providedSecret !== API_SECRET) {
    return NextResponse.json(
      { success: false, error: 'Invalid API Secret.' },
      { status: 403 } // Forbidden
    )
  }

  // --- Verification Successful ---
  // If the secret is valid, proceed with your main logic.

  // Performance optimization: Start timing the entire request processing

  // Parse the request body
  const body = await request.json()

  const {
    loanApplicationNumber,
    supabaseIntegrityState,
    supabaseIntegrityJointState,

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

    jointPreliminaryQuestions,
    jointPersonalDetails,
    jointEmployment,
    jointContactDetails,
    jointDriversLicence,
    jointPassport,
    jointFirearmsLicence,
    jointBirthCertificate,
    jointKiwiAccessCard,
    jointCommunityServiceCard,
    jointgoldCard,
    jointstudentID,

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

    jointPreliminaryQuestions: jointPreliminaryQuestions
    jointPersonalDetails: jointPersonalDetails
    jointEmployment: jointEmployment
    jointContactDetails: jointContactDetails
    jointDriversLicence: jointDriversLicence
    jointPassport: jointPassport
    jointFirearmsLicence: jointFirearmsLicence
    jointBirthCertificate: jointBirthCertificate
    jointKiwiAccessCard: jointKiwiAccessCard
    jointCommunityServiceCard: jointCommunityServiceCard
    jointgoldCard: jointgoldCard
    jointstudentID: jointstudentID

    formFinancialDetails: formFinancialDetails
    vehicleSecurity: vehicleSecurity
    providentInsurance: providentInsurance
  } = body

  //? ============================== Prime Checks ==============================

  console.log('Joint BODY', {
    loanApplicationNumber,
    supabaseIntegrityState,
    supabaseIntegrityJointState,

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

    jointPreliminaryQuestions,
    jointPersonalDetails,
    jointEmployment,
    jointContactDetails,
    jointDriversLicence,
    jointPassport,
    jointFirearmsLicence,
    jointBirthCertificate,
    jointKiwiAccessCard,
    jointCommunityServiceCard,
    jointgoldCard,
    jointstudentID,

    formFinancialDetails,
    vehicleSecurity,
    providentInsurance,
  })

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

  //? ============================== Joint Checks ==============================

  //* --------- Mobile Number Verification ---------
  const jointMobileNumber = jointContactDetails.mobileNumber

  const jointClientMobileUniqueID =
    supabaseIntegrityJointState.jointClientMobileUniqueID

  //* Work Phone Number Verification
  const jointWorkPhoneNumber = jointContactDetails.workPhoneNumber

  const jointClientWorkPhoneUniqueID =
    supabaseIntegrityJointState.jointClientWorkPhoneUniqueID

  //* Email Verification
  const jointEmail = jointContactDetails.workPhoneNumber

  const jointEmailUniqueID = supabaseIntegrityJointState.jointEmailUniqueID

  //* Residential Address Verification
  const jointResidentialAddressPxid = jointContactDetails.residentialAddressPxid

  const jointResidentialAddressUniqueID =
    supabaseIntegrityJointState.jointResidentialAddressUniqueID

  //* Mailing Address Verification
  const jointMailingAddressPxid = jointContactDetails.mailingAddressPxid

  const jointMailingAddressUniqueID =
    supabaseIntegrityJointState.jointMailingAddressUniqueID

  //? ==============================PRIME EXTERNAL CALLS ==============================

  // Performance optimization: Parallelize PRIME externa

  const [
    primeMobileVerificationMetaData,
    primeWorkPhoneVerificationMetaData,
    primeEmailVerificationMetaData,
    primeResidentialAddressVerificationMetaData,
    primeMailingAddressVerificationMetaData,
  ] = await Promise.all([
    // Prime mobile number verification
    primeMobileNumber !== undefined &&
    primeMobileNumber !== null &&
    primeMobileNumber !== ''
      ? verifyMobileNumber({ phoneNumber: primeMobileNumber })
      : Promise.resolve(undefined),

    // Prime work phone verification
    primeWorkPhoneNumber !== undefined &&
    primeWorkPhoneNumber !== null &&
    primeWorkPhoneNumber !== ''
      ? verifyPhoneNumber({ phoneNumber: primeWorkPhoneNumber })
      : Promise.resolve(undefined),

    // Prime email verification
    primeEmail !== undefined && primeEmail !== null && primeEmail !== ''
      ? verifyEmailAddress({ emailAddress: primeEmail })
      : Promise.resolve(undefined),

    // Prime residential address verification
    primeResidentialAddressPxid !== undefined &&
    primeResidentialAddressPxid !== null &&
    primeResidentialAddressPxid !== ''
      ? getExactAddressFromPxid({ pxid: primeResidentialAddressPxid })
      : Promise.resolve(undefined),

    // Prime mailing address verification
    primeMailingAddressPxid !== undefined &&
    primeMailingAddressPxid !== null &&
    primeMailingAddressPxid !== ''
      ? getExactAddressFromPxid({ pxid: primeMailingAddressPxid })
      : Promise.resolve(undefined),
  ])

  //? ==============================JOINT EXTERNAL CALLS ==============================

  const [
    jointMobileVerificationMetaData,
    jointWorkPhoneVerificationMetaData,
    jointEmailVerificationMetaData,
    jointResidentialAddressVerificationMetaData,
    jointMailingAddressVerificationMetaData,
  ] = await Promise.all([
    // Joint mobile number verification
    jointMobileNumber !== undefined &&
    jointMobileNumber !== null &&
    jointMobileNumber !== ''
      ? verifyMobileNumber({ phoneNumber: jointMobileNumber })
      : Promise.resolve(undefined),

    // Joint work phone verification
    jointWorkPhoneNumber !== undefined &&
    jointWorkPhoneNumber !== null &&
    jointWorkPhoneNumber !== ''
      ? verifyPhoneNumber({ phoneNumber: jointWorkPhoneNumber })
      : Promise.resolve(undefined),

    // Joint email verification
    jointEmail !== undefined && jointEmail !== null && jointEmail !== ''
      ? verifyEmailAddress({ emailAddress: jointEmail })
      : Promise.resolve(undefined),

    // Joint residential address verification
    jointResidentialAddressPxid !== undefined &&
    jointResidentialAddressPxid !== null &&
    jointResidentialAddressPxid !== ''
      ? getExactAddressFromPxid({ pxid: jointResidentialAddressPxid })
      : Promise.resolve(undefined),

    // Joint mailing address verification
    jointMailingAddressPxid !== undefined &&
    jointMailingAddressPxid !== null &&
    jointMailingAddressPxid !== ''
      ? getExactAddressFromPxid({ pxid: jointMailingAddressPxid })
      : Promise.resolve(undefined),
  ])

  //? ============================== SUPABASE DATABASE UPDATES ==============================

  const supabaseUpdatePromises = []

  // Prime mobile phone update
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

  // Prime work phone update
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

  // Prime email update
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

  // Prime residential address update
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

  // Prime mailing address update
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

  // Joint mobile phone update
  if (
    jointMobileVerificationMetaData &&
    jointMobileVerificationMetaData?.success === true &&
    jointClientMobileUniqueID !== null &&
    jointClientMobileUniqueID !== undefined
  ) {
    const phoneVerificationResultData: typeof updateType_tblClientPhone = {
      is_verified: jointMobileVerificationMetaData?.is_verified,
      line_type: jointMobileVerificationMetaData?.line_type,
      line_status: jointMobileVerificationMetaData?.line_status,
      line_status_reason: jointMobileVerificationMetaData?.line_status_reason,
      country_code: jointMobileVerificationMetaData?.country_code,
      calling_code: jointMobileVerificationMetaData?.calling_code,
      raw_national: jointMobileVerificationMetaData?.raw_national,
      formatted_national: jointMobileVerificationMetaData?.formatted_national,
      raw_international: jointMobileVerificationMetaData?.raw_international,
      formatted_international:
        jointMobileVerificationMetaData?.formatted_international,
      not_verified_code: jointMobileVerificationMetaData?.not_verified_code,
      not_verified_reason: jointMobileVerificationMetaData?.not_verified_reason,
      updated_datetime: convertToUTCTime(),
      sov_networkCode: jointMobileVerificationMetaData?.formatted_national
        ? processMobileNumber(
            jointMobileVerificationMetaData?.formatted_national
          ).sov_networkCode
        : '',
      sov_number: jointMobileVerificationMetaData?.formatted_national
        ? processMobileNumber(
            jointMobileVerificationMetaData?.formatted_national
          ).sov_number
        : '',
      metadata: JSON.stringify(jointMobileVerificationMetaData),
    }

    supabaseUpdatePromises.push(
      tblClientPhoneUpdatePhoneVerificationDetails(
        jointClientMobileUniqueID,
        phoneVerificationResultData
      )
    )
  }

  // Joint work phone update
  if (
    jointWorkPhoneVerificationMetaData &&
    jointWorkPhoneVerificationMetaData?.success === true &&
    jointClientWorkPhoneUniqueID !== null &&
    jointClientWorkPhoneUniqueID !== undefined
  ) {
    const phoneVerificationResultData: typeof updateType_tblClientPhone = {
      is_verified: jointWorkPhoneVerificationMetaData?.is_verified,
      line_type: jointWorkPhoneVerificationMetaData?.line_type,
      line_status: jointWorkPhoneVerificationMetaData?.line_status,
      line_status_reason:
        jointWorkPhoneVerificationMetaData?.line_status_reason,
      country_code: jointWorkPhoneVerificationMetaData?.country_code,
      calling_code: jointWorkPhoneVerificationMetaData?.calling_code,
      raw_national: jointWorkPhoneVerificationMetaData?.raw_national,
      formatted_national:
        jointWorkPhoneVerificationMetaData?.formatted_national,
      raw_international: jointWorkPhoneVerificationMetaData?.raw_international,
      formatted_international:
        jointWorkPhoneVerificationMetaData?.formatted_international,
      not_verified_code: jointWorkPhoneVerificationMetaData?.not_verified_code,
      not_verified_reason:
        jointWorkPhoneVerificationMetaData?.not_verified_reason,
      updated_datetime: convertToUTCTime(),
      sov_stdCode: jointWorkPhoneVerificationMetaData?.formatted_national
        ? processMobileNumber(
            jointWorkPhoneVerificationMetaData?.formatted_national
          ).sov_networkCode
        : '',
      sov_number: jointWorkPhoneVerificationMetaData?.formatted_national
        ? processMobileNumber(
            jointWorkPhoneVerificationMetaData?.formatted_national
          ).sov_number
        : '',
      metadata: JSON.stringify(jointWorkPhoneVerificationMetaData),
    }

    supabaseUpdatePromises.push(
      tblClientPhoneUpdatePhoneVerificationDetails(
        jointClientWorkPhoneUniqueID,
        phoneVerificationResultData
      )
    )
  }

  // Joint email update
  if (
    jointEmailVerificationMetaData &&
    jointEmailVerificationMetaData?.success === true &&
    jointEmailUniqueID !== null &&
    jointEmailUniqueID !== undefined
  ) {
    const emailVerificationResultData: typeof updateType_tblClientEmail = {
      verified_email: jointEmailVerificationMetaData?.verified_email,
      email_account: jointEmailVerificationMetaData?.email_account,
      email_domain: jointEmailVerificationMetaData?.email_domain,
      email_provider_domain:
        jointEmailVerificationMetaData?.email_provider_domain,
      is_verified: jointEmailVerificationMetaData?.is_verified,
      is_disposable: jointEmailVerificationMetaData?.is_disposable,
      is_role: jointEmailVerificationMetaData?.is_role,
      is_public: jointEmailVerificationMetaData?.is_public,
      is_catch_all: jointEmailVerificationMetaData?.is_catch_all,
      not_verified_reason: jointEmailVerificationMetaData?.not_verified_reason,
      not_verified_code: jointEmailVerificationMetaData?.not_verified_code,
      success: jointEmailVerificationMetaData?.success,
      email_verification_triggered: true,
      metadata: JSON.stringify(jointEmailVerificationMetaData),
    }

    supabaseUpdatePromises.push(
      tblClientEmailVerificationUpdate(
        jointEmailUniqueID,
        emailVerificationResultData
      )
    )
  }

  // Joint residential address update
  if (
    jointResidentialAddressVerificationMetaData &&
    jointResidentialAddressVerificationMetaData.success === true &&
    jointResidentialAddressUniqueID !== null &&
    jointResidentialAddressUniqueID !== undefined
  ) {
    const jointResidentialAddressVerificationResultData: typeof updateType_tblClientAddress =
      {
        metadata: JSON.stringify(jointResidentialAddressVerificationMetaData),
      }

    supabaseUpdatePromises.push(
      tblClientAddressMetadataUpdate(
        jointResidentialAddressUniqueID,
        jointResidentialAddressVerificationResultData
      )
    )
  }

  // Joint mailing address update
  if (
    jointMailingAddressVerificationMetaData &&
    jointMailingAddressVerificationMetaData.success === true &&
    jointMailingAddressUniqueID !== null &&
    jointMailingAddressUniqueID !== undefined
  ) {
    const jointMailingAddressVerificationResultData: typeof updateType_tblClientAddress =
      {
        metadata: JSON.stringify(jointMailingAddressVerificationMetaData),
      }

    supabaseUpdatePromises.push(
      tblClientAddressMetadataUpdate(
        jointMailingAddressUniqueID,
        jointMailingAddressVerificationResultData
      )
    )
  }

  // Execute all Supabase updates in parallel
  if (supabaseUpdatePromises.length > 0) {
    await Promise.all(supabaseUpdatePromises)
  }

  const jointOnlineJson = await prepareJointApplicationJson({
    supabaseIntegrityState,
    supabaseIntegrityJointState,

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

    jointPreliminaryQuestions,
    jointPersonalDetails,
    jointEmployment,
    jointContactDetails,
    jointDriversLicence,
    jointPassport,
    jointFirearmsLicence,
    jointBirthCertificate,
    jointKiwiAccessCard,
    jointCommunityServiceCard,
    jointgoldCard,
    jointstudentID,

    formFinancialDetails,
    vehicleSecurity,
    providentInsurance,
  })

  console.log('Joint Online JSON:', jointOnlineJson)

  const draftApplicationInsertData: typeof insert_tblDraftApplicationInsert = {
    application_name:
      primePersonalDetails?.title +
      ' ' +
      primePersonalDetails?.firstName +
      ' ' +
      primePersonalDetails?.lastName,
    dateOfBirth: primePersonalDetails?.dateOfBirth
      ? (() => {
          const dobDate = new Date(primePersonalDetails.dateOfBirth)
          dobDate.setHours(dobDate.getHours() + 12) // Adjust for NZ timezone
          const year = dobDate.getUTCFullYear()
          const month = String(dobDate.getUTCMonth() + 1).padStart(2, '0')
          const day = String(dobDate.getUTCDate()).padStart(2, '0')
          return `${year}-${month}-${day}`
        })()
      : '',
    datetime: convertToUTCTime(),
    email: primeEmail,
    portal_application_number: loanApplicationNumber,
    trading_branch: jointPreliminaryQuestions?.tradingBranch ?? 'VIR',
    online_json: JSON.stringify(jointOnlineJson),
  }

  await insertDraftLoanApplication(draftApplicationInsertData)

  return new Response(JSON.stringify({}), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
