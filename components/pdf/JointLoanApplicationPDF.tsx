import React from 'react'
import { Document } from '@react-pdf/renderer'
import { EnrichedJointLoanData } from '@/types/pdf/enrichedJointLoanData'

// Prime Applicant Sections
import { ApplicationOverview } from './sections/ApplicationOverview'
import { PreliminaryInfo } from './sections/PreliminaryInfo'
import { PersonalDetails } from './sections/PersonalDetails'
import { EmploymentIncome } from './sections/EmploymentIncome'
import { ContactAddress } from './sections/ContactAddress'
import { FinancialDetails } from './sections/FinancialDetails'

// Joint Applicant Sections
import { JointPreliminaryInfo } from './sections/JointPreliminaryInfo'
import { JointPersonalDetails } from './sections/JointPersonalDetails'
import { JointEmploymentIncome } from './sections/JointEmploymentIncome'
import { JointContactAddress } from './sections/JointContactAddress'
import { JointVehicleSecurity } from './sections/JointVehicleSecurity'

// Shared Section
import { SecurityInsurance } from './sections/SecurityInsurance'

interface JointLoanApplicationPDFProps {
  data: EnrichedJointLoanData
}

export const JointLoanApplicationPDF: React.FC<
  JointLoanApplicationPDFProps
> = ({ data }) => {
  // Convert joint data to prime format for reusing prime components
  const primeData = data as unknown as Parameters<
    typeof ApplicationOverview
  >[0]['data']

  return (
    <Document>
      {/* Prime Applicant Pages (1-7) */}
      <ApplicationOverview data={primeData} />
      <PreliminaryInfo data={primeData} />
      <PersonalDetails data={primeData} />
      <EmploymentIncome data={primeData} />
      <ContactAddress data={primeData} />
      <FinancialDetails data={primeData} />
      <SecurityInsurance data={primeData} />

      {/* Joint Applicant Pages (8-11) */}
      <JointPreliminaryInfo data={data} />
      <JointPersonalDetails data={data} />
      <JointEmploymentIncome data={data} />
      <JointContactAddress data={data} />

      {/* Vehicle Security & Selected Insurance (12) */}
      <JointVehicleSecurity data={data} />
    </Document>
  )
}
