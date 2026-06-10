/**
 * audit-component-duplication.mjs
 * Finds local implementations of components that should come from @bthwani/ui-kit:
 * - Local StatusBadge/StatusTag/StatusChip patterns
 * - Local Divider/separator implementations
 * - Local skeleton/loading patterns
 * - Local currency formatting functions
 * - Duplicate status label maps across surfaces
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
      if (['node_modules', '.git', 'dist', '.next'].includes(n)) continue;
      glob(f, acc);
    } else if (n.endsWith('.tsx') || n.endsWith('.ts')) {
      acc.push(f.replace(/\\/g, '/'));
    }
  }
  return acc;
}

const files = glob('dsh/frontend').concat(glob('wlt/frontend'))
  .filter(f => !f.includes('/ui-kit/'));

const findings = {
  localStatusLabel: [],   // local status label maps (should be central)
  localCurrencyFormat: [], // local currency format functions
  localDivider: [],        // local divider/separator implementations
  localLoadingSkeleton: [], // local loading skeleton patterns
  localCardPattern: [],    // local Card-like patterns
  duplicateOrderStates: [], // order state handling that duplicates across surfaces
};

for (const f of files) {
  let src;
  try { src = readFileSync(f, 'utf8'); } catch { continue; }
  const short = f.split('/').slice(-4).join('/');

  // Local status label maps
  if (/const\s+\w*[Ss]tatus\w*(?:[Ll]abel|[Mm]ap|[Tt]ext)\s*[=:]\s*\{/.test(src) ||
      /statusLabels?\s*[=:]\s*\{/.test(src)) {
    findings.localStatusLabel.push(short);
  }

  // Local currency format functions (outside WLT)
  if (/function\s+\w*(?:format|Format)(?:Currency|Yer|Money|Amount|Price)\b/.test(src) &&
      !f.includes('/wlt/') && !f.includes('/financeContracts')) {
    findings.localCurrencyFormat.push(short);
  }

  // Local loading skeleton patterns (ActivityIndicator without StateView)
  if (/ActivityIndicator/.test(src) && !src.includes('StateView')) {
    findings.localLoadingSkeleton.push(short);
  }

  // Local standalone divider (View with height:1 + backgroundColor — should use <Divider />)
  // borderBottomWidth is an intentional row-separator border, not a standalone divider
  if (/height:\s*1\b.*backgroundColor/.test(src) &&
      !src.includes('Divider') && f.endsWith('.tsx')) {
    findings.localDivider.push(short);
  }

  // Duplicate order status strings across surfaces (same strings in multiple files)
  if (/['"](PENDING|PREPARING|READY|ON_THE_WAY|DELIVERED|CANCELLED|REJECTED)['"]/g.test(src) &&
      src.includes('color') && !f.includes('/data/') && !f.includes('/contracts/') && !f.includes('/shared/')) {
    findings.duplicateOrderStates.push(short);
  }
}

console.log('=== COMPONENT DUPLICATION AUDIT ===\n');
for (const [k, v] of Object.entries(findings)) {
  if (v.length === 0) continue;
  console.log(`[${v.length}] ${k}:`);
  v.slice(0, 10).forEach(f => console.log('  ', f));
  if (v.length > 10) console.log(`  ...and ${v.length - 10} more`);
  console.log('');
}
