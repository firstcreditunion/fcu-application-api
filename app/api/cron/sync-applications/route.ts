import { NextRequest, NextResponse } from 'next/server'
import {
  syncApplicationsSince,
  getLastSyncDate,
} from '@/lib/occ/syncApplications'

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

    // Get the date to sync from (query param or last sync date)
    const searchParams = request.nextUrl.searchParams
    let sinceDate = searchParams.get('since')

    if (!sinceDate) {
      // Try to get last successful sync date
      const lastSync = await getLastSyncDate()

      if (lastSync) {
        console.log(`[Cron] Using last sync date: ${lastSync}`)
        sinceDate = lastSync
      } else {
        // Default to 7 days ago if no previous sync
        const defaultDate = new Date()
        defaultDate.setDate(defaultDate.getDate() - 7)
        sinceDate = defaultDate.toISOString().split('T')[0]
        console.log(
          `[Cron] No previous sync found, using default: ${sinceDate}`
        )
      }
    }

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
