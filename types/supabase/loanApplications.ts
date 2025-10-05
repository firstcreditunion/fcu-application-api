import { Database } from '@/database.types'

// Define the possible schema types
// Define the possible schema types
type SchemaType = 'production' | 'api'

export let insert_tblSovereignApplications: Database[SchemaType]['Tables']['tblSovereignApplications']['Insert']
export let update_tblSovereignApplications: Database[SchemaType]['Tables']['tblSovereignApplications']['Update']
