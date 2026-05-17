#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, createResult, writeOutputs, walk, isTextFile, readText, lineOf } from './common-v3.mjs';
const args = parseArgs(); args.root = args.root || process.cwd();
const strict = !!args.strict;
const r = createResult('GUARD_DSH_PLATFORM_VARS_V3', args);
const files = walk(args.root).filter(f => isTextFile(f) && /\.(tsx|ts|js|mjs|md|json)$/.test(f));
const dshScope = f => /(^|\/)(dsh\/frontend|control-panel\/runtime|wlt\/frontend)\//.test(f.replace(/\\/g,'/'));
for (const f of files) {
  const rp = path.relative(args.root,f).replace(/\\/g,'/');
  if (!dshScope(rp)) continue;
  const txt = readText(f); if (!txt) continue;
  let m;
  const financialFinal = /ledger\s*(mutation|write|update)|wallet\s*(balance|mutation|update)|refund\s*(final|finalize|settle)|settlement\s*(final|mutation|write)|reconciliation\s*(final|write)/ig;
  while ((m=financialFinal.exec(txt))) {
    if (!rp.startsWith('wlt/')) r.add('FAIL','wlt_financial_boundary',f,'Financial final-truth/mutation semantic appears outside WLT scope.',lineOf(txt,m.index),'DSH must not own wallet balance, ledger mutation, final settlement, refund finalization, or reconciliation.');
  }
  const mutableTerms = /deliveryFee|smallOrderFee|commission|surge|providerPriority|fallback|assignmentRadius|settlementWindow|refundPolicy|fee\s*[:=]|commission\s*[:=]|surge\s*[:=]/g;
  while ((m=mutableTerms.exec(txt))) {
    if (!/VAR_|varPolicy|Vars|variable/i.test(txt.slice(Math.max(0,m.index-300), m.index+300))) r.add('WARN','mutable_policy_not_var_classified',f,'Mutable DSH/WLT/provider policy signal is not clearly classified as VAR/provider policy.',lineOf(txt,m.index),'Expose as Platform/Vars policy in UI flow; do not bind runtime/API until later phase.');
  }
  if (rp.includes('control-panel') && /route|page|tab|workspace/i.test(txt) && /new\s+route|router\.push|href=/.test(txt) && !/Platform|Vars|ControlPanelDshPlatform/i.test(txt)) r.add('INFO','control_panel_route_sprawl_signal',f,'Potential control-panel route/page sprawl signal. Verify control-room model and progressive disclosure.',null,'Prefer same workspace/sheet/tabs when appropriate.');
}
const varsPath = path.join(args.root,'dsh/frontend/control-panel/platform/Vars');
if (!fs.existsSync(varsPath)) r.add('WARN','platform_vars_path_missing',varsPath,'Expected Platform/Vars workspace path is missing in snapshot or branch.');
if (strict && r.findings.some(f => f.severity === 'WARN')) for (const f of r.findings) if (f.severity === 'WARN') f.severity = 'FAIL';
writeOutputs(r,args);
