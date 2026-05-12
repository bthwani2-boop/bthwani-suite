# OpenCode Adapter
Purpose: thin OpenCode configuration adapter for this repo.
Read first:
- `../INDEX.md`
- `../AUTHORITY_BOUNDARY.md`
- `../skills/bthwani-agent-governance-execution/SKILL.md`
Tool notes:
- Root entry file: `opencode.json`
- Keep the config limited to live integration settings such as Nx MCP.
- Do not recreate `.opencode/skills`.
Forbidden actions:
- do not copy skills into OpenCode config
- do not reintroduce deleted `.opencode` skill trees
Evidence expectations:
- diff
- verification output
- evidence zip when files change
