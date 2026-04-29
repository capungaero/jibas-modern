# Catatan Reverse Engineering JIBAS

Tanggal catatan: 2026-04-29

## Aturan Penelusuran

- Fokus pada folder aplikasi seperti `akademik`, `keuangan`, `kepegawaian`, `simtaka`, `cbe`, dan modul utama lain.
- Tidak membaca folder dependency/library besar seperti `node_modules`, `vendor`, `venv`, atau folder library internal secara mendalam.
- Setiap alur kode dikaitkan dengan tabel database yang relevan.
- Jika observasi isi database diperlukan, gunakan query dengan `LIMIT 5`. Penelusuran sejauh ini lebih banyak memakai metadata/schema.

## Konfigurasi Database

File konfigurasi utama yang ditemukan:

- `include/database.config.php`

Koneksi lokal:

- Host: `localhost`
- Port: `3434`
- User: `root`
- Password: tersimpan di file konfigurasi lokal, tidak dicatat di Git.

Database utama per modul:

- `jbsakad`: Akademik
- `jbsfina`: Keuangan
- `jbssdm`: Kepegawaian/SDM
- `jbsperpus`: Simtaka/Perpustakaan
- `jbscbe`: Computer Based Exam
- `jbsuser`: Login dan hak akses
- `jbsumum`: Identitas/departemen dan data umum
- `jbssms`: SMS gateway

Helper database umum:

- `include/db_functions.php`
- Pola umum: `OpenDb`, `QueryDb`, `QueryDbTrans`, `BeginTrans`, `CommitTrans`, `RollbackTrans`.

Catatan risiko global:

- Banyak SQL dibangun dengan interpolasi string langsung dari `$_REQUEST`/`$_POST`.
- Sanitasi sering berupa `str_replace("'", "`", ...)`, belum setara prepared statement.
- Kredensial database tersimpan plain text.
- Banyak file memakai short PHP tag `<?`.
- Error handler/DB helper di beberapa titik berpotensi menampilkan query/pesan SQL.

## Struktur Modul Utama

Entry portal utama:

- `index.php`

Menu portal mengarah ke:

- `akademik/index.php`
- `keuangan/rinjani/index.php`
- `kepegawaian/index.php`
- `infoguru/index.php`
- `simtaka/index.php`
- `anjungan/index.php`
- `schooltube/index.php`
- `smsgateway/index.php`
- `cbe/login.php`

## Modul Akademik

Entry/login:

- `akademik/index.php`
- `akademik/login.php`
- `akademik/redirect.php`
- `akademik/index2.php`

Session:

- `jbsakad`
- Session penting: `login`, `namasimaka`, `tingkatsimaka`, `departemensimaka`, `temasimaka`.

Alur login:

1. User login dari `akademik/login.php`.
2. Form dikirim ke `akademik/redirect.php`.
3. Sistem cek user khusus `jibas` ke `jbsuser.landlord`.
4. User biasa dicek ke `jbsuser.login`, `jbssdm.pegawai`, dan `jbsuser.hakakses`.
5. Hak akses wajib `modul='SIMAKA'`.

Tabel terkait:

- `jbsuser.landlord`
- `jbsuser.login`
- `jbsuser.hakakses`
- `jbssdm.pegawai`

Menu utama:

- Referensi
- PSB
- Guru & Pelajaran
- Jadwal
- Kesiswaan
- Presensi
- Penilaian
- Kelulusan
- Mutasi
- Pelaporan
- Pengaturan

### Akademik: Siswa

File penting:

- `akademik/siswa/siswa_content.php`
- `akademik/siswa/siswa_add_simpan.php`

Alur daftar siswa:

- Membaca `jbsakad.siswa`.
- Join ke `jbsakad.kelas`.
- Join ke `jbsakad.tahunajaran`.
- Filter berdasarkan kelas/tingkat/tahun ajaran.

Alur tambah siswa:

1. Insert ke `jbsakad.siswa`.
2. Insert riwayat departemen ke `jbsakad.riwayatdeptsiswa`.
3. Insert riwayat kelas ke `jbsakad.riwayatkelassiswa`.
4. Foto disimpan sebagai blob/riwayat foto.

