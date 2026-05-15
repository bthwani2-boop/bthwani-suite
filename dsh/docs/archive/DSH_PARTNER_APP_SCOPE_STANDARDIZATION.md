# DSH Partner App-Scope Standardization

Goal: close DSH partner only. No ARB. No DSH-owned wallet/finance.

Canonical screens:
- PartnerHomeScreen
- PartnerEntryScreen
- StoreProfileScreen
- OperationsScreen
- OrdersInboxScreen
- OrderDetailScreen
- OrderIssueScreen
- InventoryCatalogScreen
- PromotionsScreen
- NotificationsScreen
- PartnerSettingsScreen
- PartnerSupportScreen

WLT-owned DSH partner bridge target:

```text
wlt/frontend/app-partner/dsh/
├─ index.ts
├─ WltDshPartnerBridge.tsx
├─ wlt-dsh-partner.parts.tsx
├─ wlt-dsh-partner.adapter.ts
├─ wlt-dsh-partner.contract.ts
├─ wlt-dsh-partner.preview-data.ts
├─ wlt-dsh-partner.types.ts
└─ useWltDshPartnerWalletPreview.ts
```

Archived finance remnants:
- Dead DSH-owned wallet/finance preview files must leave `dsh/frontend/app-partner/**` and move to `dsh/_archive/frontend/**` once unreferenced is proven.

Repeatable closure:
1. Inventory every scoped file.
2. Move route entries to `screens/`.
3. Move non-route UI to `parts/`.
4. Move preview/static data to `data/`.
5. Move helpers/mappers/constants to `shared/`.
6. Build routes and screen registry.
7. Simplify WLT-owned DSH bridge.
8. Remove export-star and placeholder compatibility noise.
9. Regenerate classification.
10. Run static, diff, typecheck, runtime gates.

Closure gates:
- no `export *`
- no `serviceId: 'core'`
- no Tamagui outside `@bthwani/ui-kit`
- no DSH-owned wallet/finance artifact in live partner scope
- no ARB route in DSH partner scope
- classification has no stale, missing, or duplicate rows
- `git --no-pager diff --check` passes
- `pnpm -w exec tsc --noEmit` passes
