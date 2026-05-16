# 12 — Copy / Placement Commands

After downloading and extracting this ZIP, place it under:

```text
C:\bthwani-suite\tools\plan\PLATFORM_CONTROL_PLANE_UIUX_PACKAGE\
```

## PowerShell example

Assuming ZIP is downloaded to Downloads:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
New-Item -ItemType Directory -Force -Path "tools\plan" | Out-Null

Expand-Archive `
  -LiteralPath "$env:USERPROFILE\Downloads\PLATFORM_CONTROL_PLANE_UIUX_PACKAGE.zip" `
  -DestinationPath "tools\plan" `
  -Force
```

If the ZIP contains a top-level folder, expected result:

```text
C:\bthwani-suite\tools\plan\PLATFORM_CONTROL_PLANE_UIUX_PACKAGE\README.md
```

## Copy governance proposal manually

The agent should copy:

```text
tools\plan\PLATFORM_CONTROL_PLANE_UIUX_PACKAGE\07_GOVERNANCE_TO_ADD\30_PLATFORM_CONTROL_PLANE.md
```

to:

```text
governance\30_PLATFORM_CONTROL_PLANE.md
```

## Copy guard manually

The agent should copy:

```text
tools\plan\PLATFORM_CONTROL_PLANE_UIUX_PACKAGE\08_GUARDS\platform-control-plane-uiux.guard.mjs
```

to:

```text
tools\guards\platform-control-plane-uiux.guard.mjs
```

Only after reading and validating the contents.

## Initial command to give the agent

```text
اقرأ كامل الحزمة الموجودة في:
C:\bthwani-suite\tools\plan\PLATFORM_CONTROL_PLANE_UIUX_PACKAGE\

ابدأ من:
00_AGENT_MASTER_PROMPT.md

نفذ التشخيص أولًا، ثم نفذ UI/UX فقط لقسم Platform Control Plane حسب الحزمة، ولا تنفذ API/backend/runtime/secrets حقيقية. التزم بالتحقق الرقمي والأدلة كما هو محدد.
```
