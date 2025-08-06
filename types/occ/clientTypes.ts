import { Client_IncludedItem } from './clientIncludedType'

/**
 * Represents the response for a client update operation
 */
export interface Client_ClientUpdateResponse {
  clientNumber?: string
  summaries?: string[]
}

/**
 * Represents an address
 */
export interface Client_Address {
  /**
   * Unique Address identifier.
   * Must be provided at client creation time and should be same as 'addresses' relationship Id.
   * Refer https://jsonapi.org/format/#crud-creating-client-ids for further details.
   */
  id?: string

  /**
   * Contact Type
   * @example "RS-Residential, ML-Mailing, RG-Registered"
   */
  contactType: 'RS' | 'ML' | 'RG'

  /**
   * Care of Name
   * @minLength 0
   * @maxLength 60
   */
  careOfName?: string

  /**
   * Unit Type
   * @minLength 0
   * @maxLength 10
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
   * Street Number
   */
  streetNumber?: Client_StreetNumber

  /**
   * Alpha
   * @minLength 0
   * @maxLength 1
   * @pattern "[A-Z]"
   */
  alpha?: string

  /**
   * Street Name. Either this or suburb is required
   * @minLength 0
   * @maxLength 60
   */
  streetOrPostalName?: string

  /**
   * Street Type. Value supplied must exist in STREET TYPE File in Sovereign.
   * @example "Street-ST, Avenue-AV, Road-RD, Place-PL, etc"
   * @minLength 0
   * @maxLength 2
   */
  streetType?: string

  /**
   * Street Direction
   * @example "Central, East, Extension, Loop,Side Road, South, Upper, West"
   * @minLength 0
   * @maxLength 10
   */
  streetDirection?:
    | 'Central'
    | 'East'
    | 'Extension'
    | 'Loop'
    | 'Lower'
    | 'No 1'
    | 'No 2'
    | 'North'
    | 'Side Road'
    | 'South'
    | 'Upper'
    | 'West'

  /**
   * Suburb. Either this or streetOrPostalName is required. Value supplied must exist in POST CODE AUS or POST CODE NZ files.
   * @minLength 0
   * @maxLength 35
   */
  suburb?: string

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
   * @pattern "[0-9]{4,15}"
   */
  postCode?: string

  /**
   * Country. Required for create. Value supplied must exist in COUNTRY File in Sovereign.
   */
  country: Client_CodeDescPair

  /**
   * Priority
   */
  priority?: number

  /**
   * Contact ID
   * @readonly
   */
  readonly contactId?: string

  /**
   * Address Line 1
   * @readonly
   */
  readonly addressLine1?: string

  /**
   * Address Line 2
   * @readonly
   */
  readonly addressLine2?: string

  /**
   * Address Line 3
   * @readonly
   */
  readonly addressLine3?: string

  /**
   * Address Line 4
   * @readonly
   */
  readonly addressLine4?: string

  /**
   * Address Line 5
   * @readonly
   */
  readonly addressLine5?: string

  /**
   * Address Line 6
   * @readonly
   */
  readonly addressLine6?: string

  /**
   * Address Line 7
   * @readonly
   */
  readonly addressLine7?: string

  /**
   * Address Purpose
   * @example "R-Residential, M-Mailing, G-Registered"
   */
  purpose: 'R' | 'M' | 'G'

  /**
   * Effective Date
   */
  effectiveDate: string // format: date

  /**
   * Address Type
   * @example "S-Street Address, P-Postal Address"
   */
  addressType: 'S' | 'P'

  /**
   * Address Sequence
   * @readonly
   */
  readonly seq?: string

  /**
   * @minLength 0
   * @maxLength 10
   */
  surrogate?: string

  expiryDate?: string // format: date

  /**
   * Preferred Method
   * @example "Post or Mail"
   * @minLength 0
   * @maxLength 1
   */
  preferredMethod?: 'Y' | 'N' | ''

  linkType?: string

  /**
   * @minLength 0
   * @maxLength 12
   */
  floor?: string

  /**
   * @minLength 0
   * @maxLength 15
   */
  streetAliasId?: string

  /**
   * @minLength 0
   * @maxLength 15
   */
  suburbAliasId?: string

