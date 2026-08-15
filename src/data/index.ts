import type { DataService } from '@/data/dataService'
import { LocalDataService } from '@/data/localDataService'
import { SupabaseDataService } from '@/data/supabaseDataService'
import { supabase } from '@/lib/supabaseClient'

// Supabase when it is configured, browser storage otherwise. The fallback is
// what lets the shop run — and be developed against — with no backend at all;
// admin auth switches on the same signal, so the two never disagree about
// which world they are in.
export const dataService: DataService = supabase
  ? new SupabaseDataService(supabase)
  : new LocalDataService()

export const isUsingSupabase = Boolean(supabase)

export * from '@/data/dataService'
