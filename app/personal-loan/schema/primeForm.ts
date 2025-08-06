import { z } from 'zod'
import { phoneRegExp } from '@/utils/fomatUtils'
import { validateIRD } from '@/utils/validateInlandRevenueNumber'

export const employmentsToExclude = ['BNF', 'UEM', 'RTD', 'STP', 'STU'] // C1 & C2
export const employmentsToExcludeForIncome = ['RTD', 'UEM', 'STP', 'STU'] // C1

export const primeFormSchema = z
  .object({
    title: z.enum(['Mr', 'Mrs', 'Miss', 'Ms', 'other', ''], {
      required_error: 'Please select your title',
    }),
    firstName: z
      .string({
        required_error: 'First name is required',
      })
      .trim()
      .min(1, {
        message: 'First name is required',
      }),
    middleName: z.string().trim().optional(),
    lastName: z
      .string({
        required_error: 'Last name is required',
      })
      .trim()
      .min(1, {
        message: 'Last name is required',
      }),
    gender: z.string({
      required_error: 'Please select your gender.',
    }),
    maritalStatus: z.string({
      required_error: 'Please select your marital status.',
    }),
    dateOfBirth: z
      .date({
        required_error: 'Please select your date of birth',
        invalid_type_error: 'That is an invalid date!',
      })
      .min(new Date(new Date().setFullYear(new Date().getFullYear() - 120)), {
        message: 'Invalid date of birth',
      })
      .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), {
        message: 'You need to be at least 18 years old',
      }),
    dependantChildren: z
      .number({
        message: 'Please enter a valid number',
      })
      .nonnegative({ message: 'Please enter a valid number' }),
    emailAddress: z
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
    mobileNumber: z
      .string()
      .optional()
      .refine(
        (val) => {
          // If empty or undefined, it's valid (optional field)
          if (!val || val.trim() === '') return true
          // If not empty, validate phone format and length
          return phoneRegExp.test(val) && val.length <= 13
        },
        {
          message: 'Your mobile number is not valid',
        }
      ),
    workPhoneNumber: z
      .string()
      .optional()
      .refine(
        (val) => {
          // If empty or undefined, it's valid (optional field)
          if (!val || val.trim() === '') return true
          // If not empty, validate phone format and length
          return phoneRegExp.test(val) && val.length <= 13
        },
        {
          message: 'Your phone number is not valid',
        }
      ),
    residentialAddressPxid: z.string(),
    residentialAddress: z.string().min(1, {
      message: 'Your residential address is required',
    }),
    residentialEffectiveDate: z
      .date({
        required_error: 'Please select the effective date',
        invalid_type_error: 'That is an invalid date!',
      })
      .min(new Date(new Date().setFullYear(new Date().getFullYear() - 100)), {
        message: 'Date cannot be before 100 years',
      })
      .max(new Date(new Date().setFullYear(new Date().getFullYear())), {
        message: 'Date has in the future',
      }),
    accommodationType: z.string(),
    mailingAddressPxid: z.string().optional(),
    mailingAddress: z.string().optional(),
  })
  .superRefine(({ emailAddress, mobileNumber, workPhoneNumber }, ctx) => {
    // Validate at least two contact methods are provided
    const emailCount = emailAddress && emailAddress.trim() !== '' ? 1 : 0
    const mobileCount = mobileNumber && mobileNumber.trim() !== '' ? 1 : 0
    const workPhoneCount =
      workPhoneNumber && workPhoneNumber.trim() !== '' ? 1 : 0

    const totalContactMethods = emailCount + mobileCount + workPhoneCount

    if (totalContactMethods < 2) {
      // Add error to all contact fields to highlight the requirement
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please provide at least two valid contact methods.',
        path: ['emailAddress'],
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please provide at least two valid contact methods.',
        path: ['mobileNumber'],
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please provide at least two valid contact methods.',
        path: ['workPhoneNumber'],
      })
    }

    // if (residentialAddressPxid === undefined) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: 'Please complete your residential address',
    //     path: ['residentialAddress'],
    //   })
    // }
    // if (mailingAddress?.trim() !== '' && mailingAddressPxid === undefined) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: 'Please complete your residential address',
    //     path: ['mailingAddress'],
    //   })
    // }
  })

