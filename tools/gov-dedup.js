#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function parseArgs() {
  const raw = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < raw.length; i++) {
    const a = raw[i];
    if (!a) continue;
    if (a.startsWith('--')) {
      const key = a.replace(/^--/, '');
      const next = raw[i + 1];
      if (next && !next.startsWith('--')) {
        out[key] = next;
        i++;
      } else {
        out[key] = true;
      }
    }
  }
  return out;
}

function mkdirp(p) {
  try { fs.mkdirSync(p, { recursive: true }); } catch (e) { }
}

function listFiles(dir, exts) {
  const out = [];
  function walk(d) {
    const entries = fs.readdirSync(d, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) {
        if (e.name === '.git' || e.name === 'node_modules') continue;
        walk(p);
      } else if (e.isFile()) {
        const ext = path.extname(e.name).toLowerCase();
        if (!exts || exts.has(ext)) out.push(p);
      }
    }
  }
  walk(dir);
  return out;
}

function sha256(s) { return crypto.createHash('sha256').update(s, 'utf8').digest('hex'); }

function firstHeading(content) {
  const m = content.match(/^\s*#\s+(.+)$/m);
  if (m) return m[1].trim();
  const m2 = content.match(/^Title:\s*(.+)$/im);
  if (m2) return m2[1].trim();
  return null;
}

function firstParagraph(content) {
  const parts = content.split(/\r?\n\s*\r?\n/);
  for (const p of parts) {
    const t = p.replace(/\s+/g, ' ').trim();
    if (t.length > 20) return t;
  }
  return content.replace(/\s+/g, ' ').trim().slice(0, 300);
}

const STOPWORDS = new Set([
  'the','this','that','with','from','have','has','for','and','are','was','were','but','not','all','any','into','its','which','their','they','them','will','shall','may','can','also','such','these','those','what','when','where','how','why','our','your','you'
]);

function keywordsFromText(s, max=5) {
  const txt = s.replace(/[^a-zA-Z0-9\s]/g, ' ').toLowerCase();
  const tokens = txt.split(/\s+/).filter(t => t.length>3 && !STOPWORDS.has(t));
  const freq = Object.create(null);
  for (const t of tokens) freq[t] = (freq[t]||0)+1;
  const arr = Object.keys(freq).sort((a,b)=>freq[b]-freq[a]);
  return arr.slice(0, max);
}

function trigrams(s) {
  const t = s.replace(/\s+/g,' ').toLowerCase();
  const out = new Set();
  for (let i=0;i+3<=t.length;i++) out.add(t.slice(i,i+3));
  return out;
}

function diceCoefficient(aSet, bSet) {
  if (!aSet || !bSet) return 0;
  const a = aSet.size, b = bSet.size;
  if (a === 0 && b === 0) return 1;
  let inter = 0;
  // iterate smaller
  const [small, large] = aSet.size < bSet.size ? [aSet, bSet] : [bSet, aSet];
  for (const x of small) if (large.has(x)) inter++;
  return (2 * inter) / (a + b);
}

function unionFind(n) {
  const p = new Array(n).fill(0).map((_,i)=>i);
  function find(x){ return p[x]===x?x:(p[x]=find(p[x])); }
  function union(a,b){ const pa=find(a), pb=find(b); if(pa!==pb) p[pb]=pa; }
  return { find, union, parent: p };
}

function inferType(fname, content){
  const n = fname.toUpperCase();
  if (/LEDGER|BATCH_/.test(n)) return 'LEDGER';
  if (/TEMPLATE|BLUEPRINT/.test(n)) return 'TEMPLATE';
  if (/POLICY|CONTRACT|STANDARD|GOVERNANCE|RULE|PRIVACY|SECURITY/.test(n)) return 'POLICY';
  if (/GUIDE|PLAYBOOK|ROADMAP|HAND-?BOOK|HOWTO/.test(n)) return 'GUIDE';
  if (/CATALOG|INDEX|REGISTER|REGISTRY/.test(n)) return 'CATALOG';
  if (/CHECKLIST|CHECK-?LIST/.test(n)) return 'CHECKLIST';
  return 'DOC';
}

function proposeCanonicalName(mainKeyword, type, used) {
  const k = (mainKeyword||'GENERAL').toUpperCase().replace(/[^A-Z0-9]+/g, '_');
  let base = `GOV_${k}_${type}`;
  let name = base + '.md';
  let i = 1;
  while (used.has(name)) { name = `${base}_${i}.md`; i++; }
  used.add(name);
  return name;
}

function searchReferences(repoRoot, targetRelPath) {
  const out = [];
  function walk(d) {
    const entries = fs.readdirSync(d, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) {
        if (e.name === '.git' || e.name === 'node_modules') continue;
        walk(p);
      } else if (e.isFile()) {
        try {
          const txt = fs.readFileSync(p, 'utf8');
          let idx = txt.indexOf(targetRelPath);
          while (idx >= 0) {
            const start = Math.max(0, idx-60);
            const end = Math.min(txt.length, idx+targetRelPath.length+60);
            out.push({ file: path.relative(repoRoot, p).replace(/\\/g,'/'), snippet: txt.slice(start,end).replace(/\s+/g,' ').trim() });
            idx = txt.indexOf(targetRelPath, idx+1);
          }
        } catch(e){}
      }
    }
  }
  walk(repoRoot);
  return out;
}

