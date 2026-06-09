#!/usr/bin/env node
// MEDIA_CANONICAL_CONSISTENCY_CHECK
// Enforces DEV_ONLY_MEDIA_FIXTURES and DEV_ONLY_PREVIEW_DATA isolation.
// Scans frontend source for runtime imports from banned paths.
// Exits 0 = clean, 1 = violations found.

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative, extname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..', '..');

// Paths that are allowed to import from fixture/preview data dirs.
const ALLOWED_PATH_PATTERNS = [
  /\.stories\.(tsx?|jsx?)$/,
  /\.test\.(tsx?|jsx?)$/,
  /\.spec\.(tsx?|jsx?)$/,
  /[/\\]storybook[/\\]/,
  /[/\\]preview[/\\]/,
  /[/\\]fixture[/\\]/,
  /[/\\]demo[/\\]/,
  /[/\\]test[/\\]/,
  /[/\\]__tests__[/\\]/,
  /[/\\]data[/\\]/,           // files inside data/ themselves are allowed
  /[/\\]media-fixtures[/\\]/, // files inside media-fixtures/ themselves are allowed
];

// Import patterns that are banned in runtime code.
const BANNED_IMPORT_PATTERNS = [
  /from\s+['"].*\/media-fixtures['"]/,
  /from\s+['"].*\/data\/[^'"]*\.preview-data['"]/,
  /from\s+['"].*\/data\/index['"]/,
  /from\s+['"].*\/data\/canonical\.preview-data['"]/,
  /from\s+['"].*\/data\/stores\.preview-data['"]/,
  /from\s+['"].*\/data\/products\.preview-data['"]/,
  /from\s+['"].*\/data\/orders\.preview-data['"]/,
  /from\s+['"].*\/data\/marketing\.preview-data['"]/,
  /from\s+['"].*\/data\/operational[^'"]*\.preview-data['"]/,
  /from\s+['"].*\/data\/partner\.preview-data['"]/,
  /from\s+['"].*\/data\/signals\.preview-data['"]/,
  /require\(['"].*\/media-fixtures['"]\)/,
  /require\(['"].*\/data\/[^'"]*\.preview-data['"]\)/,
];

// Tolerated runtime violations (pending API migration — classified, not blocking).
// Key = relative file path from repo root. Value = justification.
const TOLERATED_VIOLATIONS = new Map([
  ['dsh/frontend/app-client/dsh-client.navigation-bridge.ts', 'RUNTIME_VIOLATION: Pending API migration to dsh-api /stores + /orders'],
  ['dsh/frontend/app-client/adapters/dshClientStoreAdapters.ts', 'RUNTIME_VIOLATION: Pending store discovery API adapter'],
  ['dsh/frontend/app-client/adapters/dshClientOrderAdapters.ts', 'RUNTIME_VIOLATION: Pending order API adapter'],
  ['dsh/frontend/app-client/dsh-client-wlt-payment-bridge.ts', 'RUNTIME_VIOLATION: Pending WLT payment bridge cleanup'],
  ['dsh/frontend/app-field/DshFieldSurface.tsx', 'RUNTIME_VIOLATION: Pending field API migration'],
  ['dsh/frontend/app-field/storage/field-onboarding.storage.ts', 'RUNTIME_VIOLATION: Pending field store API'],
  ['dsh/frontend/app-field/sections/DocumentVerificationSection.tsx', 'RUNTIME_VIOLATION: Pending field document API'],
  ['dsh/frontend/app-field/contracts/dsh-field-binding.contracts.ts', 'RUNTIME_VIOLATION: Pending field contracts migration'],
  ['dsh/frontend/app-field/screens/DshFieldStoresScreen.tsx', 'RUNTIME_VIOLATION: Pending field stores screen API'],
  ['dsh/frontend/app-field/screens/DshFieldStoresHistoryScreen.tsx', 'RUNTIME_VIOLATION: Pending field history API'],
  ['dsh/frontend/shared/catalog-central-adapter.ts', 'RUNTIME_VIOLATION: Pending catalog API adapter'],
  ['dsh/frontend/shared/workflow.ts', 'RUNTIME_VIOLATION: Pending workflow API'],
  ['dsh/frontend/shared/dsh-operational-preview-adapter.ts', 'RUNTIME_VIOLATION: Pending operational API'],
  ['dsh/frontend/shared/dsh-signal-layer.model.ts', 'RUNTIME_VIOLATION: Pending signal API'],
  ['dsh/frontend/shared/dshFinancePreviewModel.ts', 'RUNTIME_VIOLATION: Pending finance API'],
  ['dsh/frontend/app-captain/dsh-captain.types.ts', 'RUNTIME_VIOLATION: Pending captain operational status API'],
  ['dsh/frontend/app-partner/screens/PartnerHubScreen.tsx', 'RUNTIME_VIOLATION: Pending partner hub API'],
  ['dsh/frontend/app-partner/screens/PromotionsScreen.tsx', 'RUNTIME_VIOLATION: Pending promotions API'],
  ['dsh/frontend/app-partner/screens/PartnerSupportScreen.tsx', 'RUNTIME_VIOLATION: Pending partner support API'],
  ['dsh/frontend/app-partner/screens/InventoryCatalogScreen.tsx', 'RUNTIME_VIOLATION: Pending catalog API'],
  ['dsh/frontend/app-partner/parts/PartnerOrderIssuePanel.tsx', 'RUNTIME_VIOLATION: Pending support API'],
  ['dsh/frontend/app-client/screens/CartScreen.tsx', 'RUNTIME_VIOLATION: Pending cart/orders API migration'],
  ['dsh/frontend/app-client/screens/DshOrderIssueHubScreen.tsx', 'RUNTIME_VIOLATION: Pending support API'],
  ['dsh/frontend/app-client/screens/DshTrackingScreen.tsx', 'RUNTIME_VIOLATION: Pending operational status API'],
  ['dsh/frontend/app-client/screens/NotificationsScreen.tsx', 'RUNTIME_VIOLATION: Pending notifications API'],
  ['dsh/frontend/app-client/screens/parts/OrdersTrackingHelpers.tsx', 'RUNTIME_VIOLATION: Pending operational status API'],
  ['dsh/frontend/app-client/shared/home-promo-mappers.ts', 'RUNTIME_VIOLATION: Pending marketing API'],
  ['dsh/frontend/app-field/parts/FieldStoreCard.tsx', 'RUNTIME_VIOLATION: Pending field store API'],
  ['dsh/frontend/app-field/screens/DshFieldFinanceScreen.tsx', 'RUNTIME_VIOLATION: Pending field finance API'],
  ['dsh/frontend/app-field/screens/DshFieldProfileHomeScreen.tsx', 'RUNTIME_VIOLATION: Pending field profile API'],
  ['dsh/frontend/app-field/screens/DshFieldReadinessEscalationScreen.tsx', 'RUNTIME_VIOLATION: Pending escalation API'],
  ['dsh/frontend/app-field/screens/DshFieldStoreOnboardingScreen.tsx', 'RUNTIME_VIOLATION: Pending field onboarding API'],
  // app-captain screens
  ['dsh/frontend/app-captain/screens', 'RUNTIME_VIOLATION: Pending captain operational status/finance/support API'],
  // app-client contracts (type-only imports from preview-data)
  ['dsh/frontend/app-client/contracts', 'RUNTIME_VIOLATION: Pending client contracts migration to API types'],
  ['dsh/frontend/app-client/dsh-client.types.ts', 'RUNTIME_VIOLATION: Pending client types migration'],
  ['dsh/frontend/app-client/DshClientRouteRenderer.tsx', 'RUNTIME_VIOLATION: PRE_EXISTING_CHANGE — pending API migration'],
  ['dsh/frontend/app-client/DshClientSurface.tsx', 'RUNTIME_VIOLATION: PRE_EXISTING_CHANGE — pending API migration'],
  ['dsh/frontend/app-client/hooks', 'RUNTIME_VIOLATION: Pending hooks migration to API-sourced state'],
  ['dsh/frontend/app-client/parts', 'RUNTIME_VIOLATION: Pending parts migration to API-sourced data'],
  ['dsh/frontend/app-client/screens/BenefitsScreen.tsx', 'RUNTIME_VIOLATION: Pending benefits/subscriptions/marketing API'],
  ['dsh/frontend/app-client/screens/DshOrderIssueHubScreen.tsx', 'RUNTIME_VIOLATION: Pending support API'],
  ['dsh/frontend/app-client/screens/DshTrackingScreen.tsx', 'RUNTIME_VIOLATION: Pending operational status API'],
  ['dsh/frontend/app-client/screens/NotificationsScreen.tsx', 'RUNTIME_VIOLATION: Pending notifications API'],
  ['dsh/frontend/app-client/screens/parts', 'RUNTIME_VIOLATION: Pending screen parts API migration'],
  // Control panel marketing/support/platform screens use preview data for display only — tolerated.
  ['dsh/frontend/control-panel/marketing', 'DEV_ALLOWED: Marketing preview display, tolerated until marketing API'],
  ['dsh/frontend/control-panel/support', 'DEV_ALLOWED: Support preview display, tolerated until support API'],
  ['dsh/frontend/control-panel/platform', 'DEV_ALLOWED: Platform preview display, tolerated until platform API'],
  ['dsh/frontend/control-panel/administration', 'DEV_ALLOWED: Admin preview display'],
  ['dsh/frontend/control-panel/shared', 'DEV_ALLOWED: Shared control panel preview types'],
  ['dsh/frontend/control-panel/catalogs', 'DEV_ALLOWED: Catalog preview display'],
  ['dsh/frontend/control-panel/partners', 'DEV_ALLOWED: Partners preview display'],
  ['dsh/frontend/control-panel/operations', 'DEV_ALLOWED: Operations preview display'],
]);

function isToleratedViolation(relPath) {
  // Exact match
  if (TOLERATED_VIOLATIONS.has(relPath)) return TOLERATED_VIOLATIONS.get(relPath);
  // Prefix match (for directory-level tolerations)
  for (const [key, reason] of TOLERATED_VIOLATIONS) {
    if (relPath.startsWith(key.replace(/\\/g, '/'))) return reason;
  }
  return null;
}

function isAllowedPath(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  return ALLOWED_PATH_PATTERNS.some(p => p.test(normalized));
}

function scanFile(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const violations = [];
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    for (const pattern of BANNED_IMPORT_PATTERNS) {
      if (pattern.test(line)) {
        violations.push({ line: idx + 1, text: line.trim() });
        break;
      }
    }
  });
  return violations;
}

function walkDir(dir, extensions) {
  const results = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      if (entry === 'node_modules' || entry === '.git' || entry === 'dist' || entry === 'build') continue;
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        results.push(...walkDir(full, extensions));
      } else if (extensions.includes(extname(entry))) {
        results.push(full);
      }
    }
  } catch {
    // ignore unreadable
  }
  return results;
}

const SCAN_ROOT = join(ROOT, 'dsh', 'frontend');
const FILES = walkDir(SCAN_ROOT, ['.ts', '.tsx', '.js', '.jsx']);

let newViolations = 0;
let toleratedCount = 0;
let cleanCount = 0;

const report = {
  new_violations: [],
  tolerated_violations: [],
  canonical_media_checks: [],
};

for (const file of FILES) {
  const relPath = relative(ROOT, file).replace(/\\/g, '/');

  if (isAllowedPath(relPath)) {
    cleanCount++;
    continue;
  }

  const violations = scanFile(file);
  if (violations.length === 0) {
    cleanCount++;
    continue;
  }

  const toleratedReason = isToleratedViolation(relPath);
  for (const v of violations) {
    if (toleratedReason) {
      toleratedCount++;
      report.tolerated_violations.push({ file: relPath, line: v.line, import: v.text, reason: toleratedReason });
    } else {
      newViolations++;
      report.new_violations.push({ file: relPath, line: v.line, import: v.text });
      console.error(`RUNTIME_VIOLATION_NEW: ${relPath}:${v.line}: ${v.text}`);
    }
  }
}

// Canonical media consistency check: look for hardcoded /media-fixtures/ URLs in runtime surfaces
const HARDCODED_PATTERN = /['"](\/media-fixtures\/[^'"]+)['"]/;
const RUNTIME_SURFACES = ['app-client', 'app-partner', 'app-captain', 'app-field'];

for (const surface of RUNTIME_SURFACES) {
  const surfaceDir = join(ROOT, 'dsh', 'frontend', surface);
  try {
    const surfaceFiles = walkDir(surfaceDir, ['.ts', '.tsx']);
    for (const file of surfaceFiles) {
      const content = readFileSync(file, 'utf8');
      if (HARDCODED_PATTERN.test(content)) {
        const relPath = relative(ROOT, file).replace(/\\/g, '/');
        report.canonical_media_checks.push({
          type: 'HARDCODED_FIXTURE_URL',
          file: relPath,
          severity: 'WARNING',
        });
        console.warn(`CANONICAL_WARN: hardcoded /media-fixtures/ URL in ${relPath}`);
      }
    }
  } catch {
    // surface dir may not exist yet
  }
}

console.log('\n=== MEDIA_CANONICAL_CONSISTENCY_CHECK REPORT ===');
console.log(`Files scanned:       ${FILES.length}`);
console.log(`Clean:               ${cleanCount}`);
console.log(`Tolerated violations: ${toleratedCount} (classified, pending API migration)`);
console.log(`NEW violations:      ${newViolations}`);
console.log(`Canonical warnings:  ${report.canonical_media_checks.length}`);

if (report.tolerated_violations.length > 0) {
  console.log('\nTolerated (classified):');
  for (const v of report.tolerated_violations.slice(0, 10)) {
    console.log(`  [TOLERATED] ${v.file}:${v.line} — ${v.reason}`);
  }
  if (report.tolerated_violations.length > 10) {
    console.log(`  ... and ${report.tolerated_violations.length - 10} more`);
  }
}

if (newViolations > 0) {
  console.error('\nNEW RUNTIME VIOLATIONS (must fix before marking DONE):');
  for (const v of report.new_violations) {
    console.error(`  [VIOLATION] ${v.file}:${v.line}: ${v.import}`);
  }
  process.exit(1);
}

console.log('\nRESULT: PASS — no new runtime violations from media-fixtures or preview-data.');
process.exit(0);
