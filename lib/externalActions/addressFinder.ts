'use server'

import { AddressFinderMetadataResponse } from '../../types/external/addressfinder/metada'

interface GetAddressesAutoComplete {
  partialAddress: string
}

interface GetAddressesMetadata {
  pxid: string
}

export interface AddressesAutoCompleteResposneType {
  a: string
  pxid: string
  v: number
  highlighted_a: string
  success: boolean
}

export async function getAddressAutoComplete({
  partialAddress,
}: GetAddressesAutoComplete): Promise<
  AddressesAutoCompleteResposneType[] | []
> {
  const addressFinderKey = process.env.ADDRESSFINDER_KEY!
  const addressFinderSecretKey = process.env.ADDRESSFINDER_SECRET_KEY!

  const addressFinderUrl = `https://api.addressfinder.io/api/nz/address/autocomplete/?key=${addressFinderKey}&q=${partialAddress}&format=json&strict=2`

  const addressFinderResult = await fetch(addressFinderUrl, {
    method: 'GET',
    headers: {
      Authorization: addressFinderSecretKey,
    },
  })

  const addressFinderResultBody = await addressFinderResult.json()

  if (!addressFinderResult.ok) return []

  const completions: AddressesAutoCompleteResposneType[] =
    addressFinderResultBody?.completions

  return completions
}

export async function getExactAddressFromPxid({
  pxid,
}: GetAddressesMetadata): Promise<AddressFinderMetadataResponse | null> {
  const addressFinderKey = process.env.ADDRESSFINDER_KEY!
  const addressFinderSecretKey = process.env.ADDRESSFINDER_SECRET_KEY!

  const addressFinderUrl = `https://api.addressfinder.io/api/nz/address/metadata/?key=${addressFinderKey}&format=json&pxid=${pxid}`

  try {
    const addressFinderResult = await fetch(addressFinderUrl, {
      method: 'GET',
      headers: {
        Authorization: addressFinderSecretKey,
      },
    })

    if (!addressFinderResult.ok) {
      console.error(
        'AddressFinder API request failed:',
        addressFinderResult.status,
        addressFinderResult.statusText
      )
      return null
    }

    const addressFinderResultBody: AddressFinderMetadataResponse =
      await addressFinderResult.json()

    return addressFinderResultBody
  } catch (error) {
    console.error('Error fetching address metadata:', error)
    return null
  }
}
