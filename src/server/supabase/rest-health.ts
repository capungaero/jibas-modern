import { env, hasSupabaseAdminConfig } from "@/server/env";

export async function checkSupabaseRest() {
  if (!hasSupabaseAdminConfig()) {
    throw new Error("Supabase service config belum tersedia.");
  }

  const restUrl =
    env.SUPABASE_REST_URL ?? `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`;

  const response = await fetch(restUrl, {
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY!,
      authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Supabase REST status ${response.status}`);
  }

  return {
    status: response.status,
    contentType: response.headers.get("content-type") ?? "unknown",
  };
}
