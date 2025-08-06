import { z } from 'zod'

export const employmentsToExclude = ['BNF', 'UEM', 'RTD', 'STP', 'STU'] // C1 & C2
export const employmentsToExcludeForIncome = ['BNF', 'UEM', 'RTD'] // C2

export const employmentSchema = z
  .object({
    employmentType: z
      .string({
        message: 'Please choose your employment type',
      })
      .min(1, {
        message: 'Please choose an employment type',
      }),
    schoolorTertiaryInst: z.string(),
    occupation: z.string().or(z.literal('')),
    employerName: z.string().or(z.literal('')),
    typeOfBenefit: z.array(z.string()),
    incomeFrequency: z.string().optional(),
    netIncome: z.string().optional(),
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
        !employmentsToExclude.includes(employmentType) &&
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
        !employmentsToExclude.includes(employmentType) &&
        netIncome === ''
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please provide your net income',
          path: ['netIncome'],
        })
      }

      if (
        !employmentsToExclude.includes(employmentType) &&
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
