'use server'

import { EnrichedPrimeLoanData } from '@/types/pdf/enrichedLoanData'
import {
  getTradingBranches,
  getLoanPurposes,
  getFeeCodes,
  getLendingProducts,
} from '@/lib/supabase/loan-application/select'
import { employmentTypesFallback, occupationFallback } from '@/utils/fallback'

interface JsonRequestType {
  loanApplicationNumber: number
  primeClientNumber: number
  supabaseIntegrityState: Record<string, unknown>
  supabaseIntegrityJointState: Record<string, unknown>
  primePreliminaryQuestions: {
    tradingBranch: string
    loanPurposeCode: string
    [key: string]: unknown
  }
  primeEmployment: {
    employmentType: string
    occupation: string
    [key: string]: unknown
  }
  formFinancialDetails: {
    product: string
    fees: string[]
    [key: string]: unknown
  }
  [key: string]: unknown
}

export async function enrichPrimeLoanData(
  jsonRequest: JsonRequestType,
  dbFields: {
    created_at: string
    credit_sense_app_ref: string | null
    credit_sense_app_id: number | null
    app_sales_channel: string | null
  }
): Promise<EnrichedPrimeLoanData> {
  // Fetch all lookup data in parallel
  const [tradingBranches, loanPurposes, feeCodes, lendingProducts] =
    await Promise.all([
      getTradingBranches(),
      getLoanPurposes(),
      getFeeCodes(),
      getLendingProducts(),
    ])

  if (!tradingBranches || !loanPurposes || !feeCodes || !lendingProducts) {
    throw new Error('Failed to fetch lookup data')
  }

  // Find trading branch description
  const tradingBranchDescription = tradingBranches?.find(
    (branch) =>
      branch.Organisation_Unit_id ===
      jsonRequest.primePreliminaryQuestions.tradingBranch
  )?.Organisation_Unit_Name

  // Find loan purpose description
  const loanPurposeDescription = loanPurposes?.find(
    (purpose) =>
      purpose.loan_purpose_code ===
      jsonRequest.primePreliminaryQuestions.loanPurposeCode
  )?.loan_purpose_subcode_desc

  // Find employment type description
  const employmentTypeDescription = employmentTypesFallback.find(
    (empType) => empType.type === jsonRequest.primeEmployment.employmentType
  )?.desc

  // Find occupation description
  const occupationDescription = occupationFallback.find(
    (occ) => occ.activity_code === jsonRequest.primeEmployment.occupation
  )?.activity_name

  // Find product description
  const productDescription = lendingProducts?.find(
    (product) =>
      product.Product_Type === jsonRequest.formFinancialDetails.product
  )?.LP_Product_Name

  // Map fee codes to descriptions
  const feesWithDescriptions =
    jsonRequest.formFinancialDetails.fees?.map((feeCode: string) => {
      const feeDetail = feeCodes?.find((fee) => fee.FEE_Code === feeCode)
      return {
        code: feeCode,
        description: feeDetail?.FEE_Description || feeCode,
      }
    }) || []

  // Build enriched data object
  const enrichedData: EnrichedPrimeLoanData = {
    // Add database fields
    created_at: dbFields.created_at,
    credit_sense_app_ref: dbFields.credit_sense_app_ref,
    credit_sense_app_id: dbFields.credit_sense_app_id,
    app_sales_channel: dbFields.app_sales_channel,

    // Copy all original data
    loanApplicationNumber: jsonRequest.loanApplicationNumber,
    primeClientNumber: jsonRequest.primeClientNumber,
    supabaseIntegrityState: jsonRequest.supabaseIntegrityState,
    supabaseIntegrityJointState: jsonRequest.supabaseIntegrityJointState,
    primeDriversLicence: jsonRequest.primeDriversLicence as {
      licenceType: string
      licenceNumber: string
      licenceVersion: string
      licenceIssueDate: string
      licenceExpiryDate: string
    },
    primePassport: jsonRequest.primePassport as { passportNumber: string },
    primeFirearmsLicence: jsonRequest.primeFirearmsLicence as {
      firearmsNumber: string
    },
    primeBirthCertificate: jsonRequest.primeBirthCertificate as {
      birthCertificateRegNo: string
    },
    primeKiwiAccessCard: jsonRequest.primeKiwiAccessCard as {
      kiwiAccessCardNumber: string
    },
    primeCommunityServiceCard: jsonRequest.primeCommunityServiceCard as {
      communityServiceCardNumber: string
    },
    primegoldCard: jsonRequest.primegoldCard as { goldCardNumber: string },
    primestudentID: jsonRequest.primestudentID as {
      currentStudentCardNumber: string
    },
    primePersonalDetails: jsonRequest.primePersonalDetails as {
      title: string
      firstName: string
      middleName: string
      lastName: string
      gender: string
      maritalStatus: string
      dateOfBirth: string
      dependantAdults: number
      dependantChildren: number
    },
    primeContactDetails: jsonRequest.primeContactDetails as {
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
    },
    vehicleSecurity: jsonRequest.vehicleSecurity as {
      provideVehicleAsLoanSecurity: string
    },
    providentInsurance: jsonRequest.providentInsurance as Array<{
      g3_insurance_cover_type: string
      insurance_type: string
      cover_type: string
      lambda_code_component: string
      lambda_code_cover_type: string
      cover_desc: string
      joint: string
    }>,

    // Add enriched descriptions
    primePreliminaryQuestions: {
      ...(jsonRequest.primePreliminaryQuestions as unknown as {
        isNzCitizen: string
        citizenship: string
        isNzResident: string
        hasWorkPermit: string
        askFurtherQuestions: string
        loanPurposeCode: string
        tradingBranch: string
        wasDeclaredBankrupt: string
        bankruptcyYear: string
      }),
      tradingBranchDescription: tradingBranchDescription || undefined,
      loanPurposeDescription: loanPurposeDescription || undefined,
    },
    primeEmployment: {
      ...(jsonRequest.primeEmployment as unknown as {
        employmentType: string
        schoolorTertiaryInst: string
        occupation: string
        employerName: string
        typeOfBenefit: string[]
        exceptionEmpMonth: string
        expceptionEmpYear: string
        incomeFrequency: string
        netIncome: string
      }),
      employmentTypeDescription,
      occupationDescription,
    },
    formFinancialDetails: {
      ...(jsonRequest.formFinancialDetails as unknown as {
        product: string
        costOfGoods: string
        defaultFees: boolean
        needCreditCareInsurance: string
        Loan_Term_1: number
        start_Date: string
        Loan_Term_2: string
        paymentFrequency: string
        Interest_Rate: string
        fees: string[]
        instalmentAmount: string
        totalInterest: string
        totalAmountPayable: string
      }),
      productDescription,
      feesWithDescriptions,
    },
  }

  return enrichedData
}