// --- main
const opts = parseArgs();
const repoRoot = process.cwd();
const root = opts.root || 'governance';
const outBase = opts.out || path.join('kdt','merge-run');
const mode = opts.mode || 'scan';
const threshold = parseFloat(opts.threshold || 0.75);

if (!fs.existsSync(root)) { console.error('Root folder not found:', root); process.exit(2); }

const ts = new Date().toISOString().replace(/[:.]/g,'-');
const outDir = path.join(outBase, ts);
mkdirp(outDir);

console.log('Scanning', root, '->', outDir);

const exts = new Set(['.md','.mdx','.markdown','.txt','.json']);
const files = listFiles(root, exts).map(f=>path.normalize(f));
const repoFilesCount = files.length;
console.log('Discovered files:', repoFilesCount);
const data = [];

let counter = 0;
for (const f of files) {
  counter++;
  if (counter % 20 === 0) console.log(`Processing ${counter}/${repoFilesCount} ...`);
  try {
    const content = fs.readFileSync(f, 'utf8');
    const rel = f.replace(/\\/g,'/');
    const sha = sha256(content);
    const title = firstHeading(content) || path.basename(f);
    const summary = firstParagraph(content);
    const kws = keywordsFromText(summary + '\n' + title + '\n' + content, 5);
    const sh = trigrams(content.slice(0, 20000));
    const ownerMatches = [];
    const ownerRx = /(Owner|Maintainer|Author|Owner:)\s*[:\-]?\s*([^\n\r]+)/ig;
    let m;
    while ((m = ownerRx.exec(content))) ownerMatches.push(m[2].trim());
    data.push({ path: rel, abs: path.resolve(f), title, summary, keywords: kws, sha, size: fs.statSync(f).size, mtime: fs.statSync(f).mtimeMs, trigramCount: sh.size, shingles: Array.from(sh).slice(0,100), ownerHints: ownerMatches, typeGuess: inferType(path.basename(f), content), _contentSample: content.slice(0,800) });
  } catch (e) {
    console.error('read failed', f, e && e.message ? e.message : e);
  }
}

// exact duplicates by sha
const shaMap = Object.create(null);
data.forEach((d,i)=>{ shaMap[d.sha] = (shaMap[d.sha]||[]); shaMap[d.sha].push(i); });
const exactDuplicateGroups = Object.values(shaMap).filter(a=>a.length>1).map(a=>a.map(i=>data[i].path));

// near duplicates by dice coefficient of trigrams
const n = data.length;
const uf = unionFind(n);
for (let i=0;i<n;i++){
  for (let j=i+1;j<n;j++){
    try {
      const a = new Set(data[i]._sh || data[i].shingles);
      const b = new Set(data[j]._sh || data[j].shingles);
      const sim = diceCoefficient(a,b);
      if (sim >= threshold) uf.union(i,j);
    } catch(e){}
  }
}

const comps = Object.create(null);
for (let i=0;i<n;i++){ const r = uf.find(i); (comps[r]||(comps[r]=[])).push(i); }
const groups = Object.values(comps).filter(c=>c.length>1).map(c=>c.map(i=>data[i].path));

// build canonical suggestions
const usedNames = new Set();
const groupDetails = [];
for (const compIdx in comps) {
  const idxs = comps[compIdx]; if (idxs.length<2) continue;
  const filesIn = idxs.map(i=>data[i]);
  // aggregate keywords
  const agg = Object.create(null);
  for (const f of filesIn) for (const k of f.keywords||[]) agg[k]=(agg[k]||0)+1;
  const mainKeyword = Object.keys(agg).sort((a,b)=>agg[b]-agg[a])[0] || filesIn[0].title.split(/\s+/)[0];
  const typeGuess = filesIn.map(f=>f.typeGuess).reduce((a,b)=>a===b?a:'DOC');
  const canonical = proposeCanonicalName(mainKeyword, typeGuess, usedNames);
  const rationale = `Group of ${filesIn.length} files with shared keywords [${(Object.keys(agg).slice(0,3)).join(', ')}] and similar content.`;
  // map source -> suggested section
  const mapping = filesIn.map(f=>({ source: f.path, mapTo: ['Summary','Policy/Definition','Owners','Procedures','Examples'].filter(Boolean) }));
  groupDetails.push({ canonical, mainKeyword, typeGuess, rationale, members: filesIn.map(f=>f.path), mapping });
}

