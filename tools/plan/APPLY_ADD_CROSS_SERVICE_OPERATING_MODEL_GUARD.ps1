Set-Location -LiteralPath "C:\bthwani-suite"

$ErrorActionPreference = "Stop"

$IssueCode = "ADD_CROSS_SERVICE_OPERATING_MODEL_GUARD"
$SessionId = "ADD_CROSS_SERVICE_OPERATING_MODEL_GUARD-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$RunRoot = Join-Path -Path "tools\registry\runs" -ChildPath $SessionId
$ZipPath = Join-Path -Path $RunRoot -ChildPath ($SessionId + ".zip")

$GuardPath = "tools\guards\guard-cross-service-operating-model.mjs"
$ProfileDir = "governance\benchmark-profiles"
$ProfilePath = Join-Path $ProfileDir "cross-service-operating-model.profile.json"
$ManifestPath = "tools\guards\guard-manifest.json"
$CatalogPath = "tools\guards\GUARDS_CATALOG.md"
$PackagePath = "package.json"

New-Item -ItemType Directory -Force -Path $RunRoot | Out-Null
New-Item -ItemType Directory -Force -Path $ProfileDir | Out-Null

$CommandLog = Join-Path $RunRoot "commands.log"
$SummaryPath = Join-Path $RunRoot "SUMMARY.md"
$EvidenceJsonPath = Join-Path $RunRoot "evidence.json"

function Write-RunLog {
  param([string]$Message)
  $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
  $line | Tee-Object -FilePath $CommandLog -Append | Out-Null
}

function Invoke-Capture {
  param(
    [string]$Name,
    [string]$FilePath,
    [string[]]$Arguments,
    [string]$OutputFile
  )

  Write-RunLog "RUN: $Name :: $FilePath $($Arguments -join ' ')"
  $outPath = Join-Path $RunRoot $OutputFile
  try {
    $output = & $FilePath @Arguments 2>&1 | Out-String
    $exitCode = if ($null -ne $LASTEXITCODE) { [int]$LASTEXITCODE } else { 0 }
  } catch {
    $output = $_ | Out-String
    $exitCode = 1
  }
  $output | Set-Content -LiteralPath $outPath -Encoding UTF8
  Write-RunLog "EXIT: $Name :: $exitCode :: $outPath"
  return [pscustomobject]@{ Name = $Name; ExitCode = $exitCode; OutputFile = $OutputFile }
}

function Fail-Run {
  param([string]$Message)
  Write-RunLog "FAIL: $Message"
  $Message | Set-Content -LiteralPath (Join-Path $RunRoot "FAIL.txt") -Encoding UTF8
  throw $Message
}

Write-Host ""
Write-Host "=== ADD CROSS-SERVICE OPERATING MODEL GUARD ==="
Write-Host "Session: $SessionId"
Write-Host "Evidence: $RunRoot"
Write-Host ""

if (-not (Test-Path -LiteralPath ".git")) {
  Fail-Run "Not a Git repository root: C:\bthwani-suite"
}

foreach ($required in @($PackagePath, "tools\guards", "tools\guards\lib\guard-utils.mjs", $ManifestPath)) {
  if (-not (Test-Path -LiteralPath $required)) {
    Fail-Run "Required path missing: $required"
  }
}

$checks = New-Object System.Collections.Generic.List[object]

$checks.Add((Invoke-Capture -Name "git-branch" -FilePath "git" -Arguments @("branch", "--show-current") -OutputFile "git-branch.txt"))
$checks.Add((Invoke-Capture -Name "git-head" -FilePath "git" -Arguments @("rev-parse", "HEAD") -OutputFile "git-head.txt"))
$checks.Add((Invoke-Capture -Name "pre-git-status" -FilePath "git" -Arguments @("--no-pager", "status", "--short") -OutputFile "pre-git-status.txt"))
$checks.Add((Invoke-Capture -Name "pre-git-diff-check" -FilePath "git" -Arguments @("--no-pager", "diff", "--check") -OutputFile "pre-git-diff-check.txt"))