Alur hapus siswa:

- Menghapus/menautkan ulang data terkait:
  - `jbsakad.tambahandatasiswa`
  - `jbsakad.riwayatfoto`
  - `jbsakad.siswa`
  - `jbsakad.calonsiswa.replidsiswa`

Relasi:

- `siswa.idkelas -> kelas.replid`
- `kelas.idtahunajaran -> tahunajaran.replid`
- `kelas.idtingkat -> tingkat.replid`

### Akademik: Kelas

File penting:

- `akademik/referensi/topkelas.php`
- `akademik/referensi/bottomkelas.php`
- `akademik/referensi/kelas_add.php`

Tabel:

- `jbsakad.kelas`
- `jbsakad.tahunajaran`
- `jbsakad.tingkat`
- `jbssdm.pegawai`

Relasi:

- `kelas.idtahunajaran -> tahunajaran.replid`
- `kelas.idtingkat -> tingkat.replid`
- `kelas.nipwali -> jbssdm.pegawai.nip`

Catatan risiko:

- Di `bottomkelas.php`, delete kelas terlihat memanggil `QueryDb($sql)` dua kali untuk SQL yang sama. Ini berpotensi menyebabkan error atau minimal operasi redundant.

### Akademik: Guru & Pelajaran

File penting:

- `akademik/guru/guru_content.php`
- `akademik/guru/guru_add.php`

Tabel:

- `jbsakad.guru`
- `jbsakad.pelajaran`
- `jbsakad.statusguru`
- `jbssdm.pegawai`
- `jbsakad.jenisujian`
- `jbsakad.aturangrading`
- `jbsakad.aturannhb`

Relasi:

- `guru.nip -> jbssdm.pegawai.nip`
- `guru.idpelajaran -> pelajaran.replid`

### Akademik: Jadwal

File penting:

- `akademik/jadwal/jadwal_kelas_header.php`
- `akademik/jadwal/jadwal_kelas_footer.php`

Tabel:

- `jbsakad.jadwal`
- `jbsakad.infojadwal`
- `jbsakad.jam`
- `jbsakad.kelas`
- `jbsakad.pelajaran`
- `jbssdm.pegawai`

Relasi:

- `jadwal.idkelas -> kelas.replid`
- `jadwal.idpelajaran -> pelajaran.replid`
- `jadwal.nipguru -> jbssdm.pegawai.nip`
- `jadwal.idinfo -> infojadwal.replid`

### Akademik: Penilaian

File penting:

- `akademik/penilaian/formpenilaian.php`
- `akademik/penilaian/nilai_pelajaran_simpan.php`

Tabel:

- `jbsakad.ujian`
- `jbsakad.nilaiujian`
- `jbsakad.nau`
- `jbsakad.nap`
- `jbsakad.siswa`
- `jbsakad.kelas`
- `jbsakad.semester`
- `jbsakad.pelajaran`
- `jbsakad.aturannhb`

Alur:

1. Form memilih departemen, tingkat, tahun ajaran, kelas, semester, pelajaran, guru.
2. Nilai per siswa disimpan ke `nilaiujian`.
3. Nilai akhir/report memakai `nau` dan `nap`.

Relasi:

- `nilaiujian.idujian -> ujian.replid`
- `nilaiujian.nis -> siswa.nis`

## Modul Keuangan Rinjani

Entry/login:

- `keuangan/rinjani/index.php`
- `keuangan/rinjani/login.php`
- `keuangan/rinjani/login.ajax.php`
- `keuangan/rinjani/login.func.php`
- `keuangan/rinjani/main.php`

Session:

- `jbskeu`
- Session penting: `login`, `namakeuangan`, `tingkatkeuangan`, `departemenkeuangan`, `temakeuangan`.

Alur login:

1. Login AJAX dari `login.js` ke `login.ajax.php`.
2. `login.func.php` cek `jbsuser.landlord` untuk user `jibas`.
3. User biasa dicek ke `jbsuser.login`, `jbssdm.pegawai`, `jbsuser.hakakses`.
4. Hak akses wajib `modul='KEUANGAN'`.

