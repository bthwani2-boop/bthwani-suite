const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const files = [
  'control-panel/shell/ControlPanelSurfaceHost.tsx',
  'ui-kit/src/web/root-layout.tsx'
];

for (const rel of files) {
  const p = path.join(cwd, rel);
  if (!fs.existsSync(p)) {
    console.error('Missing', rel);
    continue;
  }
  const src = fs.readFileSync(p, 'utf8');
  const fixed = src.split(/\r?\n/).map((l) => l.replace(/[ \t]+$/, '')).join('\n');
  fs.writeFileSync(p, fixed, 'utf8');
  console.log('Trimmed trailing whitespace:', rel);
}
