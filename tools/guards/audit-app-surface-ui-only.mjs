#!/usr/bin/env node
/**
 * Audit: are ALL files in dsh/frontend/app-* truly UI-only?
 *
 * CORRECT pattern (not a violation):
 *   import { getDshXxxRuntimeClient } from '../../shared'  →  client.listX() / client.updateX()
 *   import { listX, updateX } from '../../shared'           →  calling shared-imported functions
 *
 * VIOLATION patterns:
 *   fetch() called directly
 *   API clients created inline (new XxxClient / createHttpClient not from shared)
 *   Business label/status mappings defined locally (Record<string,string> with status labels)
 *   Direct getDshAuthRuntimeBaseUrl usage without shared wrapper
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const SURFACE_DIRS = [
  'dsh/frontend/app-captain',
  'dsh/frontend/app-client',
  'dsh/frontend/app-field',
  'dsh/frontend/app-partner',
];

// True violations: patterns that indicate business logic defined LOCALLY in app-*
// (not calling shared-imported functions, but defining logic that belongs in shared)
const GENUINE_FORBIDDEN = [
  {
    id: 'direct_fetch',
    re: /\bfetch\s*\(/,
    description: 'Direct fetch() call — use shared API client instead',
  },
  {
    id: 'inline_api_client_new',
    re: /\bnew\s+[A-Z][A-Za-z0-9]*(?:Client|Api|Service|Http|Transport)\s*\(/,
    description: 'Inline API client instantiation — use getDsh*RuntimeClient from shared',
  },
  {
    id: 'inline_http_client_factory',
    re: /\bcreate(?:Http|Typed|Rest|Grpc)Client\s*\(/,
    description: 'Inline HTTP client factory — use shared client factory instead',
  },
  {
    id: 'storage_direct',
    re: /\b(?:localStorage|AsyncStorage|sessionStorage|indexedDB)\b/,
    description: 'Direct storage access — use shared storage adapters',
  },
  {
    id: 'inline_status_label_map',
    re: /(?:statusToLabel|statusLabels|orderStatusLabels|labelMap)\s*[=:]\s*\{|(?:CREATED|DELIVERED|CANCELLED)\s*:\s*['"][^'"]{2,}/,
    description: 'Inline status label mapping — belongs in shared/view-models',
  },
];

// Files/patterns that are ALLOWED to contain any pattern (infrastructure files)
const ALLOWLIST_RE = [
  /\/index\.ts$/,
  /\/dsh-[a-z]+-navigation-bridge\.ts$/,
  /\/dsh-[a-z]+\.routes\.ts$/,
  /\/dsh-[a-z]+\.screen-registry\.ts$/,
  /\/dsh-[a-z]+\.types\.ts$/,
  /\/contracts\//,
  /Surface\.tsx$/,
  /RouteRenderer\.tsx$/,
  /BottomNav\.tsx$/,
];

function isAllowlisted(relPath) {
  return ALLOWLIST_RE.some((re) => re.test(relPath));
}

function walkDir(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) { walkDir(full, results); }
    else if (/\.(ts|tsx)$/.test(ent.name)) { results.push(full); }
  }
  return results;
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

const violations = [];
const clean = [];

for (const surfaceDir of SURFACE_DIRS) {
  const absDir = path.join(root, surfaceDir);
  const files = walkDir(absDir);

  for (const absFile of files) {
    const rel = absFile.slice(root.length + 1).replace(/\\/g, '/');
    if (isAllowlisted(rel)) continue;

    const text = fs.readFileSync(absFile, 'utf8').replace(/^﻿/, '');
    const fileViolations = [];

    for (const rule of GENUINE_FORBIDDEN) {
      const match = rule.re.exec(text);
      if (match) {
        fileViolations.push({
          rule: rule.id,
          line: lineOf(text, match.index),
          evidence: match[0].slice(0, 120),
          description: rule.description,
        });
      }
    }

    if (fileViolations.length > 0) {
      violations.push({ file: rel, violations: fileViolations });
    } else {
      clean.push(rel);
    }
  }
}

const result = {
  audit: 'AUDIT_APP_SURFACE_UI_ONLY',
  note: 'Calling shared-imported API clients (getDsh*RuntimeClient, listX, updateX from shared) is CORRECT — not flagged.',
  status: violations.length === 0 ? 'PASS' : 'FAIL',
  totalFiles: violations.length + clean.length,
  violatingFiles: violations.length,
  cleanFiles: clean.length,
  violations,
};

console.log(JSON.stringify(result, null, 2));
process.exit(violations.length > 0 ? 1 : 0);
