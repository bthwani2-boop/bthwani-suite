#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, createReport, finalize, lineNumber } from './lib/guard-utils.mjs';

const args = parseArgs();
const root = args.root;
const surfaceFiles = [
  'dsh/frontend/app-client/DshClientSurface.tsx',
  'dsh/frontend/app-partner/DshPartnerSurface.tsx',
  'dsh/frontend/app-captain/DshCaptainSurface.tsx',
  'dsh/frontend/app-field/DshFieldSurface.tsx',
];

function toPosix(value) {
  return String(value).replace(/\\/g, '/');
}

function countMatches(text, regex) {
  return Array.from(text.matchAll(regex)).length;
}

function countJsxProps(text, tagName) {
  const match = new RegExp(`<${tagName}\\b([\\s\\S]*?)\\/>`, 'm').exec(text);
  if (!match) return 0;
  return countMatches(match[1], /^\s+[A-Za-z_$][A-Za-z0-9_$]*=/gm);
}

const rules = [
  { id: 'surface_creates_api_client', regex: /\bcreate[A-Za-z0-9]+(?:Http)?Client\b/g },
  { id: 'surface_money_adapter', regex: /\bformatWltYer\b|\bWltLedgerEntry\b|\brequestSettlement\b|\btopUp\b/g },
  { id: 'surface_media_upload_flow', regex: /\bcreateUploadIntent\b|\bcompleteUpload\b|\bmediaKey\b|\bpod_media_key\b/g },
  { id: 'surface_hardcoded_or_fallback_id', regex: /\bclient-101\b|\bdsh-10021\b|\bmanual-\$\{Date\.now\(\)\}\b|\bfield-store-\$\{Date\.now\(\)\}\b/g },
  { id: 'surface_silent_catch', regex: /catch\s*\([^)]*\)\s*\{\s*(?:\/\/[^\n]*\n\s*)?\}/g },
  { id: 'surface_status_or_next_action_map', regex: /\bstatusMap\b|\bnextActionMap\b/g },
  { id: 'surface_large_mapping_function', regex: /\bmapRuntimeRowToPartnerItem\b|\bcommissionRecord\b|\bearningRecord\b/g },
];

const report = createReport('GUARD_SURFACE_LIGHTWEIGHT_BINDINGS', [
  'governance/07_SURFACES_AND_SERVICES.md',
  'governance/22_DSH_GOLDEN_SLICE.md'
]);

for (const relative of surfaceFiles) {
  const abs = path.join(root, relative);
  if (!fs.existsSync(abs)) continue;
  const text = fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '');
  const relFile = toPosix(relative);
  const stateCount = countMatches(text, /\bReact\.useState\b|\buseState\b/g);
  const effectCount = countMatches(text, /\bReact\.useEffect\b|\buseEffect\b/g);

  if (stateCount > 12) {
    report.fail(relFile, 'Move business state into shared controller/binding hooks.', `${stateCount} useState calls`);
  }
  if (effectCount > 3) {
    report.fail(relFile, 'Move runtime effects into shared controller/binding hooks.', `${effectCount} useEffect calls`);
  }
  if (relFile.endsWith('DshClientSurface.tsx')) {
    const propCount = countJsxProps(text, 'DshClientRouteRenderer');
    if (propCount > 25) {
      report.fail(relFile, 'Pass grouped model/actions/runtime objects instead of surface-level prop fanout.', `${propCount} props passed to DshClientRouteRenderer`);
    }
  }

  for (const rule of rules) {
    rule.regex.lastIndex = 0;
    let match;
    while ((match = rule.regex.exec(text)) !== null) {
      report.fail(
        relFile,
        'Surface hosts must stay as UI/runtime binding shells; move shared behavior into DSH shared controllers/adapters.',
        `${rule.id} (line ${lineNumber(text, match.index)}: ${match[0].slice(0, 80)})`
      );
    }
  }
}

finalize(report, args);