Menu utama:

- Referensi
- Penerimaan
- Pengeluaran
- Jurnal
- Tabungan siswa
- Tabungan pegawai
- SchoolPay
- Laporan
- Inventori
- Pengaturan

### Keuangan: Penerimaan

File penting:

- `keuangan/rinjani/penerimaan/penerimaan.php`
- `keuangan/rinjani/penerimaan/jenispenerimaan2.func.php`
- `keuangan/rinjani/penerimaan/inputbayar2.func.php`
- `keuangan/rinjani/penerimaan/pembayaran.decide.php`
- `keuangan/rinjani/penerimaan/pembayaran.jtt.bayar.func.php`

Tabel:

- `jbsfina.datapenerimaan`
- `jbsfina.besarjtt`
- `jbsfina.penerimaanjtt`
- `jbsfina.besarjttcalon`
- `jbsfina.penerimaanjttcalon`
- `jbsfina.jurnal`
- `jbsfina.jurnaldetail`
- `jbsfina.tahunbuku`
- `jbsfina.rekakun`
- `jbsakad.siswa`
- `jbsakad.calonsiswa`

Alur besar pembayaran siswa:

1. Baca tahun buku aktif di `tahunbuku`.
2. Baca jenis penerimaan aktif di `datapenerimaan`.
3. Ambil siswa dari `jbsakad.siswa` berdasarkan kelas.
4. Cek duplikasi di `besarjtt`.
5. Buat jurnal dan detail jurnal.
6. Insert tagihan ke `besarjtt`.
7. Jika pembayaran awal langsung ada, insert ke `penerimaanjtt`.
8. Increment `tahunbuku.cacah`.

Alur pembayaran JTT:

1. Baca `datapenerimaan`, `besarjtt`, `penerimaanjtt`, `tahunbuku`.
2. Buat `jurnal`.
3. Buat `jurnaldetail`.
4. Insert/update `penerimaanjtt`.
5. Update `besarjtt.lunas` jika lunas.
6. Opsional kirim SMS.

### Keuangan: Pengeluaran

File penting:

- `keuangan/rinjani/pengeluaran/pengeluaran.php`
- `keuangan/rinjani/pengeluaran/jenispengeluaran2.func.php`
- `keuangan/rinjani/pengeluaran/multi.pengeluaran.content.save.func.php`

Tabel:

- `jbsfina.datapengeluaran`
- `jbsfina.pengeluaran`
- `jbsfina.jurnal`
- `jbsfina.jurnaldetail`
- `jbsfina.tahunbuku`
- `jbsfina.rekakun`

Alur pengeluaran:

1. Ambil nomor kas dari `tahunbuku.awalan + cacah`.
2. Insert `jurnal` dengan sumber `pengeluaran`.
3. Insert `jurnaldetail`: debit akun beban, kredit akun kas.
4. Increment `tahunbuku.cacah`.
5. Insert transaksi ke `pengeluaran`.

### Keuangan: Jurnal Umum

File penting:

- `keuangan/rinjani/jurnal/jurnalumum.php`
- `keuangan/rinjani/jurnal/inputjurnal2.func.php`

Tabel:

- `jbsfina.jurnal`
- `jbsfina.jurnaldetail`
- `jbsfina.tahunbuku`

Alur:

1. Pilih tahun buku aktif.
2. Buat `jurnal` dengan sumber `jurnalumum`.
3. Loop baris input dan insert ke `jurnaldetail`.
4. Increment `tahunbuku.cacah`.

Catatan risiko:

- Validasi total debit = kredit perlu dipastikan ada server-side, bukan hanya di JavaScript.

### Keuangan: Tabungan

File penting:

- `keuangan/rinjani/tabungan/transaksi.tabungan.func.php`
- `keuangan/rinjani/tabunganp/transaksi.tabungan.func.php`

Tabel tabungan siswa:

