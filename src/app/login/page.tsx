import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/features/auth/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f9] px-4 py-10 text-slate-950">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_420px]">
        <section>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke dashboard
          </Link>
          <div className="mt-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-md border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-700">
              <ShieldCheck className="h-4 w-4" />
              Supabase Auth foundation
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-normal">
              Login awal untuk aplikasi JIBAS Modern
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Form ini sementara memakai login lokal sederhana untuk mempercepat
              eksplorasi UI. Tahap berikutnya adalah bridge ke Supabase Auth dan tabel
              hak akses legacy JIBAS.
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Masuk</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Sementara gunakan username `admin` dan password `admin`.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
