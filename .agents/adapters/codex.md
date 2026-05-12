# Codex Adapter

Purpose: thin Codex entry for local execution in `C:\bthwani-suite`.

Read first:
- `../INDEX.md`
- `../AUTHORITY_BOUNDARY.md`
- `../skills/bthwani-agent-governance-execution/SKILL.md`

Tool notes:
- Root entry file: `.codex/config.toml`
- Keep Codex config minimal and focused on the live Nx MCP server.
- Do not reintroduce deleted subagent configuration unless a live companion file is intentionally restored later.

Forbidden actions:
- do not embed long policy text in config
- do not restore deleted subagent trees by default
- do not duplicate `.agents` content into config

Evidence expectations:
- diff
- verification output
- registry evidence when files change

