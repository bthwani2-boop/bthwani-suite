/**
 * fix-local-dividers.mjs
 * Replaces local divider patterns with central <Divider> component.
 * Pattern: StyleSheet key `divider: { height: 1, backgroundColor: ... }`
 * + consumer `<View style={styles.divider} />`
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
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
    } else if (n.endsWith('.tsx')) {
      acc.push(f.replace(/\\/g, '/'));
    }
  }
  return acc;
}

let stats = { dividerReplacements: 0, dividerStylesRemoved: 0, importAdds: 0, filesChanged: 0 };

function ensureDividerImport(src) {
  if (/\bDivider\b.*from\s*['"]@bthwani\/ui-kit['"]/.test(src)) return src;

  const importBlockRe = /import\s*\{([^}]+)\}\s*from\s*['"]@bthwani\/ui-kit['"]/;
  const m = importBlockRe.exec(src);
  if (!m) return src;

  const importList = m[1];
  if (/\bDivider\b/.test(importList)) return src;

  const newList = importList.trimEnd().replace(/,?\s*$/, ',') + '\n  Divider,\n';
  stats.importAdds++;
  return src.replace(importBlockRe, `import {${newList}} from '@bthwani/ui-kit'`);
}

const files = glob('dsh/frontend').concat(glob('wlt/frontend'))
  .filter(f => !f.includes('/control-panel/') && !f.includes('/ui-kit/'));

for (const f of files) {
  let src;
  try { src = readFileSync(f, 'utf8'); } catch { continue; }
  const original = src;

  // Check if this file has a local divider style AND uses it as a View separator
  // Pattern 1: StyleSheet with divider: { height: 1 } or separator: { height: 1 }
  const hasDividerStyle = /\b(divider|separator|sectionDivider|lineDivider)\s*:\s*\{[^}]*height\s*:\s*1\b[^}]*\}/g.test(src);
  const hasDividerView = /<View\s+style=\{styles\.(divider|separator|sectionDivider|lineDivider)\}\s*\/>/.test(src);

  if (!hasDividerStyle || !hasDividerView) continue;
  if (src.includes('Divider')) continue; // Already uses Divider

  // Replace <View style={styles.divider} /> with <Divider />
  let patched = src.replace(
    /<View\s+style=\{styles\.(divider|separator|sectionDivider|lineDivider)\}\s*\/>/g,
    (m) => { stats.dividerReplacements++; return '<Divider />'; }
  );

  // Remove the divider StyleSheet key (simplistic — only single-line or few-line patterns)
  patched = patched.replace(
    /\s*(divider|separator|sectionDivider|lineDivider)\s*:\s*\{[^}]*height\s*:\s*1\b[^}]*\},?\s*/g,
    (m) => { stats.dividerStylesRemoved++; return '\n'; }
  );

  if (patched !== original) {
    patched = ensureDividerImport(patched);
    // Fix double-comma
    patched = patched.replace(/,,/g, ',');
    writeFileSync(f, patched, 'utf8');
    stats.filesChanged++;
    console.log(`  PATCHED: ${f.split('/').slice(-3).join('/')}`);
  }
}

console.log(`\n=== Local Divider Fixes ===`);
console.log(`Divider replacements: ${stats.dividerReplacements}`);
console.log(`Divider styles removed: ${stats.dividerStylesRemoved}`);
console.log(`Import additions: ${stats.importAdds}`);
console.log(`Files changed: ${stats.filesChanged}`);
