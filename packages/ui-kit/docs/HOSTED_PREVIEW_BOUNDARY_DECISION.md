# Hosted Preview Boundary Decision

## Status
Canonical for UI Kit proof and hosted preview only.

## Decision
pps/web/website is allowed to host the route /ui-kit as the canonical governed preview and proof shell for @bthwani/ui-kit.

This allowance is narrow and does not promote website into a business surface for UI Kit work.

## Allowed Scope
Only the following categories are allowed for the hosted preview boundary:
- pps/web/website/app/ui-kit/**
- pps/web/website/e2e/**
- pps/web/website/playwright.config.ts
- pps/web/website/package.json
- pps/web/website/next.config.mjs
- pps/web/website/css-modules.d.ts
- pps/web/website/app/layout.tsx when required to wire the shared root safely

## Forbidden Scope
The hosted preview boundary must not be used to:
- add business routes
- add product workflows
- move service logic into website
- turn website into a second design system owner
- bypass @bthwani/ui-kit authority

## Rule
The preview shell is allowed only as a governed host for proof, visual regression, accessibility scanning, and shared system review.