const preliminaryQuestionSchema = z
  .object({
    isJointAccount: z.string(),
    wasDeclaredBankrupt: z.string(),
    selfDeclarationComplete: z.boolean(),
    askFurtherQuestions: z.string(),
    bankruptcyYear: z.string(),
    isBankingwithAnyBank: z.string(),
    anyBankStoppedOrClosedRelationWithYou: z.string(),
  })
  .superRefine(
    (
      {
        isJointAccount,
        wasDeclaredBankrupt,
        askFurtherQuestions,
        bankruptcyYear,
        isBankingwithAnyBank,
        anyBankStoppedOrClosedRelationWithYou,
      },
      ctx
    ) => {
      if (isJointAccount === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please confirm whether you are opening a joint account',
          path: ['isJointAccount'],
        })
      }
      if (askFurtherQuestions === 'Y' && wasDeclaredBankrupt === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please provide your bankruptcy details, if applicable',
          path: ['wasDeclaredBankrupt'],
        })
      }
      if (
        askFurtherQuestions === 'Y' &&
        wasDeclaredBankrupt === 'Y' &&
        bankruptcyYear === ''
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please choose the year of bankruptcy',
          path: ['bankruptcyYear'],
        })
      }
      if (askFurtherQuestions === 'Y' && isBankingwithAnyBank === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please choose an option',
          path: ['isBankingwithAnyBank'],
        })
      }
      if (
        askFurtherQuestions === 'Y' &&
        anyBankStoppedOrClosedRelationWithYou === ''
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please choose an option',
          path: ['anyBankStoppedOrClosedRelationWithYou'],
        })
      }
    }
  )

const employmentSchema = z
  .object({
    employmentType: z
      .string({
        required_error: 'Please choose your employment type',
      })
      .min(1, {
        message: 'Please choose an employment type',
      }),
    schoolorTertiaryInst: z.string(),
    occupation: z.string().or(z.literal('')),
    employerName: z.string().or(z.literal('')),
    typeOfBenefit: z.array(z.string()),
    incomeFrequency: z.string(),
    netIncome: z.string(),
    exceptionEmpMonth: z.string(),
    expceptionEmpYear: z.string(),
    employmentEffctiveDate: z.date().optional(),
  })
  .superRefine(
    (
      {
        employmentType,
        occupation,
        employerName,
        employmentEffctiveDate,
        typeOfBenefit,
        incomeFrequency,
        netIncome,
        exceptionEmpMonth,
        expceptionEmpYear,
        schoolorTertiaryInst,
      },
      ctx
    ) => {
      if (!employmentsToExclude.includes(employmentType) && occupation === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select your occupation',
          path: ['occupation'],
        })
      }
      if (
        !employmentsToExclude.includes(employmentType) &&
        employerName === ''
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'The name of your employer is required',
          path: ['employerName'],
        })
      }

      if (
        (employmentType === 'STP' || employmentType === 'STU') &&
        schoolorTertiaryInst === ''
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please choose a school or a tertiary institution',
          path: ['schoolorTertiaryInst'],
        })
      }

      if (
        // C1 & C2
        (!employmentsToExclude.includes(employmentType.trim()) &&
          employmentEffctiveDate === undefined) ||
        employmentEffctiveDate === null
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please choose employment effective date',
          path: ['employmentEffctiveDate'],
        })
      }

      if (employmentType === 'BNF' && typeOfBenefit.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please choose the type of benefit',
          path: ['typeOfBenefit'],
        })
      }

      if (
        //  C2 & C1
        employmentsToExclude.includes(employmentType) &&
        exceptionEmpMonth === ''
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please choose a month',
          path: ['exceptionEmpMonth'],
        })
      }

      if (
        //  C2 & C1
        employmentsToExclude.includes(employmentType) &&
        expceptionEmpYear === ''
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please choose a year',
          path: ['expceptionEmpYear'],
        })
      }

      if (
        //C2 only
        !employmentsToExcludeForIncome.includes(employmentType) &&
        incomeFrequency === ''
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please choose the income frequency',
          path: ['incomeFrequency'],
        })
      }

      if (
        //C2 only
        !employmentsToExcludeForIncome.includes(employmentType) &&
        netIncome === ''
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please provide your net income',
          path: ['netIncome'],
        })
      }

      if (
        !employmentsToExcludeForIncome.includes(employmentType) &&
        Number(netIncome) <= 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Net income must be greater than $0',
          path: ['netIncome'],
        })
      }
    }
  )

