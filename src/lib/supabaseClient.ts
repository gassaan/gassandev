import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

// Only instantiate once env vars are provided. Swapping the local data
// service for a Supabase-backed one is the intended next step once this
// is configured — see src/data/dataService.ts for the contract to implement.
export const supabase = isSupabaseConfigured ? createClient(url!, anonKey!) : null
