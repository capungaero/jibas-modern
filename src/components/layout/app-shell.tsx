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
                ? "inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800"
                : "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-800"
            }
          >
            <Icon className="h-4 w-4 text-cyan-700" />
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e0f2fe_0,#f8fafc_28rem)] text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200/80 bg-white/90 shadow-sm backdrop-blur lg:block">
        <div className="border-b border-slate-200 px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-700 text-sm font-bold text-white shadow-sm">
              JM
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight">JIBAS Modern</div>
              <div className="mt-0.5 text-xs text-slate-500">Rewrite bertahap ke Supabase</div>
            </div>
          </Link>
        </div>
        <div className="px-3 pt-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-800"
          >
            <Home className="h-4 w-4 text-cyan-700" />
            Dashboard
          </Link>
        </div>
        <ModuleNav />
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Workspace</div>
              <div className="text-base font-semibold tracking-tight">Modernisasi JIBAS</div>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </div>
        </header>
        <div className="border-b border-slate-200/70 bg-white/60 lg:hidden">
          <ModuleNav compact />
        </div>
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