$relevantDocs = @(
  "AGENTS.md",
  ".agents\README.md",
  ".agents\INDEX.md",
  ".agents\SKILL_CATALOG.md",
  ".agents\AUTHORITY_BOUNDARY.md",
  ".agents\UPDATE_POLICY.md",
  "governance\02_PLATFORM_SSOT.md",
  "governance\08_UI_KIT_AND_BRAND.md",
  "governance\09_API_BINDING_RUNTIME.md",
  "governance\10_SERVICE_CLOSURE.md",
  "governance\11_EVIDENCE_AND_TRACEABILITY.md",
  "governance\13_CI_AND_GATES.md",
  "governance\14_GUARDS_CATALOG.md",
  "governance\20_VARIABLE_POLICY_AND_PROVIDER_CONTROL.md",
  "governance\22_DSH_GOLDEN_SLICE.md",
  "governance\24_TRACEABILITY_AND_ROADMAP.md"
)
$reviewedDocs = @()
foreach ($doc in $relevantDocs) {
  if (Test-Path -LiteralPath $doc) { $reviewedDocs += $doc }
}
$reviewedDocs | Set-Content -LiteralPath (Join-Path $RunRoot "reviewed-agent-skill-governance-files.txt") -Encoding UTF8

foreach ($maybeExisting in @($GuardPath, $ProfilePath, $ManifestPath, $CatalogPath, $PackagePath)) {
  if (Test-Path -LiteralPath $maybeExisting) {
    $safeName = ($maybeExisting -replace '[\\/:*?"<>|]', '_')
    Copy-Item -LiteralPath $maybeExisting -Destination (Join-Path $RunRoot ("backup." + $safeName)) -Force
  }
}

