import { StreetNumber } from './applicationTypes'

// Define the base export interface Clientthat all included items share
export interface ClientIncludedItem {
  type: string
  id: string
  attributes: Record<string, unknown>
}

// Mobile type
export interface ClientMobileAttributes {
  '@id': string
  countryCode: string
  networkCode: string
  number: string
  priority: number
  preferredMethod?: string
  expiryDate?: string
  effectiveDate: string
  contactType: string
  surrogate: string
  [key: string]: unknown
}

export interface ClientMobileItem extends ClientIncludedItem {
  type: 'mobile'
  attributes: ClientMobileAttributes
}

// Employment type
export interface ClientEmploymentAttributes {
  '@id': string
  employmentType: string
  occupation: {
    code: string
    description: string
  }
  jobDescription: string
  hoursPerWeek: number
  nbrOfMonths: number
  employerName: string
  effectiveDate: string
  expiryDate?: string
  employmentSurrogate: string
  employmentTypeDescription: string
  [key: string]: unknown
}

export interface ClientEmploymentItem extends ClientIncludedItem {
  type: 'employment'
  attributes: ClientEmploymentAttributes
}

// Address type
export interface ClientStreetNumber {
  from: string
  to: string
}

export interface ClientCountry {
  code: string
  description: string
}

export interface ClientAddressAttributes {
  '@id': string
  contactType: string
  streetNumber: StreetNumber
  streetOrPostalName: string
  streetType?: string
  suburb?: string
  city: string
  postCode: string
  country: ClientCountry
  priority: number
  contactId: string
  purpose: string
  effectiveDate: string
  addressType: string
  seq: string
  surrogate: string
  expiryDate?: string
  preferredMethod: string
  linkType: string
  checkedFlag?: string
  latitude?: number
  longitude?: number
  addressVerificationService?: string
  externalWebServiceId?: string
  suburbAliasId?: string
  cityTownAliasId?: string
  deliveryPointId?: string
  streetAliasId?: string
  [key: string]: unknown
}

export interface ClientAddressItem extends ClientIncludedItem {
  type: 'address'
  attributes: ClientAddressAttributes
}

// Identification type
export interface ClientIdentificationAttributes {
  '@id': string
  idType1: string
  idType2: string
  clientNumber: string
  reference: string
  effectiveDate: string
  expiryDate?: string
  [key: string]: unknown
}

export interface ClientIdentificationItem extends ClientIncludedItem {
  type: 'identification'
  attributes: ClientIdentificationAttributes
}

// Email type
export interface ClientEmailAttributes {
  '@id': string
  address: string
  preferredMethod: string
  effectiveDate: string
  expiryDate?: string
  contactType: string
  surrogate: string
  priority: number
  [key: string]: unknown
}

export interface ClientEmailItem extends ClientIncludedItem {
  type: 'email'
  attributes: ClientEmailAttributes
}

// Union type for all possible included itemse
export type Client_IncludedItem =
  | ClientMobileItem
  | ClientEmploymentItem
  | ClientAddressItem
  | ClientIdentificationItem
  | ClientEmailItem

// Type guard functions to assert and validate each type
function isMobileItem(item: Client_IncludedItem): item is ClientMobileItem {
  if (item.type !== 'mobile') return false

  const attrs = item.attributes as Partial<ClientMobileAttributes>
  return (
    typeof attrs['@id'] === 'string' &&
    typeof attrs.countryCode === 'string' &&
    typeof attrs.networkCode === 'string' &&
    typeof attrs.number === 'string' &&
    typeof attrs.priority === 'number' &&
    typeof attrs.effectiveDate === 'string' &&
    typeof attrs.contactType === 'string' &&
    typeof attrs.surrogate === 'string'
  )
}

function isEmploymentItem(
  item: Client_IncludedItem
): item is ClientEmploymentItem {
  if (item.type !== 'employment') return false

  const attrs = item.attributes as Partial<ClientEmploymentAttributes>

  // First check if occupation exists and is an object
  if (!attrs.occupation || typeof attrs.occupation !== 'object') {
    return false
  }

  // Now we can safely check occupation properties
  return (
    typeof attrs['@id'] === 'string' &&
    typeof attrs.employmentType === 'string' &&
    typeof attrs.occupation.code === 'string' &&
    typeof attrs.occupation.description === 'string' &&
    typeof attrs.jobDescription === 'string' &&
    typeof attrs.hoursPerWeek === 'number' &&
    typeof attrs.nbrOfMonths === 'number' &&
    typeof attrs.employerName === 'string' &&
    typeof attrs.effectiveDate === 'string' &&
    typeof attrs.employmentSurrogate === 'string' &&
    typeof attrs.employmentTypeDescription === 'string'
  )
}

function isAddressItem(item: Client_IncludedItem): item is ClientAddressItem {
  if (item.type !== 'address') return false

  const attrs = item.attributes as Partial<ClientAddressAttributes>

  // Check if nested objects exist before accessing their properties
  if (!attrs.streetNumber || typeof attrs.streetNumber !== 'object') {
    return false
  }

  if (!attrs.country || typeof attrs.country !== 'object') {
    return false
  }

  return (
    typeof attrs['@id'] === 'string' &&
    typeof attrs.contactType === 'string' &&
    typeof attrs.streetNumber.from === 'string' &&
    typeof attrs.streetNumber.to === 'string' &&
    typeof attrs.streetOrPostalName === 'string' &&
    typeof attrs.city === 'string' &&
    typeof attrs.postCode === 'string' &&
    typeof attrs.country.code === 'string' &&
    typeof attrs.country.description === 'string' &&
    typeof attrs.priority === 'number' &&
    typeof attrs.contactId === 'string' &&
    typeof attrs.purpose === 'string' &&
    typeof attrs.effectiveDate === 'string' &&
    typeof attrs.addressType === 'string' &&
    typeof attrs.seq === 'string' &&
    typeof attrs.surrogate === 'string' &&
    typeof attrs.preferredMethod === 'string' &&
    typeof attrs.linkType === 'string'
  )
}

function isIdentificationItem(
  item: Client_IncludedItem
): item is ClientIdentificationItem {
  if (item.type !== 'identification') return false

  const attrs = item.attributes as Partial<ClientIdentificationAttributes>
  return (
    typeof attrs['@id'] === 'string' &&
    typeof attrs.idType1 === 'string' &&
    typeof attrs.idType2 === 'string' &&
    typeof attrs.clientNumber === 'string' &&
    typeof attrs.reference === 'string' &&
    typeof attrs.effectiveDate === 'string'
  )
}

function isEmailItem(item: Client_IncludedItem): item is ClientEmailItem {
  if (item.type !== 'email') return false

  const attrs = item.attributes as Partial<ClientEmailAttributes>
  return (
    typeof attrs['@id'] === 'string' &&
    typeof attrs.address === 'string' &&
    typeof attrs.preferredMethod === 'string' &&
    typeof attrs.effectiveDate === 'string' &&
    typeof attrs.contactType === 'string' &&
    typeof attrs.surrogate === 'string' &&
    typeof attrs.priority === 'number'
  )
}

// Export all types and type guards
export {
  isMobileItem,
  isEmploymentItem,
  isAddressItem,
  isIdentificationItem,
  isEmailItem,
}
