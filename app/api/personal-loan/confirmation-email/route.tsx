import { NextResponse, type NextRequest } from 'next/server'

import type { SendEmailCommandInput } from '@aws-sdk/client-ses'

import { render } from '@react-email/components'
import { SES } from '@aws-sdk/client-ses'

import LoanThankYouEmail from '@/components/emails/LoanApplyConfirmationEmail'
import { headers } from 'next/headers'

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
  console.time('Total Request Processing Time')

  const {
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
  } = await request.json()

  const emailHtml = await render(
    <LoanThankYouEmail
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
    />
  )

  const params: SendEmailCommandInput = {
    Source: 'do-not-reply@firstcu.co.nz',
    Destination: {
      ToAddresses: ['isaac.vicliph@firstcu.co.nz'],
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
        Data: 'Your loan application has been received - Application #1234567890',
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
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  } finally {
  }
}