  /**
   * @minLength 0
   * @maxLength 15
   */
  cityTownAliasId?: string

  /**
   * @minLength 0
   * @maxLength 10
   */
  deliveryPointId?: string

  /**
   * @minLength 0
   * @maxLength 1
   */
  checkedFlag?: 'Y' | 'N' | ''

  /**
   * @readonly
   */
  readonly latitude?: number

  /**
   * @readonly
   */
  readonly longitude?: number

  /**
   * @readonly
   */
  readonly addressVerificationService?: string

  /**
   * @readonly
   */
  readonly externalWebServiceId?: string
}

/**
 * Represents a bank account
 */
export interface Client_BankAccount {
  /**
   * The bank and branch number (for New Zealand) or BSB (for Australia) must exist on the BANK BRANCH - NZ File or BANK STATE BRANCH- AUS BSB file.
   * @pattern "[0-9 \-]{1,25}"
   */
  accountNumber: string

  /**
   * Account Title
   * @minLength 0
   * @maxLength 30
   */
  title?: string

  expiryDate?: string // format: date

  /**
   * @minLength 0
   * @maxLength 1
   */
  defaultBillPayAccount?: string
}

/**
 * Represents a street number
 */
export interface Client_StreetNumber {
  from?: string // pattern: (\d{1,15})?
  to?: string // pattern: (\d{1,15})?
}

/**
 * Represents a code-description pair
 */
export interface Client_CodeDescPair {
  code?: string
  description?: string
}

/**
 * Client details.
 */
export interface ClientMain_Client {
  /**
   * @readonly
   */
  readonly clientNumber?: string // pattern: |\d{9}|\d{10}

  generalDetails: Client_ClientGeneralDtl
  bankAccounts?: Client_BankAccount[]
  employmentDetails?: Client_EmploymentDetail[]
  contacts?: Client_Contact[]
  addresses?: Client_Address[]
  identifications?: Client_ClientIdentification[]
}

/**
 * Represents general details of a client
 */
export interface Client_ClientGeneralDtl {
  /**
   * Client Type can be 'C' - Company or 'I' - Individual
   */
  clientType: 'C' | 'I'

  status: Client_ClientStatus // TODO: Add type
  industryCode?: Client_IndustryCode

  /**
   * @minLength 0
   * @maxLength 55
   */
  websiteAddress?: string

  /**
   * Gone No Address. Default to 'N' if empty.
   * @minLength 0
   * @maxLength 1
   */
  gna?: 'Y' | 'N' | ''

  /**
   * Mail out restriction applies to client? Default to 'N' if empty.
   * @minLength 0
   * @maxLength 2
   */
  mailOutRestriction?: 'Y' | 'N' | ''

  /**
   * @minLength 0
   * @maxLength 1
   */
  existingClient?: 'Y' | 'N' | ''

  /**
   * Inland Revenue Department number. Sovereign will check the number supplied is valid.
   * @minLength 0
   * @maxLength 12
   */
  irdNumber?: string

  /**
   * Tax File Number (Australia). Sovereign will check the number supplied is valid.
   * @minLength 0
   * @maxLength 12
   */
  tfnNumber?: string

  /**
   * Goods and Service Tax Number. Sovereign will check the number supplied is valid.
   * @minLength 0
   * @maxLength 12
   */
  gstNumber?: string

  /**
   * Australian Business Number(Aus), Company Registration Number(NZ). Sovereign will check the number supplied is valid.
   * @minLength 0
   * @maxLength 12
   */
  abnNumber?: string

  /**
   * Broker or Dealer. Value supplied must exist in ORIGINATING SOURCE File in Sovereign.
   * @minLength 0
   * @maxLength 6
   */
  originatingSource?: string

  /**
   * @minLength 0
   * @maxLength 15
   */
  reserveBankCoding?: string

  /**
   * @readonly
   */
  readonly defaultClientOrganisation?: Client_ClientOrganisation

  /**
   * @minLength 0
   * @maxLength 4
   */
  analysisCode?: string

  /**
   * Value supplied must exist in GENERIC CODES FIELDS File WHERE Generic Code Type is ORC in Sovereign.
   * @minLength 0
   * @maxLength 2
   */
  gstabnOverrideReason?: string

