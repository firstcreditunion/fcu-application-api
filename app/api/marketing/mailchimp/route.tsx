import { NextResponse, type NextRequest } from 'next/server'
import { headers } from 'next/headers'

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
}