const productsSchema = z.object({
  transactionalAccounts: z.array(z.string()),
  savingAccounts: z.array(z.string()),
  termDeposit: z.boolean(),
})

const finalQuestionsChema = z.object({
  callCentrePassword: z
    .string({
      required_error: 'Please provide a password',
    })
    .min(4, {
      message: 'Password should be at least 4 characters long',
    })
    .max(15, {
      message: 'Password should not exceed 15 characters',
    })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: 'Password must contain only letters and numbers',
    }),
  preferredContactTimeStart: z.string(),
  preferredContactTimeEnd: z.string(),
})

const servicesSchema = z
  .object({
    requireInternetBanking: z.boolean(),
    requireMobileBanking: z.boolean(),
    requireFcuDebitMastercard: z.boolean(),
    acceptMarketingEmails: z.boolean(),
    debitCardTermAndConditionsAccepted: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // If debit card is requested, terms must be accepted
      return (
        !data.requireFcuDebitMastercard ||
        data.debitCardTermAndConditionsAccepted === true
      )
    },
    {
      message:
        'You must accept the Terms and Conditions to apply for a Debit Mastercard',
      path: ['debitCardTermAndConditionsAccepted'],
    }
  )

const aeoiSchema = z
  .object({
    isNzCitizen: z.string(),
    citizenship: z.string(),
    isNzResident: z.string(),
    hasWorkPermit: z.string(),
    visaStartDate: z.date().optional(),
    visaExpiryDate: z.date().optional(),
    irdNumber: z
      .string()
      .min(7, {
        message: 'Your IRD number must have at least 7 numbers',
      })
      .refine(
        async (val) => {
          if (!val) return true // Skip validation if empty (optional field)
          return await validateIRD(val)
        },
        {
          message: 'Please enter a valid IRD number',
        }
      )
      .optional(),
    individualTaxRate: z.string(),
    isTaxResidentOfCitizenship: z.string(),
    taxResidentTinCountry1: z.string(),
    tinNotProvidedCountry1: z.boolean(),
    noTINReasonCountry1: z.string(),
    isTaxResidentOfResidency: z.string(),
    taxResidentTinCountry2: z.string(),
    tinNotProvidedCountry2: z.boolean(),
    noTINReasonCountry2: z.string(),
    isTaxResidentOfCountry3: z.string(),
    residencyCountry3: z.string(),
    taxResidentTinCountry3: z.string(),
    tinNotProvidedCountry3: z.boolean(),
    noTINReasonCountry3: z.string(),
    aeoiSelfCertified: z.boolean(),
  })
  .superRefine(
    (
      {
        isNzCitizen,
        citizenship,
        isNzResident,
        hasWorkPermit,
        visaStartDate,
        visaExpiryDate,

        individualTaxRate,
        aeoiSelfCertified,
        irdNumber,

        isTaxResidentOfCitizenship,
        taxResidentTinCountry1,
        tinNotProvidedCountry1,
        noTINReasonCountry1,

        isTaxResidentOfCountry3,
        residencyCountry3,
        taxResidentTinCountry3,
        tinNotProvidedCountry3,
        noTINReasonCountry3,
      },
      ctx
    ) => {
      //* Citizenship and Residency
      if (isNzCitizen === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Your citizenship details are required',
          path: ['isNzCitizen'],
        })
      }
      if (isNzCitizen === 'N' && citizenship === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please choose your country of citizenship',
          path: ['citizenship'],
        })
      }

      if (isNzCitizen === 'N' && isNzResident === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Your residency details are required',
          path: ['isNzResident'],
        })
      }

      if (isNzResident === 'N' && isNzCitizen === 'N' && hasWorkPermit === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please confirm if you have a New Zealand work visa',
          path: ['hasWorkPermit'],
        })
      }

      if (
        isNzResident === 'N' &&
        isNzCitizen === 'N' &&
        hasWorkPermit === 'Y' &&
        visaStartDate === undefined
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please provide the start date of your visa',
          path: ['visaStartDate'],
        })
      }

      if (
        isNzResident === 'N' &&
        isNzCitizen === 'N' &&
        hasWorkPermit === 'Y' &&
        visaExpiryDate === undefined
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please provide the expiry date of your visa',
          path: ['visaExpiryDate'],
        })
      }

      if (individualTaxRate === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select your tax rate',
          path: ['individualTaxRate'],
        })
      }

      if (
        individualTaxRate !== 'NDC' &&
        (irdNumber === undefined || irdNumber === '')
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please provide you inland revenue number',
          path: ['irdNumber'],
        })
      }

      if (aeoiSelfCertified === false) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please accept the AEOI declaration',
          path: ['aeoiSelfCertified'],
        })
      }

      //* ----------- Tax validations for country of citizenship --------
      if (
        isTaxResidentOfCitizenship !== 'NZ' &&
        isNzCitizen === 'N' &&
        isTaxResidentOfCitizenship === ''
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please choose an option',
          path: ['isTaxResidentOfCitizenship'],
        })
      }

      if (
        isTaxResidentOfCitizenship === 'Y' &&
        tinNotProvidedCountry1 === false &&
        taxResidentTinCountry1 === ''
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please provide the tax information number',
          path: ['taxResidentTinCountry1'],
        })
      }

      if (tinNotProvidedCountry1 === true && noTINReasonCountry1 === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please provide a reason not having TIN',
          path: ['noTINReasonCountry1'],
        })
      }

      //* ----------- Tax validations for thrid country --------
      if (isTaxResidentOfCountry3 === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please choose an option',
          path: ['isTaxResidentOfCountry3'],
        })
      }

      if (isTaxResidentOfCountry3 === 'Y' && residencyCountry3 === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please choose the country of residency',
          path: ['residencyCountry3'],
        })
      }

      if (
        isTaxResidentOfCountry3 === 'Y' &&
        tinNotProvidedCountry3 === false &&
        taxResidentTinCountry3 === ''
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please provide the tax information number',
          path: ['taxResidentTinCountry3'],
        })
      }

      if (tinNotProvidedCountry3 === true && noTINReasonCountry3 === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please provide a reason not having TIN',
          path: ['noTINReasonCountry3'],
        })
      }
    }
  )

const prelimAndGeneralQns = z.intersection(
  preliminaryQuestionSchema,
  primeFormSchema
)
const step4And5Intersction = z.intersection(employmentSchema, aeoiSchema)
const prelimAndProducts = z.intersection(prelimAndGeneralQns, productsSchema)
const PrelimsAndServices = z.intersection(prelimAndProducts, servicesSchema)

const ServicesAndFinalQns = z.intersection(
  PrelimsAndServices,
  finalQuestionsChema
)

export const membershipFormSchema = z.intersection(
  ServicesAndFinalQns,
  step4And5Intersction
)
