# DSH donor intake script pack

## Purpose
This pack creates DSH-specific donor-intake scripts under:
`C:\Users\b\Documents\GitHub\bthwani-suite\tools\scripts`

## Generated scripts
- CHECK_ANALYZE_DSH_DONOR_SERVICE_INTELLIGENCE.ps1
- APPLY_FREEZE_DSH_DONOR_INTELLIGENCE_MIRROR.ps1
- APPLY_BUILD_DSH_SERVICE_INTELLIGENCE_PACK.ps1
- CHECK_ANALYZE_DSH_SERVICE_DRIFT.ps1
- APPLY_BUILD_DSH_REBUILD_QUEUE.ps1
- CHECK_VERIFY_DSH_LEGACY_LEAK_GUARD.ps1

## Run order
1. CHECK_ANALYZE_DSH_DONOR_SERVICE_INTELLIGENCE.ps1
2. APPLY_FREEZE_DSH_DONOR_INTELLIGENCE_MIRROR.ps1
3. APPLY_BUILD_DSH_SERVICE_INTELLIGENCE_PACK.ps1
4. CHECK_ANALYZE_DSH_SERVICE_DRIFT.ps1
5. APPLY_BUILD_DSH_REBUILD_QUEUE.ps1
6. CHECK_VERIFY_DSH_LEGACY_LEAK_GUARD.ps1

## Notes
- Every script is PowerShell-only and self-contained.
- Evidence is written under:
  `C:\Users\b\Documents\GitHub\bthwani-suite\tools\registry\runs\{SESSION_ID}\`
- Scripts do not auto-close the terminal.
