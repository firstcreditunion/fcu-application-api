import React from 'react'
import { View, Text, Page } from '@react-pdf/renderer'
import { pdfStyles } from '../styles/pdfStyles'
import { EnrichedJointLoanData } from '@/types/pdf/enrichedJointLoanData'
import { PDFHeader } from './Header'
import { format } from 'date-fns'

interface JointPersonalDetailsProps {
  data: EnrichedJointLoanData
}

export const JointPersonalDetails: React.FC<JointPersonalDetailsProps> = ({
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
        title='Joint Applicant - Personal Details'
        applicationNumber={data.loanApplicationNumber}
        date={formatDate(data.created_at)}
      />

      {/* Personal Information */}
      <Text style={pdfStyles.subtitle}>Personal Information</Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Title:</Text>
          <Text style={pdfStyles.value}>{data.jointPersonalDetails.title}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>First Name:</Text>
          <Text style={pdfStyles.value}>
            {data.jointPersonalDetails.firstName}
          </Text>
        </View>
        {data.jointPersonalDetails.middleName && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Middle Name:</Text>
            <Text style={pdfStyles.value}>
              {data.jointPersonalDetails.middleName}
            </Text>
          </View>
        )}
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Last Name:</Text>
          <Text style={pdfStyles.value}>
            {data.jointPersonalDetails.lastName}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Date of Birth:</Text>
          <Text style={pdfStyles.value}>
            {formatDate(data.jointPersonalDetails.dateOfBirth)}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Gender:</Text>
          <Text style={pdfStyles.value}>
            {data.jointPersonalDetails.gender === 'M' ? 'Male' : 'Female'}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Marital Status:</Text>
          <Text style={pdfStyles.value}>
            {data.jointPersonalDetails.maritalStatus === 'M'
              ? 'Married'
              : data.jointPersonalDetails.maritalStatus === 'S'
                ? 'Single'
                : data.jointPersonalDetails.maritalStatus === 'D'
                  ? 'Divorced'
                  : data.jointPersonalDetails.maritalStatus}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Dependant Adults:</Text>
          <Text style={pdfStyles.value}>
            {data.jointPersonalDetails.dependantAdults}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Dependant Children:</Text>
          <Text style={pdfStyles.value}>
            {data.jointPersonalDetails.dependantChildren}
          </Text>
        </View>
      </View>

      {/* Identification Documents */}
      <Text style={pdfStyles.subtitle}>Identification Documents</Text>

      {/* Driver's Licence */}
      {data.jointDriversLicence?.licenceNumber && (
        <View style={pdfStyles.infoBox}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5, fontSize: 11 }}>
            Driver&apos;s Licence
          </Text>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Licence Type:</Text>
            <Text style={pdfStyles.value}>
              {data.jointDriversLicence.licenceType}
            </Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Licence Number:</Text>
            <Text style={pdfStyles.value}>
              {data.jointDriversLicence.licenceNumber}
            </Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Version:</Text>
            <Text style={pdfStyles.value}>
              {data.jointDriversLicence.licenceVersion}
            </Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Issue Date:</Text>
            <Text style={pdfStyles.value}>
              {formatDate(data.jointDriversLicence.licenceIssueDate)}
            </Text>
          </View>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Expiry Date:</Text>
            <Text style={pdfStyles.value}>
              {formatDate(data.jointDriversLicence.licenceExpiryDate)}
            </Text>
          </View>
        </View>
      )}

      {/* Other identification documents (similar to prime) */}
      {data.jointPassport?.passportNumber && (
        <View style={pdfStyles.infoBox}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5, fontSize: 11 }}>
            Passport
          </Text>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Passport Number:</Text>
            <Text style={pdfStyles.value}>
              {data.jointPassport.passportNumber}
            </Text>
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={pdfStyles.footer}>
        <Text style={pdfStyles.pageNumber}>Page 9</Text>
        <Text>First Credit Union - Joint Loan Application</Text>
      </View>
    </Page>
  )
}
