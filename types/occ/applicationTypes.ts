/**
 * Represents an account relationship type
 */
export interface AccRelType {
  /**
   * Product Type of the related account
   * @minLength 1
   * @maxLength 4
   */
  product: string

  /**
   * Related Account
   */
  accountNumber: string // pattern: (\d{10})
}

/**
 * This defines relationship of this application to other Sovereign Account
 */
export interface AccountRelationship {
  /**
   * Product Types
   * @example "COF, CHP, CHM"
   * @readonly
   */
  readonly productType?: string

  /**
   * Internal Account Number. It's a unique identifier within Sovereign for each account/application.
   * @readonly
   */
  readonly accountInternalNumber?: string

  /**
   * Related account relationship type
   */
  related?: AccRelType

  /**
   * Effective Date of the relationship
   */
  effectiveDate?: string // format: date-time

  /**
   * Expiry Date of the relationship
   */
  expiryDate?: string // format: date-time

  /**
   * Relationship Code (maximum of 6 characters long). Value supplied must exist on RELATIONSHIP TYPE file in Sovereign
   * @example "ACCNT - Account, MASTER - Master Agreement, REFINC - Refinance, etc"
   * @minLength 0
   * @maxLength 6
   */
  code: string
}

/**
 * Financial information for security as applied to this account.
 */
export interface AccountSecurity {
  /**
   * Asset Number
   * @readonly
   */
  assetNumber?: string

  /**
   * Indicates if the security is Primary(P) or Collateral(C). There can only be one Primary security
   */
  primaryCollateral?: 'P' | 'C'

  /**
   * @readonly
   */
  id?: string

  /**
   * @readonly
   */
  type?: CodeDescPair

  /**
   * Effective date of the security.
   * @readonly
   */
  effectiveDate?: string // format: date-time

  /**
   * Indicates if this is a taxable activity or not.
   */
  taxableActivity?: 'Y' | 'N' | ' '

  //! Property sending description instead of code
  /**
   * Client Security Relationship, e.g.
   * P - Purchase
   * O - Owned
   * L - Leased
   * *Blank - Not entered
   */
  // clientSecurityRelationship?: 'P' | 'O' | 'L' | 'Blank' //! Original documentation
  clientSecurityRelationship?: string

  /**
   * Percentage of value of the security to be used for application. This value is read only and uses value specified for asset classification in Core
   * @readonly
   */
  appPctToUse?: string

  /**
   * Value supplied must exist on SUPPLIER OF GOODS file in Sovereign.
   * @minLength 0
   * @maxLength 10
   */
  supplierOfGoods?: string

  /**
   * Tax Region used. Region supplied here must exist in the Sovereign Tax Region file.
   * @minLength 0
   * @maxLength 10
   */
  taxRegion?: string

  /**
   * Intended Use Code. Value supplied must exist on SECURITY INTENDED USE file in Sovereign.
   * @readonly
   */
  intendedUse?: string

  /**
   * VIN validation status. Valid values: '1'-Not Attempted, '2'-Validated on Bailment, '3'-Not known, '4'-Failed on Bailment, '5'-Failed with Manual Evidence
   * @readonly
   */
  vinValidationStatus?: string

  /**
   * Client number of the insurance company issuing the policy. Insurance companies must be setup as clients in Sovereign.
   * @readonly
   */
  insurerClientNumber?: string

  /**
   * Usage Allowance in Kilometers, Miles or Hours
   * @readonly
   */
  usageAllowance?: number

  /**
   * Excess Charge
   * @readonly
   */
  usageExcessCharge?: number

  /**
   * Fleet Discount Rate
   * @readonly
   */
  fleetDiscountRate?: number

  /**
   * Date of Possession
   */
  possessionDate?: string // format: date-time

  /**
   * Unit of measurement of usage
   * @readonly
   */
  usageUnitOfMeasure?: string

  /**
   * @readonly
   */
  usageFrequencyUnit?: number

  /**
   * @readonly
   */
  usageFrequency?: string

  /**
   * Initial Reading
   * @readonly
   */
  usageInitialReading?: number

  /**
   * @readonly
   */
  usageRebate?: number

  /**
   * Condition of security. N-New, U-Used or D-Demo.
   * @readonly
   */
  condition?: CodeDescPair

  /**
   * Registration Number
   * @readonly
   */
  registrationNumber?: string

  /**
   * Year of Registration
   * @readonly
   */
  registrationYear?: number

  /**
   * Brief description of security
   * @readonly
   */
  description?: string

  /**
   * Colour of security
   * @readonly
   */
  colour?: string

  /**
   * Value of security
   * @readonly
   */
  value?: number

  /**
   * Odometer Reading
   * @readonly
   */
  odometer?: number

  /**
   * Unit: K=Kilometer, M=Miles, H=Hours
   * @readonly
   */
  odometerUnitOfMeasure?: string

  /**
   * Relicensing Date. ISO format.
   * @readonly
   */
  relicensingDate?: string // format: date-time

  /**
   * Has got a personalised plate? Valid values: Y,N or blank
   * @readonly
   */
  personalisedPlate?: string

  /**
   * Has vehicle been modified? Valid values: Y,N or blank
   * @readonly
   */
  modifiedVehicle?: string

  /**
   * Sundry Information
   * @readonly
   */
  sundryInformation?: string

  /**
   * @readonly
   */
  securityPmsi?: CodeDescPair

  /**
   * @readonly
   */
  usageWaiverPercentage?: number

  /**
   * Purchase Money Security Interest flag. Valid values: Y,N
   */
  purchaseMoneySecurityInterest?: 'Y' | 'N' | ' '
}

/**
 * Vehicle Security
 */
export interface AccountSecurityVehicle {
  /**
   * Intended Use. Value supplied must exist on SECURITY INTENDED USE file in Sovereign.
   * @minLength 0
   * @maxLength 6
   */
  intendedUse: string

  /**
   * Vehicle usage details
   */
  usage?: AcctSecVehUsage
}

/**
 * Account Security Vehicle Usage Details
 */
export interface AcctSecVehUsage {
  /**
   * Period of Loan
   */
  period?: Term

  /**
   * Usage Allowance. K-Kilometer, M-Miles, H-Hours
   */
  allowance?: OdometerType

  /**
   * Excess Charge
   */
  excessCharge?: string

  /**
   * Rebate Offered
   */
  rebate?: string

  /**
   * Waiver Percentage
   */
  waiverPct?: string
}
// VehicleMaint Interface
export interface VehicleMaint {
  vehicle: Vehicle
  vehicleDetails: VehGeneralDetail
  assetDetails?: Asset // readOnly
  memoMaint?: MemoMaint
  assetValuations?: AssetValuation[]
  assetOtherClaim?: AssetOtherClaim
  assetExtras?: AssetExtra[]
  accountSecurityVehicle?: AccountSecurityVehicle
}

export interface Address {
  /**
   * Country. Required for create. Value supplied must exist in COUNTRY File in Sovereign.
   */
  country?: CodeDescPair

  /**
   * Effective Date
   */
  effectiveDate: string // format: date-time

  /**
   * External System Reference
   */
  externalSystemReference?: string // pattern: ([a-zA-Z0-9 ~!@#$%^&*()-_=+\[{\]}\|;:',<.>"/?]{1,25})?

  /**
   * Address Purpose
   * @example "R-Residential, M-Mailing, G-Registered"
   */
  purpose: 'R' | 'M' | 'G'

  //! Property Missing in Response
  // /**
  //  * Address Sequence
  //  */
  seq?: string // pattern: \d{1,5}

  /**
   * Street Number
   */
  streetNumber: StreetNumber

  /**
   * Address Type
   * @example "S-Street Address, P-Postal Address"
   */
  type: 'S' | 'P'

  /**
   * Care of Name
   * @minLength 0
   * @maxLength 60
   */
  careOfName?: string

  /**
   * Unit Type
   * @example "Apartment, Building, Flat, Office, Penthouse, Room, Shop, Suite, Unit, Villa, etc"
   */
  unitType?:
    | 'Apartment'
    | 'Building'
    | 'Department'
    | 'Flat'
    | 'Floor'
    | 'Kiosk'
    | 'Lot'
    | 'Lower'
    | 'Office'
    | 'Penthouse'
    | 'Rear'
    | 'Room'
    | 'Shop'
    | 'Slip'
    | 'Space'
    | 'Stop'
    | 'Suite'
    | 'Trailer'
    | 'Unit'
    | 'Upper'
    | 'Villa'

  /**
   * Apartment
   * @minLength 0
   * @maxLength 10
   */
  apartment?: string

  /**
   * Building Name
   * @minLength 0
   * @maxLength 50
   */
  building?: string

  /**
   * Alpha
   * @minLength 0
   * @maxLength 1
   */
  alpha?: string

  /**
   * Street Name
   */
  streetOrPostalName?: string // pattern: ([a-zA-Z0-9\-,'\\./ ]{0,50})

  /**
   * Street Type. Value supplied must exist in STREET TYPE File in Sovereign.
   * @example "Street-ST, Avenue-AV, Road-RD, Place-PL, etc"
   * @minLength 0
   * @maxLength 2
   */
  streetType?: string

  /**
   * Street Direction
   * @minLength 0
   * @maxLength 10
   */
  streetDirection?: string

  /**
   * Suburb. Either this or streetOrPostalName is required. Value supplied must exist in POST CODE AUS or POST CODE NZ files.
   */
  suburb?: string // pattern: [a-zA-Z0-9'\- ]{0,30}

  /**
   * City. Value supplied must exist in POST CODE AUS or POST CODE NZ files.
   * @minLength 0
   * @maxLength 35
   */
  city?: string

  /**
   * State – for Australia, value must be NSW, WA, ACT, QLD, TAS, VIC or NT
   * @minLength 0
   * @maxLength 30
   */
  state?: string

  /**
   * Post Code. Value supplied must exist in POST CODE AUS or POST CODE NZ files.
   */
  postCode?: string // pattern: [0-9]{4,15}

  /**
   * Address verification details
   * @readonly
   */
  verificationDetails?: AddressVerification

  /**
   * Contact ID
   * @readonly
   */
  contactId?: string

  /**
   * Address Line 1
   * @readonly
   */
  addressLine1?: string

  /**
   * Address Line 2
   * @readonly
   */
  addressLine2?: string

  /**
   * Address Line 3
   * @readonly
   */
  addressLine3?: string

