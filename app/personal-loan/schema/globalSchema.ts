import { z } from 'zod'

export const globalApplicationSchema = z.object({
  privacyDeclarationComplete: z.boolean(),
  isJointApplication: z.string(),
  loanApplicationNumber: z.number(),
  primeApplicantNumber: z.number(),
  jointApplicantNumber: z.number().optional(),
})
