# Catatan Bedah Form dan Alur Input JIBAS Original

Tanggal penelusuran: 2026-04-29

Tujuan dokumen ini adalah menjadi blueprint clone untuk aplikasi JIBAS modern. Fokusnya adalah alur input data, validasi, tabel database yang disentuh, dan catatan risiko dari implementasi original.

## Prinsip Clone

- Pertahankan alur bisnis dan relasi data, bukan bentuk HTML lama.
- Form lama yang panjang sebaiknya dipecah menjadi tab/stepper modern.
- Semua simpan data lintas tabel harus memakai transaksi database.
- Semua validasi JavaScript lama harus dipindahkan ke validasi frontend dan validasi backend.
- Query insert/update original masih banyak raw SQL dari request; versi baru wajib pakai parameterized query atau Supabase API yang aman.

## Struktur Modul yang Relevan

- `akademik`: master siswa, kelas, guru, jadwal, penilaian, presensi siswa.
- `keuangan/rinjani`: penerimaan, pengeluaran, jurnal, tabungan.
- `kepegawaian`: master pegawai dan presensi pegawai.
- `simtaka`: perpustakaan, pustaka, peminjaman.
- `cbe`: ujian berbasis komputer, jadwal, peserta, soal, hasil.

## Akademik - Form Siswa Baru

File original:

- `akademik/siswa/siswa_add.php`
- `akademik/siswa/siswa_add.js`
- `akademik/siswa/siswa_add_simpan.php`

### Bentuk Form

Form original adalah popup satu halaman besar dengan `multipart/form-data`. Untuk clone modern, pecah menjadi:

1. Penempatan akademik
2. Biodata siswa
3. Kontak dan alamat
4. Asal sekolah
5. Riwayat kesehatan
6. Data orang tua/wali
7. Data lain dan lampiran foto

### Input Utama

Penempatan:

- `idangkatan`
- `tahunmasuk`
- `nis`
- `nisn`
- `nik`
- `noun`
- `idkelas`
- `idtahunajaran`
- `idtingkat`
- `departemen`

Biodata:

- `nama`
- `panggilan`
- `kelamin`
- `tmplahir`
- `tgllahir`, `blnlahir`, `thnlahir`
- `agama`
- `suku`
- `status`
- `kondisi`
- `warga`
- `urutananak`
- `jumlahanak`
- `statusanak`
- `jkandung`
- `jtiri`
- `bahasa`
- `file_data` untuk foto

Kontak dan asal sekolah:

- `alamatsiswa`
- `kodepos`
- `jarak`
- `telponsiswa`
- `hpsiswa`
- `emailsiswa`
- `dep_asal`
- `sekolah`
- `noijasah`
- `tglijasah`
- `ketsekolah`

Kesehatan:

- `gol`
- `berat`
- `tinggi`
- `kesehatan`

Orang tua/wali:

- `namaayah`, `namaibu`
- `almayah`, `almibu`
- `statusayah`, `statusibu`
- `tmplahirayah`, `tmplahiribu`
- `tgllahirayah`, `tgllahiribu`
- `pendidikanayah`, `pendidikanibu`
- `pekerjaanayah`, `pekerjaanibu`
- `penghasilanayah`, `penghasilanibu`
- `emailayah`, `emailibu`
- `namawali`
- `alamatortu`
- `telponortu`
- `hportu`, `hportu2`, `hportu3`
- `hobi`
- `alamatsurat`
- `keterangan`

### Lookup Table

- `jbsakad.angkatan`
- `jbsakad.statussiswa`
- `jbsakad.kondisisiswa`
- `jbsakad.asalsekolah`
- `jbsumum.agama`
- `jbsumum.suku`
- `jbsumum.tingkatpendidikan`
- `jbsumum.jenispekerjaan`
- `jbsakad.tahunajaran`
- `jbsakad.tingkat`
- `jbsakad.kelas`

### Tabel Simpan

- `jbsakad.siswa`
- `jbsakad.riwayatdeptsiswa`
- `jbsakad.riwayatkelassiswa`
- `jbsakad.riwayatfoto`

### Alur Simpan

1. Validasi duplikat `nis` di `jbsakad.siswa`.
2. Jika ada foto JPEG, resize lalu simpan sebagai blob.
3. Begin transaction.
4. Insert data utama ke `jbsakad.siswa`.
5. Insert riwayat departemen ke `jbsakad.riwayatdeptsiswa`.
6. Insert riwayat kelas ke `jbsakad.riwayatkelassiswa`.
7. Commit jika semua berhasil, rollback jika gagal.

### Validasi Penting

