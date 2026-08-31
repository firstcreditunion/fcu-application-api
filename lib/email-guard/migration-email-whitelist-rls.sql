-- api.fn_email_is_whitelisted — the TEST send-whitelist check this app needs.
--
-- 🔴 RUN THIS. Until it is applied, `checkEmailRecipients` cannot get an answer
--    and therefore BLOCKS EVERY test confirmation email. That is the correct
--    failure direction, but it means testers stop receiving mail. What it
--    replaced was worse: the old gate has been INERT (see below), so those
--    emails were going out unchecked.
--
-- Run in the Supabase SQL editor for project hojrhcbubaafsqjqvezq — the
-- estate's established mechanism (there is no CLI push and `supabase/migrations`
-- is unused; see the header of lib/actions/supabase/admin-audit/
-- migration-tblAdminAuditLog.sql in the staff portal).
--
-- The companion that hardens the schemas themselves —
-- migration-email-whitelist-rls.production.sql in the staff portal's
-- lib/actions/supabase/parity/ — is a separate file because production-schema
-- DDL lives with the portal's parity trail, which is where anyone hardening
-- production will look. Run both.
--
-- Idempotent; safe to re-run.


-- WHY A FUNCTION AND NOT A GRANT. This app reads Supabase with the ANON key —
-- `NEXT_PUBLIC_SUPABASE_ANON_KEY`, public by construction. The `api` schema has
-- (correctly) revoked anon's grants on "tblEmailWhitelistForComms", which holds
-- staff email addresses and mobile numbers; verified 2026-08-31, anon SELECT
-- returns 42501. Granting anon SELECT to make the guard work would publish that
-- list to anyone holding a key that ships in a browser bundle.
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
  'TEST send whitelist check. Returns true when the address is in api."tblEmailWhitelistForComms" (case- and whitespace-insensitive). SECURITY DEFINER so the anon-key caller (fcu-application-api) can ask the question without being able to read, or enumerate, the list itself.';

revoke all on function api.fn_email_is_whitelisted(text) from public;
grant execute on function api.fn_email_is_whitelisted(text) to anon, authenticated, service_role;


-- VERIFY
--
--   select api.fn_email_is_whitelisted('isaac.vicliph@firstcu.co.nz');   -- t
--   select api.fn_email_is_whitelisted('ISAAC.VICLIPH@firstcu.co.nz ');  -- t
--   select api.fn_email_is_whitelisted('a.stranger@example.com');        -- f
--
-- Then confirm the table itself is STILL closed to the public key — the whole
-- point of doing this with a function:
--
--   curl -s "$SUPABASE_URL/rest/v1/tblEmailWhitelistForComms?select=email_address" \
--     -H "apikey: $ANON" -H "Authorization: Bearer $ANON" \
--     -H "Accept-Profile: api"                            # expect 42501
