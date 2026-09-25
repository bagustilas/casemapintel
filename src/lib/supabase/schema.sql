-- ==========================================================
-- CASEINTEL DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- ==========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USER PROFILES TABLE
create table if not exists public.user_profiles (
  id uuid primary key default uuid_generate_v4(),
  whatsapp_number text unique not null,
  license_key text not null,
  full_name text not null default 'Pengguna CaseIntel',
  organization text,
  license_expiry timestamp with time zone default (now() + interval '365 days'),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. USER DEVICES TABLE (Active Sessions)
create table if not exists public.user_devices (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.user_profiles(id) on delete cascade,
  license_key text not null,
  device_id text not null,
  device_name text not null,
  device_type text default 'desktop',
  ip_address text,
  user_agent text,
  is_active boolean default true,
  last_active timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  unique(license_key, device_id)
);

-- 3. CASES TABLE
create table if not exists public.cases (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.user_profiles(id) on delete set null,
  license_key text not null,
  title text not null,
  lp_number text,
  legal_regime text default 'KUHP_2023',
  crime_category text default 'Penggelapan',
  investigation_stage text default 'Penyidikan',
  incident_date_start text,
  incident_date_end text,
  main_article text,
  location_district text,
  location_polda text,
  brief_summary text,
  internal_ref text,

  -- Structured JSONB fields for flexibility & rich modeling
  parties jsonb default '[]'::jsonb,
  modus_indicators jsonb default '[]'::jsonb,
  damages jsonb default '[]'::jsonb,
  chronology jsonb default '[]'::jsonb,
  available_evidence jsonb default '[]'::jsonb,
  digital_evidence_hash text,
  chain_of_custody_summary text,
  article_elements jsonb default '[]'::jsonb,

  -- Advanced investigation fields
  statute_date text,
  statute_max_penalty_years text default '6',
  alibi_claim_date text,
  alibi_actual_date text,
  alibi_claim_location text,
  alibi_actual_location text,
  alibi_claim_time text,
  alibi_actual_time text,
  audit_suspect_status text default 'sah',
  audit_search_seizure_status text default 'sah',
  audit_arrest_detention_status text default 'sah',
  investigation_gaps text,

  -- Meeting & testimony
  participants jsonb default '[]'::jsonb,
  meeting_date text,
  meeting_place text,
  meeting_conclusion text,
  suspect_version text,
  victim_version text,
  witness_version text,
  investigator_notes text,

  calculated_score numeric default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexing for fast search and user query
create index if not exists idx_cases_license on public.cases(license_key);
create index if not exists idx_cases_title on public.cases using gin (to_tsvector('indonesian', title));
create index if not exists idx_devices_license on public.user_devices(license_key);

-- Automatic updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger set_cases_updated_at
  before update on public.cases
  for each row execute function public.handle_updated_at();

create or replace trigger set_user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.handle_updated_at();

-- Disable RLS or set open policy for demo/direct sync
alter table public.user_profiles enable row level security;
alter table public.user_devices enable row level security;
alter table public.cases enable row level security;

create policy "Allow all operations for development" on public.user_profiles for all using (true) with check (true);
create policy "Allow all operations for development" on public.user_devices for all using (true) with check (true);
create policy "Allow all operations for development" on public.cases for all using (true) with check (true);
