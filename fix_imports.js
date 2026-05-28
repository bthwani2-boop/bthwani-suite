const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    if (item === 'parts' || item === 'node_modules' || item === '.next') continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      if (content.includes("from './parts'")) { content = content.replace(/from '\.\/parts'/g, "from './catalog.parts'"); changed = true; }
      if (content.includes("from '../parts'")) { content = content.replace(/from '\.\.\/parts'/g, "from '../catalog.parts'"); changed = true; }
      if (content.includes("from '../../parts'")) { content = content.replace(/from '\.\.\/\.\.\/parts'/g, "from '../../catalog.parts'"); changed = true; }
      if (changed) fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}
replaceInDir('dsh/frontend/control-panel/catalogs');
