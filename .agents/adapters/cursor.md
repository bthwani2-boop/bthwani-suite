# Cursor Adapter

Purpose: thin Cursor guidance without recreating deleted Cursor rule trees by default.

Read first:
- `../INDEX.md`
- `../AUTHORITY_BOUNDARY.md`
- `../skills/bthwani-agent-restoration-forensics/SKILL.md`

Tool notes:
- No root Cursor file is created by default in this restore.
- Add a Cursor root entry only if a future live tool requirement proves a specific path is necessary.

Forbidden actions:
- do not recreate deleted `.cursor` trees without proof
- do not copy `.agents` content into Cursor-specific mirrors

Evidence expectations:
- proof of tool requirement before any Cursor root file is added
- diff and verification if a future root file is created

