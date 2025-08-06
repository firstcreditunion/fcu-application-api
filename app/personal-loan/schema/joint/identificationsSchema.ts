import z from 'zod'

export const jointDriversLicenceSchema = z
  .object({
    licenceType: z.enum(['L', 'R', 'F'], {
      message: 'Please select your licence type',
    }),
    licenceNumber: z
      .string({
        message: 'Please enter your licence number',
      })
      .regex(/^([a-zA-Z][a-zA-Z]\d\d\d\d\d\d*)$/, 'Invalid Drivers Licence'),
    licenceVersion: z
      .string({
        message: 'Please enter your licence number',
      })
      .regex(/^[0-9]*$/, 'Invalid Version Number'),
    licenceIssueDate: z.date().optional(),
    licenceExpiryDate: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    // Only require dates if licenceNumber is not null/undefined/empty
    const hasLicenceNumber =
      data.licenceNumber !== null &&
      data.licenceNumber !== undefined &&
      data.licenceNumber !== ''

    if (hasLicenceNumber) {
      if (!data.licenceIssueDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select your licence issue date',
          path: ['licenceIssueDate'],
        })
      } else if (data.licenceIssueDate > new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Issue date cannot be in the future',
          path: ['licenceIssueDate'],
        })
      }

      if (!data.licenceExpiryDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select your licence expiry date',
          path: ['licenceExpiryDate'],
        })
      } else if (data.licenceExpiryDate < new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Expiry date cannot be in the past',
          path: ['licenceExpiryDate'],
        })
      }
    }
  })

//? ------ Passport ----------

export const issueDateUpperLimitPassport = new Date()
export const issueDateLowerLimitPassport = new Date()
issueDateLowerLimitPassport.setFullYear(
  issueDateLowerLimitPassport.getFullYear() - 10
)

export const jointPassportSchema = z
  .object({
    passportNumber: z
      .string({
        message: 'Please enter your passport number',
      })
      .regex(/^([A-Z]{2}\d{6})$|^([A-Z]{1}\d{7})$/, 'Invalid passport number'),
    passportIssueDate: z.date().optional(),
    passportExpiryDate: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    // Only require dates if licenceNumber is not null/undefined/empty
    const hasPassportNumber =
      data.passportNumber !== null &&
      data.passportNumber !== undefined &&
      data.passportNumber !== ''

    if (hasPassportNumber) {
      if (!data.passportIssueDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select your passport issue date',
          path: ['passportIssueDate'],
        })
      } else if (data.passportIssueDate > new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Issue date cannot be in the future',
          path: ['passportIssueDate'],
        })
      }

      if (!data.passportExpiryDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select your passport expiry date',
          path: ['passportExpiryDate'],
        })
      } else if (data.passportExpiryDate < new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Expiry date cannot be in the past',
          path: ['passportExpiryDate'],
        })
      }
    }

    // passportExpiryDate should not be more than 10 years from passportIssueDate
    if (data.passportIssueDate && data.passportExpiryDate) {
      const maxExpiryDate = new Date(data.passportIssueDate)
      maxExpiryDate.setFullYear(maxExpiryDate.getFullYear() + 10)
      if (data.passportExpiryDate > maxExpiryDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Expiry date cannot be more than 10 years from the issue date',
          path: ['passportExpiryDate'],
        })
      }
    }
  })

//? ------ Fireaems Licence ----------

export const issueDateUpperLimitPassportFirearms = new Date()

export const issueDateLowerLimitPassportFirearms = new Date()
issueDateLowerLimitPassportFirearms.setFullYear(
  issueDateLowerLimitPassportFirearms.getFullYear() - 10
)

