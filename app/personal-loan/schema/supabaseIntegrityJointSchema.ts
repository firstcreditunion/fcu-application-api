import { z } from 'zod'

export const supabaseIntegritySchemaJoint = z.object({
  loan_application_number: z.number(),
  membership_application_number: z.number(),
  portal_client_number: z.number().nullable(),

  //? Personal Detials
  jointClientPersonalDetailsUID: z.number(),

  //? Work Visa
  jointClientWorkVisaDetailsUniqueID: z.number(),

  //? Bankrupty
  jointClientBankruptcyUID: z.number(),

  //? Client Extension
  jointClientExtensionUniqueID: z.number(),

  //? Identifications
  jointDriversLicenceUniqueID: z.string().nullable(),
  jointPassportUniqueID: z.string().nullable(),
  jointFirearmsLicenceUniqueID: z.string().nullable(),
  jointBirthCertificateUniqueID: z.string().nullable(),
  jointKiwiAccessCardUniqueID: z.string().nullable(),
  jointCommunityServiceCardUniqueID: z.string().nullable(),
  jointGoldCardUniqueID: z.string().nullable(),
  jointStudentIDUniqueID: z.string().nullable(),

  //? Email
  jointEmailUniqueID: z.number().nullable(),
  emailVerificationCompleted: z.boolean().nullable(),
  emailVerificationMetadata: z.string().nullable(),

  //? Phone numbers
  jointClientMobileUniqueID: z.number().nullable(),
  mobileVerificationCompleted: z.boolean().nullable(),
  mobileVerificationMetadata: z.string().nullable(),
  sov_mobileNetwork: z.string().nullable(),
  sov_mobileNumber: z.string().nullable(),
  sov_mobileCallingCode: z.string().nullable(),

  //? Work Phone
  jointClientWorkPhoneUniqueID: z.number().nullable(),
  workPhoneVerificationCompleted: z.boolean().nullable(),
  phoneVerificationMetadata: z.string().nullable(),
  sov_workNetwork: z.string().nullable(),
  sov_workNumber: z.string().nullable(),
  sov_workCallingCode: z.string().nullable(),

  //? Residential Address
  jointResidentialAddressUniqueID: z.number(),
  residentialAddressVerificationCompleted: z.boolean().nullable(),
  residentialAddressMetadata: z.string().nullable(),

  //? Mailing Address
  jointMailingAddressUniqueID: z.number().nullable(),
  mailingAddressVerificationCompleted: z.boolean().nullable(),
  mailingAddressMetadata: z.string().nullable(),

  //? Employment
  jointEmploymentUniqueID: z.number(),

  //? Benefits
  jointBenefitsUniqueID: z.number().nullable(),

  //? Benefits Details
  jointBenefitDetailsUniqueID: z.number().nullable(),

  // ? Retirement
  jointRetirementUniqueID: z.number().nullable(),

  //? Unemployment
  jointClientUnemploymentUniqueID: z.number().nullable(),

  //? Part-time student
  jointClienPartTimeStudentUniqueID: z.number(),

  //? Full-fime Student
  jointClienFullTimeStudentUniqueID: z.number(),

  //? Schools and Tertiary Institutions
  jointClientSchoolOrTertiaryInstitutionUniqueID: z.number().nullable(),

  //? Income
  jointClientIncomeUniqueID: z.number().nullable(),

  //? Tax Status
  jointClientTaxStatusUniqueID: z.number(),

  //? Citizenship Country 1 (excl. New Zealand)
  jointClientCitizenshipTaxUniqueID: z.number(),

  //? Citizenship Country 2 (excl. New Zealand)
  jointClientNonResidentTaxUniqueID: z.number(),

  //? Services
  servicesForClientUniqueID: z.number(),

  //? CRM Detials
  jointCRMContactUniqueID: z.string(),

  jointClientRecordInserted: z.boolean(),

  jointInserted: z.boolean().optional(),
})