  /**
   * Address Line 4
   * @readonly
   */
  addressLine4?: string

  /**
   * Address Line 5
   * @readonly
   */
  addressLine5?: string

  /**
   * Address Line 6
   * @readonly
   */
  addressLine6?: string

  /**
   * Address Line 7
   * @readonly
   */
  addressLine7?: string
}

/**
 * Represents address verification details
 */
export interface AddressVerification {
  /**
   * Latitude of the verified address
   */
  lattitude?: string

  /**
   * Longitude of the verified address
   */
  longitude?: string

  /**
   * The service used for address verification
   */
  verificationService?: string

  /**
   * External reference for the verification
   */
  externalRef?: string
}

/**
 * Represents AML (Anti-Money Laundering) Details
 */
export interface Aml {
  /**
   * Date on which business has begun
   */
  deedDate?: string // format: date-time

  /**
   * Address of Client
   */
  address?: Address

  /**
   * This field captures the type of trust. This will be validated against Sovereign table 'CORPORATE TYPE COT'
   * @example "R Trust Regulated,L Trust Private"
   */
  trustType?: string

  /**
   * This field captures the description of the Trust type if the client is a Trust.
   * @example "D - Discretionary Trust, H - Hybrid Trust, F - Fixed Trust, U - Unit Trust, I - Family Trust, O - Other Trust"
   */
  trustDescription?: CodeDescPair

  /**
   * Description about the beneficiary e.g. Unit holders, Family Trust etc
   */
  trustBeneficiaryClass?: string

  //! Property returns extra single quote
  /**
   * Whether The Partnership is Regulated
   */
  regulated?: 'Y' | 'N'

  /**
   * Name of Professional Association for Regulated Partnership
   */
  professionalAssociationName?: string

  /**
   * Website Address of Professional Association for Regulated Partnership
   */
  professionalAssociationWebsite?: string

  /**
   * Professional Association Membership Id for Regulated Partnership
   */
  professionalAssociationMembership?: string

  /**
   * Whether the client is KYC verified by the user
   * @example "Y,N,<Blank>"
   */
  kycVerified?: 'Y' | 'N'

  /**
   * Whether the client is already KYC verified by another system
   */
  kycVerifiedOtherSystem?: 'Y' | 'N'

  /**
   * Government Category for Government Type
   */
  governmentCategory?:
    | 'C (Commonwealth of AUS)'
    | 'S (State/Territory of AUS)'
    | 'F (Foreign Country)'

  /**
   * Government State/Territory for Government Type
   */
  governmentState?: string

  /**
   * Optional. Government Country Code. See column #1AOCD of table AAALREP for the list of country codes allowed.
   */
  governmentCountry?: string

  /**
   * Whether Government is established under some legislation
   */
  governmentLegislation?: string

  /**
   * Legislation Name under which Government entity is established
   */
  governmentLegislationName?: string

  /**
   * Unique Identifying Number
   */
  uniqueIdentifyingNumber?: string

  /**
   * Additional Trustee Exist
   */
  additionalTrusteesExist?: 'Y' | 'N'
}

/**
 * Represents a loan application
 */
export interface Application {
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
  accountManager?: string // pattern: |\\d{9}|\\d{10}

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
  taxRegion?: string

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
  financialDetails: FinancialDetail[]

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

export interface ApplicationClientRelation {
  /**
   * Client maintenance details
   */
  applicationClientRelationMaint?: ClientMaint

  /**
   * Client reference number
   */
  clientReference?: string // pattern: \d{9}|\d{10}

  /**
   * Role of the client in the application
   * @minLength 0
   * @maxLength 3
   */
  role: string
}

/**
 * Represents an application reference
 */
export interface ApplicationReference {
  /**
   * The value of the application reference
   */
  value?: string // pattern: |\\d{9}|\\d{10}

  /**
   * Application Reference Type
   */
  refType: 'SOVEREIGN' | 'EXTERNAL' | 'ASSIGN'
}

/**
 * Asset is a security that is added to the application
 */
export interface Asset {
  /**
   * Its a ten digit string that uniquely identifies the asset.
   * @readonly
   */
  assetNumber?: string

  //! Property missing in API resposne
  /**
   * Type of Asset. e.g. A-Asset, S-Security, T-Trade In
   */
  assetType?: 'A' | 'S' | 'T'

  /**
   * Asset Classification Code. Value supplied must exist on ASSET CLASSIFICATION file in Sovereign.
   * @minLength 1
   * @maxLength 4
   */
  classificationCode: string

  /**
   * Asset Condition
   * @readonly
   */
  securityStatus?: CodeDescPair

  /**
   * Security percentage to use
   */
  securityPercentageToUse?: string

  /**
   * Asset Condition: New, Used or Demo. Codes- 'N', 'U' and 'D'
   */
  condition?: CodeDescPair

  /**
   * Asset Classification. Must exist as defined on Sovereign Asset Classification file.
   * Typical examples may include CAR=Car, PROP=Property, etc.
   * @readonly
   */
  assetClassification?: CodeDescPair
}

/**
 * Extras relating to the Asset
 */
export interface AssetExtra {
  /**
   * Type of extra. Valid values: ACC (Accessory) or OPT (Option)
   */
  type: 'ACC' | 'OPT' | ' '

  /**
   * Value supplied must exist on ASSET EXTRA CODE file in Sovereign.
   * @minLength 1
   * @maxLength 4
   */
  code: string

  /**
   * Description of extra added to the asset
   * @minLength 0
   * @maxLength 50
   */
  description?: string

  /**
   * Price of extra
   */
  price?: string
}

/**
 * Represents an asset or liability
 */
export interface AssetLiability {
  /**
   * Asset/Liability item code. Must exist on Sovereign Asset/Liability Type file
   * @minLength 0
   * @maxLength 9
   */
  code: string

  /**
   * Amount of the asset or liability
   * @minimum 0
   */
  amount?: number

  /**
   * Are you refinancing? Valid Values: Y-Yes, N-No or Blank
   */
  refinance?: 'Y' | 'N' | ' '

  /**
   * Description of the asset or liability
   */
  description?: string // pattern: ([a-zA-Z0-9 ~!@#$%^&*()-_=+\[{\]}\|;:',<.>"/?]{1,30})?

  /**
   * Sequence number
   */
  seq?: string // pattern: \d{1,5}
}

/**
 * Claims against the asset. Optional but if present, all fields below are mandatory.
 */
export interface AssetOtherClaim {
  /**
   * Asset Claim Priority. Valid Values: P-Prior Claim, S-Subsequent Claim
   */
  aocPriority: 'P' | 'S'

  /**
   * Start Date of claim. ISO format YYYY-MM-DD
   */
  startDate: string // format: date-time

  /**
   * Claim Amount
   * @minimum 0
   */
  claimAmount: number

  /**
   * Claimant Name. Mandatory if claim amount is entered
   * @minLength 0
   * @maxLength 30
   */
  claimantName: string

  /**
   * Sequence number
   */
  seq?: string // pattern: \d{1,3}
}

/**
 * Represents an asset valuation
 */
export interface AssetValuation {
  /**
   * Asset Valuation Type. A= Assessed, G= Government, P= Registered, S=Sale
   */
  assetValType?: 'A' | 'G' | 'P' | 'S'

  /**
   * Indicates if this valuation is a priority
   */
  priority?: 'Y' | 'N'

  /**
   * This must be an existing Sovereign Client
   */
  valuerReference?: string // pattern: |\d{9}|\d{10}

  /**
   * Name of the client in Valuer Reference
   * @minLength 0
   * @maxLength 60
   */
  valuerName?: string

  /**
   * Amount of the valuation
   */
  amount?: string

  /**
   * Valuation Date. ISO format
   */
  valuationDate: string // format: date-time

  /**
   * Sequence number
   */
  seq: string // pattern: \d{1,5}
}

/**
 * Represents an associated client in an application
 */
export interface AssociatedClient {
  /**
   * Unique identifier for the associated client
   * @readonly
   */
  id?: string

  /**
   * Order of the associated client
   */
  order?: string // pattern: \d{1,3}

  /**
   * Client maintenance details
   */
  clientMaint?: ClientMaint

  /**
   * Role of the associated client
   * Value supplied must exist on CLIENT ROLE file in Sovereign.
   * @minLength 0
   * @maxLength 6
   */
  role: string

  /**
   * Sequence number of the associated client
   * Value supplied must be unique to avoid Client Capacity updates to a different client with the same sequence.
   */
  seq: string // pattern: \d{1,3}

  /**
   * Is credit check authorised? Y-Yes, N-No
   */
  creditCheckAuthorised?: ' ' | 'Y' | 'N' | 'X'

  /**
   * Is client as partnership? Y-Yes, N-No
   */
  actingAsPartnership?: 'Y' | 'N'

  /**
   * Is client acting as Trustee? Y-Yes, N-No
   */
  trustee?: 'Y' | 'N' | ' '

  /**
   * Signature Required? M-Mandatory, O-Optional
   */
  signatureRequired?: ' ' | 'M' | 'O'

  /**
   * Client reference number
   */
  clientReference?: string // pattern: \d{9}|\d{10}

  /**
   * Product For Client Level Custom Attribute List.
   * Please note that existing Products for Clients Custom Attributes ARE deleted during payload processing before they are (re)created.
   * Multiple attributes should be provided in the payload within the same customAttributes section to avoid unexpected deletion of all but the last PFC Custom Attribute in the payload.
   */
  customAttributes?: CustomAttribute[]
}

// Vehicle Interface
export interface Vehicle {
  value?: string // pattern: (\d{10})?
  retype?: 'SOVEREIGN' | 'EXTERNAL' | 'ASSIGN'
}

// YNCodeDescPair Interface
export interface YNCodeDescPair {
  code?: 'Y' | 'N'
  description?: string // readOnly
}

// VehicleCodeDescPair Interface
export interface VehicleCodeDescPair {
  code?: 'Y' | 'N' | ''
  description?: string // readOnly
}

/**
 * Represents general details of a vehicle
 */
export interface VehGeneralDetail {
  /**
   * Unique code to identify the maker of the asset (goods or vehicles), e.g.
   * Ford, Pioneer etc.
   */
  make?: string // pattern: ([a-zA-Z0-9 -]{1,20})?

  /**
   * For a vehicle this would be something like FOCUS when referring to FORD or CX-5 to Mazda
   */
  model?: string // pattern: ([a-zA-Z0-9 ~!@#$%^&*()-_=+\[{\]}\|;:',<.>"/?]{0,25})?

