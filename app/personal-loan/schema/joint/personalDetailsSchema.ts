import z from 'zod'

export const jointPersonalDetailsSchema = z
  .object({
    title: z.enum(['Mr', 'Mrs', 'Miss', 'Ms'], {
      message: 'Please select your title',
    }),
    firstName: z
      .string({
        message: 'First name is required',
      })
      .trim()
      .min(1, {
        message: 'First name is required',
      }),
    middleName: z.string().trim().optional(),
    lastName: z
      .string({
        message: 'Last name is required',
      })
      .trim()
      .min(1, {
        message: 'Last name is required',
      }),
    gender: z.string({
      message: 'Please select your gender.',
    }),
    maritalStatus: z.string({
      message: 'Please select your marital status.',
    }),
    dateOfBirth: z
      .date({
        message: 'Please select your date of birth',
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
      .min(0, { message: 'Please enter a number between 0 and 9' })
      .max(9, { message: 'Please enter a number between 0 and 9' }),
    dependantChildren: z
      .number({
        message: 'Please enter a valid number',
      })
      .min(0, { message: 'Please enter a number between 0 and 9' })
      .max(9, { message: 'Please enter a number between 0 and 9' }),
  })
  .refine(
    (data) => {
      // If title is Mr, gender must be M (Male)
      if (data.title === 'Mr' && data.gender === 'F') {
        return false
      }
      // If title is Mrs, Miss, or Ms, gender must be F (Female)
      if (['Mrs', 'Miss', 'Ms'].includes(data.title) && data.gender === 'M') {
        return false
      }
      return true
    },
    {
      message: 'Title is inconsistent with gender',
      path: ['gender'], // This will show the error on the gender field
    }
  )
  .refine(
    (data) => {
      // If gender is M (Male), title must be Mr
      if (data.gender === 'M' && data.title !== 'Mr') {
        return false
      }
      // If gender is F (Female), title must be Mrs, Miss, or Ms
      if (data.gender === 'F' && data.title === 'Mr') {
        return false
      }
      return true
    },
    {
      message: 'Title is inconsistent with gender',
      path: ['title'], // This will show the error on the title field
    }
  )