- `tahunmasuk` wajib 4 digit angka.
- `nis` wajib.
- `nama` wajib.
- `thnlahir` jika diisi harus 4 digit angka.
- `urutananak <= jumlahanak`.
- Nomor telepon, kode pos, berat, tinggi, penghasilan harus angka.
- Email siswa, ayah, ibu harus format email.
- Tanggal lahir divalidasi berdasarkan bulan dan tahun kabisat.
- Foto hanya JPG/JPEG.

### Catatan Risiko

- Ada potensi typo/bug di radio golongan darah: pengecekan `AB` dan `B` tampak tertukar.
- Ada input `hportu3` dengan karakter `]` tersisa di atribut HTML.
- Server-side original masih raw SQL; clone wajib aman dari SQL injection.
- Jangan hanya percaya validasi frontend.

## Akademik - Form Kelas

File original:

- `akademik/referensi/kelas_add.php`

### Input

- `departemen`
- `tingkat`
- `tahunajaran`
- `kelas`
- `nipwali`
- `namawali`
- `kapasitas`
- `keterangan`

### Lookup Table

- `jbsakad.tahunajaran`
- `jbsakad.tingkat`
- `jbssdm.pegawai`

### Tabel Simpan

- `jbsakad.kelas`

### Alur Simpan

1. Form menerima konteks departemen, tingkat, dan tahun ajaran dari halaman induk.
2. Wali kelas dipilih dari popup pegawai bagian Akademik.
3. Cek duplikat `kelas + idtahunajaran + idtingkat`.
4. Insert ke `jbsakad.kelas`.

### Validasi Penting

- Nama kelas wajib.
- Wali kelas wajib.
- Kapasitas wajib angka.
- Keterangan maksimal 255 karakter.

## Kepegawaian - Form Input Pegawai

File original:

- `kepegawaian/pegawai/pegawaiinput.php`
- `kepegawaian/pegawai/pegawaiinput.js`
- `kepegawaian/pegawai/pegawaiinput.class.php`

### Bentuk Form

Form original adalah satu halaman dengan bagian utama data pegawai dan bagian dinamis untuk tambahan data. Untuk clone modern, pecah menjadi:

1. Identitas pekerjaan
2. Biodata pribadi
3. Kontak
4. Foto dan tanggal mulai kerja
5. Data tambahan dinamis

### Input Utama

- `rbPNS`: PNS/CPNS/HONORER/SWASTA
- `rbBagian`
- `txGelarAwal`
- `txNama`
- `txGelarAkhir`
- `txPanggilan`
- `txNIP`
- `txNUPTK`
- `txNRP`
- `txTmpLahir`
- `cbTglLahir`, `cbBlnLahir`, `txThnLahir`
- `cbAgama`
- `cbSuku`
- `cbNikah`
- `cbKelamin`
- `txAlamat`
- `txHP`
- `txTelpon`
- `txEmail`
- `txFacebook`
- `txTwitter`
- `txWebsite`
- `foto`
- `cbTglMulai`, `cbBlnMulai`, `txThnMulai`
- `txKeterangan`
- `tambahandata-{id}` untuk field tambahan

### Lookup Table

- `jbssdm.bagianpegawai`
- `jbsumum.agama`
- `jbsumum.suku`
- `jbssdm.tambahandata`
- `jbssdm.pilihandata`

### Tabel Simpan

- `jbssdm.pegawai`
- `jbssdm.peglastdata`
- `jbsakad.riwayatfoto`
- `jbssdm.tambahandatapegawai`

### Alur Simpan

1. Cek duplikat `nip` di `jbssdm.pegawai`.
2. Bentuk tanggal lahir dan mulai kerja.
3. Resize foto jika ada.
4. Begin transaction.
5. Generate `pinpegawai` random 5 digit.
6. Insert ke `jbssdm.pegawai`.
7. Insert ke `jbssdm.peglastdata`.
8. Jika ada foto, insert ke `jbsakad.riwayatfoto`.
9. Loop field tambahan dari `idtambahan`, simpan teks/pilihan/file ke `jbssdm.tambahandatapegawai`.
10. Commit atau rollback.

### Validasi Penting

- Nama pegawai wajib.
- NIP wajib dan unik.
- Tempat lahir wajib.
- Tahun lahir wajib 4 digit angka.
- Tahun mulai kerja wajib 4 digit angka.
- Confirm sebelum submit.

### Catatan Risiko

- Upload tambahan file dibatasi 256000 byte di server.
- `pinpegawai` random pendek; clone sebaiknya pakai generator lebih kuat atau auth terpisah.

## Kepegawaian - Presensi Pegawai

File original:

