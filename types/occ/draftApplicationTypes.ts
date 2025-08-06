import {
  AccountRelationship,
  ApplicationReference,
  AssociatedClient,
  ClientOrganisation,
  CustomAttribute,
  Deposit,
  Fees,
  Included_ApplicationIncluded_Base,
  IndustryCode,
  InstalmentBreakdown,
  Insurances,
  InterestRateStructure,
  LoanPurpose,
  MemoMaint,
  Originator,
  PaymentMethod,
  RegionCodes,
  RepaymentFrequency,
  Security,
  StructuredInstalments,
  Summary,
  PaymentInstruction,
  CodeDescPair,
  Included_ApplicationIncluded_Base_Draft,
} from './applicationTypes'

interface DraftPurchasePrice {
  /**
   * Retail price of the Asset/Security
   * @minimum 0
   */
  retailPrice?: number

  // //   /**
  // //    * Total purchase price of the Asset/Security
  // //    * @readonly
  // //    * @minimum 0
  // //    */
  // readonly purchasePrice: number

  /**
   * Price of the options
   * @minimum 0
   */
  options?: number

  /**
   * Price of accessories
   * @minimum 0
   */
  accessories?: number

  /**
   * Fleet discount percentage
   * @minimum 0
   */
  fleetDiscountPct?: number

  /**
   * Bonus discount amount
   * @minimum 0
   */
  bonusDiscountAmount?: number

  /**
   * Total price
   * @minimum 0
   */
  total?: number

  /**
   * GST amount
   * @minimum 0
   */
  gst?: number

  /**
   * Luxury Car Tax if any
   * @minimum 0
   */
  lct?: number
}

export interface DraftFinancialDetail {
  /**
   * Code of related sovereign product. Validated against Sovereign.
   * @minLength 1
   * @maxLength 4
   */
  product?: string

  /**
   * Reapply defaults indicator
   * @minLength 0
   * @maxLength 1
   */
  reapplyDefaults?: 'Y' | 'N' | null

  //   /**
  //    * Purchase price details - Not included for Draft
  //    */
  purchasePrice?: DraftPurchasePrice

  /**
   * Interest rate. Not be supplied if the Interest Rate Structure is also provided
   * @minimum 0
   */
  interestRate?: number

  /**
   * Interest rate structure. Defines an initial rate and a rollover rate.
   * Not be supplied if the Interest Rate has also been provided
   */
  interestRateStructure?: InterestRateStructure

  /**
   * Finance term.
   */
  term: number

  /**
   * Attribute to indicate weeks, fortnights, months or years.
   */
  termType: string

  /**
   * The Payment Frequency is used to determine how often the payment will be made.
   */
  paymentFrequencyUnit?: number

  /**
   * Payment frequency type
   */
  paymentFrequencyType: CodeDescPair

  /**
   * The value must be blank except when payment frequency is M then AN (Anniversary) is required
   */
  paymentFrequencyDay?: 'AN' | null

  /**
   * Advance provided? Y-Yes, N-No
   */
  advance?: 'Y' | 'N'

  /**
   * Signature date
   */
  signatureDate?: string // format: date-time

  /**
   * Date on which the resulting loan is intended to settle
   */
  settlementDate: string // format: date-time

  /**
   * Deposit Amount Details
   */
  deposit?: Deposit

  /**
   * Repayment frequency details
   */
  repaymentFreq?: RepaymentFrequency

  /**
   * Advance Instalment value. Generally the advance instalment amount is same as regular instalments.
   * This allows user to override the advance instalment calculated by this service.
   */
  valueOfAdvInstalment?: number

  /**
   * Lump-sum payment made at the end of a rental agreement.
   */
  balloonAmount?: number

  /**
   * Balloon percentage
   * @readonly
   */
  readonly balloonPercent?: number

  /**
   * Residual value
   */
  residualValue?: number

  /**
   * Payment method details
   */
  paymentMethod?: PaymentMethod

  /**
   * Value supplied must exist on TAX TREATMENT CODE file in Sovereign.
   * @minLength 1
   * @maxLength 6
   */
  taxTreatment?: string | null

