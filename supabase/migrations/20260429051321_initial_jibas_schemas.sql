-- Initial Supabase schema layout for JIBAS Modern.
-- This preserves the legacy domain boundaries while moving from MySQL
-- databases to PostgreSQL schemas.

create schema if not exists authz;
create schema if not exists umum;
create schema if not exists akad;
create schema if not exists fina;
create schema if not exists sdm;
create schema if not exists perpus;
create schema if not exists cbe;
create schema if not exists sms;

comment on schema authz is 'Pengguna, role, permission, dan audit akses. Legacy source: jbsuser.';
comment on schema umum is 'Identitas, departemen, dan data umum. Legacy source: jbsumum.';
comment on schema akad is 'Akademik: siswa, kelas, jadwal, presensi, nilai. Legacy source: jbsakad.';
comment on schema fina is 'Keuangan: penerimaan, pengeluaran, jurnal, tabungan. Legacy source: jbsfina.';
comment on schema sdm is 'Kepegawaian dan presensi pegawai. Legacy source: jbssdm.';
comment on schema perpus is 'Perpustakaan: pustaka, eksemplar, peminjaman. Legacy source: jbsperpus.';
comment on schema cbe is 'Computer Based Exam: ujian, soal, peserta, hasil. Legacy source: jbscbe.';
comment on schema sms is 'SMS dan notifikasi. Legacy source: jbssms.';

create table if not exists authz.legacy_module_map (
  id bigint generated always as identity primary key,
  legacy_module text not null unique,
  target_schema text not null,
  description text not null,
  created_at timestamptz not null default now()
);

insert into authz.legacy_module_map (legacy_module, target_schema, description)
values
  ('jbsuser', 'authz', 'Login, hak akses, landlord, dan permission lama'),
  ('jbsumum', 'umum', 'Identitas sekolah/departemen dan data umum'),
  ('jbsakad', 'akad', 'Akademik, siswa, kelas, jadwal, nilai'),
  ('jbsfina', 'fina', 'Keuangan, jurnal, penerimaan, pengeluaran, tabungan'),
  ('jbssdm', 'sdm', 'Pegawai, riwayat SDM, presensi, lembur'),
  ('jbsperpus', 'perpus', 'Perpustakaan, pustaka, eksemplar, pinjam'),
  ('jbscbe', 'cbe', 'Ujian, soal, peserta, jawaban, hasil'),
  ('jbssms', 'sms', 'SMS gateway dan notifikasi')
on conflict (legacy_module) do update
set target_schema = excluded.target_schema,
    description = excluded.description;

alter table authz.legacy_module_map enable row level security;
