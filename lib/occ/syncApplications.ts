'use server'

import {
  fetchApplicationsSinceData,
  fetchMediumApplicationData,
} from './applications'
import { processBatch, chunkArray } from '@/lib/utils/batchProcessor'
import { bulkUpsertSovereignApplications } from '@/lib/supabase/loan-application/insert'
import { createClient } from '@/utils/supabase/server'
import { getSchemaToUse } from '@/utils/schemToUse'
import type { ApplicationMedium } from '@/types/occ/applicationTypes'
import type { insert_tblSovereignApplications } from '@/types/supabase/loanApplications'

/**
 * Helper function to safely extract error message from unknown error
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'Unknown error'
}

interface SyncResult {
  success: boolean
  message: string
  syncLogId?: string
  stats: {
    applicationsFound: number
    applicationsFetched: number
    applicationsUpserted: number
    fetchFailures: number
    upsertFailures: number
  }
  errors?: Array<{ id: string; error: string }>
}

/**
 * Transform ApplicationMedium to Supabase insert format
 */
function transformApplicationToSupabase(
  app: ApplicationMedium
): typeof insert_tblSovereignApplications {
  return {
    G3_application_number: app.id,
    applicationInternalNumber: app.attributes.applicationInternalNumber || null,
    applicationName: app.attributes.applicationName || null,
    clientApplication: app.attributes.clientApplication || null,
    loadedByClientNumber: app.attributes.loadedByClientNumber || null,
    owner: app.attributes.owner || null,
    applicationTitle: app.attributes.applicationTitle || null,
    tradingBranch: app.attributes.tradingBranch || null,
    salesChannel: app.attributes.salesChannel || null,
    subPrime: app.attributes.subPrime || null,
    comparisonRatesSupplied: app.attributes.comparisonRatesSupplied || null,
    paymentMethod: app.attributes.paymentMethod || null,
    type: app.attributes.type || null,
    appStatusDesc: app.attributes.appStatusDesc || null,
    appStatusCode: app.attributes.appStatusCode || null,
    currentTaskWith: app.attributes.currentTaskWith || null,
    lastSavedDateTime: app.attributes.lastSavedDateTime || null,
  }
}

/**
 * Create a sync log entry in the database
 */
async function createSyncLog(sinceDate: string): Promise<string> {
  const supabase = await createClient()
  const schema = await getSchemaToUse()

  const { data, error } = await supabase
    .schema(schema)
    .from('tblsovereignapplicationssynclog')
    .insert({
      since_date: sinceDate,
      status: 'running',
    })
    .select('id')
    .single()

  if (error || !data) {
    console.error('[createSyncLog] Failed to create sync log:', error)
    throw new Error('Failed to create sync log')
  }

  return data.id
}

/**
 * Update sync log with results
 */
async function updateSyncLog(
  syncLogId: string,
  stats: SyncResult['stats'],
  status: 'completed' | 'failed',
  errorDetails?: unknown
) {
  const supabase = await createClient()
  const schema = await getSchemaToUse()

  await supabase
    .schema(schema)
    .from('tblsovereignapplicationssynclog')
    .update({
      sync_completed_at: new Date().toISOString(),
      applications_found: stats.applicationsFound,
      applications_fetched: stats.applicationsFetched,
      applications_upserted: stats.applicationsUpserted,
      fetch_failures: stats.fetchFailures,
      upsert_failures: stats.upsertFailures,
      status,
      error_details: errorDetails ? JSON.stringify(errorDetails) : null,
    })
    .eq('id', syncLogId)
}

/**
 * Main sync function - fetches and syncs Sovereign applications
 *
 * @param sinceDate - Date string in YYYY-MM-DD format
 * @returns Sync result with statistics
 */
export async function syncApplicationsSince(
  sinceDate: string
): Promise<SyncResult> {
  console.log(`[syncApplicationsSince] Starting sync from ${sinceDate}`)

  const stats = {
    applicationsFound: 0,
    applicationsFetched: 0,
    applicationsUpserted: 0,
    fetchFailures: 0,
    upsertFailures: 0,
  }

  let syncLogId: string | undefined

  try {
    // Create sync log entry
    syncLogId = await createSyncLog(sinceDate)
    console.log(`[syncApplicationsSince] Created sync log: ${syncLogId}`)

    // Step 1: Fetch list of changed applications
    const changedApps = await fetchApplicationsSinceData(sinceDate)
    stats.applicationsFound = changedApps.length

    console.log(
      `[syncApplicationsSince] Found ${changedApps.length} changed applications`
    )

    if (changedApps.length === 0) {
      await updateSyncLog(syncLogId, stats, 'completed')
      return {
        success: true,
        message: 'No applications to sync',
        syncLogId,
        stats,
      }
    }

    // Step 2: Fetch detailed application data in batches (15 concurrent)
    const { successful, failed } = await processBatch(
      changedApps,
      15, // Batch size
      async (app) => await fetchMediumApplicationData(app.id)
    )

    stats.applicationsFetched = successful.length
    stats.fetchFailures = failed.length

    console.log(
      `[syncApplicationsSince] Fetched ${successful.length} applications, ${failed.length} failed`
    )

    if (successful.length === 0) {
      await updateSyncLog(syncLogId, stats, 'failed', {
        message: 'Failed to fetch any application details',
      })
      return {
        success: false,
        message: 'Failed to fetch any application details',
        syncLogId,
        stats,
        errors: failed.map((f) => ({
          id: f.item.id,
          error: getErrorMessage(f.error),
        })),
      }
    }

    // Step 3: Transform to Supabase format
    const transformedApps = successful.map(transformApplicationToSupabase)

    // Step 4: Bulk upsert to Supabase (in chunks of 100)
    const upsertChunks = chunkArray(transformedApps, 100)
    let totalUpserted = 0
    let totalUpsertFailed = 0

    for (let i = 0; i < upsertChunks.length; i++) {
      const chunk = upsertChunks[i]
      console.log(
        `[syncApplicationsSince] Upserting chunk ${i + 1}/${upsertChunks.length} (${chunk.length} records)`
      )

      const result = await bulkUpsertSovereignApplications(chunk)

      if (result.success) {
        totalUpserted += result.upserted
      } else {
        totalUpsertFailed += chunk.length
        console.error(
          `[syncApplicationsSince] Chunk ${i + 1} failed:`,
          result.error
        )
      }
    }

    stats.applicationsUpserted = totalUpserted
    stats.upsertFailures = totalUpsertFailed

    // Update sync log
    await updateSyncLog(syncLogId, stats, 'completed')

    console.log(
      `[syncApplicationsSince] Sync completed successfully. Upserted: ${totalUpserted}, Failed: ${totalUpsertFailed}`
    )

    return {
      success: true,
      message: `Sync completed: ${totalUpserted} applications upserted`,
      syncLogId,
      stats,
      errors: failed.map((f) => ({
        id: f.item.id,
        error: getErrorMessage(f.error),
      })),
    }
  } catch (error) {
    console.error('[syncApplicationsSince] Fatal error:', error)

    if (syncLogId) {
      await updateSyncLog(syncLogId, stats, 'failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown sync error',
      syncLogId,
      stats,
    }
  }
}

/**
 * Get the last successful sync date
 */
export async function getLastSyncDate(): Promise<string | null> {
  const supabase = await createClient()
  const schema = await getSchemaToUse()

  const { data } = await supabase
    .schema(schema)
    .from('tblsovereignapplicationssynclog')
    .select('since_date, sync_completed_at')
    .eq('status', 'completed')
    .order('sync_completed_at', { ascending: false })
    .limit(1)
    .single()

  return data?.since_date || null
}
