-- Salhi Numbers — bring an older database up to the current grades
--
-- Run once in the Supabase dashboard: SQL Editor → New query → paste → Run.
-- Idempotent, so re-running is safe, and safe to run whichever of the older
-- shapes your project is currently in.
--
-- ONLY needed if your project was created before the grades existed. A project
-- set up from the current schema.sql already has all three.
--
-- The grades have changed twice:
--
--   1. originally      nice / regular
--   2. then            silver / gold / premium / platinum
--   3. now             silver / gold / platinum
--
-- Step 1 RENAMES the two old values rather than building a new type and
-- casting the column across. Renaming rewrites nothing, drops no dependency,
-- and every existing row keeps its meaning automatically:
--
--     regular  ->  silver     (the entry grade)
--     nice     ->  gold       (the middle grade)
--
-- Anything you had marked "nice" therefore lands on Gold, and you promote
-- individual numbers to Platinum from the admin Numbers tab. That is
-- deliberate: only you know which of your numbers deserve the top grade, and
-- guessing on your behalf would mislabel live stock.

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

-- The top grade. Natively idempotent.
alter type category add value if not exists 'platinum';

-- Premium is gone. Anything still marked with it moves down to Gold, not up to
-- Platinum: Platinum is meant to be the rare one, and promoting a batch into it
-- would blunt exactly the signal it exists to send. Promote the ones that
-- deserve it by hand afterwards.
--
-- Dynamic SQL because a plain 'premium'::category would fail to parse on a
-- database that never had the value — which is most of them.
do $$
begin
  if exists (
    select 1 from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'category' and e.enumlabel = 'premium'
  ) then
    execute $sql$ update public.numbers set category = 'gold' where category = 'premium' $sql$;
  end if;
end $$;

-- New stock starts at the entry grade.
alter table public.numbers alter column category set default 'silver';

-- NOTE — three things this deliberately does not do.
--
-- It does not remove the 'premium' label from the type. Postgres has no
-- ALTER TYPE ... DROP VALUE, so the only way to be rid of it is to rebuild the
-- type and recreate the column on live stock. The label sitting there unused
-- costs nothing: no row references it, the admin no longer offers it, and if
-- one ever did appear the app renders it as Gold.
--
-- It does not touch orders.items. Those are JSONB snapshots of what was sold at
-- the time, so older ones still read "nice", "regular" or "premium". An order
-- is a historical record and rewriting it would be falsifying it; the app maps
-- those legacy values when displaying them instead.
--
-- It does not reorder the enum. Postgres sorts an enum by definition order, so
-- after the renames that order is gold, silver, platinum rather than the grade
-- ranking. Nothing sorts by this column — the shop orders by price and date,
-- and filters by equality — and rebuilding the type to fix a cosmetic ordering
-- would mean dropping and recreating the column on live stock. If you ever do
-- need ranked ordering, sort in the query with a CASE rather than rebuilding.