  companyDetails?: Client_CompanyDetails
  individualDetails?: Client_IndividualDetails

  /**
   * Only used in North American environments.
   * @minLength 0
   * @maxLength 3
   */
  bankruptcyPosition?: string

  /**
   * Only used in North American environments.
   */
  bankruptcyDate?: string // format: date

  /**
   * @minLength 0
   * @maxLength 1
   */
  analysisCodeNumber?: string

  /**
   * @minLength 0
   * @maxLength 10
   */
  defaultDealerBrokerNumber?: string

  /**
   * @minLength 0
   * @maxLength 6
   */
  employeeKeyPersonInitials?: string

  /**
   * @minLength 0
   * @maxLength 1
   */
  analysisCode2Number?: string

  /**
   * @minLength 0
   * @maxLength 4
   */
  analysisCode2?: string

  /**
   * @minLength 0
   * @maxLength 1
   */
  analysisCode3Number?: string

  /**
   * @minLength 0
   * @maxLength 4
   */
  analysisCode3?: string

  /**
   * @readonly
   */
  readonly shortname?: string

  /**
   * Default to 'N' if empty.
   */
  statementHold?: 'Y' | 'N' | ''

  /**
   * The date the application is loaded. Default to Run date(i.e. current date) of Sovereign system.
   * @readonly
   */
  readonly loadedDate?: string // format: date

  /**
   * Start Time for when SMS are not sent out
   */
  smsBlackoutFromPeriod?: string // pattern: (([01]\d|2[0-3])(?:[0-5]\d)(?:[0-5]\d))?

  /**
   * End Time for when SMS are not sent out
   */
  smsBlackoutToPeriod?: string // pattern: (([01]\d|2[0-3])(?:[0-5]\d)(?:[0-5]\d))?

  /**
   * @minLength 0
   * @maxLength 1
   */
  smsMarketingOptIn?: 'Y' | 'N' | ''

  /**
   * @minLength 0
   * @maxLength 1
   */
  emailMarketingOptIn?: 'Y' | 'N' | ''

  externalSystems?: Client_ExternalSystem[]

  /**
   * Withholding Tax Category. Required for Australia only.
   * @minLength 0
   * @maxLength 3
   */
  whtCategory: string
}

/**
 * Represents client identification details
 */
export interface Client_ClientIdentification {
  /**
   * @readonly
   */
  readonly id?: string

  /**
   * Identification Type Code 1. Must exist on Sovereign Identification Type file.
   * Typical examples may include Drivers Licence, Passport etc
   * @minLength 0
   * @maxLength 10
   */
  idType1: string

  /**
   * Identification Type Code 2.
   * Must exist on Sovereign Identification Type file as a valid combination with id-code-1.
   * Empty values are considered valid, if well combined, missing (null) values not
   * @minLength 0
   * @maxLength 10
   */
  idType2: string

  /**
   * @readonly
   */
  readonly clientNumber?: string

  /**
   * The value for this ID, for example, the number for the driver license.
   * Note that if 'idType1' has a value of 'USERID' then the valid length of this field is 6-10 characters long.
   */
  reference: string // pattern: ([a-zA-Z0-9]{1,50})

  effectiveDate: string // format: date
  expiryDate?: string // format: date
}

/**
 * Default Client Organisation
 */
export interface Client_ClientOrganisation {
  /**
   * B (Branch), C (Company)
   * @readonly
   * @minLength 0
   * @maxLength 1
   */
  readonly unitType?: string

  /**
   * Value supplied must exist in ORGANISATION UNIT file in Sovereign
   * @readonly
   * @minLength 0
   * @maxLength 4
   */
  readonly unitId?: string
}

/**
 * Represents the status of a client
 */
export interface Client_ClientStatus {
  /**
   * A - Active, I - Inactive
   */
  code: 'A' | 'I'
}

/**
 * Represents company details
 */
