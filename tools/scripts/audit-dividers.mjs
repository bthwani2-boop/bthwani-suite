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
const standalone = [], borderBottom = [];

for (const f of files) {
  let src; try { src = readFileSync(f, 'utf8'); } catch { continue; }
  const hasHeight1 = /height:\s*1\b.*(?:backgroundColor|borderColor)/.test(src);
  const hasBorderBottom = /borderBottomWidth:\s*1\b/.test(src);
  if (hasHeight1) standalone.push(f.split('/').slice(-3).join('/'));
  else if (hasBorderBottom) borderBottom.push(f.split('/').slice(-3).join('/'));
}

console.log(`--- Standalone height:1 dividers (${standalone.length}):`);
standalone.forEach(f => console.log('  ' + f));
console.log(`\n--- Border-bottom row separators (${borderBottom.length}):`);
borderBottom.forEach(f => console.log('  ' + f));
