Proposed canonical merge skeletons — review only

Location: `kdt/merge-run/2026-04-30T01-17-17-530Z/proposed/`

This folder contains:
- `manifest.json` — machine-readable map of proposed canonical files and their source members.
- `canonical/` — per-canonical skeleton files summarizing the grouping and suggested next steps.
- `apply-proposal.ps1` — helper script to print the plan (dry-run). It does NOT modify `governance/` unless you run it with the explicit `-Execute` flag after review.

Important: do NOT run any apply step until each canonical file has been manually reviewed and explicitly approved. This repository's governance rule requires human sign-off for destructive or merging operations.

Suggested review flow:
1) Open `manifest.json` and check the group mappings.
2) Open and review each file under `canonical/` and comment/approve.
3) When all canonical files are approved, request an actual apply (non-dry-run) or ask me to create a PR with the proposed canonical files and archived originals.

If you want, I can now summarize each proposed canonical file one-by-one or generate a PR-ready patch bundle.
