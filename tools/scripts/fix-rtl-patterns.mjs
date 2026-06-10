/**
 * fix-rtl-patterns.mjs
 * Converts manual RTL direction checks to Box layoutDirection="row".
 * Targets: direction === 'rtl' ? 'row-reverse' : 'row' patterns
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

let stats = { filesChanged: 0, replacements: 0 };

// Only target React Native files (not control-panel web)
const files = glob('dsh/frontend')
  .concat(glob('wlt/frontend'))
  .filter(f => !f.includes('/control-panel/') && !f.includes('/ui-kit/'));

for (const f of files) {
  let src;
  try { src = readFileSync(f, 'utf8'); } catch { continue; }
  const original = src;

  // Remove: const rowDirection = direction === 'rtl' ? 'row-reverse' : 'row';
  src = src.replace(/[ \t]*const rowDirection = direction === ['"]rtl['"] \? ['"]row-reverse['"] : ['"]row['"];\n/g, '');

  // Replace in Box style: flexDirection: direction === 'rtl' ? 'row-reverse' : 'row'
  // Pattern A: <Box style={{ flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', ...rest }}>
  src = src.replace(
    /<Box(\s[^>]*)?\s+style=\{\{\s*flexDirection:\s*direction\s*===\s*['"]rtl['"]\s*\?\s*['"]row-reverse['"]\s*:\s*['"]row['"],?\s*([^}]*)\}\}/g,
    (match, extraProps, rest) => {
      const ep = extraProps ? extraProps.trim() : '';
      const cleanRest = rest.trim().replace(/,\s*$/, '').trim();
      stats.replacements++;
      if (!cleanRest) {
        return `<Box${ep ? ' ' + ep : ''} layoutDirection="row"`;
      }
      return `<Box${ep ? ' ' + ep : ''} layoutDirection="row" style={{ ${cleanRest} }}`;
    }
  );

  // Pattern B: flexDirection: rowDirection (after const was removed)
  src = src.replace(
    /<Box(\s[^>]*)?\s+style=\{\{\s*flexDirection:\s*rowDirection,?\s*([^}]*)\}\}/g,
    (match, extraProps, rest) => {
      const ep = extraProps ? extraProps.trim() : '';
      const cleanRest = rest.trim().replace(/,\s*$/, '').trim();
      stats.replacements++;
      if (!cleanRest) {
        return `<Box${ep ? ' ' + ep : ''} layoutDirection="row"`;
      }
      return `<Box${ep ? ' ' + ep : ''} layoutDirection="row" style={{ ${cleanRest} }}`;
    }
  );

  // Pattern C: style={{ ...stuff, flexDirection: direction === 'rtl' ? 'row-reverse' : 'row' }} (flexDirection at end)
  src = src.replace(
    /<Box(\s[^>]*)?\s+style=\{\{([^}]*),\s*flexDirection:\s*direction\s*===\s*['"]rtl['"]\s*\?\s*['"]row-reverse['"]\s*:\s*['"]row['"]\s*\}\}/g,
    (match, extraProps, before) => {
      const ep = extraProps ? extraProps.trim() : '';
      const cleanBefore = before.trim().replace(/,\s*$/, '').trim();
      stats.replacements++;
      if (!cleanBefore) {
        return `<Box${ep ? ' ' + ep : ''} layoutDirection="row"`;
      }
      return `<Box${ep ? ' ' + ep : ''} layoutDirection="row" style={{ ${cleanBefore} }}`;
    }
  );

  if (src !== original) {
    writeFileSync(f, src, 'utf8');
    stats.filesChanged++;
    console.log(`  PATCHED: ${f.split('/').slice(-3).join('/')}`);
  }
}

console.log(`\n=== RTL Pattern Fixes ===`);
console.log(`Replacements: ${stats.replacements}`);
console.log(`Files changed: ${stats.filesChanged}`);
