import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function glob(dir, acc = []) {
  let e; try { e = readdirSync(dir); } catch { return acc; }
  for (const n of e) {
    const f = join(dir, n);
    let s; try { s = statSync(f); } catch { continue; }
    if (s.isDirectory()) {
      if (['node_modules', '.git', 'dist', '.next', '__generated__'].includes(n)) continue;
      glob(f, acc);
    } else if (n.endsWith('.tsx') || n.endsWith('.ts')) {
      acc.push(f.replace(/\\/g, '/'));
    }
  }
  return acc;
}

const files = glob('dsh/frontend').concat(glob('wlt/frontend'));
const skipPatterns = ['ui-kit/', '.test.', '.spec.', '.stories.', '__generated__', 'fixture', 'mock'];

const reusableNames = ['Button', 'StickyActionBar', 'Card', 'Header', 'ScreenHeader', 'TopBar', 'Tabs',
  'SegmentedControl', 'Badge', 'Chip', 'Pill', 'StateView', 'TextField', 'SelectField', 'DataTable', 'IconButton', 'DirectionalIcon',
  'EmptyState', 'ErrorState', 'LoadingState', 'Banner'];

const localObjNames = ['colors', 'theme', 'tokens', 'palette', 'brandColors', 'semanticColors',
  'spacing', 'radius', 'radii', 'typography', 'fontScale', 'elevation', 'styled', 'variants'];

let counts = {
  typography_control_panel: 0,
  typography_mobile: 0,
  reusableDecl: 0,
  localObj: 0,
  iconDrift: 0,
  styleFactory: 0,
  styleSheetRecipe: 0,
};

const typoRe = /\b(fontSize|fontWeight|lineHeight|letterSpacing)\s*[:=]\s*(\d+|['"`]\w+['"`])/g;
const iconRe = /from\s+['"](@expo\/vector-icons|lucide-react(?:-native)?|react-native-vector-icons|@tamagui\/lucide-icons)['"]/g;
const sfRe = /(?:^|\n)\s*(?:export\s+)?(?:const|function)\s+(?:createStyles|makeStyles|getStyles)\b/gm;
const ssRe = /StyleSheet\.create\(\s*\{[\s\S]*?\b(button|card|header|tab|badge|chip)\s*:/gi;

for (const f of files) {
  if (skipPatterns.some(p => f.includes(p))) continue;
  let src; try { src = readFileSync(f, 'utf8'); } catch { continue; }

  const isCP = f.includes('/control-panel/');

  typoRe.lastIndex = 0;
  let m;
  while ((m = typoRe.exec(src)) !== null) {
    if (isCP) counts.typography_control_panel++;
    else counts.typography_mobile++;
  }

  for (const name of reusableNames) {
    const re = new RegExp(`(?:^|\\n)\\s*(?:export\\s+)?(?:function|const)\\s+${name}\\s*[=(\\(]`, 'gm');
    re.lastIndex = 0;
    while ((m = re.exec(src)) !== null) counts.reusableDecl++;
  }

  for (const name of localObjNames) {
    const re = new RegExp(`(?:^|\\n)\\s*(?:export\\s+)?(?:const|let|var)\\s+${name}\\s*=\\s*\\{`, 'gim');
    re.lastIndex = 0;
    while ((m = re.exec(src)) !== null) counts.localObj++;
  }

  iconRe.lastIndex = 0;
  while ((m = iconRe.exec(src)) !== null) counts.iconDrift++;

  sfRe.lastIndex = 0;
  while ((m = sfRe.exec(src)) !== null) counts.styleFactory++;

  ssRe.lastIndex = 0;
  while ((m = ssRe.exec(src)) !== null) counts.styleSheetRecipe++;
}

console.log('\n=== Guard Warning Category Estimates ===');
for (const [k, v] of Object.entries(counts)) {
  console.log(`  ${k.padEnd(30)} ${v}`);
}
const total = Object.values(counts).reduce((a, b) => a + b, 0);
console.log(`  ${'TOTAL estimated'.padEnd(30)} ${total}`);
