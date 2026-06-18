/**
 * fix-spacing-tokens.mjs
 * Tokenizes exact-match spacing values in React Native style objects.
 * Only targets numeric values (no CSS px strings).
 * Skips control-panel web files.
 *
 * spacing[N] = value:
 *   [1]=4, [2]=8, [3]=12, [4]=16, [5]=20, [6]=24, [8]=32, [10]=40, [12]=48
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Only tokenize values ≥ 4 to avoid false positives with tiny constants like gap:1
const SPACING_TOKEN = {
  4: 'spacing[1]',
  8: 'spacing[2]',
  12: 'spacing[3]',
  16: 'spacing[4]',
  20: 'spacing[5]',
  24: 'spacing[6]',
  32: 'spacing[8]',
  40: 'spacing[10]',
  48: 'spacing[12]',
  56: 'spacing[14]',
  64: 'spacing[16]',
};

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

function ensureSpacingImport(src) {
  if (/\bspacing\b.*from\s*['"]@bthwani\/ui-kit['"]/.test(src)) return src;

  const importBlockRe = /import\s*\{([^}]+)\}\s*from\s*['"]@bthwani\/ui-kit['"]/;
  const m = importBlockRe.exec(src);
  if (!m) return src;

  const importList = m[1];
  if (/\bspacing\b/.test(importList)) return src;

  const newList = importList.trimEnd().replace(/,?\s*$/, ',') + '\n  spacing,\n';
  return src.replace(importBlockRe, `import {${newList}} from '@bthwani/ui-kit'`);
}

const propPattern = new RegExp(
  `\\b(${SPACING_PROPS.join('|')})\\s*:\\s*(${Object.keys(SPACING_TOKEN).join('|')})\\b`,
  'g'
);

let stats = { tokenizations: 0, importFixes: 0, filesChanged: 0 };

const files = globTsx('dsh/frontend').concat(globTsx('wlt/frontend'));

for (const f of files) {
  // Skip web control-panel files (use CSS string values not RN numbers)
  if (f.includes('/control-panel/')) continue;

  let src;
  try { src = readFileSync(f, 'utf8'); } catch { continue; }
  const original = src;

  let patched = src;
  propPattern.lastIndex = 0;

  // Replace exact matches
  patched = patched.replace(
    new RegExp(
      `\\b(${SPACING_PROPS.join('|')})\\s*:\\s*(${Object.keys(SPACING_TOKEN).join('|')})\\b`,
      'g'
    ),
    (m, prop, val) => {
      // Don't replace if inside a CSS string ('8px' would be caught without the quote check)
      // The regex already requires no quotes, so this is safe
      stats.tokenizations++;
      return `${prop}: ${SPACING_TOKEN[val]}`;
    }
  );

  if (patched !== original) {
    // Ensure spacing is imported
    const withImport = ensureSpacingImport(patched);
    if (withImport !== patched) stats.importFixes++;
    writeFileSync(f, withImport, 'utf8');
    stats.filesChanged++;
  }
}

console.log('=== Spacing Token Fixes ===');
console.log(`Tokenizations: ${stats.tokenizations}`);
console.log(`Import additions: ${stats.importFixes}`);
console.log(`Files changed: ${stats.filesChanged}`);
