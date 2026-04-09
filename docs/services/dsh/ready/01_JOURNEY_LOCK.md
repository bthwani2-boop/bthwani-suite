# DSH Journey Lock (UI/UX/Flow)

Status Labels:
- READY_UI_UX_FLOW
- NOT_READY_FOR_API
- NOT_READY_FOR_BINDING
- NOT_READY_FOR_RUNTIME

Journey Lock:
- Service: dsh
- Surface: app-client
- First executable operation: dsh_cart_get
- Journey step intent: show cart context, expose one dominant next action, keep fallback recovery visible.

Closure Scope:
- Journey position for first slice is closed.
- Deeper cross-screen runtime transitions are deferred.
