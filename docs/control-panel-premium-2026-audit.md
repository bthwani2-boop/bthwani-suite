# BThwani Premium Control Panel 2026 Audit

## Scope

- Reviewed the current web control panel implementation in this repository on branch `ghb/0109-20260502-002724-packages`.
- Reviewed the actual local route and host structure under `apps/web/control-panel` and the shell/surface hosts under `packages/app-shells` and `packages/surfaces`.
- Direct live inspection of the provided Stitch URLs was not possible from this sandboxed environment, so any Stitch-specific extraction below is limited to the user's brief and the direction already reflected in the repo.

## Executive Judgment

The current control panel is **not weak because of color or component styling alone**. The deeper problem is that the information architecture, navigation model, and density system are still too noisy.

The repo already contains useful raw material:

- a strong premium color direction based on `#0A2F5C` and `#FF500D`
- an RTL-first foundation
- a usable command-center pattern
- early Bento-like cards and segmented workspaces

But the current implementation still behaves like a collection of separate demo surfaces rather than one coherent premium control room.

The main issue is this:

- **too many route-level pages for things that should live inside one stable workspace**
- **hero cards and panels are oversized relative to the value of their content**
- **some concepts are duplicated across top-level sections and DSH sub-workspaces**
- **the control panel reads as several products stitched together, not one operating system**

## Verified Current Structure

The current web control panel has **30 route pages** under `apps/web/control-panel/app`.

Main top-level sections:

- `/dashboard`
- `/operations`
- `/finance`
- `/catalogs`
- `/support`
- `/community-services`
- `/partners`
- `/marketing`
- `/control`

Control sub-routes:

- `/control/platform`
- `/control/administration`
- `/control/hr`

Canonical operations route:

- `/operations`
- optional query params handle workspace/detail state, for example `?workspace=live-orders`, `?workspace=sheinproxy`, `?orderId=...`, `?panel=detail`

## Critical Findings

### 1. Route fragmentation is the biggest product-design defect

The current architecture splits one operator journey across too many route changes.

Evidence:

- [`packages/surfaces/src/service-owned/dsh/control-panel/DshControlPanelSurfaceHost.tsx`](../packages/surfaces/src/service-owned/dsh/control-panel/DshControlPanelSurfaceHost.tsx:272) exposes 10 tab destinations, and each tab pushes to a distinct route.
- [`packages/surfaces/src/service-owned/dsh/control-panel/DshControlPanelSurfaceHost.tsx`](../packages/surfaces/src/service-owned/dsh/control-panel/DshControlPanelSurfaceHost.tsx:288) mounts different screens based on route-level workspace switching.
- [`packages/app-shells/web/control-panel/ControlPanelSurfaceHost.tsx`](../packages/app-shells/web/control-panel/ControlPanelSurfaceHost.tsx:103) keeps `catalogs`, `partners`, `marketing`, and `control` as primary sections, while those same concerns also reappear inside the DSH layer.

Impact:

- cognitive noise
- repeated re-orientation cost
- weak sense of one unified control room
- visible "page explosion" exactly as the user described

Design conclusion:

- top-level sections should remain stable
- operational depth should open inside **internal tabs / drawers / split panels / contextual overlays**
- route changes should be reserved for major section context changes, not every workbench shift

### 2. A real navigation mismatch already exists in the control section

The UI advertises a `governance` subsection, but no route page exists for it.

Evidence:

- [`packages/app-shells/web/control-panel/ControlPanelSurfaceHost.tsx`](../packages/app-shells/web/control-panel/ControlPanelSurfaceHost.tsx:27) defines `['platform', 'administration', 'governance', 'hr']`.
- [`packages/app-shells/web/control-panel/ControlPanelSurfaceHost.tsx`](../packages/app-shells/web/control-panel/ControlPanelSurfaceHost.tsx:1065) pushes to `/control/${subsectionId}`.
- `apps/web/control-panel/app/control/governance/page.tsx` is missing.

Impact:

- broken trust in the control plane
- premium perception collapses immediately when IA promises a surface that does not exist

### 3. The layout density is too loose for an enterprise control surface

The dashboard visual language uses large-radius, high-padding, high-shadow blocks even for mid-value content.

