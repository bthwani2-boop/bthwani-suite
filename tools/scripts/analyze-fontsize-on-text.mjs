/**
 * analyze-fontsize-on-text.mjs
 * Finds <Text> components with both a `role` prop and an inline `fontSize` style override.
 * These are candidates for migration to a more appropriate role or removal of the fontSize.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function globTsx(dir, acc = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return acc; }
  for (const e of entries) {
    const full = join(dir, e);
    let st;
    try { st = statSync(full); } catch { continue; }
    if (st.isDirectory()) {
      if (e === 'node_modules' || e === '.git' || e === 'dist' || e === '.next') continue;
      globTsx(full, acc);
    } else if (e.endsWith('.tsx') || e.endsWith('.ts')) {
      acc.push(full);
    }
  }
  return acc;
}

const roots = [
  'dsh/frontend',
  'wlt/frontend',
  'app-client/runtime',
  'app-partner/runtime',
  'app-captain/runtime',
  'app-field/runtime',
  'ui-kit/src',
];

const files = roots.flatMap(r => globTsx(r));

const results = [];

for (const f of files) {
  let src;
  try { src = readFileSync(f, 'utf8'); } catch { continue; }
  const lines = src.split('\n');

  // Find <Text ... role="..." ... fontSize: N ...> across 1-5 lines
  // Simple heuristic: look for <Text on a line, then scan forward up to 6 lines
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!/<Text\b/.test(line)) continue;

    // Gather the Text tag span (up to 8 lines)
    const span = lines.slice(i, i + 8).join('\n');
    const hasRole = /\brole=["']/.test(span);
    const hasFontSize = /fontSize\s*[:=]\s*\d+/.test(span);

    if (hasRole && hasFontSize) {
      // Extract role value
      const roleMatch = span.match(/\brole=["']([^"']+)["']/);
      const role = roleMatch ? roleMatch[1] : '?';
      // Extract fontSize value
      const fsMatch = span.match(/fontSize\s*[:=]\s*(\d+)/);
      const fs = fsMatch ? fsMatch[1] : '?';
      results.push({ file: f.replace(/\\/g, '/'), line: i + 1, role, fontSize: Number(fs) });
    }
  }
}

// Group by role + fontSize
const grouped = {};
for (const r of results) {
  const k = `role="${r.role}" fontSize=${r.fontSize}`;
  if (!grouped[k]) grouped[k] = [];
  grouped[k].push(`${r.file}:${r.line}`);
}

console.log(`=== fontSize overrides on <Text role="..."> ===`);
console.log(`Total instances: ${results.length}\n`);

// Sort by count desc
const sorted = Object.entries(grouped).sort((a, b) => b[1].length - a[1].length);
for (const [k, locs] of sorted) {
  console.log(`[${locs.length}] ${k}`);
  locs.slice(0, 3).forEach(l => {
    const parts = l.split('/');
    console.log(`    ${parts.slice(-3).join('/')}`);
  });
  if (locs.length > 3) console.log(`    ...and ${locs.length - 3} more`);
}

// Summary by area
console.log('\n=== By area ===');
const byArea = {};
for (const r of results) {
  const parts = r.file.split('/');
  const area = parts.slice(0, 3).join('/');
  byArea[area] = (byArea[area] || 0) + 1;
}
Object.entries(byArea).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>console.log(v, k));
