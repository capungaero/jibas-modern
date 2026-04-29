import {
  BookOpen,
  BriefcaseBusiness,
  Calculator,
  GraduationCap,
  LibraryBig,
  MonitorCheck,
  UsersRound,
} from "lucide-react";

export type AppModuleKey =
  | "akademik"
  | "keuangan"
  | "kepegawaian"
  | "perpustakaan"
  | "cbe"
  | "authz";

export type AppModule = {
  key: AppModuleKey;
  title: string;
  description: string;
  legacyDatabase: string;
  targetSchema: string;
  href: string;
  icon: typeof GraduationCap;
  status: "planned" | "foundation" | "migration" | "ready";
};

export const appModules: AppModule[] = [
  {
    key: "akademik",
    title: "Akademik",
    description: "Siswa, kelas, jadwal, presensi, penilaian, dan pelaporan.",
    legacyDatabase: "jbsakad",
    targetSchema: "akad",
    href: "/akademik",
    icon: GraduationCap,
    status: "foundation",
  },
  {
    key: "keuangan",
    title: "Keuangan",
    description: "Penerimaan, pengeluaran, jurnal, tabungan, dan laporan.",
    legacyDatabase: "jbsfina",
    targetSchema: "fina",
    href: "/keuangan",
    icon: Calculator,
    status: "foundation",
  },
  {
    key: "kepegawaian",
    title: "Kepegawaian",
    description: "Pegawai, riwayat SDM, presensi, dan lembur.",
    legacyDatabase: "jbssdm",
    targetSchema: "sdm",
    href: "/kepegawaian",
    icon: BriefcaseBusiness,
    status: "foundation",
  },
  {
    key: "perpustakaan",
    title: "Perpustakaan",
    description: "Pustaka, eksemplar, anggota, peminjaman, dan pengembalian.",
    legacyDatabase: "jbsperpus",
    targetSchema: "perpus",
    href: "/perpustakaan",
    icon: LibraryBig,
    status: "planned",
  },
  {
    key: "cbe",
    title: "CBE",
    description: "Ujian, soal, peserta, jawaban, hasil, dan resource soal.",
    legacyDatabase: "jbscbe",
    targetSchema: "cbe",
    href: "/cbe",
    icon: MonitorCheck,
    status: "planned",
  },
  {
    key: "authz",
    title: "Pengguna & Akses",
    description: "Login, role, permission, session, dan audit akses.",
    legacyDatabase: "jbsuser",
    targetSchema: "authz",
    href: "/pengguna",
    icon: UsersRound,
    status: "foundation",
  },
];

export const roadmapItems = [
  {
    title: "Foundation",
    detail: "Project, UI shell, Supabase client, env, dan struktur modular.",
    done: true,
  },
  {
    title: "Schema Mapping",
    detail: "Mapping MySQL legacy ke schema Supabase PostgreSQL per domain.",
    done: false,
  },
  {
    title: "Auth Bridge",
    detail: "Login dan permission kompatibel dengan tabel hak akses lama.",
    done: false,
  },
  {
    title: "MVP Akademik",
    detail: "Master departemen, tahun ajaran, kelas, siswa, dan pegawai.",
    done: false,
  },
  {
    title: "MVP Keuangan",
    detail: "Tahun buku, rekening, penerimaan JTT, pengeluaran, dan jurnal.",
    done: false,
  },
];

export const databaseSchemas = [
  { legacy: "jbsakad", target: "akad", owner: "Akademik" },
  { legacy: "jbsfina", target: "fina", owner: "Keuangan" },
  { legacy: "jbssdm", target: "sdm", owner: "Kepegawaian" },
  { legacy: "jbsperpus", target: "perpus", owner: "Perpustakaan" },
  { legacy: "jbscbe", target: "cbe", owner: "Computer Based Exam" },
  { legacy: "jbsuser", target: "authz", owner: "Pengguna & Hak Akses" },
  { legacy: "jbsumum", target: "umum", owner: "Data Umum" },
  { legacy: "jbssms", target: "sms", owner: "Notifikasi" },
];

export const quickStats = [
  { label: "Domain prioritas", value: "5" },
  { label: "Schema target", value: "8" },
  { label: "MVP pertama", value: "Auth" },
  { label: "DB target", value: "Supabase" },
];

export const importantFlows = [
  "Semua transaksi keuangan wajib melalui server action/API route dan transaction.",
  "Frontend tidak boleh memakai service role key Supabase.",
  "CBE membutuhkan migrasi database dan storage resource soal.",
  "Peminjaman pustaka perlu draft/expiry agar tidak meninggalkan transaksi status sementara.",
];

export const defaultNavIcon = BookOpen;
