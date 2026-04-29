import Link from "next/link";
import { Home, LogIn } from "lucide-react";
import { appModules } from "@/config/modules";

function ModuleNav({ compact = false }: { compact?: boolean }) {
  return (
    <nav className={compact ? "flex gap-2 overflow-x-auto px-4 py-3" : "space-y-1 px-3 py-4"}>
      {appModules.map((module) => {
        const Icon = module.icon;

        return (
          <Link
            key={module.key}
            href={module.href}
            className={
              compact
                ? "group inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800"
                : "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-900"
            }
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-cyan-700 transition group-hover:bg-white group-hover:shadow-sm">
              <Icon className="h-4 w-4" />
            </span>
            <span>{module.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#ecfeff_42%,#f8fafc_100%)] text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl lg:block">
        <div className="border-b border-slate-200/80 px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-600 to-sky-700 text-sm font-bold tracking-tight text-white shadow-lg shadow-cyan-700/20">
              JM
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight text-slate-950">JIBAS Modern</div>
              <div className="mt-0.5 text-xs font-medium text-slate-500">Rewrite bertahap ke Supabase</div>
            </div>
          </Link>
        </div>
        <div className="px-3 pt-4">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-xl bg-slate-950 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-800"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
              <Home className="h-4 w-4" />
            </span>
            Dashboard
          </Link>
        </div>
        <ModuleNav />
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-xl lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-700">Workspace</div>
              <div className="text-base font-semibold tracking-tight text-slate-950">Modernisasi JIBAS</div>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </div>
        </header>
        <div className="border-b border-slate-200/70 bg-white/70 backdrop-blur-xl lg:hidden">
          <ModuleNav compact />
        </div>
        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
