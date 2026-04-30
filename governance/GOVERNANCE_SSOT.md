---
generatedFrom: governance/GOVERNANCE_SSOT.md
generatedAt: 2026-04-30T04:48:37.5746692+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Governance SSoT

Status: CANONICAL  
Version: 1.0.0  
Date: 2026-04-30  
Owner: BThwani Governance

## 1. Canonical repository

The active local repository is:

```text
C:\bthwani-suite
```

The active GitHub repository is:

```text
bthwani2-boop/bthwani-suite
```

No old standalone repo/path named `bth` is an active target.

Valid names that must be preserved:

```text
BThwani
bthwani-suite
@bthwani/*
bthwani2-boop/bthwani-suite
```

## 2. Canonical governance authority

`governance/` is the textual source of truth.

Executable tools may enforce governance, but they must not become a parallel policy source.

## 3. Canonical evidence root

```text
tools/registry/runs/<SESSION_ID>/
```

Any script that writes evidence there should include:

```text
summary.txt
evidence.json
command-log.txt
git-status.txt
diff-check.txt
_HANDOFF.zip
```

## 4. Canonical architecture rule

```text
Screen / Surface / App
→ @bthwani/ui-kit public exports
→ Tamagui internally inside ui-kit only
```

## 5. Canonical visual identity

```text
deepBlue: #0A2F5C
orange:   #FF500D
white:    #FFFFFF
```

The UI standard is:

```text
Premium 2026
RTL-correct
low-noise
cohesive
modern
practical
clear
elegant
```

## 6. Canonical service catalog

Canonical service slugs:

```text
dsh
wlt
knz
arb
amn
esf
mrf
snd
kwd
```

Not canonical standalone services:

```text
exchangeprice
hr
```

`exchangeprice` is not a standalone service. Exchange-rate behavior belongs under WLT when proven.

`hr` is an internal/control-panel domain, not one of the canonical platform service slugs.

## 7. Status vocabulary

Allowed status terms:

```text
CANONICAL
CURRENT
LEGACY
TRANSITIONAL
TBD
UNPROVEN
VERIFIED
CLOSED
BLOCKED
DEPRECATED
REJECTED
DELETE_CANDIDATE
MERGE_CANDIDATE
PASS
PASS_WITH_WARNINGS
FIX_REQUIRED
READY_FOR_PR
REVERT_REQUIRED
NEEDS_EVIDENCE
NEEDS_VISUAL_EVIDENCE
```

## 8. No assumption rule

Anything not proven by repo files, terminal output, screenshots, runtime logs, tests, or evidence packs is `TBD` or `UNPROVEN`.

## 9. No silent delete rule

Do not delete, move, or rename files until:

1. references are scanned,
2. consumers are understood,
3. replacement is documented,
4. rollback is available,
5. evidence is captured.

