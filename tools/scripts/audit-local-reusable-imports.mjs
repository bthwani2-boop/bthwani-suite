import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function glob(dir, acc = []) {
  let e; try { e = readdirSync(dir); } catch { return acc; }
  for (const n of e) {
    const f = join(dir, n);
    let s; try { s = statSync(f); } catch { continue; }
    if (s.isDirectory()) {
      if (['node_modules', '.git', 'dist', '.next'].includes(n)) continue;
      glob(f, acc);
    } else if (n.endsWith('.tsx') || n.endsWith('.ts')) {
      acc.push(f.replace(/\\/g, '/'));
    }
  }
  return acc;
}

const files = glob('dsh/frontend').concat(glob('wlt/frontend'));
const reusableNames = new Set([
  'Button', 'StickyActionBar', 'Card', 'Header', 'ScreenHeader', 'TopBar', 'SearchTopBar',
  'Badge', 'Chip', 'Pill', 'StateView', 'TextField', 'SelectField', 'DataTable',
  'IconButton', 'DirectionalIcon', 'EmptyState', 'ErrorState', 'LoadingState', 'Banner',
  'Tabs', 'SegmentedControl', 'FilterBar', 'FilterSheet', 'Modal', 'Sheet',
]);
const pathSegs = ['components', 'ui', 'design', 'design-system', 'controls', 'widgets', 'patterns', 'styles', 'theme'];
const importRe = /import\s+(?:type\s+)?([^'";]+?)\s+from\s+(['"])([^'"]+)\2/g;
const skipPatterns = ['ui-kit/', '.test.', '.spec.', '.stories.', '__generated__', 'fixture', 'mock'];

const results = [];

for (const f of files) {
  if (skipPatterns.some(p => f.includes(p))) continue;
  let src; try { src = readFileSync(f, 'utf8'); } catch { continue; }

  importRe.lastIndex = 0;
  let m;
  while ((m = importRe.exec(src)) !== null) {
    const spec = m[3];
    if (!spec.startsWith('.')) continue;
    const norm = spec.replace(/\\/g, '/').toLowerCase();
    if (!pathSegs.some(s => norm.includes(`/${s}/`) || norm.endsWith(`/${s}`) || norm.startsWith(`${s}/`))) continue;
    const clause = m[1];
    const names = clause
      .replace(/\btype\b/g, ' ')
      .replace(/\bas\b\s+\w+/g, ' ')
      .replace(/[{}*]/g, ' ')
      .trim()
      .split(/[,\s]+/)
      .filter(Boolean)
      .filter(n => /^[A-Z]/.test(n));
    const matched = names.filter(n => reusableNames.has(n));
    if (matched.length > 0) {
      results.push(`${f.split('/').slice(-3).join('/')} → ${spec} (${matched.join(', ')})`);
    }
  }
}

results.slice(0, 30).forEach(r => console.log('  ' + r));
console.log(`\nTotal: ${results.length}`);
