# scrcpy Visual Review Gate

## Purpose

This is a guidance contract only. It does not execute commands.

Use this file when an agent must visually inspect a real mobile screen through scrcpy and ADB screenshots before claiming that a mobile UI change is correct.

The goal is to turn the connected Android device screen into direct visual evidence instead of relying only on build success, logs, TypeScript, or static code review.

This contract is useful for mobile UI validation, RTL validation, checkout/cart/order screens, dynamic totals, CTA button states, clipped layouts, spacing, overflow, scroll behavior, and live state-dependent UI.

## Non-execution rule

This file must not:

- replace `tools/guards/RUN_BTHWANI_GUARDS_UNIFIED.ps1`
- replace `tools/guards/SMART_SCOPED_GUARD_GATE.md`
- run full workspace lint
- run full workspace typecheck
- create ZIP files
- change guard definitions
- commit/push by itself
- fake visual evidence

## Self-discovery rule

The agent must not ask the human to paste scrcpy startup logs by default.

If terminal access is available, the agent must discover device/runtime details itself using:

```powershell
Get-Command adb -ErrorAction SilentlyContinue
Get-Command scrcpy -ErrorAction SilentlyContinue
adb devices
scrcpy
adb exec-out screencap -p
```

Ask the human for logs only when discovery fails, terminal access is unavailable, ADB is missing, scrcpy is missing, the device is unauthorized/offline, or screenshot capture fails.

Normal user instruction should be enough:

```text
Use SCRCPY_VISUAL_REVIEW_GATE.md and inspect the current device screen.
```

Do not require repeated device IP, model, Android version, renderer, texture size, or scrcpy startup logs unless troubleshooting is needed.

## When to use

Use this gate for mobile UI work affecting:

- screen layout
- cart summary
- checkout
- order tracking
- dynamic totals or fees
- address/location UI
- CTA button state
- RTL layout
- clipping/overflow
- scroll behavior
- spacing/hierarchy/visual state
- app-client / app-captain / app-partner / app-field mobile UI

Do not use it for docs-only, governance-only, terminal-only, prompt-only, git-only, or backend/API-only work with no visible UI effect.

## Screenshot storage rule

All scrcpy / ADB visual screenshots must be saved under:

```text
C:\bthwani-suite\tools\registry\runs\{SESSION_ID}\screenshots\
```

The agent must create a dedicated folder per visual review:

```powershell
$SessionId = "SCRCPY_VISUAL_REVIEW-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$EvidenceRoot = Join-Path "C:\bthwani-suite\tools\registry\runs" $SessionId
$ScreenshotRoot = Join-Path $EvidenceRoot "screenshots"
New-Item -ItemType Directory -Force -Path $ScreenshotRoot | Out-Null
```

Allowed screenshot names:

```text
screen-before.png
screen-after.png
screen-issue.png
screen-fixed.png
```

Default capture command:

```powershell
adb exec-out screencap -p > (Join-Path $ScreenshotRoot "screen-after.png")
```

Forbidden screenshot locations:

- Desktop
- Downloads
- project root
- random temp folders
- chat-only attachments without local registry path

Do not create ZIP by default.

The final report must include the screenshot path:

```text
Screenshot: C:\bthwani-suite\tools\registry\runs\{SESSION_ID}\screenshots\screen-after.png
```

## Standard visual review flow

1. Check tools and device:

```powershell
Get-Command adb -ErrorAction SilentlyContinue
Get-Command scrcpy -ErrorAction SilentlyContinue
adb devices
```

2. Open live screen when useful:

```powershell
scrcpy
```

3. Capture screenshot:

```powershell
$SessionId = "SCRCPY_VISUAL_REVIEW-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$EvidenceRoot = Join-Path "C:\bthwani-suite\tools\registry\runs" $SessionId
$ScreenshotRoot = Join-Path $EvidenceRoot "screenshots"
New-Item -ItemType Directory -Force -Path $ScreenshotRoot | Out-Null
adb exec-out screencap -p > (Join-Path $ScreenshotRoot "screen-after.png")
Write-Host $ScreenshotRoot
```

4. Inspect screenshot and record observations.

Screenshot existence alone is not a PASS.

## Visual checklist

### RTL

Verify:

- Arabic text is right-aligned.
- icon + text cluster stays together on the right when appropriate.
- action/chevron is on the opposite side.
- no accidental LTR row logic.
- no clipping caused by RTL.
- no wrong `space-between` separating icon from text.

### Dynamic state

Verify:

- cart item count updates.
- product total updates.
- delivery fee appears correctly.
- discount appears correctly or a calm empty state exists.
- final total is correct.
- CTA label and disabled/enabled state match the current state.
- address/location summary reflects the current selection.
- old values do not remain after state changes.

### Layout

Verify:

- no overlap.
- no clipped cards.
- no hidden CTA.
- safe area is respected.
- header does not cover content.
- scroll is usable and not frozen.
- important content is reachable.
- spacing and hierarchy are clear.

### Visual identity

Verify:

- central BThwani color system is respected.
- no random colors.
- no hardcoded visual drift.
- no noisy palette.
- approved design tokens are used where relevant.
- reusable UI is not implemented locally when it belongs to `@bthwani/ui-kit`.

## Relation to Smart Scoped Guard Gate

Use together with:

```text
tools/guards/SMART_SCOPED_GUARD_GATE.md
```

Smart Scoped Guard Gate chooses technical checks.
scrcpy Visual Review Gate validates the actual mobile screen visually.

Do not duplicate execution.

Recommended sequence:

1. Apply code changes.
2. Run scoped diff check.
3. Run relevant targeted guard only if justified.
4. Open app screen with scrcpy or capture ADB screenshot.
5. Compare screenshot with expected behavior.
6. Fix only the visible issue if found.
7. Commit/push only after scoped technical gates and visual review pass.

## Decision rules

Use `PASS` only when actual screen/screenshot evidence exists and observed UI matches expected behavior.

Use `NEEDS_VISUAL_EVIDENCE` when UI changed but no device/screenshot evidence exists.

Use `FIX_REQUIRED` when screenshot proves wrong state, stale values, clipping, RTL error, misleading button state, or design drift.

Use `BLOCKED` when no connected device exists, ADB/scrcpy is missing, the device is unauthorized/offline, the app cannot open, or the required screen cannot be reached.

## Final output contract

```text
Visual gate:
scope:
device:
screenshot:
observed:
rtl:
dynamic_state:
clipping_overflow:
decision:
next_action:
```

Never claim full closure without matching visual evidence when the task changed visible mobile UI.
