import Link from "next/link";
import { LogIn } from "lucide-react";
import { appModules } from "@/config/modules";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#f6f7f9] text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white lg:block">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="text-lg font-semibold">JIBAS Modern</div>
          <div className="mt-1 text-sm text-slate-500">Rewrite bertahap ke Supabase</div>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {appModules.map((module) => {
            const Icon = module.icon;

            return (
              <Link
                key={module.key}
                href={module.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <Icon className="h-4 w-4 text-slate-500" />
                <span>{module.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-slate-500">Workspace</div>
              <div className="text-base font-semibold">Modernisasi JIBAS</div>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </div>
        </header>
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
