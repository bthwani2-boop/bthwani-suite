# BTH Token Rename & Alias Policy

This policy applies whenever a rename, refactor, cleanup, or normalization touches tokens containing `Bth`, `bth`, or `BTH`.

## Required workflow

1. Work one file at a time.
2. Analyze the target file and all affected usages, imports, exports, references, and consumers.
3. Classify every candidate token as `safe internal`, `public/shared`, `brand/package/repo`, `live dependency`, or `ambiguous/mixed-scope`.
4. Decide for each token: `direct rename`, `rename with alias`, `proposal only`, or `skip`.
5. Create a backup or reversible snapshot before applying changes.
6. Apply replacements with whole-token boundaries only.
7. Verify the touched scope immediately.
8. Roll back immediately if verification fails.
9. Mark the file closed only after clean verification and zero unintended diff.

## Direct rename gate

A token may be renamed directly only when evidence proves it is local/internal, non-brand, non-package, non-repo-facing, non-public, non-consumer-facing, non-ambiguous, and mapped to exactly one clear replacement.

## Alias gate

- Do not add aliases for purely internal safe renames.
- Add an alias only when public API, shared exports, external consumers, or live dependencies would otherwise break.
- Do not remove an alias in the same step by default.
- Remove an alias only in a later verified cleanup step after the old name is proven unused everywhere except the alias itself.

## Hard stops

- Never run blind global replace.
- Never rename brand, package, or repo identifiers unless explicitly approved.
- Never auto-rename mixed-scope or ambiguous tokens.
- Never break public API without an explicit compatibility plan.
- If certainty is incomplete, switch to analysis or proposal only.

## Short card

BTH rename rule:
Never do blind global replace.
Handle `Bth`/`bth`/`BTH` renames file-by-file only.
Analyze -> classify -> decide -> backup -> apply whole-token replace only -> verify -> rollback on failure.
Direct rename is allowed only for proven local/internal, non-brand, non-public, non-consumer-facing, non-ambiguous tokens with one clear replacement.
Add alias only when compatibility is needed.
Remove alias only in a later verified cleanup step after zero remaining dependency on the old name is proven.
If certainty is incomplete, do not apply.