  /**
   * Sub-model of the vehicle
   */
  subModel?: string // pattern: ([a-zA-Z0-9 ~!@#$%^&*()-_=+\[{\]}\|;:',<.>"/?]{0,25})?

  /**
   * Country where the vehicle was first registered
   * @minLength 0
   * @maxLength 3
   */
  countryFirstRegistered?: string

  /**
   * Registration Number when Asset was first loaded.
   * The status that is current when the Asset is added as a Security for Account
   * will be reflected in the Security For Account Extension record.
   */
  registrationNumber?: string // pattern: ([a-zA-Z0-9 ]{0,10})?

  /**
   * Year of Registration when Asset was first loaded.
   * The current value (when the Asset is added as a Security for Account)
   * will be reflected in the Security For Account Extension record.
   */
  registrationYear?: string // pattern: (\d{4})?

  /**
   * Date of first registration overseas
   */
  dateFirstRegisteredOverseas?: string // format: date-time

  /**
   * Unique 4-character code to identify the Body Style
   * @minLength 0
   * @maxLength 4
   */
  bodyStyle?: string

  /**
   * Engine Number. In AU environment, it must match the regex([a-zA-Z0-9]{0,17}).
   * In NZ environment, it must match the regex([A-Z0-9]{0,20}).
   * Additionally, The value cannot be one of the values[TBA,TBC,TBA123,NA,N/A,NAVAIL,NOINFO,12345678910]
   */
  chassisNumber?: string

  /**
   * Description of the vehicle
   * @minLength 0
   * @maxLength 60
   */
  description?: string

  /**
   * Value of the vehicle
   * @readonly
   */
  readonly value?: string

  /**
   * Color of the vehicle
   * @minLength 0
   * @maxLength 20
   */
  colour?: string

  /**
   * Transmission type of the vehicle
   */
  transmissionType?: 'A' | 'M' | 'T'

  /**
   * Fuel type of the vehicle
   */
  fuelType?: 'C' | 'D' | 'E' | 'H' | 'L' | 'O' | 'P'

  /**
   * Engine capacity in cubic centimeters
   */
  engineCc?: string // pattern: ([0-9]{1,5})?

  /**
   * Engine Number. In AU environment, it must match the regex([a-zA-Z0-9]{0,25}).
   * In NZ environment, it must match the regex([a-zA-Z0-9]{0,17})
   */
  engineNumber?: string

  /**
   * Odometer reading
   */
  odometer?: string // pattern: (\d{1,7})?

  /**
   * Odometer unit of measure
   */
  odometerUnitOfMeasure?: 'H' | 'K' | 'M'

  /**
   * Indicates if the vehicle data has been cleansed
   * @minLength 0
   * @maxLength 1
   */
  cleansed?: 'Y' | 'N' | ' '

  /**
   * Indicates if Motochek has been performed
   * @readonly
   */
  readonly motochekPerformed?: string

  /**
   * Date of relicensing
   */
  relicencingDate?: string // format: date-time

  /**
   * Vehicle Identification Number
   * @minLength 0
   * @maxLength 17
   */
  vin?: string

  /**
   * Registered interests on the vehicle
   * @readonly
   */
  readonly registeredInterests?: string

  /**
   * Number of doors
   */
  numberOfDoors?: string // pattern: (\d{1})?

  /**
   * Indicates if the vehicle is four-wheel drive
   */
  fourWheelDrive?: CodeDescPair

  /**
   * Distributor stock number
   * @minLength 0
   * @maxLength 10
   */
  distributorStockNumber?: string

  /**
   * Indicates if the vehicle has a personalised plate
   * @minLength 0
   * @maxLength 1
   */
  personalisedPlate?: 'Y' | 'N' | ' '

  /**
   * Indicates if the vehicle has a turbo
   */
  turbo?: CodeDescPair

  /**
   * Indicates if the vehicle is LCT exempt
   * @readonly
   */
  readonly lctExempt?: string

  /**
   * Indicates if the vehicle is non-standard
   */
  nonStandardVehicle?: YNCodeDescPair

  /**
   * Indicates if the vehicle is modified
   */
  modifiedVehicle?: VehicleCodeDescPair

  /**
   * Sundry information about the vehicle
   * @readonly
   * @minLength 0
   * @maxLength 50
   */
  readonly sundryInformation?: string

  /**
   * External reference, which is a unique vehicle identifier.
   * @minLength 0
   * @maxLength 25
   */
  externalReference?: string

  /**
   * External system reference
   */
  externalSystemReference?: string // pattern: ([a-zA-Z0-9 ~!@#$%^&*()-_=+\[{\]}\|;:',<.>"/?]{1,25})?

  /**
   * Date of manufacture
   */
  manufactureDate?: string // format: date-time

  /**
   * Age from date
   */
  ageFromDate?: string // format: date-time

  /**
   * Number of cylinders
   * @readonly
   */
  readonly numberOfCylinders?: string

  /**
   * Trade price
   * @readonly
   */
  readonly tradePrice?: string

  /**
   * Wheel width
   * @readonly
   */
  readonly wheelWidth?: string

  /**
   * Low trade price
   * @readonly
   */
  readonly lowTradePrice?: number

  /**
   * Release year
   * @readonly
   */
  readonly releaseYear?: string

  /**
   * Series
   * @readonly
   */
  readonly series?: string

  /**
   * Fuel usage in the city
   */
  fuelUsageCity?: string

  /**
   * Indicates if GPS is installed
   */
  gpsInstalled?: 'Y' | 'N'

  /**
   * Valuation amount
   * @minimum 0
   */
  valuationAmount?: number
}

// ... (continue with more interfaces)

/**
 * Bank Account Details
 */
export interface BankAccount {
  /**
   * The bank and branch number (for New Zealand) or BSB (for Australia) must exist on the BANK BRANCH - NZ File or BANK STATE BRNCH- AUS BSB file
   * @minLength 0
   * @maxLength 24
   */
  accountNumber?: string // pattern: |([0-9 \-]{1,25})

  /**
   * Bank account title
   * @minLength 0
   * @maxLength 30
   */
  title?: string

  /**
   * Expiry date of the bank account
   * @readonly
   */
  expiryDate?: string // format: date-time

  /**
   * Sequence number of the bank account
   */
  seq: string // pattern: \d{1,5}
}

/**
 * Contains 3 capacity assessment elements
 */
export interface CapacityAssessment {
  /**
   * Indicate if the borrower expects any changes in financial positions.
   * @minLength 0
   * @maxLength 1
   */
  anyExpectedChanges?: 'Y' | 'N'

  /**
   * The detail of capacity changes
   */
  changeDetails?: string // pattern: ([a-zA-Z0-9 ~!@#$%^&*()-_=+\[{\]}\|;:',<.>"/?]{1,200})?

  /**
   * Indicate if all the capacity assessment questions has been asked.
   * @minLength 0
   * @maxLength 1
   */
  assessmentQuestionsAsked?: 'Y' | 'N'

  /**
   * Self Declaration provided by customer? Y-Yes, N-No
   */
  selfDeclaration?: string

  /**
   * Self Declaration Accepted? Y-Yes, N-No
   * @readonly
   */
  selfDeclarationAccepted?: string

  /**
   * Reduction Claimed? Y-Yes, N-No
   */
  reductionClaimed?: string
}

/**
 * Client's Statement of Position Details
 */
export interface ClientCapacity {
  /**
   * Date on which application is loaded/created. The value should be set to the date on which the application is created
   */
  collectionDate?: string // format: date-time

  /**
   * Capacity Assessment Details
   */
  capacityAssessment?: CapacityAssessment

  /**
   * Asset Details
   */
  assets?: AssetLiability[]

  /**
   * Liability Details
   */
  liabilities?: AssetLiability[]

  /**
   * Income Information
   */
  incomes?: IncomeExpense[]

  /**
   * Expense Information
   */
  expenses?: IncomeExpense[]

  /**
   * Joint Statement of Position? Y-Yes, N-No
   * A joint Statement of Position is shared between two borrowers e.g., when married or de-facto.
   * When not joint, a separate Statement of Position is supplied for each borrower.
   */
  joint: 'Y' | 'N' | ''

  linkedClientSeq?: string // pattern: \d{1,3}

  /**
   * Custom Attribute List
   */
  customAttributes?: CustomAttribute[]
}

/**
 * Client Category Details
 */
export interface ClientCategory {
  /**
   * In Sovereign, you can categorise clients and assign them different categories. Value supplied must exist on CLIENT CATEGORY file in Sovereign.
   * @minLength 0
   * @maxLength 4
   */
  categoryCode?: string

  /**
   * Effective date of category
   */
  effectiveDate?: string // format: date-time

  /**
   * Expiry date of category
   */
  expiryDate?: string // format: date-time

  /**
   * Sequence number
   */
  seq: string // pattern: \d{1,5}
}

/**
 * General Details describing the client.
 */
export interface ClientGeneralDtl {
  /**
   * Client Type can be 'C' - Company or 'I' - Individual
   */
  clientType?: 'C' | 'I'

  /**
   * @readonly
   */
  name?: string

  /**
   * A - Active, I - Inactive
   */
  status?: ClientStatus

  /**
   * Industry Code, for analysis purposes. Must exist on Sovereign.
   */
  industryCode?: IndustryCode

  /**
   * URL of the website
   * @minLength 0
   * @maxLength 55
   */
  websiteAddress?: string

  /**
   * Gone No Address.
   * @minLength 0
   * @maxLength 1
   */
  gna?: 'Y' | 'N' | ' '

  /**
   * Mail out restriction applies to client? Y-Yes, N-No
   * @minLength 0
   * @maxLength 2
   */
  mailOutRestriction?: 'Y' | 'N'

  /**
   * @minLength 0
   * @maxLength 1
   */
  existingClient?: 'Y' | 'N' | ' '

  defaultManager?: string // pattern: |\d{10}

  /**
   * Inland Revenue Department number. Sovereign will check the number supplied is valid.
   */
  irdNumber?: string // pattern: \d{0,12}

  /**
   * Goods and Service Tax Number. Sovereign will check the number supplied is valid.
   */
  gstNumber?: string // pattern: \d{0,12}

  /**
   * Tax File Number (Australia). Sovereign will check the number supplied is valid.
   */
  tfnNumber?: string // pattern: \d{0,12}

