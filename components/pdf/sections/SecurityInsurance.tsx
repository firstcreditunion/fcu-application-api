import React from 'react'
import { View, Text, Page } from '@react-pdf/renderer'
import { pdfStyles } from '../styles/pdfStyles'
import { EnrichedPrimeLoanData } from '@/types/pdf/enrichedLoanData'
import { PDFHeader } from './Header'
import { format } from 'date-fns'

interface SecurityInsuranceProps {
  data: EnrichedPrimeLoanData
}

export const SecurityInsurance: React.FC<SecurityInsuranceProps> = ({
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
        title='Security & Insurance Options'
        applicationNumber={data.loanApplicationNumber}
        date={formatDate(data.created_at)}
      />

      {/* Vehicle Security */}
      <Text style={pdfStyles.subtitle}>Loan Security</Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Vehicle Security Provided:</Text>
          <Text style={pdfStyles.value}>
            {data.vehicleSecurity.provideVehicleAsLoanSecurity === 'Y'
              ? 'Yes'
              : 'No'}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={pdfStyles.footer}>
        <Text style={pdfStyles.pageNumber}>Page 7 of 7</Text>
        <Text>First Credit Union - Personal Loan Application</Text>
      </View>
    </Page>
  )
}
