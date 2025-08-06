'use server'

type verifyPhoneProps = {
  phoneNumber: string
}

export interface mobileVerificationSuccessResponse {
  is_verified: boolean
  line_type: string
  line_status: string
  line_status_reason: string | null
  country_code: string
  calling_code: string
  raw_national: string
  formatted_national: string
  raw_international: string
  formatted_international: string
  not_verified_code: string | null
  not_verified_reason: string | null
  success: boolean
}

export interface phoneVerificationSuccessResponse {
  is_verified: boolean
  line_type: string
  line_status: string
  line_status_reason: string | null
  country_code: string
  calling_code: string
  raw_national: string
  formatted_national: string
  raw_international: string
  formatted_international: string
  not_verified_code: string | null
  not_verified_reason: string | null
  success: boolean
}

export async function verifyMobileNumber({
  phoneNumber,
}: verifyPhoneProps): Promise<mobileVerificationSuccessResponse | undefined> {
  const addressFinderKey = process.env.ADDRESSFINDER_EMAIL_VERIFICATION_KEY!
  const addressFinderSecretKey =
    process.env.ADDRESSFINDER_EMAIL_VERIFICATION_SECRT_KEY!

  try {
    const phoneVerificationUrl = `https://api.addressfinder.io/api/phone/v1/verification/?key=${addressFinderKey}&phone_number=${phoneNumber}&format=json&default_country_code=NZ&mobile_only=1&timeout=10`

    const mobileVerificationResult = await fetch(phoneVerificationUrl, {
      method: 'GET',
      headers: {
        Authorization: addressFinderSecretKey,
      },
    })

    if (!mobileVerificationResult.ok) return undefined

    const mobileVerificationData: phoneVerificationSuccessResponse =
      await mobileVerificationResult.json()

    return mobileVerificationData
  } catch (error) {
    console.log('Mobile Verification Error: ', error)
  }
}

export async function verifyPhoneNumber({
  phoneNumber,
}: verifyPhoneProps): Promise<phoneVerificationSuccessResponse | undefined> {
  const addressFinderKey = process.env.ADDRESSFINDER_EMAIL_VERIFICATION_KEY!
  const addressFinderSecretKey =
    process.env.ADDRESSFINDER_EMAIL_VERIFICATION_SECRT_KEY!

  try {
    const phoneVerificationUrl = `https://api.addressfinder.io/api/phone/v1/verification/?key=${addressFinderKey}&phone_number=${phoneNumber}&format=json&default_country_code=NZ&timeout=10`

    const phoneVerificationResult = await fetch(phoneVerificationUrl, {
      method: 'GET',
      headers: {
        Authorization: addressFinderSecretKey,
      },
    })

    if (!phoneVerificationResult.ok) return undefined

    const phoneVerificationData: phoneVerificationSuccessResponse =
      await phoneVerificationResult.json()

    return phoneVerificationData
  } catch (error) {
    console.log('Phone Verification Error: ', error)
  }
}
