import { supabaseClient } from "@/lib/supabaseClient";

export function getSupabaseServerConfig() {
  return supabaseClient;
}
