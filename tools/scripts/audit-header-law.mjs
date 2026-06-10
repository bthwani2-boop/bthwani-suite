/**
 * audit-header-law.mjs
 * Header Law: Orange headers for top-level pages, white headers for sub-pages,
 * dense admin top bars for control panels.
 *
 * Check: does the screen use ScreenHeader/MobileWorkspaceHeader/TopBar correctly?
 * Violations: white header on a top-level screen, or missing header entirely.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function globTsx(dir, acc = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return acc; }
  for (const e of entries) {
    const full = join(dir, e);
    let st;
    try { st = statSync(full); } catch { continue; }
    if (st.isDirectory()) {
      if (['node_modules', '.git', 'dist', '.next', '__generated__'].includes(e)) continue;
      globTsx(full, acc);
    } else if (e.endsWith('.tsx')) {
      acc.push(full.replace(/\\/g, '/'));
    }
  }
  return acc;
}

const screenFiles = globTsx('dsh/frontend')
  .concat(globTsx('wlt/frontend'))
  .filter(f => f.includes('/screens/') && !f.includes('/control-panel/'));

const findings = {
  noHeader: [],
  hasScreenHeader: [],
  hasTopBar: [],
  hasMobileWorkspaceHeader: [],
  hasCustomHeader: [],
};

for (const f of screenFiles) {
  let src;
  try { src = readFileSync(f, 'utf8'); } catch { continue; }
  const shortPath = f.split('/').slice(-4).join('/');

  const hasScreenHeader = /ScreenHeader\b/.test(src);
  const hasTopBar = /TopBar\b/.test(src);
  const hasMobileHeader = /MobileWorkspaceHeader\b/.test(src);
  const hasCustomHeader = /headerRow\b|headerTitle\b|<.*Header.*tone=|<.*TopBar/.test(src);
  const hasAnyHeader = hasScreenHeader || hasTopBar || hasMobileHeader;

  if (hasScreenHeader) findings.hasScreenHeader.push(shortPath);
  else if (hasTopBar) findings.hasTopBar.push(shortPath);
  else if (hasMobileHeader) findings.hasMobileWorkspaceHeader.push(shortPath);
  else if (!hasAnyHeader) findings.noHeader.push(shortPath);
}

console.log('=== HEADER LAW AUDIT ===\n');
console.log(`Screens using ScreenHeader: ${findings.hasScreenHeader.length}`);
console.log(`Screens using TopBar: ${findings.hasTopBar.length}`);
console.log(`Screens using MobileWorkspaceHeader: ${findings.hasMobileWorkspaceHeader.length}`);
console.log(`\nScreens with NO header component: ${findings.noHeader.length}`);
findings.noHeader.forEach(f => console.log(`  ${f}`));
