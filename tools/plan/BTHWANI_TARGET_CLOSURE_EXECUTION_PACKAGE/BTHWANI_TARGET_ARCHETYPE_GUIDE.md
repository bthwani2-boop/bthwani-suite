# BTHWANI TARGET ARCHETYPE GUIDE — V6

Use this file to make the target clear before execution.

## 1. Target archetypes

| Target kind | First files to discover | Required matrices | Usual first safe task |
|---|---|---|---|
| Control-panel section | section screen, registry, tabs, route host, shared folder | Gap, File Boundary, Topic, Runtime/API | fix shell ownership or structural hygiene |
| Control-panel tab/topic | topic folder/screen, section registry, drawer/states/adapters | Gap, File Boundary, Topic Boundary | action/state mapping or adapter cleanup |
| App screen | route/screen registry, screen file, navigation host, data source | Gap, File Boundary, Performance | loading/empty/error/action closure |
| Cross-surface journey | all linked app/control-panel touchpoints | Linked Surface, Runtime/API, Gap | classify boundaries and close safest UI flow |
| DSH data/media | central data/media files, adapters, consumers | Data/Media Matrix, File Boundary | centralize one canonical record/reference |
| Governance/guard/agent | relevant guard/script/agent/skill docs | Governance Fitness, Gap | update stale blocker or mark blocked |
| Shared module | import graph, consumers, owner | File Boundary, Structural Hygiene | demote fake shared or tighten exports |

## 2. Target sizing

| Size | Rule |
|---|---|
| Micro | one folder/file, no linked surfaces. Still output 28 sections compactly. |
| Standard | one surface/section with dependencies. Use normal matrices. |
| Deep | cross-surface, data/media, governance impact. Use full matrices. |

## 3. First safe task chooser

Choose Task 1 using this priority:

1. Package/governance/guard blocker that prevents correct execution.
2. Structural hygiene blocker in target.
3. Missing logic/state/action that blocks flow.
4. Data/media duplication that creates false truth.
5. Runtime/API boundary classification if UI is pretending runtime truth.
6. Performance blocker introduced by current UI/data shape.
7. Design closure only after logic/data/flow/technical gates.

## 4. Do not choose Task 1 as

```text
broad redesign
rewrite entire section
create all role files
move everything to shared
open PR
fix all surfaces at once
screenshots only
report only without allowed reason
```
