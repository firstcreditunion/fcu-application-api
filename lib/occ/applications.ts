'use server'

import { lambdaClient } from '@/utils/aws/config'
import { InvokeCommand } from '@aws-sdk/client-lambda'
import {
  ApplicationDateSince,
  ApplicationMedium,
} from '@/types/occ/applicationTypes'
import { getSchemaToUse } from '@/utils/schemToUse'

// Changed Date Format - YYYY-MM-DD
export async function fetchApplicationsSinceData(
  changedDateSince: string
): Promise<ApplicationDateSince[]> {
  const schema = await getSchemaToUse()

  const functionToUse =
    schema === 'production'
      ? process.env.LAMBDA_FUNCTION_APPLICATIONS_MAIN_PROD!
      : process.env.LAMBDA_FUNCTION_APPLICATIONS_MAIN_TEST!

  const params = {
    FunctionName: functionToUse,
    Payload: JSON.stringify({
      functionName: process.env.LAMBDA_FUNCTION_APPLICATIONS_BY_DATE!,
      changed_date_since: changedDateSince,
      client_id: process.env.SOV_AWS_CLIENT_NUMBER!,
    }),
  }

  try {
    const command = new InvokeCommand(params)
    const { Payload } = await lambdaClient.send(command)

    if (!Payload) {
      throw new Error('Empty response from Lambda function')
    }

    const result = JSON.parse(Buffer.from(Payload).toString())

    if (result.statusCode !== 200) {
      throw new Error(`Lambda function returned an error: ${result.body}`)
    }

    const applications: ApplicationDateSince[] = JSON.parse(result.body)

    console.log('Applications Since: ', applications)

    return applications
  } catch (error) {
    // console.error('Error calling Lambda function:', error)
    throw error
  }
}

export async function fetchMediumApplicationData(
  applicationExternalNumber: string
): Promise<ApplicationMedium> {
  const schema = await getSchemaToUse()

  const functionToUse =
    schema === 'production'
      ? process.env.LAMBDA_FUNCTION_APPLICATIONS_MAIN_PROD!
      : process.env.LAMBDA_FUNCTION_APPLICATIONS_MAIN_TEST!

  const params = {
    FunctionName: functionToUse,
    Payload: JSON.stringify({
      functionName: process.env.LAMBDA_FUNCTION_APPLICTION_MEDIUM,
      application_external_number: applicationExternalNumber,
      staff_client_number: process.env.SOV_AWS_CLIENT_NUMBER!,
    }),
  }

  try {
    const command = new InvokeCommand(params)
    const { Payload } = await lambdaClient.send(command)

    if (!Payload) {
      throw new Error('Empty response from Lambda function')
    }

    const result = JSON.parse(Buffer.from(Payload).toString())

    if (result.statusCode !== 200) {
      throw new Error(`Lambda function returned an error: ${result.body}`)
    }

    const applicationDetail: ApplicationMedium = JSON.parse(result.body)

    return applicationDetail
  } catch (error) {
    // console.error('Error calling Lambda function:', error)
    throw error
  }
}
