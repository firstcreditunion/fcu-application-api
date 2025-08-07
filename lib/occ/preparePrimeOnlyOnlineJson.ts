'use server'

import {
  Fee,
  Insurance,
  InterestRateStructure,
  PurchasePrice,
} from '@/types/occ/applicationTypes'
import {
  DraftFinancialDetail,
  MaxDraftApplicationDetail_OCCTEST,
  //   MaxDraftApplicationDetail_OCCTEST,
} from '@/types/occ/draftApplicationTypes'
import { row_tblProvidentInsuranceCoverTypes } from '@/types/supabase/insurance/row'

import z from 'zod'
import { preliminaryQuestionSchema } from '@/app/personal-loan/schema/prime/preliminaryQuestionsSchema'

import { format, differenceInYears } from 'date-fns'

import { securitySchema } from '@/app/personal-loan/schema/prime/securitySchema'
import { personalDetailsSchema } from '@/app/personal-loan/schema/prime/personalDetailsSchema'
import { employmentSchema } from '@/app/personal-loan/schema/prime/employment'
import { contactDetailsSchema } from '@/app/personal-loan/schema/prime/conactSchema'
import {
  birthCertificateSchema,
  communityServiceCardSchema,
  currentStudentCardSchema,
  driversLicenceSchema,
  firearmsLicenceSchema,
  goldCardSchema,
  kiwiAccessCardSchema,
  passportSchema,
} from '@/app/personal-loan/schema/prime/identificationsSchema'
import { countries, accommodation } from '@/lib/constants'
import { financialDetialsSchema } from '@/app/personal-loan/schema/prime/financialDetailsSchema'
import { parseFloatFromCurrency } from '@/utils/numberFormatting'
import {
  genderLookup,
  loanPurposeCodesFallback,
  maritalStatusOptions,
  occupationCodes,
} from '@/utils/constants'
import { buildClientIdentifications } from '@/utils/globalUtils'
import { supabaseIntegritySchemaPrime } from '@/app/personal-loan/schema/supabaseIntegrityPrimeSchema'
import { tblClientPhone } from '../supabase/membership/select'

const employmentTypes = [
  { idx: 0, type: 'BNF', desc: 'Beneficiary', emp_details_required: false },
  { idx: 1, type: 'CAS', desc: 'Casual', emp_details_required: true },
  { idx: 2, type: 'CONS', desc: 'Consultant', emp_details_required: true },
  { idx: 3, type: 'CONT', desc: 'Contractor', emp_details_required: true },
  {
    idx: 4,
    type: 'FREE',
    desc: 'Freelance Employment',
    emp_details_required: true,
  },
  {
    idx: 5,
    type: 'FTM',
    desc: 'Full Time Employment',
    emp_details_required: true,
  },
  {
    idx: 6,
    type: 'PTM',
    desc: 'Part Time Employment',
    emp_details_required: true,
  },
  { idx: 7, type: 'RTD', desc: 'Retired', emp_details_required: false },
  {
    idx: 8,
    type: 'SEAS',
    desc: 'Seasonal Employment',
    emp_details_required: false,
  },
  { idx: 9, type: 'SEM', desc: 'Self Employed', emp_details_required: false },
  {
    idx: 10,
    type: 'STP',
    desc: 'I am a Part-Time Student',
    emp_details_required: null,
  },
  {
    idx: 11,
    type: 'STU',
    desc: 'I am a Full-Time Student',
    emp_details_required: null,
  },
  {
    idx: 12,
    type: 'TMP',
    desc: 'Temporary Employment',
    emp_details_required: true,
  },
  { idx: 13, type: 'UEM', desc: 'Unemployed', emp_details_required: false },
]

type primeOnlineJsonProps = {
  supabaseIntegrityState: z.infer<typeof supabaseIntegritySchemaPrime>
  primePreliminaryQuestions: z.infer<typeof preliminaryQuestionSchema>
  primePersonalDetails: z.infer<typeof personalDetailsSchema>
  primeEmployment: z.infer<typeof employmentSchema>
  primeContactDetails: z.infer<typeof contactDetailsSchema>
  primeDriversLicence: z.infer<typeof driversLicenceSchema>
  primePassport: z.infer<typeof passportSchema>
  primeFirearmsLicence: z.infer<typeof firearmsLicenceSchema>
  primeBirthCertificate: z.infer<typeof birthCertificateSchema>
  primeKiwiAccessCard: z.infer<typeof kiwiAccessCardSchema>
  primeCommunityServiceCard: z.infer<typeof communityServiceCardSchema>
  primegoldCard: z.infer<typeof goldCardSchema>
  primestudentID: z.infer<typeof currentStudentCardSchema>
  formFinancialDetails: z.infer<typeof financialDetialsSchema>
  vehicleSecurity: z.infer<typeof securitySchema>
  providentInsurance: (typeof row_tblProvidentInsuranceCoverTypes)[]
}

