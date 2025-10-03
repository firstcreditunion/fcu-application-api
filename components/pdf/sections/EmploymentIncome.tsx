import React from 'react'
import { View, Text, Page } from '@react-pdf/renderer'
import { pdfStyles } from '../styles/pdfStyles'
import { EnrichedPrimeLoanData } from '@/types/pdf/enrichedLoanData'
import { PDFHeader } from './Header'
import { format } from 'date-fns'

interface EmploymentIncomeProps {
  data: EnrichedPrimeLoanData
}

export const EmploymentIncome: React.FC<EmploymentIncomeProps> = ({ data }) => {
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
        title='Employment & Income'
        applicationNumber={data.loanApplicationNumber}
        date={formatDate(data.created_at)}
      />

      {/* Employment Details */}
      <Text style={pdfStyles.subtitle}>Employment Information</Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Employment Type Code:</Text>
          <Text style={pdfStyles.value}>
            {data.primeEmployment.employmentType}
          </Text>
        </View>
        {data.primeEmployment.employmentTypeDescription && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Employment Type:</Text>
            <Text style={pdfStyles.value}>
              {data.primeEmployment.employmentTypeDescription}
            </Text>
          </View>
        )}
        {data.primeEmployment.employerName && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Employer Name:</Text>
            <Text style={pdfStyles.value}>
              {data.primeEmployment.employerName}
            </Text>
          </View>
        )}
        {data.primeEmployment.schoolorTertiaryInst && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>School/Tertiary Institute:</Text>
            <Text style={pdfStyles.value}>
              {data.primeEmployment.schoolorTertiaryInst}
            </Text>
          </View>
        )}
      </View>

      {/* Occupation */}
      <Text style={pdfStyles.subtitle}>Occupation</Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Occupation Code:</Text>
          <Text style={pdfStyles.value}>{data.primeEmployment.occupation}</Text>
        </View>
        {data.primeEmployment.occupationDescription && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Occupation:</Text>
            <Text style={pdfStyles.value}>
              {data.primeEmployment.occupationDescription}
            </Text>
          </View>
        )}
      </View>

      {/* Employment Duration */}
      {data.primeEmployment.exceptionEmpMonth &&
        data.primeEmployment.expceptionEmpYear && (
          <>
            <Text style={pdfStyles.subtitle}>Employment Duration</Text>
            <View style={pdfStyles.section}>
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.label}>Started Employment:</Text>
                <Text style={pdfStyles.value}>
                  {data.primeEmployment.exceptionEmpMonth}{' '}
                  {data.primeEmployment.expceptionEmpYear}
                </Text>
              </View>
            </View>
          </>
        )}

      {/* Income Details */}
      <Text style={pdfStyles.subtitle}>Income Information</Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Income Frequency:</Text>
          <Text style={pdfStyles.value}>
            {getIncomeFrequency(data.primeEmployment.incomeFrequency)}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Net Income:</Text>
          <Text style={pdfStyles.value}>${data.primeEmployment.netIncome}</Text>
        </View>
      </View>

      {/* Benefits */}
      {data.primeEmployment.typeOfBenefit &&
        data.primeEmployment.typeOfBenefit.length > 0 && (
          <>
            <Text style={pdfStyles.subtitle}>Benefits</Text>
            <View style={pdfStyles.section}>
              {data.primeEmployment.typeOfBenefit.map(
                (benefit: string, index: number) => (
                  <View key={index} style={pdfStyles.row}>
                    <Text style={pdfStyles.value}>• {benefit}</Text>
                  </View>
                )
              )}
            </View>
          </>
        )}

      {/* Footer */}
      <View style={pdfStyles.footer}>
        <Text style={pdfStyles.pageNumber}>Page 4 of 7</Text>
        <Text>First Credit Union - Personal Loan Application</Text>
      </View>
    </Page>
  )
}
