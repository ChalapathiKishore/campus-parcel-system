import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = "https://fdanbsmqsgskhfojglso.supabase.co"
const supabaseKey = "sb_publishable_OhePSvMRCx5-ZTJprBQggg_xqpZAlwX"

export const supabase = createClient(supabaseUrl, supabaseKey)