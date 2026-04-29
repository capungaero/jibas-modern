-- Foundation tables for JIBAS Modern MVP.
-- Domain schemas follow legacy database boundaries while introducing safe
-- PostgreSQL constraints for the new application.

create extension if not exists pgcrypto;

create or replace function umum.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists umum.departemen (
  id uuid primary key default gen_random_uuid(),
  kode text not null unique,
  nama text not null,
  aktif boolean not null default true,
  legacy_id bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint departemen_kode_not_blank check (length(trim(kode)) > 0),
  constraint departemen_nama_not_blank check (length(trim(nama)) > 0)
);

create trigger set_updated_at_departemen
before update on umum.departemen
for each row execute function umum.set_updated_at();

create table if not exists authz.roles (
  id uuid primary key default gen_random_uuid(),
  kode text not null unique,
  nama text not null,
  deskripsi text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint roles_kode_not_blank check (length(trim(kode)) > 0)
);

create trigger set_updated_at_roles
before update on authz.roles
for each row execute function umum.set_updated_at();

create table if not exists authz.permissions (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references authz.roles(id) on delete cascade,
  modul text not null,
  can_read boolean not null default true,
  can_create boolean not null default false,
  can_update boolean not null default false,
  can_delete boolean not null default false,
  created_at timestamptz not null default now(),
  unique (role_id, modul)
);

create table if not exists authz.app_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  username text not null unique,
  nama text not null,
  email text unique,
  role_id uuid references authz.roles(id) on delete set null,
  aktif boolean not null default true,
  legacy_login text,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint app_users_username_not_blank check (length(trim(username)) > 0)
);

create trigger set_updated_at_app_users
before update on authz.app_users
for each row execute function umum.set_updated_at();

create table if not exists akad.tahun_ajaran (
  id uuid primary key default gen_random_uuid(),
  departemen_id uuid not null references umum.departemen(id) on delete restrict,
  tahun text not null,
  aktif boolean not null default false,
  legacy_id bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (departemen_id, tahun)
);

create trigger set_updated_at_tahun_ajaran
before update on akad.tahun_ajaran
for each row execute function umum.set_updated_at();

create table if not exists akad.tingkat (
  id uuid primary key default gen_random_uuid(),
  departemen_id uuid not null references umum.departemen(id) on delete restrict,
  nama text not null,
  urutan integer not null default 0,
  legacy_id bigint,
  created_at timestamptz not null default now(),
  unique (departemen_id, nama)
);

create table if not exists sdm.pegawai (
  id uuid primary key default gen_random_uuid(),
  nip text not null unique,
  nama text not null,
  bagian text not null,
  email text unique,
  hp text,
  aktif boolean not null default true,
  legacy_id bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pegawai_nip_not_blank check (length(trim(nip)) > 0),
  constraint pegawai_nama_not_blank check (length(trim(nama)) > 0)
);

create trigger set_updated_at_pegawai
before update on sdm.pegawai
for each row execute function umum.set_updated_at();

create table if not exists akad.kelas (
  id uuid primary key default gen_random_uuid(),
  departemen_id uuid not null references umum.departemen(id) on delete restrict,
  tahun_ajaran_id uuid not null references akad.tahun_ajaran(id) on delete restrict,
  tingkat_id uuid not null references akad.tingkat(id) on delete restrict,
  nama text not null,
  wali_pegawai_id uuid references sdm.pegawai(id) on delete set null,
  kapasitas integer not null default 0,
  keterangan text,
  legacy_id bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tahun_ajaran_id, tingkat_id, nama),
  constraint kelas_kapasitas_non_negative check (kapasitas >= 0)
);

create trigger set_updated_at_kelas
before update on akad.kelas
for each row execute function umum.set_updated_at();

create table if not exists akad.siswa (
  id uuid primary key default gen_random_uuid(),
  nis text not null unique,
  nisn text unique,
  nik text unique,
  nama text not null,
  kelamin text not null check (kelamin in ('L', 'P')),
  tempat_lahir text,
  tanggal_lahir date,
  kelas_id uuid references akad.kelas(id) on delete set null,
  hp text,
  email text,
  alamat text,
  status text not null default 'Aktif' check (status in ('Aktif', 'Nonaktif', 'Lulus', 'Mutasi')),
  foto_path text,
  legacy_id bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint siswa_nis_not_blank check (length(trim(nis)) > 0),
  constraint siswa_nama_not_blank check (length(trim(nama)) > 0)
);

