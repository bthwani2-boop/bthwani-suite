# 03_SCREEN_RATIONALIZATION_REPORT

## Executive Verdict

The DSH Phase 12 inventory is complete at current service scope.

## Completeness Verdict

- all in-scope current-service candidates implied by Phase 10 and Phase 11 are cataloged
- all current in-scope surfaces are covered: `app-client`, `app-partner`, `app-captain`, `control-panel`, and optional `app-field`
- `webapp` and `website` correctly produce no current DSH Phase 12 candidates because they remain outside current service ownership
- donor spillover is not ignored; it is explicitly classified as merged, converted, internal, or moved to legacy or future scope

## Decision Summary

- `Keep`: 19
- `Merge`: 5
- `Convert`: 10
- `Internal`: 1
- `Move to Legacy`: 8

## What Is Kept

- one customer entry and discovery family
- one customer cart family and one checkout confirm family
- one customer active tracking family plus explicit proxy screens
- one partner orders board and one partner order workspace
- one partner store maintenance workspace
- one captain offers list and one captain execution workspace
- one captain proof capture screen
- one field activation workspace
- one internal ops board, one internal order detail exception workspace, and one peak mode control screen
- one proxy requests list and one proxy review workspace in control-panel

## What Is Merged

- donor client discovery sprawl is merged into a single entry family plus a single detail family
- donor partner order step screens are merged into one partner order workspace
- donor captain order step screens are merged into one captain execution workspace
- donor ops entry surfaces are merged into one ops board
- donor proxy detail and estimate or offer split screens are merged into one proxy review workspace

## What Is Converted

- chat across customer, partner, and captain becomes companion sheets rather than primary screens
- checkout block and cancelled terminal become state-level presentations rather than standalone screens
- partner handoff becomes an inline step inside the partner order workspace
- captain reject becomes an inline step inside the captain execution workspace
- field geo pin and visit log become companions of the field activation workspace
- proxy scheduling becomes a companion of the proxy review workspace

## What Stays Internal

- the partner order issue queue remains an internal operational screen because it exists only for exception handling and does not define the primary journey

## What Moves Out Of Current Service Scope

- customer loyalty, subscription, favorites, promo, receipt, rating, reviews, profile, and preferences clusters do not belong to the current DSH first-service journey
- partner subscription, analytics, identity, intake, staff, document, and nomination clusters do not belong to the current DSH first-service journey
- captain finance, wallet, payments, settlements, earnings history, and tier clusters do not belong to the current DSH first-service journey
- control-panel spillover such as store items admin, zone admin, and arrival bell settings does not belong to the current DSH operational inventory

## Anti-Pattern Prevention

- do not let donor auto-generated route count define the clean screen count
- do not hide secondary and exception companions just because the mainline path is shorter
- do not let control-panel absorb partner or captain execution screens
- do not let finance-adjacent donor screens leak into DSH screen truth

## Final Rationalization Verdict

- verdict: `ACCEPT_PHASE_12_FULL_SERVICE_INVENTORY`
- next allowed: `Phase 13 - Canonical Families And Screen Purpose Lock`