- `kepegawaian/presensi/inputpresensi.content.php`
- `kepegawaian/presensi/inputpresensi.content.js`
- `kepegawaian/presensi/inputpresensi.content.save.new.php`
- `kepegawaian/presensi/inputpresensi.content.save.edit.php`

### Bentuk Form

Grid presensi per tanggal. Satu baris per pegawai aktif. Jika tanggal belum punya data, tombol simpan batch muncul di bawah. Jika sudah ada data, setiap baris bisa disimpan satu-satu.

### Input

- `tglpresensi`
- per baris:
  - `nip`
  - `status`
  - `jammasuk`
  - `menitmasuk`
  - `jampulang`
  - `menitpulang`
  - `keterangan`

### Lookup Table

- `jbssdm.pegawai`

### Tabel Simpan

- `jbssdm.presensi`

### Alur Simpan Baru

1. Cek apakah tanggal sudah punya presensi.
2. Jika belum, tampilkan seluruh pegawai aktif.
3. Frontend validasi jam hanya jika status hadir.
4. Submit batch ke `inputpresensi.content.save.new.php`.
5. Begin transaction.
6. Loop pegawai, hitung durasi kerja jika status hadir.
7. Insert ke `jbssdm.presensi`.
8. Commit atau rollback.

### Status Presensi

- `1`: Hadir
- `2`: Izin
- `3`: Sakit
- `4`: Cuti
- `5`: Alpa
- `6`: Bebas
- `-1`: Belum ada data, hanya untuk edit tampilan

### Catatan Risiko

- Tidak terlihat unique constraint untuk `nip + tanggal + source`; clone perlu constraint agar tidak double input.
- Untuk status bukan hadir, jam disimpan `00:00:00`.

## Keuangan - Besar Pembayaran

File original:

- `keuangan/rinjani/penerimaan/inputbayar2.php`
- `keuangan/rinjani/penerimaan/inputbayar2.js`
- `keuangan/rinjani/penerimaan/inputbayar2.func.php`
- `keuangan/rinjani/penerimaan/inputbayar2.ajax.php`

### Bentuk Form

AJAX form untuk menentukan besar pembayaran wajib per siswa atau calon siswa berdasarkan kategori penerimaan.

### Input

- `idkategori`
  - `JTT`: iuran wajib siswa
  - `CSWJB`: iuran wajib calon siswa
- `departemen`
- `idpenerimaan`
- `besar`
- `cicilan`
- `cicilanpertama`
- `idtingkat`
- `idkelas` atau kelompok calon siswa, multi checkbox

### Lookup Table

- `jbsfina.datapenerimaan`
- `jbsfina.tahunbuku`
- `jbsakad.tingkat`
- `jbsakad.kelas`
- `jbsakad.siswa`
- `jbsakad.prosespenerimaansiswa`
- `jbsakad.kelompokcalonsiswa`
- `jbsakad.calonsiswa`

### Tabel Simpan Siswa

- `jbsfina.besarjtt`
- `jbsfina.jurnal`
- `jbsfina.jurnaldetail`
- `jbsfina.penerimaanjtt` jika cicilan pertama Rp 0 dicatat
- `jbsfina.tahunbuku`

### Tabel Simpan Calon Siswa

- `jbsfina.besarjttcalon`
- `jbsfina.jurnal`
- `jbsfina.jurnaldetail`
- `jbsfina.penerimaanjttcalon` jika cicilan pertama Rp 0 dicatat
- `jbsfina.tahunbuku`

### Alur Simpan

1. Validasi tahun buku aktif untuk departemen.
2. Validasi penerimaan aktif dan sesuai departemen.
3. Ambil siswa/calon siswa dari kelas/kelompok terpilih.
4. Filter yang belum punya setting di tahun buku aktif.
5. Ambil rekening dari `datapenerimaan`: `rekkas`, `rekpiutang`, `rekpendapatan`.
6. Begin transaction.
7. Untuk setiap siswa:
   - Increment `tahunbuku.cacah`.
   - Buat `nokas`.
   - Insert jurnal sumber `penerimaanjtt` atau `penerimaanjttcalon`.
   - Insert `besarjtt` atau `besarjttcalon`.
   - Insert detail jurnal debet piutang dan kredit pendapatan.
   - Jika cicilan pertama dicentang, buat jurnal Rp 0 dan insert penerimaan Rp 0.
8. Update `tahunbuku.cacah`.
9. Commit atau rollback.

### Validasi Penting

- Penerimaan harus tersedia.
- `besar` wajib, angka, positif.
- `cicilan` wajib, angka, positif.
- Tingkat/proses harus tersedia.
- Minimal satu kelas/kelompok dipilih.

