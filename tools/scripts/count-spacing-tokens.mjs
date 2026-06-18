import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// spacing token values (rawSpacingScale)
// spacing[N] = value
const SPACING_MAP = {
  0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 14: 56, 16: 64
};
const SPACING_VALUE_SET = new Set(Object.values(SPACING_MAP));
const VALUE_TO_KEY = {};
for (const [k, v] of Object.entries(SPACING_MAP)) VALUE_TO_KEY[v] = k;

const SPACING_PROPS = [
  'padding', 'paddingHorizontal', 'paddingVertical', 'paddingTop', 'paddingBottom',
  'paddingLeft', 'paddingRight', 'paddingStart', 'paddingEnd',
  'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
  'marginStart', 'marginEnd', 'gap', 'rowGap', 'columnGap',
];

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

const exactByValue = {};
const nonExactByValue = {};
let totalExact = 0;
let totalNonExact = 0;

const propPattern = new RegExp(
  `\\b(${SPACING_PROPS.join('|')})\\s*:\\s*(\\d+)\\b`,
  'g'
);

for (const f of files) {
  // Skip web control-panel files (CSS string values)
  if (f.includes('/control-panel/')) continue;

  let src;
  try { src = readFileSync(f, 'utf8'); } catch { continue; }

  let m;
  propPattern.lastIndex = 0;
  while ((m = propPattern.exec(src)) !== null) {
    const n = parseInt(m[2]);
    // Skip 0, 1, 2, 3 — these are fine as-is for minimal adjustments
    if (n <= 3) continue;

    if (SPACING_VALUE_SET.has(n)) {
      exactByValue[n] = (exactByValue[n] || 0) + 1;
      totalExact++;
    } else {
      nonExactByValue[n] = (nonExactByValue[n] || 0) + 1;
      totalNonExact++;
    }
  }
}

console.log('=== EXACT MATCH spacing values (safe to tokenize) ===');
Object.entries(SPACING_MAP)
  .filter(([k, v]) => v > 3 && exactByValue[v])
  .forEach(([k, v]) => {
    console.log(`  spacing prop ${v} → spacing[${k}] : ${exactByValue[v]} instances`);
  });
console.log(`Total exact matches: ${totalExact}`);

console.log('\n=== NON-EXACT spacing values (custom/in-between) ===');
Object.entries(nonExactByValue).sort((a,b) => b[1]-a[1]).slice(0, 15).forEach(([n, c]) => {
  const vals = Object.values(SPACING_MAP).filter(v => v > 0);
  const closest = vals.sort((a,b) => Math.abs(a-parseInt(n)) - Math.abs(b-parseInt(n)))[0];
  const closestKey = VALUE_TO_KEY[closest];
  console.log(`  ${n.toString().padStart(3)} → closest spacing[${closestKey}]=${closest} : ${c} instances`);
});
console.log(`Total non-exact: ${totalNonExact}`);
