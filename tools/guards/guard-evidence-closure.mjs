import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, createReport, finalize, walkFiles, readText, rel, lineNumber } from './lib/guard-utils.mjs';

const args = parseArgs();
const report = createReport('EVIDENCE-CLOSURE', 'governance/11_EVIDENCE_AND_TRACEABILITY.md');
const root = args.root;

if (!fs.existsSync(path.join(root, 'tools/registry'))) {
  report.warn('tools/registry', 'Canonical registry root is missing. Evidence runs must use tools/registry/runs/{SESSION_ID}.');
}

const mdFiles = walkFiles(root, { startDirs: ['governance', 'tools'], extensions: new Set(['.md']) });
const closureRegex = /\b(PASS|READY_FOR_PR|READY|CLOSED|LOCKED|DONE|FINAL|100%)\b/g;
for (const file of mdFiles) {
  const relative = rel(root, file);
  if (relative.startsWith('tools/registry/runs/')) continue;
  if (relative === 'governance/11_EVIDENCE_AND_TRACEABILITY.md') continue;
  const text = readText(file);
  let match;
  while ((match = closureRegex.exec(text)) !== null) {
    const start = Math.max(0, match.index - 300);
    const end = Math.min(text.length, match.index + 300);
    const window = text.slice(start, end);
    if (!/evidence|دليل|أدلة|tools\/registry\/runs|git status|diff check|tsc/i.test(window)) {
      report.warn(relative, 'Closure/status claim appears without nearby evidence wording.', `line ${lineNumber(text, match.index)}: ${match[0]}`);
    }
  }
}

finalize(report, args);