create trigger set_updated_at_siswa
before update on akad.siswa
for each row execute function umum.set_updated_at();

create table if not exists akad.riwayat_kelas_siswa (
  id uuid primary key default gen_random_uuid(),
  siswa_id uuid not null references akad.siswa(id) on delete cascade,
  kelas_id uuid not null references akad.kelas(id) on delete restrict,
  tanggal_mulai date not null default current_date,
  tanggal_selesai date,
  aktif boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists fina.tahun_buku (
  id uuid primary key default gen_random_uuid(),
  departemen_id uuid not null references umum.departemen(id) on delete restrict,
  tahun text not null,
  awalan text not null,
  cacah bigint not null default 1,
  aktif boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (departemen_id, tahun),
  constraint tahun_buku_cacah_positive check (cacah > 0)
);

create trigger set_updated_at_tahun_buku
before update on fina.tahun_buku
for each row execute function umum.set_updated_at();

create table if not exists fina.rekakun (
  id uuid primary key default gen_random_uuid(),
  kode text not null unique,
  nama text not null,
  kategori text not null check (kategori in ('Kas', 'Piutang', 'Pendapatan', 'Beban', 'Utang', 'Modal')),
  aktif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at_rekakun
before update on fina.rekakun
for each row execute function umum.set_updated_at();

create table if not exists fina.jurnal (
  id uuid primary key default gen_random_uuid(),
  tahun_buku_id uuid not null references fina.tahun_buku(id) on delete restrict,
  nomor text not null unique,
  tanggal date not null,
  sumber text not null,
  keterangan text not null,
  total_debit numeric(18,2) not null default 0,
  total_kredit numeric(18,2) not null default 0,
  batal boolean not null default false,
  created_by uuid references authz.app_users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint jurnal_balance check (total_debit = total_kredit),
  constraint jurnal_total_non_negative check (total_debit >= 0 and total_kredit >= 0)
);

create table if not exists fina.jurnal_detail (
  id uuid primary key default gen_random_uuid(),
  jurnal_id uuid not null references fina.jurnal(id) on delete cascade,
  rekakun_id uuid not null references fina.rekakun(id) on delete restrict,
  posisi text not null check (posisi in ('D', 'K')),
  nominal numeric(18,2) not null check (nominal >= 0),
  keterangan text,
  created_at timestamptz not null default now()
);

create table if not exists sdm.presensi (
  id uuid primary key default gen_random_uuid(),
  pegawai_id uuid not null references sdm.pegawai(id) on delete cascade,
  tanggal date not null,
  status text not null check (status in ('Hadir', 'Izin', 'Sakit', 'Cuti', 'Alpa', 'Bebas')),
  jam_masuk time,
  jam_pulang time,
  source text not null default 'REGULER' check (source in ('REGULER', 'LEMBUR')),
  keterangan text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (pegawai_id, tanggal, source)
);

create trigger set_updated_at_presensi
before update on sdm.presensi
for each row execute function umum.set_updated_at();

create table if not exists perpus.perpustakaan (
  id uuid primary key default gen_random_uuid(),
  kode text not null unique,
  nama text not null,
  aktif boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists perpus.katalog (
  id uuid primary key default gen_random_uuid(),
  kode text not null unique,
  nama text not null,
  counter bigint not null default 0,
  created_at timestamptz not null default now(),
  constraint katalog_counter_non_negative check (counter >= 0)
);

create table if not exists perpus.pustaka (
  id uuid primary key default gen_random_uuid(),
  katalog_id uuid references perpus.katalog(id) on delete set null,
  judul text not null,
  penulis text not null,
  penerbit text not null,
  tahun integer,
  format text not null default 'Buku',
  keyword text,
  cover_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (judul, penulis, penerbit, format)
);

create trigger set_updated_at_pustaka
before update on perpus.pustaka
for each row execute function umum.set_updated_at();

create table if not exists perpus.eksemplar (
  id uuid primary key default gen_random_uuid(),
  pustaka_id uuid not null references perpus.pustaka(id) on delete cascade,
  perpustakaan_id uuid not null references perpus.perpustakaan(id) on delete restrict,
  kode_pustaka text not null unique,
  barcode text not null unique,
  status text not null default 'Tersedia' check (status in ('Tersedia', 'Dipinjam', 'Rusak', 'Hilang')),
  created_at timestamptz not null default now()
);

create table if not exists perpus.peminjaman (
  id uuid primary key default gen_random_uuid(),
  eksemplar_id uuid not null references perpus.eksemplar(id) on delete restrict,
  anggota_ref text not null,
  jenis_anggota text not null check (jenis_anggota in ('Siswa', 'Pegawai', 'Luar')),
  tanggal_pinjam date not null default current_date,
  tanggal_kembali_rencana date,
  tanggal_kembali date,
  status text not null default 'Draft' check (status in ('Draft', 'Dipinjam', 'Kembali', 'Batal')),
  created_at timestamptz not null default now()
);

create table if not exists cbe.ujian (
  id uuid primary key default gen_random_uuid(),
  kode text not null unique,
  nama text not null,
  tanggal_mulai timestamptz,
  tanggal_selesai timestamptz,
  status text not null default 'Draft' check (status in ('Draft', 'Aktif', 'Selesai', 'Arsip')),
  legacy_id bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at_ujian
before update on cbe.ujian
for each row execute function umum.set_updated_at();

create table if not exists cbe.soal (
  id uuid primary key default gen_random_uuid(),
  kode text not null unique,
  pelajaran text not null,
  tipe text not null check (tipe in ('Pilihan Ganda', 'Esai')),
  konten text,
  resource_path text,
  aktif boolean not null default true,
  legacy_id bigint,
  created_at timestamptz not null default now()
);

create table if not exists sms.notification_queue (
  id uuid primary key default gen_random_uuid(),
  channel text not null check (channel in ('SMS', 'EMAIL', 'WHATSAPP', 'PUSH')),
  recipient text not null,
  template_key text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'Pending' check (status in ('Pending', 'Sent', 'Failed', 'Cancelled')),
  attempts integer not null default 0,
  scheduled_at timestamptz not null default now(),
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_tahun_ajaran_departemen on akad.tahun_ajaran(departemen_id);
create index if not exists idx_kelas_lookup on akad.kelas(tahun_ajaran_id, tingkat_id);
create index if not exists idx_siswa_kelas on akad.siswa(kelas_id);
create index if not exists idx_siswa_status on akad.siswa(status);
create index if not exists idx_jurnal_tanggal on fina.jurnal(tanggal);
create index if not exists idx_jurnal_detail_jurnal on fina.jurnal_detail(jurnal_id);
create index if not exists idx_presensi_tanggal on sdm.presensi(tanggal);
create index if not exists idx_eksemplar_status on perpus.eksemplar(status);
create index if not exists idx_peminjaman_status on perpus.peminjaman(status);
create index if not exists idx_notification_queue_status on sms.notification_queue(status, scheduled_at);

alter table umum.departemen enable row level security;
alter table authz.roles enable row level security;
alter table authz.permissions enable row level security;
alter table authz.app_users enable row level security;
alter table akad.tahun_ajaran enable row level security;
alter table akad.tingkat enable row level security;
alter table akad.kelas enable row level security;
alter table akad.siswa enable row level security;
alter table akad.riwayat_kelas_siswa enable row level security;
alter table fina.tahun_buku enable row level security;
alter table fina.rekakun enable row level security;
alter table fina.jurnal enable row level security;
alter table fina.jurnal_detail enable row level security;
alter table sdm.pegawai enable row level security;
alter table sdm.presensi enable row level security;
alter table perpus.perpustakaan enable row level security;
alter table perpus.katalog enable row level security;
alter table perpus.pustaka enable row level security;
alter table perpus.eksemplar enable row level security;
alter table perpus.peminjaman enable row level security;
alter table cbe.ujian enable row level security;
alter table cbe.soal enable row level security;
alter table sms.notification_queue enable row level security;
