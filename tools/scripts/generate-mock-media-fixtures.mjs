import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..', '..');
const mediaFixturesDir = join(root, 'dsh', 'frontend', 'media-fixtures');
const manifestPath = join(mediaFixturesDir, 'MANIFEST.local-required.tsv');

// 1x1 transparent PNG base64
const dummyPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const dummyPngBuffer = Buffer.from(dummyPngBase64, 'base64');

if (!existsSync(manifestPath)) {
  console.error(`Manifest not found at: ${manifestPath}`);
  process.exit(1);
}

const lines = readFileSync(manifestPath, 'utf8').split(/\r?\n/);
let createdCount = 0;
let existingCount = 0;

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  const parts = line.split('\t');
  if (parts.length < 2) continue;

  const relPath = parts[1].trim();
  const fullPath = join(mediaFixturesDir, relPath);

  if (existsSync(fullPath)) {
    existingCount++;
    continue;
  }

  const parentDir = dirname(fullPath);
  if (!existsSync(parentDir)) {
    mkdirSync(parentDir, { recursive: true });
  }

  writeFileSync(fullPath, dummyPngBuffer);
  createdCount++;
}

console.log(`Mock Media Fixtures Check:`);
console.log(`- Existing files: ${existingCount}`);
console.log(`- Created mock files: ${createdCount}`);
process.exit(0);