### Catatan Risiko

- Clone wajib menjaga debit dan kredit seimbang.
- `tahunbuku.cacah` harus di-lock atau di-update aman saat concurrent input.

## Perpustakaan - Pustaka Baru

File original:

- `simtaka/pus/pustaka.baru.php`
- `simtaka/pus/pustaka.baru.js`
- `simtaka/pus/pustaka.baru.class.php`

### Bentuk Form

Form input bibliografi dan alokasi jumlah eksemplar per perpustakaan. Ada upload cover dan editor abstraksi.

### Input

- `judul`
- `harga`
- `hargaasli`
- `katalog`
- `penulis`
- `penerbit`
- `tahun`
- `format`
- `keyword`
- `keteranganfisik`
- `keterangan`
- `cover`
- `abstraksi`
- per perpustakaan:
  - `jumlah{i}`
  - `replid{i}`

### Lookup Table

- `jbsperpus.katalog`
- `jbsperpus.penulis`
- `jbsperpus.penerbit`
- `jbsperpus.format`
- `jbsperpus.perpustakaan`

### Tabel Simpan

- `jbsperpus.pustaka`
- `jbsperpus.daftarpustaka`
- `jbsperpus.katalog`

### Alur Simpan

1. Validasi bibliografi dan alokasi minimal satu eksemplar.
2. Resize cover jika ada.
3. Begin transaction.
4. Cek apakah pustaka dengan kombinasi `judul + penulis + format + katalog + penerbit` sudah ada.
5. Jika belum ada, insert ke `jbsperpus.pustaka`; jika sudah ada, pakai pustaka terakhir yang cocok.
6. Ambil `katalog.counter`.
7. Untuk setiap perpustakaan dan jumlah eksemplar:
   - Increment counter.
   - Generate `kodepustaka`.
   - Generate barcode random di `daftarpustaka.info1`.
   - Insert ke `jbsperpus.daftarpustaka`.
8. Update `jbsperpus.katalog.counter`.
9. Commit atau rollback.

### Validasi Penting

- Judul wajib.
- Harga wajib angka.
- Katalog, penerbit, penulis, format wajib.
- Tahun terbit wajib angka.
- Keyword wajib.
- Cover hanya JPG/JPEG.
- Minimal satu perpustakaan memiliki jumlah lebih dari 0.

### Catatan Risiko

- Barcode dibuat random dan dicek loop; clone sebaiknya tetap cek unique di database.
- `katalog.counter` raw increment harus aman terhadap concurrent input.

## Observasi Database Singkat

Query observasi isi database selalu dibatasi `LIMIT 5`.

- `jbsakad.tahunajaran`: ada tahun ajaran aktif `SMA 2009/2010`.
- `jbsakad.tingkat`: ada tingkat `10`, `11`, `12` untuk `SMA`.
- `jbsakad.kelas`: contoh `1-A`, `idtingkat=26`, `idtahunajaran=20`, wali `101`.
- `jbssdm.pegawai`: contoh pegawai `nip=101`, bagian `Akademik`.
- `jbsfina.datapenerimaan`: contoh `SPP Bulanan` kategori `JTT`, departemen `SMA`.

## Rekomendasi Prioritas Clone

1. Buat modul Akademik: master siswa dan kelas.
2. Buat modul Kepegawaian: master pegawai dan presensi.
3. Buat modul Keuangan: setup besar pembayaran karena bergantung ke siswa, kelas, tahun buku, dan rekening.
4. Buat modul Perpustakaan: pustaka baru dan eksemplar.
5. Baru lanjut modul lanjutan seperti penilaian, peminjaman, tabungan, dan CBE.

## Desain UI Modern yang Disarankan

- Dashboard modul di sidebar.
- Form besar memakai tab/stepper.
- Lookup master memakai combobox/searchable select.
- Upload foto/cover memakai preview.
- Grid presensi memakai tabel editable.
- Keuangan memakai summary panel sebelum simpan agar operator melihat jumlah siswa dan total jurnal.
- Semua operasi simpan batch menampilkan preview jumlah data yang akan dibuat.

## Mapping Awal ke Supabase/Postgres

- `jbsakad` menjadi schema `akad`.
- `jbsfina` menjadi schema `fina`.
- `jbssdm` menjadi schema `sdm`.
- `jbsperpus` menjadi schema `perpus`.
- `jbsumum` menjadi schema `umum`.

Catatan: migration awal schema sudah dibuat di proyek modern, tetapi tabel detail belum seluruhnya dibuat. Saat implementasi, mulai dari tabel yang dibutuhkan form prioritas, bukan memigrasi semua modul sekaligus.
