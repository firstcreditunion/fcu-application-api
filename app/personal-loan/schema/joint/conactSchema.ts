import z from 'zod'
import { phoneRegExp } from '@/utils/fomatUtils'

export const jointcontactDetailsSchema = z
  .object({
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

    if (totalContactMethods < 1) {
      // Add error to all contact fields to highlight the requirement
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please provide at least one valid contact methods.',
        path: ['emailAddress'],
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please provide at least one valid contact methods.',
        path: ['mobileNumber'],
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please provide at least one valid contact methods.',
        path: ['workPhoneNumber'],
      })
    }
  })