  /**
   * Australian Business Number(Aus), Company Registration Number(NZ). Sovereign will check the number supplied is valid.
   */
  abnNumber?: string // pattern: \d{0,12}

  /**
   * ACN number. Australia use only
   */
  acnNumber?: string // pattern: \d{0,9}

  /**
   * Withholding Tax Category
   * @minLength 1
   * @maxLength 3
   */
  whtCategory?: string

  /**
   * @minLength 1
   * @maxLength 3
   */
  ictCategory?: string

  //! Property missing in API resposne
  externalSystemReference?: string // pattern: ([a-zA-Z0-9 ~!@#$%^&*()-_=+\[{\]}\|;:',<.>"/?]{1,25})?

  /**
   * Sovereign corporate type. Value supplied must exist in CORPORATE TYPE file in Sovereign, e.g., C - Company-Private, F - Foreign Reg Company-Public, R - Foreign Reg Company-Private.
   * @minLength 0
   * @maxLength 1
   */
  corporateType?: string

  /**
   * Broker or Dealer. Value supplied must exist in ORIGINATING SOURCE File in Sovereign.
   * @minLength 0
   * @maxLength 6
   */
  originatingSource?: string

  /**
   * @minLength 0
   * @maxLength 65
   */
  tradingName?: string

  /**
   * @minLength 0
   * @maxLength 15
   */
  reserveBankCoding?: string

  /**
   * Default Client Organisation, Char(4). This is are independent from the organisation unit-id/type-id fields defaulted from client-manager. Attributes: unit-type and unit-id.
   */
  defaultClientOrganisation?: ClientOrganisation

  /**
   * @minLength 0
   * @maxLength 4
   */
  analysisCode?: string

  /**
   * @minLength 0
   * @maxLength 2
   */
  identificationChannel?: string

  /**
   * ABN override reason. Mutually exclusive with ABN-number.
   * @minLength 0
   * @maxLength 2
   */
  abnOverrideReason?: string

  /**
   * GST override reason. Mutually exclusive with GST-number.
   * @minLength 0
   * @maxLength 2
   */
  gstOverrideReason?: string

  /**
   * @minLength 0
   * @maxLength 40
   */
  foreignRegistrationNumber?: string

  companyDetails?: CompanyDetails

  individualDetails?: IndividualDetails

  /**
   * @minLength 0
   * @maxLength 10
   */
  clientManager?: string

  /**
   * @minLength 0
   * @maxLength 15
   */
  creditRating?: string

  /**
   * Key Person Role. Must exist on Client Organisation Roles file. For Authorised Signatories, where Prime Borrower is a Company. When this element is supplied this client will be created for the given role as a key person on the company.
   * @minLength 0
   * @maxLength 3
   */
  keyPersonRole?: string

  /**
   * Only used in North American environments.
   * @minLength 0
   * @maxLength 3
   */
  bankruptcyPosition?: string

  /**
   * Only used in North American environments.
   */
  bankruptcyDate?: string // format: date-time

  /**
   * Adverse Credit? Y-Yes, N-No
   */
  adverseCredit?: 'Y' | 'N' | ''
}

/**
 * Represents client identification details
 */
export interface ClientIdentification {
  /**
   * Identification Type Code 1. Must exist on Sovereign Identification Type file.
   * Typical examples may include Drivers Licence, Passport etc
   * @minLength 0
   * @maxLength 10
   */
  idCode1?: string

  /**
   * Identification Type Code 2.
   * If provided, it must exist on Sovereign Identification Type file as a valid combination with id-code-1.
   * @minLength 0
   * @maxLength 10
   */
  idCode2?: string

  /**
   * Effective date of the identification
   */
  effectiveDate?: string // format: date-time

  /**
   * Expiry date of the identification
   */
  expiryDate?: string // format: date-time

  /**
   * Reference number or code for the identification
   */
  reference?: string // pattern: ([a-zA-Z0-9]{1,32})

  /**
   * Sequence number of the identification
   */
  seq: string // pattern: \d{1,5}
}

// ClientMaint Interface
/**
 * Represents client maintenance details
 */
export interface ClientMaint {
  /**
   * Client ID
   * @readonly
   */
  clientID?: string // pattern: |\\d{9}|\\d{10}

  /**
   * General details of the client
   */
  generalDetails?: ClientGeneralDtl

  /**
   * Bank accounts associated with the client
   */
  bankAccounts?: BankAccount[]

  /**
   * Client identification details
   */
  clientIdentifications?: ClientIdentification[]

  /**
   * Categories associated with the client
   */
  clientCategories?: ClientCategory[]

  /**
   * Contact details of the client
   */
  contactDetails?: ContactDetails

  /**
   * Employment details of the client
   */
  employmentDetails?: EmploymentDetail[]

  /**
   * Relationships associated with the client
   */
  relationships?: Relationship[]

  /**
   * Dependants of the client
   */
  dependants?: Dependant[]

  /**
   * Key persons associated with the client
   */
  keyPersons?: KeyPerson[]

  /**
   * Anti-Money Laundering details
   */
  aml?: Aml

  /**
   * Application client relations
   */
  applicationClientRelations?: ApplicationClientRelation[]

  /**
   * Client capacity details
   */
  clientCapacity?: ClientCapacity

  /**
   * Client Level Custom Attribute List.
   * Please note that existing Client Custom Attributes will NOT be deleted. Only create/update occurs.
   */
  customAttributes?: CustomAttribute[]

  /**
   * Client maint mode
   * @example "Add"
   */
  mode?: 'Add' | 'Change'
}

// ClientOrganisation Interface
export interface ClientOrganisation {
  value?: string
  unitType?: string
  unitId?: string
}

// ClientOtherName Interface
export interface ClientOtherName {
  value?: string
  seq: string
}

// ClientStatus Interface
export interface ClientStatus {
  code: 'A' | 'I'
}

// CodeDescPair Interface
export interface CodeDescPair {
  code: string
  description: string
}

/**
 * Client Company Details
 */
export interface CompanyDetails {
  /**
   * Indicates the type of corporate entity, e.g. Private Company, Sole Trader, Trust, Incorporated Society etc
   * @readonly
   */
  corporateType?: CodeDescPair

  /**
   * Name of the company
   */
  companyName?: string // pattern: [a-zA-Z0-9 !"#$%&'()*,-./:;=?@\\_|]{1,100}

  /**
   * Company Registration Number
   * @minLength 0
   * @maxLength 15
   */
  companyRegistrationNumber?: string

  /**
   * Company Business Number
   */
  businessNumber?: string // pattern: (\d{1,20})?

  /**
   * Country where company is registered
   * @minLength 0
   * @maxLength 3
   */
  countryOfIncorporation?: string

  /**
   * Date on which company was registered
   */
  dateOfIncorporation?: string // format: date-time

  /**
   * Financial Year End for the client company. It's used to drive request for accounting books and balance sheets for the purpose of credit reviews
   */
  financialYearEndDate?: string // format: date-time

  /**
   * SWIFT Code
   * @minLength 0
   * @maxLength 15
   */
  swiftId?: string

  /**
   * Credit Rating
   * @minLength 0
   * @maxLength 15
   */
  creditRating?: string

  /**
   * Reuter ID
   * @minLength 0
   * @maxLength 15
   */
  reuterId?: string

  /**
   * Date when business began
   */
  dateBeganBusiness?: string // format: date-time

  /**
   * Date when became a customer
   */
  dateBecameCustomer?: string // format: date-time

  /**
   * @minLength 0
   * @maxLength 4
   */
  premises?: string

  /**
   * Number of Full-Time Employees
   */
  numberOfFTEs?: string // pattern: (\d{1,7})?

  /**
   * Charity status
   */
  charity?: string

  /**
   * For Australia it's Australia Registration Body Number
   */
  arbn?: string // pattern: (\d{1,9})?

  /**
   * KYC verified by any other system? Y-Yes, N-No or Blank
   * @minLength 0
   * @maxLength 1
   */
  kycVerifiedByOtherSystem?: 'Y' | 'N' | ' '
}

/**
 * Represents a phone contact
 */
export interface Phone {
  /**
   * Contact ID
   * @readonly
   */
  readonly contactId?: string

  //! Proprty Missing in OCC API Documentation
  preferredMethod?: string
  /**
   * ISD Country Code
   */
  countryCode?: string // pattern: ([0-9]{1,3})?

  /**
   * STD Code. e.g. 02, 09, 08 etc
   */
  stdCode?: string // pattern: ([0-9]{1,5})?

  /**
   * Rest of the phone number excluding ISD and STD code
   */
  number?: string // pattern: |([0-9]{1,15})

  /**
   * Date on which the contact expires
   */
  expiryDate?: string // format: date-time

  /**
   * Date from which contract is active
   */
  effectiveDate?: string // format: date-time

  /**
   * Contact Type - specifies what details are held in the contact record. Examples are Home, Work etc.
   */
  type?: 'HM' | 'WK'

  /**
   * Sequence number
   */
  seq: string // pattern: \d{1,5}
}

// ContactDetails Interface
export interface ContactDetails {
  address?: Address[]
  phone?: Phone[]
  fax?: Fax[]
  mobile?: Mobile[]
  email?: Email[]
}

// CustomAttribute Interface
export interface CustomAttribute {
  identifier: string
  value: string
}

// Dependant Interface
export interface Dependant {
  dateOfBirth?: string
  name?: string
  sex?: 'F' | 'M'
  age: string
  seq: string
}

// Deposit Interface
export interface Deposit {
  tradeInAmount?: number
  payoutAmount?: number
  cashRefund?: number
  depositAmount?: number
  bond?: number
}

/**
 * Represents an email contact
 */
export interface Email {
  /**
   * Email address
   * @minLength 0
   * @maxLength 80
   */
  address: string // pattern: [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}

  /**
   * Indicates if this is the default delivery email
   * @minLength 0
   * @maxLength 1
   */
  defaultDelivery?: 'Y' | 'N' | ' '

  /**
   * Date on which the email contact expires
   */
  expiryDate?: string // format: date-time

  /**
   * Preferred method of contact
   * @readonly
   */
  readonly preferredMethod?: string

  /**
   * Contact ID
   * @readonly
   */
  readonly contactId?: string

  /**
   * Date from which the email contact is active
   */
  effectiveDate?: string // format: date-time

  /**
   * Type of email contact
   */
  type?: 'HM' | 'WK' | 'SC'

