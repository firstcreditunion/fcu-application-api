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
import { format } from 'date-fns'

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
  DriversLicence: DriversLicenceData
  Passport: PassportData
  FirearmsLicence: FirearmsLicenceData
  BirthCertificate: BirthCertificateData
  KiwiAccessCard: KiwiAccessCardData
  CommunityServiceCard: CommunityServiceCardData
  goldCard: GoldCardData
  studentID: StudentIDData
}

export async function buildClientIdentifications(
  identifications: AllIdentifications
): Promise<ClientIdentification[] | []> {
  const clientIdentifications: ClientIdentification[] = []
  let seqCounter = 1

  const {
    DriversLicence,
    Passport,
    FirearmsLicence,
    BirthCertificate,
    KiwiAccessCard,
    CommunityServiceCard,
    goldCard,
    studentID,
  } = identifications

  // 1. NZ Driver's Licence
  if (DriversLicence.licenceNumber) {
    clientIdentifications.push({
      idCode1: 'DRVLSC',
      effectiveDate: DriversLicence.licenceIssueDate
        ? format(DriversLicence.licenceIssueDate, 'yyyy-MM-dd') + 'T00:00:00'
        : undefined,
      expiryDate: DriversLicence.licenceExpiryDate
        ? format(DriversLicence.licenceExpiryDate, 'yyyy-MM-dd') + 'T00:00:00'
        : undefined,
      reference: DriversLicence.licenceNumber,
      seq: '1',
    })
    clientIdentifications.push({
      idCode1: 'DRVLSC',
      idCode2: 'DLVERSION',
      effectiveDate: DriversLicence.licenceIssueDate
        ? format(DriversLicence.licenceIssueDate, 'yyyy-MM-dd') + 'T00:00:00'
        : undefined,
      expiryDate: DriversLicence.licenceExpiryDate
        ? format(DriversLicence.licenceExpiryDate, 'yyyy-MM-dd') + 'T00:00:00'
        : undefined,
      reference: DriversLicence.licenceVersion,
      seq: '1',
    })
  }

  // 2. NZ Passport
  if (Passport.passportNumber) {
    clientIdentifications.push({
      idCode1: 'PASPRT',
      effectiveDate: Passport.passportIssueDate
        ? format(Passport.passportIssueDate, 'yyyy-MM-dd') + 'T00:00:00'
        : undefined,
      expiryDate: Passport.passportExpiryDate
        ? format(Passport.passportExpiryDate, 'yyyy-MM-dd') + 'T00:00:00'
        : undefined,
      reference: Passport.passportNumber,
      seq: String(seqCounter++),
    })
  }

  // 3. NZ Firearms Licence
  if (FirearmsLicence.firearmsNumber) {
    clientIdentifications.push({
      idCode1: 'FIRELICENS',
      effectiveDate: FirearmsLicence.firearmsIssueDate
        ? format(FirearmsLicence.firearmsIssueDate, 'yyyy-MM-dd') + 'T00:00:00'
        : undefined,
      expiryDate: FirearmsLicence.firearmsExpiryDate
        ? format(FirearmsLicence.firearmsExpiryDate, 'yyyy-MM-dd') + 'T00:00:00'
        : undefined,
      reference: FirearmsLicence.firearmsNumber,
      seq: String(seqCounter++),
    })
  }

  // 4. NZ Birth Certificate
  if (BirthCertificate.birthCertificateRegNo) {
    clientIdentifications.push({
      idCode1: 'BIRTHCERT',
      effectiveDate: BirthCertificate.birthCertificateIssueDate
        ? format(BirthCertificate.birthCertificateIssueDate, 'yyyy-MM-dd') +
          'T00:00:00'
        : undefined,
      reference: BirthCertificate.birthCertificateRegNo,
      seq: String(seqCounter++),
    })
  }

  // 5. NZ Kiwi Access Card
  if (KiwiAccessCard.kiwiAccessCardNumber) {
    clientIdentifications.push({
      idCode1: 'KIWACCCRD',
      effectiveDate: KiwiAccessCard.kiwiAccessCardIssueDate
        ? format(KiwiAccessCard.kiwiAccessCardIssueDate, 'yyyy-MM-dd') +
          'T00:00:00'
        : undefined,
      expiryDate: KiwiAccessCard.kiwiAccessCardExpiryDate
        ? format(KiwiAccessCard.kiwiAccessCardExpiryDate, 'yyyy-MM-dd') +
          'T00:00:00'
        : undefined,
      reference: KiwiAccessCard.kiwiAccessCardNumber,
      seq: String(seqCounter++),
    })
  }

  // 6. NZ Community Service Card
  if (CommunityServiceCard.communityServiceCardNumber) {
    clientIdentifications.push({
      idCode1: 'COMSERVCRD',
      effectiveDate: CommunityServiceCard.communityServiceCardIssueDate
        ? format(
            CommunityServiceCard.communityServiceCardIssueDate,
            'yyyy-MM-dd' + 'T00:00:00'
          )
        : undefined,
      expiryDate: CommunityServiceCard.communityServiceCardExpiryDate
        ? format(
            CommunityServiceCard.communityServiceCardExpiryDate,
            'yyyy-MM-dd' + 'T00:00:00'
          )
        : undefined,
      reference: CommunityServiceCard.communityServiceCardNumber,
      seq: String(seqCounter++),
    })
  }

  // 7. NZ Gold Card
  if (goldCard.goldCardNumber) {
    clientIdentifications.push({
      idCode1: 'GOLDCARD',
      effectiveDate: goldCard.goldCardIssueDate
        ? format(goldCard.goldCardIssueDate, 'yyyy-MM-dd') + 'T00:00:00'
        : undefined,
      reference: goldCard.goldCardNumber,
      seq: String(seqCounter++),
    })
  }

  // 8. NZ Student ID
  if (studentID.currentStudentCardNumber) {
    clientIdentifications.push({
      idCode1: 'CURSTUDID',
      effectiveDate: studentID.currentStudentCardIssueDate
        ? format(studentID.currentStudentCardIssueDate, 'yyyy-MM-dd') +
          'T00:00:00'
        : undefined,
      expiryDate: studentID.currentStudentCardExpiryDate
        ? format(studentID.currentStudentCardExpiryDate, 'yyyy-MM-dd') +
          'T00:00:00'
        : undefined,
      reference: studentID.currentStudentCardNumber,
      seq: String(seqCounter++),
    })
  }

  if (clientIdentifications.length === 0) return []

  return clientIdentifications
}
