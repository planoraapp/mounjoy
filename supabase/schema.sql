-- Mounjoy — schema do Postgres/Supabase
--
-- Reconstruído a partir das queries em src/services/userService.js, já que o
-- schema não estava versionado em lugar nenhum do repositório. Rode este
-- arquivo inteiro no SQL editor de QUALQUER projeto Supabase novo (produção
-- ou teste) para recriar as 5 tabelas usadas pelo app + RLS básica.
--
-- RLS: cada usuário só enxerga/edita as próprias linhas (auth.uid() = id ou
-- user_id). Isso é o que hoje faz o papel das antigas firestore.rules.

-- ── profiles ────────────────────────────────────────────────────────────
-- Uma linha por usuário, id = auth.users.id (Supabase Auth).
create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    name text,
    email text,
    photo_url text,
    start_date timestamptz not null default now(),
    medication_id text not null default 'ozempic',
    current_dose text not null default '0.25 mg',
    is_maintenance boolean not null default false,
    protein_goal numeric not null default 100,
    water_goal numeric not null default 2.5,
    fiber_goal numeric not null default 25,
    updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
    for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
    for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
    for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles
    for delete using (auth.uid() = id);

-- ── measurements ────────────────────────────────────────────────────────
create table if not exists public.measurements (
    id bigint generated always as identity primary key,
    user_id uuid not null references public.profiles (id) on delete cascade,
    date timestamptz not null,
    weight numeric not null default 0,
    waist numeric not null default 0,
    hip numeric not null default 0
);

create index if not exists measurements_user_id_idx on public.measurements (user_id);

alter table public.measurements enable row level security;

create policy "measurements_all_own" on public.measurements
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── dose_history ────────────────────────────────────────────────────────
create table if not exists public.dose_history (
    id bigint generated always as identity primary key,
    user_id uuid not null references public.profiles (id) on delete cascade,
    date timestamptz not null,
    dose text not null default '0.25 mg',
    medication text not null default 'ozempic',
    site text not null default 'Não registrado'
);

create index if not exists dose_history_user_id_idx on public.dose_history (user_id);

alter table public.dose_history enable row level security;

create policy "dose_history_all_own" on public.dose_history
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── symptoms_logs ───────────────────────────────────────────────────────
create table if not exists public.symptoms_logs (
    id bigint generated always as identity primary key,
    user_id uuid not null references public.profiles (id) on delete cascade,
    date timestamptz not null,
    nausea integer not null default 0,
    headache integer not null default 0,
    fatigue integer not null default 0,
    notes text default ''
);

create index if not exists symptoms_logs_user_id_idx on public.symptoms_logs (user_id);

alter table public.symptoms_logs enable row level security;

create policy "symptoms_logs_all_own" on public.symptoms_logs
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── daily_intake ────────────────────────────────────────────────────────
-- Uma linha por usuário/dia (upsert com onConflict: 'user_id,date').
create table if not exists public.daily_intake (
    user_id uuid not null references public.profiles (id) on delete cascade,
    date date not null,
    water numeric not null default 0,
    protein numeric not null default 0,
    fiber numeric not null default 0,
    primary key (user_id, date)
);

alter table public.daily_intake enable row level security;

create policy "daily_intake_all_own" on public.daily_intake
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Realtime ────────────────────────────────────────────────────────────
-- userService.subscribeToUser() escuta mudanças via supabase.channel(...).on('postgres_changes', ...)
-- nas 5 tabelas acima. Habilite Realtime para elas em Database → Replication
-- no dashboard do projeto (não dá para fazer via SQL puro em todo plano).
