# Secret-scan findings triage (auto-generated)

GeneratedAt: 2026-04-30T04:32:00Z
Source: tools/registry/runs/GUARD_11_SECRET_SCAN-20260430-013027/issues.csv

Summary:
- Findings: 2 (both flagged as `Possible password assignment found`)
- Files flagged:
  - .agents/skills/nodejs-backend-patterns/SKILL.md
  - .agents/skills/nodejs-backend-patterns/references/advanced-patterns.md

Investigation & Rationale:
- Both findings occur inside example code blocks demonstrating best-practice patterns (database connection config, example DI container, and auth service snippets).
- The flagged tokens are not literal secrets (no hard-coded passwords or keys); they are variable names referencing `process.env.*` and example placeholders used for documentation.

Recommended action:
1. Classify these two findings as FALSE_POSITIVE and record that outcome in the evidence package.
2. Update guard rules to ignore code-fenced blocks in Markdown when scanning for secrets, or to prefer detection only on obvious literal secrets (e.g., long base64 strings, private keys, or non-environment-literal assignments).
3. No content edits are required for the two files; add this triage note to the proposed evidence bundle for owner sign-off.

Next step: after owner confirmation, mark these two findings as closed and re-run guards to reflect the accepted false-positive classification.

-- End of triage note --
