const fs = require('fs');
const files = [
  'dsh/frontend/control-panel/catalogs/approvals/item-approval.screen.tsx',
  'dsh/frontend/control-panel/catalogs/categories/categories.screen.tsx',
  'dsh/frontend/control-panel/catalogs/index.ts',
  'dsh/frontend/control-panel/catalogs/listing-governance/listing-governance.screen.tsx',
  'dsh/frontend/data/publishing-gates.preview-data.ts',
  'dsh/frontend/shared/dshCrossSurfaceClosureMap.ts'
];
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/[ \t]+(\r?\n)/g, '$1');
  content = content.replace(/\s+$/, '') + '\n';
  fs.writeFileSync(file, content, 'utf8');
}
