// Type definitions for enriched loan application data used in PDF generation

export interface EnrichedPrimeLoanData {
  // Database fields
  created_at: string
  credit_sense_app_ref: string | null
  credit_sense_app_id: number | null
  app_sales_channel: string | null

  // Original data from json_request
  loanApplicationNumber: number
  primeClientNumber: number
  supabaseIntegrityState: Record<string, unknown>
  supabaseIntegrityJointState: Record<string, unknown>
  primePreliminaryQuestions: {
    isNzCitizen: string
    citizenship: string
    isNzResident: string
    hasWorkPermit: string
    askFurtherQuestions: string
    loanPurposeCode: string
    loanPurposeDescription?: string // Enriched
    tradingBranch: string
    tradingBranchDescription?: string // Enriched
    wasDeclaredBankrupt: string
    bankruptcyYear: string
    visaStartDate?: string
    visaExpiryDate?: string
  }
  primeDriversLicence: {
    licenceType: string
    licenceNumber: string
    licenceVersion: string
    licenceIssueDate: string
    licenceExpiryDate: string
  }
  primePassport: {
    passportNumber: string
    passportIssueDate?: string
    passportExpiryDate?: string
  }
  primeFirearmsLicence: {
    firearmsNumber: string
  }
  primeBirthCertificate: {
    birthCertificateRegNo: string
    birthCertificateIssueDate?: string
  }
  primeKiwiAccessCard: {
    kiwiAccessCardNumber: string
    kiwiAccessCardIssueDate?: string
    kiwiAccessCardExpiryDate?: string
  }
  primeCommunityServiceCard: {
    communityServiceCardNumber: string
  }
  primegoldCard: {
    goldCardNumber: string
  }
  primestudentID: {
    currentStudentCardNumber: string
  }
  primePersonalDetails: {
    title: string
    firstName: string
    middleName: string
    lastName: string
    gender: string
    maritalStatus: string
    dateOfBirth: string
    dependantAdults: number
    dependantChildren: number
  }
  primeEmployment: {
    employmentType: string
    employmentTypeDescription?: string // Enriched
    schoolorTertiaryInst: string
    occupation: string
    occupationDescription?: string // Enriched
    employerName: string
    typeOfBenefit: string[]
    exceptionEmpMonth: string
    expceptionEmpYear: string
    incomeFrequency: string
    netIncome: string
  }
  primeContactDetails: {
    residentialAddress: string
    residentialAddressPxid: string
    accommodationType: string
    residentialEffectiveMonth: string
    residentialEffectiveYear: string
    mailingAddress: string
    mailingAddressPxid: string
    emailAddress: string
    mobileNumber: string
    workPhoneNumber: string
  }
  formFinancialDetails: {
    product: string
    productDescription?: string // Enriched
    costOfGoods: string
    defaultFees: boolean
    needCreditCareInsurance: string
    component?: string
    coverType?: string
    Loan_Term_1: number
    start_Date: string
    Loan_Term_2: string
    paymentFrequency: string
    Interest_Rate: string
    fees: string[]
    feesWithDescriptions?: Array<{ code: string; description: string }> // Enriched
    premiumAmount?: number
    instalmentAmount: string
    totalInterest: string
    totalAmountPayable: string
    coversIncluded?: string
    first_payment_date?: string
  }
  vehicleSecurity: {
    provideVehicleAsLoanSecurity: string
    haveYouPurchasedVehicle?: string
    vehicleRegistrationNumber?: string
    isVehicleInsured?: string
    nameOfInsurer?: string
  }
  providentInsurance: Array<{
    g3_insurance_cover_type: string
    insurance_type: string
    cover_type: string
    lambda_code_component: string
    lambda_code_cover_type: string
    cover_desc: string
    joint: string
  }>
}
