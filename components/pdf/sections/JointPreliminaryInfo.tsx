import React from 'react'
import { View, Text, Page } from '@react-pdf/renderer'
import { pdfStyles } from '../styles/pdfStyles'
import { EnrichedJointLoanData } from '@/types/pdf/enrichedJointLoanData'
import { PDFHeader } from './Header'
import { format } from 'date-fns'

interface JointPreliminaryInfoProps {
  data: EnrichedJointLoanData
}

export const JointPreliminaryInfo: React.FC<JointPreliminaryInfoProps> = ({
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
        title='Joint Applicant - Preliminary Information'
        applicationNumber={data.loanApplicationNumber}
        date={formatDate(data.created_at)}
      />

      {/* Citizenship & Residency */}
      <Text style={pdfStyles.subtitle}>Citizenship & Residency Status</Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>New Zealand Citizen:</Text>
          <Text style={pdfStyles.value}>
            {data.jointPreliminaryQuestions.isNzCitizen === 'Y' ? 'Yes' : 'No'}
          </Text>
        </View>
        {data.jointPreliminaryQuestions.citizenship && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Citizenship:</Text>
            <Text style={pdfStyles.value}>
              {data.jointPreliminaryQuestions.citizenship}
            </Text>
          </View>
        )}
        {data.jointPreliminaryQuestions.isNzResident && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>New Zealand Resident:</Text>
            <Text style={pdfStyles.value}>
              {data.jointPreliminaryQuestions.isNzResident === 'Y'
                ? 'Yes'
                : 'No'}
            </Text>
          </View>
        )}
        {data.jointPreliminaryQuestions.hasWorkPermit && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Has Work Permit:</Text>
            <Text style={pdfStyles.value}>
              {data.jointPreliminaryQuestions.hasWorkPermit === 'Y'
                ? 'Yes'
                : 'No'}
            </Text>
          </View>
        )}
      </View>

      {/* Visa Information */}
      {(data.jointPreliminaryQuestions.visaStartDate ||
        data.jointPreliminaryQuestions.visaExpiryDate) && (
        <>
          <Text style={pdfStyles.subtitle}>Visa Information</Text>
          <View style={pdfStyles.section}>
            {data.jointPreliminaryQuestions.visaStartDate && (
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.label}>Visa Start Date:</Text>
                <Text style={pdfStyles.value}>
                  {formatDate(data.jointPreliminaryQuestions.visaStartDate)}
                </Text>
              </View>
            )}
            {data.jointPreliminaryQuestions.visaExpiryDate && (
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.label}>Visa Expiry Date:</Text>
                <Text style={pdfStyles.value}>
                  {formatDate(data.jointPreliminaryQuestions.visaExpiryDate)}
                </Text>
              </View>
            )}
          </View>
        </>
      )}

      {/* Bankruptcy Information */}
      <Text style={pdfStyles.subtitle}>Bankruptcy Information</Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Declared Bankrupt:</Text>
          <Text style={pdfStyles.value}>
            {data.jointPreliminaryQuestions.wasDeclaredBankrupt === 'Y'
              ? 'Yes'
              : 'No'}
          </Text>
        </View>
        {data.jointPreliminaryQuestions.bankruptcyYear && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Bankruptcy Year:</Text>
            <Text style={pdfStyles.value}>
              {data.jointPreliminaryQuestions.bankruptcyYear}
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={pdfStyles.footer}>
        <Text style={pdfStyles.pageNumber}>Page 8</Text>
        <Text>First Credit Union - Joint Loan Application</Text>
      </View>
    </Page>
  )
}