export interface Client_CompanyDetails {
  /**
   * Value supplied must exist in CORPORATE TYPE file in Sovereign.
   * @example "C"
   * @minLength 0
   * @maxLength 1
   */
  corporateTypeCode:
    | 'B'
    | 'C'
    | 'F'
    | 'J'
    | 'L'
    | 'N'
    | 'O'
    | 'P'
    | 'R'
    | 'S'
    | 'T'
    | 'V'
    | ''

  /**
   * @readonly
   */
  readonly corporateTypeDescription?: string

  /**
   * Required for create
   */
  companyName: string // pattern: [a-zA-Z0-9 !"#$%&'()*,-./:;=?@\\_|]{1,100}

  /**
   * @minLength 0
   * @maxLength 15
   */
  companyRegistrationNumber?: string

  /**
   * Company Business Number
   */
  businessNumber?: string // pattern: (\d{1,20})?

  /**
   * Country where company is registered. Value supplied must exist in COUNTRY file in Sovereign.
   * @minLength 0
   * @maxLength 3
   */
  countryOfIncorporationCode?: string

  /**
   * @readonly
   */
  readonly countryOfIncorporationDescription?: string

  dateOfIncorporation?: string // format: date
  financialYearEndDate?: string // format: date

  /**
   * @minLength 0
   * @maxLength 15
   */
  swiftId?: string

  /**
   * @minLength 0
   * @maxLength 15
   */
  creditRating?: string

  /**
   * @minLength 0
   * @maxLength 15
   */
  reuterId?: string

  dateBeganBusiness?: string // format: date
  dateBecameCustomer?: string // format: date

  premises?: Client_CodeDescPair

  numberOfFTEs?: string // pattern: (\d{1,7})?

  /**
   * @minLength 0
   * @maxLength 1
   */
  charity?: 'Y' | 'N' | ''

  arbn?: string // pattern: (\d{1,9})?

  /**
   * @minLength 0
   * @maxLength 65
   */
  tradingName?: string

  /**
   * @minLength 0
   * @maxLength 40
   */
  foreignRegistrationNumber?: string

  /**
   * @minLength 0
   * @maxLength 12
   */
  australianCreditLicense?: string
}

/**
 * Represents a generic contact model
 */
export interface Client_Contact {
  id?: string
  effectiveDate?: string // format: date
  expiryDate?: string // format: date
  contactType?: string
  surrogate?: string
}

/**
 * Represents an email contact
 */
export interface Client_Email extends Client_Contact {
  /**
   * Unique Email(contact) identifier.
   * Must be provided at client creation time and should be same as 'contacts' relationship Id.
   * Refer https://jsonapi.org/format/#crud-creating-client-ids for further details.
   */
  id?: string

  /**
   * @minLength 0
   * @maxLength 80
   */
  address: string // pattern: [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}

  /**
   * @minLength 0
   * @maxLength 1
   */
  defaultDelivery?: 'Y' | 'N' | ''

  /**
   * @minLength 0
   * @maxLength 1
   */
  preferredMethod?: 'Y' | 'N' | ''

  /**
   * Contact ID
   * @readonly
   */
  readonly contactId?: string

  effectiveDate: string // format: date
  contactType: 'HM' | 'WK' | 'SC'
  priority?: number
}

/**
 * Represents employment details
 */
export interface Client_EmploymentDetail {
  /**
   * Unique EmploymentDetail identifier.
   * Must be provided at client creation time and should be same as 'employments' relationship Id.
   * Refer https://jsonapi.org/format/#crud-creating-client-ids for further details.
   */
  id?: string

  /**
   * Value supplied must exist in EMPLOYMENT TYPE file in Sovereign.
   * @minLength 0
   * @maxLength 4
   */
  employmentType?: string

  occupation?: Client_CodeDescPair
  expiryDate?: string // format: date

  /**
   * @minLength 0
   * @maxLength 80
   */
  jobDescription?: string

  /**
   * @minimum 0
   * @maximum 168
   */
  hoursPerWeek?: number

  /**
   * @readonly
   */
  readonly nbrOfMonths?: number

  /**
   * employer client number
   */
  clientReference?: string // pattern: |\d{9}|\d{10}

  /**
   * In Sovereign we can have an employment record which has the Employer Name on it with no Employer client number
   * OR an employment record that has no employer name but has an employer client number.
   * In this second scenario, the name and other client related information would be stored against the Employer Client Number (clientReference).
   * @minLength 1
   * @maxLength 50
   */
  employerName?: string