- `jbsfina.datatabungan`
- `jbsfina.tabungan`
- `jbsakad.siswa`

Tabel tabungan pegawai:

- `jbsfina.datatabunganp`
- `jbsfina.tabunganp`
- `jbssdm.pegawai`

Tabel jurnal:

- `jbsfina.jurnal`
- `jbsfina.jurnaldetail`
- `jbsfina.tahunbuku`
- `jbsfina.rekakun`

Alur setoran:

1. Baca konfigurasi tabungan (`datatabungan` atau `datatabunganp`).
2. Baca tahun buku untuk nomor kas.
3. Hitung saldo dari transaksi sebelumnya.
4. Insert `jurnal`.
5. Insert transaksi `tabungan`/`tabunganp`.
6. Insert detail jurnal: debit kas, kredit utang tabungan.
7. Increment `tahunbuku.cacah`.

Alur tarikan:

1. Cek saldo cukup.
2. Insert transaksi tarikan.
3. Insert detail jurnal: debit utang tabungan, kredit kas.
4. Increment `tahunbuku.cacah`.

Catatan risiko:

- Ditemukan beberapa file laporan di folder `tabungan` siswa yang mengarah ke `tabunganp`/pegawai. Perlu verifikasi apakah memang reuse file atau salah lokasi.

## Modul Kepegawaian

Entry/login:

- `kepegawaian/index.php`
- `kepegawaian/login.php`
- `kepegawaian/redirect.php`
- `kepegawaian/index2.php`

Session:

- `_JIBAS_KEPEGAWAIAN__`
- Session penting: `login`, `namasimpeg`, `tingkatsimpeg`, `departemensimpeg`, `temasimpeg`.

Alur login:

1. User login dari `kepegawaian/login.php`.
2. Form dikirim ke `kepegawaian/redirect.php`.
3. User `jibas` dicek ke `jbsuser.landlord`.
4. User biasa dicek ke `jbsuser.login`, `jbssdm.pegawai`, dan `jbsuser.hakakses`.
5. Hak akses wajib `modul='SIMPEG'`.

Menu utama:

- Referensi
- Kepegawaian
- Presensi
- Pengaturan

### Kepegawaian: Master Pegawai

File penting:

- `kepegawaian/pegawai/pegawai.php`
- `kepegawaian/pegawai/pegawaiinput.class.php`
- `kepegawaian/pegawai/daftarpribadi.class.php`

Tabel:

- `jbssdm.pegawai`
- `jbssdm.peglastdata`
- `jbssdm.tambahandatapegawai`
- `jbsakad.riwayatfoto`
- `jbssdm.peggol`
- `jbssdm.pegjab`
- `jbssdm.peggaji`
- `jbssdm.pegdiklat`
- `jbssdm.pegkeluarga`
- `jbssdm.pegkerja`
- `jbssdm.pegsekolah`
- `jbssdm.pegserti`

Alur tambah pegawai:

1. Cek duplikasi `nip` di `jbssdm.pegawai`.
2. Insert data inti ke `jbssdm.pegawai`.
3. Insert pointer data terakhir ke `jbssdm.peglastdata`.
4. Jika ada foto, insert ke `jbsakad.riwayatfoto` dengan `nip`.
5. Insert field tambahan ke `jbssdm.tambahandatapegawai`.
6. Menggunakan transaksi.

Pola riwayat:

- Record lama ditandai `terakhir=0`.
- Record baru ditandai `terakhir=1`.
- `peglastdata` menunjuk ID record terakhir untuk golongan, jabatan, diklat, sekolah, gaji, sertifikasi, kerja.

### Kepegawaian: Presensi

File penting:

- `kepegawaian/presensi/inputpresensi.content.php`
- `kepegawaian/presensi/inputpresensi.content.save.new.php`
- `kepegawaian/presensi/inputpresensi.content.save.edit.php`
- `kepegawaian/presensi/inputpresensi.remove.php`
- `kepegawaian/presensi/lembur.input.save.php`
- `kepegawaian/presensi/lembur.content.php`
- `kepegawaian/presensi/rekappresensi.stat.php`

