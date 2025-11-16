'use server'

import {
  ClientIdentification,
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
import { parseFloatFromCurrency } from './numberFormatting'
import z from 'zod'
import { preliminaryQuestionSchema } from '@/app/personal-loan/schema/prime/preliminaryQuestionsSchema'
import {
  genderLookup,
  loanPurposeCodesFallback,
  maritalStatusOptions,
} from './constants'
import { format, differenceInYears } from 'date-fns'
import { financialDetialsSchema } from '@/app/personal-loan/schema/prime/financialDetailsSchema'
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

import { accommodation, countries } from '@/lib/constants'
import { buildClientIdentifications } from './globalUtils'

type primeOnlineJsonProps = {
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
  const purchasePrice: PurchasePrice = {
    accessories: 0,
    retailPrice: Number(formFinancialDetails.costOfGoods),
    total: Number(formFinancialDetails.costOfGoods),
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
      amount: 5.4,
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
  )[0].g3_insurance_cover_type

  const bothInsuranceFieldsExist =
    formFinancialDetails.coverType !== null &&
    formFinancialDetails.coverType !== undefined &&
    formFinancialDetails.component !== null &&
    formFinancialDetails.component !== undefined

  const insurances: Insurance[] =
    formFinancialDetails.needCreditCareInsurance === 'Y' &&
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
            commencementDate: `${format(new Date(), 'yyyy-MM-dd')}T00:00:00Z`,
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
      repaymentFreq: {
        value: formFinancialDetails.paymentFrequency,
        firstRepaymentDate: `${format(formFinancialDetails.first_payment_date, 'yyyy-MM-dd')}T00:00:00Z`,
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
      settlementDate: `${format(new Date(), 'yyyy-MM-dd')}T00:00:00Z`, //* TODO: check in modify function
      signatureDate: `${format(new Date(), 'yyyy-MM-dd')}T00:00:00Z`, //* TODO: check in modify function
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
      numberOfAdults:
        primePersonalDetails.dependantAdults.toString() === '0'
          ? '1'
          : primePersonalDetails.dependantAdults.toString(),
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
        tradingBranch: primePreliminaryQuestions?.tradingBranch ?? 'VIR',
        type: 'D',
      },
      relationships: relationships,
    },
    included: [
      {
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
              phone: [],
              mobile: [
                {
                  countryCode: '64',
                  networkCode: '21',
                  number: '446886',
                  preferredMethod: 'N',
                  effectiveDate: '2025-04-28T00:00:00Z',
                  type: 'MB',
                  seq: '1',
                },
              ],
              email: [
                {
                  address: 'johndoe@dummy.com',
                  preferredMethod: 'Y',
                  effectiveDate: '2025-04-28T00:00:00Z',
                  type: 'HM',
                  seq: '1',
                },
              ],
            },
            employmentDetails: [
              {
                employmentType: {
                  type: 'FTM',
                  description: 'Full-Time Employment',
                },
                occupation: '002',
                jobDescription: 'Professionals',
                employerName: 'FCU',
                effectiveDate: '2022-08-01T00:00:00Z',
                seq: '1',
              },
            ],
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
      },
    ],
  }

  return onlineJson
}
