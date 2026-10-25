import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nrulsswncuxpybfyibgg.supabase.co";
// In server routes, use service role key if available, otherwise fall back to anon key
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

export function getSupabaseServerClient() {
  return createClient(supabaseUrl, serviceKey || "placeholder-key", {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
