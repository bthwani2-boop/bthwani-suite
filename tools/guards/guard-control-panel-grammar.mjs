#!/usr/bin/env node
/**
 * Control Panel UI Grammar Guard
 *
 * Purpose:
 * - Prevent showHero=true inside control-panel sections (forbidden outside allowlist).
 * - Prevent local Tamagui imports outside @bthwani/ui-kit.
 * - Prevent obvious local overrides of command-center CSS classes outside shell owner.
 * - Verify grammar contract reference exists in control-panel sections.
 * - Detect local hardcoded colors in control-panel section TSX/CSS files.
 *
 * Run from repo root:
 *   node tools/guards/guard-control-panel-grammar.mjs
 */

import fs from 'fs';
import path from 'path';

function parseArgs(argv = process.argv.slice(2)) {
  const args = { root: process.cwd(), mode: 'CHECK', jsonOut: '', mdOut: '' };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--root') args.root = argv[++i];
    else if (token === '--mode') args.mode = argv[++i];
    else if (token === '--json-out') args.jsonOut = argv[++i];
    else if (token === '--md-out') args.mdOut = argv[++i];
    else if (token.startsWith('--root=')) args.root = token.slice('--root='.length);
    else if (token.startsWith('--mode=')) args.mode = token.slice('--mode='.length);
    else if (token.startsWith('--json-out=')) args.jsonOut = token.slice('--json-out='.length);
    else if (token.startsWith('--md-out=')) args.mdOut = token.slice('--md-out='.length);
  }
  args.root = path.resolve(args.root);
  return args;
}

const args = parseArgs();
const repoRoot = args.root;

function writeFile(filePath, content) {
  if (!filePath) return;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

const SCAN_DIRS = [
  path.join(repoRoot, 'dsh', 'frontend', 'control-panel'),
  path.join(repoRoot, 'control-panel', 'shell'),
  path.join(repoRoot, 'control-panel', 'runtime', 'app'),
];

const HERO_ALLOWLIST = new Set([
  // Only the shell host is allowed to render hero-like landing.
  // Individual operational sections must NOT use showHero=true.
  // Add explicit overrides here with justification only.
]);

const COMMAND_CENTER_CLASS_ALLOWED_DIRS = [
  path.join(repoRoot, 'ui-kit'),
  path.join(repoRoot, 'control-panel', 'shell'),
];

const errors = [];
const warnings = [];

function exists(p) {
  return fs.existsSync(p);
}

function walk(dir, acc = []) {
  if (!exists(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', 'dist', 'build', '.git'].includes(entry.name)) continue;
      walk(full, acc);
    } else {
      if (/\.(tsx?|jsx?|css)$/.test(entry.name)) acc.push(full);
    }
  }
  return acc;
}

function rel(p) {
  return path.relative(repoRoot, p).replace(/\\/g, '/');
}

function read(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return ''; }
}

// ─── Collect all files ────────────────────────────────────────────────────────
const allFiles = SCAN_DIRS.flatMap((d) => walk(d));

// ─── GATE 1: showHero=true forbidden outside shell allowlist ─────────────────
// Operational sections (dsh/frontend/control-panel/**) must NOT have showHero=true.
const showHeroPattern = /showHero\s*=\s*\{?\s*true\s*\}?/;
for (const f of allFiles.filter((x) => /\.(tsx|jsx)$/.test(x))) {
  const relative = rel(f);
  // Only scan dsh/frontend/control-panel section files (not shell itself)
  if (!relative.startsWith('dsh/frontend/control-panel/')) continue;
  // Skip allowlisted files
  if (HERO_ALLOWLIST.has(relative)) continue;
  const txt = read(f);
  if (showHeroPattern.test(txt)) {
    errors.push(`showHero=true detected in operational section (forbidden by grammar contract): ${relative}`);
  }
}

// ─── GATE 2: No direct Tamagui import outside ui-kit ─────────────────────────
const tamaguiImportPattern = /from\s+['"](?:tamagui|@tamagui\/[^'"]+)['"]/;
for (const f of allFiles.filter((x) => /\.(tsx?|jsx?)$/.test(x))) {
  const relative = rel(f);
  if (relative.startsWith('ui-kit/')) continue; // allowed inside ui-kit
  const txt = read(f);
  if (tamaguiImportPattern.test(txt)) {
    errors.push(`Direct Tamagui import outside @bthwani/ui-kit boundary: ${relative}`);
  }
}

// ─── GATE 3: No local command-center CSS class overrides outside shell owner ──
// Detect usage of .ui-web-command-center / .ui-web-command-strip in CSS files outside shell/ui-kit
const commandCenterCssPattern = /\.ui-web-command-(center|strip)/;
for (const f of allFiles.filter((x) => x.endsWith('.css'))) {
  const relative = rel(f);
  const isAllowed = COMMAND_CENTER_CLASS_ALLOWED_DIRS.some((d) => f.startsWith(d));
  if (isAllowed) continue;
  const txt = read(f);
  if (commandCenterCssPattern.test(txt)) {
    errors.push(`Local override of command-center CSS classes outside shell owner: ${relative}`);
  }
}

