import { NextResponse, type NextRequest } from 'next/server'

import type { SendEmailCommandInput } from '@aws-sdk/client-ses'

import { render } from '@react-email/components'
import { SES } from '@aws-sdk/client-ses'

import LoanThankYouEmail from '@/components/emails/LoanApplyConfirmationEmail'
import { headers } from 'next/headers'
import { emailWhiteList } from '@/utils/emialWhilteList'
// import { getHost } from '@/utils/globalUtils'

// Initialize AWS SES client
const sesClient = new SES({
  region: process.env.AWS_REGION || 'ap-southeast-2', // Default to Sydney region for NZ
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

// Retrieve the API Secret from environment variables on the server.
// This is done once when the server starts.
const API_SECRET = process.env.API_SECRET

export async function POST(request: NextRequest) {
  // First, check if the secret is even configured on the server.
  if (!API_SECRET) {
    // This is a server configuration error, so we return a 500.
    console.error('API_SECRET is not set in the environment variables.')
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error: Service not configured.',
      },
      { status: 500 }
    )
  }

  // if (API_SECRET) {
  //   return NextResponse.json(
  //     {
  //       success: false,
  //       error: 'Warning: Production Not ready yet!',
  //     },
  //     { status: 500 }
  //   )
  // }

  const headersList = await headers()
  // Get the secret from the request's 'X-API-Secret' header.
  const providedSecret = headersList.get('X-API-Secret')

  // Handle missing or incorrect secret.
  if (!providedSecret) {
    return NextResponse.json(
      { success: false, error: 'API Secret is missing from headers.' },
      { status: 401 } // Unauthorized
    )
  }

  if (providedSecret === API_SECRET) {
    console.log('API SECRET IS VALID')
  }

  // IMPORTANT: Use a secure comparison if timing attacks are a concern.
  // For this example, a direct comparison is shown for simplicity.
  if (providedSecret !== API_SECRET) {
    return NextResponse.json(
      { success: false, error: 'Invalid API Secret.' },
      { status: 403 } // Forbidden
    )
  }

  // --- Verification Successful ---
  // If the secret is valid, proceed with your main logic.
  // Performance optimization: Start timing the entire request processing

  const {
    recipientEmail,
    title,
    firstName,
    loanAmount,
    loanTerm,
    interestRate,
    totalInterest,
    totalAmountPayable,
    instalmentAmount,
    instalmentFrequencyHeader,
    insuranceAmount,
    needProvidentInsurance,
    insuranceType,
    coverType,
    coversIncluded,
    tempLoanApplicationNumber,
    submittedDateTime,
    loanApplicationNumber,
    applicantName,
  } = await request.json()

  console.log('Email Props Log: ', {
    recipientEmail,
    title,
    firstName,
    loanAmount,
    loanTerm,
    interestRate,
    totalInterest,
    totalAmountPayable,
    instalmentAmount,
    instalmentFrequencyHeader,
    insuranceAmount,
    needProvidentInsurance,
    insuranceType,
    coverType,
    coversIncluded,
    tempLoanApplicationNumber,
    submittedDateTime,
    loanApplicationNumber,
    applicantName,
  })

  if (!recipientEmail) {
    console.log('Recipient email is missing.')
    return NextResponse.json(
      { success: false, error: 'Recipient email is missing.' },
      { status: 400 }
    )
  }

  if (!loanApplicationNumber) {
    console.log('Loan application number is missing.')
    return NextResponse.json(
      { success: false, error: 'Loan application number is missing.' },
      { status: 400 }
    )
  }

  if (!emailWhiteList.includes(recipientEmail)) {
    console.log('Recipient email is not in the white list.')
    return NextResponse.json(
      { success: false, error: 'Recipient email is not in the white list.' },
      { status: 400 }
    )
  }

  const emailHtml = await render(
    <LoanThankYouEmail
      recipientEmail={recipientEmail}
      title={title}
      firstName={firstName}
      loanAmount={loanAmount}
      loanTerm={loanTerm}
      interestRate={interestRate}
      totalInterest={totalInterest}
      totalAmountPayable={totalAmountPayable}
      instalmentAmount={instalmentAmount}
      instalmentFrequencyHeader={instalmentFrequencyHeader}
      insuranceAmount={insuranceAmount}
      needProvidentInsurance={needProvidentInsurance}
      insuranceType={insuranceType}
      coverType={coverType}
      coversIncluded={coversIncluded}
      tempLoanApplicationNumber={tempLoanApplicationNumber}
      submittedDateTime={submittedDateTime}
      loanApplicationNumber={loanApplicationNumber}
      applicantName={
        applicantName || `${title || ''} ${firstName || ''}`.trim()
      }
    />
  )

  const params: SendEmailCommandInput = {
    Source: 'welcome@firstcu.co.nz',
    Destination: {
      ToAddresses: [recipientEmail],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: emailHtml,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Loan Application Confirmation - #${loanApplicationNumber}`,
      },
    },
  }

  try {
    const result = await sesClient.sendEmail(params)

    console.log('result: ', result)

    return NextResponse.json({
      success: true,
      messageId: result.MessageId,
    })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      {
        error: 'Failed to send email',
      },
      {
        status: 500,
      }
    )
  } finally {
  }
}
