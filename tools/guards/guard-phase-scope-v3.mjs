#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, createResult, writeOutputs, walk, isTextFile, readText, lineOf, loadBaseline, getGitTouchedFiles } from './common-v3.mjs';
const args = parseArgs(); args.root = args.root || process.cwd();
const phase = args.phase || 'UI_UX_FLOW';
const strict = !!args.strict;
const mode = args.mode || 'Audit';
const r = createResult('GUARD_PHASE_SCOPE_V3', args);
const contextPath = path.join(args.root,'tools/guards/phase-context.json');
if (!fs.existsSync(contextPath)) r.add('WARN','missing_phase_context',contextPath,'No phase-context.json installed. Using runner phase only. Add phase context for precise scope.');
else {
  try { const c = JSON.parse(fs.readFileSync(contextPath,'utf8')); if (!c.phase) r.add('WARN','phase_context_missing_phase',contextPath,'phase-context.json has no phase.'); }
  catch(e) { r.add('FAIL','phase_context_parse',contextPath,`Cannot parse phase context: ${e.message}`); }
}
const uiPhase = phase === 'UI_UX_FLOW';
const files = walk(args.root).filter(isTextFile);
const uiFile = f => /(^|\/)(app-client|app-partner|app-captain|app-field|control-panel|dsh\/frontend|apps\/mobile|apps\/web)\//.test(f.replace(/\\/g,'/'));
for (const f of files) {
  if (f.endsWith('.d.ts')) continue;
  if (!uiFile(path.relative(args.root,f))) continue;
  const txt = readText(f);
  let m;
  const hardUrl = /https?:\/\/[^'"`\s)]+|localhost|127\.0\.0\.1|192\.168\.|10\.0\./ig;
  while ((m = hardUrl.exec(txt))) {
    const sev = 'FAIL';
    r.add(sev,'hardcoded_endpoint_or_lan_in_ui',f,'Hardcoded endpoint/LAN/local URL inside UI/surface scope. API guard blocks this even during UI/UX.',lineOf(txt,m.index),'Move to typed client/config or mark as non-runtime fixture outside screen.');
  }
  const fetchRe = /\bfetch\s*\(/g;
  while ((m = fetchRe.exec(txt))) {
    r.add(uiPhase ? 'FAIL' : 'WARN','direct_fetch_in_ui',f,'Direct fetch in UI/surface scope. During UI/UX this is blocking because it creates runtime/API truth in the wrong phase.',lineOf(txt,m.index),'Use provisional binding matrix or typed API client in binding phase.');
  }
}
if (uiPhase) r.add('INFO','api_guard_phase_mode',null,'API/Runtime missing contracts are INFO during UI_UX_FLOW; only false closure, hardcoding, direct fetch, or fixture-as-runtime becomes blocking.');

// Baseline-aware mode classification
const baseline = loadBaseline(args.root);
if (baseline && mode !== 'Strict') {
  const bg = baseline.guards?.['guard-phase-scope-v3'];
  const baseFailCount = bg?.totals?.failCount ?? Infinity;
  const touchedFiles = (mode === 'Ratchet') ? getGitTouchedFiles(args.root) : new Set();
  const currentFail = r.findings.filter(f=>f.severity==='FAIL').length;
  for (const finding of r.findings) {
    if (finding.severity !== 'FAIL') continue;
    const filePath = finding.file ? finding.file.replace(/\\/g,'/') : '';
    const isTouched = touchedFiles.size > 0 && filePath && touchedFiles.has(filePath);
    if (isTouched && mode === 'Ratchet') { finding.debtClass = 'FIX_TOUCHED_SCOPE'; }
    else if (currentFail <= baseFailCount) { finding.debtClass = 'BASELINE_DEBT'; finding.severity = 'WARN'; }
    else { finding.debtClass = 'BLOCK_NEW'; }
  }
}

if (strict && r.findings.some(f => f.severity === 'WARN')) for (const f of r.findings) if (f.severity === 'WARN') f.severity = 'FAIL';
writeOutputs(r,args);
