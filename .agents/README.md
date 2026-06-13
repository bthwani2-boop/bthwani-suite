# BThwani Agent Source

`.agents/` is the single global source for live operational agent instructions in `C:\bthwani-suite`.

This folder does not replace governance.

Responsibility split:

- `governance/` decides BThwani project truth, domains, services, surfaces, stack, and policies.
- `.agents/` gives agents general execution, review, routing, and evidence skills.
- `adapters/` are thin tool-specific entry guides.
- `tools/guards/` verifies rules programmatically.
- `tools/registry/runs/{SESSION_ID}/` stores evidence.

Do not rebuild `.github/skills`, `.github/agents`, `.opencode/skills`, bridge folders, or mirror folders from this source.

Read order:

1. `AGENTS.md`
2. `.agents/README.md`
3. `.agents/AUTHORITY_BOUNDARY.md`
4. `.agents/EVIDENCE_GATE_ROUTER.md` to select the minimum gate tier and tool set
5. `.agents/GRAPHIFY.md` only when cross-file scope discovery, relationship questions, or impact analysis is needed — not for every task
5. `.agents/INDEX.md`
6. relevant `SKILL.md`
7. relevant adapter
8. relevant `governance/` source
