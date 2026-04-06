# 01_SOURCE_OBSERVATIONS

## Confirmed Facts

- donor DSH service scope spans five real surfaces: APP_USER, APP_CAPTAIN, APP_PARTNER, APP_FIELD, and MCPW
- target actor/context lock already normalizes those surfaces to `app-client`, `app-captain`, `app-partner`, `app-field`, and `control-panel`
- target operation lock intentionally compacts donor endpoint sprawl into 13 canonical operation families
- donor RBAC evidence still anchors direct action invocation to user, partner, captain, and field surfaces
- donor MCPW route evidence proves a real internal route cluster for DSH, especially for proxy-style handling and internal operations

## Controlled Inferences

- most donor MCPW routing is an umbrella visibility pattern rather than clean internal ownership for every DSH action family
- clean surface responsibility is safer when tracking and oversight are separated from direct action ownership
- only the proxy-request family currently has strong enough evidence to remain a true dual-surface family in the clean model

## Rejected Carryover

- do not place every DSH family in `control-panel` just because donor MCPW exposed broad operational pages
- do not reopen donor per-endpoint ownership once canonical operation families are already locked
- do not push partner maintenance or captain execution into customer or internal surfaces as mirrored ownership

## Remaining Gap

- screen lock and journey lock are still required to decide whether customer-side proof verification remains optional or becomes always required