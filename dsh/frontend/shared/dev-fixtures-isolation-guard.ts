// DEV_FIXTURES_ISOLATION_GUARD
// Purpose: Track all usages of dsh/frontend/media-fixtures and dsh/frontend/data
//          in runtime surfaces. Prevent fixture data from becoming runtime truth.
//
// TRACKING: RETIRE_DEV_FIXTURES_AFTER_RUNTIME_MEDIA_CLOSURE
//
// Classification:
//   DEV_ALLOWED          — fixture use is intentional (preview/demo/category tiles/storybook)
//   RUNTIME_VIOLATION_FIXED — was fixture, now uses runtime API
//   RUNTIME_VIOLATION_PENDING — uses fixture in a runtime path; needs migration to API
//   BLOCKED_WITH_REASON  — import blocked; reason documented
//
// Enforcement: The productionGuard() function below throws in non-dev environments
// when called with a fixture-sourced value. Call it at fixture resolution sites.

// ─── Evidence Registry ──────────────────────────────────────────────────────

export type FixtureEvidenceEntry = {
  readonly file: string;
  readonly classification: 'DEV_ALLOWED' | 'RUNTIME_VIOLATION_FIXED' | 'RUNTIME_VIOLATION_PENDING' | 'BLOCKED_WITH_REASON';
  readonly reason: string;
};

export const DSH_FIXTURE_EVIDENCE: readonly FixtureEvidenceEntry[] = [
  {
    file: 'dsh/frontend/shared/resolve-dsh-image-source.ts',
    classification: 'DEV_ALLOWED',
    reason: 'Source of truth for fixture keys. Used only via resolveDshImageSource(). Not imported directly in runtime product/order/payment flows.',
  },
  {
    file: 'dsh/frontend/app-client/parts/home/HomeOrbitSections.tsx',
    classification: 'DEV_ALLOWED',
    reason: 'Category tiles use fixture images (dsh.category.main/sub.*). No runtime category image API exists yet. Exit path: add GET /categories/{id}/media runtime endpoint.',
  },
  {
    file: 'dsh/frontend/app-client/shared/resolve-image-source.ts',
    classification: 'DEV_ALLOWED',
    reason: 'Re-exports resolveDshImageSource for category/banner fallback. Used only in category tile and banner fallback — not in product/order/payment flows.',
  },
  {
    file: 'dsh/frontend/app-partner/screens/ProductMediaScreen.tsx',
    classification: 'RUNTIME_VIOLATION_FIXED',
    reason: 'Was: manifest-key selector + POST /media (fixture). Now: runtime createUploadIntent → PUT MinIO → completeUpload → listMediaAssets.',
  },
  {
    file: 'dsh/frontend/app-partner/screens/InventoryCatalogScreen.tsx',
    classification: 'RUNTIME_VIOLATION_FIXED',
    reason: 'Was: resolveDshImageSource(item.mediaKey) for product thumbnails. Now: useEffect → listMedia({ owner_type: product, owner_id }) → public_url via dsh-media-api.client.ts. Falls back to emoji initial when no media uploaded.',
  },
  {
    file: 'dsh/frontend/app-partner/screens/PartnerHubScreen.tsx',
    classification: 'RUNTIME_VIOLATION_FIXED',
    reason: 'Was: resolveDshImageSource for StoreHero coverImage/logoImage. Now: useEffect → listMedia({ owner_type: store, owner_id }) → purpose=cover/logo public_url via dsh-media-api.client.ts. Falls back to undefined (StoreHero placeholder).',
  },
  {
    file: 'dsh/frontend/control-panel/catalogs/catalogs.data.ts',
    classification: 'DEV_ALLOWED',
    reason: 'Control-panel catalog view is preview/seed data only. Not a live runtime surface. Marked PREVIEW_ONLY.',
  },
  {
    file: 'dsh/frontend/control-panel/catalogs/catalogs.parts.tsx',
    classification: 'DEV_ALLOWED',
    reason: 'Uses resolveDshImageSource for preview catalog thumbnails. Not runtime product/order/payment flow.',
  },
  {
    file: 'dsh/frontend/data/media.preview-data.ts',
    classification: 'DEV_ALLOWED',
    reason: 'Pure preview/seed data file. Not imported by any runtime surface directly.',
  },
  {
    file: 'dsh/frontend/data/categories.preview-data.ts',
    classification: 'DEV_ALLOWED',
    reason: 'Category mediaKey fields are fixture references used only for category tile rendering. Not in order/payment/product upload flows.',
  },
];

// ─── Allowed Import Contexts ──────────────────────────────────────────────────

const ALLOWED_FIXTURE_CONTEXTS = [
  'preview', 'fixture', 'demo', 'storybook', 'dev', 'fallback', 'test',
  'category', 'catalog', 'control-panel',
] as const;

// ─── Runtime Guard ────────────────────────────────────────────────────────────

/**
 * Guards against fixture data leaking into production runtime paths.
 * Call at sites where a fixture-sourced value is resolved.
 * No-ops in dev environments. Throws in production if __DEV__ is false.
 *
 * Usage:
 *   guardDevFixture('app-client/screens/HomeScreen.tsx', 'category-tile-fallback');
 */
export function guardDevFixture(callerFile: string, context: string): void {
  const _devGlobal = (globalThis as Record<string, unknown>).__DEV__;
  const isDevEnv: boolean =
    _devGlobal !== undefined
      ? Boolean(_devGlobal)
      : typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production';

  if (!isDevEnv) {
    const allowed = ALLOWED_FIXTURE_CONTEXTS.some((ctx) => context.toLowerCase().includes(ctx));
    if (!allowed) {
      throw new Error(
        `[DEV_FIXTURES_ISOLATION_GUARD] Fixture data used in production runtime path.\n` +
        `  caller: ${callerFile}\n` +
        `  context: ${context}\n` +
        `  Fix: replace fixture source with runtime API (dsh-media-api.client.ts).`,
      );
    }
  }
}

/**
 * Returns evidence summary for diagnostic reporting.
 */
export function getFixtureEvidenceSummary(): {
  devAllowed: number;
  violationsFixed: number;
  violationsPending: number;
  blocked: number;
} {
  return DSH_FIXTURE_EVIDENCE.reduce(
    (acc, e) => {
      if (e.classification === 'DEV_ALLOWED') acc.devAllowed++;
      else if (e.classification === 'RUNTIME_VIOLATION_FIXED') acc.violationsFixed++;
      else if (e.classification === 'RUNTIME_VIOLATION_PENDING') acc.violationsPending++;
      else if (e.classification === 'BLOCKED_WITH_REASON') acc.blocked++;
      return acc;
    },
    { devAllowed: 0, violationsFixed: 0, violationsPending: 0, blocked: 0 },
  );
}
