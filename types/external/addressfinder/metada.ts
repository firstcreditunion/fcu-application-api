/**
 * Represents the parameters for a request to the Addressfinder NZ Address Metadata API.
 */
export interface AddressFinderMetadataRequestParams {
  /**
   * Your unique licence key.
   */
  key: string
  /**
   * Your unique secret key. Required for server-to-server calls.
   */
  secret?: string
  /**
   * The required format of the response.
   * @default 'json'
   */
  format?: 'json'
  /**
   * Unique address identifier obtained from the NZ Address Autocomplete or NZ Address Bounding Box APIs.
   * You must supply either a `pxid` or `dpid` field.
   */
  pxid?: string
  /**
   * Unique reference number assigned to a delivery address by NZ Post.
   * You must supply either a `pxid` or `dpid` field.
   */
  dpid?: string
  /**
   * Desired data source for Statistics NZ metadata.
   * @default 2018
   */
  census?: number
  /**
   * Used to identify which of your services is calling the API for activity monitoring purposes.
   */
  domain?: string
  /**
   * Set to '1' to reformat special characters like macrons with their ASCII equivalent.
   */
  ascii?: '1'
}

/**
 * Represents a successful response from the Addressfinder NZ Address Metadata API.
 */
export interface AddressFinderMetadataSuccessResponse {
  /** Indicates if the request was successful. */
  success: true
  /** Unique address identifier. */
  pxid: string
  /** Canonical address as supplied by Land Information New Zealand or NZ Post. */
  a: string
  /** The unique identifier from Land Information New Zealand (LINZ). */
  aims_address_id: string
  /** Same as aims_address_id, returned as an integer. */
  sufi: number
  /** Territorial Authority ID (2018 census only). */
  ta_id: string
  /** The Territorial Authority in which this address exists. */
  ta: string
  /** Territorial Authority Subdivision ID (2018 census only). */
  tasub_id: string
  /** Territorial Authority Subdivision name (2018 census only). */
  tasub: string
  /** The street number of the address. */
  number: string
  /** Longitude coordinate (in WGS84 format). */
  x: string
  /** Latitude coordinate (in WGS84 format). */
  y: string
  /** Holds the four digit postcode. */
  postcode: string
  /** Holds the full name of the street, including the Street Type. */
  street: string
  /** Holds the name of the street. */
  street_name: string
  /** The type of street. */
  street_type: string
  /** The city, town or locality name. */
  city: string
  /** The suburb or locality of the address. */
  suburb: string
  /** Region ID (2018 census only). */
  region_id: string
  /** The Regional Authority in which this address exists. */
  region: string
  /** Postal address line 1. */
  postal_line_1: string
  /** Postal address line 2. */
  postal_line_2: string
  /** Postal address line 3. */
  postal_line_3: string
  /** An indicator to help determine if this address is located in a rural setting. */
  rural: boolean
  /** First line of the non-suburb/city/postcode portion of the address. */
  address_line_1: string
  /** Second line of the non-suburb/city/postcode portion of the address. */
  address_line_2?: string
  /** The unique identifier of the portion of land associated with the selected address. */
  primary_parcel_id: string
  /** The meshblock identifier for the requested census dataset. */
  meshblock: string
  /** Statistical area 1 (2018 census only). */
  sa1_id: string
  /** Statistical area 2 ID (2018 census only). */
  sa2_id: string
  /** Statistical area 2 name (2018 census only). */
  sa2: string
  /** Community Board ID (2018 census only). */
  cb_id: string
  /** Community Board name (2018 census only). */
  cb: string
  /** Ward ID (2018 census only). */
  ward_id: string
  /** Ward name (2018 census only). */
  ward: string
  /** Constituency ID (2018 census only). */
  con_id: string
  /** Constituency name (2018 census only). */
  con: string
  /** Maori Constituency ID (2018 census only). */
  maoricon_id: string
  /** Maori Constituency name (2018 census only). */
  maoricon: string
  /** Urban rural indicator ID (2018 census only). */
  iur_id: string
  /** Urban rural indicator name (2018 census only). */
  iur: string
  /** Urban rural ID (2018 census only). */
  ur_id: string
  /** Urban rural name (2018 census only). */
  ur: string
  /** Land/Water ID (2018 census only). */
  landwater_id: string
  /** Land/Water description (2018 census only). */
  landwater: string
  /** Associated postal address when supplied by NZ Post. */
  postal?: string
  /** Holds the building or property name. */
  building_name?: string
  /** Describes the category of a sub-dwelling. */
  unit_type?: string
  /** Identifies a specific sub dwelling. */
  unit_identifier?: string
  /** The level number and level type in a multi-story building. */
  floor?: string
  /** Holds the alpha component of a street number (e.g., 'B' in '1B High Street'). */
  alpha?: string
  /** Holds the street name and type from NZ Post. */
  post_street?: string
  /** Holds the street name from NZ Post. */
  post_street_name?: string
  /** The type of PO Box/CMB/Private Bag/Counter Delivery. */
  box_type?: string
  /** The name of the NZ Post outlet or Agency outlet. */
  lobby_name?: string
  /** The rural delivery number assigned by NZ Post. */
  rd_number?: string
  /** Name of the suburb when supplied by NZ Post. */
  post_suburb?: string
  /** Name of the town/city when supplied by NZ Post. */
  mailtown?: string
  /** A unique reference number assigned to each delivery address by NZ Post. */
  dpid?: string
  /** The unique road section identifier from LINZ. */
  aims_road_section_id?: string
}

/**
 * Represents an error response from the Addressfinder NZ Address Metadata API.
 */
export interface AddressFinderMetadataErrorResponse {
  /** Indicates if the request was successful. */
  success: false
  /** An empty array will be returned due to the error. */
  completions: []
  /** A unique numerical value identifying the error that occured. */
  error_code: string
  /** An informative message describing the error that occured. */
  message: string
}

/**
 * Represents a response from the Addressfinder NZ Address Metadata API, which can be either a success or an error.
 */
export type AddressFinderMetadataResponse =
  | AddressFinderMetadataSuccessResponse
  | AddressFinderMetadataErrorResponse
