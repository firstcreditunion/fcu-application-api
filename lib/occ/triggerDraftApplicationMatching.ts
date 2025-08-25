'use server'

// import { getEnvironemnt } from '@/utils/globalUtils'
import { lambdaClient } from '@/utils/aws/config'
import { InvokeCommand } from '@aws-sdk/client-lambda'

export async function triggerDraftApplicationMatching(
  draft_application_number: number
) {
  //   const environemnt = await getEnvironemnt()

  const params = {
    FunctionName: process.env.LAMBDA_FUNCTION_DRAFT_TEST!,
    Payload: JSON.stringify({
      portal_app_ID: draft_application_number,
    }),
  }

  console.log('Params:', params)

  try {
    const command = new InvokeCommand(params)
    const { Payload } = await lambdaClient.send(command)

    console.log('BeginFCULoanWorkflow Payload:', Payload)

    if (!Payload) {
      throw new Error('Empty response from Lambda function')
    }

    const result = JSON.parse(Buffer.from(Payload).toString())

    // console.log('Result:', result)

    if (result.statusCode !== 200) {
      return null
    }

    const financialCalResult = JSON.parse(result.body)

    return financialCalResult
  } catch (error) {
    throw error
  }
}
