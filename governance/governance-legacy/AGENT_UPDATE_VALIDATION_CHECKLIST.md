---
generatedFrom: governance/AGENT_UPDATE_VALIDATION_CHECKLIST.md
generatedAt: 2026-04-30T04:48:37.2725702+03:00
note: AUTO-GENERATED DRAFT - REVIEW REQUIRED BEFORE APPLY
---
# Extracted Legacy Governance — Agent Update Validation Checklist

Status: LEGACY_EXTRACTED_CANONICAL_REVIEW
Source: `docs/governance/AGENT_UPDATE_VALIDATION_CHECKLIST.md`
Source SHA256: `02060592cba9fe37a4f453c85a634cacbf2f1bbda270362872c372530c3e9bb1`
Extraction session: `FIX_LEGACY_EXTRACTED_METADATA_SAFE-20260429-220722`

## Extraction Rule

This file preserves rich content from docs/governance/ before the legacy root is deleted later.

This is not final canonical policy by itself. Any rule inside this extracted file must be promoted explicitly into a canonical governance file before it becomes active truth.

---
# Agent Update Validation Checklist

Use this checklist before accepting any update to:

- `.github/agents/**`
- `.github/skills/**`
- governance documents that directly regulate agent behavior

## Mandatory Gate

An update must not be accepted until every item below is checked.

- The triggering problem is concrete, current, and written in one clear sentence.
- The change solves a verified gap rather than adding speculative policy.
- The target file set is the smallest correct set.
- The wording is operational, specific, and not ornamental.
- The wording does not restate an existing rule under different phrasing.
- The wording does not contradict current repo sovereignty, ownership, target-fit, UX, or design laws.
- The wording does not silently widen product or repo scope.
- The wording does not promise impossible absolutes such as literal 100 percent perfection or zero-failure certainty.
- The change includes a concrete expected effect.
- The change has a rollback path.
- The change is recorded in `docs/governance/AGENT_CHANGE_LEDGER.md`.
- The changed files pass diagnostics or syntax validation appropriate to their format.

## Review Questions

Use these questions before final acceptance:

- Is this a real rule, or only a one-off observation?
- Is this better as a ledger note instead of a permanent policy?
- Does this reduce ambiguity, or only add more words?
- Does this tighten behavior, or only sound stricter?
- Would a future maintainer understand exactly when to apply this rule?
- If this rule is enforced literally, does it stay practical?

## Rejection Triggers

Reject or revise the update immediately if any of the following are true:

- duplicate rule detected
- contradiction detected
- vague language detected
- decorative non-operational language detected
- hidden scope expansion detected
- missing verification detected
- missing ledger entry detected
- no rollback path exists