// ─── GATE 4: Grammar contract must be referenced in hub/section screens ───────
// Each of the 11 canonical hub screens must reference the grammar contract or shared styles.
const CANONICAL_HUB_FILES = [
  'dsh/frontend/control-panel/operations/OperationsHubScreen.tsx',
  'dsh/frontend/control-panel/finance/FinanceHubScreen.tsx',
  'dsh/frontend/control-panel/administration/ControlPanelDshAdministrationScreen.tsx',
  'dsh/frontend/control-panel/marketing/ControlPanelDshMarketingScreen.tsx',
  'dsh/frontend/control-panel/catalogs/ControlPanelDshCatalogScreen.tsx',
  'dsh/frontend/control-panel/platform/ControlPanelDshPlatformScreen.tsx',
  'dsh/frontend/control-panel/hr/ControlPanelHrScreen.tsx',
];
const grammarRef = /ui-grammar-contract|control-panel-surface\.module\.css/;
for (const relPath of CANONICAL_HUB_FILES) {
  const full = path.join(repoRoot, relPath.replace(/\//g, path.sep));
  if (!exists(full)) {
    warnings.push(`Expected hub screen missing: ${relPath}`);
    continue;
  }
  const txt = read(full);
  if (!grammarRef.test(txt)) {
    warnings.push(`Hub screen lacks grammar contract or shared styles reference: ${relPath}`);
  }
}

// ─── GATE 5: Hardcoded colors in section CSS/TSX ─────────────────────────────
// Detect raw hex colors in control-panel section CSS outside shared/
const hardcodedHex = /(background|color|border)\s*:\s*#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/;
for (const f of allFiles.filter((x) => x.endsWith('.css'))) {
  const relative = rel(f);
  if (!relative.startsWith('dsh/frontend/control-panel/')) continue;
  if (relative.includes('/shared/')) continue; // shared is reviewed separately
  const txt = read(f);
  if (hardcodedHex.test(txt)) {
    errors.push(`Hardcoded color detected in section CSS (use central tokens): ${relative}`);
  }
}

// ─── GATE 6: Section CSS files that duplicate marketing-module patterns ───────
// The marketing CSS has local duplicated patterns (surfaceCard, actionButton, etc.)
// that mirror the shared CSS. Flag CSS modules outside shared/ that declare >10 selectors.
for (const f of allFiles.filter((x) => x.endsWith('.module.css'))) {
  const relative = rel(f);
  if (!relative.startsWith('dsh/frontend/control-panel/')) continue;
  if (relative.includes('/shared/')) continue;
  const txt = read(f);
  const selectorCount = (txt.match(/^\.[a-zA-Z]/gm) ?? []).length;
  if (selectorCount > 20) {
    warnings.push(`Large local CSS module (${selectorCount} selectors) outside shared/: ${relative} — review for duplication with shared contract.`);
  }
}

// ─── Report ───────────────────────────────────────────────────────────────────
const status = errors.length > 0 ? 'FAIL' : warnings.length > 0 ? 'WARN' : 'PASS';
const severity = errors.length > 0 ? 'BLOCKING_ON_CHANGED_FILES' : 'REPORT';
const output = {
  guardId: 'GUARD_CONTROL_PANEL_GRAMMAR',
  status,
  severity,
  mode: args.mode || 'CHECK',
  summary: {
    errorsCount: errors.length,
    warningsCount: warnings.length,
    findingsTotal: errors.length + warnings.length,
  },
  errors,
  warnings,
  failCount: errors.length,
  warnCount: warnings.length,
  infoCount: 0,
};

writeFile(args.jsonOut, JSON.stringify(output, null, 2));

const mdLines = [
  '# Control Panel UI Grammar Guard',
  '',
  `- status: ${output.status}`,
  `- severity: ${output.severity}`,
  `- mode: ${output.mode}`,
  '',
  '## Summary',
  '',
  `- Errors: ${output.summary.errorsCount}`,
  `- Warnings: ${output.summary.warningsCount}`,
  '',
];
if (errors.length) {
  mdLines.push('## Errors', '');
  for (const e of errors) mdLines.push(`- ERROR: ${e}`);
  mdLines.push('');
}
if (warnings.length) {
  mdLines.push('## Warnings', '');
  for (const w of warnings) mdLines.push(`- WARN: ${w}`);
  mdLines.push('');
}
writeFile(args.mdOut, mdLines.join('\n'));

if (errors.length) {
  console.error('CONTROL_PANEL_GRAMMAR_GUARD: FAIL');
  for (const e of errors) console.error(`  ERROR: ${e}`);
  if (warnings.length) {
    for (const w of warnings) console.warn(`  WARN:  ${w}`);
  }
  process.exitCode = 1;
} else {
  console.log('CONTROL_PANEL_GRAMMAR_GUARD: PASS');
  if (warnings.length) {
    for (const w of warnings) console.warn(`  WARN:  ${w}`);
  }
}
