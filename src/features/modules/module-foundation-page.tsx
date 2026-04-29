import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Database, FileText, ShieldCheck } from "lucide-react";
import { appModules, type AppModuleKey } from "@/config/modules";
import { AppShell } from "@/components/layout/app-shell";

const modulePlans: Record<
  AppModuleKey,
  {
    heading: string;
    summary: string;
    forms: string[];
    nextSteps: string[];
  }
> = {
  akademik: {
    heading: "Foundation Akademik",
    summary: "Master data akademik, siswa, kelas, jadwal, presensi siswa, dan penilaian.",
    forms: ["Departemen", "Tahun ajaran", "Kelas", "Siswa baru"],
    nextSteps: ["Mapping tabel akad", "Validasi NIS unik", "Riwayat kelas dan departemen"],
  },
  keuangan: {
    heading: "Foundation Keuangan",
    summary: "Tahun buku, akun rekening, penerimaan, pengeluaran, jurnal, dan tabungan.",
    forms: ["Tahun buku", "Akun rekening", "Jenis penerimaan", "Jurnal umum"],
    nextSteps: ["Transaksi debit kredit", "Nomor kas aman concurrency", "Audit jurnal"],
  },
  kepegawaian: {
    heading: "Foundation Kepegawaian",
    summary: "Master pegawai, riwayat SDM, presensi reguler, lembur, dan laporan.",
    forms: ["Pegawai baru", "Bagian pegawai", "Presensi harian", "Lembur"],
    nextSteps: ["Validasi NIP unik", "Pola terakhir=1", "Constraint presensi"],
  },
  perpustakaan: {
    heading: "Foundation Perpustakaan",
    summary: "Pustaka, eksemplar, anggota, peminjaman, pengembalian, dan barcode.",
    forms: ["Pustaka baru", "Eksemplar", "Anggota", "Peminjaman"],
    nextSteps: ["Draft peminjaman", "Counter katalog aman", "Storage cover"],
  },
  cbe: {
    heading: "Foundation CBE",
    summary: "Ujian, bank soal, peserta, jawaban, hasil, dan resource soal.",
    forms: ["Daftar ujian", "Bank soal", "Peserta", "Jadwal ujian"],
    nextSteps: ["Strategi CBE Server", "Migrasi resource", "Cache ujian"],
  },
  authz: {
    heading: "Pengguna dan Hak Akses",
    summary: "Login, role, permission, session guard, audit akses, dan bridge user legacy.",
    forms: ["User", "Role", "Permission", "Audit login"],
    nextSteps: ["Bridge jbsuser.login", "Middleware protection", "Permission helper"],
  },
};

export function ModuleFoundationPage({ moduleKey }: { moduleKey: AppModuleKey }) {
  const appModule = appModules.find((item) => item.key === moduleKey);
  const plan = modulePlans[moduleKey];

  if (!appModule) {
    return null;
  }

  const Icon = appModule.icon;

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 p-8 text-white">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-cyan-100">
                  <Icon className="h-4 w-4" />
                  {appModule.legacyDatabase} → {appModule.targetSchema}
                </div>
                <h1 className="mt-5 text-3xl font-semibold tracking-tight lg:text-4xl">{plan.heading}</h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200">{plan.summary}</p>
              </div>
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-cyan-50"
              >
                Masuk aplikasi
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
              <Database className="h-4 w-4 text-cyan-700" />
              Schema target
            </div>
            <p className="mt-3 font-mono text-2xl font-semibold text-cyan-700">{appModule.targetSchema}</p>
            <p className="mt-2 text-sm leading-5 text-slate-600">Domain ini disiapkan untuk migrasi bertahap dari {appModule.legacyDatabase}.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              Guardrail
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">Semua proses simpan penting wajib melewati server action/API route, validasi Zod, dan transaksi database.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
              <Clock className="h-4 w-4 text-amber-700" />
              Status
            </div>
            <p className="mt-3 text-sm font-semibold capitalize text-slate-950">{appModule.status}</p>
            <p className="mt-2 text-sm leading-5 text-slate-600">Halaman foundation aktif agar navigasi dan alur awal bisa diuji tanpa 404.</p>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-cyan-700" />
              <h2 className="text-lg font-semibold text-slate-950">Form prioritas</h2>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {plan.forms.map((form) => (
                <Link
                  key={form}
                  href={`${appModule.href}#${form.toLowerCase().replaceAll(" ", "-")}`}
                  className="group rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-cyan-200 hover:bg-cyan-50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-slate-900">{form}</span>
                    <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-cyan-700" />
                  </div>
                  <p className="mt-2 text-sm leading-5 text-slate-600">Blueprint form siap dikembangkan menjadi CRUD penuh.</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Langkah berikutnya</h2>
            <div className="mt-5 space-y-4">
              {plan.nextSteps.map((step) => (
                <div key={step} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-700" />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{step}</div>
                    <div className="mt-1 text-sm leading-5 text-slate-600">Mengikuti catatan reverse engineering dan prioritas MVP.</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
