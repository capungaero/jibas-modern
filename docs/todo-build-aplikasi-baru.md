# TODO Build Aplikasi Baru JIBAS Modern

Target: membangun aplikasi baru dengan frontend/backend modern, migrasi database ke Supabase/PostgreSQL, tetapi tetap mempertahankan alur logika data JIBAS lama.

Stack rekomendasi awal:

- Frontend/backend: Next.js + TypeScript
- UI: Tailwind CSS + shadcn/ui
- Form validation: React Hook Form + Zod
- Table/grid: TanStack Table
- Database: Supabase PostgreSQL
- Auth/storage: Supabase Auth + Supabase Storage
- Proses sensitif: Next.js Server Actions/API Routes + PostgreSQL transaction/function

## 1. Foundation Project

- [x] Tentukan nama aplikasi dan repo baru. Dibuat di `C:\YIM\JIBAS\jibas-modern`.
- [x] Scaffold project Next.js + TypeScript.
- [x] Setup Tailwind CSS.
- [x] Setup shadcn/ui.
- [x] Setup ESLint.
- [x] Setup environment variables via `.env.example`:
  - [x] `NEXT_PUBLIC_SUPABASE_URL`
  - [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [x] `SUPABASE_SERVICE_ROLE_KEY`
  - [x] `DATABASE_URL`
- [x] Buat struktur folder modular:
  - [x] `src/app`
  - [x] `src/components`
  - [x] `src/features`
  - [x] `src/lib`
  - [x] `src/server`
  - [x] `src/types`
- [~] Setup Supabase client:
  - [x] browser client
  - [x] server client
  - [x] admin/service client untuk proses backend-only
- [~] Setup Supabase CLI:
  - [x] Download CLI lokal ke project baru.
  - [x] `supabase init`.
  - [ ] `supabase login` menunggu Supabase access token akun.
  - [ ] `supabase link --project-ref pwxduyrcokfbcegtlvif` menunggu access token.
- [~] Health check:
  - [x] Supabase REST/service role check memakai `https://pwxduyrcokfbcegtlvif.supabase.co/rest/v1/`.
  - [ ] Direct Postgres check masih gagal karena host direct `db.pwxduyrcokfbcegtlvif.supabase.co` tidak resolve via Node pada mesin ini; kemungkinan perlu pooler `DATABASE_URL`.
- [~] Buat layout dasar aplikasi:
  - [x] sidebar
  - [x] topbar
  - [ ] breadcrumb
  - [~] user menu/login entry
  - [ ] empty state
  - [ ] loading state
  - [ ] error state

## 2. Strategi Migrasi Database

- [ ] Export schema MySQL lama per database:
  - [ ] `jbsakad`
  - [ ] `jbsfina`
  - [ ] `jbssdm`
  - [ ] `jbsperpus`
  - [ ] `jbscbe`
  - [ ] `jbsuser`
  - [ ] `jbsumum`
  - [ ] `jbssms`
- [ ] Buat mapping schema PostgreSQL:
  - [ ] `akad`
  - [ ] `fina`
  - [ ] `sdm`
  - [ ] `perpus`
  - [ ] `cbe`
  - [ ] `authz`
  - [ ] `umum`
  - [ ] `sms`
- [ ] Mapping tipe data MySQL ke PostgreSQL:
  - [ ] `int unsigned`
  - [ ] `tinyint`
  - [ ] `datetime`
  - [ ] `blob`
  - [ ] `mediumblob`
  - [ ] `text`
  - [ ] `timestamp`
- [ ] Tentukan strategi ID:
  - [ ] tetap pakai integer legacy
  - [ ] atau tambah UUID untuk data baru
- [ ] Buat migration SQL Supabase per domain.
- [ ] Tambahkan foreign key eksplisit yang aman.
- [ ] Tambahkan index untuk query utama.
- [ ] Buat seed minimal:
  - [ ] user admin
  - [ ] departemen
  - [ ] tahun ajaran
  - [ ] tahun buku
- [ ] Buat script migrasi data dari MySQL ke PostgreSQL.
- [ ] Validasi jumlah data hasil migrasi per tabel.
- [ ] Simpan catatan mapping tabel di dokumentasi.

## 3. Auth dan Hak Akses

- [ ] Tentukan strategi auth:
  - [ ] Supabase Auth penuh
  - [ ] atau bridge dari `jbsuser.login`
- [ ] Buat tabel role/permission modern berdasarkan:
  - [ ] `jbsuser.login`
  - [ ] `jbsuser.hakakses`
  - [ ] `jbsuser.hakakseskeuangan`
  - [ ] `jbsuser.hakaksessimaka`
  - [ ] `jbsuser.landlord`
- [ ] Buat login page.
- [ ] Buat logout.
- [ ] Buat session guard.
- [ ] Buat middleware route protection.
- [ ] Buat permission helper:
  - [ ] `canAccessModule`
  - [ ] `canRead`
  - [ ] `canCreate`
  - [ ] `canUpdate`
  - [ ] `canDelete`
- [ ] Buat halaman manajemen user.
- [ ] Buat audit login terakhir.
- [ ] Pastikan role per modul:
  - [ ] Akademik
  - [ ] Keuangan
  - [ ] Kepegawaian
  - [ ] Perpustakaan
  - [ ] CBE

## 4. Shared Backend Layer

- [ ] Buat pola response standar:
  - [ ] success
  - [ ] validation error
  - [ ] forbidden
  - [ ] not found
  - [ ] server error
- [ ] Buat utility transaksi database.
- [ ] Buat validator Zod per request.
- [ ] Buat pagination helper.
- [ ] Buat search/filter helper.
- [ ] Buat audit log helper.
- [ ] Buat file upload helper ke Supabase Storage.
- [ ] Buat wrapper error untuk menjaga pesan SQL tidak bocor ke frontend.

## 5. Modul Master Data Akademik

- [ ] Departemen.
- [ ] Tahun ajaran.
- [ ] Semester.
- [ ] Tingkat.
- [ ] Kelas.
- [ ] Pelajaran.
- [ ] Guru pengampu.
- [ ] Status guru.
- [ ] Jam pelajaran.
- [ ] Validasi relasi:
  - [ ] `kelas.idtahunajaran`
  - [ ] `kelas.idtingkat`
  - [ ] `kelas.nipwali`
  - [ ] `guru.nip`
  - [ ] `guru.idpelajaran`
- [ ] UI list/filter untuk setiap master.
- [ ] Form create/edit.
- [ ] Soft delete atau active toggle.

## 6. Modul Siswa

- [ ] List siswa berdasarkan:
  - [ ] departemen
  - [ ] tahun ajaran
  - [ ] tingkat
  - [ ] kelas
  - [ ] status aktif
- [ ] Detail siswa.
- [ ] Tambah siswa.
- [ ] Edit siswa.
- [ ] Upload foto siswa ke Supabase Storage.
- [ ] Migrasi foto lama dari blob/file jika diperlukan.
- [ ] Simpan riwayat:
  - [ ] riwayat departemen siswa
  - [ ] riwayat kelas siswa
  - [ ] riwayat foto
- [ ] Validasi NIS unik.
- [ ] Nonaktifkan siswa.
- [ ] Hindari hard delete untuk data yang punya transaksi.

## 7. Modul Jadwal Akademik

- [ ] UI jadwal per kelas.
- [ ] CRUD info jadwal.
- [ ] CRUD jadwal pelajaran.
- [ ] Validasi bentrok:
  - [ ] guru sama di jam sama
  - [ ] kelas sama di jam sama
  - [ ] jam pelajaran valid
- [ ] Relasi tabel:
  - [ ] kelas
  - [ ] pelajaran
  - [ ] pegawai/guru
  - [ ] jam
  - [ ] infojadwal

## 8. Modul Penilaian Akademik

- [ ] Setup jenis ujian.
- [ ] Setup aturan grading.
- [ ] Setup aturan NHB/rapor.
- [ ] Input nilai per kelas/pelajaran.
- [ ] Simpan nilai ke tabel ekuivalen `nilaiujian`.
- [ ] Hitung nilai akhir:
  - [ ] `nau`
  - [ ] `nap`
- [ ] Validasi nilai:
  - [ ] range nilai
  - [ ] siswa aktif
  - [ ] ujian valid
- [ ] UI rekap nilai.
- [ ] Export nilai.

## 9. Modul Kepegawaian

- [ ] List pegawai.
- [ ] Detail pegawai.
- [ ] Tambah pegawai.
- [ ] Edit data pribadi.
- [ ] Upload foto pegawai.
- [ ] Riwayat pegawai:
  - [ ] golongan
  - [ ] jabatan
  - [ ] gaji
  - [ ] diklat
  - [ ] sekolah
  - [ ] sertifikasi
  - [ ] pengalaman kerja
  - [ ] keluarga
- [ ] Implement pola `terakhir=1` dan update pointer `peglastdata`.
- [ ] Nonaktifkan pegawai.
- [ ] Validasi NIP unik.

## 10. Modul Presensi Pegawai

- [ ] Input presensi harian.
- [ ] Generate daftar pegawai aktif.
- [ ] Simpan presensi reguler.
- [ ] Edit presensi per pegawai.
- [ ] Hapus presensi per tanggal dengan konfirmasi.
- [ ] Input lembur.
- [ ] Bedakan lembur dengan `source='LEMBUR'`.
- [ ] Buat constraint unik atau validasi:
  - [ ] `nip + tanggal + source`
- [ ] Rekap presensi per pegawai.
- [ ] Rekap semua pegawai.
- [ ] Export Excel/PDF.

## 11. Modul Keuangan Foundation

- [ ] Tahun buku.
- [ ] Akun rekening.
- [ ] Sumber dana.
- [ ] Jenis penerimaan.
- [ ] Jenis pengeluaran.
- [ ] Validasi akun debit/kredit.
- [ ] Buat service nomor kas dari `tahunbuku.awalan + cacah`.
- [ ] Semua proses keuangan wajib transaction.
- [ ] Buat helper jurnal:
  - [ ] create jurnal
  - [ ] create detail debit
  - [ ] create detail kredit
  - [ ] increment cacah tahun buku

## 12. Modul Penerimaan Keuangan

- [ ] Besar pembayaran siswa.
- [ ] Besar pembayaran calon siswa.
- [ ] Single payment.
- [ ] Multi payment.
- [ ] Batch payment.
- [ ] Pembayaran JTT.
- [ ] Pembayaran calon siswa.
- [ ] Update status lunas.
- [ ] Generate jurnal otomatis.
- [ ] Validasi:
  - [ ] tahun buku aktif
  - [ ] jenis penerimaan aktif
  - [ ] siswa/calon siswa valid
  - [ ] nominal tidak negatif
- [ ] Laporan penerimaan.

## 13. Modul Pengeluaran Keuangan

- [ ] Master jenis pengeluaran.
- [ ] Input pengeluaran tunggal.
- [ ] Multi pengeluaran.
- [ ] Generate jurnal otomatis.
- [ ] Validasi rekening kas dan rekening beban.
- [ ] Laporan pengeluaran.
- [ ] Export.

## 14. Modul Jurnal Umum

- [ ] Input jurnal umum.
- [ ] Validasi total debit = total kredit server-side.
- [ ] Simpan ke `jurnal`.
- [ ] Simpan detail ke `jurnaldetail`.
- [ ] Increment `tahunbuku.cacah`.
- [ ] Pencarian jurnal.
- [ ] Detail jurnal.
- [ ] Koreksi/batal jurnal dengan audit trail.

## 15. Modul Tabungan

- [ ] Tabungan siswa.
- [ ] Tabungan pegawai.
- [ ] Master jenis tabungan.
- [ ] Setoran.
- [ ] Tarikan.
- [ ] Cek saldo sebelum tarikan.
- [ ] Generate jurnal otomatis.
- [ ] Laporan transaksi.
- [ ] Laporan saldo.
- [ ] Export.

## 16. Modul Perpustakaan

- [ ] Master perpustakaan.
- [ ] Master rak.
- [ ] Master katalog.
- [ ] Master format.
- [ ] Master penulis.
- [ ] Master penerbit.
- [ ] Anggota luar sekolah.
- [ ] Tambah pustaka.
- [ ] Tambah eksemplar.
- [ ] Generate kode pustaka.
- [ ] Generate barcode.
- [ ] Upload cover ke Supabase Storage.
- [ ] Pencarian pustaka.
- [ ] Peminjaman.
- [ ] Pengembalian.
- [ ] Perpanjangan.
- [ ] Validasi status eksemplar.
- [ ] Hindari keranjang transaksi tertinggal:
  - [ ] pakai temporary table/session
  - [ ] atau simpan draft dengan expiry
- [ ] Laporan peminjaman.
- [ ] Laporan terlambat.

## 17. Modul CBE

- [ ] Putuskan strategi CBE:
  - [ ] tetap integrasi CBE Server lama
  - [ ] atau rewrite penuh
- [ ] Migrasi tabel CBE:
  - [ ] ujian
  - [ ] soal
  - [ ] soalujian
  - [ ] ujianserta
  - [ ] ujiandata
  - [ ] ujiandataesai
  - [ ] jadwalujian
- [ ] Migrasi resource soal dari `cbe/res` ke Supabase Storage.
- [ ] Buat daftar ujian.
- [ ] Mulai ujian.
- [ ] Cache/state ujian.
- [ ] Ambil soal.
- [ ] Simpan jawaban.
- [ ] Update elapsed time.
- [ ] Finish ujian.
- [ ] Hasil ujian.
- [ ] Rekap.
- [ ] Bank soal.
- [ ] Pastikan backup mencakup database dan storage.

## 18. Modul SMS / Notifikasi

- [ ] Audit tabel SMS lama.
- [ ] Tentukan provider notifikasi baru.
- [ ] Buat queue notifikasi.
- [ ] Template pesan:
  - [ ] pembayaran
  - [ ] tabungan
  - [ ] presensi
  - [ ] hasil ujian
- [ ] Log pengiriman.
- [ ] Retry gagal kirim.

## 19. Reporting dan Export

- [ ] Standard komponen filter laporan.
- [ ] Export Excel.
- [ ] Export PDF.
- [ ] Print view.
- [ ] Laporan akademik.
- [ ] Laporan keuangan.
- [ ] Laporan presensi.
- [ ] Laporan perpustakaan.
- [ ] Laporan CBE.

## 20. Security Hardening

- [ ] Terapkan Row Level Security Supabase.
- [ ] Pastikan frontend tidak memakai service role key.
- [ ] Semua proses sensitif lewat server action/API route.
- [ ] Validasi input dengan Zod.
- [ ] Escape output HTML.
- [ ] Rate limit login.
- [ ] Audit log create/update/delete.
- [ ] File upload validation:
  - [ ] MIME type
  - [ ] size limit
  - [ ] extension
- [ ] Hindari pesan error SQL muncul ke user.
- [ ] Buat backup policy.

## 21. Testing

- [ ] Unit test helper transaksi.
- [ ] Unit test auth/permission.
- [ ] Integration test:
  - [ ] tambah siswa
  - [ ] input nilai
  - [ ] input presensi
  - [ ] pembayaran JTT
  - [ ] pengeluaran
  - [ ] setoran/tarikan tabungan
  - [ ] peminjaman/pengembalian pustaka
- [ ] E2E test login dan dashboard.
- [ ] E2E test transaksi keuangan utama.
- [ ] Test migrasi data sample.
- [ ] Test rollback transaksi saat gagal.

## 22. Deployment

- [ ] Setup project Supabase dev.
- [ ] Setup project Supabase staging.
- [ ] Setup project Supabase production.
- [ ] Setup Vercel/hosting Next.js.
- [ ] Setup environment per environment.
- [ ] Setup database migration pipeline.
- [ ] Setup backup database.
- [ ] Setup backup Supabase Storage.
- [ ] Setup monitoring error.
- [ ] Setup audit release checklist.

## 23. Prioritas MVP

- [ ] Login dan hak akses.
- [ ] Dashboard utama.
- [ ] Master departemen/tahun ajaran/kelas.
- [ ] Master siswa.
- [ ] Master pegawai.
- [ ] Presensi pegawai.
- [ ] Tahun buku dan akun rekening.
- [ ] Penerimaan JTT sederhana.
- [ ] Pengeluaran sederhana.
- [ ] Jurnal umum.
- [ ] Pustaka dan peminjaman dasar.

## 24. Dokumentasi yang Harus Dijaga

- [ ] ERD per domain.
- [ ] Mapping tabel MySQL lama ke PostgreSQL baru.
- [ ] Mapping modul lama ke fitur baru.
- [ ] API contract.
- [ ] Permission matrix.
- [ ] Flow transaksi keuangan.
- [ ] Flow presensi.
- [ ] Flow peminjaman.
- [ ] Flow CBE.
- [ ] Catatan migrasi data.
- [ ] Catatan risiko dan keputusan arsitektur.

## 25. Catatan Keputusan Awal

- Database lama tidak langsung diubah saat tahap analisis.
- Migrasi ke Supabase perlu mapping schema yang rapi, bukan sekadar dump mentah.
- Modul keuangan harus menjadi prioritas audit karena berdampak ke jurnal dan saldo.
- CBE dikerjakan setelah modul core stabil karena punya dependency ke CBE Server dan resource file.
- Untuk menjaga simple, gunakan Next.js fullstack dulu. Backend terpisah seperti NestJS bisa ditambahkan jika domain logic sudah terlalu besar.
