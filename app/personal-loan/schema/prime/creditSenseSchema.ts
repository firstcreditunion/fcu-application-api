import { z } from 'zod'

export const creditSenseSchema = z.object({
  external_reference: z.string().optional(),
  app_id: z.string().optional(),
  store_code: z.string().optional(),
  status_code: z.number().optional(),
})
