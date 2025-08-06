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

  console.log(
    'PRIME ONLY DRAFT APPLCATION DATA ',
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
    providentInsurance
  )

  // e.g. Insert new user into your DB
  const newUser = { id: Date.now() }

  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
