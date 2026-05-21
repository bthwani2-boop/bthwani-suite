# DSH Phase 4 Forensic Logic Review

## Decision
**FIX_REQUIRED_BEFORE_FINAL_LOGIC_CLOSURE**

Phase 4 made major progress and is valid as a control-panel governance expansion, but DSH is **not** closed 100% yet.

## Evidence inspected
- Repository snapshot: `bthwani-suite-ghb-0163-20260521-055416-gitattributes-dsh (4).zip`
- Phase 4 evidence: `DSH_PHASE_4_CONTROL_PANEL_MASTER_LOGIC-20260521-084608.zip`

## Numeric findings
| Metric | Value |
|---|---:|
| DSH frontend app-client files | 48 |
| DSH frontend app-partner files | 27 |
| DSH frontend app-captain files | 22 |
| DSH frontend app-field files | 25 |
| DSH control-panel files | 123 |
| DSH shared files | 23 |
| WLT frontend files inspected by scope | 65 |
| Phase 4 changed files | 39 |
| Control-panel changed files | 25 |
| App-partner changed files | 5 |
| App-client changed files | 3 |
| App-captain changed files | 3 |
| App-field changed files | 3 |
| Registry entries | 40 |
| Registry duplicate IDs | 0 |
| Registry primary flows | 24 |
| Registry contextual flows | 7 |
| Registry hidden-compat flows | 8 |
| Registry internal flows | 1 |
| Registry financial-impact flows | 3 |
| Registry escalation-owner flows | 26 |
| Governance sections mapped | 8 |
| Runtime control-panel pages present | 12 |
| Direct Tamagui imports in dsh/frontend | 0 |
| Mobile imports from control-panel/shared | 14 |
| TODO markers | 0 |
| FIXME markers | 0 |
| TBD markers in dsh/frontend | 44 |

## What is now good
1. `DSH_CONTROL_PANEL_GOVERNANCE_MAP` exists and covers 8 sections: operations, support, finance, catalogs, partners, marketing, platform, administration.
2. Control-panel runtime has root pages for operations, support, finance, catalogs, partners, marketing, platform, administration.
3. Phase 4 evidence says these sections are root registered and host reachable.
4. Phase 4 touched all four mobile surfaces and added owner/backlink notes.
5. Finance mutation safety is preserved in the Phase 4 evidence.
6. Hidden-compat is not reported as rendered primary.
7. TypeScript and guard evidence files are clean/empty where expected, and guard outputs show PASS.

## Blockers to final logic closure
### BLOCKER-1 — Mobile surfaces import control-panel internals
14 mobile files import from `../../control-panel/shared`:

- `dsh/frontend/app-client/screens/CartScreen.tsx`
- `dsh/frontend/app-client/screens/OperationScreens.tsx`
- `dsh/frontend/app-client/screens/OrdersTrackingScreens.tsx`
- `dsh/frontend/app-partner/screens/DshPartnerStoreCourierScreen.tsx`
- `dsh/frontend/app-partner/screens/InventoryCatalogScreen.tsx`
- `dsh/frontend/app-partner/screens/PartnerHubScreen.tsx`
- `dsh/frontend/app-partner/screens/PartnerSupportScreen.tsx`
- `dsh/frontend/app-partner/screens/PromotionsScreen.tsx`
- `dsh/frontend/app-captain/screens/DshCaptainOperationsScreen.tsx`
- `dsh/frontend/app-captain/screens/DshCaptainPickupDropoffScreen.tsx`
- `dsh/frontend/app-captain/screens/DshCaptainPoDSubmissionScreen.tsx`
- `dsh/frontend/app-field/screens/DshFieldReadinessEscalationScreen.tsx`
- `dsh/frontend/app-field/screens/DshFieldStoreOnboardingScreen.tsx`
- `dsh/frontend/app-field/screens/DshFieldStoreVisitScreen.tsx`

This creates a cross-surface dependency from mobile to control-panel. The logic is conceptually correct, but the ownership location is wrong. Cross-surface governance data must live in `dsh/frontend/shared`, not under `dsh/frontend/control-panel/shared` if mobile consumes it.

### HIGH-1 — Governance map is named and located as control-panel-only while used system-wide
The map represents system governance, not a control-panel component. It should be moved or mirrored to a shared owner:

Recommended canonical owner:
`dsh/frontend/shared/dsh-governance.map.ts`

Control-panel can re-export it from `control-panel/shared/index.ts` for compatibility, but mobile must import from shared.

### HIGH-2 — No dedicated guard exists for mobile → control-panel imports
Existing guards passed, but they did not catch the 14 imports above. A final closure gate must include a local evidence check that fails if any `dsh/frontend/app-*` imports `dsh/frontend/control-panel/**`.

### HIGH-3 — Several active governance notes are still evidence-only, not enforceable
Phase 4 added strong labels/notes. Final closure should convert critical logic to reusable shared helpers where possible:
- section label resolution
- section-by-flow resolution
- surface-to-owner resolution
- financial reference safety
- hidden/internal visibility safety

### MEDIUM-1 — Legacy/control folder remains present but appears non-mounted
`dsh/frontend/control-panel/control/` exists and is documented as a legacy/control area in earlier docs. It should not be deleted blindly, but final closure should classify it explicitly as legacy/not mounted/keep-or-archive candidate.

### MEDIUM-2 — UI/design evidence intentionally remains pending
The Phase 4 summary says screenshots were not produced. Since the user plans visual/design review later, this does not block logic-only continuation, but it blocks any claim of complete product closure.

## Answer to the user's questions
### هل أصبح كل شيء يعمل كمنظومة متكاملة؟
**جزئيًا نعم، نهائيًا لا.**
The system now has a governance map and cross-surface owner links, but final logic closure is blocked by mobile importing control-panel internals.

### هل كل الشاشات التي نحتاجها موجودة؟
**Core section roots are present, but not fully proven as final.**
Operations/support/finance/catalogs/partners/marketing/platform/administration exist as control-panel roots, and all four mobile apps were touched. However, final screen completeness needs a route-to-screen matrix after the cross-surface dependency fix.

### ماذا يتبقى؟
One final logic phase before design review:
1. Move shared governance ownership out of control-panel internals.
2. Remove all mobile imports from `control-panel/shared`.
3. Add a closure evidence gate that proves no cross-surface dependency leakage.
4. Generate final route/screen/flow/governance matrix.
5. Keep screenshots for the later design-review stage.
