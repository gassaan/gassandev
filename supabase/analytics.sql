-- Salhi Numbers — page view tracking
--
-- Run once in the Supabase dashboard: SQL Editor → New query → paste → Run.
-- Idempotent, so re-running is safe.
--
-- PRIVACY. This deliberately stores no IP address, no user agent, no cookie
-- and nothing that identifies a person. session_id is a random value held in
-- sessionStorage, so it groups one browsing session and disappears when the
-- tab closes — it cannot follow anyone between visits. That means "visits"
-- here means sessions, not unique people, and the dashboard says so rather
-- than overstating it.

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  -- Host only, never the full referring URL, which can carry search terms
  -- and other detail about the visitor.
  referrer_host text,
  session_id text not null,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx on public.page_views (created_at desc);

alter table public.page_views enable row level security;

-- Same asymmetry as orders: the public writes, only staff read. A visitor
-- must be able to record their own view without being able to read anyone
-- else's browsing.
drop policy if exists "anyone can record a page view" on public.page_views;
create policy "anyone can record a page view"
  on public.page_views for insert to anon, authenticated
  with check (true);

drop policy if exists "only staff can read page views" on public.page_views;
create policy "only staff can read page views"
  on public.page_views for select to authenticated
  using (true);
