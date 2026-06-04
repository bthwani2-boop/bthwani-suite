# Repo-wide Service Frontend Fixture & Media Identity Consistency Guard

status: WARN
severity: REPORT
mode: CHECK

## Services Scanned

servicesScanned: 9
filesScanned: 422
findingsTotal: 82
failCount: 0
warnCount: 82
tbdPathCount: 15

## Findings

| Severity | Status | Service | File | Line | Pattern | Changed | Reason |
|---|---|---|---|---:|---|---|---|
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-field/storage/field-onboarding.storage.ts | 1 | local_mock_or_fixture_identity | false | Frontend file contains mock/fixture/demo identity terms outside the configured canonical fixture owner. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/control-panel/administration/administration.types.ts | 13 | local_mock_or_fixture_identity | false | Frontend file contains mock/fixture/demo identity terms outside the configured canonical fixture owner. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/control-panel/administration/administration.types.ts | 13 | surface_fixture_without_canonical_data_reference | false | Surface-owned frontend file appears to define demo service identity without a clear canonical data reference. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/commercial.preview-contract.ts | 2 | local_mock_or_fixture_identity | false | Frontend file contains mock/fixture/demo identity terms outside the configured canonical fixture owner. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/dsh-cp-administration.contract.ts | 9 | local_mock_or_fixture_identity | false | Frontend file contains mock/fixture/demo identity terms outside the configured canonical fixture owner. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/dsh-discovery.contract.ts | 3 | local_mock_or_fixture_identity | false | Frontend file contains mock/fixture/demo identity terms outside the configured canonical fixture owner. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/dsh-field-visit.contract.ts | 2 | local_mock_or_fixture_identity | false | Frontend file contains mock/fixture/demo identity terms outside the configured canonical fixture owner. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/dsh-store-builders.ts | 2 | local_mock_or_fixture_identity | false | Frontend file contains mock/fixture/demo identity terms outside the configured canonical fixture owner. |
| WARN | TBD_UNVERIFIED_PATH | esf | esf/frontend/data |  | canonical_data_path_missing | false | Configured canonical_data path is not present. The guard reports the expected canonical path and does not create it. |
| WARN | TBD_UNVERIFIED_PATH | esf | esf/media-fixtures/assets/seed/esf |  | canonical_media_path_missing | false | Configured canonical_media path is not present. The guard reports the expected canonical path and does not create it. |
| WARN | TBD_UNVERIFIED_PATH | knz | knz/frontend/data |  | canonical_data_path_missing | false | Configured canonical_data path is not present. The guard reports the expected canonical path and does not create it. |
| WARN | TBD_UNVERIFIED_PATH | knz | knz/media-fixtures/assets/seed/knz |  | canonical_media_path_missing | false | Configured canonical_media path is not present. The guard reports the expected canonical path and does not create it. |
| WARN | TBD_UNVERIFIED_PATH | kwd | kwd/frontend/data |  | canonical_data_path_missing | false | Configured canonical_data path is not present. The guard reports the expected canonical path and does not create it. |
| WARN | TBD_UNVERIFIED_PATH | kwd | kwd/media-fixtures/assets/seed/kwd |  | canonical_media_path_missing | false | Configured canonical_media path is not present. The guard reports the expected canonical path and does not create it. |
| WARN | TBD_UNVERIFIED_PATH | mrf | mrf/frontend/data |  | canonical_data_path_missing | false | Configured canonical_data path is not present. The guard reports the expected canonical path and does not create it. |
| WARN | TBD_UNVERIFIED_PATH | mrf | mrf/media-fixtures/assets/seed/mrf |  | canonical_media_path_missing | false | Configured canonical_media path is not present. The guard reports the expected canonical path and does not create it. |
| WARN | TBD_UNVERIFIED_PATH | snd | snd/frontend/data |  | canonical_data_path_missing | false | Configured canonical_data path is not present. The guard reports the expected canonical path and does not create it. |
| WARN | TBD_UNVERIFIED_PATH | snd | snd/media-fixtures/assets/seed/snd |  | canonical_media_path_missing | false | Configured canonical_media path is not present. The guard reports the expected canonical path and does not create it. |
| WARN | TBD_UNVERIFIED_PATH | wlt | wlt/media-fixtures/assets/seed/wlt |  | canonical_media_path_missing | false | Configured canonical_media path is not present. The guard reports the expected canonical path and does not create it. |
| WARN | TBD_UNVERIFIED_PATH | arb | arb/frontend/data |  | canonical_data_path_missing | false | Configured canonical_data path is not present. The guard reports the expected canonical path and does not create it. |
| WARN | TBD_UNVERIFIED_PATH | arb | arb/media-fixtures/assets/seed/arb |  | canonical_media_path_missing | false | Configured canonical_media path is not present. The guard reports the expected canonical path and does not create it. |
| WARN | TBD_UNVERIFIED_PATH | amn | amn/frontend/data |  | canonical_data_path_missing | false | Configured canonical_data path is not present. The guard reports the expected canonical path and does not create it. |
| WARN | TBD_UNVERIFIED_PATH | amn | amn/media-fixtures/assets/seed/amn |  | canonical_media_path_missing | false | Configured canonical_media path is not present. The guard reports the expected canonical path and does not create it. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-captain/screens/DshCaptainMapScreen.tsx | 34 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-client/contracts/dsh-client-binding.contracts.ts | 233 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-client/contracts/dsh-client-binding.contracts.ts | 244 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-client/contracts/dsh-client-binding.contracts.ts | 254 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-client/contracts/dsh-client-binding.contracts.ts | 332 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-client/contracts/dsh-client-binding.contracts.ts | 344 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-client/hooks/useStoreDerivedItems.ts | 19 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-client/parts/CartDetails.tsx | 5 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-client/screens/BellScreen.tsx | 10 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-client/screens/BellScreen.tsx | 64 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-client/screens/DshCheckoutIntentScreen.tsx | 40 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-client/screens/NotificationsScreen.tsx | 12 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-client/screens/OperationScreens.tsx | 137 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-client/screens/SearchScreen.tsx | 5 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-client/screens/StoreItemsScreen.tsx | 17 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-field/types/DshFieldStoreVisitTypes.ts | 10 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-partner/parts/PartnerInventoryActionPanel.tsx | 6 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-partner/parts/PartnerOnboardingActionPanel.tsx | 6 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-partner/parts/PartnerOrderIssuePanel.tsx | 9 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-partner/screens/DshPartnerOrderRejectionScreen.tsx | 20 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-partner/screens/PromotionsScreen.tsx | 37 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-partner/screens/StoreProfileScreen.tsx | 24 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-partner/screens/StoreProfileScreen.tsx | 45 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/control-panel/administration/administration.types.ts | 22 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/control-panel/administration/administration.types.ts | 31 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/control-panel/administration/administration.types.ts | 40 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/control-panel/shared/ControlPanelDshActionQueue.tsx | 8 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/control-panel/shared/ControlPanelDshActionQueue.tsx | 22 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/control-panel/support/SupportEscalationQueueScreen.tsx | 16 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/data/subscriptions.preview-data.ts | 24 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/data/subscriptions.preview-data.ts | 225 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/commercial.preview-contract.ts | 169 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/commercial.preview-contract.ts | 184 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/commercial.preview-contract.ts | 193 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/commercial.preview-contract.ts | 208 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/commercial.preview-contract.ts | 241 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/commercial.preview-contract.ts | 270 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/commercial.preview-contract.ts | 288 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/commercial.preview-contract.ts | 392 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/commercial.preview-contract.ts | 417 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/commercial.preview-contract.ts | 425 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/commercial.preview-contract.ts | 620 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/dsh-cp-administration.contract.ts | 40 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/dsh-cp-administration.contract.ts | 49 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/dsh-cp-administration.contract.ts | 58 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/dsh-cp-operations.contract.ts | 28 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/dsh-cp-platform.contract.ts | 150 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/dsh-cp-platform.contract.ts | 160 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/dsh-cp-platform.contract.ts | 171 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/dsh-field-visit.contract.ts | 27 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/dsh-order-journey.model.ts | 44 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/dsh-order-journey.model.ts | 188 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/dsh-order-journey.model.ts | 209 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/dsh-store-builders.ts | 25 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/shared/store-card-commercial-map.ts | 19 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/app-client/shared/map-menu-item-to-product-card.ts | 15 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/data/subscriptions.preview-data.ts | 113 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/control-panel/support/SupportEscalationQueueScreen.tsx | 60 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |
| WARN | LEGACY_WARNING | dsh | dsh/frontend/control-panel/support/SupportEscalationQueueScreen.tsx | 82 | same_name_different_ids | false | Similar Arabic/English identity names appear with different ids across frontend files. |

