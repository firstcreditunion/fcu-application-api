'use server'

import { lambdaClient } from '@/utils/aws/config'
import { InvokeCommand } from '@aws-sdk/client-lambda'

export interface SERDistinctApplicationQueryOptions {
  applicationsCreatedSince: string // ISO date string (YYYY-MM-DD)
}

export interface SERDistinctApplicationQueryResult {
  success: boolean
  data?: SERDistinctDataRecord[]
  recordCount?: number
  queryParams?: {
    startDate: string
    endDate: string
  }
  error?: string
}

export interface SERDistinctDataRecord {
  Applicatn_External_Number: string
}

export async function getClientDataByDateRange(
  options: SERDistinctApplicationQueryOptions
): Promise<SERDistinctApplicationQueryResult> {
  try {
    // Input validation
    if (!options.applicationsCreatedSince?.trim()) {
      return {
        success: false,
        error: 'Start date is required (format: YYYY-MM-DD)',
      }
    }

    // Validate date format
    const startDate = new Date(options.applicationsCreatedSince)

    if (isNaN(startDate.getTime())) {
      return {
        success: false,
        error: 'Invalid start date format. Use YYYY-MM-DD',
      }
    }

    console.log('Invoking Lambda function for client data query:', options)

    // Prepare Lambda parameters
    const params = {
      FunctionName: process.env.LAMBDA_FUNCTION_CLIENT_DATA_QUERY!,
      Payload: JSON.stringify({
        startDate: options.applicationsCreatedSince,
      }),
    }

    // Execute Lambda function
    const command = new InvokeCommand(params)
    const { Payload } = await lambdaClient.send(command)

    if (!Payload) {
      return {
        success: false,
        error: 'Empty response from Lambda function',
      }
    }

    // Parse Lambda response
    const lambdaResult = JSON.parse(Buffer.from(Payload).toString())

    if (lambdaResult.statusCode !== 200) {
      return {
        success: false,
        error: `Lambda function error (${lambdaResult.statusCode}): ${lambdaResult.body}`,
      }
    }

    // Parse client data
    let clientData: unknown
    try {
      clientData = JSON.parse(lambdaResult.body)
    } catch (parseError) {
      return {
        success: false,
        error: `Failed to parse client data: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`,
      }
    }

    // Type validation and return
    if (
      typeof clientData === 'object' &&
      clientData !== null &&
      'success' in clientData
    ) {
      return clientData as SERDistinctApplicationQueryResult
    }

    return {
      success: false,
      error: 'Invalid response format from Lambda function',
    }
  } catch (error) {
    console.error('[v0] Client data query error:', error)
    return {
      success: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}
