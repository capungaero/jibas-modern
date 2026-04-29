import type { AppModuleKey } from "@/config/modules";
import type { CrudResource } from "@/features/modules/module-workspace";

export const moduleResources: Record<AppModuleKey, CrudResource[]> = {
  akademik: [
    {
      key: "departemen",
      title: "Departemen",
      description: "Master departemen untuk filter akademik dan keuangan.",
      fields: [
        { name: "kode", label: "Kode", required: true },
        { name: "nama", label: "Nama departemen", required: true },
        { name: "status", label: "Status", type: "select", options: ["Aktif", "Nonaktif"], required: true },
      ],
      seed: [{ kode: "SMA", nama: "Sekolah Menengah Atas", status: "Aktif" }],
    },
    {
      key: "kelas",
      title: "Kelas",
      description: "Master kelas dengan tingkat, tahun ajaran, wali, dan kapasitas.",
      fields: [
        { name: "nama", label: "Nama kelas", required: true },
        { name: "tingkat", label: "Tingkat", required: true },
        { name: "tahunAjaran", label: "Tahun ajaran", required: true },
        { name: "wali", label: "Wali kelas", required: true },
        { name: "kapasitas", label: "Kapasitas", type: "number", required: true },
      ],
      seed: [{ nama: "10-A", tingkat: "10", tahunAjaran: "2026/2027", wali: "Ibu Sari", kapasitas: "32" }],
    },
    {
      key: "siswa",
      title: "Siswa",
      description: "Data siswa MVP dengan NIS unik, kelas, kontak, dan status.",
      fields: [
        { name: "nis", label: "NIS", required: true },
        { name: "nama", label: "Nama siswa", required: true },
        { name: "kelas", label: "Kelas", required: true },
        { name: "kelamin", label: "Kelamin", type: "select", options: ["L", "P"], required: true },
        { name: "hp", label: "No HP" },
        { name: "status", label: "Status", type: "select", options: ["Aktif", "Nonaktif"], required: true },
      ],
      seed: [{ nis: "260001", nama: "Ahmad Fauzi", kelas: "10-A", kelamin: "L", hp: "081234567890", status: "Aktif" }],
    },
  ],
  keuangan: [
    {
      key: "tahun-buku",
      title: "Tahun Buku",
      description: "Periode akuntansi aktif untuk nomor kas dan transaksi.",
      fields: [
        { name: "tahun", label: "Tahun", required: true },
        { name: "awalan", label: "Awalan kas", required: true },
        { name: "cacah", label: "Counter", type: "number", required: true },
        { name: "status", label: "Status", type: "select", options: ["Aktif", "Tutup"], required: true },
      ],
      seed: [{ tahun: "2026", awalan: "KB26", cacah: "1", status: "Aktif" }],
    },
    {
      key: "rekening",
      title: "Akun Rekening",
      description: "Master rekening kas, pendapatan, piutang, beban, dan utang.",
      fields: [
        { name: "kode", label: "Kode akun", required: true },
        { name: "nama", label: "Nama akun", required: true },
        { name: "kategori", label: "Kategori", type: "select", options: ["Kas", "Piutang", "Pendapatan", "Beban", "Utang"], required: true },
      ],
      seed: [{ kode: "1-100", nama: "Kas Sekolah", kategori: "Kas" }],
    },
    {
      key: "jurnal",
      title: "Jurnal Umum",
      description: "Input jurnal sederhana dengan nominal debit dan kredit seimbang.",
      fields: [
        { name: "tanggal", label: "Tanggal", type: "date", required: true },
        { name: "keterangan", label: "Keterangan", required: true },
        { name: "debit", label: "Total debit", type: "number", required: true },
        { name: "kredit", label: "Total kredit", type: "number", required: true },
      ],
      seed: [{ tanggal: "2026-04-29", keterangan: "Saldo awal", debit: "1000000", kredit: "1000000" }],
    },
  ],
  kepegawaian: [
    {
      key: "pegawai",
      title: "Pegawai",
      description: "Master pegawai dengan NIP, bagian, kontak, dan status aktif.",
      fields: [
        { name: "nip", label: "NIP", required: true },
        { name: "nama", label: "Nama pegawai", required: true },
        { name: "bagian", label: "Bagian", required: true },
        { name: "email", label: "Email", type: "email" },
        { name: "status", label: "Status", type: "select", options: ["Aktif", "Nonaktif"], required: true },
      ],
      seed: [{ nip: "101", nama: "Budi Santoso", bagian: "Akademik", email: "budi@sekolah.id", status: "Aktif" }],
    },
    {
      key: "presensi",
      title: "Presensi Harian",
      description: "Input presensi pegawai reguler per tanggal.",
      fields: [
        { name: "tanggal", label: "Tanggal", type: "date", required: true },
        { name: "nip", label: "NIP", required: true },
        { name: "status", label: "Status", type: "select", options: ["Hadir", "Izin", "Sakit", "Cuti", "Alpa", "Bebas"], required: true },
        { name: "jamMasuk", label: "Jam masuk" },
        { name: "jamPulang", label: "Jam pulang" },
      ],
      seed: [{ tanggal: "2026-04-29", nip: "101", status: "Hadir", jamMasuk: "07:00", jamPulang: "15:00" }],
    },
  ],
  perpustakaan: [
    {
      key: "pustaka",
      title: "Pustaka",
      description: "Bibliografi buku dan alokasi eksemplar awal.",
      fields: [
        { name: "judul", label: "Judul", required: true },
        { name: "penulis", label: "Penulis", required: true },
        { name: "penerbit", label: "Penerbit", required: true },
        { name: "tahun", label: "Tahun", type: "number", required: true },
        { name: "eksemplar", label: "Eksemplar", type: "number", required: true },
      ],
      seed: [{ judul: "Matematika Dasar", penulis: "Tim Guru", penerbit: "JIBAS", tahun: "2026", eksemplar: "5" }],
    },
    {
      key: "peminjaman",
      title: "Peminjaman",
      description: "Transaksi peminjaman dasar dengan status draft atau aktif.",
      fields: [
        { name: "kode", label: "Kode pustaka", required: true },
        { name: "anggota", label: "Anggota", required: true },
        { name: "tanggalPinjam", label: "Tanggal pinjam", type: "date", required: true },
        { name: "status", label: "Status", type: "select", options: ["Draft", "Dipinjam", "Kembali"], required: true },
      ],
      seed: [{ kode: "MTK-001", anggota: "260001", tanggalPinjam: "2026-04-29", status: "Dipinjam" }],
    },
  ],
  cbe: [
    {
      key: "ujian",
      title: "Ujian",
      description: "Daftar ujian dan jadwal awal CBE.",
      fields: [
        { name: "kode", label: "Kode ujian", required: true },
        { name: "nama", label: "Nama ujian", required: true },
        { name: "tanggal", label: "Tanggal", type: "date", required: true },
        { name: "status", label: "Status", type: "select", options: ["Draft", "Aktif", "Selesai"], required: true },
      ],
      seed: [{ kode: "CB-001", nama: "Tryout Matematika", tanggal: "2026-04-29", status: "Draft" }],
    },
    {
      key: "soal",
      title: "Bank Soal",
      description: "Metadata soal untuk persiapan migrasi CBE.",
      fields: [
        { name: "kode", label: "Kode soal", required: true },
        { name: "pelajaran", label: "Pelajaran", required: true },
        { name: "tipe", label: "Tipe", type: "select", options: ["Pilihan Ganda", "Esai"], required: true },
        { name: "status", label: "Status", type: "select", options: ["Aktif", "Arsip"], required: true },
      ],
      seed: [{ kode: "S-001", pelajaran: "Matematika", tipe: "Pilihan Ganda", status: "Aktif" }],
    },
  ],
  authz: [
    {
      key: "user",
      title: "User",
      description: "User aplikasi dan pemetaan awal ke role.",
      fields: [
        { name: "username", label: "Username", required: true },
        { name: "nama", label: "Nama", required: true },
        { name: "email", label: "Email", type: "email" },
        { name: "role", label: "Role", type: "select", options: ["Admin", "Akademik", "Keuangan", "Perpustakaan", "CBE"], required: true },
      ],
      seed: [{ username: "admin", nama: "Administrator", email: "admin@sekolah.id", role: "Admin" }],
    },
    {
      key: "permission",
      title: "Permission",
      description: "Matriks hak akses dasar per modul.",
      fields: [
        { name: "role", label: "Role", required: true },
        { name: "modul", label: "Modul", required: true },
        { name: "akses", label: "Akses", type: "select", options: ["Read", "Create", "Update", "Delete", "Full"], required: true },
      ],
      seed: [{ role: "Admin", modul: "Semua Modul", akses: "Full" }],
    },
  ],
};
