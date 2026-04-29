-- Minimal seed data for local/staging JIBAS Modern MVP.

insert into umum.departemen (kode, nama, aktif)
values
  ('SMA', 'Sekolah Menengah Atas', true),
  ('SMP', 'Sekolah Menengah Pertama', true)
on conflict (kode) do update
set nama = excluded.nama,
    aktif = excluded.aktif;

insert into authz.roles (kode, nama, deskripsi)
values
  ('admin', 'Administrator', 'Akses penuh untuk seluruh modul'),
  ('akademik', 'Operator Akademik', 'Akses operasional modul akademik'),
  ('keuangan', 'Operator Keuangan', 'Akses operasional modul keuangan'),
  ('perpustakaan', 'Operator Perpustakaan', 'Akses operasional modul perpustakaan')
on conflict (kode) do update
set nama = excluded.nama,
    deskripsi = excluded.deskripsi;

insert into authz.permissions (role_id, modul, can_read, can_create, can_update, can_delete)
select roles.id, modules.modul, true, true, true, true
from authz.roles roles
cross join (values ('akademik'), ('keuangan'), ('kepegawaian'), ('perpustakaan'), ('cbe'), ('pengguna')) as modules(modul)
where roles.kode = 'admin'
on conflict (role_id, modul) do update
set can_read = excluded.can_read,
    can_create = excluded.can_create,
    can_update = excluded.can_update,
    can_delete = excluded.can_delete;

insert into authz.app_users (username, nama, email, role_id, aktif)
select 'admin', 'Administrator', 'admin@jibas.local', roles.id, true
from authz.roles roles
where roles.kode = 'admin'
on conflict (username) do update
set nama = excluded.nama,
    email = excluded.email,
    role_id = excluded.role_id,
    aktif = excluded.aktif;

insert into akad.tahun_ajaran (departemen_id, tahun, aktif)
select id, '2026/2027', true
from umum.departemen
where kode = 'SMA'
on conflict (departemen_id, tahun) do update
set aktif = excluded.aktif;

insert into akad.tingkat (departemen_id, nama, urutan)
select departemen.id, tingkat.nama, tingkat.urutan
from umum.departemen departemen
cross join (values ('10', 10), ('11', 11), ('12', 12)) as tingkat(nama, urutan)
where departemen.kode = 'SMA'
on conflict (departemen_id, nama) do update
set urutan = excluded.urutan;

insert into sdm.pegawai (nip, nama, bagian, email, aktif)
values ('101', 'Budi Santoso', 'Akademik', 'budi@jibas.local', true)
on conflict (nip) do update
set nama = excluded.nama,
    bagian = excluded.bagian,
    email = excluded.email,
    aktif = excluded.aktif;

insert into akad.kelas (departemen_id, tahun_ajaran_id, tingkat_id, nama, wali_pegawai_id, kapasitas)
select departemen.id, tahun_ajaran.id, tingkat.id, '10-A', pegawai.id, 32
from umum.departemen departemen
join akad.tahun_ajaran tahun_ajaran on tahun_ajaran.departemen_id = departemen.id and tahun_ajaran.tahun = '2026/2027'
join akad.tingkat tingkat on tingkat.departemen_id = departemen.id and tingkat.nama = '10'
left join sdm.pegawai pegawai on pegawai.nip = '101'
where departemen.kode = 'SMA'
on conflict (tahun_ajaran_id, tingkat_id, nama) do update
set wali_pegawai_id = excluded.wali_pegawai_id,
    kapasitas = excluded.kapasitas;

insert into akad.siswa (nis, nisn, nama, kelamin, kelas_id, hp, status)
select '260001', '0099990001', 'Ahmad Fauzi', 'L', kelas.id, '081234567890', 'Aktif'
from akad.kelas kelas
where kelas.nama = '10-A'
on conflict (nis) do update
set nisn = excluded.nisn,
    nama = excluded.nama,
    kelamin = excluded.kelamin,
    kelas_id = excluded.kelas_id,
    hp = excluded.hp,
    status = excluded.status;

insert into akad.riwayat_kelas_siswa (siswa_id, kelas_id, aktif)
select siswa.id, kelas.id, true
from akad.siswa siswa
join akad.kelas kelas on kelas.id = siswa.kelas_id
where siswa.nis = '260001'
on conflict do nothing;

insert into fina.tahun_buku (departemen_id, tahun, awalan, cacah, aktif)
select id, '2026', 'KB26', 1, true
from umum.departemen
where kode = 'SMA'
on conflict (departemen_id, tahun) do update
set awalan = excluded.awalan,
    aktif = excluded.aktif;

