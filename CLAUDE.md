# SUPER STRICT RULE — TEST EMAIL WHITELIST

**No email leaves the TEST environment unless the recipient is a row in
`api."tblEmailWhitelistForComms"`.** Set by Isaac, 2026-08-31. No exceptions.

This repo is deployed twice — `fcu-application-api.vercel.app` (**test**) and
`fcu-portal-api-prod.vercel.app` (production). Its recipients are real members'
addresses submitted through the loan and membership applications.

## When you build anything that sends

Call `checkEmailRecipients([...])` from `@/lib/email-guard/test-whitelist`
immediately before the send, passing **every** recipient (To, Cc, Bcc), and
return 400 without sending when it refuses.

**It goes through an RPC, not a table read, and that is deliberate.** This app
holds only the ANON key (`NEXT_PUBLIC_*`, public by construction), and the `api`
schema correctly revokes anon's grants on `tblEmailWhitelistForComms` — which
holds staff email addresses and mobile numbers. So the guard calls
`api.fn_email_is_whitelisted(text)`, a SECURITY DEFINER function that answers
"may I email this address I already have?" without exposing or allowing
enumeration of the list. Created by
`lib/email-guard/migration-email-whitelist-rls.sql`.

**Do not branch a send on `getEmailWhitelist()`.** It returns `undefined` for
both a query error and an empty table, and every caller wrote
`if (list && !list.includes(to))` — which skips the check entirely in exactly
those cases. That is a whitelist that stops protecting you the moment the
database is unhappy. It is kept only as a plain read for diagnostics.

**Never add a hardcoded list of addresses.** `utils/emailWhitelist.ts` was one;
this estate has had three divergent copies of the list at once. The table is the
single copy, edited in the staff portal at `/admin/platform/email-whitelist`
(DATAINNOV only).

## How it behaves

- Environment comes from `getSchemaToUse()`: `fcu-portal-api-prod.vercel.app`
  passes through, everything else — including this deployment and any host
  nobody has thought of — is gated.
- It **fails closed**: an unreadable or empty whitelist blocks the send.
- Matching normalises case, whitespace and display-name form. Four of the
  seventeen rows carry mixed casing, and the old exact-match `includes()`
  refused those people with an error that explained nothing.

`lib/email-guard/test-whitelist.ts` mirrors the staff portal, the loan
application, the Loan Status Hub and the mobile auth service. Keep the behaviour
identical.
