/**
 * fix-design-tokens.mjs
 * Targeted design token fixes:
 * 1. Named color literals on specific identified files
 * 2. borderRadius exact-match numbers → radius.* tokens (across all files)
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const RADIUS_TOKEN_MAP = {
  4: 'radius.xxs',
  6: 'radius.xs',
  8: 'radius.xs2',
  10: 'radius.sm',
  12: 'radius.sm2',
  14: 'radius.md',
  16: 'radius.md2',
  18: 'radius.lg',
  20: 'radius.lg2',
  24: 'radius.xl',
  999: 'radius.pill',
};

let stats = { colorFixes: 0, radiusFixes: 0, importFixes: 0, filesChanged: 0 };

function applyRadiusTokens(src) {
  let out = src;
  for (const [num, token] of Object.entries(RADIUS_TOKEN_MAP)) {
    out = out.replace(
      new RegExp(`\\bborderRadius:\\s*${num}\\b`, 'g'),
      () => { stats.radiusFixes++; return `borderRadius: ${token}`; }
    );
  }
  return out;
}

function ensureRadiusImport(src) {
  // Check if radius is already imported from @bthwani/ui-kit
  if (/\bradius[,\s\}].*from\s*['"]@bthwani\/ui-kit['"]/.test(src)) return src;
  if (/from\s*['"]@bthwani\/ui-kit['"][^;]*\bradius\b/.test(src)) return src;

  // Check for import block pattern: import { ... } from '@bthwani/ui-kit';
  const importBlockRe = /import\s*\{([^}]+)\}\s*from\s*['"]@bthwani\/ui-kit['"]/;
  const m = importBlockRe.exec(src);
  if (!m) return src;

  // Add radius to the import list
  const importList = m[1];
  // Don't add if already there
  if (/\bradius\b/.test(importList)) return src;

  const newImportList = importList.trimEnd() + ',\n  radius,\n';
  stats.importFixes++;
  return src.replace(importBlockRe, `import {${newImportList}} from '@bthwani/ui-kit'`);
}

function globTsx(dir, acc = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return acc; }
  for (const e of entries) {
    const full = join(dir, e);
    let st;
    try { st = statSync(full); } catch { continue; }
    if (st.isDirectory()) {
      if (['node_modules', '.git', 'dist', '.next', '__generated__'].includes(e)) continue;
      globTsx(full, acc);
    } else if (e.endsWith('.tsx') || e.endsWith('.ts')) {
      acc.push(full.replace(/\\/g, '/'));
    }
  }
  return acc;
}

// ─── Targeted named color fixes ─────────────────────────────────────────────

function fixFile(filePath, transforms) {
  let src = readFileSync(filePath, 'utf8');
  const original = src;
  for (const { from, to } of transforms) {
    if (src.includes(from)) {
      src = src.split(from).join(to);
      stats.colorFixes++;
    }
  }
  src = applyRadiusTokens(src);
  if (src !== applyRadiusTokens(original) || src !== original) {
    if (/\bradius\.(none|xxs|xs2?|sm2?|md2?|lg2?|xl|pill)\b/.test(src)) {
      src = ensureRadiusImport(src);
    }
    if (src !== original) {
      writeFileSync(filePath, src, 'utf8');
      stats.filesChanged++;
      console.log(`  PATCHED: ${filePath.split('/').slice(-3).join('/')}`);
    }
  }
}

// 1. DshCaptainMapScreen.tsx — 'red'/'green' on Text → theme tokens
// Need to add useTheme import
fixFile('dsh/frontend/app-captain/screens/DshCaptainMapScreen.tsx', [
  {
    from: `import { Badge, Box, Button, KeyValueList, SectionHeader, Surface, Text } from '@bthwani/ui-kit';`,
    to:   `import { Badge, Box, Button, KeyValueList, SectionHeader, Surface, Text, useTheme } from '@bthwani/ui-kit';`,
  },
  // Replace color: 'red' with theme.danger — need to add theme destructure
  // First check: is useTheme already called? We'll add it in the component if needed.
  // Actually easier: just replace with the CSS string equivalent
  {
    from: `style={{ color: 'red', textAlign: 'right' }}`,
    to:   `tone="danger" style={{ textAlign: 'right' }}`,
  },
  {
    from: `style={{ color: 'green', textAlign: 'right' }}`,
    to:   `tone="success" style={{ textAlign: 'right' }}`,
  },
]);

// 2. Control-panel web files — 'white' on HTML elements → CSS var
// These are web files where 'white' is CSS applied to <button> etc.
const whiteFiles = [
  'dsh/frontend/control-panel/operations/ExceptionsEscalationsScreen.tsx',
  'dsh/frontend/control-panel/operations/AreaCapacityScreen.tsx',
  'dsh/frontend/control-panel/operations/LiveOrdersScreen.tsx',
  'wlt/frontend/dsh/control-panel/components/WltDshRealtimeLedger.tsx',
];

for (const f of whiteFiles) {
  fixFile(f, [
    { from: `color: 'white',`, to: `color: 'var(--bthwani-brand-contrast)',` },
    { from: `color: 'white' `, to: `color: 'var(--bthwani-brand-contrast)' ` },
    { from: `color: 'white'\n`, to: `color: 'var(--bthwani-brand-contrast)'\n` },
  ]);
}

// 3. AuditCloseScreen — '#ffffff' → CSS var
fixFile('wlt/frontend/dsh/control-panel/screens/AuditCloseScreen.tsx', [
  { from: `'#ffffff'`, to: `'var(--bthwani-brand-contrast)'` },
  { from: `'#FFFFFF'`, to: `'var(--bthwani-brand-contrast)'` },
]);

// ─── borderRadius tokenization for all remaining files ───────────────────────
console.log('\nRunning borderRadius tokenization across all files...');
const allFiles = globTsx('dsh/frontend').concat(globTsx('wlt/frontend'));

for (const f of allFiles) {
  let src;
  try { src = readFileSync(f, 'utf8'); } catch { continue; }
  const original = src;

  const patched = applyRadiusTokens(src);
  if (patched !== original) {
    const withImport = ensureRadiusImport(patched);
    writeFileSync(f, withImport, 'utf8');
    stats.filesChanged++;
  }
}

console.log('\n=== Design Token Fixes ===');
console.log(`Color/named fixes: ${stats.colorFixes}`);
console.log(`Radius tokenizations: ${stats.radiusFixes}`);
console.log(`Import additions: ${stats.importFixes}`);
console.log(`Files changed: ${stats.filesChanged}`);
