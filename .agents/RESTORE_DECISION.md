# Agent Restore Decision
- Current branch: `ghb/0132-20260512-230649-agents-codex-github`
- Named donor branch: `ghb/0131-20260512-191431-agents-codex-github`
- Effective extraction source: `3a3c82ba39a65675cd11e05118f09ce435f7fae6`
## Why there was no direct restore
- The named donor branch already matched the deleted agent state for the relevant paths.
- Direct restore would have recreated deleted `.github/skills`, `.github/agents`, and bulky `.agents` reference trees wholesale.
- The required end state is one curated global agent source under `.agents/`, not a replay of legacy structures.
## What was restored
- A compact `.agents/` source with docs, core skills, and thin tool adapters.
- Thin root entries for Copilot, Codex, Claude, Gemini, and OpenCode.
- Active references in `AGENTS.md` redirected from deleted `.github/skills/*` paths to `.agents/skills/*`.
## What was rejected
- `.github/skills/**`
- `.github/agents/**`
- `.opencode/skills/**`
- bulky `.agents/skills/*/references/**`
- deleted `.github/instructions/**` and `.github/prompts/**` as standalone trees
- deleted Codex subagent stanzas and deleted Cursor trees
## Needs review
- Cursor root entry remains adapter-only until a live tool requirement proves a specific `.cursor` entry path is necessary.