Evidence:

- [`packages/app-shells/web/control-panel/control-panel-shell.module.css`](../packages/app-shells/web/control-panel/control-panel-shell.module.css:25) gives hero and spotlight cards `padding: 24px`, `border-radius: 30px`, and large shadow.
- [`packages/app-shells/web/control-panel/control-panel-shell.module.css`](../packages/app-shells/web/control-panel/control-panel-shell.module.css:19) builds a wide hero split even before the user has consumed the critical signal layer.
- [`packages/ui-kit/src/web/control-surface.tsx`](../packages/ui-kit/src/web/control-surface.tsx:5) applies another large, decorative header shell with `padding: 28px` and heavy visual treatment.

Impact:

- too much air between decision points
- reduced scan efficiency
- some content looks more important than it really is
- premium turns into decorative bulk

Design conclusion:

- the surface needs **controlled luxury**, not oversized luxury
- hero treatment should be rare
- most operator cards should become tighter, flatter, and more data-dense

### 4. Section boundaries are conceptually blurry

Some domain responsibilities are not cleanly separated:

- `partners`, `catalogs`, and `marketing` exist as main sections
- legacy `operations/dsh/*` aliases were duplicating these sections instead of keeping `/operations` as the single routing surface
- `orders` used to appear under DSH aliases while `/operations` already acted as the real routing hub

Evidence:

- [`packages/surfaces/src/service-owned/dsh/control-panel/DshControlPanelSurfaceHost.tsx`](../packages/surfaces/src/service-owned/dsh/control-panel/DshControlPanelSurfaceHost.tsx:25)
- [`packages/app-shells/web/control-panel/ControlPanelSurfaceHost.tsx`](../packages/app-shells/web/control-panel/ControlPanelSurfaceHost.tsx:561)
- [`packages/app-shells/web/control-panel/ControlPanelSurfaceHost.tsx`](../packages/app-shells/web/control-panel/ControlPanelSurfaceHost.tsx:1040)

Impact:

- users cannot form a stable mental model of "where work belongs"
- the platform looks rich, but not disciplined

### 5. The current visual system is promising, but still too component-led

The repo already uses the right palette direction:

- [`packages/ui-kit/src/foundation.ts`](../packages/ui-kit/src/foundation.ts:29)
- [`packages/ui-kit/src/foundation.ts`](../packages/ui-kit/src/foundation.ts:674)

But the composition still feels driven by reusable card widgets rather than a clear 2026 control-room layout logic.

Impact:

- nice pieces
- weaker whole

Design conclusion:

- stop thinking in isolated cards first
- define page grammar first: rail, section header, signal row, workbench grid, detail drawer, action rail, audit pane

## What Should Be Kept

These parts are worth preserving and evolving:

### 1. The premium color spine

Keep:

- deep blue `#0A2F5C`
- orange `#FF500D`
- clean light default
- disciplined dark mode as optional secondary mode

Reason:

- the palette is already strong, business-grade, and memorable without becoming loud

### 2. RTL-first shell logic

Keep the RTL-first platform direction and do not treat Arabic as an afterthought.

### 3. The command-center shell direction

Keep the existence of a stable rail + framed workspace pattern. It is the right base for a premium control panel.

### 4. Segmented in-surface navigation

The idea is correct. The current implementation just overuses route transitions.

Keep:

- segmented tabs
- internal workspace switching
- contextual drill-down

Change:

- move more of it inside one stable page surface

### 5. The DSH workbench idea

The DSH cluster already behaves like a real operator workspace. That concept should be kept, but **absorbed into a single operations workspace** rather than sprawling into many pages.

## What Should Be Rejected

### 1. Big hero blocks for routine information

Do not let low-priority content consume large premium cards.

Rule:

- large hero only for section arrival or critical platform state
- everything else must collapse into compact command modules

### 2. Separate pages for every operational mode

Reject the current "one workbench = one page" habit for most operations use cases.

Preferred model:

- `Operations` as one master workspace
- internal tabs for queue type
- right-side drawer for detail
- bottom tray / secondary drawer for actions or audit trail

### 3. Duplicate representation of the same business area

