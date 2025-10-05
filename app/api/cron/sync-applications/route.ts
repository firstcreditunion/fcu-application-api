import { NextRequest, NextResponse } from 'next/server'
import { syncApplicationsSince } from '@/lib/occ/syncApplications'

// Vercel timeout: 300 seconds (5 minutes) on Pro plan
export const maxDuration = 300
export const dynamic = 'force-dynamic'

/**
 * Cron job endpoint for syncing Sovereign applications
 * Triggered by Vercel Cron every 5 minutes
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now()

  // SECURITY: Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error('[Cron] Unauthorized access attempt')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    console.log('[Cron] Starting sync job...')

    // Hardcoded sync date
    const sinceDate = '2025-07-07'
    console.log(`[Cron] Using hardcoded sync date: ${sinceDate}`)

    // Run the sync
    const result = await syncApplicationsSince(sinceDate)

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log(`[Cron] Sync completed in ${duration}s`)

    // Return detailed results
    return NextResponse.json(
      {
        ...result,
        duration: `${duration}s`,
        timestamp: new Date().toISOString(),
      },
      { status: result.success ? 200 : 500 }
    )
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.error('[Cron] Fatal error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        duration: `${duration}s`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