Tabel:

- `jbssdm.pegawai`
- `jbssdm.presensi`

Schema penting `presensi`:

- `replid`
- `nip`
- `tanggal`
- `jammasuk`
- `jampulang`
- `jamwaktukerja`
- `menitwaktukerja`
- `status`
- `keterangan`
- `source`

Alur input presensi:

1. `inputpresensi.content.php` mengambil semua `jbssdm.pegawai` dengan `aktif=1`.
2. Left join ke `jbssdm.presensi` berdasarkan `nip` dan `tanggal`.
3. Jika belum ada data pada tanggal itu, tombol simpan membuat satu row presensi per pegawai.
4. Jika sudah ada, tiap baris bisa di-update.

Status:

- `1`: Hadir
- `2`: Izin
- `3`: Sakit
- `4`: Cuti
- `5`: Alpa
- `6`: Bebas

Alur lembur:

1. Input lembur juga insert ke `jbssdm.presensi`.
2. Pembeda lembur adalah `source='LEMBUR'`.
3. Laporan lembur membaca `presensi` dengan filter `source='LEMBUR'`.

Catatan risiko:

- `presensi` hanya punya index `nip, tanggal, status`, bukan unique key. Pegawai yang sama bisa memiliki presensi dobel untuk tanggal sama bila flow paralel/gagal.
- Presensi reguler dan lembur bercampur dalam satu tabel. Laporan reguler harus konsisten filter `source` agar lembur tidak ikut.
- SQL masih banyak memakai request mentah.

## Modul Simtaka / Perpustakaan

Entry/login:

- `simtaka/index.php`
- `simtaka/login.php`
- `simtaka/redirect.php`

Session:

- `jbsperpus`
- Session penting: `login`, `tingkat`, `perpustakaan`, `idperpustakaan`, `nama`.

Alur login:

1. User login dari `simtaka/login.php`.
2. Form dikirim ke `simtaka/redirect.php`.
3. User `jibas` dicek ke `jbsuser.landlord`.
4. User biasa dicek ke `jbsuser.login`, `jbssdm.pegawai`, dan `jbsuser.hakakses`.
5. Hak akses wajib `modul='SIMTAKA'`.
6. `hakakses.info1` dipakai sebagai `idperpustakaan`.

Tabel utama:

- `jbsperpus.perpustakaan`
- `jbsperpus.pustaka`
- `jbsperpus.daftarpustaka`
- `jbsperpus.pinjam`
- `jbsperpus.anggota`
- `jbsperpus.penulis`
- `jbsperpus.penerbit`
- `jbsperpus.format`
- `jbsperpus.katalog`
- `jbsperpus.rak`
- `jbsperpus.aktivitas`
- `jbsakad.siswa`
- `jbssdm.pegawai`

### Simtaka: Pustaka

File penting:

- `simtaka/pus/pustaka.baru.class.php`
- `simtaka/pus/pustaka.adddel.tambahpustaka.func.php`
- `simtaka/pus/pustaka.daftar.class.php`
- `simtaka/pus/pustaka.cari.class.php`

Alur tambah buku baru:

1. Input metadata buku.
2. Cek apakah kombinasi judul, penulis, format, katalog, penerbit sudah ada di `pustaka`.
3. Jika belum ada, insert ke `pustaka`.
4. Untuk setiap jumlah eksemplar per perpustakaan, insert ke `daftarpustaka`.
5. Kode pustaka dibuat dari kode katalog, kode penulis, huruf awal judul, counter, dan kode format.
6. Barcode acak disimpan di `daftarpustaka.info1`.
7. Counter disimpan ke `katalog.counter`.

Relasi:

- `daftarpustaka.pustaka -> pustaka.replid`
- `daftarpustaka.perpustakaan -> perpustakaan.replid`
- `pustaka.penulis -> penulis.replid`
- `pustaka.penerbit -> penerbit.replid`
- `pustaka.format -> format.replid`
- `pustaka.katalog -> katalog.replid`

### Simtaka: Peminjaman

File penting:

