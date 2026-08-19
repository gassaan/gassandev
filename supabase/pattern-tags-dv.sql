-- Salhi Numbers — add Dhivehi pattern tags to an existing database
--
-- Run once in the Supabase dashboard: SQL Editor → New query → paste → Run.
-- Idempotent, so re-running is safe.
--
-- ONLY needed if your project was created before this column existed. A
-- project set up from the current schema.sql already has it.
--
-- Adds pattern_tags_dv alongside the existing pattern_tags, defaulting every
-- existing row to an empty array — nothing is inferred or auto-translated,
-- since only you know the right Dhivehi wording for your own inventory. The
-- customer-facing site falls back to the English pattern_tags for any number
-- that doesn't have a Dhivehi version yet.

alter table public.numbers
  add column if not exists pattern_tags_dv text[] not null default '{}';
