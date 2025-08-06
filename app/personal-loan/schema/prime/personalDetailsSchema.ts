import z from 'zod'

export const personalDetailsSchema = z.object({
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
  dependantAdults: z
    .number({
      message: 'Please enter a valid number',
    })
    .nonnegative({ message: 'Please enter a valid number' }),
  dependantChildren: z
    .number({
      message: 'Please enter a valid number',
    })
    .nonnegative({ message: 'Please enter a valid number' }),
})
