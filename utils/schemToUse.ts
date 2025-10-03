import { getHost } from './globalUtils'

// Define a type for the allowed schemas
type Schema = 'api' | 'production'

export async function getSchemaToUse(): Promise<Schema> {
  //   const origin = await getOrigin()
  const host = await getHost()

  console.log('Host: ', host)

  if (
    process.env.SCHEMEA_TO_USE === '' &&
    host &&
    host.startsWith('localhost')
  ) {
    return 'api'
  }

  if (host && host === 'fcu-application-api.vercel.app') {
    return 'api'
  }

  if (host && host === 'fcu-portal-api-prod.vercel.app') {
    return 'production'
  }

  return 'api'
}
