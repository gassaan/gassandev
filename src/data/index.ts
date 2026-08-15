import type { DataService } from '@/data/dataService'
import { LocalDataService } from '@/data/localDataService'

// Swap this for a Supabase-backed implementation of DataService once
// src/lib/supabaseClient.ts is configured with real project credentials.
export const dataService: DataService = new LocalDataService()

export * from '@/data/dataService'
