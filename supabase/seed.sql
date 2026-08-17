-- Salhi Numbers — starter stock
--
-- Optional. Run after schema.sql to load the same 30 example numbers the
-- local build ships with, so a fresh project is not an empty shop. Skip it if
-- you are loading real stock instead. Safe to re-run: existing msisdns are
-- left untouched.

insert into public.numbers
  (msisdn, provider, category, pattern_tags, price, promo_price, status, is_featured, created_at)
values
  ('7777777','dhiraagu','platinum',array['Repeating 7s','Triple 7']::text[],25000,null,'available',true,'2026-07-18T09:00:00Z'),
  ('7771111','dhiraagu','gold',array['Triple 7','Repeating pair']::text[],8000,null,'available',false,'2026-07-20T09:00:00Z'),
  ('7887888','dhiraagu','gold',array['Mirror']::text[],4500,null,'available',true,'2026-07-22T09:00:00Z'),
  ('7712345','dhiraagu','gold',array['Sequential','Easy to remember']::text[],3200,2800,'available',false,'2026-07-25T09:00:00Z'),
  ('7799887','dhiraagu','gold',array['Repeating pair','Mirror']::text[],2600,null,'reserved',false,'2026-07-27T09:00:00Z'),
  ('7900000','dhiraagu','gold',array['Round number','Easy to remember']::text[],6000,null,'available',false,'2026-07-29T09:00:00Z'),
  ('7878787','dhiraagu','gold',array['Alternating','Easy to remember']::text[],9500,7900,'available',true,'2026-08-01T09:00:00Z'),
  ('7712121','dhiraagu','gold',array['Repeating pair']::text[],2100,null,'reserved',false,'2026-08-03T09:00:00Z'),
  ('7701234','dhiraagu','silver','{}'::text[],350,null,'available',false,'2026-07-19T09:00:00Z'),
  ('7756890','dhiraagu','silver','{}'::text[],250,null,'available',false,'2026-07-21T09:00:00Z'),
  ('7823456','dhiraagu','silver',array['Sequential']::text[],300,null,'available',false,'2026-07-23T09:00:00Z'),
  ('7845621','dhiraagu','silver','{}'::text[],200,180,'available',false,'2026-07-26T09:00:00Z'),
  ('7867234','dhiraagu','silver','{}'::text[],275,null,'available',false,'2026-07-28T09:00:00Z'),
  ('7891023','dhiraagu','silver','{}'::text[],190,null,'sold',false,'2026-07-30T09:00:00Z'),
  ('7834567','dhiraagu','silver',array['Sequential']::text[],220,null,'available',false,'2026-08-05T09:00:00Z'),
  ('9999999','ooredoo','platinum',array['Repeating 9s','Triple 7']::text[],24000,null,'available',true,'2026-07-18T10:00:00Z'),
  ('9611111','ooredoo','gold',array['Repeating pair','Easy to remember']::text[],7500,null,'available',true,'2026-07-20T10:00:00Z'),
  ('9662299','ooredoo','gold',array['Mirror','Repeating pair']::text[],3400,null,'available',false,'2026-07-22T10:00:00Z'),
  ('9612345','ooredoo','gold',array['Sequential','Easy to remember']::text[],3000,2500,'sold',false,'2026-07-25T10:00:00Z'),
  ('9877887','ooredoo','gold',array['Mirror']::text[],4200,null,'available',true,'2026-07-27T10:00:00Z'),
  ('9700000','ooredoo','gold',array['Round number','Easy to remember']::text[],5800,null,'available',false,'2026-07-29T10:00:00Z'),
  ('9797979','ooredoo','gold',array['Alternating','Easy to remember']::text[],9000,null,'available',false,'2026-08-02T10:00:00Z'),
  ('9611221','ooredoo','gold',array['Repeating pair']::text[],2000,1700,'available',false,'2026-08-04T10:00:00Z'),
  ('9601234','ooredoo','silver',array['Sequential']::text[],320,null,'available',false,'2026-07-19T10:00:00Z'),
  ('9656789','ooredoo','silver',array['Sequential']::text[],260,null,'available',false,'2026-07-21T10:00:00Z'),
  ('9723456','ooredoo','silver',array['Sequential']::text[],300,null,'available',false,'2026-07-23T10:00:00Z'),
  ('9745621','ooredoo','silver','{}'::text[],210,null,'available',false,'2026-07-26T10:00:00Z'),
  ('9867234','ooredoo','silver','{}'::text[],280,null,'available',false,'2026-07-28T10:00:00Z'),
  ('9891023','ooredoo','silver','{}'::text[],195,null,'available',false,'2026-07-31T10:00:00Z'),
  ('9834567','ooredoo','silver','{}'::text[],230,null,'available',false,'2026-08-06T10:00:00Z')
on conflict (msisdn) do nothing;
