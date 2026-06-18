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

const files = glob('dsh/frontend').concat(glob('wlt/frontend'));
const report = {};

for (const f of files) {
  let src;
  try { src = readFileSync(f, 'utf8'); } catch { continue; }
  const short = f.split('/').slice(-4).join('/');

  if (/const\s+colors\s*[=:]\s*\{/.test(src)) {
    (report.localColorObj = report.localColorObj || []).push(short);
  }
  if (/const\s+COLORS\s*[=:]\s*\{/.test(src)) {
    (report.capsColorObj = report.capsColorObj || []).push(short);
  }
  if (/const\s+(STATUS|ORDER|PHASE|STAGE|TYPE)_COLORS?\s*[=:]\s*\{/.test(src)) {
    (report.statusColorMap = report.statusColorMap || []).push(short);
  }
  if (/const\s+(ACCENT|ACCENT_COLOR|BRAND_COLOR|PRIMARY_COLOR)\s*=\s*['"]#/.test(src)) {
    (report.localBrandHex = report.localBrandHex || []).push(short);
  }
  // Screens that still use manual lineHeight in style (possible typography drift)
  if (/lineHeight\s*:\s*\d+/.test(src) && !f.includes('/ui-kit/')) {
    (report.rawLineHeight = report.rawLineHeight || []).push(short);
  }
  // Local 'createStyles' or 'makeStyles'
  if (/function\s+createStyles|const\s+createStyles\s*=|function\s+makeStyles/.test(src)) {
    (report.localStyleFactory = report.localStyleFactory || []).push(short);
  }
  // Local StateView-like patterns NOT using StateView
  if (/justifyContent.*center.*alignItems.*center/.test(src) && !src.includes('StateView') && f.includes('/screens/')) {
    (report.manualCenterLayout = report.manualCenterLayout || []).push(short);
  }
}

for (const [k, v] of Object.entries(report)) {
  console.log(`\n[${v.length}] ${k}:`);
  v.slice(0, 10).forEach(f => console.log('  ', f));
  if (v.length > 10) console.log(`  ...and ${v.length - 10} more`);
}
