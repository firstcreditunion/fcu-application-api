import z from 'zod'

export const securitySchema = z
  .object({
    provideVehicleAsLoanSecurity: z
      .enum(['Y', 'N'], {
        required_error:
          'Please select if you want to provide vehicle as loan security',
      })
      .optional(),
    haveYouPurchasedVehicle: z
      .enum(['Y', 'N'], {
        required_error: 'Please select if you have purchased the vehicle',
      })
      .optional(),
    vehicleRegistrationNumber: z.string().optional(),
    isVehicleInsured: z
      .enum(['Y', 'N'], {
        required_error: 'Please select if the vehicle is in your name',
      })
      .optional(),
    nameOfInsurer: z.string().optional(),
  })
  .superRefine(
    (
      {
        provideVehicleAsLoanSecurity,
        haveYouPurchasedVehicle,
        isVehicleInsured,
        nameOfInsurer,
      },
      ctx
    ) => {
      if (provideVehicleAsLoanSecurity === 'Y' && !haveYouPurchasedVehicle) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select if you have purchased the vehicle',
          path: ['haveYouPurchasedVehicle'],
        })
      }

      if (
        isVehicleInsured === 'Y' &&
        (!nameOfInsurer || nameOfInsurer.trim() === '')
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter the name of the insurer',
          path: ['nameOfInsurer'],
        })
      }
    }
  )
