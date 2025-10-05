'use server'

import { createClient } from '@/utils/supabase/server'
import { getSchemaToUse } from '@/utils/schemToUse'
import { insert_tblSovereignApplications } from '@/types/supabase/loanApplications'

export async function insertLoanApplication(
  _data: typeof insert_tblSovereignApplications
) {
  const supabase = await createClient()
  const schema = await getSchemaToUse()

  const { data } = await supabase
    .schema(schema)
    .from('tblSovereignApplications')
    .insert(_data)

  if (!data) return

  return data
}

/**
 * Upsert a single sovereign application
 * Updates if G3_application_number exists, inserts if not
 */
export async function upsertSovereignApplication(
  _data: typeof insert_tblSovereignApplications
) {
  const supabase = await createClient()
  const schema = await getSchemaToUse()

  const { data, error } = await supabase
    .schema(schema)
    .from('tblSovereignApplications')
    .upsert(_data, {
      onConflict: 'G3_application_number',
    })
    .select()

  if (error) {
    console.error('[upsertSovereignApplication] Error:', error)
    throw error
  }

  return data
}

/**
 * Bulk upsert sovereign applications
 * More efficient for batch operations
 *
 * @param applications - Array of application data to upsert
 * @returns Summary of operations
 */
export async function bulkUpsertSovereignApplications(
  applications: Array<typeof insert_tblSovereignApplications>
) {
  const supabase = await createClient()
  const schema = await getSchemaToUse()

  console.log(
    `[bulkUpsertSovereignApplications] Upserting ${applications.length} applications`
  )

  const { data, error } = await supabase
    .schema(schema)
    .from('tblSovereignApplications')
    .upsert(applications, {
      onConflict: 'G3_application_number',
    })
    .select('G3_application_number')

  if (error) {
    console.error('[bulkUpsertSovereignApplications] Error:', error)
    return {
      success: false,
      upserted: 0,
      error: error.message,
    }
  }

  return {
    success: true,
    upserted: data?.length || 0,
  }
}
