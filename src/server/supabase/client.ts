import { createClient } from "@supabase/supabase-js";
import { env, hasSupabasePublicConfig } from "@/server/env";

export function createSupabaseServerClient() {
  if (!hasSupabasePublicConfig()) {
    throw new Error("Supabase public config belum tersedia.");
  }

  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
