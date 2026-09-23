import { Database } from '@/database.types'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * The Portal API's database client, on its own secret key.
 *
 * The Portal API is a backend: every caller is a route handler or the sync cron,
 * never a browser. Until 23 Sep 2026 it used the public (anon) key, which kept
 * the draft application tables, the sync tables and the storage bucket open to
 * anyone holding that key. On the secret key the database can close them.
 *
 * There is no fallback to the public key. A missing SUPABASE_SECRET_KEY fails
 * the request with a clear error instead of quietly reopening the tables.
 * Security programme: PORTALAPI-DB-01.
 */
export async function createClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY
  if (!secretKey) {
    throw new Error(
      'SUPABASE_SECRET_KEY is not set. The Portal API reads and writes with its own secret key.'
    )
  }

  return createSupabaseClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
