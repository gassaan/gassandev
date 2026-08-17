-- Salhi Numbers — Supabase schema
--
-- Run this once in the Supabase dashboard: SQL Editor → New query → paste →
-- Run. It is idempotent, so re-running it is safe.
--
-- SECURITY NOTE. The anon key ships inside the client bundle; that is how
-- Supabase is designed to work, and it is why row level security below is the
-- only thing standing between the public and this data. In particular the
-- orders table holds customer names and phone numbers, so anon may INSERT an
-- order but must never SELECT one. Do not add a public read policy to orders.

-- ---------------------------------------------------------------- enums ----

do $$ begin
  create type provider as enum ('dhiraagu', 'ooredoo');
exception when duplicate_object then null; end $$;

do $$ begin
  -- Grades, ascending: Platinum is the most elite. Existing projects get
  -- these via supabase/grades.sql instead.
  create type category as enum ('silver', 'gold', 'premium', 'platinum');
exception when duplicate_object then null; end $$;

do $$ begin
  create type number_status as enum ('available', 'reserved', 'sold');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('new', 'contacted', 'completed', 'cancelled');
exception when duplicate_object then null; end $$;

-- --------------------------------------------------------------- tables ----

create table if not exists public.numbers (
  id uuid primary key default gen_random_uuid(),
  -- Maldivian mobile numbers are exactly 7 digits, stored bare so search can
  -- run on the raw digits; the 3+4 grouping is presentation only.
  msisdn text not null unique check (msisdn ~ '^[0-9]{7}$'),
  -- Never inferred from the prefix: number portability makes 7xx/9xx
  -- unreliable, so the admin always sets this explicitly.
  provider provider not null,
  category category not null default 'silver',
  pattern_tags text[] not null default '{}',
  price numeric(10, 2) not null check (price >= 0),
  promo_price numeric(10, 2) check (promo_price >= 0),
  status number_status not null default 'available',
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  -- The price actually charged. Generated rather than computed per query so
  -- price filtering and sorting can be indexed instead of scanning.
  selling_price numeric(10, 2) generated always as (coalesce(promo_price, price)) stored
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_ref text not null,
  customer_name text not null,
  customer_contact text not null check (customer_contact ~ '^[0-9]{7}$'),
  items jsonb not null,
  total numeric(12, 2) not null check (total >= 0),
  status order_status not null default 'new',
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------- indexes ----

create index if not exists numbers_status_idx on public.numbers (status);
create index if not exists numbers_provider_idx on public.numbers (provider);
create index if not exists numbers_category_idx on public.numbers (category);
create index if not exists numbers_selling_price_idx on public.numbers (selling_price);
create index if not exists numbers_created_at_idx on public.numbers (created_at desc);
create index if not exists numbers_featured_idx on public.numbers (is_featured) where is_featured;
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- ------------------------------------------------------ row level security --

alter table public.numbers enable row level security;
alter table public.orders enable row level security;

-- numbers: a public catalogue, editable only by signed-in staff.
drop policy if exists "numbers are publicly readable" on public.numbers;
create policy "numbers are publicly readable"
  on public.numbers for select
  using (true);

drop policy if exists "staff can add numbers" on public.numbers;
create policy "staff can add numbers"
  on public.numbers for insert to authenticated
  with check (true);

drop policy if exists "staff can change numbers" on public.numbers;
create policy "staff can change numbers"
  on public.numbers for update to authenticated
  using (true) with check (true);

drop policy if exists "staff can remove numbers" on public.numbers;
create policy "staff can remove numbers"
  on public.numbers for delete to authenticated
  using (true);

-- orders: write-only for the public. A customer submits one; only staff read
-- them back. There is deliberately no anon SELECT policy — adding one would
-- expose every customer's name and phone number to anyone with the anon key.
drop policy if exists "anyone can submit an order" on public.orders;
create policy "anyone can submit an order"
  on public.orders for insert to anon, authenticated
  with check (true);

drop policy if exists "only staff can read orders" on public.orders;
create policy "only staff can read orders"
  on public.orders for select to authenticated
  using (true);

drop policy if exists "only staff can update orders" on public.orders;
create policy "only staff can update orders"
  on public.orders for update to authenticated
  using (true) with check (true);
