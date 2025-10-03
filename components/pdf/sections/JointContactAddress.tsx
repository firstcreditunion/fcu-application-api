import React from 'react'
import { View, Text, Page } from '@react-pdf/renderer'
import { pdfStyles } from '../styles/pdfStyles'
import { EnrichedJointLoanData } from '@/types/pdf/enrichedJointLoanData'
import { PDFHeader } from './Header'
import { format } from 'date-fns'

interface JointContactAddressProps {
  data: EnrichedJointLoanData
}

export const JointContactAddress: React.FC<JointContactAddressProps> = ({
  data,
}) => {
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
      OWOM: 'Own Outright',
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
        title='Joint Applicant - Contact & Address'
        applicationNumber={data.loanApplicationNumber}
        date={formatDate(data.created_at)}
      />

      {/* Residential Address */}
      <Text style={pdfStyles.subtitle}>Residential Address</Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Address:</Text>
          <Text style={pdfStyles.value}>
            {data.jointContactDetails.residentialAddress}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Accommodation Type:</Text>
          <Text style={pdfStyles.value}>
            {getAccommodationType(data.jointContactDetails.accommodationType)} (
            {data.jointContactDetails.accommodationType})
          </Text>
        </View>
        {data.jointContactDetails.residentialEffectiveMonth &&
          data.jointContactDetails.residentialEffectiveYear && (
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Residing Since:</Text>
              <Text style={pdfStyles.value}>
                {data.jointContactDetails.residentialEffectiveMonth}{' '}
                {data.jointContactDetails.residentialEffectiveYear}
              </Text>
            </View>
          )}
        {data.jointContactDetails.residentialAddressPxid && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Address PXID:</Text>
            <Text style={pdfStyles.value}>
              {data.jointContactDetails.residentialAddressPxid}
            </Text>
          </View>
        )}
      </View>

      {/* Mailing Address */}
      <Text style={pdfStyles.subtitle}>Mailing Address</Text>
      <View style={pdfStyles.section}>
        {data.jointContactDetails.mailingAddress ===
        data.jointContactDetails.residentialAddress ? (
          <View style={pdfStyles.infoBox}>
            <Text>Same as Residential Address</Text>
          </View>
        ) : (
          <>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Address:</Text>
              <Text style={pdfStyles.value}>
                {data.jointContactDetails.mailingAddress}
              </Text>
            </View>
            {data.jointContactDetails.mailingAddressPxid && (
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.label}>Address PXID:</Text>
                <Text style={pdfStyles.value}>
                  {data.jointContactDetails.mailingAddressPxid}
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
            {data.jointContactDetails.emailAddress}
          </Text>
        </View>
        {data.jointContactDetails.mobileNumber && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Mobile Number:</Text>
            <Text style={pdfStyles.value}>
              {data.jointContactDetails.mobileNumber}
            </Text>
          </View>
        )}
        {data.jointContactDetails.workPhoneNumber && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Work Phone Number:</Text>
            <Text style={pdfStyles.value}>
              {data.jointContactDetails.workPhoneNumber}
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={pdfStyles.footer}>
        <Text style={pdfStyles.pageNumber}>Page 11</Text>
        <Text>First Credit Union - Joint Loan Application</Text>
      </View>
    </Page>
  )
}
