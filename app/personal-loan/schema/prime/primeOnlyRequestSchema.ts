import { z } from 'zod'
import { contactDetailsSchema } from './conactSchema'
import { employmentSchema } from './employment'
import { financialDetialsSchema } from './financialDetailsSchema'
import {
  birthCertificateSchema,
  communityServiceCardSchema,
  currentStudentCardSchema,
  driversLicenceSchema,
  firearmsLicenceSchema,
  goldCardSchema,
  kiwiAccessCardSchema,
  passportSchema,
} from './identificationsSchema'
import { personalDetailsSchema } from './personalDetailsSchema'
import { preliminaryQuestionSchema } from './preliminaryQuestionsSchema'
import { securitySchema } from './securitySchema'
import { row_tblProvidentInsuranceCoverTypes } from '@/types/supabase/insurance/row'

// Supabase integrity state schema
export const supabaseIntegrityStateSchema = z
  .object({
    primeClientMobileUniqueID: z.number().nullable().optional(),
    mobileVerificationCompleted: z.boolean().optional(),
    primeClientWorkPhoneUniqueID: z.number().nullable().optional(),
    workPhoneVerificationCompleted: z.boolean().optional(),
    primeEmailUniqueID: z.number().nullable().optional(),
    emailVerificationCompleted: z.boolean().optional(),
    primeResidentialAddressUniqueID: z.number().nullable().optional(),
    residentialAddressVerificationCompleted: z.boolean().optional(),
    primeMailingAddressUniqueID: z.number().nullable().optional(),
    mailingAddressVerificationCompleted: z.boolean().optional(),
  })
  .optional()

// Comprehensive request body schema
export const primeOnlyRequestBodySchema = z.object({
  // Core application identifiers
  loanApplicationNumber: z.number(),
  primeClientNumber: z.number(),

  // Supabase integrity state
  supabaseIntegrityState: supabaseIntegrityStateSchema,

  // Form sections
  primePreliminaryQuestions: preliminaryQuestionSchema.optional(),
  primeDriversLicence: driversLicenceSchema.optional(),
  primePassport: passportSchema.optional(),
  primeFirearmsLicence: firearmsLicenceSchema.optional(),
  primeBirthCertificate: birthCertificateSchema.optional(),
  primeKiwiAccessCard: kiwiAccessCardSchema.optional(),
  primeCommunityServiceCard: communityServiceCardSchema.optional(),
  goldCard: goldCardSchema.optional(),
  studentID: currentStudentCardSchema.optional(),
  primePersonalDetails: personalDetailsSchema.optional(),
  primeEmployment: employmentSchema.optional(),
  primeContactDetails: contactDetailsSchema.optional(),
  formFinancialDetails: financialDetialsSchema.optional(),
  vehicleSecurity: securitySchema.optional(),

  // Insurance (using the existing type you had)
  providentInsurance: z
    .array(z.custom<typeof row_tblProvidentInsuranceCoverTypes>())
    .optional(),
})

// Export the inferred type
export type PrimeOnlyRequestBody = z.infer<typeof primeOnlyRequestBodySchema>
