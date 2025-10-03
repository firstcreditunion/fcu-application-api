import React from 'react'
import { View, Text, Page } from '@react-pdf/renderer'
import { pdfStyles } from '../styles/pdfStyles'
import { EnrichedJointLoanData } from '@/types/pdf/enrichedJointLoanData'
import { PDFHeader } from './Header'
import { format } from 'date-fns'

interface JointVehicleSecurityProps {
  data: EnrichedJointLoanData
}

export const JointVehicleSecurity: React.FC<JointVehicleSecurityProps> = ({
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
        title='Loan Security & Insurance'
        applicationNumber={data.loanApplicationNumber}
        date={formatDate(data.created_at)}
      />

      {/* Vehicle Security */}
      <Text style={pdfStyles.subtitle}>Loan Security Details</Text>
      <View style={pdfStyles.section}>
        <View style={pdfStyles.row}>
          <Text style={pdfStyles.label}>Vehicle Security Provided:</Text>
          <Text style={pdfStyles.value}>
            {data.vehicleSecurity.provideVehicleAsLoanSecurity === 'Y'
              ? 'Yes'
              : 'No'}
          </Text>
        </View>

        {data.vehicleSecurity.provideVehicleAsLoanSecurity === 'Y' && (
          <>
            {data.vehicleSecurity.haveYouPurchasedVehicle && (
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.label}>Vehicle Purchased:</Text>
                <Text style={pdfStyles.value}>
                  {data.vehicleSecurity.haveYouPurchasedVehicle === 'Y'
                    ? 'Yes'
                    : 'No'}
                </Text>
              </View>
            )}
            {data.vehicleSecurity.vehicleRegistrationNumber && (
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.label}>Registration Number:</Text>
                <Text style={pdfStyles.value}>
                  {data.vehicleSecurity.vehicleRegistrationNumber}
                </Text>
              </View>
            )}
            {data.vehicleSecurity.isVehicleInsured && (
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.label}>Vehicle Insured:</Text>
                <Text style={pdfStyles.value}>
                  {data.vehicleSecurity.isVehicleInsured === 'Y' ? 'Yes' : 'No'}
                </Text>
              </View>
            )}
            {data.vehicleSecurity.nameOfInsurer && (
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.label}>Insurer Name:</Text>
                <Text style={pdfStyles.value}>
                  {data.vehicleSecurity.nameOfInsurer}
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* Insurance Selection */}
      {data.formFinancialDetails.needCreditCareInsurance === 'Yes' && (
        <>
          <Text style={pdfStyles.subtitle}>Selected Insurance Coverage</Text>
          <View style={pdfStyles.infoBox}>
            {data.formFinancialDetails.component && (
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.label}>Insurance Type:</Text>
                <Text style={pdfStyles.value}>
                  {data.formFinancialDetails.component}
                </Text>
              </View>
            )}
            {data.formFinancialDetails.coverType && (
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.label}>Cover Type:</Text>
                <Text style={pdfStyles.value}>
                  {data.formFinancialDetails.coverType}
                </Text>
              </View>
            )}
            {data.formFinancialDetails.coversIncluded && (
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.label}>Coverage Includes:</Text>
                <Text style={pdfStyles.value}>
                  {data.formFinancialDetails.coversIncluded}
                </Text>
              </View>
            )}
            {data.formFinancialDetails.premiumAmount !== undefined && (
              <View style={pdfStyles.row}>
                <Text style={pdfStyles.label}>Premium Amount:</Text>
                <Text style={pdfStyles.value}>
                  ${data.formFinancialDetails.premiumAmount.toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        </>
      )}

      {/* Footer */}
      <View style={pdfStyles.footer}>
        <Text style={pdfStyles.pageNumber}>Page 12</Text>
        <Text>First Credit Union - Joint Loan Application</Text>
      </View>
    </Page>
  )
}
