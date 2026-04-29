import { AlertTriangle, CheckCircle2, Database, GitBranch, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { StatusPill } from "@/components/common/status-pill";
import { ConnectivityPanel } from "@/features/dashboard/connectivity-panel";
import {
  appModules,
  databaseSchemas,
  importantFlows,
  quickStats,
  roadmapItems,
} from "@/config/modules";
import { hasSupabasePublicConfig } from "@/server/env";

export default function Home() {
  const supabaseReady = hasSupabasePublicConfig();

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-cyan-700">Foundation roadmap</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
                  Dashboard awal migrasi JIBAS modern
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                  Baseline ini disiapkan untuk memindahkan alur data legacy JIBAS ke
                  Next.js dan Supabase secara bertahap, dimulai dari auth, master data,
                  lalu transaksi akademik dan keuangan.
                </p>
              </div>
              <div
                className={`rounded-md border px-3 py-2 text-sm font-medium ${
                  supabaseReady
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                }`}
              >
                {supabaseReady ? "Supabase configured" : "Env belum diisi"}
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {quickStats.map((item) => (
                <div key={item.label} className="rounded-md border border-slate-200 bg-slate-50 p-4">
                  <div className="text-2xl font-semibold text-slate-950">{item.value}</div>
                  <div className="mt-1 text-sm text-slate-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold">Guardrail teknis</h2>
            </div>
            <div className="mt-4 space-y-3">
              {importantFlows.map((flow) => (
                <div key={flow} className="flex gap-3 text-sm leading-5 text-slate-600">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <span>{flow}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {appModules.map((module) => {
            const Icon = module.icon;

            return (
              <article key={module.key} className="rounded-lg border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-slate-100 p-2">
                      <Icon className="h-5 w-5 text-slate-700" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-slate-950">{module.title}</h2>
                      <p className="text-xs text-slate-500">
                        {module.legacyDatabase} ke {module.targetSchema}
                      </p>
                    </div>
                  </div>
                  <StatusPill status={module.status} />
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">{module.description}</p>
              </article>
            );
          })}
        </section>

        <ConnectivityPanel />

        <section className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-cyan-700" />
              <h2 className="text-lg font-semibold">Roadmap aktif</h2>
            </div>
            <div className="mt-5 space-y-4">
              {roadmapItems.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <CheckCircle2
                    className={`mt-0.5 h-5 w-5 shrink-0 ${
                      item.done ? "text-emerald-600" : "text-slate-300"
                    }`}
                  />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                    <div className="mt-1 text-sm leading-5 text-slate-600">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-cyan-700" />
              <h2 className="text-lg font-semibold">Mapping schema awal</h2>
            </div>
            <div className="mt-5 overflow-hidden rounded-md border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Legacy MySQL</th>
                    <th className="px-4 py-3 font-medium">Supabase schema</th>
                    <th className="px-4 py-3 font-medium">Domain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {databaseSchemas.map((schema) => (
                    <tr key={schema.legacy}>
                      <td className="px-4 py-3 font-mono text-xs text-slate-700">{schema.legacy}</td>
                      <td className="px-4 py-3 font-mono text-xs text-cyan-700">{schema.target}</td>
                      <td className="px-4 py-3 text-slate-600">{schema.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
