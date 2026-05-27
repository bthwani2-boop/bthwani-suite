# Platform Control Plane Governance

## 1. Sovereignty and Purpose

The Platform section (`control-panel/runtime/app/platform/`) is the sovereign control plane of the BThwani DSH architecture.
It is designated strictly for the highest administrative authority to oversee and manage:

- Service state (Activation, Kill Switch, Maintenance)
- Visibility (Internal vs. Public)
- Sovereign Operational Variables (Vars)
- Infrastructure Providers & Secrets
- Central App Appearance & Visual Identity
- Rollouts, Health Monitoring, and Audit/Rollbacks.

Access to Platform is controlled by Administration (`/administration`), not by Platform itself.

## 2. Boundaries and Separation of Concerns

The Platform MUST NOT leak into or manage the daily operations of specialized domains:

- **Catalogs**: Managed independently. The Platform does not manage categories, products, or tags.
- **Marketing**: Managed independently. The Platform does not create or manage campaigns, offers, or banners.
- **Administration**: Managed independently. The Platform does not manage individual user accounts or roles; it relies on them for access control.

## 3. Strict UI/UX and Implementation Rules

- **No Secrets in Code**: API keys and provider credentials must never be hardcoded or visible. UI must use `••••••••` masking and rely on a secure secret manager backend (when implemented).
- **Demo Mode Rule**: During the UI/UX design and preview phases, the interface operates exclusively in Demo Mode. Interaction is strictly local (React state simulation) with NO runtime mutations, NO real API calls, NO secrets handling, and NO real database or env writes. Every sensitive action requires a confirmation modal displaying impact and a mock audit entry. Local rollback must be supported. No demo results should be interpreted as operational truths.
- **Systematic Appearance**: Visual identities are governed by the central `@bthwani/ui-kit` design tokens. No hardcoded hex values or random colors are permitted in the control plane overrides.
- **Human-Centric Design**: Control plane interfaces should be designed for human operators making critical business decisions, not as raw data dumps or technical JSON viewers. Focus on Impact, Scope, Risk, and Rollback capabilities.

## 4. Platform > Services Boundary

**Platform > Services controls top-level platform services only: DSH, KNZ, WLT, AMN, ARB, MRF, KWD, SND, ESF.**

Sub-capabilities inside a service — such as Awnak (عونك), Shein (شي إن), Store Pickup, or Scheduled Orders under DSH — are controlled through service vars, rollouts, or future service-specific capability controls. They must NOT appear as top-level platform services.

Correct placement:

- `Platform > Vars` — configure capability feature flags (e.g. `DSH_CAPABILITY_AWNAK_ENABLED`)
- `Platform > Rollouts` — gradual activation of a capability within a service (labeled as "capability-level rollout")
- `DSH-specific controls` — future deep-dive panels per service

The guard (`08_GUARDS/platform-control-plane-uiux.guard.mjs`) enforces this boundary automatically and will fail if awnak, shein, store-pickup, scheduled-orders, or "DSH Delivery" appear as top-level service definitions in the Services workspace.

## 5. Captain Wallet-Balance Eligibility Rule

**Captain eligibility is defined as a wallet-balance threshold, NOT a star rating.**

The minimum wallet balance a captain must maintain to remain eligible to receive orders is:
- Owned by: **WLT** (source of financial truth)
- Consumed by: **DSH** (operational enforcement)
- Configured via: **Platform > Vars** (VAR_DSH_CAPTAIN_MIN_WALLET_BALANCE)
- Scope: Global / City / Zone

Labels, audit entries, and UI copy must use the wording **"حد رصيد محفظة الكابتن للأهلية"** or equivalent wallet-balance language. Using decimal star-rating values (like 4.5, 4.2) is prohibited and will cause the guard to fail.

No change to this threshold may proceed without:
1. Finance Approver sign-off (WLT-owned)
2. Impact assessment showing projected change in eligible captain count
3. Scope definition (Global / City)
4. Audit entry with before/after values in local currency (ريال)
5. Rollback target specified

## 6. Administration Section Boundary

The Administration section (`control-panel/runtime/app/administration/`) is responsible for:

- Defining roles: Super Admin, Platform Governor, Platform Approver, Platform Operator, Finance Approver, Viewer.
- Assigning users to roles.
- Defining the permission matrix for Platform access.
- Defining the approval chain for Platform changes.
- Determining who can: View Platform / Request Change / Approve Change / Apply Demo / Rollback / Manage Providers / Manage Appearance / Manage Services / View Audit.

Administration DOES NOT:
- Stop or start any platform service.
- Modify any sovereign variable.
- Activate or deactivate any provider.
- Change application appearance.
- Manage catalogs, marketing campaigns, or daily operations.

The Administration screen must be rendered in `ControlPanelSurfaceHost` when `activeSectionId === 'administration'`. The guard enforces this.

## 7. Audit and Rollback Enforcements

Every state mutation inside the Platform Control Plane must record:

- The Operator (Owner)
- The Reason for the change
- Before & After states
- Scope (Geographical or User Segment)
- Impact Assessment
- Rollback target

No service can be disabled without an impact assessment, and no provider activated without a successful test.

## 8. Evidence Standard

No change is considered DONE without:
- A diff showing the actual change
- Guard passing (`node tools/guards/platform-control-plane-uiux.guard.mjs`)
- Targeted typecheck for the affected control-plane project/path when justified; workspace `tsc` only for high-risk, release, broad architecture, or explicit human request
- No PASS / CLOSED / 100% claims without supporting evidence
