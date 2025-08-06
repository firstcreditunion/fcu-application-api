'use server'

import { headers } from 'next/headers'

export async function getHost() {
  const headersList = await headers()
  // console.log('FULL HEADER LIST', JSON.stringify(headersList))
  const origin = headersList.get('host')
  return origin
}

export async function getEnvironemnt() {
  const host = await getHost()

  if (
    process.env.SCHEMEA_TO_USE === '' &&
    host &&
    host.startsWith('localhost')
  ) {
    return 'test'
  }

  if (host && host === 'staff-portal-test.vercel.app') {
    return 'test'
  }

  if (
    host &&
    (host === 'staff-portal-production.vercel.app' ||
      host === 'portal.firstcreditunion.co.nz')
  ) {
    return 'prod'
  }

  return 'test'
}

type Schema = 'api' | 'production'

export async function getSchemaToUse(): Promise<Schema> {
  const host = await getHost()

  if (
    process.env.SCHEMEA_TO_USE === '' &&
    host &&
    host.startsWith('localhost')
  ) {
    return 'api'
  }

  if (host && host === 'staff-portal-test.vercel.app') {
    return 'api'
  }

  if (
    host &&
    (host === 'staff-portal-production.vercel.app' ||
      host === 'portal.firstcreditunion.co.nz')
  ) {
    return 'production'
  }

  return 'api'
}

export async function getCreditSenseStoreCode() {
  const host = await getHost()

  if (
    process.env.SCHEMEA_TO_USE === '' &&
    host &&
    host.startsWith('localhost')
  ) {
    return process.env.CREDIT_SENSE_TEST_STORE!
  }

  if (host && host === 'staff-portal-test.vercel.app') {
    return process.env.CREDIT_SENSE_TEST_STORE!
  }

  if (
    host &&
    (host === 'staff-portal-production.vercel.app' ||
      host === 'portal.firstcreditunion.co.nz')
  ) {
    return process.env.CREDIT_SENSE_PROD_STORE!
  }

  return process.env.CREDIT_SENSE_TEST_STORE!
}

export async function getCreditSenseDebugBanks() {
  const host = await getHost()

  if (
    process.env.SCHEMEA_TO_USE === '' &&
    host &&
    host.startsWith('localhost')
  ) {
    return true
  }

  if (host && host === 'staff-portal-test.vercel.app') {
    return true
  }

  if (
    host &&
    (host === 'staff-portal-production.vercel.app' ||
      host === 'portal.firstcreditunion.co.nz')
  ) {
    return false
  }

  return true
}
