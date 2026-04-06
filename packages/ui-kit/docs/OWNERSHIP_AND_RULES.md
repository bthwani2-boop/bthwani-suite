# Ownership And Rules

## Central ownership
This package centrally owns:
- semantic tokens
- theme mapping
- text roles
- direction rules
- logical spacing behavior
- reusable UI primitives
- shared foundational components
- common state shells
- reusable screen shells

## Forbidden local patterns
Screens must not own:
- local typography systems
- local direction systems
- local theme providers
- local color scales
- repeated raw spacing systems
- repeated button or field families
- repeated empty/loading/error shells

## Allowed local responsibility
Screens may own:
- screen composition
- service-specific business logic
- screen-specific content
- rare specialized UI that is not yet canonical
