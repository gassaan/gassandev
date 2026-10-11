-- Salhi Numbers — record sales made off-site
--
-- Adds the channel a sale came from, so a number sold on Facebook
-- Marketplace, Viber or in person can be written down in the admin panel and
-- counted alongside the website's own checkouts.
--
-- Run this once in the Supabase dashboard: SQL Editor → New query → paste →
-- Run. It is idempotent, so re-running it is safe. New projects get all of
-- this from supabase/schema.sql and do not need to run this file.

-- ------------------------------------------------------------- columns ----

alter table public.orders
  add column if not exists source text not null default 'website';

-- Only read when source = 'other'. The channel list will never cover every
-- e-commerce site, so there has to be a way to just say where.
alter table public.orders
  add column if not exists source_detail text;

alter table public.orders
  add column if not exists note text;

-- Text with a check constraint rather than an enum: Postgres cannot drop an
-- enum label, and this list changes as the owner's selling channels do. A
-- check constraint can simply be dropped and recreated, as below.
alter table public.orders drop constraint if exists orders_source_check;
alter table public.orders
  add constraint orders_source_check check (
    source in (
      'website',
      'facebook-marketplace',
      'facebook',
      'instagram',
      'tiktok',
      'viber',
      'whatsapp',
      'walk-in',
      'other'
    )
  );

-- A website checkout always collects a 7-digit contact, because the form
-- requires one. A Marketplace buyer who paid in person often leaves no number
-- at all, so an empty contact has to be allowed — but anything non-empty is
-- still held to the same 7 digits, so the WhatsApp links keep working.
alter table public.orders drop constraint if exists orders_customer_contact_check;
alter table public.orders
  add constraint orders_customer_contact_check check (
    customer_contact = '' or customer_contact ~ '^[0-9]{7}$'
  );

-- -------------------------------------------------------------- indexes ----

create index if not exists orders_source_idx on public.orders (source);

-- ------------------------------------------------------ row level security --

-- Recording a sale is staff-only. The existing insert policy allows anon so
-- that customers can check out, and it cannot tell the two apart, so this one
-- closes the gap the new columns would otherwise open: the public may still
-- insert an order, but only as a 'website' sale that is 'new'. Without this,
-- anyone holding the anon key could post a completed sale into the owner's
-- revenue figures.
drop policy if exists "anyone can submit an order" on public.orders;
create policy "anyone can submit an order"
  on public.orders for insert to anon
  with check (source = 'website' and status = 'new');

drop policy if exists "staff can record a sale" on public.orders;
create policy "staff can record a sale"
  on public.orders for insert to authenticated
  with check (true);
