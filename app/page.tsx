'use client'

import { Button } from '@/components/ui/button'

export default function Home() {
  const sendEmail = async () => {
    const sesResponse = await fetch('/api/personal-loan/confirmation-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Secret': process.env.NEXT_PUBLIC_API_SECRET || 'test-secret',
      },
      body: JSON.stringify({
        recipientEmail: 'test@example.com',
        title: 'Mr',
        firstName: 'John',
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
        loanApplicationNumber: 'FCU-2024-12345',
        applicantName: 'Mr John Doe',
      }),
    })

    const result = await sesResponse.json()
    console.log('Email send response: ', result)
  }

  return (
    <div className='font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20'>
      <Button onClick={async () => await sendEmail()}>Send Email</Button>
    </div>
  )
}
