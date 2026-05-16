# BThwani General Agent Package

Version: 2026.05.17-v1
Target repo: `C:\bthwani-suite`
Target branch baseline: `ghb/0147-20260517-000916-dsh-administration-and-platform`

This package upgrades the BThwani general agent control plane without restoring deleted noisy donor trees.

## Purpose

Create a complete, general, executable agent skill layer for all BThwani agents:

- Claude
- Codex
- Copilot
- Gemini
- Cursor
- OpenCode
- future agents

The package keeps service/application specialization in `governance/`.
`.agents` contains only general operational skills, adapters, registry, and routing contracts.

## Important truth

This package is not a claim that the repository is already 100% accepted.
It is a controlled package that produces evidence. Final acceptance requires local execution, Git diff review, verification output, and evidence ZIP.

## How to run

Inspect first:

```powershell
Set-Location -LiteralPath "C:\bthwani-suite"
PowerShell -ExecutionPolicy Bypass -File "<PACKAGE_ROOT>\scripts\CHECK_BTHWANI_GENERAL_AGENT_PACKAGE.ps1" -RepoRoot "C:\bthwani-suite"
```

Dry-run apply:

```powershell
PowerShell -ExecutionPolicy Bypass -File "<PACKAGE_ROOT>\scripts\APPLY_BTHWANI_GENERAL_AGENT_PACKAGE.ps1" -RepoRoot "C:\bthwani-suite"
```

Apply:

```powershell
PowerShell -ExecutionPolicy Bypass -File "<PACKAGE_ROOT>\scripts\APPLY_BTHWANI_GENERAL_AGENT_PACKAGE.ps1" -RepoRoot "C:\bthwani-suite" -Apply
```

Verify:

```powershell
PowerShell -ExecutionPolicy Bypass -File "<PACKAGE_ROOT>\scripts\VERIFY_BTHWANI_GENERAL_AGENT_PACKAGE.ps1" -RepoRoot "C:\bthwani-suite" -RunTypecheck
```

## What this package is allowed to touch

- `AGENTS.md` BThwani contract block only
- `.agents/**`
- `governance/agents/**`
- `tools/guards/guard-bthwani-agent-package.mjs`
- `tools/registry/runs/{SESSION_ID}/`

## What this package must not do

- no GitHub writes
- no commit
- no push
- no branch changes
- no package install
- no dependency changes
- no lockfile changes
- no source app/service implementation changes
- no direct restore of old `.github/agents` trees
- no `.github/skills`, `.github/agents`, or `.opencode/skills` active instruction mirrors

## Coverage model

Every BThwani need must route to exactly one of:

1. General skill in `.agents/skills`
2. Project/domain truth in `governance/`
3. Programmatic guard in `tools/guards`
4. Evidence rule in `tools/registry/runs`
5. Explicit `TBD/BLOCKED` gap

No domain should be silently ignored.
