#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv = process.argv.slice(2)) {
  const args = { root: process.cwd(), mode: 'CHECK', jsonOut: '', mdOut: '' };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--root') args.root = argv[++i];
    else if (token === '--mode') args.mode = argv[++i];
    else if (token === '--json-out') args.jsonOut = argv[++i];
    else if (token === '--md-out') args.mdOut = argv[++i];
    else if (token.startsWith('--root=')) args.root = token.slice('--root='.length);
    else if (token.startsWith('--mode=')) args.mode = token.slice('--mode='.length);
    else if (token.startsWith('--json-out=')) args.jsonOut = token.slice('--json-out='.length);
    else if (token.startsWith('--md-out=')) args.mdOut = token.slice('--md-out='.length);
  }
  return args;
}

const args = parseArgs();
const root = args.root;
const checks = [
  {
    id: 'openapi_upload_intent',
    file: 'dsh/dsh.openapi.yaml',
    patterns: ['/media/upload-intents', 'dsh_media_assets', 'MEDIA_STORAGE_UNAVAILABLE'],
  },
  {
    id: 'backend_media_runtime_handler',
    file: 'dsh/backend/internal/http/media_runtime_handler.go',
    patterns: ['POST /media/upload-intents', 'MEDIA_STORAGE_UNAVAILABLE', 'CreateUploadIntent'],
  },
  {
    id: 'postgres_media_assets_repository',
    file: 'dsh/backend/internal/store/postgres_media_assets_repository.go',
    patterns: ['dsh_media_assets', 'INSERT INTO', 'UPDATE dsh_media_assets'],
  },
  {
    id: 'media_assets_migration',
    file: 'dsh/backend/migrations/030_dsh_media_assets.sql',
    patterns: ['CREATE TABLE IF NOT EXISTS dsh_media_assets', 'bucket', 'storage_key'],
  },
  {
    id: 'docker_minio_bucket',
    file: 'dsh/backend/docker-compose.local.yml',
    patterns: ['minio', 'minio-init', 'bthwani-media-local', 'DSH_MEDIA_S3_ENDPOINT'],
  },
  {
    id: 'frontend_media_api_client',
    file: 'dsh/frontend/shared/dsh-media-api.client.ts',
    patterns: ['/media/upload-intents', '/complete', 'media_id'],
  },
];

const findings = [];

for (const check of checks) {
  const abs = path.join(root, check.file);
  if (!fs.existsSync(abs)) {
    findings.push({
      severity: 'FAIL',
      rule: 'required_media_runtime_file_missing',
      file: check.file,
      evidence: check.id,
      remediation: 'Restore or create the required runtime media component before real data/media closure.',
    });
    continue;
  }
  const text = fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '');
  for (const pattern of check.patterns) {
    if (!text.includes(pattern)) {
      findings.push({
        severity: 'FAIL',
        rule: 'required_media_runtime_pattern_missing',
        file: check.file,
        evidence: `${check.id}: ${pattern}`,
        remediation: 'Wire PostgreSQL metadata, MinIO/S3 storage, and Media Runtime API consistently before closure.',
      });
    }
  }
}

const output = {
  guardId: 'GUARD_REAL_MEDIA_RUNTIME',
  status: findings.length > 0 ? 'FAIL' : 'PASS',
  checks: checks.map((check) => check.id),
  findings,
  failCount: findings.filter((f) => f.severity === 'FAIL').length,
  warnCount: findings.filter((f) => f.severity === 'WARN').length,
  infoCount: findings.filter((f) => f.severity === 'INFO').length,
};

console.log(JSON.stringify(output, null, 2));

if (args.jsonOut) {
  fs.writeFileSync(args.jsonOut, JSON.stringify(output, null, 2), 'utf8');
}
if (args.mdOut) {
  const md = [
    '# GUARD_REAL_MEDIA_RUNTIME',
    '',
    `status: ${output.status}`,
    `findings: ${output.findings.length}`,
    '',
    '| Severity | Rule | File | Evidence |',
    '|---|---|---|---|',
    ...findings.map((f) => `| ${f.severity} | ${f.rule} | ${f.file} | ${f.evidence} |`),
  ].join('\n');
  fs.writeFileSync(args.mdOut, md, 'utf8');
}

if (findings.length > 0) process.exitCode = 1;