$profileContent = @'
{
  "version": "1.0.0",
  "owner": "governance/benchmark-profiles",
  "purpose": "Global-standard operating model benchmark profile for BThwani cross-service journey and UX/logic closure diagnosis.",
  "defaultMode": "deterministic-local-first",
  "sourceReferences": [
    {
      "id": "WCAG_2_2",
      "authority": "W3C",
      "url": "https://www.w3.org/TR/WCAG22/",
      "usedFor": [
        "accessibility",
        "operable",
        "understandable",
        "status messages",
        "input assistance",
        "complete processes"
      ]
    },
    {
      "id": "OWASP_AUTHORIZATION",
      "authority": "OWASP",
      "url": "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html",
      "usedFor": [
        "deny_by_default",
        "least_privilege",
        "authorize_every_request",
        "ABAC_ReBAC",
        "audit_sensitive_access"
      ]
    },
    {
      "id": "CORE_WEB_VITALS",
      "authority": "web.dev",
      "url": "https://web.dev/articles/vitals",
      "usedFor": [
        "loading",
        "interactivity",
        "visual_stability",
        "performance_regression"
      ],
      "thresholds": {
        "LCP": "2.5s",
        "INP": "200ms",
        "CLS": "0.1",
        "percentile": "p75"
      }
    },
    {
      "id": "OPENTELEMETRY_OBSERVABILITY",
      "authority": "OpenTelemetry",
      "url": "https://opentelemetry.io/docs/concepts/observability-primer/",
      "usedFor": [
        "traces",
        "metrics",
        "logs",
        "request_flow_evidence",
        "distributed_debugging"
      ]
    },
    {
      "id": "PCI_DSS_PAYMENT_SECURITY",
      "authority": "PCI SSC",
      "url": "https://www.pcisecuritystandards.org/standards/",
      "usedFor": [
        "payment_data_boundary",
        "secure_software_lifecycle",
        "payment_security_evidence"
      ]
    }
  ],
  "canonicalServices": [
    "dsh",
    "wlt",
    "knz",
    "arb",
    "amn",
    "esf",
    "mrf",
    "snd",
    "kwd"
  ],
  "canonicalSurfaces": [
    "app-client",
    "app-partner",
    "app-captain",
    "app-field",
    "control-panel",
    "control-panel operations",
    "control-panel finance",
    "WLT",
    "notifications",
    "support",
    "audit",
    "Vars"
  ],
  "closureClaims": [
    "CLOSED",
    "READY",
    "READY_FOR_PR",
    "FINAL",
    "100%",
    "VERIFIED",
    "LOCKED",
    "COMPLETE",
    "RUNTIME_VERIFIED",
    "PRODUCTION_READY"
  ],
  "globalRequiredGates": [
    "service_identity",
    "surface_inventory",
    "journey_inventory",
    "operation_catalog",
    "state_model",
    "screen_state_coverage",
    "cross_surface_effects",
    "control_panel_visibility",
    "permissions_authorization",
    "audit_log",
    "rollback_recovery",
    "support_escalation",
    "notifications_inbox",
    "WLT_financial_boundary",
    "Vars_policy_control",
    "on_demand_retrieval",
    "accessibility_WCAG22",
    "performance_budget",
    "observability_evidence",
    "closure_evidence"
  ],
  "riskSensitiveTerms": [
    "address",
    "customer history",
    "customerHistory",
    "previous orders",
    "previousOrders",
    "trust score",
    "trustScore",
    "risk score",
    "riskScore",
    "fraud",
    "housing",
    "home location",
    "location",
    "phone",
    "identity",
    "payment",
    "refund",
    "settlement",
    "payout",
    "ledger",
    "commission",
    "wallet"
  ],
  "domainProfiles": [
    {
      "id": "delivery_marketplace_ordering",
      "detectTerms": [
        "order",
        "checkout",
        "cart",
        "store",
        "partner",
        "captain",
        "delivery",
        "dispatch",
        "pickup",
        "delivered"
      ],
      "requiredEffects": [
        {
          "id": "client_order_confirmation_tracking",
          "surface": "app-client",
          "terms": ["confirmation", "tracking", "order id", "orderId", "status", "cancel", "support"],
          "why": "Client must receive immediate order confirmation, visible order identity, status timeline, cancellation/support access."
        },
        {
          "id": "partner_new_order_intake",
          "surface": "app-partner",
          "terms": ["intake", "new order", "accept", "reject", "prepare", "ready"],
          "why": "Partner must accept/reject and prepare before pickup or dispatch completion."
        },
        {
          "id": "captain_assignment_pickup_delivery_pod",
          "surface": "app-captain",
          "terms": ["assignment", "accept", "arrive", "pickup", "dropoff", "proof", "pod", "delivered"],
          "why": "Captain must receive task, pick up, deliver, and provide proof."
        },
        {
          "id": "operations_order_timeline_dispatch_intervention",
          "surface": "control-panel operations",
          "terms": ["operations", "timeline", "dispatch", "manual", "intervention", "monitor", "escalation", "audit"],
          "why": "Operations must monitor, intervene, escalate, and audit order lifecycle."
        },
        {
          "id": "payment_and_settlement_wlt_boundary",
          "surface": "WLT",
          "terms": ["payment", "authorization", "capture", "commission", "fee", "settlement", "payout", "refund", "ledger", "wlt"],
          "why": "Money semantics must remain WLT-owned and auditable."
        },
        {
          "id": "notification_chain",
          "surface": "notifications",
          "terms": ["notification", "inbox", "push", "email", "sms", "created", "accepted", "ready", "picked", "delivered", "failed"],
          "why": "Each actor must receive timely status changes."
        },
        {
          "id": "support_escalation_order_context",
          "surface": "support",
          "terms": ["support", "ticket", "escalation", "sla", "issue", "complaint", "recovery"],
          "why": "Order-linked support and escalation must exist for failures."
        },
        {
          "id": "audit_and_rollback",
          "surface": "audit",
          "terms": ["audit", "rollback", "revert", "reason", "changedBy", "timestamp", "manual override"],
          "why": "Every critical state change needs auditability and recovery path."
        },
        {
          "id": "risk_trust_summary_policy",
          "surface": "control-panel operations",
          "terms": ["trust", "risk", "score", "summary", "mask", "permission", "abac", "rebac", "least privilege", "audit"],
          "why": "Operations may need risk summary, not unrestricted sensitive customer history."
        }
      ]
    },
    {
      "id": "wallet_payment_refund_settlement",
      "detectTerms": ["wallet", "payment", "refund", "settlement", "payout", "ledger", "commission", "fee"],
      "requiredEffects": [
        {
          "id": "ledger_truth",
          "surface": "WLT",
          "terms": ["ledger", "entry", "balance", "transaction", "reconcile", "settlement"],
          "why": "Financial truth must be ledger-based, reconciled, and owned by WLT."
        },
        {
          "id": "refund_reversal_policy",
          "surface": "WLT",
          "terms": ["refund", "reverse", "partial", "cancel", "chargeback", "audit"],
          "why": "Refund/cancel requires explicit policy and audit trail."
        },
        {
          "id": "finance_control_panel_visibility",
          "surface": "control-panel finance",
          "terms": ["finance", "read-only", "settlement", "payout", "reconcile", "export"],
          "why": "Finance visibility must be controlled and not duplicate WLT ownership."
        }
      ]
    },
    {
      "id": "admin_control_room_operations",
      "detectTerms": ["control-panel", "operations", "admin", "monitor", "override", "policy", "vars"],
      "requiredEffects": [
        {
          "id": "permissioned_manual_intervention",
          "surface": "control-panel",
          "terms": ["permission", "role", "policy", "audit", "reason", "manual", "override"],
          "why": "Manual operational intervention must be permissioned, reasoned, and audited."
        },
        {
          "id": "vars_policy_control",
          "surface": "Vars",
          "terms": ["vars", "policy", "threshold", "rollout", "provider", "experiment", "feature flag"],
          "why": "Operational policy must be controlled centrally where configurable."
        }
      ]
    },
    {
      "id": "community_service_request_lifecycle",
      "detectTerms": ["community", "request", "case", "booking", "appointment", "service", "status"],
      "requiredEffects": [
        {
          "id": "client_request_status",
          "surface": "app-client",
          "terms": ["request", "status", "confirmation", "schedule", "cancel", "support"],
          "why": "Client must understand request progress and recovery options."
        },
        {
          "id": "control_panel_case_management",
          "surface": "control-panel",
          "terms": ["case", "queue", "assign", "review", "approve", "reject", "audit"],
          "why": "Control panel must provide case handling, ownership, and audit."
        }
      ]
    }
  ],
  "uxHeuristics": [
    {
      "id": "visibility_of_system_status",
      "terms": ["loading", "pending", "progress", "status", "timeline", "toast", "skeleton"],
      "severity": "FAIL_WHEN_DATA_BOUND"
    },
    {
      "id": "error_recovery",
      "terms": ["error", "retry", "recover", "failed", "tryAgain", "fallback"],
      "severity": "FAIL_WHEN_DATA_BOUND"
    },
    {
      "id": "empty_success_disabled_states",
      "terms": ["empty", "success", "disabled", "offline", "noData", "completed"],
      "severity": "WARN"
    },
    {
      "id": "accessibility_interaction",
      "terms": ["accessibilityLabel", "aria-label", "role", "focus", "keyboard", "targetSize", "label"],
      "severity": "WARN"
    },
    {
      "id": "performance_feedback",
      "terms": ["skeleton", "lazy", "pagination", "limit", "cursor", "virtual", "FlatList", "SectionList", "memo"],
      "severity": "WARN"
    }
  ],
  "unsafeAutoFixBoundaries": [
    "api_endpoint",
    "database_schema",
    "payment_logic",
    "refund_logic",
    "settlement_logic",
    "dispatch_logic",
    "permission_logic",
    "runtime_mutation",
    "provider_switching",
    "financial_ownership",
    "customer_sensitive_data_exposure"
  ],
  "safeAutoFixKinds": [
    "generated_gap_report",
    "UNPROVEN_matrix_row",
    "N/A_WITH_REASON_placeholder",
    "research_plan",
    "closure_warning_record",
    "remediation_plan"
  ]
}
'@

