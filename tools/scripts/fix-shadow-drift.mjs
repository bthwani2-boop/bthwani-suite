/**
 * fix-shadow-drift.mjs
 * Migrates raw shadowOffset/shadowOpacity/shadowRadius props to shadowPresets.
 * Targets 3 files, 12 guard violations.
 */
import { readFileSync, writeFileSync } from 'node:fs';

let totalFixed = 0;

function patch(filePath, patches) {
  let src = readFileSync(filePath, 'utf8');
  const original = src;
  for (const { from, to, desc } of patches) {
    if (!src.includes(from)) {
      console.error(`  MISS: "${desc}" — pattern not found in ${filePath}`);
      continue;
    }
    src = src.replace(from, to);
    console.log(`  FIX: ${desc}`);
    totalFixed++;
  }
  if (src !== original) {
    writeFileSync(filePath, src, 'utf8');
    console.log(`  WRITTEN: ${filePath}\n`);
  }
}

// ─────────────────────────────────────────────────────────────
// 1. BannerPreview.tsx
// ─────────────────────────────────────────────────────────────
console.log('── BannerPreview.tsx ──');

patch('dsh/frontend/control-panel/marketing/BannerPreview.tsx', [
  // Add shadowPresets to ui-kit import
  {
    desc: 'import shadowPresets',
    from: `import { Box, Text, useTheme } from '@bthwani/ui-kit';`,
    to:   `import { Box, Text, shadowPresets, useTheme } from '@bthwani/ui-kit';`,
  },
  // bannerContainer: replace raw shadow block with preset
  {
    desc: 'bannerContainer → shadowPresets.overlay',
    from: `      elevation: 8,
      shadowColor: theme.overlay,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 14,`,
    to:   `      ...shadowPresets.overlay,
      shadowColor: theme.overlay,`,
  },
  // bannerPartner: shadowRadius → textShadowRadius (text shadow, not box shadow)
  {
    desc: 'bannerPartner shadowRadius → textShadowRadius',
    from: `      textShadowOffset: { width: 0, height: 1 },
      shadowRadius: 2,`,
    to:   `      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,`,
  },
  // bannerTitle: shadowRadius → textShadowRadius
  {
    desc: 'bannerTitle shadowRadius → textShadowRadius',
    from: `      textShadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,`,
    to:   `      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,`,
  },
  // partnerLogoWrap: replace raw shadow props with preset
  {
    desc: 'partnerLogoWrap → shadowPresets.raised',
    from: `      elevation: 6,
      shadowColor: theme.overlay,
      shadowOpacity: 0.15,
      shadowRadius: 8,`,
    to:   `      ...shadowPresets.raised,
      shadowColor: theme.overlay,`,
  },
]);

// ─────────────────────────────────────────────────────────────
// 2. BannersCommandDeckScreen.tsx
// ─────────────────────────────────────────────────────────────
console.log('── BannersCommandDeckScreen.tsx ──');

patch('dsh/frontend/control-panel/marketing/BannersCommandDeckScreen.tsx', [
  // Add shadowPresets to ui-kit import
  {
    desc: 'import shadowPresets',
    from: `  Box,
  Button,
  SelectField,
  Surface,
  Tabs,
  Text,
  TextField,
  useDirection,
  useTheme,
} from '@bthwani/ui-kit';`,
    to:   `  Box,
  Button,
  SelectField,
  shadowPresets,
  Surface,
  Tabs,
  Text,
  TextField,
  useDirection,
  useTheme,
} from '@bthwani/ui-kit';`,
  },
  // listCardSelected: replace raw shadow props with preset + keep brand color
  {
    desc: 'listCardSelected → shadowPresets.raised + brand color',
    from: `      elevation: 4,
      shadowColor: theme.brand,
      shadowOpacity: 0.1,
      shadowRadius: 10,`,
    to:   `      elevation: 4,
      ...shadowPresets.raised,
      shadowColor: theme.brand,`,
  },
]);

// ─────────────────────────────────────────────────────────────
// 3. wlt-dsh-client.parts.tsx
// ─────────────────────────────────────────────────────────────
console.log('── wlt-dsh-client.parts.tsx ──');

patch('wlt/frontend/dsh/app-client/wlt-dsh-client.parts.tsx', [
  // Add shadowPresets to ui-kit import
  {
    desc: 'import shadowPresets',
    from: `	Button,
	Chip,
	colorPalette,
	ListItem,
	Text,
	radius,
	spacing,
	useTheme,
} from '@bthwani/ui-kit';`,
    to:   `	Button,
	Chip,
	colorPalette,
	ListItem,
	shadowPresets,
	Text,
	radius,
	spacing,
	useTheme,
} from '@bthwani/ui-kit';`,
  },
  // Replace raw shadow block in selected card style
  {
    desc: 'selected card shadow → shadowPresets.raised',
    from: `						shadowColor: colorPalette.black,
						shadowOpacity: 0.06,
						shadowRadius: 8,
						shadowOffset: { width: 0, height: 4 },
						elevation: 4,`,
    to:   `						...shadowPresets.raised,
						elevation: 4,`,
  },
]);

console.log(`\n✓ Total fixes applied: ${totalFixed}`);
