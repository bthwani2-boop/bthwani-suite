/**
 * fix-radius-extended.mjs
 * Tokenizes common non-exact borderRadius values now that new tokens exist:
 * xxs=4, xs2=8, sm2=12, md2=16, lg2=20
 * Skips control-panel web files (they use CSS string values).
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
    } else if (n.endsWith('.tsx') || n.endsWith('.ts')) {
      acc.push(f.replace(/\\/g, '/'));
    }
  }
  return acc;
}

// New token map (only the new additions — existing ones already handled)
const NEW_RADIUS_MAP = {
  4: 'radius.xxs',
  8: 'radius.xs2',
  12: 'radius.sm2',
  16: 'radius.md2',
  20: 'radius.lg2',
};

let stats = { replacements: 0, importAdds: 0, filesChanged: 0 };

function ensureRadiusImport(src) {
  if (/\bradius\b/.test(src.match(/from\s*['"]@bthwani\/ui-kit['"]/)?.[0] ?? '') ||
      /import\s*\{[^}]*\bradius\b[^}]*\}\s*from\s*['"]@bthwani\/ui-kit['"]/.test(src)) {
    return src;
  }
  const importBlockRe = /import\s*\{([^}]+)\}\s*from\s*['"]@bthwani\/ui-kit['"]/;
  const m = importBlockRe.exec(src);
  if (!m) return src;
  if (/\bradius\b/.test(m[1])) return src;
  const newList = m[1].trimEnd().replace(/,?\s*$/, ',') + '\n  radius,\n';
  stats.importAdds++;
  return src.replace(importBlockRe, `import {${newList}} from '@bthwani/ui-kit'`);
}

// Skip control-panel (web CSS) and ui-kit itself
const files = glob('dsh/frontend')
  .concat(glob('wlt/frontend'))
  .filter(f => !f.includes('/control-panel/') && !f.includes('/ui-kit/'));

for (const f of files) {
  let src;
  try { src = readFileSync(f, 'utf8'); } catch { continue; }
  const original = src;

  for (const [num, token] of Object.entries(NEW_RADIUS_MAP)) {
    src = src.replace(
      new RegExp(`\\bborderRadius:\\s*${num}\\b`, 'g'),
      (m) => { stats.replacements++; return `borderRadius: ${token}`; }
    );
  }

  if (src !== original) {
    // Fix double-comma
    src = src.replace(/,,/g, ',');
    src = ensureRadiusImport(src);
    writeFileSync(f, src, 'utf8');
    stats.filesChanged++;
    console.log(`  PATCHED: ${f.split('/').slice(-3).join('/')}`);
  }
}

console.log(`\n=== Extended Radius Tokenization ===`);
console.log(`Replacements: ${stats.replacements}`);
console.log(`Import additions: ${stats.importAdds}`);
console.log(`Files changed: ${stats.filesChanged}`);
