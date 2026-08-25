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
    unit_system text not null default 'metric' check (unit_system in ('metric', 'imperial')),
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

-- ── food_items ──────────────────────────────────────────────────────────
-- Base de nutrição própria, semeada a partir de fontes abertas globais
-- (Open Food Facts + USDA FoodData Central) — não depende de API externa
-- em runtime. Ver mobile_documentation.md seção 7.5.
create table if not exists public.food_items (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    name_search text generated always as (lower(name)) stored,
    category text,
    source text not null default 'manual' check (source in ('openfoodfacts', 'usda', 'manual')),
    source_id text,
    calories_per_100g numeric not null,
    protein_per_100g numeric not null,
    carbs_per_100g numeric not null,
    fat_per_100g numeric not null,
    fiber_per_100g numeric,
    created_at timestamptz not null default now()
);

create index if not exists food_items_name_search_idx on public.food_items (name_search);

alter table public.food_items enable row level security;

-- food_items é um catálogo global compartilhado, não por usuário: todos
-- podem ler, ninguém escreve pelo client (só a Edge Function/admin via
-- service role, que ignora RLS).
create policy "food_items_select_all" on public.food_items
    for select using (true);

-- ── meal_logs ───────────────────────────────────────────────────────────
-- Um registro por prato escaneado/confirmado pelo usuário. `items` guarda
-- uma cópia dos macros calculados no momento do registro (não só a
-- referência a food_items), para que uma correção futura na base não
-- altere retroativamente o histórico do usuário.
create table if not exists public.meal_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles (id) on delete cascade,
    logged_at timestamptz not null default now(),
    items jsonb not null default '[]'::jsonb,
    total_calories numeric not null default 0,
    total_protein numeric not null default 0,
    total_carbs numeric not null default 0,
    total_fat numeric not null default 0
);

create index if not exists meal_logs_user_id_idx on public.meal_logs (user_id);

alter table public.meal_logs enable row level security;

create policy "meal_logs_all_own" on public.meal_logs
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── meal_scan_usage ─────────────────────────────────────────────────────
-- Server-side rate-limit counter for the analyze-meal-photo Edge Function.
-- One row per user per day. Never written to directly by the client — only
-- through check_and_increment_meal_scan_usage() below, which is the single
-- gate the Edge Function calls before spending Gemini quota. A stateless
-- Edge Function instance can't remember previous calls on its own, so the
-- counter has to live here. See mobile_documentation.md section 7.9.
create table if not exists public.meal_scan_usage (
    user_id uuid not null references public.profiles (id) on delete cascade,
    date date not null,
    count integer not null default 0,
    last_request_at timestamptz not null default now(),
    primary key (user_id, date)
);

alter table public.meal_scan_usage enable row level security;

-- Client can read its own usage (e.g. to show "12/20 scans today" in the
-- UI) but never write directly — all writes go through the SECURITY
-- DEFINER function, which enforces the limit atomically.
create policy "meal_scan_usage_select_own" on public.meal_scan_usage
    for select using (auth.uid() = user_id);

create or replace function public.check_and_increment_meal_scan_usage(
    daily_limit integer default 20,
    min_interval_seconds integer default 5
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    uid uuid := auth.uid();
    today date := current_date;
    rec public.meal_scan_usage%rowtype;
begin
    if uid is null then
        return jsonb_build_object('allowed', false, 'reason', 'unauthenticated');
    end if;

    select * into rec from public.meal_scan_usage
        where user_id = uid and date = today
        for update;

    if not found then
        insert into public.meal_scan_usage (user_id, date, count, last_request_at)
        values (uid, today, 1, now());
        return jsonb_build_object('allowed', true, 'count', 1, 'limit', daily_limit);
    end if;

    if rec.last_request_at > now() - make_interval(secs => min_interval_seconds) then
        return jsonb_build_object('allowed', false, 'reason', 'too_frequent');
    end if;

    if rec.count >= daily_limit then
        return jsonb_build_object('allowed', false, 'reason', 'daily_limit_reached', 'count', rec.count, 'limit', daily_limit);
    end if;

    update public.meal_scan_usage
        set count = count + 1, last_request_at = now()
        where user_id = uid and date = today;

    return jsonb_build_object('allowed', true, 'count', rec.count + 1, 'limit', daily_limit);
end;
$$;

grant execute on function public.check_and_increment_meal_scan_usage(integer, integer) to authenticated;

-- ── Realtime ────────────────────────────────────────────────────────────
-- userService.subscribeToUser() escuta mudanças via supabase.channel(...).on('postgres_changes', ...)
-- nas 5 tabelas acima. Habilite Realtime para elas em Database → Replication
-- no dashboard do projeto (não dá para fazer via SQL puro em todo plano).
