import React from 'react'
import { Document } from '@react-pdf/renderer'
import { EnrichedPrimeLoanData } from '@/types/pdf/enrichedLoanData'
import { ApplicationOverview } from './sections/ApplicationOverview'
import { PreliminaryInfo } from './sections/PreliminaryInfo'
import { PersonalDetails } from './sections/PersonalDetails'
import { EmploymentIncome } from './sections/EmploymentIncome'
import { ContactAddress } from './sections/ContactAddress'
import { FinancialDetails } from './sections/FinancialDetails'
import { PrimeVehicleSecurity } from './sections/PrimeVehicleSecurity'

interface LoanApplicationPDFProps {
  data: EnrichedPrimeLoanData
}

export const LoanApplicationPDF: React.FC<LoanApplicationPDFProps> = ({
  data,
}) => {
  return (
    <Document>
      <ApplicationOverview data={data} />
      <PreliminaryInfo data={data} />
      <PersonalDetails data={data} />
      <EmploymentIncome data={data} />
      <ContactAddress data={data} />
      <FinancialDetails data={data} />
      <PrimeVehicleSecurity data={data} />
    </Document>
  )
}