insert into fina.rekakun (kode, nama, kategori, aktif)
values
  ('1-100', 'Kas Sekolah', 'Kas', true),
  ('1-200', 'Piutang Siswa', 'Piutang', true),
  ('4-100', 'Pendapatan SPP', 'Pendapatan', true),
  ('5-100', 'Beban Operasional', 'Beban', true)
on conflict (kode) do update
set nama = excluded.nama,
    kategori = excluded.kategori,
    aktif = excluded.aktif;

insert into fina.jurnal (tahun_buku_id, nomor, tanggal, sumber, keterangan, total_debit, total_kredit, created_by)
select tahun_buku.id, 'KB26000001', current_date, 'saldoawal', 'Saldo awal kas sekolah', 1000000, 1000000, app_users.id
from fina.tahun_buku tahun_buku
join umum.departemen departemen on departemen.id = tahun_buku.departemen_id
left join authz.app_users app_users on app_users.username = 'admin'
where departemen.kode = 'SMA' and tahun_buku.tahun = '2026'
on conflict (nomor) do nothing;

insert into fina.jurnal_detail (jurnal_id, rekakun_id, posisi, nominal, keterangan)
select jurnal.id, rekakun.id, detail.posisi, detail.nominal, detail.keterangan
from fina.jurnal jurnal
join (values
  ('1-100', 'D', 1000000::numeric, 'Debit kas'),
  ('4-100', 'K', 1000000::numeric, 'Kredit pendapatan')
) as detail(kode_akun, posisi, nominal, keterangan) on true
join fina.rekakun rekakun on rekakun.kode = detail.kode_akun
where jurnal.nomor = 'KB26000001'
on conflict do nothing;

insert into sdm.presensi (pegawai_id, tanggal, status, jam_masuk, jam_pulang, source)
select id, current_date, 'Hadir', '07:00'::time, '15:00'::time, 'REGULER'
from sdm.pegawai
where nip = '101'
on conflict (pegawai_id, tanggal, source) do update
set status = excluded.status,
    jam_masuk = excluded.jam_masuk,
    jam_pulang = excluded.jam_pulang;

insert into perpus.perpustakaan (kode, nama, aktif)
values ('PUS', 'Perpustakaan Utama', true)
on conflict (kode) do update
set nama = excluded.nama,
    aktif = excluded.aktif;

insert into perpus.katalog (kode, nama, counter)
values ('MTK', 'Matematika', 1)
on conflict (kode) do update
set nama = excluded.nama;

insert into perpus.pustaka (katalog_id, judul, penulis, penerbit, tahun, format, keyword)
select katalog.id, 'Matematika Dasar', 'Tim Guru', 'JIBAS', 2026, 'Buku', 'matematika dasar'
from perpus.katalog katalog
where katalog.kode = 'MTK'
on conflict (judul, penulis, penerbit, format) do update
set katalog_id = excluded.katalog_id,
    tahun = excluded.tahun,
    keyword = excluded.keyword;

insert into perpus.eksemplar (pustaka_id, perpustakaan_id, kode_pustaka, barcode, status)
select pustaka.id, perpustakaan.id, 'MTK-001', 'BC-MTK-001', 'Tersedia'
from perpus.pustaka pustaka
cross join perpus.perpustakaan perpustakaan
where pustaka.judul = 'Matematika Dasar' and perpustakaan.kode = 'PUS'
on conflict (kode_pustaka) do update
set status = excluded.status;

insert into cbe.ujian (kode, nama, tanggal_mulai, tanggal_selesai, status)
values ('CB-001', 'Tryout Matematika', now(), now() + interval '2 hours', 'Draft')
on conflict (kode) do update
set nama = excluded.nama,
    tanggal_mulai = excluded.tanggal_mulai,
    tanggal_selesai = excluded.tanggal_selesai,
    status = excluded.status;

insert into cbe.soal (kode, pelajaran, tipe, konten, aktif)
values ('S-001', 'Matematika', 'Pilihan Ganda', 'Contoh soal matematika dasar', true)
on conflict (kode) do update
set pelajaran = excluded.pelajaran,
    tipe = excluded.tipe,
    konten = excluded.konten,
    aktif = excluded.aktif;

insert into sms.notification_queue (channel, recipient, template_key, payload, status)
values ('EMAIL', 'admin@jibas.local', 'welcome', '{"name":"Administrator"}'::jsonb, 'Pending')
on conflict do nothing;
