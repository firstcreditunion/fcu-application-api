import React from 'react'
import { View, Text, Page } from '@react-pdf/renderer'
import { pdfStyles } from '../styles/pdfStyles'
import { EnrichedPrimeLoanData } from '@/types/pdf/enrichedLoanData'
import { PDFHeader } from './Header'
import { format } from 'date-fns'

interface PersonalDetailsProps {
  data: EnrichedPrimeLoanData
}

export const PersonalDetails: React.FC<PersonalDetailsProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy')
    } catch {
      return dateString
    }
  }

  return (
    <Page size='A4' style={pdfStyles.page}>
      <PDFHeader
        title='Personal Details & Identification'
        applicationNumber={data.loanApplicationNumber}
        date={formatDate(data.created_at)}
      />

      {/* Personal Information */}
      <Text style={pdfStyles.subtitle}>Personal Information</Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Title:</Text>
          <Text style={pdfStyles.value}>{data.primePersonalDetails.title}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>First Name:</Text>
          <Text style={pdfStyles.value}>
            {data.primePersonalDetails.firstName}
          </Text>
        </View>
        {data.primePersonalDetails.middleName && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Middle Name:</Text>
            <Text style={pdfStyles.value}>
              {data.primePersonalDetails.middleName}
            </Text>
          </View>
        )}
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Last Name:</Text>
          <Text style={pdfStyles.value}>
            {data.primePersonalDetails.lastName}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Dependant Adults:</Text>
          <Text style={pdfStyles.value}>
            {data.primePersonalDetails.dependantAdults}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Dependant Children:</Text>
          <Text style={pdfStyles.value}>
            {data.primePersonalDetails.dependantChildren}
          </Text>
        </View>
      </View>

      {/* Identification Documents */}
      <Text style={pdfStyles.subtitle}>Identification Documents</Text>

      {/* Driver's Licence */}
      {data.primeDriversLicence?.licenceNumber && (
        <View style={pdfStyles.infoBox}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5, fontSize: 11 }}>
            Driver&apos;s Licence
          </Text>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Licence Type:</Text>
            <Text style={pdfStyles.value}>
              {data.primeDriversLicence.licenceType}
            </Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Licence Number:</Text>
            <Text style={pdfStyles.value}>
              {data.primeDriversLicence.licenceNumber}
            </Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Version:</Text>
            <Text style={pdfStyles.value}>
              {data.primeDriversLicence.licenceVersion}
            </Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Issue Date:</Text>
            <Text style={pdfStyles.value}>
              {formatDate(data.primeDriversLicence.licenceIssueDate)}
            </Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Expiry Date:</Text>
            <Text style={pdfStyles.value}>
              {formatDate(data.primeDriversLicence.licenceExpiryDate)}
            </Text>
          </View>
        </View>
      )}

      {/* Passport */}
      {data.primePassport?.passportNumber && (
        <View style={pdfStyles.infoBox}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5, fontSize: 11 }}>
            Passport
          </Text>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Passport Number:</Text>
            <Text style={pdfStyles.value}>
              {data.primePassport.passportNumber}
            </Text>
          </View>
          {data.primePassport.passportIssueDate && (
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Issue Date:</Text>
              <Text style={pdfStyles.value}>
                {formatDate(data.primePassport.passportIssueDate)}
              </Text>
            </View>
          )}
          {data.primePassport.passportExpiryDate && (
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Expiry Date:</Text>
              <Text style={pdfStyles.value}>
                {formatDate(data.primePassport.passportExpiryDate)}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Firearms Licence */}
      {data.primeFirearmsLicence?.firearmsNumber && (
        <View style={pdfStyles.infoBox}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5, fontSize: 11 }}>
            Firearms Licence
          </Text>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Firearms Number:</Text>
            <Text style={pdfStyles.value}>
              {data.primeFirearmsLicence.firearmsNumber}
            </Text>
          </View>
        </View>
      )}

      {/* Birth Certificate */}
      {data.primeBirthCertificate?.birthCertificateRegNo && (
        <View style={pdfStyles.infoBox}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5, fontSize: 11 }}>
            Birth Certificate
          </Text>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Registration Number:</Text>
            <Text style={pdfStyles.value}>
              {data.primeBirthCertificate.birthCertificateRegNo}
            </Text>
          </View>
          {data.primeBirthCertificate.birthCertificateIssueDate && (
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Issue Date:</Text>
              <Text style={pdfStyles.value}>
                {formatDate(
                  data.primeBirthCertificate.birthCertificateIssueDate
                )}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Other ID Cards */}
      {data.primeKiwiAccessCard?.kiwiAccessCardNumber && (
        <View style={pdfStyles.infoBox}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5, fontSize: 11 }}>
            Kiwi Access Card
          </Text>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Card Number:</Text>
            <Text style={pdfStyles.value}>
              {data.primeKiwiAccessCard.kiwiAccessCardNumber}
            </Text>
          </View>
          {data.primeKiwiAccessCard.kiwiAccessCardIssueDate && (
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Issue Date:</Text>
              <Text style={pdfStyles.value}>
                {formatDate(data.primeKiwiAccessCard.kiwiAccessCardIssueDate)}
              </Text>
            </View>
          )}
          {data.primeKiwiAccessCard.kiwiAccessCardExpiryDate && (
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Expiry Date:</Text>
              <Text style={pdfStyles.value}>
                {formatDate(data.primeKiwiAccessCard.kiwiAccessCardExpiryDate)}
              </Text>
            </View>
          )}
        </View>
      )}

      {data.primeCommunityServiceCard?.communityServiceCardNumber && (
        <View style={pdfStyles.infoBox}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5, fontSize: 11 }}>
            Community Service Card
          </Text>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Card Number:</Text>
            <Text style={pdfStyles.value}>
              {data.primeCommunityServiceCard.communityServiceCardNumber}
            </Text>
          </View>
        </View>
      )}

      {data.primegoldCard?.goldCardNumber && (
        <View style={pdfStyles.infoBox}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5, fontSize: 11 }}>
            Gold Card
          </Text>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Card Number:</Text>
            <Text style={pdfStyles.value}>
              {data.primegoldCard.goldCardNumber}
            </Text>
          </View>
        </View>
      )}

      {data.primestudentID?.currentStudentCardNumber && (
        <View style={pdfStyles.infoBox}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5, fontSize: 11 }}>
            Student ID
          </Text>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Student Card Number:</Text>
            <Text style={pdfStyles.value}>
              {data.primestudentID.currentStudentCardNumber}
            </Text>
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={pdfStyles.footer}>
        <Text style={pdfStyles.pageNumber}>Page 3 of 7</Text>
        <Text>First Credit Union - Personal Loan Application</Text>
      </View>
    </Page>
  )
}
