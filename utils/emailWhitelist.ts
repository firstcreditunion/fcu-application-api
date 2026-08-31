/**
 * RETIRED — do not use, do not re-add addresses here.
 *
 * A hardcoded copy of the TEST send whitelist. It has no remaining callers, and
 * it must not gain any: a list in code needs a deploy to change, so it drifts
 * from `api."tblEmailWhitelistForComms"` the moment a new tester is added, and
 * the failure mode is silent — the person simply never receives the mail and
 * concludes the feature is broken. This estate has already had three divergent
 * copies of this list at once.
 *
 * The live control is `@/lib/email-guard/test-whitelist.ts`, reading the table.
 * The list is edited in the staff portal at /admin/platform/email-whitelist
 * (DATAINNOV only).
 *
 * Kept as a tombstone rather than deleted so anyone who finds a reference in an
 * old branch or a code search lands on this explanation.
 */
export const emailWhiteListForComms: readonly string[] = []
