# PR-ready dry-run: Governance Canonicalization (draft)

GeneratedAt: 2026-04-30T04:40:00Z
Branch: governance/demo-service-pilot (dry-run)

Summary
- This is a non-destructive PR-ready dry-run proposal that consolidates the `governance/` corpus into canonical drafts under `proposed/canonical/`, provides a `PROTECTED_TOKENS_ALLOWLIST.md`, a `SECRET_SCAN_TRIAGE.md`, and a manifest of proposed file actions at `pr_changes.json`.

What this package contains (all non-destructive):
- `proposed/canonical/` — draft canonical files (first-pass; review required).
- `proposed/PROTECTED_TOKENS_ALLOWLIST.md` — top findings and allow/review recommendations.
- `proposed/SECRET_SCAN_TRIAGE.md` — triage for the 2 secret-scan warnings (recommended FALSE_POSITIVE).
- `proposed/pr_changes.json` — machine-readable manifest mapping `governance/*` → `proposed/canonical/*` (action: candidate).

How to review
1. Inspect the canonical drafts in `kdt/merge-run/.../proposed/canonical/`.
2. Review `PROTECTED_TOKENS_ALLOWLIST.md` and accept or mark items for remediation.
3. Confirm SECRET triage or edit the flagged code examples.

How to apply (owner sign-off required)
1. After human approval and remediation, run the included apply script in dry-run mode:  

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
powershell -NoProfile -ExecutionPolicy Bypass -File "kdt/merge-run/2026-04-30T01-17-17-530Z/proposed/apply-proposal.ps1" -DryRun
```

2. If dry-run output is acceptable and guards pass, request owner sign-off and then run without `-DryRun` to perform the canonicalization (this will copy canonical drafts into `governance/`, archive originals under `governance/archive/<timestamp>/`, and update manifest). DO NOT run non-dry-run without owner approval.

Notes on zero-defect requirement
- This package is intentionally non-destructive. Final destructive operations (archive + replace) will only occur after:
  - All guards report PASS or accepted warnings.
  - Secret findings are remediated or confirmed false-positives.
  - Owner explicit sign-off recorded in PR review.

Next suggested action for me (choose one):
- A: Create a git patch file for reviewer consumption and open a local PR branch (dry-run only).
- B: Auto-propose remediation edits for `REVIEW` files (redact placeholders) under `proposed/` for pre-approval.
- C: Stop and wait for your sign-off before any further changes.

-- End of PR description --
Proposed PR: Canonicalize governance files (review-only bundle)

Overview
- This PR-bundle proposes consolidating duplicate/overlapping governance docs into canonical files as mapped in `proposed/manifest.json`.
- Proposed canonical skeletons live under `proposed/canonical/` for human review.
- No `governance/` files have been modified by this agent; this bundle contains review artifacts and an evidence manifest.

Key artifacts
- Manifest: `proposed/manifest.json`
- Canonical skeletons: `proposed/canonical/*.md`
- Evidence summary: `proposed/evidence.json`
- Apply helper (dry-run): `proposed/apply-proposal.ps1`

Blocking findings (must be cleared before any non-dry-run apply)
1) Runtime smoke tests: `GUARD_09_RUNTIME_SMOKE_TEST` — DECISION: BLOCKED_BY_RUNTIME_SMOKE (10 errors). Action: inspect `tools/registry/runs/GUARD_09_RUNTIME_SMOKE_TEST-*/_HANDOFF.zip`, fix runtime failures, and re-run smoke tests.
2) Protected tokens scanning: `GUARD_BTHWANI_PROTECTED_TOKENS` — 945 warnings. Action: triage and redact secrets, or create owner-approved accept-list entries before public PR.
3) Secret-scan warnings: `GUARD_11_SECRET_SCAN` — 2 warnings. Action: remove/rotate secrets and re-run scan.
4) Tamagui import warnings: 4 warnings — triage per `TAMAGUI_INTEGRATION_LAW`.

Recommended next steps (safe, zero-defect path)
1) Resolve runtime smoke-test errors and secret/protected-token warnings.
2) Re-run guards: `node tools/guards/run-guards-affected.mjs`.
3) Re-run gov-dedup dry-run: `node tools/gov-dedup.js --root governance --out kdt/merge-run --mode apply --dry-run` to refresh merge-plan and evidence.
4) When all critical guards PASS or owner-approved exceptions exist, create a PR with:
   - canonical files placed into `governance/` (one commit)
   - originals moved to `governance/archive/<timestamp>/`
   - `proposed/evidence.json` attached
5) After PR approval and CI green, run non-dry-run apply.

Commands to re-run locally
```powershell
git status --porcelain --untracked-files=all
git --no-pager diff --check
node tools/guards/run-guards-affected.mjs
node tools/gov-dedup.js --root governance --out kdt/merge-run --mode apply --dry-run
```

Decision required from you (pick one)
- Approve: "Create PR now with current bundle" (I will prepare a PR-ready patch but NOT push). Recommended only after triage of blockers.
- Triage: "Help me resolve blockers first" — I can (A) run detailed logs extraction for runtime errors, (B) redact/provide remediation advice for token/secret warnings.
- Apply: "Run non-dry-run apply now" — I will NOT run this until you explicitly affirm after blockers cleared.

I recommend triage first (resolve runtime errors & secret/token issues), then create PR for human review. Tell me which decision to execute.
