# BThwani Agent Source
`.agents/` is the single global source for live agent instructions in `C:\bthwani-suite`.
This folder does not replace governance. Governance decides project authority, `.agents` carries operational agent guidance, tool adapters connect specific tools, guards verify rules, and evidence records what happened.
Start here:
1. Read [INDEX.md](/C:/bthwani-suite/.agents/INDEX.md).
2. Read [AUTHORITY_BOUNDARY.md](/C:/bthwani-suite/.agents/AUTHORITY_BOUNDARY.md).
3. Open the relevant skill under `skills/`.
4. Use a tool adapter only when your tool needs a thin entry file.
Do not rebuild `.github/skills`, `.github/agents`, `.opencode/skills`, bridge folders, or mirror folders from this source.
