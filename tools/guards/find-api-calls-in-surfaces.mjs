#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const DIRS = ['dsh/frontend/app-captain','dsh/frontend/app-client','dsh/frontend/app-field','dsh/frontend/app-partner'];

const ALLOWLIST = [/Surface\.tsx$/,/RouteRenderer\.tsx$/,/BottomNav\.tsx$/,/\/index\.ts$/,/navigation-bridge/,/\.routes\.ts$/,/\.screen-registry\.ts$/,/\.types\.ts$/,/\/contracts\//];

const API_PATTERNS = [
  { id: 'client_api_call', re: /\b[a-z_]+[Cc]lient\s*\.\s*(list|update|delete|submit|upload|create|get)[A-Z][A-Za-z0-9]*\s*\(/ },
  { id: 'list_fn_call', re: /\blist[A-Z][A-Za-z0-9]*\s*\(/ },
  { id: 'direct_fetch', re: /\bfetch\s*\(/ },
];

function walk(dir, out=[]) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir,{withFileTypes:true})) {
    const full=path.join(dir,e.name);
    if (e.isDirectory()) walk(full,out);
    else if (/\.(ts|tsx)$/.test(e.name)) out.push(full);
  }
  return out;
}

const results = [];
for (const d of DIRS) {
  for (const f of walk(path.join(root,d))) {
    const rel = f.slice(root.length+1).replace(/\\/g,'/');
    if (ALLOWLIST.some(r=>r.test(rel))) continue;
    const text = fs.readFileSync(f,'utf8');
    const hits = [];
    for (const p of API_PATTERNS) {
      const m = p.re.exec(text);
      if (m) {
        const line = text.slice(0,m.index).split('\n').length;
        hits.push({ rule: p.id, line, match: m[0].slice(0,80) });
      }
    }
    if (hits.length) results.push({ file: rel, hits });
  }
}

console.log(JSON.stringify({ total: results.length, results }, null, 2));
