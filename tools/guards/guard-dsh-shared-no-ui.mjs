#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sharedRoot = 'dsh/frontend/shared';
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx']);

function toPosix(value) {
  return String(value).replace(/\\/g, '/');
}

function lineNumber(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
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
    regex: /\b(?:StyleSheet\.create|Button|Card|Header|Badge|theme|tokens|colorPalette|brandPalette|dangerPalette|infoPalette|successPalette)\b/g,
    remediation: 'Move reusable visual design to ui-kit and service-specific UI to the relevant app/control-panel root.',
  },
  {
    id: 'dsh_shared_react_element_creation',
    regex: /\bReact\.createElement\s*\(/g,
    remediation: 'Move React element creation out of shared and keep shared data-only.',
  },
];

const files = walk(path.join(root, sharedRoot));
const findings = [];

for (const abs of files) {
  const rel = toPosix(path.relative(root, abs));
  const text = fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '');
  const stripped = stripComments(text);

  for (const rule of rules) {
    if (rule.testFile?.(rel)) {
      findings.push({
        severity: 'FAIL',
        rule: rule.id,
        file: rel,
        line: 1,
        evidence: path.extname(rel),
        remediation: rule.remediation,
      });
    }

    if (!rule.regex) continue;
    if (rule.id === 'dsh_shared_ui_component_or_stylesheet' && /(?:^|\/)(?:.*\.types|.*\.contract|.*\.contracts)\.ts$/.test(rel)) {
      continue;
    }
    rule.regex.lastIndex = 0;
    let match;
    while ((match = rule.regex.exec(stripped)) !== null) {
      findings.push({
        severity: 'FAIL',
        rule: rule.id,
        file: rel,
        line: lineNumber(stripped, match.index),
        evidence: match[0].slice(0, 160),
        remediation: rule.remediation,
      });
    }
  }
}

const output = {
  guardId: 'GUARD_DSH_SHARED_NO_UI',
  status: findings.length > 0 ? 'FAIL' : 'PASS',
  sharedRoot,
  filesScanned: files.length,
  findings,
  failCount: findings.length,
};

console.log(JSON.stringify(output, null, 2));
if (findings.length > 0) process.exitCode = 1;