  /**
   * Sequence number
   */
  seq: string // pattern: \d{1,5}
}

/**
 * Represents employment details
 */
export interface EmploymentDetail {
  /**
   * Employment Type
   * Value supplied must exist in EMPLOYMENT TYPE file in Sovereign.
   */
  employmentType?: EmploymentType

  /**
   * Occupation Code. If provided, it must exist on Sovereign Occupation file
   * @minLength 0
   * @maxLength 3
   */
  occupation?: string

  /**
   * Employment Expiry Date. ISO date YYYY-MM-DD
   */
  expiryDate?: string // format: date-time

  /**
   * Job Description
   * @minLength 0
   * @maxLength 80
   */
  jobDescription?: string

  /**
   * Hours worked per week
   * @minimum 0
   * @maximum 168
   */
  hoursPerWeek?: number

  /**
   * Employer maintenance details
   */
  employerMaint?: ClientMaint

  /**
   * Client Reference
   */
  clientReference?: string // pattern: \d{9}|\d{10}

  /**
   * Employer Name
   * In Sovereign we can have an employment record which has the Employer Name on it with no Employer client number OR an employment record that has no employer name but has an employer client number. In this second scenario, the name and other client related information would be stored against the Employer Client Number.
   * @minLength 1
   * @maxLength 50
   */
  employerName?: string

  /**
   * Effective Date of the employment detail
   */
  effectiveDate: string // format: date-time

  //! Property missing in API Resposne
  /**
   * Sequence number
   */
  seq?: string // pattern: \d{1,5}
}

/**
 * Represents an Employment Type
 */
export interface EmploymentType {
  /**
   * Employment Type Code. Must exist on Sovereign Employment Type file.
   * Typical examples may include Full Time, Part Time, etc
   * @minLength 0
   * @maxLength 4
   */
  type?: string

  /**
   * Description of the Employment Type
   * @readonly
   */
  readonly description?: string
}

// EquipGeneralDetail Interface
export interface EquipGeneralDetail {
  make?: string
  model?: string
  subModel?: string
  registrationReference?: string
  serialNumber?: string
  description?: string
  yearManufactured?: string
  colour?: string
  engineNumber?: string
  valuationAmount?: number
  externalSystemReference: string
}

// EquipmentMaint Interface
export interface EquipmentMaint {
  equipment: string
  assetDetails?: Asset
  equipmentDetails: EquipGeneralDetail
  assetValuations?: AssetValuation[]
  assetOtherClaim?: AssetOtherClaim
  memoMaint?: MemoMaint
}

// ... (continue with more interfaces)

// Fax Interface
export interface Fax {
  number: string
  defaultDelivery?: 'Y' | 'N'
  expiryDate?: string
  preferredMethod?: string
  contactId?: string
  effectiveDate?: string
  type?: 'HM' | 'WK' | 'SC'
  seq: string
}

/**
 * Represents a Fee
 */
export interface Fee {
  /**
   * Fee code. Value supplied must exist on FEE file in Sovereign
   * @example "LIFTI"
   * @minLength 1
   * @maxLength 6
   */
  code: string

  /**
   * Amount
   * @example 12.34
   * @minimum 0
   */
  amount: number

  /**
   * Capitalised. This value is read only.
   * @readonly
   */
  readonly capitalised?: 'Y' | 'N'

  /**
   * Payer
   */
  payer?: string // pattern: |\d{9}|\d{10}

  /**
   * Description (or Description Override if existing)
   * @minLength 0
   * @maxLength 50
   */
  description?: string

  /**
   * GST amount
   * @example 12.34
   * @minimum 0
   */
  gstAmount?: number

  /**
   * ITC amount
   * @example 12.34
   * @minimum 0
   */
  itcAmount?: number

  /**
   * Sequence
   */
  seq?: string // pattern: \d{1,5}

  /**
   * Fee Grouping Code. Value supplied must exist on FEE GROUPING file in Sovereign.
   * @readonly
   */
  readonly groupingCode?: string
}

/**
 * Represents a collection of Fees
 */
export interface Fees {
  /**
   * Array of Fee objects
   */
  fee?: Fee[]

  /**
   * Capitalised Fee Amount
   * @minimum 0
   */
  capitalised?: number

  /**
   * Non-capitalised Fee Amount
   * @minimum 0
   */
  nonCapitalised?: number

  /**
   * Refresh indicator
   * @minLength 0
   * @maxLength 1
   */
  refresh?: 'Y' | 'N' | ' '
}

/**
 * Represents the purchase price details of an Asset/Security
 */
export interface PurchasePrice {
  /**
   * Retail price of the Asset/Security
   * @minimum 0
   */
  retailPrice?: number

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

/**
 * Represents the structure of interest rates
 */
export interface InterestRateStructure {
  /**
   * Initial rate, must provide a rate period
   */
  initialRate: InterestRateType

  /**
   * Rollover rate, should not be provided if the Initial rate is VARIABLE
   */
  rolloverRate?: InterestRateType
}

/**
 * Represents an interest rate type
 */
export interface InterestRateType {
  /**
   * Interest rate type
   */
  rateType: 'FIXED' | 'VARIABLE'

  /**
   * Base rate code
   * @minLength 1
   * @maxLength 3
   */
  baseRate: string

  /**
   * Additional margin to be added to the base rate (can be negative)
   * @minimum 0
   */
  margin: number

  /**
   * Defines the period for the rate. Not to be provided in the Rollover Rate
   */
  ratePeriod?: InterestRatePeriod
}

/**
 * Defines the period for the rate.
 * The interest rate period must not be provided for VARIABLE rate type
 */
export interface InterestRatePeriod {
  /**
   * Finance term.
   */
  term: number

  /**
   * Attribute to indicate [F]ortnights, [M]onths or [Y]ears.
   * @minLength 0
   * @maxLength 1
   */
  termType: 'F' | 'M' | 'Y'
}

// Relationship Interface
export interface Relationship {
  comment?: string // maxLength: 75
  relationshipMaint?: ClientMaint
  clientReference?: string // pattern: \d{9}|\d{10}
  code: string // maxLength: 10
  seq: string // pattern: \d{1,5}
  shortDescription?: string // readOnly
}

/**
 * Represents the actual payment frequency.
 * Originally implemented to support sites with a requirement for fixed interest product repayments on a frequency that differs from the payment frequency.
 * For example, a monthly loan payment frequency with a first payment date aligned with when the borrower is paid, and their income frequency e.g., weekly.
 *
 * Note: this does not affect the instalment schedule. It relates to when the payment instruction is executed.
 * Care should be taken to ensure any payments scheduled to occur before an instalment is due, meet necessary regulatory obligations
 * since early repayment of fixed lending products outside of the repayment schedule does not provide financial benefit to the borrower.
 *
 * For products configured with a daily interest calculation method, 'firstRepaymentDate' and 'value' will default if not supplied.
 * If supplied, the 'value' tag must match the 'code' tag supplied within 'paymentFrequencyType' or a validation error will result.
 */
export interface RepaymentFrequency {
  /**
   * Repayment frequency value.
   * • W = Weekly,
   * • F = Forthnightly,
   * • M = Monthly
   */
  value?: string

  /**
   * First repayment date
   */
  firstRepaymentDate?: string // format: date-time
}

// Total Interface
export interface Total {
  principal: number
  interest: number
  nonCapitalisedFees: number
  gst: number
}

/**
 * Structured Instalment Amount: Parameter 'seq' identifies the sequence of instalment being structured.
 * If 'to' attribute is specified then it is the starting sequence of instalments being structured.
 * Parameter 'to' identifies the end sequence of instalments being structured.
 * Parameter `gstRecoveryOption` indicates if the instalment is a GST recovery instalment.
 * The possible values are 'TOTAL' and 'TOTAL_INST'. 'TOTAL' means the to set the instalment amount to the total gst on account.
 * 'TOTAL_INST' will set the instalment to total gst on account plus normal instalment.
 * Parameter `gstRecoveryOption` can only be set on one instalment
 */
export interface Instalment {
  /**
   * Sequence
   * @example 123
   * @minimum 0
   * @maximum 999
   */
  seq: number

  //! COUND NOT FIELD THIS ATTRIBUTE IN THE API RESPOSNE
  // /**
  //  * Value
  //  * @example 12.34
  //  * @minimum 0
  //  */
  // value: number

  /**
   * GST recovery option
   * @example "TOTAL+INST"
   */
  gstRecoveryOption: 'None' | 'TOTAL+INST' | 'TOTAL' | 'POSSIBLE'

  /**
   * Date
   */
  date?: string // format: date-time

  /**
   * Principal
   * @minimum 0
   */
  principal?: number

  /**
   * Interest
   * @minimum 0
   */
  interest?: number

  /**
   * Fee amount
   * @minimum 0
   */
  feeAmount?: number

  /**
   * Instalment is structured?
   */
  structured?: 'Y' | 'N'

  /**
   * Is held?
   */
  held?: 'Y' | 'N'

  /**
   * External Fee amount
   * @minimum 0
   */
  externalFeeAmount?: number

  /**
   * GST amount
   * @minimum 0
   */
  gstAmount?: number

