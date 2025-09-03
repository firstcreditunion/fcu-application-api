import { Database } from '@/database.types'

// Define the possible schema types
type SchemaType = 'production' | 'api'

export let insert_tblDraftApplicationInsert: Database[SchemaType]['Tables']['tblDraftLoanApplication']['Insert']
