-- TEST send whitelist — the RPC this app needs, and the lockdown of the
-- production twin.
--
-- 🔴 RUN THIS. Until part 1 is applied, `checkEmailRecipients` cannot get an
--    answer and therefore BLOCKS EVERY test confirmation email — which is the
--    correct failure direction, but it means testers stop receiving mail. What
--    it replaced was worse: the old gate has been inert (see below), so those
--    emails were going out unchecked.
--
-- Run in the Supabase SQL editor for project hojrhcbubaafsqjqvezq.
-- Idempotent; safe to re-run.


-- ─────────────────────────────────────────────────────────────────────────────
-- PART 1 — api.fn_email_is_whitelisted
--
-- WHY A FUNCTION AND NOT A GRANT. This app reads Supabase with the ANON key —
-- `NEXT_PUBLIC_SUPABASE_ANON_KEY`, public by construction. The `api` schema has
-- (correctly) revoked anon's grants on "tblEmailWhitelistForComms", which holds
-- staff email addresses and mobile numbers. Granting anon SELECT to make the
-- guard work would publish that list to anyone holding a key that ships in a
-- browser bundle.
--
-- A SECURITY DEFINER function answers the only question the guard actually asks
-- — "may I email THIS address, which I already have?" — without exposing the
-- list. There is no enumeration: the caller must already know the address, and
-- gets back a bare boolean.
--
-- The alternative, if you would rather not add a function, is to put a
-- service-role/secret key in this app's Vercel environment and read the table
-- directly, the way the staff portal, the loan app, the Hub and the mobile auth
-- Lambda all do. That needs an env var on the deployment; this needs neither.
--
-- `set search_path = ''` with fully-qualified names: a SECURITY DEFINER function
-- runs with the owner's rights, so a mutable search_path would let a caller who
-- can create objects shadow the table reference.

create or replace function api.fn_email_is_whitelisted(p_email text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from api."tblEmailWhitelistForComms"
    where lower(btrim(email_address)) = lower(btrim(p_email))
  );
$$;

comment on function api.fn_email_is_whitelisted(text) is
  'TEST send whitelist check. Returns true when the address is in api."tblEmailWhitelistForComms" (case- and whitespace-insensitive). SECURITY DEFINER so the anon-key callers (fcu-application-api) can ask the question without being able to read, or enumerate, the list itself.';

revoke all on function api.fn_email_is_whitelisted(text) from public;
grant execute on function api.fn_email_is_whitelisted(text) to anon, authenticated, service_role;


-- ─────────────────────────────────────────────────────────────────────────────
-- PART 2 — lock down production."tblEmailWhitelistForComms"
--
-- The `api` copy is already closed to anon (verified 2026-08-31: both SELECT and
-- INSERT return 42501). The PRODUCTION twin is not. It was created by
-- migration-parity-batch4.production.sql with four `using (true)` policies and
-- INSERT/SELECT grants to anon, and it is reachable with the public anon key —
-- verified by probing it on 2026-08-31 (the probe row was inserted successfully
-- and then deleted).
--
-- The table holds 0 rows and nothing reads it: the production API's whitelist
-- path only runs when `getSchemaToUse() === 'api'`, which never happens on the
-- production host. So it is a writable, readable, unused table hanging off the
-- public key — pure liability. If a whitelist is ever wanted on production, the
-- grants should be added back deliberately, to service_role only.

revoke all on table production."tblEmailWhitelistForComms" from anon;
revoke all on table production."tblEmailWhitelistForComms" from authenticated;

alter table production."tblEmailWhitelistForComms" enable row level security;

drop policy if exists "Select for Anon" on production."tblEmailWhitelistForComms";
drop policy if exists "Insert for Anon" on production."tblEmailWhitelistForComms";
drop policy if exists "Update for Anon" on production."tblEmailWhitelistForComms";
drop policy if exists "Delete for Anon" on production."tblEmailWhitelistForComms";

-- service_role bypasses RLS, so no replacement policy is needed for the portal.
grant all on table production."tblEmailWhitelistForComms" to service_role;


-- ─────────────────────────────────────────────────────────────────────────────
-- VERIFY
--
--   -- 1. the function answers, and does not leak the list
--   select api.fn_email_is_whitelisted('isaac.vicliph@firstcu.co.nz');  -- t
--   select api.fn_email_is_whitelisted('ISAAC.VICLIPH@firstcu.co.nz '); -- t
--   select api.fn_email_is_whitelisted('a.stranger@example.com');       -- f
--
--   -- 2. anon holds nothing on either table
--   select grantee, privilege_type
--   from information_schema.role_table_grants
--   where table_name = 'tblEmailWhitelistForComms'
--     and grantee in ('anon','authenticated')
--   order by table_schema, grantee;          -- expect zero rows
--
--   -- 3. no permissive anon policies survive on the production twin
--   select policyname, roles, cmd
--   from pg_policies
--   where schemaname = 'production'
--     and tablename = 'tblEmailWhitelistForComms';   -- expect zero rows
--
-- Then, from a shell, confirm the public key really is shut out:
--
--   curl -s "$SUPABASE_URL/rest/v1/tblEmailWhitelistForComms?select=email_address" \
--     -H "apikey: $ANON" -H "Authorization: Bearer $ANON" \
--     -H "Accept-Profile: production"                    # expect 42501