  /**
   * Commission amount (GST exclusive).
   * @readonly
   */
  readonly commissionAmount?: number

  /**
   * Campaign. Value supplied must exist on CAMPAIGN file in Sovereign.
   */
  campaign?: string

  /**
   * Campaign Override Reason Code. Valid campaign override reason code can be found via this api endpoint
   * (GET http://occ-api-server.com/occ-api/v1.0/private/campaigns/reasons)
   */
  campaignOverrideReason?: string

  /**
   * Fees details
   */
  fees?: Fees

  /**
   * Insurances details
   */
  insurances?: Insurances

  /**
   * Structured instalments details
   */
  structuredInstalments?: StructuredInstalments

  /**
   * Instalment breakdown
   * @readonly
   */
  readonly instalmentBreakdown?: InstalmentBreakdown

  /**
   * Instalment summary
   * @readonly
   */
  readonly instalmentSummary?: Summary[]

  /**
   * Sequence number
   */
  seq: string // pattern: \d{1,3}

  /**
   * Risk Pricing Outdated, Char(1). Identifies if the risk pricing scorecard is outdated
   * i.e. related Application/Quotation details and/or financial details have changed since the scorecard was generated.
   * Risk Pricing Outdated? Values:
   * Y = Yes
   * N = No
   */
  outdated?: 'Y' | 'N'

  /**
   * Custom Attribute List
   */
  customAttributes?: CustomAttribute[]

  /**
   * Credit Limit. Used by Master Agreement only.
   */
  creditLimit?: number
}

interface DraftApplication {
  /**
   * Application Internal Number. This is a Sovereign generated number and is used internally.
   * @readonly
   */
  applicationInternalNumber?: string // pattern: |\\d{9}|\\d{10}

  /**
   * External Application Number
   * @readonly
   * @example "1002393249"
   */
  applicationExternalNumber?: string // pattern: |\\d{9}|\\d{10}

  /**
   * Application Name is usually the name of the borrower(s)
   * @minLength 0
   * @maxLength 30
   */
  applicationName?: string

  /**
   * Application Securities like Vehicle, Insurance, Property, etc
   */
  securities?: Security[]

  /**
   * Originator (Dealer) who initiated the application
   */
  originator?: Originator

  /**
   * Alliance Partner Client Number
   */
  alliancePartner?: string

  /**
   * Name of the client application that calls this web service, also known as originating system.
   */
  clientApplication?: string // pattern: (.{1,10})?

  /**
   * Client number of the person/dealer who approved the application
   * @readonly
   */
  approvedByClientNumber?: string // pattern: |\\d{9}|\\d{10}

  /**
   * Client number of the person/dealer who loaded the application.
   */
  loadedByClientNumber: string // pattern: |\\d{9}|\\d{10}

  /**
   * Client number of the person/dealer who declined the application
   * @readonly
   */
  declinedByClientNumber?: string // pattern: |\\d{9}|\\d{10}

  draft?: 'Y' | 'N' | ''

  /**
   * Application Owner
   */
  owner?: string // pattern: |\\d{9}|\\d{10}

  /**
   * Approval Client Reference
   */
  approvalClientReference?: string // pattern: |\\d{9}|\\d{10}

  /**
   * The title of the application. Notes: If left blank, will be defaulted from associated clients' names
   * @minLength 0
   * @maxLength 30
   */
  applicationTitle?: string

  /**
   * Salutation
   * @minLength 0
   * @maxLength 68
   */
  salutation?: string

  /**
   * Identifies the opening organisation branch for the application.
   */
  openingBranch?: ClientOrganisation

  /**
   * Identifies the trading organisation branch for the application.
   * @minLength 0
   * @maxLength 4
   */
  tradingBranch: string

  /**
   * Client Number of the Account Manager. Must be an employee.
   */
  accountManager?: string | null // pattern: |\\d{9}|\\d{10}

  /**
   * Sales channel for this application.
   * @minLength 0
   * @maxLength 10
   */
  salesChannel?: string