export const jointFirearmsLicenceSchema = z
  .object({
    firearmsNumber: z
      .string({
        message: 'Please enter your firearms number',
      })
      .regex(/^([A-Z]{2}\d{6})$|^([A-Z]{1}\d{7})$/, 'Invalid passport number'),
    firearmsIssueDate: z.date().optional(),
    firearmsExpiryDate: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    const hasFirearmsNumber =
      data.firearmsNumber !== null &&
      data.firearmsNumber !== undefined &&
      data.firearmsNumber !== ''

    if (hasFirearmsNumber) {
      if (!data.firearmsIssueDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select your firearms issue date',
          path: ['firearmsIssueDate'],
        })
      } else if (data.firearmsIssueDate > new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Issue date cannot be in the future',
          path: ['firearmsIssueDate'],
        })
      }

      if (!data.firearmsExpiryDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select your firearms expiry date',
          path: ['firearmsExpiryDate'],
        })
      } else if (data.firearmsExpiryDate < new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Expiry date cannot be in the past',
          path: ['firearmsExpiryDate'],
        })
      }
    }

    // passportExpiryDate should not be more than 10 years from passportIssueDate
    if (data.firearmsIssueDate && data.firearmsExpiryDate) {
      const maxExpiryDate = new Date(data.firearmsIssueDate)
      maxExpiryDate.setFullYear(maxExpiryDate.getFullYear() + 10)
      if (data.firearmsExpiryDate > maxExpiryDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Expiry date cannot be more than 10 years from the issue date',
          path: ['firearmsExpiryDate'],
        })
      }
    }
  })

//? ------ Kiwi Access Card ----------

export const issueDateUpperLimitKiwiAccessCard = new Date()

export const issueDateLowerLimitKiwiAccessCard = new Date()
issueDateLowerLimitKiwiAccessCard.setFullYear(
  issueDateLowerLimitKiwiAccessCard.getFullYear() - 10
)

export const jointKiwiAccessCardSchema = z
  .object({
    kiwiAccessCardNumber: z
      .string({
        message: 'Please enter your kiwi access card number',
      })
      .regex(
        /^([a-zA-Z0-9]{1,32})$/,
        'Remove any spaces or special characters'
      ),
    kiwiAccessCardIssueDate: z.date().optional(),
    kiwiAccessCardExpiryDate: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    const hasKiwiAccessCardNumber =
      data.kiwiAccessCardNumber !== null &&
      data.kiwiAccessCardNumber !== undefined &&
      data.kiwiAccessCardNumber !== ''

    if (hasKiwiAccessCardNumber) {
      if (!data.kiwiAccessCardIssueDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select your kiwi access card issue date',
          path: ['kiwiAccessCardIssueDate'],
        })
      } else if (data.kiwiAccessCardIssueDate > new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Issue date cannot be in the future',
          path: ['kiwiAccessCardIssueDate'],
        })
      }

      if (!data.kiwiAccessCardExpiryDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select your kiwi access card expiry date',
          path: ['kiwiAccessCardExpiryDate'],
        })
      } else if (data.kiwiAccessCardExpiryDate < new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Expiry date cannot be in the past',
          path: ['kiwiAccessCardExpiryDate'],
        })
      }
    }

    // passportExpiryDate should not be more than 10 years from passportIssueDate
    if (data.kiwiAccessCardIssueDate && data.kiwiAccessCardExpiryDate) {
      const maxExpiryDate = new Date(data.kiwiAccessCardIssueDate)
      maxExpiryDate.setFullYear(maxExpiryDate.getFullYear() + 10)
      if (data.kiwiAccessCardExpiryDate > maxExpiryDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Expiry date cannot be more than 10 years from the issue date',
          path: ['kiwiAccessCardExpiryDate'],
        })
      }
    }
  })

//? ------ Community Service Card ----------

export const issueDateUpperLimitCommunityServiceCard = new Date()

export const issueDateLowerLimitCommunityServiceCard = new Date()
issueDateLowerLimitCommunityServiceCard.setFullYear(
  issueDateLowerLimitCommunityServiceCard.getFullYear() - 10
)

export const jointCommunityServiceCardSchema = z
  .object({
    communityServiceCardNumber: z
      .string({
        message: 'Please enter your community service card number',
      })
      .regex(
        /^([a-zA-Z0-9]{1,32})$/,
        'Remove any spaces or special characters'
      ),
    communityServiceCardIssueDate: z.date().optional(),
    communityServiceCardExpiryDate: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    const hasCommunityServiceCardNumber =
      data.communityServiceCardNumber !== null &&
      data.communityServiceCardNumber !== undefined &&
      data.communityServiceCardNumber !== ''

    if (hasCommunityServiceCardNumber) {
      if (!data.communityServiceCardIssueDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select your community service card issue date',
          path: ['communityServiceCardIssueDate'],
        })
      } else if (data.communityServiceCardIssueDate > new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Issue date cannot be in the future',
          path: ['communityServiceCardIssueDate'],
        })
      }

      if (!data.communityServiceCardExpiryDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select your community service card expiry date',
          path: ['communityServiceCardExpiryDate'],
        })
      } else if (data.communityServiceCardExpiryDate < new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Expiry date cannot be in the past',
          path: ['communityServiceCardExpiryDate'],
        })
      }
    }
    // passportExpiryDate should not be more than 10 years from passportIssueDate
    if (
      data.communityServiceCardIssueDate &&
      data.communityServiceCardExpiryDate
    ) {
      const maxExpiryDate = new Date(data.communityServiceCardIssueDate)
      maxExpiryDate.setFullYear(maxExpiryDate.getFullYear() + 10)
      if (data.communityServiceCardExpiryDate > maxExpiryDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Expiry date cannot be more than 10 years from the issue date',
          path: ['communityServiceCardExpiryDate'],
        })
      }
    }
  })

