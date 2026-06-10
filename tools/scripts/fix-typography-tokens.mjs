/**
 * fix-typography-tokens.mjs
 * Replaces raw fontWeight strings and exact-match fontSize numbers
 * in mobile React Native files with ui-kit typographyRoles tokens.
 *
 * fontWeight: '600' → fontWeight: fontWeights.semibold
 * fontSize: 12      → fontSize: typographyRoles.caption.fontSize
 *
 * Skips: control-panel (web CSS), ui-kit itself, wlt transport, generated files.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function glob(dir, acc = []) {
  let e; try { e = readdirSync(dir); } catch { return acc; }
  for (const n of e) {
    const f = join(dir, n);
    let s; try { s = statSync(f); } catch { continue; }
    if (s.isDirectory()) {
      if (['node_modules', '.git', 'dist', '.next', '__generated__'].includes(n)) continue;
      glob(f, acc);
    } else if (n.endsWith('.tsx') || n.endsWith('.ts')) {
      acc.push(f.replace(/\\/g, '/'));
    }
  }
  return acc;
}

// fontWeight string → fontWeights token
const FONT_WEIGHT_MAP = {
  "'400'": 'fontWeights.regular',
  '"400"': 'fontWeights.regular',
  "'500'": 'fontWeights.medium',
  '"500"': 'fontWeights.medium',
  "'600'": 'fontWeights.semibold',
  '"600"': 'fontWeights.semibold',
  "'700'": 'fontWeights.bold',
  '"700"': 'fontWeights.bold',
  "'800'": 'fontWeights.black',
  '"800"': 'fontWeights.black',
};

// fontSize exact number → typographyRoles token (only exact matches from the scale)
const FONT_SIZE_MAP = {
  11: 'typographyRoles.overline.fontSize',
  12: 'typographyRoles.caption.fontSize',
  13: 'typographyRoles.label.fontSize',
  14: 'typographyRoles.bodySm.fontSize',
  15: 'typographyRoles.bodyMd.fontSize',
  17: 'typographyRoles.bodyLg.fontSize',
  18: 'typographyRoles.titleSm.fontSize',
  20: 'typographyRoles.titleMd.fontSize',
  24: 'typographyRoles.titleLg.fontSize',
  28: 'typographyRoles.titleXl.fontSize',
  30: 'typographyRoles.hero.fontSize',
  34: 'typographyRoles.displayLg.fontSize',
  40: 'typographyRoles.displayXl.fontSize',
};

// lineHeight exact number → typographyRoles token (exact matches)
const LINE_HEIGHT_MAP = {
  15: 'typographyRoles.overline.lineHeight',
  16: 'typographyRoles.caption.lineHeight',
  17: 'typographyRoles.label.lineHeight',
  18: 'typographyRoles.titleSm.lineHeight',
  20: 'typographyRoles.bodySm.lineHeight',
  23: 'typographyRoles.bodyMd.lineHeight',
  24: 'typographyRoles.titleSm.lineHeight',
  26: 'typographyRoles.bodyLg.lineHeight',
  27: 'typographyRoles.titleMd.lineHeight',
  30: 'typographyRoles.titleLg.lineHeight',
  36: 'typographyRoles.hero.lineHeight',
  40: 'typographyRoles.displayLg.lineHeight',
  46: 'typographyRoles.displayXl.lineHeight',
};

const files = glob('dsh/frontend').concat(glob('wlt/frontend')).filter(f =>
  !f.includes('/control-panel/') &&
  !f.includes('/ui-kit/') &&
  !f.includes('transport') &&
  !f.includes('.stories.') &&
  !f.includes('.spec.') &&
  !f.includes('.test.')
);

let stats = { fontWeightFixes: 0, fontSizeFixes: 0, lineHeightFixes: 0, importFixes: 0, filesChanged: 0 };

function ensureTypographyImports(src, needFontWeights, needTypographyRoles) {
  const importBlockRe = /import\s*\{([^}]+)\}\s*from\s*['"]@bthwani\/ui-kit['"]/;
  const m = importBlockRe.exec(src);
  if (!m) return src;

  let list = m[1];
  let changed = false;

  if (needFontWeights && !/\bfontWeights\b/.test(list)) {
    list = list.trimEnd().replace(/,?\s*$/, ',') + '\n  fontWeights,\n';
    changed = true;
    stats.importFixes++;
  }
  if (needTypographyRoles && !/\btypographyRoles\b/.test(list)) {
    list = list.trimEnd().replace(/,?\s*$/, ',') + '\n  typographyRoles,\n';
    changed = true;
    stats.importFixes++;
  }
  if (!changed) return src;
  return src.replace(importBlockRe, `import {${list}} from '@bthwani/ui-kit'`);
}

for (const f of files) {
  let src; try { src = readFileSync(f, 'utf8'); } catch { continue; }
  const original = src;

  // fontWeight string replacements
  for (const [from, to] of Object.entries(FONT_WEIGHT_MAP)) {
    const re = new RegExp(`\\bfontWeight:\\s*${from.replace(/'/g, "'")}`, 'g');
    const next = src.replace(re, () => { stats.fontWeightFixes++; return `fontWeight: ${to}`; });
    if (next !== src) src = next;
  }

  // fontSize number replacements (exact boundary match)
  for (const [num, token] of Object.entries(FONT_SIZE_MAP)) {
    const re = new RegExp(`\\bfontSize:\\s*${num}\\b`, 'g');
    const next = src.replace(re, () => { stats.fontSizeFixes++; return `fontSize: ${token}`; });
    if (next !== src) src = next;
  }

  // lineHeight number replacements (exact boundary match)
  for (const [num, token] of Object.entries(LINE_HEIGHT_MAP)) {
    const re = new RegExp(`\\blineHeight:\\s*${num}\\b`, 'g');
    const next = src.replace(re, () => { stats.lineHeightFixes++; return `lineHeight: ${token}`; });
    if (next !== src) src = next;
  }

  if (src !== original) {
    const needFW = /\bfontWeights\.\w+/.test(src);
    const needTR = /\btypographyRoles\.\w+/.test(src);
    src = ensureTypographyImports(src, needFW, needTR);
    writeFileSync(f, src, 'utf8');
    stats.filesChanged++;
    console.log(`  PATCHED: ${f.split('/').slice(-3).join('/')}`);
  }
}

console.log('\n=== Typography Token Fixes ===');
console.log(`fontWeight fixes: ${stats.fontWeightFixes}`);
console.log(`fontSize fixes:   ${stats.fontSizeFixes}`);
console.log(`lineHeight fixes: ${stats.lineHeightFixes}`);
console.log(`Import additions: ${stats.importFixes}`);
console.log(`Files changed:    ${stats.filesChanged}`);
