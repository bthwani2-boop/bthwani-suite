# Contract Deltas - dsh

## Baseline
- Existing donor operation folders indicate broad operation set, but new-repo contract opening remains phase-gated.

## Required Delta Policy
- Open contract deltas only for queue items entering W08.
- No contract expansion without mapped consumer and service method target.
- Keep one canonical endpoint per operation_id in contract catalog.

## Immediate Delta Candidates
- proxy workflow endpoints under /api/dsh/proxy/*
- order lifecycle endpoints under /api/dsh/orders/*
