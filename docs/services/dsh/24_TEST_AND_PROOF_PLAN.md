# 24_TEST_AND_PROOF_PLAN

## Current Proof Class

- W00 through W05: `fixtures-only` and `document-readiness`
- W08: `bind-ready` planning only
- W09: `runtime-ready` and `proof-ready` planning only

## Required Proof Types

- visual proof for every retained screen
- interaction proof for each primary CTA
- state proof for loading, empty, failure, retry, and success shells
- route proof for every retained candidate route id
- binding proof only after W08 opens
- runtime proof only after W09 opens

## Immediate Test Focus

- confirm first-screen fit and no-hidden-dependency for `dsh_client_entry_discovery_home`
- confirm partner and captain waves remain downstream and do not open early
- confirm proxy branch remains separate from the mainline order path