-- Salhi Numbers — migrate the two number types to four grades
--
-- Run once in the Supabase dashboard: SQL Editor → New query → paste → Run.
-- Idempotent, so re-running is safe.
--
-- ONLY needed if your project was created before grades existed. A project set
-- up from the current schema.sql already has all four.
--
-- This RENAMES the two existing values rather than building a new type and
-- casting the column across. Renaming rewrites nothing, drops no dependency,
-- and every existing row keeps its meaning automatically:
--
--     regular  ->  silver     (the entry grade)
--     nice     ->  gold       (the first premium grade)
--
-- Anything you had marked "nice" therefore lands on Gold, and you can promote
-- individual numbers to Premium or Platinum from the admin Numbers tab. That
-- is deliberate: only you know which of your numbers deserve the top grades,
-- and guessing on your behalf would mislabel live stock.

-- Rename, guarded so a second run is a no-op rather than an error.
do $$
begin
  if exists (
    select 1 from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'category' and e.enumlabel = 'regular'
  ) then
    alter type category rename value 'regular' to 'silver';
  end if;
end $$;

do $$
begin
  if exists (
    select 1 from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'category' and e.enumlabel = 'nice'
  ) then
    alter type category rename value 'nice' to 'gold';
  end if;
end $$;

-- The two new grades. Natively idempotent.
alter type category add value if not exists 'premium';
alter type category add value if not exists 'platinum';

-- New stock starts at the entry grade.
alter table public.numbers alter column category set default 'silver';

-- NOTE — two things this deliberately does not do.
--
-- It does not touch orders.items. Those are JSONB snapshots of what was sold
-- at the time, so older ones still read "nice" or "regular". An order is a
-- historical record and rewriting it would be falsifying it; the app maps
-- those legacy values to Gold and Silver when displaying them instead.
--
-- It does not reorder the enum. Postgres sorts an enum by definition order, so
-- after the rename that order is gold, silver, premium, platinum rather than
-- the grade ranking. Nothing sorts by this column — the shop orders by price
-- and date, and filters by equality — and rebuilding the type to fix a
-- cosmetic ordering would mean dropping and recreating the column on live
-- stock. If you ever do need ranked ordering, sort in the query with a CASE
-- rather than rebuilding the type.
