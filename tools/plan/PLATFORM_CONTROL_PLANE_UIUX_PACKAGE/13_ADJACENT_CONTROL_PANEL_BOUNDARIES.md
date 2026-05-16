# 13 - Adjacent Control Panel Boundaries

## Purpose

This document defines the sovereign boundaries between Platform and its adjacent control sections: Catalogs, Marketing, and Administration. These are separate sections with separate responsibilities. Platform does not own or manage them.

---

## Role Definitions

### Platform

Platform is the **sovereign runtime control plane** for the entire DSH system. It is restricted to top-level authorized administrators only.

Platform owns:
- Service visibility and sovereign enablement (live / paused / internal / pilot / maintenance)
- Runtime sovereign variables (business rules, financial thresholds, feature flags)
- Central provider configuration (payments, SMS, maps, push, AI, etc.)
- Platform identity and app-wide color system (via design tokens)
- Rollout controls and kill switches
- Platform health and operational evidence
- Audit trail and rollback for sovereign changes

Platform does **not** manage daily content, product listings, campaigns, or user administration.

---

### Catalogs

Catalogs is the **taxonomy and content management section**. It manages what appears inside services after Platform has enabled them.

Catalogs owns:
- Service categories and subcategories
- Product and service listings
- Store/merchant catalog data
- Catalog display rules and ordering
- Content classification and labeling

Catalogs does **not** control service sovereign visibility. A category cannot appear to clients if Platform has disabled or hidden the parent service.

---

### Marketing

Marketing is the **campaigns, offers, and promotional section**. It operates on top of available services and products.

Marketing owns:
- Campaigns and promotional offers
- Banners and in-app promotional content
- Loyalty programs and subscription plans
- Seasonal and time-limited promotions
- Promotional targeting and segmentation

Marketing does **not** control the central platform identity or color system. It does not activate or deactivate services. It cannot override Platform kill switches or service visibility.

---

### Administration

Administration is the **access, roles, and permissions section**. It controls who can see, request, and approve changes across all sections including Platform.

Administration owns:
- User account management
- Role assignment and permission grants
- Platform access control (who can view Platform)
- Approval authority configuration (who approves sovereign changes)
- Audit of access events

Administration does **not** execute sovereign changes directly. It grants or revokes the authority to make changes. A user with an Administration-granted role then acts inside Platform.

---

## Ownership Matrix

| Domain | Owner | Notes |
|---|---|---|
| Service visibility / sovereign enablement | **Platform** | Platform decides if a service is live, paused, internal, or pilot |
| Service categories and subcategories | **Catalogs** | Catalogs manages taxonomy inside enabled services |
| Products and listings | **Catalogs** | Product data, not service enablement |
| Campaigns, offers, banners | **Marketing** | On top of Platform-enabled services only |
| Loyalty programs and subscriptions | **Marketing** | Unless platform governance says otherwise |
| User accounts and roles | **Administration** | Day-to-day user management |
| Platform access grants | **Administration** | Who can view/approve/act on Platform |
| Runtime sovereign variables | **Platform** | Business/financial/feature variables |
| Provider API key management | **Platform** | Central, masked, secured separately |
| Platform identity and central colors | **Platform + DesignSystem** | Via design tokens; Marketing does not own this |
| Daily order operations | **Operations** | Not Platform |
| Financial settlements and ledger | **Finance / WLT** | Not Platform; WLT owns financial truth |

---

## Forbidden Cross-Ownership

| Forbidden Action | Why |
|---|---|
| Platform managing Catalogs categories or products | Platform does not own content taxonomy |
| Catalogs enabling or disabling a service sovereignly | Only Platform can toggle sovereign service state |
| Marketing changing the central platform identity or color tokens | Marketing uses the brand, does not define it |
| Administration executing Platform variable changes without a Platform role | Administration grants authority; it does not act as Platform |
| Platform managing daily user accounts or role assignments | Administration owns user management |
| Marketing overriding Platform kill switch or service availability | Platform sovereign state is supreme |
| Catalogs bypassing Platform service visibility | If Platform hides a service, Catalogs content for that service is not exposed |
| Any section creating a local color system that overrides the central design system | All sections consume design tokens; none defines a local system |

---

## Boundary Enforcement Rules

1. **Platform service visibility is supreme.** If Platform marks a service as `hidden` or `paused`, no amount of Catalog content or Marketing campaign can expose it to clients.

2. **Provider setup is Platform-only.** No other section configures or changes provider API keys.

3. **Identity and colors are DesignSystem-governed.** Platform exposes the UI for requesting changes; the actual token system lives in `@bthwani/ui-kit`. Marketing uses the brand — it does not own it.

4. **Administration is a gate, not an actor.** Administration defines who can act on Platform. It does not act on Platform itself unless the user holds the correct Platform role.

5. **Handoff indicators, not handoff UI.** Platform Overview may show non-actionable indicators that reference Catalogs/Marketing/Administration (e.g., "Catalogs manages categories"), but these are informational only — not tabs, not management UIs, not mutations.
