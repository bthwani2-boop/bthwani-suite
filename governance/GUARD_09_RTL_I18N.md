# GUARD-09 — RTL / i18n Guard

## Purpose

Protect BThwani Arabic/RTL correctness and i18n ownership.

## Mode

CHECK-only and warning-first until baseline review is complete.

## Checks

- Arabic text outside approved locale/doc paths
- Arabic/RTL lines with explicit left/right directional styling
- chevron/arrow usage inside Arabic-containing files

## Rule

No automatic text rewrite. No automatic RTL transformation. Any UI/RTL/i18n change requires owner proof and visual evidence where relevant.
