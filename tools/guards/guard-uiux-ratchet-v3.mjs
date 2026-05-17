#!/usr/bin/env node
import path from 'node:path';
import { parseArgs, createResult, writeOutputs, walk, isTextFile, readText, lineOf, loadBaseline, getGitTouchedFiles } from './common-v3.mjs';
const args = parseArgs(); args.root = args.root || process.cwd();
const strict = !!args.strict;
const mode = args.mode || 'Audit';
const r = createResult('GUARD_UIUX_RATCHET_V3', args);
const files = walk(args.root).filter(f => isTextFile(f) && /\.(tsx|ts|js|mjs|md|json)$/.test(f));
const brandHex = new Set(['#0A2F5C','#0a2f5c','#FF500D','#ff500d','#FFFFFF','#ffffff']);
for (const f of files) {
  const rp = path.relative(args.root,f).replace(/\\/g,'/');
  const txt = readText(f); if (!txt) continue;
  let m;
  const insideUiKit = rp.startsWith('packages/ui-kit/') || rp.startsWith('ui-kit/'); // not active path ref: scanned-file classification
  const tamagui = /from\s+['"](?:tamagui|@tamagui\/[^'"]+)['"]|require\(['"](?:tamagui|@tamagui\/[^'"]+)['"]\)/g;
  while ((m=tamagui.exec(txt))) {
    if (!insideUiKit && rp !== 'tamagui.build.ts' && !rp.endsWith('/tamagui.build.ts') && !/\.md$/i.test(rp)) r.add('FAIL','direct_tamagui_outside_ui_kit',f,'Direct Tamagui import outside @bthwani/ui-kit boundary.',lineOf(txt,m.index),'Move primitive usage into ui-kit and consume public exports only.'); // not active path ref: scanned-file classification
  }
  const hex = /#[0-9a-fA-F]{3,8}\b/g;
  while ((m=hex.exec(txt))) {
    const value = m[0];
    if (!brandHex.has(value)) {
      const reusable = rp.startsWith('packages/') || rp.includes('/components/') || rp.includes('/ui-kit/'); // not active path ref: scanned-file classification
      r.add(reusable ? 'FAIL' : 'WARN','central_color_system_drift',f,`Hardcoded non-core color ${value}. توجب الالتزام بنظام الألوان المركزي.`,lineOf(txt,m.index),'Use official @bthwani/ui-kit/design-system token or document exception.');
    }
  }
  const localComponentName = /function\s+(Button|Card|Header|Modal|Sheet|Tabs|List|Field)\b|const\s+(Button|Card|Header|Modal|Sheet|Tabs|List|Field)\s*=/g;
  while ((m=localComponentName.exec(txt))) {
    if (!rp.startsWith('packages/ui-kit/') && !rp.startsWith('ui-kit/')) r.add('WARN','possible_local_reusable_component',f,'Possible reusable UI component implemented locally. تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر.',lineOf(txt,m.index),'Classify ownership; centralize reusable pattern in approved ui-kit owner only if needed and approved.'); // not active path ref: scanned-file classification
  }
  const stateHints=['loading','empty','error','success','offline','disabled'];
  if (/Screen\.tsx$|Screen\.ts$|Workspace\.tsx$|page\.tsx$/.test(rp)) {
    const missing = stateHints.filter(s => !new RegExp(s,'i').test(txt));
    if (missing.length >= 4) r.add('INFO','weak_state_coverage_signal',f,`Screen/workspace may miss state coverage: ${missing.join(', ')}.`,null,'Do not claim UI flow closure until states are mapped or intentionally N/A.');
  }
  if (/textAlign\s*:\s*['"]center['"]/.test(txt) && /[؀-ۿ]/.test(txt)) r.add('WARN','rtl_centered_arabic_signal',f,'Arabic content with centered textAlign signal. Verify this is intentional hero/headline, not list-row misuse.',null,'Provide screenshot evidence for RTL.');
}

// Baseline-aware mode classification
const baseline = loadBaseline(args.root);
if (baseline && mode !== 'Strict') {
  const bg = baseline.guards?.['guard-uiux-ratchet-v3'];
  const baseTamaguiFail = bg?.totals?.tamaguiFailCount ?? Infinity;
  const baseColorWarn = bg?.totals?.hardcodedColorWarnCount ?? Infinity;
  const touchedFiles = (mode === 'Ratchet') ? getGitTouchedFiles(args.root) : new Set();
  const currentTamaguiFail = r.findings.filter(f=>f.severity==='FAIL'&&f.rule==='direct_tamagui_outside_ui_kit').length;
  const currentColorWarn = r.findings.filter(f=>f.severity==='WARN'&&f.rule==='central_color_system_drift').length;
  for (const finding of r.findings) {
    const filePath = finding.file ? finding.file.replace(/\\/g,'/') : '';
    const isTouched = touchedFiles.size > 0 && filePath && touchedFiles.has(filePath);
    if (finding.severity === 'FAIL' && finding.rule === 'direct_tamagui_outside_ui_kit') {
      if (isTouched && mode === 'Ratchet') { finding.debtClass = 'FIX_TOUCHED_SCOPE'; }
      else if (currentTamaguiFail <= baseTamaguiFail) { finding.debtClass = 'BASELINE_DEBT'; finding.severity = 'WARN'; }
      else { finding.debtClass = 'BLOCK_NEW'; }
    }
    if (finding.rule === 'central_color_system_drift') {
      if (isTouched && mode === 'Ratchet' && finding.severity !== 'INFO') { finding.debtClass = 'FIX_TOUCHED_SCOPE'; if (finding.severity === 'WARN') finding.severity = 'FAIL'; }
      else if (currentColorWarn <= baseColorWarn && !finding.debtClass) { finding.debtClass = 'BASELINE_DEBT'; if (finding.severity === 'FAIL') finding.severity = 'WARN'; }
      else if (!finding.debtClass) { finding.debtClass = 'BLOCK_NEW'; }
    }
  }
}

if (strict && r.findings.some(f => f.severity === 'WARN')) for (const f of r.findings) if (f.severity === 'WARN') f.severity = 'FAIL';
writeOutputs(r,args);
