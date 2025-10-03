import React from 'react'
import { View, Text, Page } from '@react-pdf/renderer'
import { pdfStyles } from '../styles/pdfStyles'
import { EnrichedPrimeLoanData } from '@/types/pdf/enrichedLoanData'
import { PDFHeader } from './Header'
import { format } from 'date-fns'

interface ContactAddressProps {
  data: EnrichedPrimeLoanData
}

export const ContactAddress: React.FC<ContactAddressProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy')
    } catch {
      return dateString
    }
  }

  const getAccommodationType = (code: string) => {
    const types: { [key: string]: string } = {
      OWM: 'Own Mortgage',
      OWF: 'Own Freehold',
      RNT: 'Renting',
      BRD: 'Boarding',
      LVP: 'Living with Parents',
    }
    return types[code] || code
  }

  return (
    <Page size='A4' style={pdfStyles.page}>
      <PDFHeader
        title='Contact & Address Details'
        applicationNumber={data.loanApplicationNumber}
        date={formatDate(data.created_at)}
      />

      {/* Residential Address */}
      <Text style={pdfStyles.subtitle}>Residential Address</Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Address:</Text>
          <Text style={pdfStyles.value}>
            {data.primeContactDetails.residentialAddress}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Accommodation Type:</Text>
          <Text style={pdfStyles.value}>
            {getAccommodationType(data.primeContactDetails.accommodationType)} (
            {data.primeContactDetails.accommodationType})
          </Text>
        </View>
        {data.primeContactDetails.residentialEffectiveMonth &&
          data.primeContactDetails.residentialEffectiveYear && (
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Residing Since:</Text>
              <Text style={pdfStyles.value}>
                {data.primeContactDetails.residentialEffectiveMonth}{' '}
                {data.primeContactDetails.residentialEffectiveYear}
              </Text>
            </View>
          )}
        {data.primeContactDetails.residentialAddressPxid && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Address PXID:</Text>
            <Text style={pdfStyles.value}>
              {data.primeContactDetails.residentialAddressPxid}
            </Text>
          </View>
        )}
      </View>

      {/* Mailing Address */}
      <Text style={pdfStyles.subtitle}>Mailing Address</Text>
      <View style={pdfStyles.section}>
        {data.primeContactDetails.mailingAddress ===
        data.primeContactDetails.residentialAddress ? (
          <View style={pdfStyles.infoBox}>
            <Text>Same as Residential Address</Text>
          </View>
        ) : (
          <>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Address:</Text>
              <Text style={pdfStyles.value}>
                {data.primeContactDetails.mailingAddress}
              </Text>
            </View>
            {data.primeContactDetails.mailingAddressPxid && (
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.label}>Address PXID:</Text>
                <Text style={pdfStyles.value}>
                  {data.primeContactDetails.mailingAddressPxid}
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* Contact Information */}
      <Text style={pdfStyles.subtitle}>Contact Information</Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Email Address:</Text>
          <Text style={pdfStyles.value}>
            {data.primeContactDetails.emailAddress}
          </Text>
        </View>
        {data.primeContactDetails.mobileNumber && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Mobile Number:</Text>
            <Text style={pdfStyles.value}>
              {data.primeContactDetails.mobileNumber}
            </Text>
          </View>
        )}
        {data.primeContactDetails.workPhoneNumber && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Work Phone Number:</Text>
            <Text style={pdfStyles.value}>
              {data.primeContactDetails.workPhoneNumber}
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={pdfStyles.footer}>
        <Text style={pdfStyles.pageNumber}>Page 5 of 7</Text>
        <Text>First Credit Union - Personal Loan Application</Text>
      </View>
    </Page>
  )
}