  effectiveDate: string // format: date

  /**
   * @readonly
   */
  readonly seq?: string

  employmentSurrogate?: string

  /**
   * @readonly
   */
  readonly employmentTypeDescription?: string
}

/**
 * Represents an external system
 */
export interface Client_ExternalSystem {
  /**
   * Name of the client application that calls this web service, also known as originating system.
   * @minLength 0
   * @maxLength 10
   */
  clientApplication: string // pattern: ^(?!\s)(.)*?(?<!\s)$

  /**
   * External System Reference, also known as originating system reference ID
   * @minLength 0
   * @maxLength 25
   */
  externalSystemReference: string // pattern: ^(?!\s)(.)*?(?<!\s)$
}

/**
 * Represents a fax contact
 */
export interface Client_Fax extends Client_Contact {
  /**
   * Unique Fax(contact) identifier.
   * Must be provided at client creation time and should be same as 'contacts' relationship Id.
   * Refer https://jsonapi.org/format/#crud-creating-client-ids for further details.
   */
  id?: string

  countryCode?: string // pattern: (\d{1,3})?
  stdCode?: string // pattern: (\d{1,5})?
  number: string // pattern: |([a-zA-Z_0-9\-]{1,15})

  /**
   * @minLength 0
   * @maxLength 1
   */
  preferredMethod?: 'Y' | 'N' | ''

  priority?: number

  /**
   * @minLength 0
   * @maxLength 1
   */
  defaultDelivery?: 'Y' | 'N' | ''

  /**
   * Contact ID
   * @readonly
   */
  readonly contactId?: string

  effectiveDate: string // format: date
  contactType: 'HM' | 'WK'
}

/**
 * Represents individual details
 */
export interface Client_IndividualDetails {
  /**
   * Required for create.
   * @minLength 0
   * @maxLength 8
   */
  title: string

  /**
   * Suppress 'Title' requirement. Default to 'N' if empty.
   * @minLength 0
   * @maxLength 1
   */
  suppressTitle?: 'Y' | 'N' | ' '

  /**
   * Required for create.
   */
  surname: string // pattern: [a-zA-Z0-9 '-]{1,50}

  forenames?: string // pattern: [a-zA-Z0-9 '-]{0,50}

  /**
   * @minLength 0
   * @maxLength 30
   */
  maidenName?: string

  /**
   * @minLength 0
   * @maxLength 30
   */
  preferredName?: string

  /**
   * @minLength 0
   * @maxLength 1
   */
  gender?: 'M' | 'F' | ''

  /**
   * Required for create.
   */
  dateOfBirth: string // format: date

  /**
   * @minLength 0
   * @maxLength 1
   */
  dateOfBirthRefused?: 'Y' | 'N' | ''

  dateOfDeath?: string // format: date

  maritalStatus?: 'F' | 'S' | 'D' | 'M' | 'U' | 'P' | '' | 'W'

  /**
   * Value supplied must exist in COUNTRY file in Sovereign
   * @minLength 0
   * @maxLength 3
   */
  countryOfResidence?: string

  /**
   * Value supplied must exist in COUNTRY file in Sovereign
   * @minLength 0
   * @maxLength 3
   */
  countryOfCitizenship?: string

  numberOfDependants?: string // pattern: (\d{1,3})?

  /**
   * Value supplied must exist in ACCOMODATION TYPE file in Sovereign
   */
  accommodation?: Client_CodeDescPair

  /**
   * @minLength 0
   * @maxLength 1
   */
  resident?: 'Y' | 'N' | ''

  /**
   * @minLength 0
   * @maxLength 1
   */
  smoker?: 'Y' | 'N' | ''

  clientOtherNamesExist?: 'Y' | 'N' | ''
}

/**
 * The industry code is used to categorise the individual client or company into an industry sector.
 * The industry code provides for 3 levels of definition, each a 2 digit code.
 */
export interface Client_IndustryCode {
  /**
   * Level 1. e.g. code number 27 - Farming. Value supplied must exist in INDUSTRY file in Sovereign.
   * @minLength 1
   * @maxLength 2
   */
  level1: string

