const fs = require('fs');
const path = require('path');

const findingsPath = process.argv[2] || 'tools/registry/runs/GUARD_BTHWANI_PROTECTED_TOKENS-20260430-040548/protected-tokens-findings.csv';
const allowlistPath = process.argv[3] || 'kdt/merge-run/2026-04-30T01-17-17-530Z/proposed/remediations/proposed-allowlist-entries.txt';
const outPath = process.argv[4] || 'kdt/merge-run/2026-04-30T01-17-17-530Z/proposed/remediations/simulated-allowlist-result.md';

function parseCSVLine(line){
  const fields = [];
  let cur = '';
  let inQuotes = false;
  for(let i=0;i<line.length;i++){
    const ch = line[i];
    if(ch === '"'){
      if(inQuotes && line[i+1] === '"'){ cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if(ch === ',' && !inQuotes){
      fields.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  fields.push(cur);
  return fields;
}

function loadFindings(fp){
  const raw = fs.readFileSync(fp, 'utf8').trim();
  if(!raw) return [];
  const lines = raw.split(/\r?\n/);
  const header = lines.shift();
  return lines.map(l => {
    const cols = parseCSVLine(l);
    return { type: cols[0]||'', severity: cols[1]||'', file: cols[2]||'', reason: cols.slice(3).join(',')||'' };
  });
}

function loadAllowlist(fp){
  const raw = fs.readFileSync(fp, 'utf8');
  return raw.split(/\r?\n/).map(l=>l.trim()).filter(l=>l && !l.startsWith('#')).map(l=>{
    const parts = l.split('||').map(p=>p.trim());
    return { glob: parts[0]||'', pattern: parts[1]||'', reason: parts[2]||'' };
  });
}

function matchGlob(file, glob){
  if(!glob) return false;
  if(glob.endsWith('*')){
    const prefix = glob.slice(0,-1);
    return file.startsWith(prefix);
  }
  return file === glob;
}

try{
  const findings = loadFindings(findingsPath);
  const allowlist = loadAllowlist(allowlistPath);

  let allowed = [];
  let remaining = [];

  for(const f of findings){
    let isAllowed = false;
    for(const a of allowlist){
      try{
        if(matchGlob(f.file, a.glob)){
          const re = new RegExp(a.pattern, 'i');
          if(re.test((f.reason||'') + ' ' + (f.file||''))){ isAllowed = true; break; }
        }
      }catch(e){ /* invalid regex - skip */ }
    }
    if(isAllowed) allowed.push(f); else remaining.push(f);
  }

  const summary = [];
  summary.push('# Simulated Allowlist Result');
  summary.push('');
  summary.push('- Run: GUARD_BTHWANI_PROTECTED_TOKENS-20260430-040548');
  summary.push(`- Findings total: ${findings.length}`);
  summary.push(`- Allowed by proposed allowlist: ${allowed.length}`);
  summary.push(`- Remaining findings: ${remaining.length}`);
  summary.push('');
  summary.push('## Top remaining findings (first 20)');
  summary.push('');
  remaining.slice(0,20).forEach(r=>{
    summary.push(`- ${r.file} — ${r.reason}`);
  });
  summary.push('');
  summary.push('## Notes');
  summary.push('- This is a local simulation: the proposed allowlist file was applied offline to the findings CSV; the guard itself was not modified.');
  summary.push('- If you want these allowlist entries enforced by the guard, we must add them to the guard config and re-run the guard on CI or locally.');

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, summary.join('\n'));
  console.log('WROTE', outPath);
  console.log('TOTAL', findings.length, 'ALLOWED', allowed.length, 'REMAINING', remaining.length);
} catch(err){
  console.error(err.message || err);
  process.exit(1);
}
