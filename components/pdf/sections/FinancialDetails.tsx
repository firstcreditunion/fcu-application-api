import React from 'react'
import { View, Text, Page } from '@react-pdf/renderer'
import { pdfStyles } from '../styles/pdfStyles'
import { EnrichedPrimeLoanData } from '@/types/pdf/enrichedLoanData'
import { PDFHeader } from './Header'
import { format } from 'date-fns'

interface FinancialDetailsProps {
  data: EnrichedPrimeLoanData
}

export const FinancialDetails: React.FC<FinancialDetailsProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy')
    } catch {
      return dateString
    }
  }

  const getPaymentFrequency = (code: string) => {
    const frequencies: { [key: string]: string } = {
      W: 'Weekly',
      F: 'Fortnightly',
      M: 'Monthly',
      Q: 'Quarterly',
      Y: 'Yearly',
    }
    return frequencies[code] || code
  }

  const getLoanTermType = (code: string) => {
    const types: { [key: string]: string } = {
      M: 'Months',
      Y: 'Years',
      W: 'Weeks',
      D: 'Days',
    }
    return types[code] || code
  }

  return (
    <Page size='A4' style={pdfStyles.page}>
      <PDFHeader
        title='Financial Details'
        applicationNumber={data.loanApplicationNumber}
        date={formatDate(data.created_at)}
      />

      {/* Loan Product */}
      <Text style={pdfStyles.subtitle}>Loan Product</Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Product Code:</Text>
          <Text style={pdfStyles.value}>
            {data.formFinancialDetails.product}
          </Text>
        </View>
        {data.formFinancialDetails.productDescription && (
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Product Name:</Text>
            <Text style={pdfStyles.value}>
              {data.formFinancialDetails.productDescription}
            </Text>
          </View>
        )}
      </View>

      {/* Loan Amount & Terms */}
      <Text style={pdfStyles.subtitle}>Loan Amount & Terms</Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Cost of Goods:</Text>
          <Text style={pdfStyles.value}>
            ${data.formFinancialDetails.costOfGoods}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Loan Term:</Text>
          <Text style={pdfStyles.value}>
            {data.formFinancialDetails.Loan_Term_1}{' '}
            {getLoanTermType(data.formFinancialDetails.Loan_Term_2)}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Start Date:</Text>
          <Text style={pdfStyles.value}>
            {formatDate(data.formFinancialDetails.start_Date)}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Payment Frequency:</Text>
          <Text style={pdfStyles.value}>
            {getPaymentFrequency(data.formFinancialDetails.paymentFrequency)}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Interest Rate:</Text>
          <Text style={pdfStyles.value}>
            {data.formFinancialDetails.Interest_Rate}%
          </Text>
        </View>
      </View>

      {/* Calculated Amounts */}
      <Text style={pdfStyles.subtitle}>Payment Summary</Text>
      <View style={pdfStyles.infoBox}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Instalment Amount:</Text>
          <Text style={pdfStyles.value}>
            ${data.formFinancialDetails.instalmentAmount}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Total Interest:</Text>
          <Text style={pdfStyles.value}>
            ${data.formFinancialDetails.totalInterest}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={{ ...pdfStyles.label, fontWeight: 'bold' }}>
            Total Amount Payable:
          </Text>
          <Text style={{ ...pdfStyles.value, fontWeight: 'bold' }}>
            ${data.formFinancialDetails.totalAmountPayable}
          </Text>
        </View>
      </View>

      {/* Fees */}
      <Text style={pdfStyles.subtitle}>Fees</Text>
      {data.formFinancialDetails.feesWithDescriptions &&
      data.formFinancialDetails.feesWithDescriptions.length > 0 ? (
        <View style={pdfStyles.table}>
          {/* Table Header */}
          <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
            <Text style={[pdfStyles.tableCell, pdfStyles.tableCellCode]}>
              Fee Code
            </Text>
            <Text style={[pdfStyles.tableCell, pdfStyles.tableCellDescription]}>
              Description
            </Text>
          </View>
          {/* Table Rows */}
          {data.formFinancialDetails.feesWithDescriptions.map((fee, index) => (
            <View key={index} style={pdfStyles.tableRow}>
              <Text style={[pdfStyles.tableCell, pdfStyles.tableCellCode]}>
                {fee.code}
              </Text>
              <Text
                style={[pdfStyles.tableCell, pdfStyles.tableCellDescription]}
              >
                {fee.description}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={pdfStyles.infoBox}>
          <Text>No fees applied</Text>
        </View>
      )}

      {/* Insurance */}
      <Text style={pdfStyles.subtitle}>Credit Care Insurance</Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Insurance Required:</Text>
          <Text style={pdfStyles.value}>
            {data.formFinancialDetails.needCreditCareInsurance || 'No'}
          </Text>
        </View>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Default Fees:</Text>
          <Text style={pdfStyles.value}>
            {data.formFinancialDetails.defaultFees ? 'Yes' : 'No'}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={pdfStyles.footer}>
        <Text style={pdfStyles.pageNumber}>Page 6 of 7</Text>
        <Text>First Credit Union - Personal Loan Application</Text>
      </View>
    </Page>
  )
}
