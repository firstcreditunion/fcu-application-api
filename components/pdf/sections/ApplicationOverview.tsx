import React from 'react'
import { View, Text, Page } from '@react-pdf/renderer'
import { pdfStyles } from '../styles/pdfStyles'
import { EnrichedPrimeLoanData } from '@/types/pdf/enrichedLoanData'
import { PDFHeader } from './Header'
import { format } from 'date-fns'

interface ApplicationOverviewProps {
  data: EnrichedPrimeLoanData
}

export const ApplicationOverview: React.FC<ApplicationOverviewProps> = ({
  data,
}) => {
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
        title='Personal Loan Application'
        applicationNumber={data.loanApplicationNumber}
        date={formatDate(data.created_at)}
      />

      {/* Applicant Information */}
      <Text style={pdfStyles.subtitle}>Applicant Information</Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Full Name:</Text>
          <Text style={pdfStyles.value}>
            {data.primePersonalDetails.title}{' '}
            {data.primePersonalDetails.firstName}{' '}
            {data.primePersonalDetails.middleName}{' '}
            {data.primePersonalDetails.lastName}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Date of Birth:</Text>
          <Text style={pdfStyles.value}>
            {formatDate(data.primePersonalDetails.dateOfBirth)}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Gender:</Text>
          <Text style={pdfStyles.value}>
            {data.primePersonalDetails.gender === 'M' ? 'Male' : 'Female'}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Marital Status:</Text>
          <Text style={pdfStyles.value}>
            {data.primePersonalDetails.maritalStatus === 'M'
              ? 'Married'
              : data.primePersonalDetails.maritalStatus === 'S'
                ? 'Single'
                : data.primePersonalDetails.maritalStatus === 'D'
                  ? 'Divorced'
                  : data.primePersonalDetails.maritalStatus}
          </Text>
        </View>
      </View>

      {/* Contact Details */}
      <Text style={pdfStyles.subtitle}>Contact Details</Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Email:</Text>
          <Text style={pdfStyles.value}>
            {data.primeContactDetails.emailAddress}
          </Text>
        </View>
        {data.primeContactDetails.mobileNumber && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Mobile:</Text>
            <Text style={pdfStyles.value}>
              {data.primeContactDetails.mobileNumber}
            </Text>
          </View>
        )}
        {data.primeContactDetails.workPhoneNumber && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Work Phone:</Text>
            <Text style={pdfStyles.value}>
              {data.primeContactDetails.workPhoneNumber}
            </Text>
          </View>
        )}
      </View>

      {/* Credit Sense Information */}
      <Text style={pdfStyles.subtitle}>Credit Assessment</Text>
      <View style={pdfStyles.section}>
        {data.credit_sense_app_ref && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Credit Sense Reference:</Text>
            <Text style={pdfStyles.value}>{data.credit_sense_app_ref}</Text>
          </View>
        )}
        {data.credit_sense_app_id && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Credit Sense App ID:</Text>
            <Text style={pdfStyles.value}>{data.credit_sense_app_id}</Text>
          </View>
        )}
        {data.app_sales_channel && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Sales Channel:</Text>
            <Text style={pdfStyles.value}>{data.app_sales_channel}</Text>
          </View>
        )}
      </View>

      {/* Client Number */}
      <Text style={pdfStyles.subtitle}>Client Information</Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Prime Client Number:</Text>
          <Text style={pdfStyles.value}>{data.primeClientNumber}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={pdfStyles.footer}>
        <Text style={pdfStyles.pageNumber}>Page 1 of 7</Text>
        <Text>First Credit Union - Personal Loan Application</Text>
      </View>
    </Page>
  )
}