- `simtaka/pjm/pinjam.class.php`
- `simtaka/pjm/pinjam.panjang.func.php`
- `simtaka/pjm/daftar.pinjam.class.php`
- `simtaka/pjm/daftar.pinjam.telat.class.php`

Tabel:

- `jbsperpus.pinjam`
- `jbsperpus.daftarpustaka`
- `jbsperpus.pustaka`
- `jbsperpus.anggota`
- `jbsakad.siswa`
- `jbssdm.pegawai`

Alur peminjaman:

1. User memilih jenis anggota:
   - pegawai
   - siswa
   - anggota luar sekolah
2. Input/scan `kodepustaka`.
3. Sistem cek `daftarpustaka` dan status eksemplar.
4. Saat masuk keranjang, insert ke `pinjam` dengan `status=0`.
5. Saat final save, update `pinjam.status=1`.
6. Update `daftarpustaka.status=0` untuk menandai eksemplar sedang dipinjam.

Alur perpanjangan:

- `pinjam.panjang.func.php` update `pinjam.tglkembali` dan `keterangan` untuk `kodepustaka` dengan `status=1`.

Anggota:

- Siswa memakai `jbsakad.siswa.nis`.
- Pegawai memakai `jbssdm.pegawai.nip`.
- Anggota luar memakai `jbsperpus.anggota.noregistrasi`.

Catatan risiko:

- Keranjang pinjam memakai tabel transaksi asli `pinjam` dengan `status=0`. Jika proses batal/tutup browser, data sementara bisa tertinggal.
- Save peminjaman update `pinjam.status` dan `daftarpustaka.status` tanpa transaksi yang terlihat jelas.
- Banyak request mentah di SQL, termasuk `idstr`, `kodepustaka`, dan nomor anggota.

## Modul CBE

Entry/login:

- `cbe/index.php`
- `cbe/login.php`
- `cbe/login.ajax.php`
- `cbe/login.func.php`
- `cbe/main.php`

Session:

- `_JIBAS_CBE__`
- Session penting:
  - `UserId`
  - `UserName`
  - `UserDept`
  - `UserType`
  - `SessionId`
  - `Json`
  - `IsLogin`
  - `IdUjian`
  - `IdUjianSerta`
  - `IdJadwalUjian`
  - `UjianStarted`

Arsitektur:

- CBE Web PHP adalah client.
- Banyak operasi inti dikirim ke CBE Server via HTTP.
- Database `jbscbe` menyimpan master, hasil, cache state, dan cache resource soal.

### CBE: Login

File penting:

- `cbe/login.func.php`

Alur:

1. Test koneksi ke CBE Server.
2. Test koneksi database.
3. Kirim login/password ke CBE Server.
4. Jika sukses, isi session.
5. Ambil nama identitas dari `jbsumum.identitas`.
6. Hapus intent lama user di `jbscbe.webuserintent`.
7. Simpan info user ke `jbscbe.webuserinfo`.
8. Cek apakah user ada di `jbscbe.timadmin`.

Tabel:

- `jbscbe.webuserinfo`
- `jbscbe.webuserintent`
- `jbscbe.timadmin`
- `jbsumum.identitas`

### CBE: Jadwal dan Daftar Ujian

File penting:

- `cbe/jadwal.func.php`
- `cbe/ujiankhusus.func.php`
- `cbe/ujianumum.func.php`
- `cbe/ujianremed.func.php`
- `cbe/ujianumumsiswa.func.php`

Tabel domain:

- `jbscbe.pengujian`
- `jbscbe.pengujiankelas`
- `jbscbe.pengujiankelompok`
- `jbscbe.ujian`
- `jbscbe.jadwalujian`
- `jbscbe.ujianserta`

Alur daftar:

1. Web meminta pilihan/daftar ujian ke CBE Server.
2. Response JSON dirender menjadi tabel.
3. Tag tersembunyi menyimpan `IdUjian`, `IdUjianSerta`, `IdRemedUjian`, `IdJadwalUjian`, status, jumlah soal.

Alur mulai ujian:

