import fs from 'node:fs';
import path from 'node:path';
import { ROOT, gitLsFiles, runGuard, readTextSafe } from './_guard-common.mjs';

const canonicalServices = ['dsh', 'wlt', 'knz', 'arb', 'amn', 'esf', 'mrf', 'snd', 'kwd'];

function normalizePathTarget(target) {
  return String(target)
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/\*+$/, '')
    .replace(/\/+$/, '');
}

function pushFinding(findings, type, severity, file, reason) {
  findings.push({ type, severity, file, reason });
}

runGuard({
  guardId: 'GUARD-17_SERVICE_BLUEPRINT_COMPLETENESS',
  guardName: 'Service Blueprint Completeness',
  prefix: 'GUARD_17_SERVICE_BLUEPRINT_COMPLETENESS',
  configPath: 'tools/guards/guard-service-blueprint-completeness.config.json',
  collect: ({ config }) => {
    const files = gitLsFiles();
    const serviceDirs = new Set();
    for (const file of files) {
      for (const service of canonicalServices) {
        if (file === service || file.startsWith(`${service}/`)) {
          serviceDirs.add(service);
        }
      }
    }

    const required = config.requiredFields ?? [];
    const findings = [];

    const masterOpenApi = 'master.openapi.yaml';
    if (!files.includes(masterOpenApi)) {
      pushFinding(findings, 'MISSING_MASTER_OPENAPI', 'error', masterOpenApi, 'Root master.openapi.yaml index is missing.');
    } else {
      const masterText = readTextSafe(path.join(ROOT, masterOpenApi));
      for (const service of canonicalServices) {
        const expected = `./${service}/${service}.openapi.yaml`;
        if (!masterText.includes(expected)) {
          pushFinding(findings, 'MASTER_OPENAPI_MISSING_SERVICE_REF', 'error', masterOpenApi, `Missing service mapping for ${service}: ${expected}`);
        }
        const serviceOpenApi = `${service}/${service}.openapi.yaml`;
        if (!files.includes(serviceOpenApi)) {
          pushFinding(findings, 'MISSING_SERVICE_OPENAPI', 'error', serviceOpenApi, `Service OpenAPI file is missing for ${service}.`);
        }
      }
    }

    const tsconfigPath = 'tsconfig.base.json';
    if (files.includes(tsconfigPath)) {
      try {
        const tsconfig = JSON.parse(readTextSafe(path.join(ROOT, tsconfigPath)));
        const paths = tsconfig?.compilerOptions?.paths ?? {};
        for (const [alias, targets] of Object.entries(paths)) {
          for (const target of [].concat(targets ?? [])) {
            const relTarget = normalizePathTarget(target);
            if (!relTarget) continue;
            const targetPath = path.join(ROOT, relTarget);
            if (!fs.existsSync(targetPath)) {
              pushFinding(findings, 'STALE_TSCONFIG_PATH', 'error', tsconfigPath, `Alias ${alias} points to missing target ${target}.`);
            }
          }
        }
      } catch (err) {
        pushFinding(findings, 'INVALID_TSCONFIG_JSON', 'error', tsconfigPath, `Unable to parse tsconfig.base.json: ${err.message}`);
      }
    }

    const nxPath = 'nx.json';
    if (files.includes(nxPath)) {
      try {
        const nx = JSON.parse(readTextSafe(path.join(ROOT, nxPath)));
        if (nx?.workspaceLayout) {
          pushFinding(findings, 'STALE_NX_WORKSPACE_LAYOUT', 'error', nxPath, 'workspaceLayout is still declared; remove apps/packages-only layout assumptions.');
        }
      } catch (err) {
        pushFinding(findings, 'INVALID_NX_JSON', 'error', nxPath, `Unable to parse nx.json: ${err.message}`);
      }
    }

    const workspaceFile = 'pnpm-workspace.yaml';
    if (files.includes(workspaceFile)) {
      const workspaceText = readTextSafe(path.join(ROOT, workspaceFile));
      if (/\bservices\/\*/.test(workspaceText)) {
        pushFinding(findings, 'STALE_PNPM_WORKSPACE_GLOB', 'error', workspaceFile, 'Legacy services/* glob is still present.');
      }
    }

    const distArtifacts = files.filter((file) => /(^|\/)dist-android-check(\/|$)/.test(file));
    for (const file of distArtifacts) {
      if (!fs.existsSync(path.join(ROOT, file))) {
        continue;
      }
      pushFinding(findings, 'TRACKED_DIST_ANDROID_CHECK_ARTIFACT', 'error', file, 'Tracked dist-android-check artifact must not remain in source control.');
    }

    const compositionFiles = files.filter((file) => file.startsWith('app-client/composition/'));
    for (const file of compositionFiles) {
      const text = readTextSafe(path.join(ROOT, file));
      if (/\{\}\s+as\s+const/.test(text) || /return\s+\{\s*\};/.test(text) || /return\s+\{\s*\}/.test(text)) {
        pushFinding(findings, 'EMPTY_COMPOSITION_PLACEHOLDER', 'error', file, 'Composition file still contains an empty placeholder export or return value.');
      }
    }

    for (const dir of [...serviceDirs].sort()) {
      const blueprint = `${dir}/SERVICE_BLUEPRINT.md`;
      if (!files.includes(blueprint)) {
        pushFinding(findings, 'MISSING_SERVICE_BLUEPRINT', 'error', dir, 'Canonical root service lacks SERVICE_BLUEPRINT.md.');
        continue;
      }
      const fullPath = path.join(ROOT, blueprint);
      const txt = readTextSafe(fullPath);
      if (!txt) {
        pushFinding(findings, 'EMPTY_SERVICE_BLUEPRINT', 'error', blueprint, 'SERVICE_BLUEPRINT.md is empty or unreadable.');
        continue;
      }
      for (const field of required) {
        const re = new RegExp(`^\\s*${field}\\s*:\\s*.+$`, 'im');
        if (!re.test(txt)) {
          pushFinding(findings, 'MISSING_BLUEPRINT_FIELD', 'error', blueprint, `Missing required field: ${field}`);
        }
      }
    }

    if (!files.includes('app-client/composition/index.ts')) {
      pushFinding(findings, 'MISSING_APP_CLIENT_COMPOSITION', 'error', 'app-client/composition/index.ts', 'Canonical app-client composition registry is missing.');
    }

    return {
      findings,
      headers: ['type', 'severity', 'file', 'reason'],
      issueFileName: 'service-blueprint-completeness.csv',
      baseCounts: { ServiceDirsScanned: serviceDirs.size, AppClientCompositionFiles: compositionFiles.length },
      blockedDecision: 'BLOCKED_SERVICE_BLUEPRINT_MISSING_FIELDS',
      warningDecision: 'SERVICE_BLUEPRINT_INCOMPLETE_WARNINGS',
      passDecision: 'PASS_SERVICE_BLUEPRINT_COMPLETE',
    };
  },
});
