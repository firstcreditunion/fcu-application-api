'use client'

import { Button } from '@/components/ui/button'
import {
  fetchApplicationsSinceData,
  fetchMediumApplicationData,
} from '@/lib/occ/applications'

export default function Home() {
  const sendEmail = async () => {
    const sesResponse = await fetch('/api/personal-loan/confirmation-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Secret':
          'Lq87XxXgnNs2uyKQ.AuGyZFRNG6XnbXKKKeAknvA7arVcKbAY_6iRYWQP@aRx_Ju',
      },
      body: JSON.stringify({
        recipientEmail: 'isaac.vicliph@firstcu.co.nz',
        title: 'Mr',
        firstName: 'Malakai',
        loanAmount: '10000',
        loanTerm: '5 years',
        interestRate: '8.95%',
        totalInterest: '2500',
        totalAmountPayable: '12500',
        instalmentAmount: '208.33',
        instalmentFrequencyHeader: 'Monthly',
        insuranceAmount: '500',
        needProvidentInsurance: 'Yes',
        insuranceType: 'Comprehensive',
        coverType: 'Life & Disability',
        coversIncluded: 'Death, Disability, Involuntary Unemployment',
        tempLoanApplicationNumber: 'TEMP-12345',
        submittedDateTime: new Date().toLocaleString(),
        loanApplicationNumber: '568',
        applicantName: 'Mr John Doe',
      }),
    })

    const result = await sesResponse.json()
    console.log('Email send response: ', result)
  }
  const callLambdaWorkflowForJoint = async () => {
    const sesResponse = await fetch('/api/personal-loan/draft/joint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Secret':
          'Lq87XxXgnNs2uyKQ.AuGyZFRNG6XnbXKKKeAknvA7arVcKbAY_6iRYWQP@aRx_Ju',
      },
      body: JSON.stringify({
        loanApplicationNumber: 579,
        supabaseIntegrityState: {
          portal_client_number: 2660,
          primeClientPersonalDetailsUID: 633,
          primeClientWorkVisaDetailsUniqueID: 555,
          primeClientBankruptcyUID: 666,
          primeClientExtensionUniqueID: 667,
          product: 'PERN',
          costOfGoods: '3,000',
          defaultFees: false,
          Loan_Term_1: 36,
          start_Date: '2025-08-25',
          Loan_Term_2: 'M',
          paymentFrequency: 'W',
          Interest_Rate: '12.75',
          fees: ['LCFRA', 'LCRFB', 'LCRFC', 'LCRFD', 'LCRFE', 'LCRFF', 'LCRFG'],
          primeResidentialAddressUniqueID: 1035,
          primeMailingAddressUniqueID: 1036,
          primeEmailUniqueID: 555,
          primeClientMobileUniqueID: 584,
          primeEmploymentUniqueID: 502,
          primeBenefitsUniqueID: 100,
          primeBenefitDetailsUniqueID: 99,
          primeSecurityUniqueID: '3f3b137f-d7b9-49d8-a595-b28f2aedd2ac',
          primeCreditSenseReference: 'ONL_CS_nOnTFdFfBb',
          membership_application_number: 1506,
          emailAddressForProgress: 'samisaac75@gmail.com',
          primePassportUniqueID: 'b2200630-06bc-4184-a291-efb3e37fe795',
          primeFinancialDetailsUniqueID: 66,
        },
        supabaseIntegrityJointState: {
          portal_client_number: 2661,
          jointClientPersonalDetailsUID: 634,
          jointClientWorkVisaDetailsUniqueID: 556,
          jointClientBankruptcyUID: 667,
          jointClientExtensionUniqueID: 668,
          jointEmailUniqueID: 556,
          jointClientMobileUniqueID: 585,
          jointResidentialAddressUniqueID: 1037,
          jointMailingAddressUniqueID: 1038,
          jointEmploymentUniqueID: 503,
          jointBenefitsUniqueID: 101,
          jointBenefitDetailsUniqueID: 100,
          jointDriversLicenceUniqueID: 'a232bb40-c630-4099-b939-a1b29f26b650',
        },
        primePreliminaryQuestions: {
          isNzCitizen: 'Y',
          citizenship: '',
          isNzResident: '',
          hasWorkPermit: '',
          askFurtherQuestions: 'Y',
          loanPurposeCode: 'TRVL',
          tradingBranch: 'HAM',
          wasDeclaredBankrupt: 'N',
          bankruptcyYear: '',
        },
        primeDriversLicence: {
          licenceType: 'F',
          licenceNumber: 'DT123456',
          licenceVersion: '083',
          licenceIssueDate: '2025-08-25T12:00:00.000Z',
          licenceExpiryDate: '2035-08-25T12:00:00.000Z',
        },
        primePassport: {
          passportNumber: 'XE123456',
          passportIssueDate: '2016-06-20T12:00:00.000Z',
          passportExpiryDate: '2025-12-20T11:00:00.000Z',
        },
        primeFirearmsLicence: { firearmsNumber: '' },
        primeBirthCertificate: { birthCertificateRegNo: '' },
        primeKiwiAccessCard: { kiwiAccessCardNumber: '' },
        primeCommunityServiceCard: { communityServiceCardNumber: '' },
        primegoldCard: { goldCardNumber: '' },
        primestudentID: { currentStudentCardNumber: '' },
        primePersonalDetails: {
          title: 'Mr',
          firstName: 'Peter',
          middleName: '',
          lastName: 'Testing',
          gender: 'M',
          maritalStatus: 'S',
          dateOfBirth: '1977-12-16T11:00:00.000Z',
          dependantAdults: 0,
          dependantChildren: 0,
        },
        primeEmployment: {
          employmentType: 'BNF',
          schoolorTertiaryInst: '',
          occupation: '',
          employerName: '',
          typeOfBenefit: ['SOLP'],
          exceptionEmpMonth: 'February',
          expceptionEmpYear: '2024',
          incomeFrequency: 'F',
          netIncome: '3000',
        },
        primeContactDetails: {
          residentialAddress:
            'Unit 2, 16 Manning Street, Hamilton Central, Hamilton 3204',
          residentialAddressPxid: '3-1qMeWeX2z5FFv95fNhcpee',
          accommodationType: 'RENT',
          residentialEffectiveMonth: 'March',
          residentialEffectiveYear: '2022',
          mailingAddress: '',
          emailAddress: 'samisaac75@gmail.com',
          mobileNumber: '+64212549633',
          workPhoneNumber: '',
        },
        jointPreliminaryQuestions: {
          isNzCitizen: 'Y',
          citizenship: '',
          isNzResident: '',
          hasWorkPermit: '',
          askFurtherQuestions: 'Y',
          wasDeclaredBankrupt: 'N',
          bankruptcyYear: '',
        },
        jointPersonalDetails: {
          title: 'Mr',
          firstName: 'Apple',
          middleName: '',
          lastName: 'Testing',
          gender: 'M',
          maritalStatus: 'S',
          dateOfBirth: '1991-06-20T12:00:00.000Z',
          dependantAdults: 0,
          dependantChildren: 0,
        },
        jointEmployment: {
          employmentType: 'BNF',
          schoolorTertiaryInst: '',
          occupation: '',
          employerName: '',
          typeOfBenefit: ['SOLP'],
          exceptionEmpMonth: 'February',
          expceptionEmpYear: '2022',
          incomeFrequency: 'F',
          netIncome: '3000',
        },
        jointContactDetails: {
          residentialAddress:
            '111 Collingwood Street, Hamilton Central, Hamilton 3204',
          residentialAddressPxid: '2-.E.Y.L.C$W',
          accommodationType: 'RENT',
          residentialEffectiveMonth: 'March',
          residentialEffectiveYear: '2021',
          mailingAddress: '',
          emailAddress: 'dummy@email.com',
          mobileNumber: '+642100000000',
          workPhoneNumber: '',
        },
        jointDriversLicence: { licenceNumber: '', licenceVersion: '' },
        jointPassport: { passportNumber: '' },
        jointFirearmsLicence: { firearmsNumber: '' },
        jointBirthCertificate: { birthCertificateRegNo: '' },
        jointKiwiAccessCard: { kiwiAccessCardNumber: '' },
        jointCommunityServiceCard: { communityServiceCardNumber: '' },
        jointgoldCard: { goldCardNumber: '' },
        jointstudentID: { currentStudentCardNumber: '' },
        formFinancialDetails: {
          product: 'PERN',
          costOfGoods: '3,000',
          defaultFees: false,
          Loan_Term_1: 36,
          start_Date: '2025-08-25',
          Loan_Term_2: 'M',
          paymentFrequency: 'W',
          Interest_Rate: '12.75',
          fees: ['LCFRA', 'LCRFB', 'LCRFC', 'LCRFD', 'LCRFE', 'LCRFF', 'LCRFG'],
          instalmentAmount: '23.39',
          totalInterest: '619.04',
          totalAmountPayable: '3,648.34',
        },
        vehicleSecurity: {
          provideVehicleAsLoanSecurity: 'Y',
          haveYouPurchasedVehicle: 'Y',
          vehicleRegistrationNumber: 'FAM958',
          isVehicleInsured: 'Y',
          nameOfInsurer: 'Provident',
        },
        providentInsurance: [
          {
            g3_insurance_cover_type: 'CCI1',
            insurance_type: 'Single',
            cover_type: 'Option 1',
            lambda_code_component: 'OPTION1',
            lambda_code_cover_type: 'SINGLE',
            cover_desc: 'Death, Hospitalisation, or Bankruptcy',
            joint: 'N',
          },
          {
            g3_insurance_cover_type: 'CCI2',
            insurance_type: 'Single',
            cover_type: 'Option 2',
            lambda_code_component: 'OPTION2',
            lambda_code_cover_type: 'SINGLE',
            cover_desc:
              'Death, Accident, Illness, Hospitalisation, or Bankruptcy',
            joint: 'N',
          },
          {
            g3_insurance_cover_type: 'CCI3',
            insurance_type: 'Single',
            cover_type: 'Option 3',
            lambda_code_component: 'OPTION3',
            lambda_code_cover_type: 'SINGLE',
            cover_desc:
              'Death, Accident, Illness, Hospitalisation, Bankruptcy, or Income Disruption',
            joint: 'N',
          },
          {
            g3_insurance_cover_type: 'CCI4',
            insurance_type: 'Double',
            cover_type: 'Option 1',
            lambda_code_component: 'OPTION1',
            lambda_code_cover_type: 'DOUBLE',
            cover_desc: 'Death, Hospitalisation, or Bankruptcy',
            joint: 'Y',
          },
          {
            g3_insurance_cover_type: 'CCI5',
            insurance_type: 'Double',
            cover_type: 'Option 2',
            lambda_code_component: 'OPTION2',
            lambda_code_cover_type: 'DOUBLE',
            cover_desc:
              'Death, Accident, Illness, Hospitalisation, or Bankruptcy',
            joint: 'Y',
          },
          {
            g3_insurance_cover_type: 'CCI6',
            insurance_type: 'Double',
            cover_type: 'Option 3',
            lambda_code_component: 'OPTION3',
            lambda_code_cover_type: 'DOUBLE',
            cover_desc:
              'Death, Accident, Illness, Hospitalisation, Bankruptcy, or Income Disruption',
            joint: 'Y',
          },
          {
            g3_insurance_cover_type: 'CCI7',
            insurance_type: 'Joint',
            cover_type: 'Option 1',
            lambda_code_component: 'OPTION1',
            lambda_code_cover_type: 'JOINT',
            cover_desc: 'Death, Hospitalisation, or Bankruptcy',
            joint: 'Y',
          },
          {
            g3_insurance_cover_type: 'CCI8',
            insurance_type: 'Joint',
            cover_type: 'Option 2',
            lambda_code_component: 'OPTION2',
            lambda_code_cover_type: 'JOINT',
            cover_desc:
              'Death, Accident, Illness, Hospitalisation, or Bankruptcy',
            joint: 'Y',
          },
          {
            g3_insurance_cover_type: 'CCI9',
            insurance_type: 'Joint',
            cover_type: 'Option 3',
            lambda_code_component: 'OPTION3',
            lambda_code_cover_type: 'JOINT',
            cover_desc:
              'Death, Accident, Illness, Hospitalisation, Bankruptcy, or Income Disruption',
            joint: 'Y',
          },
        ],
      }),
    })

    const result = await sesResponse.json()
    console.log('Email send response: ', result)
  }

  const testFetchApplications = async () => {
    try {
      const result = await fetchApplicationsSinceData('2025-10-01')
      console.log('Applications fetched:', result)

      // Fetch detailed data for each application in parallel
      const detailedApplicationsPromises = result.map((app) =>
        fetchMediumApplicationData(app.id)
      )

      const detailedApplications = await Promise.all(
        detailedApplicationsPromises
      )
      console.log('Detailed applications:', detailedApplications)
    } catch (error) {
      console.error('Error fetching applications:', error)
    }
  }

  return (
    <div className='h-screen flex flex-col items-center justify-center text-fcu-primary-500 text-5xl font-light gap-2'>
      <div>First Credit Union API</div>
      <div className='text-xl font-light text-fcu-secondary-300'>
        Current Version: 1.0.0
      </div>
    </div>
  )
}
