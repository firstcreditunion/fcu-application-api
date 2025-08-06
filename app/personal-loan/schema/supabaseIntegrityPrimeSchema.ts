import { z } from 'zod'

export const supabaseIntegritySchemaPrime = z.object({
  loan_application_number: z.number(),
  membership_application_number: z.number(),
  portal_client_number: z.number(),
  emailAddressForProgress: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        // If empty or undefined, it's valid (optional field)
        if (!val || val.trim() === '') return true
        // If not empty, validate email format
        return z.string().email().safeParse(val).success
      },
      {
        message: 'Please enter a valid email address',
      }
    ),

  //? Financial Details
  product: z.string(),
  costOfGoods: z
    .string({
      message: 'Costing loan amount is required',
    })
    .optional(),
  defaultFees: z.boolean().optional(),
  needCreditCareInsurance: z.string().optional(),
  component: z.string().optional(),
  coverType: z.string().optional(),
  fees: z.array(z.string()).optional(),
  Loan_Term_1: z.number().min(6).max(84).optional(),
  Loan_Term_2: z.string().nullable(),
  paymentFrequency: z
    .string({
      message: 'Frequency is required',
    })
    .optional(),
  start_Date: z.string().optional(),
  Interest_Rate: z
    .string({
      message: 'Interest rate is required',
    })
    .refine((val) => !isNaN(Number(val.replace(/,/g, ''))), {
      message: 'Invalid number',
    })
    .refine((val) => !(val.trim() === ''), {
      message: 'Interest rate is required',
    })
    .refine((val) => !(Number(val.replace(/,/g, '')) > 18), {
      message: 'Max Rate: 18.00%',
    }),

  //? Personal Detials
  primeClientPersonalDetailsUID: z.number(),

  //? Work Visa
  primeClientWorkVisaDetailsUniqueID: z.number(),

  //? Bankrupty
  primeClientBankruptcyUID: z.number(),

  //? Client Extension
  primeClientExtensionUniqueID: z.number(),

  //? Identifications
  primeDriversLicenceUniqueID: z.string().nullable(),
  primePassportUniqueID: z.string().nullable(),
  primeFirearmsLicenceUniqueID: z.string().nullable(),
  primeBirthCertificateUniqueID: z.string().nullable(),
  primeKiwiAccessCardUniqueID: z.string().nullable(),
  primeCommunityServiceCardUniqueID: z.string().nullable(),
  primeGoldCardUniqueID: z.string().nullable(),
  primeStudentIDUniqueID: z.string().nullable(),

  //? Email
  primeEmailUniqueID: z.number().nullable(),
  emailVerificationCompleted: z.boolean().nullable(),
  emailVerificationMetadata: z.string().nullable(),

  //? Phone numbers
  primeClientMobileUniqueID: z.number().nullable(),
  mobileVerificationCompleted: z.boolean().nullable(),
  mobileVerificationMetadata: z.string().nullable(),
  sov_mobileNetwork: z.string().nullable(),
  sov_mobileNumber: z.string().nullable(),
  sov_mobileCallingCode: z.string().nullable(),

  primeClientWorkPhoneUniqueID: z.number().nullable(),
  workPhoneVerificationCompleted: z.boolean().nullable(),
  phoneVerificationMetadata: z.string().nullable(),
  sov_workNetwork: z.string().nullable(),
  sov_workNumber: z.string().nullable(),
  sov_workCallingCode: z.string().nullable(),

  //? Residential Address
  primeResidentialAddressUniqueID: z.number(),
  residentialAddressVerificationCompleted: z.boolean().nullable(),
  residentialAddressMetadata: z.string().nullable(),

  //? Mailing Address
  primeMailingAddressUniqueID: z.number().nullable(),
  mailingAddressVerificationCompleted: z.boolean().nullable(),
  mailingAddressMetadata: z.string().nullable(),

  //? Employment
  primeEmploymentUniqueID: z.number(),

  //? Benefits
  primeBenefitsUniqueID: z.number().nullable(),

  //? Benefits Details
  primeBenefitDetailsUniqueID: z.number().nullable(),

  // ? Retirement
  primeRetirementUniqueID: z.number().nullable(),

  //? Unemployment
  primeClientUnemploymentUniqueID: z.number().nullable(),

  //? Part-time student
  primeClientPartTimeStudentUniqueID: z.number().nullable(),

  //? full-fime Student
  primeClientFullTimeStudentUniqueID: z.number().nullable(),

  //? Schools and Tertiary Institutions
  primeClientSchoolOrTertiaryInstitutionUniqueID: z.number().nullable(),

  //? Income
  primeClientIncomeUniqueID: z.number().nullable(),

  //? Tax Status
  primeClientTaxStatusUniqueID: z.number(),

  //? Citizenship Country 1 (excl. New Zealand)
  primeClientCitizenshipTaxUniqueID: z.number(),

  //? Citizenship Country 2 (excl. New Zealand)
  primeClientNonResidentTaxUniqueID: z.number(),

  primeFinancialDetailsUniqueID: z.number().nullable(),
  primeCreditSenseUniqueID: z.number().nullable(),
  primeSecurityUniqueID: z.string().nullable(),

  //? Products
  productsForClientUniqueID: z.number(),

  //? Services
  servicesForClientUniqueID: z.number(),

  //? CRM Detials
  primeCRMContactUniqueID: z.string(),

  primeClientRecordInserted: z.boolean(),

  primeInserted: z.boolean().optional(),
})
