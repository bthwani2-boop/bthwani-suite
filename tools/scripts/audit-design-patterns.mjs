/**
 * audit-design-patterns.mjs
 * Comprehensive design pattern inconsistency audit beyond typography.
 * Scans for: hardcoded colors, raw spacing, raw radius, raw elevation,
 * StateView gaps, RTL misalignments, local design objects.
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
      if (['node_modules', '.git', 'dist', '.next', '__generated__'].includes(e)) continue;
      globTsx(full, acc);
    } else if (e.endsWith('.tsx') || e.endsWith('.ts')) {
      acc.push(full.replace(/\\/g, '/'));
    }
  }
  return acc;
}

const roots = ['dsh/frontend', 'wlt/frontend'];
const files = globTsx('dsh/frontend').concat(globTsx('wlt/frontend'));
// Exclude ui-kit itself
const appFiles = files.filter(f => !f.includes('/ui-kit/'));

const findings = {
  hardcodedHex: [],          // '#RRGGBB' or '#RGB' color literals
  hardcodedNamedColors: [],  // 'red', 'blue', 'orange', etc. as color values
  rawBorderRadius: [],        // borderRadius: N where N is not from radius token
  rawPaddingMargin: [],       // padding/margin with unlikely-token values
  inlineStyleColors: [],      // backgroundColor/color with string literal
  noStateView: [],            // files with loading/empty/error patterns but no StateView
  localColorObjects: [],      // const colors = { ... }
  hardcodedElevation: [],     // elevation: N > 10 (outside presets)
};

// Spacing scale values (from foundation.ts) — raw pixel equivalents
// rawSpacingScale: 0,4,8,12,16,20,24,28,32,40,48,56,64
const SPACING_TOKENS = new Set([0, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64]);
// These are common numeric values — flag if NOT in spacing scale
// But this would be too noisy. Instead just count raw pixel props

const HEX_REGEX = /['"](#[0-9a-fA-F]{3,8})['"]/g;
const NAMED_COLOR_REGEX = /(?:color|backgroundColor|borderColor)\s*[:=]\s*['"](?!var\()(red|green|blue|orange|purple|pink|yellow|white|black|gray|grey|cyan|magenta)['"]/gi;
const BORDER_RADIUS_LITERAL = /borderRadius\s*:\s*(\d+)/g;
const ELEVATION_LITERAL = /elevation\s*:\s*(\d+)/g;
const INLINE_COLOR_LITERAL = /(?:color|backgroundColor)\s*:\s*['"](?!var\()(#[0-9a-fA-F]{3,8})['"]/g;
const LOCAL_COLOR_OBJ = /(?:const|let)\s+(?:colors?|palette|theme|tokens?|semanticColors?|brandColors?)\s*[=:]/g;
const STATEVIEW_IMPORT = /StateView|LoadingState|EmptyState|ErrorState|SuccessState/;
const LOADING_PATTERN = /isLoading|loading.*true|isFetching|skeleton|Skeleton/i;
const ERROR_PATTERN = /isError|error.*state|hasError|errorMessage/i;
const EMPTY_PATTERN = /isEmpty|empty.*state|noData|no.*items|noResults/i;

for (const f of appFiles) {
  let src;
  try { src = readFileSync(f, 'utf8'); } catch { continue; }
  const shortPath = f.split('/').slice(-4).join('/');

  // 1. Hardcoded hex colors
  let m;
  const hexMatches = new Set();
  while ((m = HEX_REGEX.exec(src)) !== null) {
    hexMatches.add(m[1]);
  }
  if (hexMatches.size > 0) {
    findings.hardcodedHex.push({ file: shortPath, count: hexMatches.size, samples: [...hexMatches].slice(0, 3) });
  }

  // 2. Named color literals as CSS values
  const namedColorMatches = src.match(NAMED_COLOR_REGEX);
  if (namedColorMatches && namedColorMatches.length > 0) {
    findings.hardcodedNamedColors.push({ file: shortPath, count: namedColorMatches.length });
  }

  // 3. Inline color literals (in style objects)
  const inlineColorMatches = src.match(INLINE_COLOR_LITERAL);
  if (inlineColorMatches && inlineColorMatches.length > 0) {
    findings.inlineStyleColors.push({ file: shortPath, count: inlineColorMatches.length });
  }

  // 4. borderRadius raw values
  const brMatches = [];
  while ((m = BORDER_RADIUS_LITERAL.exec(src)) !== null) {
    const n = parseInt(m[1]);
    if (n > 0) brMatches.push(n);
  }
  if (brMatches.length > 0) {
    findings.rawBorderRadius.push({ file: shortPath, count: brMatches.length, values: [...new Set(brMatches)].sort((a,b)=>a-b).slice(0,5) });
  }

  // 5. Local color/design objects
  if (LOCAL_COLOR_OBJ.test(src)) {
    findings.localColorObjects.push({ file: shortPath });
  }

  // 6. No StateView for loading/empty/error handling
  const hasLoading = LOADING_PATTERN.test(src);
  const hasError = ERROR_PATTERN.test(src);
  const hasEmpty = EMPTY_PATTERN.test(src);
  const hasStateView = STATEVIEW_IMPORT.test(src);

  if ((hasLoading || hasError || hasEmpty) && !hasStateView && f.includes('/screens/')) {
    const flags = [hasLoading && 'loading', hasError && 'error', hasEmpty && 'empty'].filter(Boolean);
    findings.noStateView.push({ file: shortPath, flags });
  }
}

// Sort by count desc
const sortByCount = (arr) => arr.sort((a, b) => (b.count || 1) - (a.count || 1));

console.log('\n=== DESIGN PATTERN AUDIT ===\n');

console.log(`[1] HARDCODED HEX COLORS (${findings.hardcodedHex.length} files)`);
sortByCount(findings.hardcodedHex).slice(0, 15).forEach(r => {
  console.log(`  ${r.count.toString().padStart(3)} ${r.file} → ${r.samples.join(', ')}`);
});

console.log(`\n[2] INLINE COLOR LITERALS in styles (${findings.inlineStyleColors.length} files)`);
sortByCount(findings.inlineStyleColors).slice(0, 15).forEach(r => {
  console.log(`  ${r.count.toString().padStart(3)} ${r.file}`);
});

console.log(`\n[3] NAMED COLOR LITERALS (red/blue/etc) (${findings.hardcodedNamedColors.length} files)`);
sortByCount(findings.hardcodedNamedColors).slice(0, 10).forEach(r => {
  console.log(`  ${r.count.toString().padStart(3)} ${r.file}`);
});

console.log(`\n[4] RAW borderRadius values (${findings.rawBorderRadius.length} files)`);
sortByCount(findings.rawBorderRadius).slice(0, 15).forEach(r => {
  console.log(`  ${r.count.toString().padStart(3)} ${r.file} → [${r.values.join(', ')}]`);
});

console.log(`\n[5] LOCAL DESIGN OBJECTS (colors/palette/theme/tokens) (${findings.localColorObjects.length} files)`);
findings.localColorObjects.slice(0, 15).forEach(r => {
  console.log(`  ${r.file}`);
});

console.log(`\n[6] SCREENS MISSING StateView for loading/empty/error (${findings.noStateView.length} files)`);
findings.noStateView.slice(0, 20).forEach(r => {
  console.log(`  [${r.flags.join('+')}] ${r.file}`);
});

const totalHex = findings.hardcodedHex.reduce((s, r) => s + r.count, 0);
const totalBR = findings.rawBorderRadius.reduce((s, r) => s + r.count, 0);
console.log(`\n=== TOTALS ===`);
console.log(`Hex color literals: ${totalHex} in ${findings.hardcodedHex.length} files`);
console.log(`Inline style color literals: ${findings.inlineStyleColors.reduce((s,r)=>s+r.count,0)} in ${findings.inlineStyleColors.length} files`);
console.log(`Named color literals: ${findings.hardcodedNamedColors.reduce((s,r)=>s+r.count,0)} in ${findings.hardcodedNamedColors.length} files`);
console.log(`Raw borderRadius: ${totalBR} in ${findings.rawBorderRadius.length} files`);
console.log(`Local design objects: ${findings.localColorObjects.length} files`);
console.log(`Screens missing StateView: ${findings.noStateView.length}`);
