'use server'

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
import { ClientIdentification } from '@/types/occ/applicationTypes'
import z from 'zod'

// Infer types from Zod schemas
type DriversLicenceData = z.infer<typeof driversLicenceSchema>
type PassportData = z.infer<typeof passportSchema>
type FirearmsLicenceData = z.infer<typeof firearmsLicenceSchema>
type BirthCertificateData = z.infer<typeof birthCertificateSchema>
type KiwiAccessCardData = z.infer<typeof kiwiAccessCardSchema>
type CommunityServiceCardData = z.infer<typeof communityServiceCardSchema>
type GoldCardData = z.infer<typeof goldCardSchema>
type StudentIDData = z.infer<typeof currentStudentCardSchema>

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

// Function to build the ClientIdentification array
export function buildClientIdentifications(
  identifications: AllIdentifications
): ClientIdentification[] | [] {
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
      idCode1: 'NZDL',
      idCode2: primeDriversLicence.licenceType,
      effectiveDate: primeDriversLicence.licenceIssueDate?.toISOString(),
      expiryDate: primeDriversLicence.licenceExpiryDate?.toISOString(),
      reference: primeDriversLicence.licenceNumber,
      seq: primeDriversLicence.licenceVersion || '1',
    })
  }

  // 2. NZ Passport
  if (primePassport.passportNumber) {
    clientIdentifications.push({
      idCode1: 'NZPP',
      effectiveDate: primePassport.passportIssueDate?.toISOString(),
      expiryDate: primePassport.passportExpiryDate?.toISOString(),
      reference: primePassport.passportNumber,
      seq: String(seqCounter++),
    })
  }

  // 3. NZ Firearms Licence
  if (primeFirearmsLicence.firearmsNumber) {
    clientIdentifications.push({
      idCode1: 'NZFL',
      effectiveDate: primeFirearmsLicence.firearmsIssueDate?.toISOString(),
      expiryDate: primeFirearmsLicence.firearmsExpiryDate?.toISOString(),
      reference: primeFirearmsLicence.firearmsNumber,
      seq: String(seqCounter++),
    })
  }

  // 4. NZ Birth Certificate
  if (primeBirthCertificate.birthCertificateRegNo) {
    clientIdentifications.push({
      idCode1: 'NZBC',
      effectiveDate:
        primeBirthCertificate.birthCertificateIssueDate?.toISOString(),
      reference: primeBirthCertificate.birthCertificateRegNo,
      seq: String(seqCounter++),
    })
  }

  // 5. NZ Kiwi Access Card
  if (primeKiwiAccessCard.kiwiAccessCardNumber) {
    clientIdentifications.push({
      idCode1: 'NZKA',
      effectiveDate: primeKiwiAccessCard.kiwiAccessCardIssueDate?.toISOString(),
      expiryDate: primeKiwiAccessCard.kiwiAccessCardExpiryDate?.toISOString(),
      reference: primeKiwiAccessCard.kiwiAccessCardNumber,
      seq: String(seqCounter++),
    })
  }

  // 6. NZ Community Service Card
  if (primeCommunityServiceCard.communityServiceCardNumber) {
    clientIdentifications.push({
      idCode1: 'NZCS',
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
      idCode1: 'NZGC',
      effectiveDate: goldCard.goldCardIssueDate?.toISOString(),
      reference: goldCard.goldCardNumber,
      seq: String(seqCounter++),
    })
  }

  // 8. NZ Student ID
  if (studentID.currentStudentCardNumber) {
    clientIdentifications.push({
      idCode1: 'NZSI',
      effectiveDate: studentID.currentStudentCardIssueDate?.toISOString(),
      expiryDate: studentID.currentStudentCardExpiryDate?.toISOString(),
      reference: studentID.currentStudentCardNumber,
      seq: String(seqCounter++),
    })
  }

  if (clientIdentifications.length === 0) return []

  return clientIdentifications
}

type ProcessedMobileNumber = {
  sov_networkCode: string
  sov_number: string
}

export function processMobileNumber(
  mobileNumber: string
): ProcessedMobileNumber {
  // console.log('Split Check processMobileNumber: ', mobileNumber)

  // Split the input string by spaces
  const parts = mobileNumber.split(' ')

  // Process the network code (first part)
  const sov_networkCode = parts[0].replace(/^0/, '')

  // Process the rest of the number
  const sov_number = parts.slice(1).join('')

  return {
    sov_networkCode,
    sov_number,
  }
}
