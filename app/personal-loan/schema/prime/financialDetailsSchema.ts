import { z } from 'zod'

export const financialDetialsSchema = z.object({
  product: z.string(),
  costOfGoods: z
    .string({
      message: 'Costing loan amount is required',
    })
    .refine((val) => !isNaN(Number(val.replace(/,/g, ''))), {
      message: 'Invalid number',
    })
    .refine((val) => !(val.trim() === ''), {
      message: 'Existing loan amount is required',
    })
    .refine((val) => !(Number(val.replace(/,/g, '')) > 999999999), {
      message: 'Number is too large',
    }),
  premiumAmount: z.number().optional(),
  defaultFees: z.boolean(),
  needCreditCareInsurance: z.string().optional(),
  component: z.string().optional(),
  coverType: z.string().optional(),
  fees: z.array(z.string()),
  Loan_Term_1: z.number().min(6).max(84),
  Loan_Term_2: z.string().nullable(),
  paymentFrequency: z.string({
    message: 'Frequency is required',
  }),

  start_Date: z.string(),
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
})
