import { supabaseClient } from "@/lib/supabaseClient";

export function getSupabaseBrowserConfig() {
  return supabaseClient;
}
