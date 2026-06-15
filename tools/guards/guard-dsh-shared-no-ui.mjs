#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, createReport, finalize, lineNumber } from './lib/guard-utils.mjs';

const args = parseArgs();
const root = args.root;
const sharedRoot = 'dsh/frontend/shared';
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx']);

function toPosix(value) {
  return String(value).replace(/\\/g, '/');
}

function walk(absDir, files = []) {
  if (!fs.existsSync(absDir)) return files;
  for (const entry of fs.readdirSync(absDir, { withFileTypes: true })) {
    const abs = path.join(absDir, entry.name);
    if (entry.isDirectory()) walk(abs, files);
    else if (entry.isFile() && extensions.has(path.extname(entry.name))) files.push(abs);
  }
  return files;
}

function stripComments(text) {
  return text.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, '');
}

const rules = [
  {
    id: 'dsh_shared_tsx_file',
    testFile: (rel) => rel.endsWith('.tsx') || rel.endsWith('.jsx'),
    remediation: 'dsh/frontend/shared must stay non-visual. Move JSX/UI to app/control-panel/ui-kit roots.',
  },
  {
    id: 'dsh_shared_imports_ui_kit',
    regex: /from\s+['"]@bthwani\/ui-kit(?:\/[^'"]*)?['"]|require\(['"]@bthwani\/ui-kit(?:\/[^'"]*)?['"]\)/g,
    remediation: 'Shared DSH logic cannot import ui-kit; expose data-only models for UI roots.',
  },
  {
    id: 'dsh_shared_imports_tamagui_or_react_native_ui',
    regex: /from\s+['"](?:tamagui|@tamagui\/[^'"]+)['"]/g,
    remediation: 'Shared DSH logic cannot own Tamagui usage.',
  },
  {
    id: 'dsh_shared_ui_component_or_stylesheet',
    regex: /\b(?:StyleSheet\.create|Button|Card|Header|Badge|Screen|Sheet|theme|tokens|colorPalette|brandPalette|dangerPalette|infoPalette|successPalette|spacing|shadowPresets)\b/g,
    remediation: 'Move reusable visual design to ui-kit and service-specific UI to the relevant app/control-panel root.',
  },
  {
    id: 'dsh_shared_react_element_creation',
    regex: /\bReact\.createElement\s*\(/g,
    remediation: 'Move React element creation out of shared and keep shared data-only.',
  },
  {
    id: 'dsh_shared_jsx_syntax',
    regex: /(?:^|[\s([{,;=])<[A-Z][A-Za-z0-9]*(?:\s+|>|\/>)/g,
    remediation: 'Do not use JSX syntax (e.g. elements or components) inside dsh/frontend/shared. Move to app/control-panel or ui-kit.',
  },
];

const report = createReport('GUARD_DSH_SHARED_NO_UI', [
  'governance/14_GUARDS_CATALOG.md',
  'governance/22_DSH_GOLDEN_SLICE.md'
]);

const files = walk(path.join(root, sharedRoot));

for (const abs of files) {
  const relFile = toPosix(path.relative(root, abs));
  const text = fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '');
  const stripped = stripComments(text);

  for (const rule of rules) {
    if (rule.testFile?.(relFile)) {
      report.fail(
        relFile,
        rule.remediation,
        `${rule.id}: TSX file extension`
      );
    }

    if (!rule.regex) continue;
    if (rule.id === 'dsh_shared_ui_component_or_stylesheet' && /(?:^|\/)(?:.*\.types|.*\.contract|.*\.contracts)\.ts$/.test(relFile)) {
      continue;
    }
    rule.regex.lastIndex = 0;
    let match;
    while ((match = rule.regex.exec(stripped)) !== null) {
      report.fail(
        relFile,
        rule.remediation,
        `${rule.id} (line ${lineNumber(stripped, match.index)}: ${match[0].slice(0, 80)})`
      );
    }
  }
}

finalize(report, args);