  /**
   * Level 2. e.g. code number 27(level 1) + 02 - Dairy Farming. Value supplied must exist in INDUSTRY file in Sovereign.
   * @minLength 1
   * @maxLength 2
   */
  level2?: string

  /**
   * Level 3. e.g. code number 27(level 1) + 02(level 2) + 01 - Organic Milk Production. Value supplied must exist in INDUSTRY file in Sovereign
   * @minLength 1
   * @maxLength 2
   */
  level3?: string
}

/**
 * Represents a mobile contact
 */
export interface Client_Mobile extends Client_Contact {
  /**
   * Unique Mobile(contact) identifier.
   * Must be provided at client creation time and should be same as 'contacts' relationship Id.
   * Refer https://jsonapi.org/format/#crud-creating-client-ids for further details.
   */
  id?: string

  countryCode: string // pattern: (\d{1,3})?
  networkCode: string // pattern: (\d{1,5})?
  number: string // pattern: |([a-zA-Z_0-9\-]{1,15})
  priority?: number

  /**
   * @minLength 0
   * @maxLength 1
   */
  preferredMethod?: 'Y' | 'N' | ''

  /**
   * Contact ID
   * @readonly
   */
  readonly contactId?: string

  effectiveDate: string // format: date
  contactType: 'MB'
}

/**
 * Represents a phone contact
 */
export interface Client_Phone extends Client_Contact {
  /**
   * Unique Phone(contact) identifier.
   * Must be provided at client creation time and should be same as 'contacts' relationship Id.
   * Refer https://jsonapi.org/format/#crud-creating-client-ids for further details.
   */
  id?: string

  countryCode?: string // pattern: (\d{1,3})?
  stdCode?: string // pattern: (\d{1,5})?
  number: string // pattern: |([a-zA-Z_0-9\-]{1,15})

  /**
   * @minLength 0
   * @maxLength 1
   */
  preferredMethod?: 'Y' | 'N' | ''

  /**
   * Contact ID
   * @readonly
   */
  readonly contactId?: string

  effectiveDate: string // format: date
  contactType: 'HM' | 'WK'
  priority?: number
}

/**
 * Represents an application error
 */
export interface Client_AppError {
  time?: string
  errorCode?: string
  errorMessage?: string
  severity?: string
  sequence?: number
}

/**
 * Represents a response for client creation
 */
export interface Client_ClientCreationResponse {
  clientNumber?: string
  appErrors?: Client_AppError[]
}

/**
 * Client search summary.
 */
export interface Client_ClientSummary {
  /**
   * Client Number
   * @example "0003006501"
   */
  clientNumber: string // pattern: |\d{9}|\d{10}

  generalDetails: Client_ClientSummaryGeneralDetails
  addresses?: Client_Address[]
}

/**
 * Represents general details in a client summary
 */
export interface Client_ClientSummaryGeneralDetails {
  /**
   * Client Type
   * @example "Individual(I) or Company(C)"
   */
  clientType: 'C' | 'I'

  /**
   * @minLength 1
   * @maxLength 8
   */
  title?: string

  forenames?: string // pattern: [a-zA-Z0-9 -]{0,50}
  surname?: string // pattern: [a-zA-Z0-9 '-]{1,50}
}

/**
 * Represents a response for bulk client creation
 */
export interface Client_ClientBulkCreationResponse {
  clientNumber?: string
  requestId?: string
  index?: number
}

/**
 * Client details for bulk creation.
 */
export interface Client_BulkClient {
  /**
   * @readonly
   */
  readonly clientNumber?: string // pattern: |\d{9}|\d{10}

  generalDetails: Client_ClientGeneralDtl
  bankAccounts?: Client_BankAccount[]
  employmentDetails?: Client_EmploymentDetail[]
  contacts?: Client_Contact[]
  addresses?: Client_Address[]
  identifications?: Client_ClientIdentification[]
}

export interface ClientbyID_OCCTEST {
  data: {
    type: string
    id: string
    attributes: ClientMain_Client
    links: {
      self: string
    }
  }
  included: Client_IncludedItem[]
}

// Define the base export interface that all included items share
