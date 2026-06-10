/**
 * audit-rtl-patterns.mjs
 * RTL correctness audit per section 3.14 of the closure plan:
 * - Arabic text right-aligned unless hero/headline intentional
 * - icon + label same right cluster
 * - Avoid space-between that separates icons from text
 * - No raw textAlign: 'left' in Arabic content
 * - flexDirection: 'row' without RTL-aware resolveRowDirection
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function glob(dir, acc = []) {
  let e;
  try { e = readdirSync(dir); } catch { return acc; }
  for (const n of e) {
    const f = join(dir, n);
    let s;
    try { s = statSync(f); } catch { continue; }
    if (s.isDirectory()) {
      if (['node_modules', '.git', 'dist', '.next', '__generated__'].includes(n)) continue;
      glob(f, acc);
    } else if (n.endsWith('.tsx') || n.endsWith('.ts')) {
      acc.push(f.replace(/\\/g, '/'));
    }
  }
  return acc;
}

const appFiles = glob('dsh/frontend').concat(glob('wlt/frontend'))
  .filter(f => !f.includes('/control-panel/') && !f.includes('/ui-kit/'));

const findings = {
  hardcodedLeft: [],    // textAlign: 'left' (wrong for RTL)
  hardcodedRow: [],     // flexDirection: 'row' without resolveRowDirection check
  noRtlRow: [],         // file uses flexDirection row but no resolveRowDirection or I18nManager
};

for (const f of appFiles) {
  let src;
  try { src = readFileSync(f, 'utf8'); } catch { continue; }
  if (!src.includes('.tsx')) {
    // Only .tsx files for RTL layout
    if (!f.endsWith('.tsx')) continue;
  }
  const short = f.split('/').slice(-4).join('/');

  // textAlign: 'left' — dangerous in RTL context
  const leftMatches = (src.match(/textAlign\s*:\s*['"]left['"]/g) || []).length;
  if (leftMatches > 0) {
    findings.hardcodedLeft.push({ file: short, count: leftMatches });
  }

  // flexDirection: 'row' hardcoded (not via resolveRowDirection)
  const rowMatches = (src.match(/flexDirection\s*:\s*['"]row['"]/g) || []).length;
  const hasResolveRowDirection = src.includes('resolveRowDirection');
  const hasI18nManager = src.includes('I18nManager');
  const hasDirectionProp = src.includes('direction') || src.includes('isRTL');

  if (rowMatches > 0) {
    findings.hardcodedRow.push({
      file: short,
      rowCount: rowMatches,
      hasRtlAware: hasResolveRowDirection || hasI18nManager || hasDirectionProp,
      hasResolveRowDirection,
    });
  }
}

// Sort by count
const sortByCount = arr => arr.sort((a, b) => (b.count || b.rowCount) - (a.count || a.rowCount));

console.log('=== RTL PATTERN AUDIT ===\n');

console.log(`[1] textAlign: 'left' (potential RTL violations) — ${findings.hardcodedLeft.length} files`);
sortByCount(findings.hardcodedLeft).slice(0, 15).forEach(r =>
  console.log(`  ${r.count} ${r.file}`)
);

const noRtlAware = findings.hardcodedRow.filter(r => !r.hasRtlAware);
const hasRtlAware = findings.hardcodedRow.filter(r => r.hasRtlAware && !r.hasResolveRowDirection);

console.log(`\n[2] flexDirection: 'row' without resolveRowDirection — ${noRtlAware.length} files`);
noRtlAware.slice(0, 15).forEach(r =>
  console.log(`  ${r.rowCount} rows ${r.file}`)
);

console.log(`\n[3] flexDirection: 'row' with direction check but no resolveRowDirection — ${hasRtlAware.length} files`);
hasRtlAware.slice(0, 10).forEach(r =>
  console.log(`  ${r.rowCount} rows ${r.file}`)
);

console.log(`\n[✓] files using resolveRowDirection: ${findings.hardcodedRow.filter(r => r.hasResolveRowDirection).length}`);
