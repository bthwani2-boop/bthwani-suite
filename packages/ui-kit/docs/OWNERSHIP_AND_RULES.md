# Ownership And Rules

## Central ownership
This package centrally owns:
- semantic tokens
- theme mapping
- text roles
- direction rules
- logical spacing behavior
- reusable UI primitives
- shared state families
- shared foundational components that remain service-clean
- common state shells

## Forbidden local patterns
Screens must not own:
- local typography systems
- local direction systems
- local theme providers
- local color scales
- repeated raw spacing systems
- repeated button or field families
- repeated empty/loading/error shells

## Phase boundary
- screen-family shells are not automatically lawful just because files already exist under `patterns/`
- pilot validation routes or screen previews stay blocked until later retained-screen phases
- any future `patterns/` promotion must prove cross-screen demand and avoid duplicate family growth

## Allowed local responsibility
Screens may own:
- screen composition
- service-specific business logic
- screen-specific content
- rare specialized UI that is not yet canonical
