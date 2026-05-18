# APPLY_MERGE_EXTERNAL_AGENT_SKILLS_NO_CONFLICT_NO_AUTO_EXIT

This is the safer no-auto-exit version.

Important:
- Do not paste the full script body into PowerShell.
- Run it as a `.ps1` file.
- This version contains no `exit` statements.
- It pauses at the end so the terminal does not close.
- Use `-NoPause` only if you intentionally do not want the final Enter prompt.

DryRun:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\PATH\TO\APPLY_MERGE_EXTERNAL_AGENT_SKILLS_NO_CONFLICT_NO_AUTO_EXIT.ps1"
```

Apply:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\PATH\TO\APPLY_MERGE_EXTERNAL_AGENT_SKILLS_NO_CONFLICT_NO_AUTO_EXIT.ps1" -Apply
```

After Apply:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
git --no-pager status --short
git --no-pager diff --name-status -- .agents
git --no-pager diff --check
pnpm -w exec tsc --noEmit
```
