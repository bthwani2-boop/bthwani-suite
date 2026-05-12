import path from 'node:path';
import { parseArgs, createReport, finalize, readJson, readTextSafe, gitTrackedFiles } from './lib/guard-utils.mjs';

const args = parseArgs();
const root = args.root;
const config = readJson(path.join(root, 'tools/guards/guard-secret-scan.config.json'));
const report = createReport('SECRET-SCAN', 'governance/16_SECURITY_AND_SECRETS.md');

const ignored = (file) => (config.ignorePaths ?? []).some((prefix) => file.startsWith(prefix));
const candidates = gitTrackedFiles(root)
  .filter((file) => /\.(ts|tsx|js|jsx|mjs|cjs|json|env|txt|md|yaml|yml|ps1)$/i.test(file))
  .filter((file) => !ignored(file))
  .slice(0, Number(config.maxFiles ?? 2000));

const compiled = Object.entries(config.patterns ?? {}).map(([name, source]) => ({
  name,
  regex: new RegExp(source, 'i'),
}));

for (const relative of candidates) {
  const text = readTextSafe(path.join(root, relative));
  for (const { name, regex } of compiled) {
    if (regex.test(text)) {
      report.fail(relative, `Secret pattern matched: ${name}`);
    }
  }
  if (/password\s*[:=]\s*['"]?[A-Za-z0-9\-_.]{8,}['"]?/i.test(text)) {
    report.warn(relative, 'Possible plaintext password assignment detected.');
  }
}

finalize(report, args);
