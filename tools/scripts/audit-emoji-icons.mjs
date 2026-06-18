/**
 * audit-emoji-icons.mjs
 * Finds emoji characters used as icons in TSX files.
 * These should be migrated to central Icon/IconButton from ui-kit.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function glob(dir, acc = []) {
  let e;
  try { e = readdirSync(dir); } catch { return acc; }
  for (const n of e) {
    const f = join(dir, n);
    let s;
    try { s = statSync(f); } catch { continue; }
    if (s.isDirectory()) {
      if (['node_modules', '.git', 'dist', '.next'].includes(n)) continue;
      glob(f, acc);
    } else if (n.endsWith('.tsx')) {
      acc.push(f.replace(/\\/g, '/'));
    }
  }
  return acc;
}

// Common operational emojis used as icons (not decorative content)
const ICON_EMOJIS = /['"`]([🔴🟢🟡⚪🔵🟠🟣🟤⚫⚪✅❌⚠️🔔🔕📦📋📊📈📉💰💳💵🏪🛵🚗🚚🚑🏠📍📌📝✏️🔍🔎🗺️🗓️📅⏰⏳🕐🔒🔓🔑💡ℹ️⬆️⬇️⬅️➡️✓✗×▶️⏸️⏹️❤️🎉🎯🏆⭐🌟💫🎁🛒🧾🏷️👤👥👋🤝💬📣🚨⛔🚫🔶🔷🟥🟩🟦🟨🔺🔻💲📤📥🗑️✏️🖊️🖋️📌📍🔗🔄🔃🔀⏩⏪🔼🔽↩️↪️])+/gu;

// Files with emojis in JSX text (as icon replacements)
const EMOJI_IN_JSX = />\s*[🔴🟢🟡⚪🔵🟠🟣🟤⚫⚪✅❌⚠️🔔🔕📦📋📊📈📉💰💳💵🏪🛵🚗🚚🚑🏠📍📌📝✏️🔍🔎🗺️🗓️📅⏰⏳🕐🔒🔓🔑💡ℹ️⬆️⬇️⬅️➡️✓✗×🎉🎯🏆⭐🌟💫🎁🛒🧾🏷️👤👥👋🤝💬📣🚨⛔🚫🔶🔷🟥🟩🟦🟨🔺🔻💲📤📥🗑️✏️🖊️🖋️📌📍🔗🔄🔃🔀⏩⏪🔼🔽↩️↪️]/u;

const files = glob('dsh/frontend').concat(glob('wlt/frontend'))
  .filter(f => !f.includes('/control-panel/') && !f.includes('/ui-kit/'));

const findings = [];

for (const f of files) {
  let src;
  try { src = readFileSync(f, 'utf8'); } catch { continue; }
  const short = f.split('/').slice(-4).join('/');

  // Count emoji occurrences in JSX content
  const lines = src.split('\n');
  let emojiLineCount = 0;
  const samples = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (EMOJI_IN_JSX.test(line) && !line.includes('//')) {
      emojiLineCount++;
      if (samples.length < 3) {
        const emojis = line.match(/[\u{1F300}-\u{1FFFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || [];
        samples.push({ line: i + 1, emojis: [...new Set(emojis)].join('') });
      }
    }
  }

  if (emojiLineCount > 0) {
    findings.push({ file: short, count: emojiLineCount, samples });
  }
}

findings.sort((a, b) => b.count - a.count);

console.log(`=== EMOJI AS ICONS AUDIT ===\n`);
console.log(`Files with emojis in JSX: ${findings.length}`);
console.log(`Total emoji-lines: ${findings.reduce((s, r) => s + r.count, 0)}\n`);

findings.slice(0, 20).forEach(r => {
  console.log(`[${r.count}] ${r.file}`);
  r.samples.forEach(s => console.log(`  line ${s.line}: ${s.emojis}`));
});
