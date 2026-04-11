# Control Panel Quarantine

- `dsh-legacy/` contains the previous DSH-specific host and docks that incorrectly owned service UI inside `app-shells`.
- These files are kept only for reference during cleanup and must not be imported by live routes or public APIs.
- Canonical DSH overview and child routes now live under `packages/surfaces/src/dsh/control-panel/operations/dsh/`.