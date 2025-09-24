'use server'

import { createClient } from '@/utils/supabase/server'

export async function getEmailWhitelist() {
  const supabase = await createClient()

  try {
    const { data } = await supabase
      .schema('api')
      .from('tblEmailWhitelistForComms')
      .select('email_address')

    if (!data) return

    return data
  } catch (error) {
    console.log('Error fetching email whitelist: ', error)
  }
}