  /**
   * Instalment amount
   * @minimum 0
   */
  instalmentAmount?: number
}

export interface InsuredMaint {
  insuredClient: InsuredClient
  title?: string
  forename?: string
  surname?: string
  dateOfBirth?: string
}

// InsuredClient Interface
export interface InsuredClient {
  value?: string
  refType: 'SOVEREIGN' | 'EXTERNAL' | 'ASSIGN'
}

// Insurance Interface
// export interface Insurance {
//   insuranceType: string
//   insuranceOption?: string
//   premium: number
//   externalSystemReference: string
//   policyNumber?: string
//   jointCover: 'Y' | 'N' | ' '
//   policyDescription?: string
//   sumInsured?: number
//   surrenderValue?: number
//   commencementDate?: string
//   term: Term
//   expiryDate?: string
//   reviewDate?: string
//   gstOnPremium?: number
//   standardExcess?: number
//   excessCharged?: number
//   earthquakeCoverAmount?: number
//   specialVehicle?: 'Y' | 'N'
//   reportingCommissionPct?: number
//   insured?: Insured
//   seq: string
// }

export interface Insured {
  itemReference?: ItemReference
  insuredMaint?: InsuredMaint
  insuredClientReference?: string // -- Modify App (programmatic) - Client number of Prime (Test how this works for Joint/Double)
}

// Insurance Interface
export interface Insurance {
  insuranceType: string // minLength: 0, maxLength: 4
  insuranceOption?: string // minLength: 0, maxLength: 4
  premium: number // minimum: 0
  externalSystemReference?: string | null // pattern: ([a-zA-Z0-9 ~!@#$%^&*()-_=+\[{\]}\|;:',<.>"/?]{1,25})? //
  policyNumber?: string // pattern: ([a-zA-Z0-9 ~!@#$%^&*()-_=+\[{\]}\|;:',<.>"/?]{1,20})? -- Modify App (manual)
  jointCover: string | null | undefined
  policyDescription?: string // maxLength: 60 // -- Modify App (programmatic)
  sumInsured?: number // minimum: 0 // -- Modify App (programmatic)
  surrenderValue?: number // minimum: 0
  commencementDate?: string // format: date-time // -- Modify App (programmatic), Application Start date
  term: Term // -- Modify App (programmatic) - Policy or Finance Term? (For now, set to loan term)
  expiryDate?: string // format: date-time       // -- Modify App (programmatic) - Maturity Date or Cancellation Date (to be added manually)
  reviewDate?: string // format: date-time
  gstOnPremium?: number // minimum: 0            // -- Modify App (programmatic  - in lambda)
  standardExcess?: number // minimum: 0
  excessCharged?: number // minimum: 0
  earthquakeCoverAmount?: number // minimum: 0
  specialVehicle?: 'Y' | 'N'
  reportingCommissionPct?: number // minimum: 0
  insured?: Insured // -- Modify App (programmatic)
  seq: string // pattern: \d{1,5}
}

// Insurances Interface
export interface Insurances {
  insurance?: Insurance[]
  total?: number
  capitalized?: number
  nonCapitalized?: number
  refresh?: 'Y' | 'N' | ' '
}

/**
 * Represents a structured instalment
 */
export interface StructuredInstalment {
  /**
   * Value of the instalment
   * @minimum 0
   */
  value?: number

  /**
   * Sequence number of the instalment
   * @minimum 0
   * @maximum 999
   */
  seq: number

  /**
   * End sequence number for a range of instalments
   * @minimum 0
   * @maximum 999
   */
  to?: number

  /**
   * Indicates if the instalment is held
   * Held? Y-Yes, N-No
   */
  held?: 'Y' | 'N'

  /**
   * Fee cost on instalment
   */
  instalmentFee?: number

  /**
   * GST Recovery Option
   */
  gstRecoveryOption?: 'TotalGST' | 'TotalGSTPlusInstalment'
}

// StructuredInstalments Interface
export interface StructuredInstalments {
  recalcOption?: 'All' | 'Future' | 'Past'
  structuredInstalment: StructuredInstalment[]
}

// InstalmentBreakdown Interface
export interface InstalmentBreakdown {
  total?: Total
  instalments?: Instalment[]
}

/**
 * Represents a summary of instalments
 */
export interface Summary {
  /**
   * Number of payment Instalments
   * @minimum 0
   * @maximum 999
   */
  instalments: number

  /**
   * Instalment amount
   * @minimum 0
   */
  amount: number

  /**
   * First Instalment Date
   */
  startDate: string // format: date-time

  /**
   * Last Instalment Date
   */
  endDate: string // format: date-time
}

/**
 * Represents financial details
 */
export interface FinancialDetail {
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

  /**
   * Purchase price details
   */
  purchasePrice: PurchasePrice

  /**
   * Interest rate. Not be supplied if the Interest Rate Structure is also provided
   * @minimum 0
   */
  interestRate: number

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
  taxTreatment?: string

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

// PaymentMethod Interface
export interface PaymentMethod {
  bankAccountNumber?: string // maxLength: 24, pattern: |([0-9 \-]{1,25})
  paymentMethod:
    | 'CHQ'
    | 'DC'
    | 'CASH'
    | 'BPAY'
    | 'DD'
    | 'AUTOPAY'
    | 'COUPON'
    | 'TELEPHONE'
}

// GuarantorGeneralDetail Interface
export interface GuarantorGeneralDetail {
  externalSystemReference?: string // pattern: ([a-zA-Z0-9 ~!@#$%^&*()-_=+\[{\]}\|;:',<.>"/?]{1,25})?
  guaranteeType: 'ALL' | 'HPG' | 'LSG' | 'MAX' | 'SPC' | 'USG'
  guarantorClientNumber?: string // pattern: |\\d{9}|\\d{10}
  guaranteeAmount?: number
  guaranteeDescription?: string // maxLength: 60
  guarantorNetWorth?: number
}

/**
 * Represents an Income or Expense item
 */
export interface IncomeExpense {
  /**
   * First amount with optional frequency
   */
  amount1?: AmountWithOptionalFrequency

  /**
   * Second amount with optional frequency
   */
  amount2?: AmountWithOptionalFrequency

  /**
   * Third amount with optional frequency
   */
  amount3?: AmountWithOptionalFrequency

  /**
   * Are you refinancing? Valid Values: Y-Yes, N-No or Blank.
   * If value is Y then the expenditure item will cease when this loan takes effect.
   */
  refinance?: 'Y' | 'N' | 'Blank'

  /**
   * Description of the income or expense
   * @minLength 0
   * @maxLength 30
   */
  description?: string

  /**
   * Related Income/Expense Code. Values supplied must exist on SOP INCOME/EXPEND file in Sovereign.
   * @minLength 0
   * @maxLength 9
   */
  relatedIECode?: string

  /**
   * Values supplied must exist on SOP INCOME/EXPEND file in Sovereign.
   * @minLength 0
   * @maxLength 9
   */

  //! Property missing in API resposne, so making it optional for now.
  code?: string

  /**
   * Sequence number
   */
  seq?: string // pattern: \d{1,5}
}

// AmountWithOptionalFrequency Interface (referenced in IncomeExpense)
export interface AmountWithOptionalFrequency {
  value: number // minimum: 0
  //! Frequency came back with 'N' for application number 0021627245, adding N to the types so that applcation doesn't cause an error
  frequency?: 'D' | 'F' | 'M' | '4' | 'Q' | 'W' | 'Y' | 'N' | ''
}

/**
 * Represents individual details of a person
 */
export interface IndividualDetails {
  /**
   * Title of the individual
   * @minLength 0
   * @maxLength 8
   */
  title?: string

  /**
   * Suppress 'Title' requirement. Default to 'N' if empty.
   * @minLength 0
   * @maxLength 1
   */
  suppressTitle?: 'Y' | 'N' | ' '

  /**
   * Forename of the individual
   */
  forename?: string // pattern: [a-zA-Z0-9 '-]{0,50}

  /**
   * Surname of the individual
   */
  surname?: string // pattern: [a-zA-Z0-9 '-]{1,50}

  /**
   * Maiden name of the individual
   * @minLength 0
   * @maxLength 30
   */
  maidenName?: string

  /**
   * Preferred name of the individual
   * @minLength 0
   * @maxLength 30
   */
  preferredName?: string

  /**
   * Gender of the individual
   */
  gender?: string

  /**
   * Date of Birth
   */
  dateOfBirth?: string // format: date

  /**
   * Indicates if the date of birth was refused
   */
  dateOfBirthRefused?: string

  /**
   * Date of Death
   */
  dateOfDeath?: string // format: date-time

  /**
   * Marital status of the individual
   */
  maritalStatus?: string

  /**
   * Country of Residence. Value supplied must exist in COUNTRY file in Sovereign
   * @minLength 0
   * @maxLength 3
   */
  countryOfResidence?: string

  /**
   * Country of Citizenship. Value supplied must exist in COUNTRY file in Sovereign
   * @minLength 0
   * @maxLength 3
   */
  countryOfCitizenship?: string

  /**
   * Number of dependants
   */
  numberOfDependants?: string // pattern: (\d{1,3})?

  /**
   * Number of adults
   */
  numberOfAdults?: string // pattern: ([1-9 ])?

  /**
   * Accommodation type. Value supplied must exist in ACCOMODATION TYPE file in Sovereign
   */
  accommodation?: CodeDescPair

  /**
   * Indicates if the individual is a resident
   * @minLength 0
   * @maxLength 1
   */
  resident?: 'Y' | 'N' | ' '

  /**
   * Indicates if the individual is a smoker
   * @minLength 0
   * @maxLength 1
   */
  smoker?: 'Y' | 'N' | ' '

  /**
   * Whether the client is KYC verified by the user
   * @minLength 0
   * @maxLength 1
   */
  kycVerified?: 'Y' | 'N' | ' '

  /**
   * Whether the client is already KYC verified by another system
   * @minLength 0
   * @maxLength 1
   */
  kycVerifiedByOtherSystem?: 'Y' | 'N' | ' '

  /**
   * Indicates if the individual is politically exposed
   * @minLength 0
   * @maxLength 1
   */
  politicallyExposed?: 'Y' | 'N' | ' '

  /**
   * Indicates if electronic consent is held
   * @minLength 0
   * @maxLength 1
   */
  electronicConsentHeld?: 'Y' | 'N' | ' '

  /**
   * Indicates if the client has other names
   * @minLength 0
   * @maxLength 1
   */
  clientOtherNamesExist?: 'Y' | 'N' | ' '

  /**
   * Client Alias names
   * @minItems 1
   */
  clientOtherNames?: ClientOtherName[]
}

// IndustryCode Interface
export interface IndustryCode {
  level1: string // minLength: 1, maxLength: 2
  level2?: string // minLength: 1, maxLength: 2
  level3?: string // minLength: 1, maxLength: 2
}

/**
 * Represents a key person in an organization
 */
export interface KeyPerson {
  /**
   * Role of the key person
   */
  role: CodeDescPair

  /**
   * Maintenance details of the key person
   */
  keyPersonMaint?: ClientMaint

  /**
   * Existing client reference can be provided OR a new client record will be created from the details in the keyPersonMaint element.
   */
  clientReference?: string // pattern: \d{9}|\d{10}

  /**
   * Account role of the key person
   * @minLength 0
   * @maxLength 6
   */
  accountRole?: string
}

// LoanPurpose Interface
export interface LoanPurpose {
  level1: string // minLength: 1, maxLength: 4
  level2: string // maxLength: 4
}

// Memo Interface
export interface Memo {
  refType?: 'ASSIGN'
}

/**
 * Represents memo maintenance details
 */
export interface MemoMaint {
  /**
   * Memo details
   */
  memo?: Memo