Do not present `partners`, `catalogs`, `marketing` once as primary sections and again as parallel operational worlds without a strict reason.

## Target 2026 IA Recommendation

Keep the repo's current top-level section names, but tighten their behavior.

### Primary sidebar

- Dashboard
- Operations
- Finance
- Catalogs
- Support
- Community Services
- Partners
- Marketing
- Control

### Inside each section

Use internal navigation layers instead of route sprawl:

- section tabs for subsection switching
- drawers for record detail
- split panes for queue + detail
- utility command bar for filters and actions
- persistent breadcrumb/status strip

### Control section

Make `Control` a single sovereign admin workspace with internal tabs:

- Platform
- Administration
- Governance
- HR

Do not fragment these into visually disconnected standalone pages unless there is a hard product reason.

### Operations section

Make `Operations` one control room with internal tabs:

- Overview
- Orders
- Reassign
- Peak Mode
- Arrival Bell
- Zone Set
- Manual Assignment

Then treat:

- Partners approvals
- Catalog governance
- Marketing activation

as linked adjacent workbenches or pinned side missions, not equal-rank route explosions.

## Density Rules For Premium 2026

### Surface hierarchy

- Level 1: one signature section header
- Level 2: one signal strip
- Level 3: one primary workbench zone
- Level 4: secondary insight cards
- Level 5: utility and audit details

### Spacing

- reduce default card padding from the current large values toward tighter ranges for routine cards
- keep spacious padding only for arrival surfaces and high-priority narrative blocks

### Radius

- reduce the overuse of `24px` to `30px` rounded shapes
- use sharper premium geometry for data modules

### Shadows

- reduce soft floating shadows
- prefer cleaner borders, subtle inset contrast, and restrained elevation

### Content ratio

Every block should answer:

- is this for orientation?
- for monitoring?
- for action?
- for detail?

If not clear, the block is too big or too decorative.

## Visual Direction To Extract From The Existing Work

Based on the repo direction and the user's brief, the strongest reusable visual DNA is:

- light default with a calm white field
- deep blue as structural authority, not as wall-to-wall fill
- orange used as decision energy, not decoration
- bento modules with meaningful hierarchy
- low-noise backgrounds
- premium enterprise sharpness instead of glassmorphism theatrics
- strong Arabic readability with clean bilingual handling

## Recommended Implementation Sequence

### Phase 1. Fix IA before beautification

- collapse route fragmentation in `operations`
- collapse `control` into one workspace with internal tabs
- remove duplicated concept placement where possible
- add the missing `governance` surface or remove the dead navigation path

### Phase 2. Introduce a strict density system

- compact routine cards
- shrink oversized hero usage
- define module sizes: signal / workbench / list / detail / audit

### Phase 3. Build one signature layout grammar

- fixed RTL sidebar
- top command bar
- primary workspace canvas
- right detail drawer
- contextual bottom sheet / audit tray where needed

### Phase 4. Apply premium visual refinement

- typography upgrade
- quieter shadows
- stronger line system
- cleaner state colors
- consistent motion language

## Concrete Repo Targets

If implementation starts next, the highest-value files to refactor first are:

- [`packages/surfaces/src/service-owned/dsh/control-panel/DshControlPanelSurfaceHost.tsx`](../packages/surfaces/src/service-owned/dsh/control-panel/DshControlPanelSurfaceHost.tsx:260)
- [`packages/app-shells/web/control-panel/ControlPanelSurfaceHost.tsx`](../packages/app-shells/web/control-panel/ControlPanelSurfaceHost.tsx:182)
- [`packages/app-shells/web/control-panel/control-panel-shell.module.css`](../packages/app-shells/web/control-panel/control-panel-shell.module.css:1)
- [`packages/ui-kit/src/web/control-surface.tsx`](../packages/ui-kit/src/web/control-surface.tsx:1)

## Final Design Position

The strongest version of this product is **not** "more pages, more cards, more visual treatment".

The strongest version is:

- fewer route jumps
- tighter modules
- clearer hierarchy
- one sovereign control-room feeling
- luxurious restraint instead of oversized decoration

That is the path to a control panel that feels practical, rich, premium, modern, and genuinely 2026.
