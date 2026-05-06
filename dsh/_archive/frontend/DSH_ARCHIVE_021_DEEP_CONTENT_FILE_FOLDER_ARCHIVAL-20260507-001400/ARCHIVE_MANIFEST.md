# DSH Deep Frontend Archive Manifest
## Session: DSH_ARCHIVE_021_DEEP_CONTENT_FILE_FOLDER_ARCHIVAL-20260507-001400

## Content-level archived blocks

| Original file | Archive content file | Classification | Reason | Lines | Ref count | Why safe |
|---|---|---|---|---|---|---|
| `app-captain/operations/DshCaptainOperationsScreen.tsx` | `_content/app-captain/operations/DshCaptainOperationsScreen.tsx.ARCHIVED_CONTENT.md` | CONTENT_ARCHIVE_READY | Dead component + demo snapshot + noise | 5–122, 293 | 0 external | Active exports (ChatReadAck, ChatSend, SupportDirectory) preserved |

**Rollback**: Restore archived content from `_content/app-captain/operations/DshCaptainOperationsScreen.tsx.ARCHIVED_CONTENT.md` back into the source file. Re-add model import.

## File-level archived files

| Original path | Archive path | Classification | Reason | Import count | Render count | Route/Host | ScreenId | Public export removed | Rollback |
|---|---|---|---|---|---|---|---|---|---|
| `app-client/gas/screens/DshGasRefillOrderCreateScreen.tsx` | `app-client/gas/screens/DshGasRefillOrderCreateScreen.tsx` | ARCHIVE_READY_FILE | Thin wrapper, 0 external consumers | 0 | 0 | 0 | 0 (screenId handled by DshClientOperationScreens) | Yes (gas/screens from app-client/index.ts) | `git mv dsh/_archive/.../app-client/gas/screens/DshGasRefillOrderCreateScreen.tsx dsh/frontend/app-client/gas/screens/DshGasRefillOrderCreateScreen.tsx` |
| `app-partner/operations/screens/DshPartnerOperationsDirectoryScreen.tsx` | `app-partner/operations/screens/DshPartnerOperationsDirectoryScreen.tsx` | ARCHIVE_READY_FILE | 0 external consumers, no shell render | 0 | 0 | 0 | 0 | Yes (operations from app-partner/index.ts) | `git mv dsh/_archive/.../app-partner/operations/screens/DshPartnerOperationsDirectoryScreen.tsx dsh/frontend/app-partner/operations/screens/DshPartnerOperationsDirectoryScreen.tsx` |
| `app-partner/operations/screens/index.ts` | `app-partner/operations/screens/index.ts` | ARCHIVE_READY_FILE_WITH_BARREL_CUTOVER | Only exported archived screen | 0 | 0 | 0 | 0 | Yes | `git mv dsh/_archive/.../app-partner/operations/screens/index.ts dsh/frontend/app-partner/operations/screens/index.ts` |
| `app-captain/operations/dshCaptainOperationsModel.ts` | `app-captain/operations/dshCaptainOperationsModel.ts` | ARCHIVE_READY_FILE | Types duplicated in dshCaptainBinding.contracts.ts; sole consumer removed | 0 | 0 | 0 | 0 | Yes (from operations/index.ts) | `git mv dsh/_archive/.../app-captain/operations/dshCaptainOperationsModel.ts dsh/frontend/app-captain/operations/dshCaptainOperationsModel.ts` |

## Folder-level archived folders

No folders were archived in this session. All folders with archived files still contain active content or serve as namespace placeholders.

## Folders checked but kept

| Folder | Classification | Active reason | Files that forced keep |
|---|---|---|---|
| `app-captain/operations` | KEEP_ACTIVE_FOLDER | Contains DshCaptainChatReadAckScreen, DshCaptainChatSendScreen, DshCaptainSupportDirectoryScreen (all active, used by CaptainSurfaceHost) | DshCaptainOperationsScreen.tsx (active exports) |
| `app-client/gas` | KEEP_ACTIVE_FOLDER | Namespace for gas-refill-order-create screenId concept | gas/screens/index.ts (comment placeholder) |
| `app-client/gas/screens` | MIXED_FOLDER_PARTIAL_ARCHIVE | index.ts kept as comment placeholder | index.ts |
| `app-partner/operations` | KEEP_ACTIVE_FOLDER | index.ts kept as comment placeholder | index.ts |

## Files checked but kept

| File | Classification | Keep reason |
|---|---|---|
| `app-client/DshSurfaceHost.tsx` | ACTIVE_HOST | Primary client surface host |
| `app-client/home/screens/DshHomeGetScreen.tsx` | GIANT_REFACTOR_LATER | Active giant route screen |
| `app-client/stores/screens/DshStoreGetScreen.tsx` | GIANT_REFACTOR_LATER | Active giant route screen |
| `app-captain/orders/DshCaptainOrdersScreen.tsx` | GIANT_REFACTOR_LATER | Active giant screen with demoSummary defaults |
| `shared/marketing/growth-store.ts` | ACTIVE_SHARED_DATA_AUTHORITY | Seed data store; `تجريبي` values are functional data metrics |
| `app-captain/fixture-locations.ts` | KEEP_LEGACY_FIXTURE | Fixture registry used for preview composition |
| `app-partner/fixture-locations.ts` | KEEP_LEGACY_FIXTURE | Fixture registry used for preview composition |
| `control-panel/fixture-locations.ts` | KEEP_LEGACY_FIXTURE | Fixture registry used for preview composition |
| `control-panel/control/closure-workspaces.tsx` | INTERNAL_DEV_ONLY_KEEP | English dev comment (not user-facing) |

## Remaining risks

- **GIANT_REFACTOR_LATER**: 4 giant screens contain demoSnapshot/demoSummary defaults that are structurally coupled to their active rendering
- **No folder-level archives**: All folders with archived files still contain active content
- **Visual/runtime/API/backend proof**: Remains outside scope
- **CRLF trailing whitespace**: 3 pre-existing CRLF files show trailing whitespace in git diff --check (not introduced by this session)