  /**
   * Subject of the memo
   */
  subject?: string // pattern: ([a-zA-Z0-9 ~!@#$%^&*()-_=+\[{\]}\|;:',<.>"/?]{1,30})?

  /**
   * Severity of the memo
   * Value supplied must exist on MEMO SEVERITY file in Sovereign.
   * @minLength 0
   * @maxLength 2
   */
  severity?: string

  /**
   * Memo lines
   */
  memoLines?: MemoLines
}

// MemoLines Interface
export interface MemoLines {
  text: string[] // minItems: 1, maxItems: 2147483647
}

// MiscGeneralDetail Interface
export interface MiscGeneralDetail {
  description?: string // minLength: 1, maxLength: 100
  valuationAmount?: number // minimum: 0
  externalSystemReference?: string // pattern: ([a-zA-Z0-9 ~!@#$%^&*()-_=+\[{\]}\|;:',<.>"/?]{1,25})?
}

/**
 * Represents miscellaneous maintenance details
 */
export interface MiscellaneousMaint {
  /**
   * Identifier for the security. At this time since the only allowed mode is Add, there is no reference.
   * Attributes: ref-type: '*Assign' meaning allow Sovereign to automatically assign the next misc security number.
   */
  miscellaneous?: string // pattern: (\d{10})?

  /**
   * Miscellaneous general details
   */
  miscDetails: MiscGeneralDetail

  /**
   * Most recent agreed value
   */
  assetValuations?: AssetValuation[]

  /**
   * Memo maintenance details
   */
  memoMaint?: MemoMaint

  /**
   * Asset details
   * @readonly
   */
  readonly assetDetails?: Asset
}

/**
 * Represents a mobile contact
 */
export interface Mobile {
  //! Property mssing in OCC API Docs
  preferredMethod?: string
  /**
   * Contact ID
   * @readonly
   */
  readonly contactId?: string

  /**
   * Country code for the mobile number
   */
  countryCode?: string // pattern: ([0-9]{1,3})?

  /**
   * Network code for the mobile number
   */
  networkCode?: string // pattern: ([0-9]{1,5})?

  /**
   * Mobile number
   */
  number?: string // pattern: |([0-9]{1,15})

  /**
   * Date on which the contact expires
   */
  expiryDate?: string // format: date-time

  /**
   * Date from which contact is active
   */
  effectiveDate?: string // format: date-time

  /**
   * Contact Type - specifies what details are held in the contact record. Examples are Home, Work etc.
   */
  type?: 'MB' // pattern: MB

  //! Proprty missing in API Reponse
  /**
   * Sequence number
   */
  seq?: string // pattern: \d{1,5}
}

export interface OdometerType {
  /**
   * Odometer reading
   */
  value: number

  /**
   * Unit of measurement
   */
  unit: 'K' | 'M' | 'H'
}

/**
 * Originator is the entity that brings in the loan application, such as dealers or dealership
 */
export interface Originator {
  /**
   * Sovereign client number of the dealer/dealership. It is ten digits long.
   * Value supplied must exist on ORIGINATOR file in Sovereign.
   * @example "1000234132"
   * @readonly
   */
  readonly clientNumber?: string

  /**
   * Value of the originator
   */
  value?: string // pattern: |\d{9}|\d{10}

  /**
   * Franchise. Value supplied must exist on FRANCHISE file in Sovereign.
   * @minLength 0
   * @maxLength 10
   */
  franchise?: string
}

/**
 * Represents a payment instruction
 */
export interface PaymentInstruction {
  /**
   * Effective Date of the relationship. Must equal to settlement date. ISO Date YYYY-MM-DD
   */
  effectiveDate?: string // format: date-time

  /**
   * Payment Method Code. The payment method must be enabled at the product level to be able to be used.
   */
  paymentMethod?:
    | 'CHQ'
    | 'DC'
    | 'CASH'
    | 'BPAY'
    | 'DD'
    | 'AUTOPAY'
    | 'COUPON'
    | 'TELEPHONE'

  /**
   * Amount of the payment
   * @minimum 0
   */
  amount?: number

  /**
   * Name of the payee
   * @minLength 1
   * @maxLength 40
   */
  payeeName?: string

  /**
   * Description, if provided will override standard one from Sovereign.
   * @minLength 0
   * @maxLength 50
   */
  descriptionOverride?: string

  /**
   * Bank Account number. This is checked to be a valid Bank Account format, as configured in Sovereign.
   * @minLength 0
   * @maxLength 24
   */
  bankAccountNumber?: string // pattern: |([0-9 \-]{1,25})

  /**
   * Alpha particulars
   * @minLength 0
   * @maxLength 12
   */
  alphaParticulars?: string

  /**
   * Analysis code
   * @minLength 0
   * @maxLength 12
   */
  analysisCode?: string

  /**
   * Reference
   * @minLength 0
   * @maxLength 12
   */
  reference?: string

  /**
   * Sequence number
   */
  seq?: string // pattern: \d{1,3}

  /**
   * Associated client sequence number
   */
  associatedClientSeq?: string // pattern: \d{1,3}

  /**
   * Payment Instruction Code
   */
  code?:
    | 'DD'
    | 'ID'
    | 'NP'
    | 'AP'
    | 'BP'
    | 'BR'
    | 'MB'
    | 'II'
    | 'MB'
    | 'MI'
    | 'MP'
    | 'PW'
    | 'RF'
    | 'RP'
    | 'SR'
    | 'WT'
}
// RegionCodes Interface
export interface RegionCodes {
  type?: string // maxLength: 2
  level1?: string // maxLength: 4
  level2?: string // maxLength: 4
  level3?: string // maxLength: 4
}

// Relationship Interface
export interface Relationship {
  clientMaint?: ClientMaint
  clientReference?: string
  relationshipType?: string
  effectiveDate?: string
  expiryDate?: string
  seq: string
}

/**
 * Security represents security used for loans, such as cars.
 */
export interface Security {
  /**
   * Unique identifier for the security
   * @readonly
   */
  readonly id?: string

  /**
   * Asset details
   */
  asset?: Asset

  /**
   * Account security details
   */
  accountSecurity?: AccountSecurity

  /**
   * Vehicle maintenance details
   */
  vehicleMaint?: VehicleMaint

  /**
   * Equipment maintenance details
   */
  equipmentMaint?: EquipmentMaint

  /**
   * Miscellaneous maintenance details
   */
  miscellaneousMaint?: MiscellaneousMaint

  /**
   * Guarantor maintenance details
   */
  guarantorMaint?: GuarantorMaint

  /**
   * Sequence number
   */
  seq: string // pattern: \d{1,5}
}

// StreetNumber Interface
export interface StreetNumber {
  from?: string
  to?: string
}

export interface Term {
  /**
   * Term value
   * @minimum 1
   */
  value: number

  /**
   * Term unit
   * @example "M-Monthly, W-Weekly"
   */
  unit: 'D' | 'W' | 'F' | 'M' | 'Q' | 'Y'
}

export interface GuarantorMaint {
  //! Property missing in API resposne
  /**
   * Associated Client Sequence. This value must match the sequence of Guarantor in associated client section.
   */
  associatedClientSeq?: string // pattern: \d{1,3}

  /**
   * Guarantor General Details
   */
  guarantorGeneralDetail: GuarantorGeneralDetail

  /**
   * Asset Number of Guarantor
   */
  guarantor?: string // pattern: (\d{10})?

  /**
   * Guarantor Asset Details
   */
  assetDetails?: Asset // readOnly

  /**
   * Memo details, which will be applied to the equipment asset
   */
  memoMaint?: MemoMaint
}

/**
 * A changed loan application only contains id and last changed date.
 */
export interface ChangedApplication {
  /**
   * External Application Number
   * @example "1002393249"
   * @pattern |\\d{9}|\\d{10}
   */
  applicationExternalNumber: string

  /**
   * Last change date-time
   * @example "2019-12-31T23:59:59"
   */
  lastSavedDateTime: string
}

// ... (continue with any remaining interfaces)

/**
 * Represents an application error
 */
export interface AppError {
  /**
   * The time when the error occurred
   */
  time?: string

  /**
   * The error code
   */
  errorCode?: string

  /**
   * The error message
   */
  errorMessage?: string

  /**
   * The severity of the error
   */
  severity?: string

  /**
   * The sequence number of the error
   */
  sequence?: number
}

/**
 * Represents a loan application response
 */
export interface LoanApplicationResponse {
  /**
   * Sovereign Application Number
   */
  id?: string

  /**
   * Sovereign Reference
   * @minLength 0
   * @maxLength 10
   */
  sovereignRef: string

  /**
   * Sovereign Application Number
   */
  applicationRef?: string

  /**
   * Message returned by Sovereign
   */
  message: Message

  /**
   * Result of the application
   * @pattern |S|F
   */
  result: 'S' | 'F' | ''

  /**
   * Array of application errors
   */
  appErrors?: AppError[]
}

/**
 * Represents a message
 */
export interface Message {
  /**
   * The content of the message
   */
  value?: string

  /**
   * The identifier of the message
   */
  id: 'SOA-FNDGOOD' | 'SOA-FNDERR'

