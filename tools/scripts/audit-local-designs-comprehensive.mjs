/**
 * audit-local-designs-comprehensive.mjs
 * Comprehensive audit of similar local designs that should be unified and centralized.
 * Looks for: color maps, label maps, icon maps, resolve functions, local style objects.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
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

const files = glob('dsh/frontend').concat(glob('wlt/frontend'));
const skipPatterns = ['ui-kit/', '.test.', '.spec.', '.stories.', '__generated__', 'fixture', 'mock', '/shared/dsh-', '/shared/index'];

const findings = {
  localColorMaps: [],       // const X_COLOR_MAP = {...} or STATUS_COLORS = {...}
  localLabelMaps: [],       // const X_LABELS = {...} or STATUS_TEXT = {...}
  localIconMaps: [],        // const X_ICON = {...} or STATUS_ICON = {...}
  localResolveFunctions: [], // function resolve*(status/state/type) -> string/tone
  localStyleObjects: [],    // const cardStyle/rowStyle = { ... } with multiple style keys
  localTagColors: [],       // getBadgeColor / getTagColor / getChipColor local functions
  localGradients: [],       // LinearGradient or local gradient arrays
  duplicateSortOptions: [], // const SORT_OPTIONS = [{...}] appearing in multiple files
};

// Color map pattern: const SOMETHING_COLOR or SOMETHING_COLORS or COLOR_SOMETHING
const colorMapRe = /(?:^|\n)\s*(?:export\s+)?const\s+(\w*(?:COLOR|TONE|BADGE|STATUS|STATE)\w*)\s*(?:[:=]|:\s*Record)\s*[{[]/gi;
// Label map: const X_LABEL or X_TEXT or X_NAMES
const labelMapRe = /(?:^|\n)\s*(?:export\s+)?const\s+(\w*(?:LABEL|TEXT|TITLE|NAME|DISPLAY|DESC)(?:S|_MAP)?\w*)\s*(?:[:=]|:\s*Record)\s*[{[]/gi;
// Icon map
const iconMapRe = /(?:^|\n)\s*(?:export\s+)?const\s+(\w*ICON\w*)\s*(?:[:=]|:\s*Record)\s*[{[]/gi;
// Resolve functions returning string or tone type
const resolveFnRe = /(?:^|\n)\s*(?:export\s+)?function\s+(resolve[A-Z]\w*)\s*\([^)]*(?:status|state|type|tone|stage|phase)\b[^)]*\)\s*:/gi;
// getBadgeColor / getColor patterns
const tagColorRe = /(?:^|\n)\s*(?:export\s+)?function\s+(get[A-Z]\w*(?:Color|Badge|Tone|Tag|Chip)\w*)\s*\(/gi;
// Local style objects with 3+ css properties
const styleObjRe = /(?:^|\n)\s*(?:export\s+)?const\s+(\w+(?:Style|Styles|Card|Row|Item))\s*=\s*\{[^}]{30,}\}/gi;

for (const f of files) {
  if (skipPatterns.some(p => f.includes(p))) continue;
  let src; try { src = readFileSync(f, 'utf8'); } catch { continue; }
  const short = f.split('/').slice(-4).join('/');

  colorMapRe.lastIndex = 0;
  let m;
  while ((m = colorMapRe.exec(src)) !== null) {
    findings.localColorMaps.push(`${short}: ${m[1]}`);
  }

  labelMapRe.lastIndex = 0;
  while ((m = labelMapRe.exec(src)) !== null) {
    findings.localLabelMaps.push(`${short}: ${m[1]}`);
  }

  iconMapRe.lastIndex = 0;
  while ((m = iconMapRe.exec(src)) !== null) {
    findings.localIconMaps.push(`${short}: ${m[1]}`);
  }

  resolveFnRe.lastIndex = 0;
  while ((m = resolveFnRe.exec(src)) !== null) {
    findings.localResolveFunctions.push(`${short}: ${m[1]}`);
  }

  tagColorRe.lastIndex = 0;
  while ((m = tagColorRe.exec(src)) !== null) {
    findings.localTagColors.push(`${short}: ${m[1]}`);
  }
}

console.log('\n=== COMPREHENSIVE LOCAL DESIGN AUDIT ===\n');

function printSection(title, items, max = 25) {
  console.log(`[${items.length}] ${title}:`);
  items.slice(0, max).forEach(i => console.log(`   ${i}`));
  if (items.length > max) console.log(`   ...and ${items.length - max} more`);
  console.log();
}

printSection('LOCAL COLOR/TONE MAPS', findings.localColorMaps);
printSection('LOCAL LABEL/TEXT MAPS', findings.localLabelMaps);
printSection('LOCAL ICON MAPS', findings.localIconMaps);
printSection('LOCAL resolve*() FUNCTIONS', findings.localResolveFunctions);
printSection('LOCAL getColor/getBadge FUNCTIONS', findings.localTagColors);
