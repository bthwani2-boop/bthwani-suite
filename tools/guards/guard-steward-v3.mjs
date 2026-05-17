#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, createResult, writeOutputs, walk, normalizePath } from './common-v3.mjs';
const args = parseArgs();
args.root = args.root || process.cwd();
const r = createResult('GUARD_STEWARD_V3', args);
const manifestPath = path.join(args.root, 'tools/guards/guard-manifest.json');
if (!fs.existsSync(manifestPath)) r.add('FAIL','missing_manifest',manifestPath,'Missing tools/guards/guard-manifest.json','', 'Restore or create guard manifest.');
let manifest = null;
try { manifest = JSON.parse(fs.readFileSync(manifestPath,'utf8')); } catch(e) { r.add('FAIL','manifest_parse',manifestPath,`Cannot parse manifest: ${e.message}`); }
if (manifest) {
  if (!String(manifest.policy_source_rule || '').includes('governance/')) r.add('WARN','policy_source_rule',manifestPath,'Manifest should state governance owns policy and tools/guards verifies only.');
  const ids = new Set(); const files = new Set();
  for (const entry of manifest.guards || []) {
    if (!entry.id) r.add('FAIL','entry_missing_id',manifestPath,'Manifest entry missing id.');
    if (entry.id && ids.has(entry.id)) r.add('FAIL','duplicate_id',manifestPath,`Duplicate manifest id: ${entry.id}`);
    if (entry.id) ids.add(entry.id);
    if (!entry.file) r.add('FAIL','entry_missing_file',manifestPath,`${entry.id || 'unknown'} missing file.`);
    if (entry.file) {
      files.add(normalizePath(entry.file));
      if (!fs.existsSync(path.join(args.root, entry.file))) r.add('FAIL','missing_guard_file',path.join(args.root, entry.file),`${entry.id} points to missing guard file.`);
    }
    const policies = Array.isArray(entry.ownerPolicy) ? entry.ownerPolicy : entry.ownerPolicy ? [entry.ownerPolicy] : [];
    if (!policies.length) r.add('FAIL','missing_owner_policy',manifestPath,`${entry.id} has no ownerPolicy.`);
    for (const p of policies) if (!fs.existsSync(path.join(args.root,p))) r.add('FAIL','missing_owner_policy_file',path.join(args.root,p),`${entry.id} ownerPolicy missing: ${p}`);
    if (!entry.runners || !entry.runners.length) r.add('WARN','missing_runners',manifestPath,`${entry.id} has no runners list.`);
    if (!entry.outputs || !entry.outputs.includes('json') || !entry.outputs.includes('md')) r.add('WARN','missing_outputs',manifestPath,`${entry.id} should output json and md.`);
    if (!entry.logicalGuardIds) r.add('INFO','v3_mapping_missing',manifestPath,`${entry.id} has no logicalGuardIds mapping yet; acceptable in legacy manifest, required in v3.`);
    if (!entry.phasePolicy) r.add('INFO','phase_policy_missing',manifestPath,`${entry.id} has no phasePolicy yet; acceptable in legacy manifest, required before phase-aware release.`);
    if (entry.disabled === true) {
      if (!entry.disabledReason || !entry.disabledOwner || !entry.disabledUntil) r.add('FAIL','unsafe_disabled_guard',manifestPath,`${entry.id} disabled without reason/owner/expiry.`);
    }
  }
  for (const f of walk(path.join(args.root,'tools/guards')).filter(x => /guard-.*\.mjs$/.test(x))) {
    const rp = normalizePath(path.relative(args.root, f));
    if (rp.includes('/v3/')) continue;
    if (!files.has(rp)) r.add('WARN','orphan_guard_file',f,'Guard file exists but is not declared in manifest.');
  }
}
writeOutputs(r,args);
