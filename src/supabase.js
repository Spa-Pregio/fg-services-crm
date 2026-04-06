import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.https://hwicjoaujczirwlatrtf.supabase.co
const supabaseAnonKey = import.meta.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3aWNqb2F1amN6aXJ3bGF0cnRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNjM3NzcsImV4cCI6MjA5MDgzOTc3N30.kv1kBQ5locVkxLAuiAVslQ59wiR47n_JJAHGvWjsymo

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
