import React from 'react'
import { View, Text, Page } from '@react-pdf/renderer'
import { pdfStyles } from '../styles/pdfStyles'
import { EnrichedPrimeLoanData } from '@/types/pdf/enrichedLoanData'
import { PDFHeader } from './Header'
import { format } from 'date-fns'

interface PreliminaryInfoProps {
  data: EnrichedPrimeLoanData
}

export const PreliminaryInfo: React.FC<PreliminaryInfoProps> = ({ data }) => {
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
        title='Preliminary Information'
        applicationNumber={data.loanApplicationNumber}
        date={formatDate(data.created_at)}
      />

      {/* Citizenship & Residency */}
      <Text style={pdfStyles.subtitle}>Citizenship & Residency Status</Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>New Zealand Citizen:</Text>
          <Text style={pdfStyles.value}>
            {data.primePreliminaryQuestions.isNzCitizen === 'Y' ? 'Yes' : 'No'}
          </Text>
        </View>
        {data.primePreliminaryQuestions.citizenship && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Citizenship:</Text>
            <Text style={pdfStyles.value}>
              {data.primePreliminaryQuestions.citizenship}
            </Text>
          </View>
        )}
        {data.primePreliminaryQuestions.isNzResident && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>New Zealand Resident:</Text>
            <Text style={pdfStyles.value}>
              {data.primePreliminaryQuestions.isNzResident === 'Y'
                ? 'Yes'
                : 'No'}
            </Text>
          </View>
        )}
        {data.primePreliminaryQuestions.hasWorkPermit && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Has Work Permit:</Text>
            <Text style={pdfStyles.value}>
              {data.primePreliminaryQuestions.hasWorkPermit === 'Y'
                ? 'Yes'
                : 'No'}
            </Text>
          </View>
        )}
      </View>

      {/* Visa Information */}
      {(data.primePreliminaryQuestions.visaStartDate ||
        data.primePreliminaryQuestions.visaExpiryDate) && (
        <>
          <Text style={pdfStyles.subtitle}>Visa Information</Text>
          <View style={pdfStyles.section}>
            {data.primePreliminaryQuestions.visaStartDate && (
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.label}>Visa Start Date:</Text>
                <Text style={pdfStyles.value}>
                  {formatDate(data.primePreliminaryQuestions.visaStartDate)}
                </Text>
              </View>
            )}
            {data.primePreliminaryQuestions.visaExpiryDate && (
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.label}>Visa Expiry Date:</Text>
                <Text style={pdfStyles.value}>
                  {formatDate(data.primePreliminaryQuestions.visaExpiryDate)}
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
            {data.primePreliminaryQuestions.wasDeclaredBankrupt === 'Y'
              ? 'Yes'
              : 'No'}
          </Text>
        </View>
        {data.primePreliminaryQuestions.bankruptcyYear && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Bankruptcy Year:</Text>
            <Text style={pdfStyles.value}>
              {data.primePreliminaryQuestions.bankruptcyYear}
            </Text>
          </View>
        )}
      </View>

      {/* Loan Purpose & Branch */}
      <Text style={pdfStyles.subtitle}>Loan Details</Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Loan Purpose Code:</Text>
          <Text style={pdfStyles.value}>
            {data.primePreliminaryQuestions.loanPurposeCode}
          </Text>
        </View>
        {data.primePreliminaryQuestions.loanPurposeDescription && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Loan Purpose:</Text>
            <Text style={pdfStyles.value}>
              {data.primePreliminaryQuestions.loanPurposeDescription}
            </Text>
          </View>
        )}
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Trading Branch Code:</Text>
          <Text style={pdfStyles.value}>
            {data.primePreliminaryQuestions.tradingBranch}
          </Text>
        </View>
        {data.primePreliminaryQuestions.tradingBranchDescription && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Trading Branch:</Text>
            <Text style={pdfStyles.value}>
              {data.primePreliminaryQuestions.tradingBranchDescription}
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={pdfStyles.footer}>
        <Text style={pdfStyles.pageNumber}>Page 2 of 7</Text>
        <Text>First Credit Union - Personal Loan Application</Text>
      </View>
    </Page>
  )
}