## TBD_UNVERIFIED_PATH

| Service | Path | Kind | Immediate correction |
|---|---|---|---|
| esf | esf/frontend/data | canonical_data_path_missing | Create or document esf/frontend/data as the canonical data owner before adding independent frontend demo data or media. |
| esf | esf/media-fixtures/assets/seed/esf | canonical_media_path_missing | Create or document esf/media-fixtures/assets/seed/esf as the canonical media owner before adding independent frontend demo data or media. |
| knz | knz/frontend/data | canonical_data_path_missing | Create or document knz/frontend/data as the canonical data owner before adding independent frontend demo data or media. |
| knz | knz/media-fixtures/assets/seed/knz | canonical_media_path_missing | Create or document knz/media-fixtures/assets/seed/knz as the canonical media owner before adding independent frontend demo data or media. |
| kwd | kwd/frontend/data | canonical_data_path_missing | Create or document kwd/frontend/data as the canonical data owner before adding independent frontend demo data or media. |
| kwd | kwd/media-fixtures/assets/seed/kwd | canonical_media_path_missing | Create or document kwd/media-fixtures/assets/seed/kwd as the canonical media owner before adding independent frontend demo data or media. |
| mrf | mrf/frontend/data | canonical_data_path_missing | Create or document mrf/frontend/data as the canonical data owner before adding independent frontend demo data or media. |
| mrf | mrf/media-fixtures/assets/seed/mrf | canonical_media_path_missing | Create or document mrf/media-fixtures/assets/seed/mrf as the canonical media owner before adding independent frontend demo data or media. |
| snd | snd/frontend/data | canonical_data_path_missing | Create or document snd/frontend/data as the canonical data owner before adding independent frontend demo data or media. |
| snd | snd/media-fixtures/assets/seed/snd | canonical_media_path_missing | Create or document snd/media-fixtures/assets/seed/snd as the canonical media owner before adding independent frontend demo data or media. |
| wlt | wlt/media-fixtures/assets/seed/wlt | canonical_media_path_missing | Create or document wlt/media-fixtures/assets/seed/wlt as the canonical media owner before adding independent frontend demo data or media. |
| arb | arb/frontend/data | canonical_data_path_missing | Create or document arb/frontend/data as the canonical data owner before adding independent frontend demo data or media. |
| arb | arb/media-fixtures/assets/seed/arb | canonical_media_path_missing | Create or document arb/media-fixtures/assets/seed/arb as the canonical media owner before adding independent frontend demo data or media. |
| amn | amn/frontend/data | canonical_data_path_missing | Create or document amn/frontend/data as the canonical data owner before adding independent frontend demo data or media. |
| amn | amn/media-fixtures/assets/seed/amn | canonical_media_path_missing | Create or document amn/media-fixtures/assets/seed/amn as the canonical media owner before adding independent frontend demo data or media. |

