# BThwani General Agent Package Commands

Replace `<PACKAGE_ROOT>` with the extracted package path.

## 1. Inspect current state

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
PowerShell -ExecutionPolicy Bypass -File "<PACKAGE_ROOT>\scripts\CHECK_BTHWANI_GENERAL_AGENT_PACKAGE.ps1" -RepoRoot "C:\bthwani-suite"
```

## 2. Dry-run apply

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
PowerShell -ExecutionPolicy Bypass -File "<PACKAGE_ROOT>\scripts\APPLY_BTHWANI_GENERAL_AGENT_PACKAGE.ps1" -RepoRoot "C:\bthwani-suite"
```

## 3. Apply

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
PowerShell -ExecutionPolicy Bypass -File "<PACKAGE_ROOT>\scripts\APPLY_BTHWANI_GENERAL_AGENT_PACKAGE.ps1" -RepoRoot "C:\bthwani-suite" -Apply
```

## 4. Verify

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
PowerShell -ExecutionPolicy Bypass -File "<PACKAGE_ROOT>\scripts\VERIFY_BTHWANI_GENERAL_AGENT_PACKAGE.ps1" -RepoRoot "C:\bthwani-suite" -RunTypecheck
git --no-pager status --short
git --no-pager diff --check
git --no-pager diff --stat
git --no-pager diff --name-status
```

## 5. Review package output

Upload:

```text
LOCAL_CHANGE_REVIEW.patch
tools/registry/runs/BTHWANI_GENERAL_AGENT_PACKAGE-*/<SESSION_ID>.zip
```
