import { z } from 'zod'

export const employmentsToExclude = ['BNF', 'UEM', 'RTD', 'STP', 'STU'] // C1 & C2
export const employmentsToExcludeForIncome = ['BNF', 'UEM', 'RTD'] // C2

export const jointEmploymentSchema = z
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
    employerName: z
      .string()
      .max(50, { message: 'Employer name must be less than 50 characters' })
      .or(z.literal('')),
    typeOfBenefit: z.array(z.string()),
    incomeFrequency: z.string().optional(),
    netIncome: z.string().optional(),
    exceptionEmpMonth: z.string(),
    expceptionEmpYear: z.string(),
  })
  .superRefine(
    (
      {
        employmentType,
        occupation,
        employerName,
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
          code: 'custom',
          message: 'Please select your occupation',
          path: ['occupation'],
        })
      }
      if (
        !employmentsToExclude.includes(employmentType) &&
        employerName === ''
      ) {
        ctx.addIssue({
          code: 'custom',
          message: 'The name of your employer is required',
          path: ['employerName'],
        })
      }

      if (exceptionEmpMonth === '') {
        ctx.addIssue({
          code: 'custom',
          message: 'Please select the month',
          path: ['exceptionEmpMonth'],
        })
      }

      if (expceptionEmpYear === '') {
        ctx.addIssue({
          code: 'custom',
          message: 'Please select the year',
          path: ['expceptionEmpYear'],
        })
      }

      if (
        (employmentType === 'STP' || employmentType === 'STU') &&
        schoolorTertiaryInst === ''
      ) {
        ctx.addIssue({
          code: 'custom',
          message: 'Please choose a school or a tertiary institution',
          path: ['schoolorTertiaryInst'],
        })
      }

      if (employmentType === 'BNF' && typeOfBenefit.length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Please choose the type of benefit',
          path: ['typeOfBenefit'],
        })
      }

      if (
        //C2 only
        !employmentsToExcludeForIncome.includes(employmentType) &&
        incomeFrequency === ''
      ) {
        ctx.addIssue({
          code: 'custom',
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
          code: 'custom',
          message: 'Please provide your net income',
          path: ['netIncome'],
        })
      }

      if (
        !employmentsToExcludeForIncome.includes(employmentType) &&
        Number(netIncome) <= 0
      ) {
        ctx.addIssue({
          code: 'custom',
          message: 'Net income must be greater than $0',
          path: ['netIncome'],
        })
      }
    }
  )
