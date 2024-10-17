import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

// Ensure the client is created only once
let supabase: SupabaseClient;

export function createClient(): SupabaseClient {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase URL and Key must be provided!");
    }

    supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  return supabase;
}
