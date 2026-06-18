import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// radius token values that have exact mappings
const RADIUS_MAP = { 0: 'none', 6: 'xs', 10: 'sm', 14: 'md', 18: 'lg', 24: 'xl', 999: 'pill' };

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

const files = globTsx('dsh/frontend').concat(globTsx('wlt/frontend'));

const exactMatches = {};
const nonExactByValue = {};
let totalExact = 0;
let totalNonExact = 0;

for (const f of files) {
  let src;
  try { src = readFileSync(f, 'utf8'); } catch { continue; }

  const re = /borderRadius\s*:\s*(\d+)/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const n = parseInt(m[1]);
    if (RADIUS_MAP[n] !== undefined) {
      exactMatches[n] = (exactMatches[n] || 0) + 1;
      totalExact++;
    } else if (n > 0) {
      nonExactByValue[n] = (nonExactByValue[n] || 0) + 1;
      totalNonExact++;
    }
  }
}

console.log('=== EXACT MATCH borderRadius values (safe to tokenize) ===');
Object.entries(RADIUS_MAP).forEach(([n, name]) => {
  const c = exactMatches[n] || 0;
  if (c > 0) console.log(`  borderRadius: ${n} → radius.${name} : ${c} instances`);
});
console.log(`Total exact matches: ${totalExact}`);

console.log('\n=== NON-EXACT borderRadius values (need design decision) ===');
Object.entries(nonExactByValue).sort((a,b) => b[1]-a[1]).forEach(([n, c]) => {
  const closest = Object.keys(RADIUS_MAP).map(k => parseInt(k)).sort((a,b) => Math.abs(a-parseInt(n)) - Math.abs(b-parseInt(n)))[0];
  console.log(`  borderRadius: ${n.padStart(3)} → closest: radius.${RADIUS_MAP[closest]} (${closest}) : ${c} instances`);
});
console.log(`Total non-exact: ${totalNonExact}`);
