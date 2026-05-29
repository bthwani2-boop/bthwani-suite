# BTHWANI STRUCTURE REFACTOR PLAYBOOK — V6

## 1. Default topic structure

```text
<topic>/
  <topic>.screen.tsx
  index.ts
```

Role files only when proven:

```text
<topic>.model.ts
<topic>.adapters.ts
<topic>.hooks.ts
<topic>.parts.tsx
<topic>.states.tsx
<topic>.drawers.tsx
<topic>.sheets.tsx
```

## 2. Never create by default

```text
screens/
flows/
workspaces/
model/
adapters/
hooks/
parts/
sheets/
drawers/
states/
```

## 3. Design-preserving refactor

Before moving code, identify:

```text
component files
CSS/module.css
style objects
className mappings
UI-kit components
layout wrappers
icons
spacing tokens
direction/layout logic
```

Refactor must preserve:

```text
visual hierarchy
layout
classNames/styles
RTL/LTR behavior
visible text
interaction behavior
```

Visual change requires reason and evidence.

## 4. Topic decision

Topic is product/flow meaning, not technical bucket.

Allowed topic examples:

```text
products
categories
approvals
media-review
checkout
orders
vars
provider-policy
campaigns
support
refunds
```

Forbidden topic names:

```text
components
cards
hooks
ui
forms
tables
shared2
panels
layout
helpers
common
new
v2
test
temp
```

## 5. File boundary rules

A file must have one clear owner.

Split if it has:

```text
multiple route/tab owners
UI + state + data + logic combined
mock arrays
many render functions
large internal components
heavy drawer/sheet
business truth in screen
```

Merge/demote if:

```text
shared used once
role file empty
wrapper does nothing
topic name is technical
nested folder does not meet threshold
```
