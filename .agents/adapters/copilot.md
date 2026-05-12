# Copilot Adapter
Purpose: thin GitHub Copilot and VS Code agent entry for this repo.
Read first:
- `../INDEX.md`
- `../AUTHORITY_BOUNDARY.md`
- `../skills/bthwani-current-workspace-authority/SKILL.md`
- `../skills/bthwani-agent-governance-execution/SKILL.md`
Tool notes:
- Root entry file: `.github/copilot-instructions.md`
- Keep `ghb` and `gp` shortcut behavior brief and tool-specific.
- Route workflow rules back to `.agents` instead of duplicating full skills.
Forbidden actions:
- do not duplicate governance
- do not duplicate full skill bodies
- do not add GitHub write behavior unless the user explicitly asks
Evidence expectations:
- diff
- verification output
- evidence zip when work writes files