## Immediate Corrections

- dsh: Replace local demo objects with ids/references from canonical service fixture data through an adapter or view model.
- dsh: Move the entity definition to canonical service fixture data and keep the surface limited to view-model consumption.
- esf: Create or document esf/frontend/data as the canonical data owner before adding independent frontend demo data or media.
- esf: Create or document esf/media-fixtures/assets/seed/esf as the canonical media owner before adding independent frontend demo data or media.
- knz: Create or document knz/frontend/data as the canonical data owner before adding independent frontend demo data or media.
- knz: Create or document knz/media-fixtures/assets/seed/knz as the canonical media owner before adding independent frontend demo data or media.
- kwd: Create or document kwd/frontend/data as the canonical data owner before adding independent frontend demo data or media.
- kwd: Create or document kwd/media-fixtures/assets/seed/kwd as the canonical media owner before adding independent frontend demo data or media.
- mrf: Create or document mrf/frontend/data as the canonical data owner before adding independent frontend demo data or media.
- mrf: Create or document mrf/media-fixtures/assets/seed/mrf as the canonical media owner before adding independent frontend demo data or media.
- snd: Create or document snd/frontend/data as the canonical data owner before adding independent frontend demo data or media.
- snd: Create or document snd/media-fixtures/assets/seed/snd as the canonical media owner before adding independent frontend demo data or media.
- wlt: Create or document wlt/media-fixtures/assets/seed/wlt as the canonical media owner before adding independent frontend demo data or media.
- arb: Create or document arb/frontend/data as the canonical data owner before adding independent frontend demo data or media.
- arb: Create or document arb/media-fixtures/assets/seed/arb as the canonical media owner before adding independent frontend demo data or media.
- amn: Create or document amn/frontend/data as the canonical data owner before adding independent frontend demo data or media.
- amn: Create or document amn/media-fixtures/assets/seed/amn as the canonical media owner before adding independent frontend demo data or media.
- dsh: Use one canonical entity id/reference from the service data root instead of redefining the identity in each surface.

