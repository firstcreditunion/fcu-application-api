'use server'

import { createClient } from '@/utils/supabase/server'
import { getSchemaToUse } from '@/utils/schemToUse'

export async function getLoanApplicationDetailsByApplicationNumber(
  applicationNumber: number
) {
  const supabase = await createClient()
  const schema = await getSchemaToUse()

  const { data } = await supabase
    .schema(schema)
    .from('tblLoanApplication')
    .select('*')
    .eq('application_number', applicationNumber)

  if (!data) return

  return data
}

export async function getTradingBranches() {
  const supabase = await createClient()
  const schema = await getSchemaToUse()

  const { data } = await supabase
    .schema(schema)
    .from('tblFCU_TradingBranches')
    .select('*')

  if (!data) return

  return data
}

export async function getLoanPurposes() {
  const supabase = await createClient()
  const schema = await getSchemaToUse()

  const { data } = await supabase
    .schema(schema)
    .from('tblLoanPurposeCodes')
    .select('*')

  if (!data) return

  return data
}

export async function getFeeCodes() {
  const supabase = await createClient()
  const schema = await getSchemaToUse()

  const { data } = await supabase.schema(schema).from('s$tblFees').select('*')

  if (!data) return

  return data
}

export async function getLendingProducts() {
  const supabase = await createClient()
  const schema = await getSchemaToUse()

  const { data } = await supabase
    .schema(schema)
    .from('tblFCU_LendingProductTypes')
    .select('*')

  if (!data) return

  return data
}