  /**
   * Sub Prime loan
   */
  subPrime?: 'Y' | 'N' | ' '

  /**
   * Industry Code is used to categorise the applicant into an industry code.
   */
  industryCode?: IndustryCode

  /**
   * Region Code for the application. Up to 3 levels can be defined
   */
  region?: RegionCodes

  /**
   * Defines cost centre codes for accounting purposes.
   * @minLength 0
   * @maxLength 6
   */
  costCentre?: string

  convertedSeqNumber?: string // pattern: \\d{3}

  /**
   * Geographical region against which tax rules are defined.
   * @minLength 0
   * @maxLength 10
   */
  taxRegion?: string | null

  /**
   * Comparison Rates Supplied?
   */
  comparisonRatesSupplied?: 'Y' | 'N' | ' '

  /**
   * Dealer Rate Override
   */
  dealerRateOverride?: string

  /**
   * Date on which an application was declined
   */
  declinedDate?: string // format: date-time

  /**
   * Time at which an application was declined. Can not be provided without Decline Date
   */
  declinedTime?: string // format: date-time

  withdrawnDate?: string // format: date-time
  withdrawnTime?: string // format: date-time

  /**
   * @readonly
   */
  paymentMethod?: string

  loanPurpose: LoanPurpose

  /**
   * Is this a recourse account? Y-Yes, N-No or Blank
   * @readonly
   */
  recourseAccount?: 'Y' | 'N' | ''

  associatedClients?: AssociatedClient[]
  financialDetails: DraftFinancialDetail[]

  /**
   * Account Relationship List
   */
  accountRelationships?: AccountRelationship[]

  /**
   * Payment Instruction Details
   */
  paymentInstructions?: PaymentInstruction[]

  /**
   * @minLength 0
   * @maxLength 10
   */
  type?: string

  /**
   * Description of status. e.g. Paperwork, Compliance etc
   * @readonly
   */
  appStatusDesc?: string

  /**
   * Code to represent the user defined status. E.g. ARP, CMP, etc
   * @readonly
   */
  appStatusCode?: string

  /**
   * The client number for whom the current application is with.
   * @readonly
   */
  currentTaskWith?: string

  applicationReference?: ApplicationReference
  memoMaint?: MemoMaint

  /**
   * @minLength 0
   * @maxLength 10
   */
  bossType?: string

  /**
   * Used for North American environments only.
   * @minLength 0
   * @maxLength 2
   */
  metro2SpecialComments?: string

  /**
   * This is a unique identifier in the introducer system for which Sovereign will store a cross reference with Sovereign unique key
   */
  externalSystemReference?: string // pattern: ([a-zA-Z0-9 ~!@#$%^&*()-_=+\[{\]}\|;:',<.>"/?]{1,25})?

  /**
   * Application Level Custom Attribute List
   */
  customAttributes?: CustomAttribute[]
}

export interface MaxDraftApplicationDetail_OCCTEST {
  data: {
    type: string
    id?: string
    attributes: DraftApplication
    relationships: {
      securities: {
        links?: {
          related: string
          self: string
        }
        data: unknown[]
      }
      originator?: {
        links?: {
          related: string
          self: string
        }
        data: {
          type: string
          id: string | null
        }
      }
      associatedClients: {
        links?: {
          related: string
          self: string
        }
        data: Array<{
          type: string
          id: string
        }>
      }
    }
    links?: {
      self: string
    }
  }
  included: Included_ApplicationIncluded_Base[]
}

export interface NewMaxDraftApplicationDetail {
  data: {
    type: string
    id?: string
    attributes: DraftApplication
    relationships: {
      securities: {
        links?: {
          related: string
          self: string
        }
        data: unknown[]
      }
      originator?: {
        links?: {
          related: string
          self: string
        }
        data: {
          type: string
          id: string | null
        }
      }
      associatedClients: {
        links?: {
          related: string
          self: string
        }
        data: Array<{
          type: string
          id: string
        }>
      }
    }
    links?: {
      self: string
    }
  }
  included: Included_ApplicationIncluded_Base_Draft[]
}