// external references - single-pass scan for repo files to avoid N*x walks
const externalRefs = [];
{
  const govPaths = data.map(d => d.path);
  const refMap = Object.create(null);
  for (const p of govPaths) refMap[p] = [];
  const textExts = new Set(['.md','.mdx','.markdown','.txt','.json','.js','.ts','.tsx','.jsx','.yml','.yaml','.mdx','.html','.md']);
  function walkRepo(d) {
    const entries = fs.readdirSync(d, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) {
        if (['.git','node_modules'].includes(e.name)) continue;
        walkRepo(p);
      } else if (e.isFile()) {
        const ext = path.extname(e.name).toLowerCase();
        if (!textExts.has(ext)) continue;
        try {
          const txt = fs.readFileSync(p, 'utf8');
          for (const g of govPaths) {
            if (txt.indexOf(g) !== -1) {
              const start = Math.max(0, txt.indexOf(g)-60);
              const end = Math.min(txt.length, txt.indexOf(g)+g.length+60);
              refMap[g].push({ file: path.relative(repoRoot, p).replace(/\\/g,'/'), snippet: txt.slice(start,end).replace(/\s+/g,' ').trim() });
            }
          }
        } catch(e) { }
      }
    }
  }
  walkRepo(repoRoot);
  for (const k of Object.keys(refMap)) if (refMap[k].length) externalRefs.push({ file: k, references: refMap[k] });
}

// files to keep separate
const keepSeparate = data.filter(d => /LEDGER|BATCH_|REBUILD|ARCHIVE|CLOSEOUT|LEDGER/.test(d.path.toUpperCase())).map(d=>d.path);

// owners: best-effort
let codeowners = null;
const codeownersPaths = ['.github/CODEOWNERS','CODEOWNERS'];
for (const p of codeownersPaths) if (fs.existsSync(p)) { codeowners = fs.readFileSync(p,'utf8'); break; }
const owners = data.map(d=>({ file: d.path, hints: d.ownerHints, codeownersMatch: (codeowners && codeowners.indexOf(d.path)!==-1) ? true : false }));

// risk & effort estimation per group
const groupEstimates = groupDetails.map(g => {
  const groupSize = g.members.length;
  const refs = externalRefs.filter(r=> g.members.includes(r.file)).length;
  const hours = Math.max(1, Math.ceil(groupSize*1.5 + refs*0.5));
  const effort = hours <= 4 ? 'low' : (hours <= 20 ? 'medium' : 'high');
  const risk = Math.min(10, Math.ceil((groupSize + refs) / 1.5));
  return { canonical: g.canonical, members: g.members, effortHoursEstimate: hours, effortLevel: effort, riskScore: risk, blockers: refs>0?['cross-file references']:[] };
});

const analysis = {
  generatedAt: new Date().toISOString(),
  repoRoot: repoRoot.replace(/\\/g,'/'),
  scannedRoot: root,
  filesCount: data.length,
  files: data.map(d=>({ path: d.path, title: d.title, summary: d.summary, keywords: d.keywords, sha: d.sha, size: d.size, mtime: d.mtime, typeGuess: d.typeGuess, ownerHints: d.ownerHints })),
  exactDuplicateGroups,
  groups: groupDetails,
  externalReferences: externalRefs,
  filesToKeepSeparate: keepSeparate,
  owners,
  groupEstimates
};

const outJson = path.join(outDir, 'merge-plan.json');
fs.writeFileSync(outJson, JSON.stringify({ analysis }, null, 2), 'utf8');
const report = [];
report.push(`# Gov Dedup Scan Report - ${new Date().toISOString()}`);
report.push(`Scanned root: ${root}`);
report.push(`Files scanned: ${data.length}`);
if (exactDuplicateGroups.length) {
  report.push('\n## Exact duplicates');
  for (const g of exactDuplicateGroups) report.push(`- ${g.join(' , ')}`);
}
if (groupDetails.length) {
  report.push('\n## Near-duplicate groups');
  for (const g of groupDetails) {
    report.push(`- Canonical: ${g.canonical}  \n  Members:\n    - ${g.members.join('\n    - ')}`);
    report.push(`  Rationale: ${g.rationale}`);
  }
}
report.push('\n## Files to keep separate (ledgers, batches, archival)');
for (const f of keepSeparate) report.push(`- ${f}`);

fs.writeFileSync(path.join(outDir, 'report.md'), report.join('\n\n'), 'utf8');

console.log('Wrote merge plan to', outJson);
console.log('Wrote human report to', path.join(outDir, 'report.md'));
console.log('Done.');