Set-Content -LiteralPath $ProfilePath -Value ($profileContent.TrimEnd() + "`n") -Encoding UTF8
Write-RunLog "WROTE: $ProfilePath"

$guardContent = @'
#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const GUARD_ID = 'GUARD_CROSS_SERVICE_OPERATING_MODEL';
const DEFAULT_SERVICES = ['dsh', 'wlt', 'knz', 'arb', 'amn', 'esf', 'mrf', 'snd', 'kwd'];
const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.md', '.mdx', '.yml', '.yaml']);
const SKIP_PARTS = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', '.next', '.expo', '.turbo', '.nx', 'android', 'ios']);
const CLAIM_REGEX = /\b(CLOSED|READY|READY_FOR_PR|FINAL|100%|VERIFIED|LOCKED|COMPLETE|RUNTIME_VERIFIED|PRODUCTION_READY)\b/gi;
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
    blueprintPath: `${service.id}/SERVICE_BLUEPRINT.md`,
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
    add('WARN', service.id, 'blueprint_missing', `${service.id}/SERVICE_BLUEPRINT.md is missing.`, serviceResult.blueprintPath, 'Add a living blueprint before service closure.');
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

function analyzeContradictions(serviceResult, combined, normalized) {
  const closed = /CLOSED|100%|FINAL|PRODUCTION_READY/i.test(combined);
  const blocked = /BLOCKED|UNPROVEN|TBD|NEEDS_EVIDENCE|NEEDS_VISUAL_EVIDENCE|RUNTIME_UNPROVEN|PENDING/i.test(combined);
  if (closed && blocked) {
    const record = {
      service: serviceResult.id,
      type: 'closure_status_conflict',
      evidence: 'closed/final and blocked/unproven/pending terms both detected',
    };
    result.contradictions.push(record);
    add('FAIL', serviceResult.id, 'closure_status_conflict', 'Conflicting closure language found.', record.evidence, 'Resolve status vocabulary and do not claim closure with blockers.');
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
  if (/CLOSED/i.test(text)) return 'CLOSURE_CLAIM_DETECTED';
  if (/READY/i.test(text)) return 'READY_CLAIM_DETECTED';
  if (/TBD|UNPROVEN/i.test(text)) return 'UNPROVEN';
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
  const regex = new RegExp(`N/A_WITH_REASON|NOT_APPLICABLE_WITH_REASON|${escaped}[^\\n]{0,120}(N/A|not applicable|غير مطلوب|لا ينطبق)`, 'i');
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
      lines.push(`### ${md(plan.service)} — ${md(plan.reason)}`);
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
'@

Set-Content -LiteralPath $GuardPath -Value ($guardContent.TrimEnd() + "`n") -Encoding UTF8
Write-RunLog "WROTE: $GuardPath"

$PatchScriptPath = Join-Path $RunRoot "patch-registration.cjs"
$patchRegistration = @'
const fs = require('fs');
const path = require('path');

const root = process.cwd();

function readJson(relative) {
  return JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8').replace(/^\uFEFF/, ''));
}

function writeJson(relative, value) {
  fs.writeFileSync(path.join(root, relative), JSON.stringify(value, null, 2) + '\n', 'utf8');
}

const packagePath = 'package.json';
const pkg = readJson(packagePath);
pkg.scripts = pkg.scripts || {};
if (!pkg.scripts['guard:operating-model']) {
  pkg.scripts['guard:operating-model'] = 'node tools/guards/guard-cross-service-operating-model.mjs';
}
if (!pkg.scripts['guard:operating-model:strict']) {
  pkg.scripts['guard:operating-model:strict'] = 'node tools/guards/guard-cross-service-operating-model.mjs --strict';
}
if (!pkg.scripts['guard:operating-model:research']) {
  pkg.scripts['guard:operating-model:research'] = 'node tools/guards/guard-cross-service-operating-model.mjs --research-plan';
}
writeJson(packagePath, pkg);

const manifestPath = 'tools/guards/guard-manifest.json';
const manifest = readJson(manifestPath);
manifest.guards = Array.isArray(manifest.guards) ? manifest.guards : [];
if (!manifest.guards.some((entry) => entry.id === 'GUARD_CROSS_SERVICE_OPERATING_MODEL')) {
  const ownerPolicyCandidates = [
    'governance/10_SERVICE_CLOSURE.md',
    'governance/09_API_BINDING_RUNTIME.md',
    'governance/11_EVIDENCE_AND_TRACEABILITY.md',
    'governance/13_CI_AND_GATES.md',
    'governance/20_VARIABLE_POLICY_AND_PROVIDER_CONTROL.md',
    'governance/benchmark-profiles/cross-service-operating-model.profile.json'
  ];
  const ownerPolicy = ownerPolicyCandidates.filter((candidate) => fs.existsSync(path.join(root, candidate)));
  manifest.guards.push({
    id: 'GUARD_CROSS_SERVICE_OPERATING_MODEL',
    file: 'tools/guards/guard-cross-service-operating-model.mjs',
    ownerPolicy,
    purpose: 'progress-aware cross-service operating model guard that diagnoses journeys, operations, UX logic, cross-surface effects, permissions, WLT finance boundaries, Vars policy, observability, evidence, and unsafe closure claims against global benchmark profiles',
    runners: ['governance'],
    mode: 'blocking',
    outputs: ['json', 'md']
  });
  writeJson(manifestPath, manifest);
}

const catalogPath = path.join(root, 'tools/guards/GUARDS_CATALOG.md');
if (fs.existsSync(catalogPath)) {
  let catalog = fs.readFileSync(catalogPath, 'utf8');
  if (!catalog.includes('guard-cross-service-operating-model.mjs')) {
    const row = '| `guard-cross-service-operating-model.mjs` | يحلل منطق التشغيل وتجربة المستخدم عبر كل الخدمات والأسطح حسب التقدم الفعلي، ويكشف فجوات الرحلات والعمليات والصلاحيات والمالية وWLT وVars والأدلة وفق benchmark profiles عالمية | `governance/10_SERVICE_CLOSURE.md`, `governance/09_API_BINDING_RUNTIME.md`, `governance/20_VARIABLE_POLICY_AND_PROVIDER_CONTROL.md`, `governance/benchmark-profiles/cross-service-operating-model.profile.json` | مع أي إغلاق خدمة/رحلة/عملية أو قبل ادعاء READY/CLOSED | `.json`, `.md` | `blocking` |';
    const marker = '## Runners';
    if (catalog.includes(marker)) {
      catalog = catalog.replace(marker, `${row}\n\n${marker}`);
    } else {
      catalog += `\n\n## Cross-Service Operating Model Guard\n\n${row}\n`;
    }
    fs.writeFileSync(catalogPath, catalog, 'utf8');
  }
}
'@

Set-Content -LiteralPath $PatchScriptPath -Value $patchRegistration -Encoding UTF8
$checks.Add((Invoke-Capture -Name "patch-registration" -FilePath "node" -Arguments @($PatchScriptPath) -OutputFile "patch-registration.txt"))

$SyntaxOutput = Join-Path $RunRoot "node-check-guard.txt"
$checks.Add((Invoke-Capture -Name "node-check-guard" -FilePath "node" -Arguments @("--check", $GuardPath) -OutputFile "node-check-guard.txt"))

$GuardJson = Join-Path $RunRoot "cross-service-operating-model.json"
$GuardMd = Join-Path $RunRoot "cross-service-operating-model.md"
$checks.Add((Invoke-Capture -Name "operating-model-guard-check" -FilePath "node" -Arguments @($GuardPath, "--root", ".", "--mode", "CHECK", "--json-out", $GuardJson, "--md-out", $GuardMd) -OutputFile "operating-model-guard-check.txt"))

$ResearchJson = Join-Path $RunRoot "cross-service-operating-model-research-plan.json"
$ResearchMd = Join-Path $RunRoot "cross-service-operating-model-research-plan.md"
$checks.Add((Invoke-Capture -Name "operating-model-research-plan" -FilePath "node" -Arguments @($GuardPath, "--root", ".", "--mode", "RESEARCH_PLAN", "--research-plan", "--json-out", $ResearchJson, "--md-out", $ResearchMd) -OutputFile "operating-model-research-plan.txt"))

$GovJson = Join-Path $RunRoot "governance-boundaries-after.json"
$GovMd = Join-Path $RunRoot "governance-boundaries-after.md"
if (Test-Path -LiteralPath "tools\guards\guard-governance-boundaries.mjs") {
  $checks.Add((Invoke-Capture -Name "governance-boundaries-after" -FilePath "node" -Arguments @("tools/guards/guard-governance-boundaries.mjs", "--root", ".", "--json-out", $GovJson, "--md-out", $GovMd) -OutputFile "governance-boundaries-after.txt"))
}

$checks.Add((Invoke-Capture -Name "post-git-status" -FilePath "git" -Arguments @("--no-pager", "status", "--short") -OutputFile "post-git-status.txt"))
$checks.Add((Invoke-Capture -Name "post-git-diff-stat" -FilePath "git" -Arguments @("--no-pager", "diff", "--stat") -OutputFile "post-git-diff-stat.txt"))
$checks.Add((Invoke-Capture -Name "post-git-diff-name-status" -FilePath "git" -Arguments @("--no-pager", "diff", "--name-status") -OutputFile "post-git-diff-name-status.txt"))
$checks.Add((Invoke-Capture -Name "post-git-diff-check" -FilePath "git" -Arguments @("--no-pager", "diff", "--check") -OutputFile "post-git-diff-check.txt"))
$checks.Add((Invoke-Capture -Name "tsc-noemit" -FilePath "pnpm" -Arguments @("-w", "exec", "tsc", "--noEmit") -OutputFile "tsc-noemit.txt"))

$guardStatus = "UNKNOWN"
if (Test-Path -LiteralPath $GuardJson) {
  try {
    $guardStatus = (Get-Content -LiteralPath $GuardJson -Raw | ConvertFrom-Json).status
  } catch {
    $guardStatus = "UNREADABLE"
  }
}

$checkObjects = @()
foreach ($check in $checks) {
  $checkObjects += [pscustomobject]@{
    name = $check.Name
    exitCode = $check.ExitCode
    outputFile = $check.OutputFile
  }
}

$registrationExit = ($checks | Where-Object { $_.Name -eq "patch-registration" } | Select-Object -First 1).ExitCode
$syntaxExit = ($checks | Where-Object { $_.Name -eq "node-check-guard" } | Select-Object -First 1).ExitCode
$diffCheckExit = ($checks | Where-Object { $_.Name -eq "post-git-diff-check" } | Select-Object -First 1).ExitCode
$tscExit = ($checks | Where-Object { $_.Name -eq "tsc-noemit" } | Select-Object -First 1).ExitCode

$finalStatus = "PASS_WITH_WARNINGS"
$recommendation = "REVIEW_FINDINGS_AND_FIX_BLOCKERS_BEFORE_ANY_CLOSURE_CLAIM"
if ($registrationExit -ne 0 -or $syntaxExit -ne 0 -or $diffCheckExit -ne 0) {
  $finalStatus = "FIX_REQUIRED"
  $recommendation = "FIX_GUARD_INSTALLATION_OR_DIFF_ISSUES"
} elseif ($guardStatus -eq "FAIL") {
  $finalStatus = "GUARD_INSTALLED_AND_BLOCKING_FINDINGS_FOUND"
  $recommendation = "FIX_OPERATING_MODEL_FINDINGS_THEN_RERUN"
} elseif ($tscExit -ne 0) {
  $finalStatus = "PASS_WITH_WARNINGS"
  $recommendation = "GUARD_INSTALLED_BUT_TYPECHECK_NEEDS_REVIEW"
} elseif ($guardStatus -eq "PASS") {
  $finalStatus = "PASS"
  $recommendation = "GUARD_INSTALLED_AND_CURRENT_CHECK_PASSED"
}

$summary = @"
# $IssueCode

status: $finalStatus
recommendation: $recommendation
session_id: $SessionId
repo: C:\bthwani-suite
evidence_root: $RunRoot
handoff_zip: $ZipPath
guard_status: $guardStatus

## Files added/updated

- $GuardPath
- $ProfilePath
- $ManifestPath
- $CatalogPath
- $PackagePath

## New package scripts

- pnpm run guard:operating-model
- pnpm run guard:operating-model:strict
- pnpm run guard:operating-model:research

## Guard purpose

Progress-aware cross-service operating model guard that reads current code and evidence, discovers services/journeys/operations/surfaces, compares them with BThwani and global benchmark profiles, detects missing effects/contradictions/unsafe closure claims, and separates safe generated remediation records from unsafe runtime/API/finance/permission fixes.

## Safe behavior

This installation does not implement API/backend/payment/permission/dispatch/runtime behavior.
Unsafe fixes are emitted as `unsafeRequiredFixes` only.

## Evidence files

- commands.log
- reviewed-agent-skill-governance-files.txt
- cross-service-operating-model.json
- cross-service-operating-model.md
- cross-service-operating-model-research-plan.json
- cross-service-operating-model-research-plan.md
- governance-boundaries-after.json
- governance-boundaries-after.md
- post-git-status.txt
- post-git-diff-stat.txt
- post-git-diff-name-status.txt
- post-git-diff-check.txt
- tsc-noemit.txt
"@

Set-Content -LiteralPath $SummaryPath -Value $summary -Encoding UTF8

$evidence = [pscustomobject]@{
  status = $finalStatus
  recommendation = $recommendation
  session_id = $SessionId
  repo = "C:\bthwani-suite"
  evidence_root = $RunRoot
  handoff_zip = $ZipPath
  guard_file = $GuardPath
  profile_file = $ProfilePath
  guard_status = $guardStatus
  checks = $checkObjects
  generated_at = (Get-Date).ToUniversalTime().ToString("o")
}
$evidence | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $EvidenceJsonPath -Encoding UTF8

if (Test-Path -LiteralPath $ZipPath) {
  Remove-Item -LiteralPath $ZipPath -Force
}
Compress-Archive -Path (Join-Path $RunRoot "*") -DestinationPath $ZipPath -Force

Write-Host ""
Write-Host "=== RESULT ==="
Write-Host "status: $finalStatus"
Write-Host "recommendation: $recommendation"
Write-Host "guard_status: $guardStatus"
Write-Host "evidence_root: $RunRoot"
Write-Host "zip: $ZipPath"
Write-Host ""
Write-Host "Return/upload this ZIP for review if needed:"
Write-Host $ZipPath
Write-Host ""
