import { z } from 'zod'

export const preliminaryQuestionSchema = z
  .object({
    isNzCitizen: z.string(),
    citizenship: z.string(),
    isNzResident: z.string(),
    hasWorkPermit: z.string(),
    visaStartDate: z.date().optional(),
    visaExpiryDate: z.date().optional(),
    askFurtherQuestions: z.string(),
    loanPurposeCode: z.string(),
    wasDeclaredBankrupt: z.string(),
    bankruptcyYear: z.string(),
    tradingBranch: z.string().optional(),
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
        askFurtherQuestions,
        loanPurposeCode,
        wasDeclaredBankrupt,
        bankruptcyYear,
      },
      ctx
    ) => {
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
      if (wasDeclaredBankrupt === '' && askFurtherQuestions === 'Y') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please provide your bankruptcy details, if applicable',
          path: ['wasDeclaredBankrupt'],
        })
      }
      if (loanPurposeCode === '' && askFurtherQuestions === 'Y') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please provide your loan purpose',
          path: ['loanPurposeCode'],
        })
      }
      if (
        wasDeclaredBankrupt === 'Y' &&
        bankruptcyYear === '' &&
        askFurtherQuestions === 'Y'
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please choose the year of bankruptcy',
          path: ['bankruptcyYear'],
        })
      }
    }
  )
