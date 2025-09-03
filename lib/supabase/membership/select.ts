'use server'

import { getSchemaToUse } from '@/utils/schemToUse'
import { createClient } from '@/utils/supabase/server'

export async function tblClientPhone(cid_unique_id: number) {
  const supabase = await createClient()
  const schema = await getSchemaToUse()

  try {
    const { data } = await supabase
      .schema(schema)
      .from('s$tblClientPhone')
      .select()
      .eq('CID_Phone', cid_unique_id)

    if (!data) return

    return data
  } catch (error) {}
}

//* ------------------ Lookup tables -------------

export async function getEmploymentCodes() {
  const supabase = await createClient()
  const schema = await getSchemaToUse()

  try {
    const { data } = await supabase
      .schema('public')
      .from('tblEmploymentTypes')
      .select()

    if (!data) return

    return data
  } catch (error) {}
}
