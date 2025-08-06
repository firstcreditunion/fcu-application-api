'use server'

type verifyEmailAddressProps = {
  emailAddress: string
}

interface emailVerificationSuccessResponse {
  verified_email: string
  email_account: string
  email_domain: string
  email_provider_domain: string
  is_verified: boolean
  is_disposable: boolean
  is_role: boolean
  is_public: boolean
  is_catch_all: boolean
  not_verified_reason: string | null
  not_verified_code: string | null
  success: boolean
}

export async function verifyEmailAddress({
  emailAddress,
}: verifyEmailAddressProps): Promise<
  emailVerificationSuccessResponse | undefined
> {
  const addressFinderKey = process.env.ADDRESSFINDER_EMAIL_VERIFICATION_KEY!
  const addressFinderSecretKey =
    process.env.ADDRESSFINDER_EMAIL_VERIFICATION_SECRT_KEY!

  try {
    const emailVerificationUrl = `https://api.addressfinder.io/api/email/v1/verification/?key=${addressFinderKey}&email=${emailAddress}&format=json&features=domain%2Cconnection%2Cprovider`

    const emailVerificationResult = await fetch(emailVerificationUrl, {
      method: 'GET',
      headers: {
        Authorization: addressFinderSecretKey,
      },
    })

    // console.log('emailVerificationResult: ', emailVerificationResult.ok)

    if (!emailVerificationResult.ok) return undefined

    const emailVerificationData: emailVerificationSuccessResponse =
      await emailVerificationResult.json()

    // console.log('emailVerificationData: ', emailVerificationData)

    return emailVerificationData
  } catch (error) {
    console.log('Email Verification Error: ', error)
  }
}