  /**
   * The category of the message
   */
  cat: 'I' | 'E'
}

// ItemReference Interface
export interface ItemReference {
  value?: string // -- Modify App (programmatic) - Can be empty string
  type?: 'A' | 'C' | 'K' | 'P' | 'S' | 'V' | '' // -- Modify App (programmatic) - Use 'S' (Security)
}

export interface included {
  type: string
  id: string
}

//? ----- Included Assosiated Clients ------

//* ----- The Included Array has the following types ------
//? 1. associatedClients (attributes.role: GUAR, CO-BOR, ORIG, PRIMEB)
//? 2. ClientMaint ("id": Client_number (Could be first credit union, ignore these))
//? 3. securities (id: 0000184152)

export interface Included_ApplicationIncluded_Base {
  type: 'associatedClients' | 'ClientMaint' | 'securities'
  id: string
  attributes: unknown
  relationships?: Included_ApplicationRelationships
  links?: {
    self: string
  }
}

export interface Included_ApplicationIncluded_Base_Draft {
  type: 'associatedClients' | 'securities'
  id: string
  attributes: unknown
  relationships?: Included_ApplicationRelationships
  links?: {
    self: string
  }
}
export interface Included_AssosiatedClients_Base {
  type: 'associatedClients'
  id: string
  attributes: Included_Application_AssociatedClientsAttributes
  relationships?: Included_ApplicationRelationships
  links: {
    self: string
  }
}

export interface Included_AssosiatedClients_Base_Draft {
  type: 'associatedClients'
  id: string
  attributes: AssociatedClient
}
export interface Included_ClientMaint_Base {
  type: 'ClientMaint'
  id: string
  attributes: ClientMaint
  relationships?: Included_ApplicationRelationships
  links: {
    self: string
  }
}
export interface Included_AccountSecurity_Base {
  type: 'securities'
  id: string
  attributes: AccountSecurity
  relationships?: Included_ApplicationRelationships
  links: {
    self: string
  }
}
export interface Included_Application_AssociatedClientsAttributes {
  attributes: Incuded_Attributes_AssociatedClient
}
export interface Included_Application_AccountSecurityAttributes {
  attributes: AccountSecurity
}
export interface Included_Application_ClientMaintAttributes {
  attributes: ClientMaint
}

export interface Incuded_Attributes_AssociatedClient {
  '@id': string
  role:
    | 'PRIMEB'
    | 'CO-BOR'
    | 'GUAR'
    | 'PRIMED'
    | 'CO-DEP'
    | 'ORIG'
    | 'ATOMBR'
    | 'ATONMBE'
    | 'AUTSIG'
    | 'IBADMIN'
    | 'PARTNE'
    | 'POAMBR'
    | 'POANMB'
    | 'RAGUAR'
    | 'SECPRV'
    | 'TRSTEE'
    | 'MATCHP'
    | 'MATCHC'
}

export interface Included_Attributes_SecurityMiscellaneous {
  '@id': string
  accountSecurity: AccountSecurity
  miscellaneousMaint: Included_ApplicationMiscellaneousMaint
  id: string
  type: string
}

export interface Included_Attributes_SecurityVehicle {
  vehicleMaint: VehicleMaint
}

export interface Included_ApplicationAttributes {
  generalDetails?: Included_ApplicationGeneralDetails
  bankAccounts?: Included_ApplicationBankAccount[]
  clientIdentifications?: Included_ApplicationClientIdentification[]
  contactDetails?: Included_ApplicationContactDetails
  employmentDetails?: Included_ApplicationEmploymentDetail[]
  relationships?: Included_ApplicationRelationship[]
  aml?: Included_ApplicationAML
  clientCapacity?: Included_ApplicationClientCapacity
  keyPersons?: Included_ApplicationKeyPerson[]
  accountSecurity?: Included_ApplicationAccountSecurity
  vehicleMaint?: Included_ApplicationVehicleMaint
  miscellaneousMaint?: Included_ApplicationMiscellaneousMaint
  guarantorMaint?: Included_ApplicationGuarantorMaint
}

export interface Included_ApplicationGeneralDetails {
  clientType: string
  status: {
    code: string
  }
  industryCode: Record<string, unknown>
  gna: string
  mailOutRestriction?: string
  existingClient: string
  defaultManager?: string
  whtCategory?: string
  defaultClientOrganisation: Record<string, unknown>
  companyDetails?: {
    numberOfFTEs: string
  }
  individualDetails?: Included_ApplicationIndividualDetails
  name?: string
}

export interface Included_ApplicationIndividualDetails {
  title: string
  surname: string
  preferredName?: string
  forename?: string
  gender: string
  dateOfBirth: string
  dateOfBirthRefused?: string
  numberOfDependants: string
  numberOfAdults: string
  resident: string
  smoker?: string
  accommodation?: {
    code: string
    description: string
  }
}

export interface Included_ApplicationBankAccount {
  accountNumber: string
  title: string
  seq: string
  expiryDate?: string
}

export interface Included_ApplicationClientIdentification {
  idCode1: string
  effectiveDate: string
  reference: string
  seq: string
  idCode2?: string
  expiryDate?: string
}

export interface Included_ApplicationContactDetails {
  address: Included_ApplicationAddress[]
  phone?: Included_ApplicationPhone[]
  mobile?: Included_ApplicationMobile[]
  email?: Included_ApplicationEmail[]
}

export interface Included_ApplicationAddress {
  streetNumber: {
    from: string
    to: string
  }
  streetOrPostalName: string
  suburb?: string
  city: string
  postCode?: string
  country: {
    code: string
    description: string
  }
  contactId: string
  purpose: string
  effectiveDate: string
  type: string
  unitType?: string
  apartment?: string
  streetType?: string
}

export interface Included_ApplicationPhone {
  countryCode: string
  stdCode: string
  number: string
  preferredMethod: string
  effectiveDate: string
  type: string
  seq: string
}

export interface Included_ApplicationMobile {
  countryCode: string
  networkCode: string
  number: string
  preferredMethod: string
  effectiveDate: string
  type: string
}

export interface Included_ApplicationEmail {
  address: string
  preferredMethod: string
  effectiveDate: string
  type: string
  seq: string
}

export interface Included_ApplicationEmploymentDetail {
  employmentType: {
    type: string
    description: string
  }
  occupation?: string
  jobDescription: string
  employerName: string
  effectiveDate: string
}

export interface Included_ApplicationRelationship {
  relationshipMaint: {
    clientID: string
    generalDetails: Included_ApplicationGeneralDetails
    contactDetails: Included_ApplicationContactDetails
  }
  code: string
  seq: string
}

export interface Included_ApplicationAML {
  regulated: string
  kycVerified: string
  kycVerifiedOtherSystem: string
  additionalTrusteesExist: string
}

export interface Included_ApplicationClientCapacity {
  collectionDate: string
  capacityAssessment: {
    selfDeclaration: string
    selfDeclarationAccepted: string
    reductionClaimed: string
  }
  assets: Included_ApplicationCapacityItem[]
  liabilities: Included_ApplicationCapacityItem[]
  incomes: Included_ApplicationCapacityIncomeItem[]
  expenses: Included_ApplicationCapacityIncomeItem[]
  joint: string
}

export interface Included_ApplicationCapacityItem {
  amount: number
  description: string
  code: string
}

export interface Included_ApplicationCapacityIncomeItem {
  amount1: {
    value: number
    frequency: string
  }
  amount2: {
    value: number
    frequency?: string
  }
  amount3: {
    value: number
  }
  description: string
}

export interface Included_ApplicationKeyPerson {
  role: {
    code: string
    description: string
  }
  keyPersonMaint: {
    clientID: string
    generalDetails: Included_ApplicationGeneralDetails
    contactDetails: Included_ApplicationContactDetails
  }
}

export interface Included_ApplicationAccountSecurity {
  assetNumber: string
  primaryCollateral: string
  id: string
  type: {
    code: string
    description: string
  }
  effectiveDate: string
  taxableActivity?: string
  clientSecurityRelationship: string
  appPctToUse: string
  supplierOfGoods: string
  intendedUse: string
  usageAllowance: number
  usageExcessCharge: number
  fleetDiscountRate: number
  possessionDate: string
  usageFrequencyUnit: number
  usageInitialReading: number
  usageRebate: number
  condition: {
    code?: string
    description: string
  }
  registrationNumber?: string
  registrationYear: number
  description?: string
  colour?: string
  value: number
  odometer: number
  odometerUnitOfMeasure?: string
  modifiedVehicle?: string
  securityPmsi: {
    description: string
  }
  usageWaiverPercentage: number
}

export interface Included_ApplicationVehicleMaint {
  vehicle: {
    value: string
  }
  assetDetails: Included_ApplicationAssetDetails
  vehicleDetails: Included_ApplicationVehicleDetails
}

export interface Included_ApplicationAssetDetails {
  assetNumber: string
  assetType?: string
  classificationCode: string
  securityStatus: {
    description: string
  }
  securityPercentageToUse: string
  condition: {
    code?: string
    description: string
  }
  assetClassification: {
    code: string
    description: string
  }
}

export interface Included_ApplicationVehicleDetails {
  make: string
  model: string
  countryFirstRegistered: string
  registrationNumber: string
  registrationYear: string
  bodyStyle: string
  description: string
  value: string
  colour: string
  transmissionType: string
  fuelType: string
  engineCc: string
  engineNumber: string
  odometer: string
  odometerUnitOfMeasure: string
  motochekPerformed: string
  vin: string
  registeredInterests: string
  numberOfDoors: string
  fourWheelDrive: {
    code: string
    description: string
  }
  turbo: {
    code: string
    description: string
  }
  lctExempt: string
  nonStandardVehicle: {
    code: string
    description: string
  }
  modifiedVehicle: {
    code: string
    description: string
  }
  manufactureDate: string
  fuelUsageCity: string
}

export interface Included_ApplicationMiscellaneousMaint {
  miscellaneous: string
  miscDetails: {
    description: string
  }
  memoMaint: Included_ApplicationMemoMaint
  assetDetails: Included_ApplicationAssetDetails
}

export interface Included_ApplicationMemoMaint {
  memo: {
    refType: string
  }
  subject: string
  memoLines: {
    text: string[]
  }
}

export interface Included_ApplicationGuarantorMaint {
  guarantor: string
  assetDetails: Included_ApplicationAssetDetails
  guarantorGeneralDetail: {
    guarantorClientNumber: string
    guaranteeType: string
    guaranteeAmount: number
    guaranteeDescription: string
    guarantorNetWorth: number
  }
}

export interface Included_ApplicationRelationships {
  clientMaint?: {
    links: {
      related: string
      self: string
    }
    data: {
      type: string
      id: string
    }
  }
}

// Commit Control 1

export interface ApplicationDateSince {
  type: string
  id: string
  attributes: {
    lastSavedDateTime: string
  }
  links: {
    self: string
  }
}
export interface ApplicationMedium {
  type: string
  id: string
  attributes: {
    applicationInternalNumber: string
    applicationName: string
    clientApplication: string
    loadedByClientNumber: string
    owner: string
    applicationTitle: string
    tradingBranch: string
    salesChannel: string
    subPrime: string
    comparisonRatesSupplied: string
    paymentMethod: string
    type: string
    appStatusDesc: string
    appStatusCode: string
    currentTaskWith: string
    lastSavedDateTime: string // Added this field
  }
  relationships: {
    originator: RelationshipApplicationMedium
    associatedClients: RelationshipApplicationMedium
  }
}

interface RelationshipApplicationMedium {
  links: LinkApplicationMedium
  data: unknown
}

interface LinkApplicationMedium {
  related: string
  self: string
}
