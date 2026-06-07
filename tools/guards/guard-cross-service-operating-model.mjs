#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const GUARD_ID = 'GUARD_CROSS_SERVICE_OPERATING_MODEL';
const DEFAULT_SERVICES = ['dsh', 'wlt', 'knz', 'arb', 'amn', 'esf', 'mrf', 'snd', 'kwd'];
const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.md', '.mdx', '.yml', '.yaml']);
const SKIP_PARTS = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', '.next', '.expo', '.turbo', '.nx', 'android', 'ios']);
// Matches real closure claims; excludes advisory/governance negations.
const CLAIM_REGEX = /(?<![Nn]o[t]? [`'"]{0,1}|[Nn]o [`'"]{0,1})(\b(?:CLOSED|READY_FOR_PR|FINAL|100%|VERIFIED|LOCKED|COMPLETE|RUNTIME_VERIFIED|PRODUCTION_READY)\b)/g;
const EVIDENCE_REGEX = /\b(evidence|screenshot|visual|runtime|test|log|trace|metric|audit|rollback|proof|verified)\b/i;
const RUNTIME_EVIDENCE_REGEX = /\b(runtime|log|trace|span|metric|test|smoke|e2e|integration|OpenTelemetry|otel)\b/i;
const SURFACE_PATTERNS = [
  ['app-client', /(^|\/)(app-client|client)(\/|$)|app-client|client/i],
  ['app-partner', /(^|\/)(app-partner|partner)(\/|$)|app-partner|partner/i],
  ['app-captain', /(^|\/)(app-captain|captain)(\/|$)|app-captain|captain/i],
  ['app-field', /(^|\/)(app-field|field)(\/|$)|app-field|field/i],
  ['control-panel', /control-panel|admin|operations|finance|platform|vars/i],
  ['control-panel operations', /operations|dispatch|monitor|intervention|command|timeline/i],
  ['control-panel finance', /finance|settlement|payout|reconcile|ledger/i],
  ['WLT', /\bwlt\b|wallet|payment|refund|settlement|ledger|payout|commission|fee/i],
  ['notifications', /notification|inbox|push|email|sms|alert/i],
  ['support', /support|ticket|escalation|sla|complaint|issue/i],
  ['audit', /audit|rollback|revert|manual override|changedBy|timestamp/i],
  ['Vars', /\bvars\b|policy|threshold|provider|feature flag|rollout|experiment/i],
];

const args = parseArgs();
const root = path.resolve(args.root || process.cwd());
const strict = Boolean(args.strict);
const mode = String(args.mode || 'CHECK').toUpperCase();
const serviceFilter = args.service ? new Set(String(args.service).split(',').map((s) => s.trim()).filter(Boolean)) : null;
const researchPlanOnly = Boolean(args.researchPlan);

const profilePath = path.join(root, 'governance/benchmark-profiles/cross-service-operating-model.profile.json');
const profile = readJsonSafe(profilePath) || fallbackProfile();
const result = {
  guardId: GUARD_ID,
  mode,
  strict,
  root,
  profilePath: rel(profilePath),
  generatedAt: new Date().toISOString(),
  status: 'PASS',
  failCount: 0,
  warnCount: 0,
  infoCount: 0,
  services: [],
  issues: [],
  serviceProgressMap: [],
  journeyGraph: [],
  operationGraph: [],
  surfaceImpactMap: [],
  uxHeuristicDiagnosis: [],
  globalStandardCompliance: [],
  missingEffects: [],
  contradictions: [],
  safeAutoFixes: [],
  unsafeRequiredFixes: [],
  researchPlan: [],
};

main();

function main() {
  if (!fs.existsSync(path.join(root, 'package.json'))) {
    add('FAIL', '(repo)', 'repo_root', 'package.json not found at repository root.', root, 'Run from C:\\bthwani-suite or pass --root.');
    return finish();
  }

  verifyRegistration();
  verifyProfileQuality();

  const services = discoverServices();
  for (const service of services) {
    analyzeService(service);
  }

  if (researchPlanOnly || mode === 'RESEARCH_PLAN') {
    addResearchPlan('global', 'open_source_benchmark_refresh', [
      'Review current official WCAG guidance for accessibility acceptance criteria.',
      'Review OWASP authorization guidance for least privilege, deny-by-default, ABAC/ReBAC, and audit.',
      'Review Core Web Vitals thresholds for UX performance.',
      'Review OpenTelemetry observability guidance for request traces/logs/metrics.',
      'Review marketplace/delivery public UX patterns for order lifecycle, partner intake, dispatch, cancellation/refund, and support escalation.'
    ]);
  }

  if (mode === 'APPLY_SAFE_FIX') {
    writeSafeFixArtifacts();
  }

  finish();
}

function parseArgs(argv = process.argv.slice(2)) {
  const parsed = { root: process.cwd(), jsonOut: '', mdOut: '', mode: 'CHECK', strict: false, service: '', researchPlan: false };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--root') parsed.root = argv[++i];
    else if (token === '--json-out') parsed.jsonOut = argv[++i];
    else if (token === '--md-out') parsed.mdOut = argv[++i];
    else if (token === '--mode') parsed.mode = argv[++i];
    else if (token === '--service') parsed.service = argv[++i];
    else if (token === '--strict') parsed.strict = true;
    else if (token === '--research-plan') parsed.researchPlan = true;
    else if (token.startsWith('--root=')) parsed.root = token.slice('--root='.length);
    else if (token.startsWith('--json-out=')) parsed.jsonOut = token.slice('--json-out='.length);
    else if (token.startsWith('--md-out=')) parsed.mdOut = token.slice('--md-out='.length);
    else if (token.startsWith('--mode=')) parsed.mode = token.slice('--mode='.length);
    else if (token.startsWith('--service=')) parsed.service = token.slice('--service='.length);
    else throw new Error(`Unknown argument: ${token}`);
  }
  return parsed;
}

function discoverServices() {
  const configured = Array.isArray(profile.canonicalServices) ? profile.canonicalServices : DEFAULT_SERVICES;
  return configured
    .filter((id) => !serviceFilter || serviceFilter.has(id))
    .map((id) => {
      const rootPath = path.join(root, id);
      const exists = fs.existsSync(rootPath);
      return { id, rootPath, exists };
    });
}

function analyzeService(service) {
  const serviceResult = {
    id: service.id,
    exists: service.exists,
    declaredStatus: 'UNPROVEN',
    progressLevel: 'L0_UNKNOWN',
    files: [],
    blueprintPath: `${service.id}/docs/SERVICE_BLUEPRINT.md`,
    openapiPath: `${service.id}/${service.id}.openapi.yaml`,
    discoveredSurfaces: [],
    discoveredJourneys: [],
    discoveredOperations: [],
    discoveredClaims: [],
    discoveredEvidenceSignals: [],
    discoveredRiskSignals: [],
    discoveredProfiles: [],
  };
  result.services.push(serviceResult);

  if (!service.exists) {
    add('WARN', service.id, 'service_root_missing', 'Canonical service root is missing; cannot be CLOSED.', service.id, 'Create service root or keep status as TBD/UNPROVEN.');
    result.serviceProgressMap.push({ service: service.id, level: 'L0_MISSING_ROOT', status: 'UNPROVEN' });
    return;
  }

  const files = walk(service.rootPath).filter(isTextLike);
  const extraFiles = discoverCrossServiceFiles(service.id);
  const allFiles = uniqueFiles([...files, ...extraFiles]);

  serviceResult.files = allFiles.map(rel);
  const combined = allFiles.map((file) => readText(file)).join('\n\n---FILE---\n\n');
  const normalized = combined.toLowerCase();

  const blueprintExists = fs.existsSync(path.join(root, serviceResult.blueprintPath));
  const openapiExists = fs.existsSync(path.join(root, serviceResult.openapiPath));
  if (!blueprintExists) {
    add('WARN', service.id, 'blueprint_missing', `${service.id}/docs/SERVICE_BLUEPRINT.md is missing.`, serviceResult.blueprintPath, 'Add a living blueprint before service closure.');
  }
  if (!openapiExists) {
    add('WARN', service.id, 'openapi_missing', `${service.id}/${service.id}.openapi.yaml is missing.`, serviceResult.openapiPath, 'Add OpenAPI placeholder/contract before binding closure.');
  }

  serviceResult.declaredStatus = inferDeclaredStatus(combined);
  serviceResult.discoveredClaims = discoverClaims(combined, service.id);
  serviceResult.discoveredSurfaces = discoverSurfaces(allFiles, combined);
  serviceResult.discoveredJourneys = discoverJourneys(combined, service.id);
  serviceResult.discoveredOperations = discoverOperations(combined, service.id);
  serviceResult.discoveredEvidenceSignals = discoverEvidenceSignals(combined);
  serviceResult.discoveredRiskSignals = discoverRiskSignals(combined);
  serviceResult.progressLevel = inferProgressLevel(serviceResult, { blueprintExists, openapiExists, combined });

  result.serviceProgressMap.push({
    service: service.id,
    declaredStatus: serviceResult.declaredStatus,
    progressLevel: serviceResult.progressLevel,
    exists: service.exists,
    fileCount: allFiles.length,
    blueprintExists,
    openapiExists,
    surfaceCount: serviceResult.discoveredSurfaces.length,
    journeyCount: serviceResult.discoveredJourneys.length,
    operationCount: serviceResult.discoveredOperations.length,
    evidenceSignals: serviceResult.discoveredEvidenceSignals,
    riskSignals: serviceResult.discoveredRiskSignals,
  });

  for (const claim of serviceResult.discoveredClaims) {
    const hasEvidence = EVIDENCE_REGEX.test(combined) && serviceResult.discoveredEvidenceSignals.length > 0;
    if (!hasEvidence) {
      add('FAIL', service.id, 'unsafe_closure_claim', `Closure/readiness claim found without enough evidence signals: ${claim.claim}`, claim.evidence, 'Attach screen/flow/API/runtime/ops/evidence/rollback proof before claiming closure.');
    }
  }

  analyzeProfiles(serviceResult, combined, normalized);
  analyzeCrossSurfaceCompleteness(serviceResult, combined, normalized);
  analyzeUxHeuristics(serviceResult, combined, normalized);
  analyzeSecurityPrivacyTrust(serviceResult, combined, normalized);
  analyzeFinanceBoundary(serviceResult, combined, normalized);
  analyzeObservabilityEvidence(serviceResult, combined, normalized);
  analyzeContradictions(serviceResult, combined, normalized);
}

function discoverCrossServiceFiles(serviceId) {
  const candidates = [];
  const roots = [
    'control-panel/runtime',
    'app-client/runtime',
    'app-partner/runtime',
    'app-captain/runtime',
    'app-field/runtime',
    'webapp/runtime',
    'website/runtime',
    'packages',
    'tools/registry/runs',
  ];

  for (const start of roots) {
    const abs = path.join(root, start);
    if (!fs.existsSync(abs)) continue;
    const files = walk(abs).filter(isTextLike);
    for (const file of files) {
      const rp = rel(file).toLowerCase();
      if (rp.includes(serviceId.toLowerCase()) || readText(file).toLowerCase().includes(serviceId.toLowerCase())) {
        candidates.push(file);
      }
    }
  }

  return candidates;
}

function analyzeProfiles(serviceResult, combined, normalized) {
  const profiles = Array.isArray(profile.domainProfiles) ? profile.domainProfiles : [];
  for (const domainProfile of profiles) {
    const detectTerms = domainProfile.detectTerms || [];
    const hits = detectTerms.filter((term) => normalized.includes(String(term).toLowerCase()));
    const active = hits.length >= Math.min(3, Math.max(1, Math.ceil(detectTerms.length * 0.25)));
    if (!active) continue;

    serviceResult.discoveredProfiles.push(domainProfile.id);
    result.globalStandardCompliance.push({
      service: serviceResult.id,
      profile: domainProfile.id,
      status: 'PROFILE_DETECTED',
      hits,
    });

    for (const effect of domainProfile.requiredEffects || []) {
      const effectTerms = effect.terms || [];
      const surfacePresent = serviceResult.discoveredSurfaces.includes(effect.surface)
        || serviceResult.discoveredSurfaces.some((s) => String(s).toLowerCase().includes(String(effect.surface).toLowerCase()));
      const termHits = effectTerms.filter((term) => normalized.includes(String(term).toLowerCase()));
      const naReason = hasNaReasonFor(effect.surface, combined);

      const record = {
        service: serviceResult.id,
        profile: domainProfile.id,
        requiredEffect: effect.id,
        surface: effect.surface,
        why: effect.why,
        surfacePresent,
        termHits,
        naReason,
        status: 'UNKNOWN',
      };

      if (!surfacePresent && !naReason) {
        record.status = 'MISSING_SURFACE_EFFECT';
        result.missingEffects.push(record);
        add('FAIL', serviceResult.id, 'missing_surface_effect', `Missing required surface effect: ${effect.surface}/${effect.id}`, effect.why, `Add implementation evidence or N/A_WITH_REASON. Do not ignore the surface.`);
        result.unsafeRequiredFixes.push({
          service: serviceResult.id,
          type: 'cross_surface_logic',
          effect: effect.id,
          surface: effect.surface,
          reason: effect.why,
          action: 'Implement or document N/A_WITH_REASON with evidence. Runtime/API/permissions changes need a separate reviewed task.',
        });
      } else if (surfacePresent && termHits.length === 0 && !naReason) {
        record.status = 'SURFACE_PRESENT_BUT_EFFECT_UNPROVEN';
        result.missingEffects.push(record);
        add('WARN', serviceResult.id, 'effect_unproven', `Surface exists but required effect is not proven: ${effect.surface}/${effect.id}`, effect.why, 'Add registry/matrix/evidence row for this effect.');
        result.safeAutoFixes.push({
          service: serviceResult.id,
          kind: 'UNPROVEN_matrix_row',
          profile: domainProfile.id,
          surface: effect.surface,
          requiredEffect: effect.id,
          reason: effect.why,
          safe: true,
        });
      } else {
        record.status = naReason ? 'N_A_WITH_REASON' : 'EFFECT_HINTS_FOUND';
      }

      result.surfaceImpactMap.push(record);
    }
  }
}

function analyzeCrossSurfaceCompleteness(serviceResult, combined, normalized) {
  const hasOrderLike = /(order|checkout|cart|delivery|dispatch|pickup|delivered)/i.test(combined);
  const hasPartner = serviceResult.discoveredSurfaces.includes('app-partner') || /partner/i.test(combined);
  const hasCaptain = serviceResult.discoveredSurfaces.includes('app-captain') || /captain/i.test(combined);
  const hasOps = serviceResult.discoveredSurfaces.includes('control-panel operations') || /operations|dispatch|timeline|monitor/i.test(combined);

  if (hasOrderLike) {
    pushJourney(serviceResult.id, 'order_lifecycle_like', ['client', 'partner', 'captain', 'operations', 'WLT', 'support', 'notifications', 'audit']);
    if (!hasPartner && !hasNaReasonFor('app-partner', combined)) {
      add('FAIL', serviceResult.id, 'order_partner_effect_missing', 'Order-like lifecycle found without partner intake evidence or N/A_WITH_REASON.', 'order/checkout/delivery terms detected', 'Add partner intake effect or N/A_WITH_REASON.');
    }
    if (!hasCaptain && !hasNaReasonFor('app-captain', combined)) {
      add('WARN', serviceResult.id, 'order_captain_effect_unproven', 'Order/delivery lifecycle found without captain task evidence or N/A_WITH_REASON.', 'delivery/order terms detected', 'Add captain assignment/pickup/delivery proof if delivery is applicable.');
    }
    if (!hasOps) {
      add('FAIL', serviceResult.id, 'operations_visibility_missing', 'Order-like lifecycle found without operations visibility evidence.', 'order/dispatch/timeline expected', 'Add control-panel operations timeline/monitoring/intervention/audit proof.');
    }
  }
}

function analyzeUxHeuristics(serviceResult, combined, normalized) {
  const dataBound = /\b(fetch|axios|useQuery|queryClient|apiClient|serviceClient|request\(|mutate\(|useMutation|loader|subscribe)\b/i.test(combined);
  const heuristics = Array.isArray(profile.uxHeuristics) ? profile.uxHeuristics : [];
  for (const h of heuristics) {
    const hits = (h.terms || []).filter((term) => normalized.includes(String(term).toLowerCase()));
    const status = hits.length > 0 ? 'HINTS_FOUND' : 'MISSING_HINTS';
    result.uxHeuristicDiagnosis.push({
      service: serviceResult.id,
      heuristic: h.id,
      status,
      hits,
      dataBound,
    });

    if (status === 'MISSING_HINTS' && h.severity === 'FAIL_WHEN_DATA_BOUND' && dataBound) {
      add('FAIL', serviceResult.id, `ux_${h.id}`, `Data-bound service appears to miss UX heuristic signals: ${h.id}`, 'data/API hints found', 'Add visible loading/status/error/retry/recovery states and evidence.');
    } else if (status === 'MISSING_HINTS' && (serviceResult.progressLevel.includes('L3') || serviceResult.progressLevel.includes('L4') || serviceResult.progressLevel.includes('L5'))) {
      add('WARN', serviceResult.id, `ux_${h.id}`, `UX heuristic not proven: ${h.id}`, 'no heuristic terms found', 'Add screen state/evidence or mark N/A_WITH_REASON.');
    }
  }
}

function analyzeSecurityPrivacyTrust(serviceResult, combined, normalized) {
  const hasSensitive = /(address|customer history|customerHistory|previous orders|previousOrders|trustScore|trust score|riskScore|risk score|fraud|housing|home location|phone|identity)/i.test(combined);
  if (!hasSensitive) return;

  const hasPolicy = /(permission|authorize|authorization|abac|rebac|least privilege|deny|mask|redact|audit|purpose|need-to-know|role)/i.test(combined);
  if (!hasPolicy) {
    add('FAIL', serviceResult.id, 'sensitive_access_without_policy', 'Sensitive customer/risk/trust data appears without permission/audit/masking policy evidence.', 'sensitive terms detected', 'Use least privilege, deny-by-default, purpose-based access, data masking, and audit.');
    result.unsafeRequiredFixes.push({
      service: serviceResult.id,
      type: 'authorization_privacy',
      action: 'Define ABAC/ReBAC or equivalent policy, sensitive access audit, masking, and escalation-only full-history access. Do not expose full customer history by default.',
    });
  }

  if (/(trustScore|trust score|riskScore|risk score|trusted customer|auto release|auto_release|auto approve|auto_approve)/i.test(combined)
    && !/(vars|threshold|policy|manual review|fraud|payment status|address confidence|rollback|audit)/i.test(combined)) {
    add('FAIL', serviceResult.id, 'trust_auto_release_policy_incomplete', 'Trusted-customer auto-release/risk decision appears without full policy controls.', 'trust/auto-release terms detected', 'Require Vars thresholds, payment status, fraud flags, address confidence, rollback, and audit before auto-release.');
  }
}

function analyzeFinanceBoundary(serviceResult, combined, normalized) {
  const hasMoney = /(payment|wallet|refund|settlement|payout|ledger|commission|fee|capture|authorization|reconcile)/i.test(combined);
  if (!hasMoney) return;

  const isWlt = serviceResult.id === 'wlt';
  const hasWltBoundary = /\bwlt\b|wallet owner|WLT_ONLY|read-only|finance bridge|ledger owner|financial boundary/i.test(combined);
  if (!isWlt && !hasWltBoundary) {
    add('FAIL', serviceResult.id, 'wlt_financial_boundary_missing', 'Financial/payment/settlement terms found outside WLT without clear WLT boundary.', 'money terms detected', 'Move money semantics to WLT or mark read-only bridge with evidence.');
    result.unsafeRequiredFixes.push({
      service: serviceResult.id,
      type: 'financial_boundary',
      action: 'Define WLT ownership for payments, refunds, settlements, payouts, commission, ledger, reconciliation. Do not implement money semantics inside non-WLT service.',
    });
  }

  if (hasMoney && !/(audit|ledger|reconcile|transaction|evidence|runtime|test|log)/i.test(combined)) {
    add('FAIL', serviceResult.id, 'financial_evidence_missing', 'Financial flow appears without ledger/audit/reconciliation/runtime evidence.', 'money terms detected', 'Add WLT ledger/audit/reconciliation evidence before closure.');
  }
}

function analyzeObservabilityEvidence(serviceResult, combined, normalized) {
  const claimsRuntime = /(runtime|RUNTIME_VERIFIED|live|production|works|verified|closed|ready)/i.test(combined);
  if (claimsRuntime && !RUNTIME_EVIDENCE_REGEX.test(combined)) {
    add('FAIL', serviceResult.id, 'observability_evidence_missing', 'Runtime/readiness language found without trace/log/metric/test evidence.', 'runtime/readiness terms detected', 'Attach logs, tests, traces, metrics, or evidence pack.');
  }

  if (/(order|payment|dispatch|settlement|refund|support|escalation)/i.test(combined) && !/(trace|span|metric|log|correlation|requestId|eventId|audit)/i.test(combined)) {
    add('WARN', serviceResult.id, 'journey_observability_unproven', 'Critical journey lacks obvious observability/correlation evidence.', 'critical journey terms detected', 'Add request/event correlation and trace/log/metric proof.');
  }
}

function hasRealClosureClaim(text) {
  // Match CLOSED/FINAL/100%/PRODUCTION_READY but not in advisory/negation/descriptor contexts.
  // Excluded patterns:
  //   - Advisory: "NOT CLOSED", "No CLOSED claim", "Do not claim CLOSED"
  //   - Descriptor: "Final Decision:", "final decision", "final state", "final status"
  //   - Progress labels: "READY_FOR_BATCH", "FINAL_CLOSURE_ROADMAP" (compound words)
  const ADVISORY_BEFORE = /(?:not\s+claim\s+[`'"]?|\bno\s+[`'"]?|not_|not\s+)/i;
  const DESCRIPTOR_CONTEXT = /(?:final\s+decision|final\s+state|final\s+status|final\s+closure\s+roadmap)\s*[:_]?\s*$/i;
  const matches = [...text.matchAll(/\b(CLOSED|100%|FINAL|PRODUCTION_READY)\b/gi)];
  for (const m of matches) {
    const before = text.slice(Math.max(0, m.index - 50), m.index);
    const after = text.slice(m.index + m[0].length, m.index + m[0].length + 10);
    // Skip advisory contexts
    if (ADVISORY_BEFORE.test(before)) continue;
    // Skip descriptor contexts: "Final Decision:" or compound like "FINAL_CLOSURE_ROADMAP"
    if (DESCRIPTOR_CONTEXT.test(before)) continue;
    // Skip compound identifiers: FINAL followed by _ or preceded by _
    if (/_$/.test(before) || /^_/.test(after)) continue;
    // Skip READY_FOR_ progress labels
    if (m[0].toUpperCase() === 'FINAL' && /FINAL_/.test(text.slice(m.index, m.index + 20))) continue;
    return true;
  }
  return false;
}

function analyzeContradictions(serviceResult, combined, normalized) {
  const closed = hasRealClosureClaim(combined);
  const blocked = /\b(BLOCKED|UNPROVEN|TBD|NEEDS_EVIDENCE|NEEDS_VISUAL_EVIDENCE|RUNTIME_UNPROVEN|PENDING)\b/i.test(combined);
  if (closed && blocked) {
    const record = {
      service: serviceResult.id,
      type: 'closure_status_conflict',
      evidence: 'closure claim (CLOSED/FINAL/100%/PRODUCTION_READY) and blocked/unproven/pending terms both detected in non-advisory context',
    };
    result.contradictions.push(record);
    add('WARN', serviceResult.id, 'closure_status_conflict', 'Conflicting closure language found across service docs.', record.evidence, 'Review service-level status vocabulary; do not claim final closure while blockers remain in any service doc.');
  }

  if (/full history|full customer history|all previous orders|customer details/i.test(combined)
    && !/(mask|redact|permission|audit|escalation|fraud|manual review|purpose)/i.test(combined)) {
    const record = {
      service: serviceResult.id,
      type: 'sensitive_data_exposure_conflict',
      evidence: 'full customer history/detail terms without restriction controls',
    };
    result.contradictions.push(record);
    add('FAIL', serviceResult.id, 'sensitive_data_exposure_conflict', 'Potential unrestricted sensitive customer data exposure.', record.evidence, 'Restrict to risk summary by default; full history only by permission/escalation with audit.');
  }
}

function inferDeclaredStatus(text) {
  const matches = [...text.matchAll(/\b(Current Status|Current Decision|Status|Decision)\s*[:|]\s*`?([A-Z0-9_%_ -]+)`?/gi)];
  if (matches.length > 0) return matches[0][2].trim();
  // Exclude advisory/negated forms: "NOT CLOSED", "Do not claim CLOSED", etc.
  if (hasRealClosureClaim(text)) return 'CLOSURE_CLAIM_DETECTED';
  if (/(?<!NOT |NO |not\s+claim\s+)\bREADY\b/i.test(text)) return 'READY_CLAIM_DETECTED';
  if (/\b(TBD|UNPROVEN)\b/i.test(text)) return 'UNPROVEN';
  return 'UNPROVEN';
}

function inferProgressLevel(serviceResult, facts) {
  if (!facts.blueprintExists && serviceResult.files.length <= 3) return 'L0_INVENTORY';
  if (serviceResult.discoveredSurfaces.length > 0 && serviceResult.discoveredJourneys.length === 0) return 'L1_UX_SKELETON';
  if (serviceResult.discoveredJourneys.length > 0 && serviceResult.discoveredOperations.length === 0) return 'L2_FLOW';
  if (serviceResult.discoveredOperations.length > 0 && facts.openapiExists) return 'L3_BINDING_CANDIDATE';
  if (/runtime|test|log|trace|metric/i.test(facts.combined)) return 'L4_RUNTIME_CANDIDATE';
  if (/operations|audit|rollback|permission/i.test(facts.combined)) return 'L5_OPS_CANDIDATE';
  return 'L2_FLOW_OR_DOCS';
}

function discoverClaims(text, service) {
  const claims = [];
  let match;
  while ((match = CLAIM_REGEX.exec(text)) !== null) {
    claims.push({
      service,
      claim: match[1],
      evidence: snippet(text, match.index),
    });
  }
  return claims;
}

function discoverSurfaces(files, text) {
  const found = new Set();
  for (const file of files) {
    const rp = rel(file);
    for (const [surface, pattern] of SURFACE_PATTERNS) {
      if (pattern.test(rp)) found.add(surface);
    }
  }
  for (const [surface, pattern] of SURFACE_PATTERNS) {
    if (pattern.test(text)) found.add(surface);
  }
  return [...found].sort();
}

function discoverJourneys(text, service) {
  const terms = [
    'discovery', 'storefront', 'cart', 'checkout', 'order_created', 'order created', 'partner_intake',
    'partner_accept', 'partner_reject', 'prepare', 'ready', 'captain_assignment', 'pickup',
    'out_for_delivery', 'dropoff', 'proof_of_delivery', 'delivered', 'rating',
    'payment', 'refund', 'settlement', 'support', 'escalation', 'audit', 'onboarding',
    'catalog', 'barcode', 'wallet', 'loyalty', 'subscription', 'booking', 'case'
  ];
  const found = [];
  const lower = text.toLowerCase();
  for (const term of terms) {
    if (lower.includes(term.toLowerCase())) {
      found.push({ service, journey: normalizeId(term), evidence: term });
    }
  }
  result.journeyGraph.push(...found);
  return found.map((item) => item.journey);
}

function discoverOperations(text, service) {
  const regex = /\b(operation_id|operation|event|action|endpoint|mutation|query|command|flow|state)\b\s*[:=|]\s*`?([a-zA-Z0-9_.:-]+)`?/g;
  const found = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    const op = normalizeId(match[2]);
    if (!op || op.length < 3) continue;
    found.push({ service, operation: op, evidence: snippet(text, match.index) });
  }

  const fallbackTerms = [
    'accept', 'reject', 'cancel', 'refund', 'settle', 'payout', 'dispatch', 'assign',
    'pickup', 'deliver', 'escalate', 'audit', 'rollback', 'approve', 'review', 'capture'
  ];
  const lower = text.toLowerCase();
  for (const term of fallbackTerms) {
    if (lower.includes(term)) found.push({ service, operation: normalizeId(term), evidence: term });
  }

  const unique = dedupeBy(found, (item) => item.operation);
  result.operationGraph.push(...unique);
  return unique.map((item) => item.operation);
}

function discoverEvidenceSignals(text) {
  const signals = [];
  const terms = ['screenshot', 'visual', 'runtime', 'test', 'log', 'trace', 'metric', 'audit', 'rollback', 'evidence', 'proof'];
  for (const term of terms) {
    const count = countMatches(text, new RegExp(`\\b${escapeRegExp(term)}\\b`, 'ig'));
    if (count > 0) signals.push({ term, count });
  }
  return signals;
}

function discoverRiskSignals(text) {
  const signals = [];
  const terms = profile.riskSensitiveTerms || [];
  for (const term of terms) {
    const count = countMatches(text, new RegExp(escapeRegExp(term), 'ig'));
    if (count > 0) signals.push({ term, count });
  }
  return signals;
}

function verifyRegistration() {
  const packageJson = readJsonSafe(path.join(root, 'package.json'));
  if (!packageJson?.scripts?.['guard:operating-model']) {
    add('FAIL', 'package.json', 'guard_registration', 'Missing guard:operating-model package script.', 'expected script not found', 'Register package script for local/CI execution.');
  }

  const manifest = readJsonSafe(path.join(root, 'tools/guards/guard-manifest.json'));
  const entry = manifest?.guards?.find((item) => item.id === 'GUARD_CROSS_SERVICE_OPERATING_MODEL');
  if (!entry) {
    add('FAIL', 'tools/guards/guard-manifest.json', 'guard_registration', 'Missing GUARD_CROSS_SERVICE_OPERATING_MODEL manifest entry.', 'entry not found', 'Register guard in manifest.');
  }
}

function verifyProfileQuality() {
  if (!profile || !Array.isArray(profile.domainProfiles)) {
    add('FAIL', rel(profilePath), 'benchmark_profile_missing', 'Benchmark profile missing or invalid.', 'domainProfiles absent', 'Create governance/benchmark-profiles/cross-service-operating-model.profile.json.');
  }

  const sourceIds = new Set((profile.sourceReferences || []).map((source) => source.id));
  for (const required of ['WCAG_2_2', 'OWASP_AUTHORIZATION', 'CORE_WEB_VITALS', 'OPENTELEMETRY_OBSERVABILITY']) {
    if (!sourceIds.has(required)) {
      add('WARN', rel(profilePath), 'benchmark_profile_source_missing', `Benchmark source missing: ${required}`, 'sourceReferences incomplete', 'Refresh benchmark profile.');
    }
  }
}

function hasNaReasonFor(surface, text) {
  const escaped = escapeRegExp(surface).replace(/\\ /g, '[ _-]?');
  const regex = new RegExp(`N/A_WITH_REASON|NOT_APPLICABLE_WITH_REASON|${escaped}[^\\n]{0,120}(N/A|not applicable|ØºÙŠØ± Ù…Ø·Ù„ÙˆØ¨|Ù„Ø§ ÙŠÙ†Ø·Ø¨Ù‚)`, 'i');
  return regex.test(text);
}

function addResearchPlan(service, reason, questions) {
  result.researchPlan.push({
    service,
    reason,
    mode: 'advisory_only_no_code_change',
    questions,
    recommendedSources: profile.sourceReferences || [],
    outputTarget: 'governance/benchmark-profiles/cross-service-operating-model.profile.json',
  });
}

function writeSafeFixArtifacts() {
  const safeRoot = path.join(root, 'tools/registry/runs', `CROSS_SERVICE_OPERATING_MODEL_SAFE_FIX-${timestamp()}`);
  fs.mkdirSync(safeRoot, { recursive: true });

  writeJson(path.join(safeRoot, 'missing-effects.json'), result.missingEffects);
  writeJson(path.join(safeRoot, 'safe-auto-fixes.json'), result.safeAutoFixes);
  fs.writeFileSync(path.join(safeRoot, 'unsafe-required-fixes.md'), toUnsafeFixMarkdown(result.unsafeRequiredFixes), 'utf8');
  fs.writeFileSync(path.join(safeRoot, 'README.md'), [
    '# Cross-Service Operating Model Safe Fix Artifacts',
    '',
    'These are generated diagnosis/remediation records only.',
    'No API/backend/payment/permission/runtime behavior was changed.',
    'Use these records to prepare narrow implementation tasks with evidence gates.',
    '',
  ].join('\n'), 'utf8');

  add('INFO', rel(safeRoot), 'safe_fix_artifacts_written', 'Generated safe diagnosis artifacts.', rel(safeRoot), 'Review artifacts before creating implementation tasks.');
}

function add(severity, file, gate, message, evidence = '', remediation = '') {
  const normalizedSeverity = severity === 'WARN' && strict ? 'FAIL' : severity;
  result.issues.push({ severity: normalizedSeverity, file, gate, message, evidence, remediation });
  if (normalizedSeverity === 'FAIL') result.failCount += 1;
  else if (normalizedSeverity === 'WARN') result.warnCount += 1;
  else result.infoCount += 1;
}

function finish() {
  result.status = result.failCount > 0 ? 'FAIL' : result.warnCount > 0 ? 'WARN' : 'PASS';

  if (args.jsonOut) writeJson(path.resolve(args.jsonOut), result);
  if (args.mdOut) fs.writeFileSync(path.resolve(args.mdOut), toMarkdown(result), 'utf8');

  console.log(`${GUARD_ID}: ${result.status} (fail=${result.failCount}, warn=${result.warnCount}, info=${result.infoCount}, mode=${mode}, strict=${strict})`);
  if (result.failCount > 0) process.exitCode = 1;
}

function toMarkdown(output) {
  const lines = [];
  lines.push(`# ${output.guardId}`);
  lines.push('');
  lines.push(`status: ${output.status}`);
  lines.push(`mode: ${output.mode}`);
  lines.push(`strict: ${output.strict}`);
  lines.push(`generatedAt: ${output.generatedAt}`);
  lines.push(`failCount: ${output.failCount}`);
  lines.push(`warnCount: ${output.warnCount}`);
  lines.push(`infoCount: ${output.infoCount}`);
  lines.push('');
  lines.push('## Service Progress Map');
  lines.push('');
  lines.push('| Service | Level | Status | Surfaces | Journeys | Operations | Evidence Signals |');
  lines.push('|---|---|---:|---:|---:|---:|---|');
  for (const item of output.serviceProgressMap) {
    lines.push(`| ${md(item.service)} | ${md(item.progressLevel)} | ${md(item.declaredStatus)} | ${item.surfaceCount ?? 0} | ${item.journeyCount ?? 0} | ${item.operationCount ?? 0} | ${md((item.evidenceSignals || []).map((s) => `${s.term}:${s.count}`).join(', '))} |`);
  }

  lines.push('');
  lines.push('## Issues');
  lines.push('');
  if (output.issues.length === 0) {
    lines.push('No issues found.');
  } else {
    lines.push('| Severity | Gate | File/Service | Message | Evidence | Remediation |');
    lines.push('|---|---|---|---|---|---|');
    for (const issue of output.issues) {
      lines.push(`| ${md(issue.severity)} | ${md(issue.gate)} | ${md(issue.file)} | ${md(issue.message)} | ${md(issue.evidence)} | ${md(issue.remediation)} |`);
    }
  }

  lines.push('');
  lines.push('## Missing Effects');
  lines.push('');
  if (output.missingEffects.length === 0) {
    lines.push('No missing effects recorded.');
  } else {
    lines.push('| Service | Profile | Surface | Required Effect | Status | Why |');
    lines.push('|---|---|---|---|---|---|');
    for (const item of output.missingEffects) {
      lines.push(`| ${md(item.service)} | ${md(item.profile)} | ${md(item.surface)} | ${md(item.requiredEffect)} | ${md(item.status)} | ${md(item.why)} |`);
    }
  }

  lines.push('');
  lines.push('## Unsafe Required Fixes');
  lines.push('');
  if (output.unsafeRequiredFixes.length === 0) {
    lines.push('No unsafe required fixes recorded.');
  } else {
    for (const fix of output.unsafeRequiredFixes) {
      lines.push(`- **${md(fix.service)} / ${md(fix.type)}**: ${md(fix.action || fix.reason)}`);
    }
  }

  lines.push('');
  lines.push('## Research Plan');
  lines.push('');
  if (output.researchPlan.length === 0) {
    lines.push('No research plan requested.');
  } else {
    for (const plan of output.researchPlan) {
      lines.push(`### ${md(plan.service)} â€” ${md(plan.reason)}`);
      for (const q of plan.questions || []) lines.push(`- ${md(q)}`);
    }
  }

  lines.push('');
  return lines.join('\n');
}

function toUnsafeFixMarkdown(fixes) {
  const lines = ['# Unsafe Required Fixes', ''];
  if (!fixes.length) {
    lines.push('No unsafe required fixes.');
  }
  for (const fix of fixes) {
    lines.push(`## ${fix.service} / ${fix.type || 'fix'}`);
    lines.push('');
    lines.push(`- action: ${fix.action || ''}`);
    lines.push(`- reason: ${fix.reason || ''}`);
    lines.push(`- surface: ${fix.surface || ''}`);
    lines.push('');
  }
  return lines.join('\n');
}

function walk(start) {
  const files = [];
  if (!fs.existsSync(start)) return files;
  walkInner(start);
  return files;

  function walkInner(current) {
    const rp = rel(current);
    if (shouldSkip(rp)) return;
    let entries = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const abs = path.join(current, entry.name);
      const next = rel(abs);
      if (shouldSkip(next)) continue;
      if (entry.isDirectory()) walkInner(abs);
      else if (entry.isFile()) files.push(abs);
    }
  }
}

function shouldSkip(relativePath) {
  if (!relativePath || relativePath === '.') return false;
  const normalized = relativePath.replace(/\\/g, '/');
  if (normalized.startsWith('tools/registry/runs/') && !/evidence|summary|matrix|closure|runtime|visual|screenshot|log|trace|metric/i.test(normalized)) {
    return true;
  }
  return normalized.split('/').some((part) => SKIP_PARTS.has(part));
}

function isTextLike(file) {
  const ext = path.extname(file).toLowerCase();
  return CODE_EXTENSIONS.has(ext);
}

function uniqueFiles(files) {
  return [...new Set(files.map((file) => path.resolve(file)))];
}

function readText(file) {
  try {
    return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  } catch {
    return '';
  }
}

function readJsonSafe(file) {
  try {
    return JSON.parse(readText(file));
  } catch {
    return null;
  }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, '/');
}

function snippet(text, index) {
  const start = Math.max(0, index - 80);
  const end = Math.min(text.length, index + 160);
  return text.slice(start, end).replace(/\s+/g, ' ').trim();
}

function normalizeId(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function pushJourney(service, journey, expectedSurfaces) {
  result.journeyGraph.push({ service, journey, expectedSurfaces });
}

function countMatches(text, regex) {
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function dedupeBy(items, selector) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = selector(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function md(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function fallbackProfile() {
  return {
    canonicalServices: DEFAULT_SERVICES,
    domainProfiles: [],
    uxHeuristics: [],
    sourceReferences: [],
  };
}
