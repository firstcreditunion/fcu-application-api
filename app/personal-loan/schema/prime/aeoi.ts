import { validateIRD } from '@/utils/validateInlandRevenueNumber'
import { z } from 'zod'

export const aeoiSchema = z
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
