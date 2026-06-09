#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createResult, isTextFile, lineOf, parseArgs, readText, walk, writeOutputs } from './common-v3.mjs';

const args = parseArgs();
args.root = args.root || process.cwd();
const root = path.resolve(args.root);
const strict = Boolean(args.strict);
const serviceFilter = args.service ? String(args.service) : '';
const result = createResult('GUARD_PLATFORM_VARS_CONTROL', args);
const configPath = path.join(root, 'tools/guards/guard-platform-vars-control.config.json');

function loadConfig() {
  if (!fs.existsSync(configPath)) {
    result.add('FAIL', 'config_missing', configPath, 'Platform vars config is missing.', null, 'Create tools/guards/guard-platform-vars-control.config.json.');
    return { services: {} };
  }
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8').replace(/^\uFEFF/, ''));
  } catch (error) {
    result.add('FAIL', 'config_invalid_json', configPath, `Platform vars config is invalid JSON: ${error.message}`, null, 'Fix the JSON config.');
    return { services: {} };
  }
}

function normalize(value) {
  return String(value ?? '').replace(/\\/g, '/');
}

function inScope(relativePath, service) {
  return (service.scopePaths ?? []).some((scope) => relativePath === scope || relativePath.startsWith(`${scope}/`));
}

function allowedFinancialOwner(relativePath, service) {
  return (service.allowedFinancialOwnerPrefixes ?? []).some((prefix) => relativePath === prefix.replace(/\/$/, '') || relativePath.startsWith(prefix));
}

function isBoundaryStatement(context) {
  return /PREVIEW_ONLY|read[- ]only|readOnly|reference only|visibility only|no\s+[^.\n]*(ledger|wallet|refund|settlement|reconciliation|mutation|write|update)|mutationForbidden|forbidden actions|forbiddenActions|WLT-only|لا يوجد|لا تنشئ|بدون|مرجعية|محاكاة/i.test(context);
}

const ALLOWED_VAR_UI_NAMES = new Set([
  'VAR_UI_APPEARANCE_MODE',
  'VAR_UI_FONT_PROFILE',
  'VAR_UI_DENSITY_PROFILE',
  'VAR_UI_RADIUS_PROFILE',
  'VAR_UI_ELEVATION_PROFILE',
  'VAR_UI_MOTION_PROFILE',
  'VAR_UI_MARKETING_EMPHASIS',
  'VAR_UI_CONTROL_PANEL_DENSITY',
  'VAR_UI_MEDIA_LOADING_POLICY',
  'VAR_UI_DATA_DENSITY_POLICY'
]);

const config = loadConfig();
const serviceEntries = Object.entries(config.services ?? {})
  .filter(([id]) => !serviceFilter || id === serviceFilter);

if (serviceFilter && serviceEntries.length === 0) {
  result.add('FAIL', 'service_not_registered', configPath, `Service "${serviceFilter}" is not registered for platform vars control.`, null, 'Add the service to guard-platform-vars-control.config.json.');
}

const files = walk(root).filter((file) => isTextFile(file) && /\.(tsx|ts|js|mjs|md|json)$/.test(file));

for (const [serviceId, service] of serviceEntries) {
  const financialFinal = new RegExp(service.financialFinalPattern, 'ig');
  const mutableTerms = new RegExp(service.mutableTermsPattern, 'g');
  const varsContext = new RegExp(service.varsContextPattern, 'i');
  const routePath = new RegExp(service.routeSprawlPathPattern, 'i');
  const routeSignal = new RegExp(service.routeSprawlSignalPattern, 'i');
  const routeAction = new RegExp(service.routeSprawlActionPattern);
  const routeAllowed = new RegExp(service.routeSprawlAllowedContextPattern, 'i');

  for (const file of files) {
    const relativePath = normalize(path.relative(root, file));
    if (!inScope(relativePath, service)) continue;

    const text = readText(file);
    if (!text) continue;

    let match;
    financialFinal.lastIndex = 0;
    while ((match = financialFinal.exec(text))) {
      const context = text.slice(Math.max(0, match.index - 180), match.index + 180);
      if (isBoundaryStatement(context)) continue;
      if (!allowedFinancialOwner(relativePath, service)) {
        result.add('FAIL', 'financial_owner_boundary', file, `Financial final-truth or mutation term appears outside configured owner for service "${serviceId}".`, lineOf(text, match.index), 'Money mutation and settlement truth must stay with the configured financial owner.');
      }
    }

    mutableTerms.lastIndex = 0;
    while ((match = mutableTerms.exec(text))) {
      const context = text.slice(Math.max(0, match.index - 300), match.index + 300);
      if (!varsContext.test(context)) {
        result.add('WARN', 'mutable_policy_not_var_classified', file, `Mutable service/provider policy signal is not clearly classified as VAR/provider policy for service "${serviceId}".`, lineOf(text, match.index), 'Expose mutable behavior through a configured VAR/provider policy with owner and rollback.');
      }
    }

    if (routePath.test(relativePath) && routeSignal.test(text) && routeAction.test(text) && !routeAllowed.test(text)) {
      result.add('INFO', 'control_panel_route_sprawl_signal', file, `Potential control-panel route/page sprawl signal for service "${serviceId}".`, null, 'Verify control-room ownership and progressive disclosure before adding new routes.');
    }

    // Enforce allowed VAR_UI_* variable names
    const varUiRegex = /\bVAR_UI_[A-Z_0-9]+\b/g;
    let varMatch;
    while ((varMatch = varUiRegex.exec(text))) {
      const varName = varMatch[0];
      if (!ALLOWED_VAR_UI_NAMES.has(varName)) {
        result.add(
          'FAIL',
          'forbidden_var_ui_name',
          file,
          `Forbidden VAR_UI_* variable name detected: "${varName}". Only approved presets are allowed.`,
          lineOf(text, varMatch.index),
          'Align design variable names to the central allowlist in governance/08_UI_KIT_AND_BRAND.md.'
        );
      }
    }

    // Zero scattered process.env reads enforcement (DSH-SLICE-008A)
    if (/\.(tsx|ts)$/.test(relativePath) && relativePath.startsWith('dsh/frontend/') && relativePath !== 'dsh/frontend/shared/platform/PlatformVarsProvider.tsx' && relativePath !== 'dsh/frontend/shared/platform/FeatureFlagProvider.tsx' && relativePath !== 'dsh/frontend/shared/dev-fixtures-isolation-guard.ts') {
      const processEnvRegex = /process\.env|env\?\.(EXPO_PUBLIC_|NEXT_PUBLIC_)/g;
      let envMatch;
      while ((envMatch = processEnvRegex.exec(text))) {
        result.add(
          'FAIL',
          'direct_env_read_violation',
          file,
          `Direct environment variable read found in UI/frontend code. All environment access must go through PlatformVarsProvider/PlatformVarsRegistry.`,
          lineOf(text, envMatch.index),
          'Refactor to use PlatformVarsRegistry or usePlatformVars Hook.'
        );
      }
    }
  }

  for (const expectedPath of service.expectedVarsPaths ?? []) {
    if (!fs.existsSync(path.join(root, expectedPath))) {
      result.add('WARN', 'platform_vars_path_missing', path.join(root, expectedPath), `Expected vars path is missing for service "${serviceId}".`, null, 'Create or document the configured Platform/Vars owner path.');
    }
  }
}

if (strict) {
  for (const finding of result.findings) {
    if (finding.severity === 'WARN') finding.severity = 'FAIL';
  }
}

writeOutputs(result, args);