export async function preparePrimeOnlineJson({
  supabaseIntegrityState,
  primePreliminaryQuestions,
  primeDriversLicence,
  primePassport,
  primeFirearmsLicence,
  primeBirthCertificate,
  primeKiwiAccessCard,
  primeCommunityServiceCard,
  primegoldCard,
  primestudentID,
  primePersonalDetails,
  primeEmployment,
  primeContactDetails,

  formFinancialDetails,
  vehicleSecurity,
  providentInsurance,
}: primeOnlineJsonProps) {
  const primeMobileUUID = supabaseIntegrityState.primeClientMobileUniqueID
  const primeWorkPhoneUUID = supabaseIntegrityState.primeClientWorkPhoneUniqueID

  let mobileVerificationDetails = undefined

  if (primeMobileUUID) {
    mobileVerificationDetails = await tblClientPhone(primeMobileUUID)
  }

  let workPhoneVerificationDetails = undefined

  if (primeWorkPhoneUUID) {
    workPhoneVerificationDetails = await tblClientPhone(primeWorkPhoneUUID)
  }

  const purchasePrice: PurchasePrice = {
    accessories: 0,
    retailPrice: parseFloatFromCurrency(formFinancialDetails.costOfGoods),
    total: parseFloatFromCurrency(formFinancialDetails.costOfGoods),
    lct: 0,
  }

  const fees: Fee[] = [
    {
      amount: 4.6,
      capitalised: 'Y',
      code: 'LCRFA',
      gstAmount: 0,
      seq: '1',
    },
    {
      amount: 3.4,
      capitalised: 'Y',
      code: 'LCRFB',
      gstAmount: 0,
      seq: '1',
    },
    {
      amount: 3,
      capitalised: 'Y',
      code: 'LCRFC',
      gstAmount: 0,
      seq: '1',
    },
    {
      amount: 0.25,
      capitalised: 'Y',
      code: 'LCRFD',
      gstAmount: 0,
      seq: '1',
    },
    {
      amount: 4.5,
      capitalised: 'Y',
      code: 'LCRFE',
      gstAmount: 0,
      seq: '1',
    },
    {
      amount: 2.72,
      capitalised: 'Y',
      code: 'LCRFF',
      gstAmount: 0,
      seq: '1',
    },
    {
      amount: 8.05,
      capitalised: 'Y',
      code: 'LCRFG',
      gstAmount: 0,
      seq: '1',
    },
  ]

  const insuranceOption = providentInsurance.filter(
    (insurance) =>
      insurance.lambda_code_component === formFinancialDetails.coverType &&
      insurance.cover_type === formFinancialDetails.component
  )?.[0]?.g3_insurance_cover_type

  console.log('insuranceOption: ', insuranceOption)

  const bothInsuranceFieldsExist =
    formFinancialDetails.coverType !== null &&
    formFinancialDetails.coverType !== undefined &&
    formFinancialDetails.component !== null &&
    formFinancialDetails.component !== undefined

  console.log('Full Financial Form Details: ', formFinancialDetails)

  console.log('bothInsuranceFieldsExist: ', bothInsuranceFieldsExist)

  console.log(
    'formFinancialDetails.needCreditCareInsurance : ',
    formFinancialDetails.needCreditCareInsurance
  )

  const insurances: Insurance[] =
    formFinancialDetails.needCreditCareInsurance === 'Yes' &&
    bothInsuranceFieldsExist
      ? [
          {
            insuranceType: 'CCI1',
            insuranceOption: insuranceOption,
            premium: formFinancialDetails.premiumAmount ?? 0,
            externalSystemReference: 'ONL_kjmNWvoESz_provident',
            policyNumber: '',
            jointCover: '',
            policyDescription: `Provident CCI ${insuranceOption}`,
            sumInsured: parseFloatFromCurrency(
              formFinancialDetails.costOfGoods
            ),
            surrenderValue: 0,
            commencementDate: '2025-04-27T00:00:00Z',
            term: {
              unit: 'M',
              value: formFinancialDetails.Loan_Term_1,
            },
            gstOnPremium: 0,
            standardExcess: 0,
            excessCharged: 0,
            seq: '1',
          },
        ]
      : []

  const interestRateStructure: InterestRateStructure = {
    initialRate: {
      rateType: 'VARIABLE',
      baseRate: 'PL',
      margin: 0,
    },
  }

  const financialDetails: DraftFinancialDetail[] = [
    {
      advance: 'N',
      balloonAmount: 0,
      balloonPercent: 0,
      commissionAmount: 0,
      deposit: {
        bond: 0,
        cashRefund: 0,
        depositAmount: 0,
        payoutAmount: 0,
        tradeInAmount: 0,
      },
      fees: {
        capitalised: 0,
        fee: fees,
        nonCapitalised: 0,
        refresh: 'Y',
      },
      insurances: {
        insurance: insurances,
      },
      interestRateStructure: interestRateStructure,
      paymentFrequencyType: {
        code: formFinancialDetails.paymentFrequency,
        description:
          formFinancialDetails.paymentFrequency === 'W'
            ? 'WEEKLY'
            : formFinancialDetails.paymentFrequency === 'F'
            ? 'FORTNIGHTLY'
            : 'MONTHLY',
      },
      paymentFrequencyUnit: 1,
      paymentMethod: {
        paymentMethod: 'AUTOPAY',
      },
      product: 'PERN',
      purchasePrice: purchasePrice,
      reapplyDefaults: null,
      residualValue: 0,
      seq: '1',
      settlementDate: '2025-04-27T00:00:00Z',
      signatureDate: '2025-04-27T00:00:00Z',
      taxTreatment: null,
      term: formFinancialDetails.Loan_Term_1,
      termType: 'M',
      valueOfAdvInstalment: 0,
    },
  ]

  const loanPurposeCode = loanPurposeCodesFallback.filter(
    (item) =>
      item.loan_purpose_sub_code === primePreliminaryQuestions.loanPurposeCode
  )[0].loan_purpose_sub_code

  const originator = {
    clientNumber: '0003000100',
    value: '0003000100',
  }

  const openingBranch = {
    value: 'VIR',
    unitType: 'B',
    unitId: 'VIR',
  }

  const hasVehicleSecurity =
    vehicleSecurity.vehicleRegistrationNumber !== undefined &&
    vehicleSecurity.vehicleRegistrationNumber !== null &&
    vehicleSecurity.vehicleRegistrationNumber !== ''

  const assosiatedClients = {
    data: [
      {
        id: '0001022184',
        type: 'associatedClients',
      },
    ],
  }

  const securities = {
    data: hasVehicleSecurity
      ? [
          {
            type: 'securities',
            id: '0000299612',
          },
        ]
      : [],
  }

  const relationships = {
    associatedClients: assosiatedClients,
    securities: securities,
  }

  const gender = genderLookup.find(
    (item) => item.key === primePersonalDetails.gender
  )?.value

  const dateOfBirth = format(
    new Date(primePersonalDetails.dateOfBirth),
    'yyyy-MM-dd'
  )

  const maritalStatus = maritalStatusOptions.find(
    (item) => item.key === primePersonalDetails.maritalStatus
  )?.key

  const countryOfResidenceIsNZ =
    primePreliminaryQuestions.isNzCitizen === 'Y' ||
    primePreliminaryQuestions.isNzResident === 'Y' ||
    primePreliminaryQuestions.hasWorkPermit === 'Y'

  // Calculate years since residential effective date
  const yearsSinceResidential = differenceInYears(
    new Date(),
    primeContactDetails.residentialEffectiveDate
  )

  // Select accommodation based on type and years
  const getAccommodationDetails = () => {
    const accommodationType = primeContactDetails.accommodationType

    if (accommodationType === 'OWN')
      return accommodation.find((item) => item.code === 'OWN')

    if (accommodationType === 'BOARD')
      return accommodation.find((item) => item.code === 'BRD')

    if (accommodationType === 'RENT') {
      // For renting, choose based on years
      return yearsSinceResidential >= 2
        ? accommodation.find((item) => item.code === 'RNTX') // Renting more than 2 years
        : accommodation.find((item) => item.code === 'RNT2') // Renting less than 2 years
    }

    // Default fallback
    return accommodation.find((item) => item.code === 'OWN')
  }

  const accommodationDetails = getAccommodationDetails()

  const generalDetails = {
    externalSystemReference: '',
    clientType: 'I',
    status: {
      code: 'A',
    },
    gna: 'N',
    existingClient: 'Y',
    defaultManager: '0000148335',
    individualDetails: {
      title: primePersonalDetails.title,
      forename: primePersonalDetails.middleName
        ? primePersonalDetails.firstName + ' ' + primePersonalDetails.middleName
        : primePersonalDetails.firstName,
      surname: primePersonalDetails.lastName,
      clientOtherNamesExist: 'N',
      gender: gender,
      dateOfBirth: dateOfBirth,
      dateOfBirthRefused: 'N',
      maritalStatus: maritalStatus,
      countryOfResidence: countryOfResidenceIsNZ ? 'NZ' : null,
      countryOfCitizenship:
        primePreliminaryQuestions.isNzCitizen === 'Y'
          ? 'NZ'
          : countries.filter(
              (country) =>
                country.code === primePreliminaryQuestions.citizenship
            )[0].code,
      numberOfDependants: primePersonalDetails.dependantChildren.toString(),
      numberOfAdults: primePersonalDetails.dependantAdults.toString(),
      accommodation: {
        code: accommodationDetails ? accommodationDetails.code : 'OWN',
        description: accommodationDetails
          ? accommodationDetails.description
          : 'Own with Mortgage',
      },
      resident: countryOfResidenceIsNZ ? 'Y' : 'N',
      smoker: 'N',
    },
  }

  const clientIdentificationProvided = await buildClientIdentifications({
    DriversLicence: primeDriversLicence,
    Passport: primePassport,
    FirearmsLicence: primeFirearmsLicence,
    BirthCertificate: primeBirthCertificate,
    KiwiAccessCard: primeKiwiAccessCard,
    CommunityServiceCard: primeCommunityServiceCard,
    goldCard: primegoldCard,
    studentID: primestudentID,
  })

  const primeEmailExists =
    primeContactDetails.emailAddress !== undefined &&
    primeContactDetails.emailAddress !== null &&
    primeContactDetails.emailAddress !== ''

  const primeEmploymentExists =
    primeEmployment.employmentType !== null &&
    primeEmployment.employmentType !== undefined &&
    primeEmployment.employmentType !== ''

  const included: unknown[] = []

  const primeBorrowerAssosiatedClients = {
    type: 'associatedClients',
    id: '0001022184',
    attributes: {
      role: 'PRIMEB',
      seq: '1',
      signatureRequired: 'M',
      creditCheckAuthorised: 'N',
      order: '1',
      clientReference: null,
      clientMaint: {
        clientID: '0001022184',
        generalDetails: generalDetails,
        clientIdentifications: clientIdentificationProvided,
        contactDetails: {
          address: [],
          phone:
            workPhoneVerificationDetails &&
            workPhoneVerificationDetails?.length > 0
              ? [
                  {
                    countryCode: workPhoneVerificationDetails[0].calling_code,
                    networkCode: workPhoneVerificationDetails[0].sov_stdCode,
                    number: workPhoneVerificationDetails[0].sov_number,
                    preferredMethod: 'N',
                    effectiveDate: `${format(
                      new Date(),
                      'yyyy-MM-dd'
                    )}T00:00:00Z`,
                    type: 'MB',
                    seq: '1',
                  },
                ]
              : [],
          mobile:
            mobileVerificationDetails && mobileVerificationDetails?.length > 0
              ? [
                  {
                    countryCode: mobileVerificationDetails[0].calling_code,
                    networkCode: mobileVerificationDetails[0].sov_networkCode,
                    number: mobileVerificationDetails[0].sov_number,
                    preferredMethod: 'N',
                    effectiveDate: `${format(
                      new Date(),
                      'yyyy-MM-dd'
                    )}T00:00:00Z`,
                    type: 'MB',
                    seq: '1',
                  },
                ]
              : [],
          email: primeEmailExists
            ? [
                {
                  address: primeContactDetails.emailAddress,
                  preferredMethod: 'Y',
                  effectiveDate: `${format(
                    new Date(),
                    'yyyy-MM-dd'
                  )}T00:00:00Z`,
                  type: 'HM',
                  seq: '1',
                },
              ]
            : [],
        },
        employmentDetails: primeEmploymentExists
          ? [
              {
                employmentType: {
                  type: employmentTypes.filter(
                    (item) => item.type === primeEmployment.employmentType
                  )[0]?.type,
                  description: primeEmployment.employmentType
                    ? employmentTypes.filter(
                        (item) => item.type === primeEmployment.employmentType
                      )[0]?.desc
                    : '',
                },
                occupation: primeEmployment.occupation
                  ? occupationCodes.filter(
                      (item) =>
                        item.activity_code === primeEmployment.occupation
                    )[0]?.sov_activity_code
                  : '',
                jobDescription: primeEmployment.occupation
                  ? occupationCodes.filter(
                      (item) =>
                        item.activity_code === primeEmployment.occupation
                    )[0].activity_name
                  : '',
                employerName: primeEmployment.employerName
                  ? primeEmployment.employerName
                  : '',
                effectiveDate: primeEmployment.employmentEffctiveDate,
                seq: '1',
              },
            ]
          : [],
        clientCapacity: {
          capacityAssessment: {
            anyExpectedChanges: 'Y',
            changeDetails: 'N',
            assessmentQuestionsAsked: 'Y',
            selfDeclarationAccepted: 'Y',
          },
          joint: 'N',
          assets: [],
          liabilities: [],
          incomes: [],
          expenses: [],
        },
        mode: 'Add',
      },
    },
  }

  included?.push(primeBorrowerAssosiatedClients)

  if (hasVehicleSecurity) {
    included?.push({
      type: 'securities',
      id: '0000299612',
      attributes: {
        seq: '1',
        accountSecurity: {
          primaryCollateral: 'P',
          effectiveDate: '2025-04-28T00:00:00Z',
          clientSecurityRelationship: 'O',
        },
        asset: {
          assetType: 'S',
          classificationCode: 'VEHI',
          securityPercentageToUse: '100',
          condition: {
            code: 'U',
            description: '',
          },
          securityStatus: {
            code: 'C',
            description: '',
          },
        },
        vehicleMaint: {
          assetExtras: [],
          vehicle: {
            value: '0000000000',
            refType: 'ASSIGN',
          },
          vehicleDetails: {
            externalSystemReference: '',
            make: '',
            model: '',
            registrationYear: '',
            colour: '',
            nonStandardVehicle: {
              code: 'Y',
              description: '',
            },
            registrationNumber: vehicleSecurity.vehicleRegistrationNumber ?? '',
            odometer: '0',
          },
        },
      },
    })
  }

  const onlineJson: MaxDraftApplicationDetail_OCCTEST = {
    data: {
      type: 'applications',
      attributes: {
        applicationName: 'Online Submission',
        clientApplication: 'FCUWEBAPP',
        comparisonRatesSupplied: 'N',
        externalSystemReference: 'ONL_kjmNWvoESz',
        draft: 'N',
        bossType: 'FCUONPLAP',
        customAttributes: [],
        financialDetails: financialDetails,
        loadedByClientNumber: '0000148335',
        loanPurpose: {
          level1: 'NBUS',
          level2: loanPurposeCode,
        },
        memoMaint: {
          memo: {
            refType: 'ASSIGN',
          },
          memoLines: {
            text: [
              '',
              'Promo Code: N/A',
              '',
              '------ Credit Sense ------',
              '',
              'Reference: null',
              '',
              '------ Provident Credit Care ------',
              '',
              `Provident Premium: ${formFinancialDetails.premiumAmount}`,
            ],
          },
          severity: '00',
          subject: 'Online Application Declaration',
        },
        originator: originator,
        owner: '0000148335',
        recourseAccount: 'Y',
        salesChannel: 'INTERNET',
        salutation: 'N',
        subPrime: 'N',
        taxRegion: null,
        accountManager: null,
        openingBranch: openingBranch,
        tradingBranch: 'VIR',
        type: 'D',
      },
      relationships: relationships,
    },
    included: included,
  }

  return onlineJson
}
