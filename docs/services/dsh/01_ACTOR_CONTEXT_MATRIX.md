# DSH Actor Context Matrix

Status: CLOSED
Legal Gate: PRE_SCREEN
Gate Result: PASS
Closed At: 2026-04-08

## Actors
| actor | primary_surfaces | context_source |
|---|---|---|
| customer | app-client | 07_OPERATION_CATALOG.csv |
| captain | app-captain | 07_OPERATION_CATALOG.csv |
| partner | app-partner | 07_OPERATION_CATALOG.csv |
| ops | control-panel, app-client, app-field, app-partner | 07_OPERATION_CATALOG.csv |
| admin | control-panel | 07_OPERATION_CATALOG.csv |
| field | app-field | 07_OPERATION_CATALOG.csv |

## Lock
Actor context is frozen for first-screen start gate.
