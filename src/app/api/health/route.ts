import { ok } from "@/server/api-response";
import { hasSupabaseAdminConfig, hasSupabasePublicConfig } from "@/server/env";
import { checkPostgresConnection } from "@/server/postgres";
import { checkSupabaseRest } from "@/server/supabase/rest-health";

export const runtime = "nodejs";

export async function GET() {
  let database:
    | {
        connected: true;
        currentDatabase: string;
        currentUser: string;
        checkedAt: string;
      }
    | {
        connected: false;
        error: string;
      };
  let supabaseRest:
    | {
        connected: true;
        status: number;
        contentType: string;
      }
    | {
        connected: false;
        error: string;
      };

  try {
    const info = await checkPostgresConnection();
    database = {
      connected: true,
      currentDatabase: info.current_database,
      currentUser: info.current_user,
      checkedAt: info.now.toISOString(),
    };
  } catch (error) {
    database = {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown database error",
    };
  }

  try {
    const info = await checkSupabaseRest();
    supabaseRest = {
      connected: true,
      status: info.status,
      contentType: info.contentType,
    };
  } catch (error) {
    supabaseRest = {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown Supabase REST error",
    };
  }

  return Response.json(
    ok({
      app: "jibas-modern",
      status: "ok",
      supabasePublicConfigured: hasSupabasePublicConfig(),
      supabaseAdminConfigured: hasSupabaseAdminConfig(),
      supabaseRest,
      database,
    }),
  );
}
