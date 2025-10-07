import React from 'react'
import { View, Text, Page } from '@react-pdf/renderer'
import { pdfStyles } from '../styles/pdfStyles'
import { EnrichedPrimeLoanData } from '@/types/pdf/enrichedLoanData'
import { PDFHeader } from './Header'
import { format } from 'date-fns'

interface PrimeVehicleSecurityProps {
  data: EnrichedPrimeLoanData
}

export const PrimeVehicleSecurity: React.FC<PrimeVehicleSecurityProps> = ({
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

      {/* Available Insurance Options */}
      <Text style={pdfStyles.subtitle}>Available Insurance Options</Text>
      {data.providentInsurance && data.providentInsurance.length > 0 ? (
        <View style={pdfStyles.table}>
          {/* Single Cover Options */}
          <View style={pdfStyles.badge}>
            <Text style={{ fontWeight: 'bold', fontSize: 11, marginBottom: 5 }}>
              Single Cover Options
            </Text>
          </View>
          {data.providentInsurance
            .filter((ins) => ins.insurance_type === 'Single')
            .map((insurance, index) => (
              <View key={index} style={pdfStyles.infoBox}>
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Cover Type:</Text>
                  <Text style={pdfStyles.value}>
                    {insurance.g3_insurance_cover_type} - {insurance.cover_type}
                  </Text>
                </View>
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Coverage:</Text>
                  <Text style={pdfStyles.value}>{insurance.cover_desc}</Text>
                </View>
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Lambda Code:</Text>
                  <Text style={pdfStyles.value}>
                    {insurance.lambda_code_component} -{' '}
                    {insurance.lambda_code_cover_type}
                  </Text>
                </View>
              </View>
            ))}

          {/* Double Cover Options */}
          <View style={[pdfStyles.badge, { marginTop: 15 }]}>
            <Text style={{ fontWeight: 'bold', fontSize: 11, marginBottom: 5 }}>
              Double Cover Options
            </Text>
          </View>
          {data.providentInsurance
            .filter((ins) => ins.insurance_type === 'Double')
            .map((insurance, index) => (
              <View key={index} style={pdfStyles.infoBox}>
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Cover Type:</Text>
                  <Text style={pdfStyles.value}>
                    {insurance.g3_insurance_cover_type} - {insurance.cover_type}
                  </Text>
                </View>
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Coverage:</Text>
                  <Text style={pdfStyles.value}>{insurance.cover_desc}</Text>
                </View>
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Lambda Code:</Text>
                  <Text style={pdfStyles.value}>
                    {insurance.lambda_code_component} -{' '}
                    {insurance.lambda_code_cover_type}
                  </Text>
                </View>
              </View>
            ))}

          {/* Joint Cover Options */}
          <View style={[pdfStyles.badge, { marginTop: 15 }]}>
            <Text style={{ fontWeight: 'bold', fontSize: 11, marginBottom: 5 }}>
              Joint Cover Options
            </Text>
          </View>
          {data.providentInsurance
            .filter((ins) => ins.insurance_type === 'Joint')
            .map((insurance, index) => (
              <View key={index} style={pdfStyles.infoBox}>
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Cover Type:</Text>
                  <Text style={pdfStyles.value}>
                    {insurance.g3_insurance_cover_type} - {insurance.cover_type}
                  </Text>
                </View>
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Coverage:</Text>
                  <Text style={pdfStyles.value}>{insurance.cover_desc}</Text>
                </View>
                <View style={pdfStyles.row}>
                  <Text style={pdfStyles.label}>Lambda Code:</Text>
                  <Text style={pdfStyles.value}>
                    {insurance.lambda_code_component} -{' '}
                    {insurance.lambda_code_cover_type}
                  </Text>
                </View>
              </View>
            ))}
        </View>
      ) : (
        <View style={pdfStyles.infoBox}>
          <Text>No insurance options available</Text>
        </View>
      )}

      {/* Footer */}
      <View style={pdfStyles.footer}>
        <Text style={pdfStyles.pageNumber}>Page 7 of 7</Text>
        <Text>First Credit Union - Personal Loan Application</Text>
      </View>
    </Page>
  )
}
