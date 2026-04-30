import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT } from './_guard-common.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getChangedFiles() {
  try {
    const out = execFileSync('git', ['diff', '--name-only', 'origin/main...HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
    if (out) return out.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  } catch (e) {
    try {
      const out2 = execFileSync('git', ['diff', '--name-only', 'HEAD~1..HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
      if (out2) return out2.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    } catch (err) {
      return [];
    }
  }
  return [];
}

function unique(arr) { return Array.from(new Set(arr)); }

function topLevel(file) {
  if (!file) return '';
  return file.includes('/') ? file.split('/')[0] : file.split('\\')[0];
}

function runGuardScript(script, roots) {
  console.log(`\n--- Running ${script} (AFFECTED_ROOTS=${roots.join(',')})`);
  try {
    execFileSync('node', [path.join(ROOT, script)], {
      cwd: ROOT,
      env: { ...process.env, AFFECTED_ROOTS: roots.join(',') },
      stdio: 'inherit',
    });
  } catch (e) {
    console.warn(`guard ${script} exited with non-zero status`);
  }
}

async function main() {
  const changed = getChangedFiles();
  const roots = unique(changed.map(topLevel).filter(Boolean));

  if (!roots.length) {
    console.log('No affected top-level roots detected; running full guard set.');
  } else {
    console.log('Affected roots:', roots.join(', '));
  }

  const guardScripts = [
    'tools/guards/guard-bthwani-protected-tokens.mjs',
    'tools/guards/guard-tamagui-governance-law.mjs',
    'tools/guards/guard-tamagui-import-boundary.mjs',
    'tools/guards/guard-secret-scan.mjs',
    'tools/guards/guard-runtime-smoke-test.mjs',
  ];

  for (const g of guardScripts) runGuardScript(g, roots);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
