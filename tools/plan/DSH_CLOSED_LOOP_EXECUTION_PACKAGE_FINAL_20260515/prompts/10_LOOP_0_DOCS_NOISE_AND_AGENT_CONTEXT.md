# LOOP 0 — Docs Noise Control + Agent Context

## Objective

Create the DSH closed-loop operating context and docs-noise plan. Do not touch source screens.

## Allowed writes only

```text
dsh/docs/closure/DSH_AGENT_CONTEXT.md
dsh/docs/closure/DSH_CLOSURE_RULES.md
dsh/docs/closure/DSH_DOCS_NOISE_REDUCTION_PLAN.md
dsh/docs/closure/DSH_LOOP_0_EVIDENCE.md
dsh/docs/closure/DSH_NEXT_LOOP_PLAN.md
```

No other files.

## Required outputs

### 1. `DSH_AGENT_CONTEXT.md`

Must include:
- current phase: UI/UX Flow Logic Closure, not final visual design,
- world-class delivery platform target,
- Field partner onboarding/activation only,
- WLT owns money,
- app shells own mounting/bootstrap only,
- UI kit owns reusable design system,
- DSH owns service UI/UX flow,
- control-panel sections involved: operations, partners, marketing, finance, support, catalogs,
- OpenAPI is not first; Screen/API Matrix precedes contract edits,
- no final closure without evidence/screenshots.

### 2. `DSH_CLOSURE_RULES.md`

Must define:
- closed-loop execution,
- screen grouping law,
- no screen-per-block,
- no god screen,
- lifecycle coverage,
- manual/auto assignment coverage,
- messaging coverage,
- WLT settlement ownership,
- exception coverage,
- docs noise control,
- status vocabulary.

### 3. `DSH_DOCS_NOISE_REDUCTION_PLAN.md`

Must classify current:
```text
dsh/SERVICE_BLUEPRINT.md
dsh/docs/**
```

Use classifications:
```text
KEEP_SHORT_INDEX
MERGE_INTO_CLOSURE
ARCHIVE_CANDIDATE
DELETE_CANDIDATE
DO_NOT_TOUCH
TBD
```

Do not archive or delete in this loop.

### 4. `DSH_LOOP_0_EVIDENCE.md`

Record:
- files created/updated,
- files intentionally not touched,
- forbidden scope not touched,
- blockers,
- next loop readiness.

### 5. `DSH_NEXT_LOOP_PLAN.md`

Define Loop 1 inventory plan.

## Verification

Run:
```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --check
git ls-files --others --exclude-standard
```

## Final response

Use only:
```text
DONE_LOCAL
BLOCKED
NEEDS_NEXT_LOOP
```

Do not claim final closure.
