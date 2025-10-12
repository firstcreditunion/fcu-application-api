'use server'

// import { getEnvironemnt } from '@/utils/globalUtils'
import { lambdaClient } from '@/utils/aws/config'
import { getSchemaToUse } from '@/utils/schemToUse'
import { InvokeCommand } from '@aws-sdk/client-lambda'

export async function triggerDraftApplicationMatching(
  draft_application_number: number
) {
  const schema = await getSchemaToUse()

  const functionToUse =
    schema === 'production'
      ? process.env.LAMBDA_FUNCTION_DRAFT_PROD!
      : process.env.LAMBDA_FUNCTION_DRAFT_TEST!

  const params = {
    FunctionName: functionToUse!,
    Payload: JSON.stringify({
      portal_app_ID: draft_application_number,
    }),
  }

  try {
    const command = new InvokeCommand(params)

    const { Payload } = await lambdaClient.send(command)

    if (!Payload) {
      console.log('Empty response from Lambda function')

      throw new Error('Empty response from Lambda function')
    }

    const result = JSON.parse(Buffer.from(Payload).toString())

    if (result.statusCode !== 200) {
      return null
    }

    const financialCalResult = JSON.parse(result.body)

    return financialCalResult
  } catch (error) {
    throw error
  }
}