1. Web kirim `StartUjianData` ke CBE Server.
2. Response berisi data ujian.
3. Session ujian diisi.
4. Data intent disimpan ke `jbscbe.webuserintent` dengan `type='ujian'`.

### CBE: Pengerjaan Ujian

File penting:

- `cbe/ujian.php`
- `cbe/ujian.ajax.php`
- `cbe/ujian.func.php`

Tabel:

- `jbscbe.webuserintent`
- `jbscbe.webusersoal`
- `jbscbe.ujiandata`
- `jbscbe.ujiandataesai`
- `jbscbe.ujianserta`

Alur:

1. `getujiandata`: baca JSON ujian dari `webuserintent`.
2. `getsoal`: cek cache `webusersoal`.
3. Jika soal belum ada, request soal ke CBE Server.
4. Metadata soal disimpan ke `webusersoal`.
5. Gambar soal, thumbnail, dan pembahasan disimpan ke folder `cbe/res/YYYYMM/`.
6. `simpanjawaban`: jawaban dikirim ke CBE Server.
7. `updateelapsed`: elapsed time dikirim ke CBE Server.
8. `finishujian`: submit akhir ke CBE Server lalu hapus `webuserintent type='ujian'`.

Resource soal:

- `cbe/res/YYYYMM/{id}-qs.jpg`: gambar soal
- `cbe/res/YYYYMM/{id}-qsth.jpg`: thumbnail
- `cbe/res/YYYYMM/{id}-exp.jpg`: penjelasan

### CBE: Hasil dan Rekap

File penting:

- `cbe/hasilujian.func.php`
- `cbe/rekap.func.php`
- `cbe/banksoal.func.php`
- `cbe/carisoal.func.php`

Tabel:

- `jbscbe.ujiandata`
- `jbscbe.ujiandataesai`
- `jbscbe.webusersoal`
- `jbscbe.ujianserta`

Alur hasil:

1. Ambil data soal dari `webusersoal`.
2. Ambil jawaban objektif dari `ujiandata`.
3. Ambil jawaban esai/gambar dari `ujiandataesai`.
4. Tampilkan gambar soal dan penjelasan dari `cbe/res`.

Rekap:

- `rekap.func.php` meminta data rekap ke CBE Server, lalu render hasil response.

Catatan risiko:

- Web CBE bergantung ke CBE Server. Jika server mati, login dan ujian tidak berjalan meski DB lokal hidup.
- State ujian disimpan dalam JSON di `webuserintent` dengan sanitasi string sederhana.
- `webusersoal` menyimpan metadata di DB, tetapi gambar ada di filesystem. Backup harus membawa DB dan folder `cbe/res` bersama-sama.
- Jika permission folder `cbe/res` bermasalah, soal bisa gagal tampil.

## Temuan Risiko Lintas Modul

1. SQL injection risk tinggi karena query banyak dibangun dari request langsung.
2. Data integrity risk pada proses multi-step yang tidak selalu terlihat memakai transaksi.
3. Session dan permission tersebar per modul, perlu audit konsistensi modul/hak akses.
4. Banyak penggunaan short PHP tag dan pola PHP lama.
5. File upload/blob/gambar memakai pendekatan lama, perlu audit validasi MIME/size.
6. Beberapa proses menulis cache/state ke tabel operasional langsung, misalnya `pinjam.status=0` sebagai keranjang dan `webuserintent` sebagai state ujian.
7. Backup/restore tidak cukup database saja untuk CBE karena ada resource soal di filesystem.

## Rekomendasi Lanjutan

1. Lanjut bedah modul `infoguru`, `anjungan`, `schooltube`, dan `smsgateway`.
2. Buat ERD ringkas per domain:
   - Akademik
   - Keuangan
   - Kepegawaian
   - Perpustakaan
   - CBE
3. Audit query raw paling berisiko pada endpoint simpan/hapus.
4. Tandai flow yang butuh transaksi tapi belum jelas transaksinya.
5. Buat daftar endpoint publik/AJAX per modul.
6. Buat matriks hak akses dari `jbsuser.hakakses*`.
