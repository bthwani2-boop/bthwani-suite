# BThwani Agent Restore Decision

Decision: `DONOR_EXTRACTION_ONLY`

Old agent trees and deleted skill directories may be used as read-only donor/reference material.

Do not directly restore:

- `.github/agents/**`
- `.github/skills/**`
- `.opencode/skills/**`
- old broad generic skills
- old long checklist trees
- old platform-agent OS mirrors
- copied external docs

Extraction categories:

```text
KEEP_AS_GENERAL_SKILL_PATTERN
MOVE_TO_GOVERNANCE
MOVE_TO_GUARD
REJECT_AS_NOISE_OR_DUPLICATE
TBD_NEEDS_HUMAN_REVIEW
```

Service/application details must move to `governance/`.
General execution/review/evidence capabilities may become `.agents/skills`.
