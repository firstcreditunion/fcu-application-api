'use server'

import z from 'zod'
import { headers } from 'next/headers'

import { ClientIdentification } from '@/types/occ/applicationTypes'

import {
  currentStudentCardSchema,
  driversLicenceSchema,
  firearmsLicenceSchema,
  passportSchema,
  birthCertificateSchema,
  kiwiAccessCardSchema,
  communityServiceCardSchema,
  goldCardSchema,
} from '@/app/personal-loan/schema/prime/identificationsSchema'

// Infer types from Zod schemas
type DriversLicenceData = z.infer<typeof driversLicenceSchema>
type PassportData = z.infer<typeof passportSchema>
type FirearmsLicenceData = z.infer<typeof firearmsLicenceSchema>
type BirthCertificateData = z.infer<typeof birthCertificateSchema>
type KiwiAccessCardData = z.infer<typeof kiwiAccessCardSchema>
type CommunityServiceCardData = z.infer<typeof communityServiceCardSchema>
type GoldCardData = z.infer<typeof goldCardSchema>
type StudentIDData = z.infer<typeof currentStudentCardSchema>

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

// All possible identification objects bundled together
interface AllIdentifications {
  primeDriversLicence: DriversLicenceData
  primePassport: PassportData
  primeFirearmsLicence: FirearmsLicenceData
  primeBirthCertificate: BirthCertificateData
  primeKiwiAccessCard: KiwiAccessCardData
  primeCommunityServiceCard: CommunityServiceCardData
  goldCard: GoldCardData
  studentID: StudentIDData
}

export async function buildClientIdentifications(
  identifications: AllIdentifications
): Promise<ClientIdentification[] | []> {
  const clientIdentifications: ClientIdentification[] = []
  let seqCounter = 1

  const {
    primeDriversLicence,
    primePassport,
    primeFirearmsLicence,
    primeBirthCertificate,
    primeKiwiAccessCard,
    primeCommunityServiceCard,
    goldCard,
    studentID,
  } = identifications

  // 1. NZ Driver's Licence
  if (primeDriversLicence.licenceNumber) {
    clientIdentifications.push({
      idCode1: 'DRVLSC',
      idCode2: primeDriversLicence.licenceType,
      effectiveDate: primeDriversLicence.licenceIssueDate?.toISOString(),
      expiryDate: primeDriversLicence.licenceExpiryDate?.toISOString(),
      reference: primeDriversLicence.licenceNumber,
      seq: '1',
    })
    clientIdentifications.push({
      idCode1: 'DRVLSC',
      idCode2: 'DLVERSION',
      effectiveDate: primeDriversLicence.licenceIssueDate?.toISOString(),
      expiryDate: primeDriversLicence.licenceExpiryDate?.toISOString(),
      reference: primeDriversLicence.licenceVersion,
      seq: '1',
    })
  }

  // 2. NZ Passport
  if (primePassport.passportNumber) {
    clientIdentifications.push({
      idCode1: 'PASPRT',
      effectiveDate: primePassport.passportIssueDate?.toISOString(),
      expiryDate: primePassport.passportExpiryDate?.toISOString(),
      reference: primePassport.passportNumber,
      seq: String(seqCounter++),
    })
  }

  // 3. NZ Firearms Licence
  if (primeFirearmsLicence.firearmsNumber) {
    clientIdentifications.push({
      idCode1: 'FIRELICENS',
      effectiveDate: primeFirearmsLicence.firearmsIssueDate?.toISOString(),
      expiryDate: primeFirearmsLicence.firearmsExpiryDate?.toISOString(),
      reference: primeFirearmsLicence.firearmsNumber,
      seq: String(seqCounter++),
    })
  }

  // 4. NZ Birth Certificate
  if (primeBirthCertificate.birthCertificateRegNo) {
    clientIdentifications.push({
      idCode1: 'BIRTHCERT',
      effectiveDate:
        primeBirthCertificate.birthCertificateIssueDate?.toISOString(),
      reference: primeBirthCertificate.birthCertificateRegNo,
      seq: String(seqCounter++),
    })
  }

  // 5. NZ Kiwi Access Card
  if (primeKiwiAccessCard.kiwiAccessCardNumber) {
    clientIdentifications.push({
      idCode1: 'KIWACCCRD',
      effectiveDate: primeKiwiAccessCard.kiwiAccessCardIssueDate?.toISOString(),
      expiryDate: primeKiwiAccessCard.kiwiAccessCardExpiryDate?.toISOString(),
      reference: primeKiwiAccessCard.kiwiAccessCardNumber,
      seq: String(seqCounter++),
    })
  }

  // 6. NZ Community Service Card
  if (primeCommunityServiceCard.communityServiceCardNumber) {
    clientIdentifications.push({
      idCode1: 'COMSERVCRD',
      effectiveDate:
        primeCommunityServiceCard.communityServiceCardIssueDate?.toISOString(),
      expiryDate:
        primeCommunityServiceCard.communityServiceCardExpiryDate?.toISOString(),
      reference: primeCommunityServiceCard.communityServiceCardNumber,
      seq: String(seqCounter++),
    })
  }

  // 7. NZ Gold Card
  if (goldCard.goldCardNumber) {
    clientIdentifications.push({
      idCode1: 'GOLDCARD',
      effectiveDate: goldCard.goldCardIssueDate?.toISOString(),
      reference: goldCard.goldCardNumber,
      seq: String(seqCounter++),
    })
  }

  // 8. NZ Student ID
  if (studentID.currentStudentCardNumber) {
    clientIdentifications.push({
      idCode1: 'CURSTUDID',
      effectiveDate: studentID.currentStudentCardIssueDate?.toISOString(),
      expiryDate: studentID.currentStudentCardExpiryDate?.toISOString(),
      reference: studentID.currentStudentCardNumber,
      seq: String(seqCounter++),
    })
  }

  if (clientIdentifications.length === 0) return []

  return clientIdentifications
}
