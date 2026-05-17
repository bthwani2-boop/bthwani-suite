#!/usr/bin/env node
import path from 'node:path';
import { parseArgs, createResult, writeOutputs, walk, isTextFile, readText, lineOf } from './common-v3.mjs';
const args = parseArgs(); args.root = args.root || process.cwd();
const strict = !!args.strict;
const r = createResult('GUARD_RELEASE_READINESS_V3', args);
const files = walk(args.root).filter(isTextFile);
for (const f of files) {
  const rp = path.relative(args.root,f).replace(/\\/g,'/');
  const txt = readText(f); if (!txt) continue;
  let m;
  const secret = /(api[_-]?key|secret|token|password|private[_-]?key)\s*[:=]\s*['"][^'"]{8,}['"]/ig;
  while ((m=secret.exec(txt))) r.add('FAIL','possible_secret',f,'Possible secret-like assignment in tracked text file.',lineOf(txt,m.index),'Remove secret, rotate if real, and use safe env/secret manager.');
  const suppress = /@ts-ignore|@ts-expect-error|eslint-disable/g;
  while ((m=suppress.exec(txt))) r.add(strict?'FAIL':'WARN','suppression_requires_owner',f,'Suppression comment requires owner/reason/expiry or removal.',lineOf(txt,m.index),'Add owner/reason/expiry or fix root cause.');
  const todo = /\b(TODO|FIXME|HACK|TEMPORARY|WORKAROUND)\b/ig;
  while ((m=todo.exec(txt))) r.add('INFO','todo_debt_signal',f,'TODO/FIXME/HACK/TEMPORARY signal. Require owner/expiry before release if in touched scope.',lineOf(txt,m.index),'Classify or remove.');
}
writeOutputs(r,args);
