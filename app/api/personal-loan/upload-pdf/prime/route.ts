import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getLoanApplicationDetailsByApplicationNumber } from '@/lib/supabase/loan-application/select'
import { enrichPrimeLoanData } from '@/lib/pdf/enrichLoanData'
import { generatePrimeLoanPDF } from '@/lib/pdf/generatePrimeLoanPDF'
import { getSchemaToUse } from '@/utils/schemToUse'
import { createClient } from '@/utils/supabase/server'

// Retrieve the API Secret from environment variables
const API_SECRET = process.env.MEMBERSHIP_ENDPOINT_SECRET

export async function POST(request: NextRequest) {
  try {
    // Check if API_SECRET is configured
    if (!API_SECRET) {
      console.error('API_SECRET is not set in the environment variables.')
      return NextResponse.json(
        {
          success: false,
          error: 'Internal Server Error: Service not configured.',
        },
        {
          status: 500,
        }
      )
    }

    // Validate API Secret from headers
    const headersList = await headers()
    const providedSecret = headersList.get('X-API-Secret')

    if (!providedSecret) {
      return NextResponse.json(
        {
          success: false,
          error: 'API Secret is missing from headers.',
        },
        {
          status: 401,
        }
      )
    }

    if (providedSecret !== API_SECRET) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid API Secret.',
        },
        { status: 403 }
      )
    }

    const schemaTouse = await getSchemaToUse()

    // Parse request body
    const body = await request.json()
    const { loan_application_number } = body

    // Validate loan_application_number
    if (!loan_application_number) {
      return NextResponse.json(
        {
          success: false,
          error: 'loan_application_number is required in the request body.',
        },
        { status: 400 }
      )
    }

    // Fetch loan application from database
    const loanApplicationData =
      await getLoanApplicationDetailsByApplicationNumber(
        loan_application_number
      )

    if (!loanApplicationData || loanApplicationData.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `No loan application found with application number: ${loan_application_number}`,
        },
        {
          status: 404,
        }
      )
    }

    const loanApplication = loanApplicationData[0]

    // Check if json_request exists
    if (!loanApplication.json_request) {
      return NextResponse.json(
        {
          success: false,
          error: 'Loan application does not have json_request data.',
        },
        { status: 400 }
      )
    }

    // Parse json_request
    let parsedJsonRequest
    try {
      parsedJsonRequest =
        typeof loanApplication.json_request === 'string'
          ? JSON.parse(loanApplication.json_request)
          : loanApplication.json_request
    } catch (parseError) {
      console.error('Error parsing json_request:', parseError)
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid json_request format in loan application.',
        },
        { status: 500 }
      )
    }

    // Extract database fields
    const dbFields = {
      created_at: loanApplication.created_at,
      credit_sense_app_ref: loanApplication.credit_sense_app_ref,
      credit_sense_app_id: loanApplication.credit_sense_app_id,
      app_sales_channel: loanApplication.app_sales_channel,
    }

    // Enrich the data with descriptions
    const enrichedData = await enrichPrimeLoanData(parsedJsonRequest, dbFields)

    // Generate PDF
    const pdfBuffer = await generatePrimeLoanPDF(enrichedData)

    // Determine storage bucket based on schema
    const bucket =
      schemaTouse === 'production' ? 'production-storage' : 'test-storage'
    const filePath = `draft-application/web-form-submission/${loan_application_number}/OnlineLoanApplication.pdf`

    // Upload PDF to Supabase Storage
    const supabase = await createClient()
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      })

    if (uploadError) {
      console.error('Error uploading PDF to storage:', uploadError)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to upload PDF to storage',
          details: uploadError.message,
        },
        {
          status: 500,
        }
      )
    }

    // Return success response with upload details
    return NextResponse.json(
      {
        success: true,
        message: 'PDF successfully uploaded to storage',
        data: {
          loan_application_number,
          bucket,
          path: uploadData.path,
          file_size: pdfBuffer.length,
          uploaded_at: new Date().toISOString(),
        },
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in PDF upload route:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while generating and uploading the PDF.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
      }
    )
  }
}
