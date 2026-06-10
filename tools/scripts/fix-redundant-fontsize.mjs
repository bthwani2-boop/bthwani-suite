/**
 * fix-redundant-fontsize.mjs
 * Removes fontSize style props from <Text role="X"> where the fontSize
 * exactly matches the role's canonical size (zero visual change).
 *
 * Also fixes obvious role mismatches (caption@18 → titleSm, etc.)
 *
 * Canonical sizes:
 *   hero=30, titleLg=24, titleMd=20, titleSm=18
 *   bodyMd=15, bodySm=14, bodyStrong=15, labelLg=14, labelMd=13, caption=12
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROLE_SIZES = {
  hero: 30, titleLg: 24, titleMd: 20, titleSm: 18,
  bodyMd: 15, bodySm: 14, bodyStrong: 15, labelLg: 14, labelMd: 13, caption: 12,
};

// Role mismatches: [fromRole, fontSize, toRole]
// Only apply when the fontSize exactly matches the target role's canonical size
const ROLE_SWAPS = [
  // caption with a size that belongs to a higher role
  ['caption', 24, 'titleLg'],
  ['caption', 20, 'titleMd'],
  ['caption', 18, 'titleSm'],
  // titleLg used with a smaller role's size
  ['titleLg', 18, 'titleSm'],
  ['titleLg', 20, 'titleMd'],
  // titleSm used with caption-level size in dense admin tables (check)
  // skip these — too context-dependent
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
    } else if (e.endsWith('.tsx')) {
      acc.push(full);
    }
  }
  return acc;
}

const roots = ['dsh/frontend', 'wlt/frontend'];
const files = roots.flatMap(r => globTsx(r));

let totalRedundantRemoved = 0;
let totalSwapped = 0;
let filesChanged = 0;

/**
 * Remove `fontSize: N` (or `fontSize={N}`) from a Text tag span
 * when it exactly matches the role's canonical size.
 */
function removeRedundantFontSizes(src) {
  // Pattern: <Text ... role="ROLE" ... style={{ ... fontSize: N ... }}>
  // We need to find <Text> openings with role + style containing fontSize
  // Strategy: regex-based single-line and multi-line patterns

  let changed = false;

  for (const [role, canonicalSize] of Object.entries(ROLE_SIZES)) {
    // Match inline style object with fontSize: canonicalSize
    // Handles: fontSize: 12, or fontSize: 12 } or fontSize: 12, color:
    // Both style={{ ... fontSize: 12 ... }} and StyleSheet key patterns inside Text spans

    // Only target lines containing this role
    if (!src.includes(`role="${role}"`)) continue;

    // Remove `fontSize: N,` where N = canonicalSize from style objects on Text components
    // Strategy: find <Text role="X"...> spans and remove fontSize from their style
    // This is complex multiline. Instead use a targeted regex:

    // Pattern 1: fontSize appears immediately after role on same/nearby lines
    // Simple approach: remove `fontSize: N,` when surrounded by Text context with matching role
    // This regex finds fontSize in style objects — we'll do line-by-line context check

    const lines = src.split('\n');
    let inTextComponent = false;
    let textDepth = 0;
    const outLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Track if we're inside a <Text role="role"> opening
      if (/<Text\b[^>]*role=["']/.test(line)) {
        inTextComponent = true;
        textDepth = 0;
      }
      if (inTextComponent) {
        textDepth += (line.match(/\{/g) || []).length;
        textDepth -= (line.match(/\}/g) || []).length;
        if (textDepth <= 0 && line.includes('>')) {
          inTextComponent = false;
        }
      }

      // If we're in a Text opening tag, check for redundant fontSize
      // Note: we check the current line has role and fontSize together OR
      // we're in span and the line has fontSize: N
      outLines.push(line);
    }

    // Approach: simpler regex on whole text
    // Match: role="ROLE" in <Text> opening, and fontSize: SIZE in the same style block
    // Use a two-pass: first find Text+role spans, then within those remove redundant fontSize

    // Regex: match <Text opening tag content (up to >) and strip fontSize if redundant
    // This is hard with multiline regex. Let's use a string-based approach:

    // Find all <Text occurrences, extract up to >, check for role + fontSize match
    const textTagRegex = /<Text\b([\s\S]*?)(?=>(?!\/))/g;
    let match;
    while ((match = textTagRegex.exec(src)) !== null) {
      const tagContent = match[1];
      const roleMatch = tagContent.match(/\brole=["']([^"']+)["']/);
      if (!roleMatch || roleMatch[1] !== role) continue;

      // Check if fontSize: canonicalSize appears in this tag
      const fsRegex = new RegExp(`\\bfontSize\\s*:\\s*${canonicalSize}\\b`);
      if (!fsRegex.test(tagContent)) continue;

      // Remove the fontSize: N, (or fontSize: N } or fontSize: N\n)
      const oldTag = match[0];
      const newTag = oldTag.replace(
        new RegExp(`\\s*fontSize\\s*:\\s*${canonicalSize}\\s*,?`),
        ''
      );
      if (newTag !== oldTag) {
        src = src.slice(0, match.index) + newTag + src.slice(match.index + oldTag.length);
        changed = true;
        totalRedundantRemoved++;
        // Reset regex since src changed
        textTagRegex.lastIndex = 0;
      }
    }
  }

  return { src, changed };
}

/**
 * Fix role mismatches: <Text role="fromRole" ... fontSize: targetSize ...>
 * → change role to the correct one and remove the redundant fontSize
 */
function fixRoleMismatches(src) {
  let changed = false;

  for (const [fromRole, fs, toRole] of ROLE_SWAPS) {
    if (!src.includes(`role="${fromRole}"`)) continue;

    const textTagRegex = /<Text\b([\s\S]*?)(?=>(?!\/))/g;
    let match;
    while ((match = textTagRegex.exec(src)) !== null) {
      const tagContent = match[1];
      const roleMatch = tagContent.match(/\brole=["']([^"']+)["']/);
      if (!roleMatch || roleMatch[1] !== fromRole) continue;

      const fsRegex = new RegExp(`\\bfontSize\\s*:\\s*${fs}\\b`);
      if (!fsRegex.test(tagContent)) continue;

      const oldTag = match[0];
      // Swap role
      let newTag = oldTag.replace(
        new RegExp(`\\brole=["']${fromRole}["']`),
        `role="${toRole}"`
      );
      // Remove the now-redundant fontSize (since toRole's canonical size matches)
      newTag = newTag.replace(
        new RegExp(`\\s*fontSize\\s*:\\s*${fs}\\s*,?`),
        ''
      );

      if (newTag !== oldTag) {
        src = src.slice(0, match.index) + newTag + src.slice(match.index + oldTag.length);
        changed = true;
        totalSwapped++;
        textTagRegex.lastIndex = 0;
      }
    }
  }

  return { src, changed };
}

for (const f of files) {
  let src;
  try { src = readFileSync(f, 'utf8'); } catch { continue; }
  const original = src;

  const r1 = removeRedundantFontSizes(src);
  src = r1.src;
  const r2 = fixRoleMismatches(src);
  src = r2.src;

  if (src !== original) {
    writeFileSync(f, src, 'utf8');
    filesChanged++;
  }
}

console.log(`=== Redundant fontSize removal ===`);
console.log(`Redundant fontSizes removed: ${totalRedundantRemoved}`);
console.log(`Role mismatches fixed: ${totalSwapped}`);
console.log(`Files changed: ${filesChanged}`);
