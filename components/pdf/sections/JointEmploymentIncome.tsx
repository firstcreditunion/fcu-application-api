import React from 'react'
import { View, Text, Page } from '@react-pdf/renderer'
import { pdfStyles } from '../styles/pdfStyles'
import { EnrichedJointLoanData } from '@/types/pdf/enrichedJointLoanData'
import { PDFHeader } from './Header'
import { format } from 'date-fns'

interface JointEmploymentIncomeProps {
  data: EnrichedJointLoanData
}

export const JointEmploymentIncome: React.FC<JointEmploymentIncomeProps> = ({
  data,
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy')
    } catch {
      return dateString
    }
  }

  const getIncomeFrequency = (code: string) => {
    const frequencies: { [key: string]: string } = {
      W: 'Weekly',
      F: 'Fortnightly',
      M: 'Monthly',
      Y: 'Yearly',
    }
    return frequencies[code] || code
  }

  return (
    <Page size='A4' style={pdfStyles.page}>
      <PDFHeader
        title='Joint Applicant - Employment & Income'
        applicationNumber={data.loanApplicationNumber}
        date={formatDate(data.created_at)}
      />

      {/* Employment Details */}
      <Text style={pdfStyles.subtitle}>Employment Information</Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Employment Type Code:</Text>
          <Text style={pdfStyles.value}>
            {data.jointEmployment.employmentType}
          </Text>
        </View>
        {data.jointEmployment.employmentTypeDescription && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Employment Type:</Text>
            <Text style={pdfStyles.value}>
              {data.jointEmployment.employmentTypeDescription}
            </Text>
          </View>
        )}
        {data.jointEmployment.employerName && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Employer Name:</Text>
            <Text style={pdfStyles.value}>
              {data.jointEmployment.employerName}
            </Text>
          </View>
        )}
        {data.jointEmployment.schoolorTertiaryInst && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>School/Tertiary Institute:</Text>
            <Text style={pdfStyles.value}>
              {data.jointEmployment.schoolorTertiaryInst}
            </Text>
          </View>
        )}
      </View>

      {/* Occupation */}
      {data.jointEmployment.occupation && (
        <>
          <Text style={pdfStyles.subtitle}>Occupation</Text>
          <View style={pdfStyles.section}>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Occupation Code:</Text>
              <Text style={pdfStyles.value}>
                {data.jointEmployment.occupation}
              </Text>
            </View>
            {data.jointEmployment.occupationDescription && (
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.label}>Occupation:</Text>
                <Text style={pdfStyles.value}>
                  {data.jointEmployment.occupationDescription}
                </Text>
              </View>
            )}
          </View>
        </>
      )}

      {/* Employment Duration */}
      {data.jointEmployment.exceptionEmpMonth &&
        data.jointEmployment.expceptionEmpYear && (
          <>
            <Text style={pdfStyles.subtitle}>Employment Duration</Text>
            <View style={pdfStyles.section}>
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.label}>Started Employment:</Text>
                <Text style={pdfStyles.value}>
                  {data.jointEmployment.exceptionEmpMonth}{' '}
                  {data.jointEmployment.expceptionEmpYear}
                </Text>
              </View>
            </View>
          </>
        )}

      {/* Income Details */}
      {data.jointEmployment.incomeFrequency && (
        <>
          <Text style={pdfStyles.subtitle}>Income Information</Text>
          <View style={pdfStyles.section}>
            <View style={pdfStyles.row}>
              <Text style={pdfStyles.label}>Income Frequency:</Text>
              <Text style={pdfStyles.value}>
                {getIncomeFrequency(data.jointEmployment.incomeFrequency)}
              </Text>
            </View>
            {data.jointEmployment.netIncome && (
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.label}>Net Income:</Text>
                <Text style={pdfStyles.value}>
                  ${data.jointEmployment.netIncome}
                </Text>
              </View>
            )}
          </View>
        </>
      )}

      {/* Footer */}
      <View style={pdfStyles.footer}>
        <Text style={pdfStyles.pageNumber}>Page 10</Text>
        <Text>First Credit Union - Joint Loan Application</Text>
      </View>
    </Page>
  )
}
