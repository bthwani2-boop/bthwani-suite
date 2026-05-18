# Protected Surfaces Policy

## App-client protection

The human owner stated that all app-client screens/interfaces have already been visually reviewed and designed, except some tabs in `MySpaceScreen` / "مساحتي".

Therefore:

- Do not redesign app-client screens.
- Do not adjust visual styling, spacing, color distribution, card hierarchy, or RTL layout unless a specific logic bug cannot be fixed otherwise.
- Prefer minimal state/sheet/section wiring.
- Any app-client visual change must be separately listed in evidence with: file, reason, screenshot target, and rollback note.
- `MySpaceScreen` tab fixes are allowed only after proving the route/tab mismatch.

## Prohibited destructive actions

- No mass rename.
- No broad split of god-files without import/registry proof.
- No deletion unless proven dead and not imported/exported/registered.
- No conversion of every gap into a new screen.
- No new dependencies or lockfile changes.
- No runtime/API/backend/WLT mutation.

## WLT boundary

DSH may display WLT-owned states as read-only preview/bridge information only. DSH must not compute fees, payouts, settlements, refunds, commissions, or balances.