## Canonical Ownership Map

| Service | Service root | Canonical data root | Data status | Canonical media root | Media status |
|---|---|---|---|---|---|
| dsh | dsh | dsh/frontend/data | VERIFIED | dsh/frontend/media-fixtures | TBD_UNVERIFIED_PATH |
| esf | esf | esf/frontend/data | TBD_UNVERIFIED_PATH | esf/media-fixtures/assets/seed/esf | TBD_UNVERIFIED_PATH |
| knz | knz | knz/frontend/data | TBD_UNVERIFIED_PATH | knz/media-fixtures/assets/seed/knz | TBD_UNVERIFIED_PATH |
| kwd | kwd | kwd/frontend/data | TBD_UNVERIFIED_PATH | kwd/media-fixtures/assets/seed/kwd | TBD_UNVERIFIED_PATH |
| mrf | mrf | mrf/frontend/data | TBD_UNVERIFIED_PATH | mrf/media-fixtures/assets/seed/mrf | TBD_UNVERIFIED_PATH |
| snd | snd | snd/frontend/data | TBD_UNVERIFIED_PATH | snd/media-fixtures/assets/seed/snd | TBD_UNVERIFIED_PATH |
| wlt | wlt | wlt/frontend/data | TBD_UNVERIFIED_PATH | wlt/media-fixtures/assets/seed/wlt | TBD_UNVERIFIED_PATH |
| arb | arb | arb/frontend/data | TBD_UNVERIFIED_PATH | arb/media-fixtures/assets/seed/arb | TBD_UNVERIFIED_PATH |
| amn | amn | amn/frontend/data | TBD_UNVERIFIED_PATH | amn/media-fixtures/assets/seed/amn | TBD_UNVERIFIED_PATH |

## False Positive Policy

- Clear internal test fixtures are INFO or WARN unless a changed file adds frontend demo service identity drift.
- Overrides must be recorded in this config, not as ad hoc code comments.
- The guard is read-only and reports remediation paths; it does not create, move, rename, delete, or rewrite service files.
