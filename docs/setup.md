# Setup JIBAS Modern

Project ini adalah baseline aplikasi baru untuk modernisasi JIBAS.

## Stack

- Next.js + TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase PostgreSQL/Auth/Storage
- Zod untuk validasi
- TanStack Table untuk grid data

## Menjalankan Lokal

```bash
npm install
npm run dev
```

Salin `.env.example` menjadi `.env.local`, lalu isi kredensial Supabase.

## Prinsip Arsitektur

- Frontend tidak boleh memakai service role key.
- Proses sensitif seperti pembayaran, jurnal, tabungan, presensi, dan peminjaman lewat server action atau route handler.
- Migrasi database dilakukan per schema domain, bukan dump mentah tanpa mapping.
- Storage Supabase dipakai untuk file/foto/resource yang sebelumnya tersimpan sebagai blob atau filesystem.

## Mapping Awal Schema

| Legacy MySQL | Supabase PostgreSQL | Domain |
| --- | --- | --- |
| `jbsakad` | `akad` | Akademik |
| `jbsfina` | `fina` | Keuangan |
| `jbssdm` | `sdm` | Kepegawaian |
| `jbsperpus` | `perpus` | Perpustakaan |
| `jbscbe` | `cbe` | Computer Based Exam |
| `jbsuser` | `authz` | Pengguna dan hak akses |
| `jbsumum` | `umum` | Data umum |
| `jbssms` | `sms` | Notifikasi |
