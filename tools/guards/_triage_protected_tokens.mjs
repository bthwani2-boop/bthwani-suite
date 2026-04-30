#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

const arg = process.argv[2] || 'tools/registry/runs/GUARD_BTHWANI_PROTECTED_TOKENS-20260430-001122';
const csvPath = path.resolve(arg, 'protected-tokens-findings.csv');
const outPath = path.resolve(arg, 'TRIAGE_SUMMARY.md');

async function main() {
  let csv;
  try {
    csv = await fs.readFile(csvPath, 'utf8');
  } catch (e) {
    console.error('Error reading CSV:', e.message);
    process.exit(2);
  }
  const lines = csv.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) {
    console.error('Empty CSV');
    process.exit(3);
  }
  // drop header
  lines.shift();

  const typeCounts = {};
  const segmentCounts = {};
  const fileCounts = {};

  for (const line of lines) {
    const firstComma = line.indexOf(',');
    if (firstComma === -1) continue;
    const secondComma = line.indexOf(',', firstComma + 1);
    if (secondComma === -1) continue;
    const type = line.slice(0, firstComma);
    const fileAndRest = line.slice(secondComma + 1);
    const thirdComma = fileAndRest.indexOf(',');
    const file = thirdComma === -1 ? fileAndRest : fileAndRest.slice(0, thirdComma);
    const fileNorm = file.replace(/^"(.*)"$/, '$1').trim();
    const topSeg = fileNorm.split('/')[0] || '(root)';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
    segmentCounts[topSeg] = (segmentCounts[topSeg] || 0) + 1;
    fileCounts[fileNorm] = (fileCounts[fileNorm] || 0) + 1;
  }

  const total = lines.length;
  const uniqueFiles = Object.keys(fileCounts).length;
  const segments = Object.entries(segmentCounts).sort((a, b) => b[1] - a[1]);
  const topFiles = Object.entries(fileCounts).sort((a, b) => b[1] - a[1]).slice(0, 20);
  const now = new Date().toISOString();

  let md = `# TRIAGE_SUMMARY for ${path.basename(arg)}\n\nGenerated: ${now}\n\n`;
  md += `- Total findings: ${total}\n`;
  md += `- Unique files: ${uniqueFiles}\n`;
  md += `- Types:\n`;
  for (const [k, v] of Object.entries(typeCounts)) md += `  - ${k}: ${v}\n`;
  md += `\n- Top path segments:\n`;
  for (const [seg, count] of segments.slice(0, 12)) {
    md += `  - ${seg}: ${count}\n`;
    const samples = Object.keys(fileCounts).filter(f => f.startsWith(seg + '/')).slice(0, 3);
    if (samples.length) md += `    - examples: ${samples.join(', ')}\n`;
  }
  md += `\n- Top files (by hits):\n`;
  for (const [f, c] of topFiles) md += `  - ${c} × ${f}\n`;

  md += `\n**Suggested next actions**:\n`;
  md += `- Review top segments and decide baseline promotions (e.g., governance/.github, packages/ui-kit).\n`;
  md += `- Triage files under 'apps' and 'packages/surfaces' as potential remediation targets.\n`;
  md += `- Reply with one of: (A) promote governance to baseline, (B) produce promotion list, (C) start remediation PRs.\n`;

  await fs.writeFile(outPath, md, 'utf8');
  console.log('Wrote', outPath);
}

main().catch(e => { console.error(e); process.exit(1); });