//? ------ Birth Certificate ----------

export const jointBirthCertificateSchema = z
  .object({
    birthCertificateRegNo: z
      .string({
        message: 'Please enter your birth certificate number',
      })
      .regex(
        /^([a-zA-Z0-9]{1,32})$/,
        'Remove any spaces or special characters'
      ),
    birthCertificateIssueDate: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    const hasBirthCertificateRegNo =
      data.birthCertificateRegNo !== null &&
      data.birthCertificateRegNo !== undefined &&
      data.birthCertificateRegNo !== ''

    if (hasBirthCertificateRegNo) {
      if (!data.birthCertificateIssueDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select your birth certificate issue date',
          path: ['birthCertificateIssueDate'],
        })
      }
    }
  })
//? ------ Current Student Card ----------

export const issueDateUpperLimitCurrentStudentCard = new Date()

export const issueDateLowerLimitCurrentStudentCard = new Date()
issueDateLowerLimitCurrentStudentCard.setFullYear(
  issueDateLowerLimitCurrentStudentCard.getFullYear() - 10
)

export const jointCurrentStudentCardSchema = z
  .object({
    currentStudentCardNumber: z
      .string({
        message: 'Please enter your current student card number',
      })
      .regex(
        /^([a-zA-Z0-9]{1,32})$/,
        'Remove any spaces or special characters'
      ),
    currentStudentCardIssueDate: z.date().optional(),
    currentStudentCardExpiryDate: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    const hasCurrentStudentCardNumber =
      data.currentStudentCardNumber !== null &&
      data.currentStudentCardNumber !== undefined &&
      data.currentStudentCardNumber !== ''

    if (hasCurrentStudentCardNumber) {
      if (!data.currentStudentCardIssueDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select your current student card issue date',
          path: ['currentStudentCardIssueDate'],
        })
      } else if (data.currentStudentCardIssueDate > new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Issue date cannot be in the future',
          path: ['currentStudentCardIssueDate'],
        })
      }

      if (!data.currentStudentCardExpiryDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select your current student card expiry date',
          path: ['currentStudentCardExpiryDate'],
        })
      } else if (data.currentStudentCardExpiryDate < new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Expiry date cannot be in the past',
          path: ['currentStudentCardExpiryDate'],
        })
      }
    }
    // passportExpiryDate should not be more than 10 years from passportIssueDate
    if (data.currentStudentCardIssueDate && data.currentStudentCardExpiryDate) {
      const maxExpiryDate = new Date(data.currentStudentCardIssueDate)
      maxExpiryDate.setFullYear(maxExpiryDate.getFullYear() + 10)
      if (data.currentStudentCardExpiryDate > maxExpiryDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Expiry date cannot be more than 10 years from the issue date',
          path: ['currentStudentCardExpiryDate'],
        })
      }
    }
  })

//? ------ Gold Card ----------

export const issueDateUpperLimitGoldCard = new Date()

export const jointGoldCardSchema = z
  .object({
    goldCardNumber: z
      .string({
        message: 'Please enter your gold card number',
      })
      .regex(
        /^([a-zA-Z0-9]{1,32})$/,
        'Remove any spaces or special characters'
      ),
    goldCardIssueDate: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    const hasGoldCardNumber =
      data.goldCardNumber !== null &&
      data.goldCardNumber !== undefined &&
      data.goldCardNumber !== ''

    if (hasGoldCardNumber) {
      if (!data.goldCardIssueDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select your gold card issue date',
          path: ['goldCardIssueDate'],
        })
      }
    }
  })
