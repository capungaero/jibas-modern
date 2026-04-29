import { AlertTriangle, CheckCircle2, Server } from "lucide-react";
import { checkPostgresConnection } from "@/server/postgres";
import { checkSupabaseRest } from "@/server/supabase/rest-health";

type CheckState =
  | {
      ok: true;
      title: string;
      detail: string;
    }
  | {
      ok: false;
      title: string;
      detail: string;
    };

async function getConnectivity(): Promise<CheckState[]> {
  const checks: CheckState[] = [];

  try {
    const rest = await checkSupabaseRest();
    checks.push({
      ok: true,
      title: "Supabase REST",
      detail: `Terhubung (${rest.status}, ${rest.contentType})`,
    });
  } catch (error) {
    checks.push({
      ok: false,
      title: "Supabase REST",
      detail: error instanceof Error ? error.message : "Gagal menghubungi REST API.",
    });
  }

  try {
    const db = await checkPostgresConnection();
    checks.push({
      ok: true,
      title: "Postgres direct",
      detail: `${db.current_database} sebagai ${db.current_user}`,
    });
  } catch (error) {
    checks.push({
      ok: false,
      title: "Postgres direct",
      detail: error instanceof Error ? error.message : "Gagal membuka koneksi database.",
    });
  }

  return checks;
}

export async function ConnectivityPanel() {
  const checks = await getConnectivity();

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <Server className="h-5 w-5 text-cyan-700" />
        <h2 className="text-lg font-semibold">Status koneksi</h2>
      </div>
      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {checks.map((check) => (
          <div
            key={check.title}
            className={`rounded-md border p-4 ${
              check.ok ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              {check.ok ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-700" />
              )}
              <span className={check.ok ? "text-emerald-800" : "text-amber-800"}>
                {check.title}
              </span>
            </div>
            <p className="mt-2 break-words text-sm leading-5 text-slate-700">{check.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
