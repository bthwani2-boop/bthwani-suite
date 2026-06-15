#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const args = process.argv.slice(2);
function argValue(name, fallback = "") {
  const i = args.indexOf(name);
  if (i >= 0 && i + 1 < args.length) return args[i + 1];
  return fallback;
}

const repo = path.resolve(argValue("--root", process.cwd()));
const jsonOut = argValue("--json-out", "");
const mdOut = argValue("--md-out", "");

const errors = [];
const warnings = [];
const info = [];

const toPosix = (p) => p.split(path.sep).join("/");
const abs = (p) => path.join(repo, p);
const exists = (p) => fs.existsSync(abs(p));
const read = (p) => fs.readFileSync(abs(p), "utf8");

function walk(dir) {
  if (!exists(dir)) return [];
  const out = [];
  for (const ent of fs.readdirSync(abs(dir), { withFileTypes: true })) {
    const p = path.posix.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else out.push(toPosix(p));
  }
  return out;
}

function hasAnyEntries(dir) {
  if (!exists(dir)) return false;
  return fs.readdirSync(abs(dir), { withFileTypes: true }).length > 0;
}

const requiredFiles = [
  "AGENTS.md",
  "CLAUDE.md",
  "GEMINI.md",
  ".agents/README.md",
  ".agents/INDEX.md",
  ".agents/SKILL_CATALOG.md",
  ".agents/AUTHORITY_BOUNDARY.md",
  ".agents/UPDATE_POLICY.md"
];

for (const f of requiredFiles) {
  if (!exists(f)) errors.push(`MISSING_REQUIRED_FILE:${f}`);
}

const requiredSkills = [
  "bthwani-current-workspace-authority",
  "bthwani-agent-governance-execution",
  "bthwani-local-evidence-pack",
  "bthwani-patch-review-and-evidence",
  "bthwani-agent-restoration-forensics",
  "bthwani-domain-governance-reader",
  "bthwani-ui-kit-surface-contract",
  "bthwani-frontend-design-excellence-contract",
  "bthwani-screen-flow-binding-contract",
  "bthwani-integrated-system-umbrella-contract",
  "bthwani-platform-vars-control-contract",
  "bthwani-runtime-provider-config-contract",
  "bthwani-api-contract-client-boundary",
  "bthwani-go-backend-target-boundary",
  "bthwani-data-fixture-simulation-contract",
  "bthwani-on-demand-retrieval-contract",
  "bthwani-finance-ledger-contract",
  "bthwani-commercial-growth-contract",
  "bthwani-commerce-catalog-contract",
  "bthwani-operations-dispatch-contract",
  "bthwani-mobile-navigation-back-contract",
  "bthwani-security-secrets-privacy-contract",
  "bthwani-supply-chain-intake-contract",
  "bthwani-test-quality-gates-contract",
  "bthwani-release-runtime-gates",
  "bthwani-observability-performance-contract",
  "bthwani-agent-skill-authoring-contract",
  "bthwani-agent-registry-validator",
  "bthwani-full-stack-clean-code-skill"
];

for (const skill of requiredSkills) {
  const p = `.agents/skills/${skill}/SKILL.md`;
  if (!exists(p)) errors.push(`MISSING_REQUIRED_SKILL:${skill}`);
}

for (const d of [".github/skills", ".github/agents", ".opencode/skills"]) {
  if (hasAnyEntries(d)) errors.push(`FORBIDDEN_ACTIVE_MIRROR_DIR_PRESENT:${d}`);
}

for (const f of [
  ".agents/adapters/claude.md",
  ".agents/adapters/codex.md",
  ".agents/adapters/copilot.md",
  ".agents/adapters/gemini.md",
  ".agents/adapters/cursor.md",
  ".agents/adapters/opencode.md"
]) {
  if (!exists(f)) errors.push(`MISSING_ADAPTER:${f}`);
}

function isSafePolicyContext(line) {
  const s = line.toLowerCase();
  return (
    s.includes("do not") ||
    s.includes("don't") ||
    s.includes("without explicit approval") ||
    s.includes("forbidden") ||
    s.includes("blocked") ||
    s.includes("reject") ||
    s.includes("rejected") ||
    s.includes("deny") ||
    s.includes("risk") ||
    s.includes("unsafe") ||
    s.includes("prohibit") ||
    s.includes("not allowed") ||
    s.includes("allowed when") ||
    s.includes("explicit user") ||
    s.includes("user types exactly") ||
    s.includes("ممنوع") ||
    s.includes("لا ") ||
    s.includes("بدون موافقة") ||
    s.includes("خطر")
  );
}

const dangerousPatterns = [
  { name: "npm install", re: /\bnpm\s+install\b/i },
  { name: "pnpm add", re: /\bpnpm\s+add\b/i },
  { name: "git push", re: /\bgit\s+push\b/i },
  { name: "git commit", re: /\bgit\s+commit\b/i },
  { name: "force push", re: /\bforce\s+push\b/i },
  { name: "rm -rf", re: /\brm\s+-rf\b/i },
  { name: "_HANDOFF", re: /_HANDOFF/i }
];

const scanFiles = [
  ...walk(".agents/skills").filter((p) => /^\.agents\/skills\/bthwani-[^/]+\/SKILL\.md$/i.test(p)),
  ".agents/README.md",
  ".agents/INDEX.md",
  ".agents/SKILL_CATALOG.md",
  ".agents/AUTHORITY_BOUNDARY.md",
  ".agents/UPDATE_POLICY.md",
  "AGENTS.md",
  "CLAUDE.md",
  "GEMINI.md",
  ".github/copilot-instructions.md",
  "opencode.json"
].filter((p, i, arr) => p && exists(p) && arr.indexOf(p) === i);

for (const f of scanFiles) {
  const lines = read(f).split(/\r?\n/);
  lines.forEach((line, idx) => {
    for (const pat of dangerousPatterns) {
      if (pat.re.test(line) && !isSafePolicyContext(line)) {
        warnings.push(`RISK_TERM:${pat.name}:${f}:${idx + 1}`);
      }
    }
  });
}

for (const f of scanFiles) {
  if (read(f).includes("_HANDOFF.zip")) {
    errors.push(`LEGACY_HANDOFF_ZIP_REFERENCE:${f}`);
  }
}

const uiSkill = ".agents/skills/bthwani-ui-kit-surface-contract/SKILL.md";
if (exists(uiSkill)) {
  const s = read(uiSkill);
  if (!s.includes("توجب الالتزام بنظام الألوان المركزي")) errors.push("UI_SKILL_MISSING_CENTRAL_COLOR_PHRASE");
  if (!s.includes("تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر")) errors.push("UI_SKILL_MISSING_NOISE_FRAGMENTATION_PHRASE");
  if (!s.includes("@bthwani/ui-kit")) errors.push("UI_SKILL_MISSING_UI_KIT_AUTHORITY");
  if (!s.includes("Tamagui internally inside ui-kit only")) errors.push("UI_SKILL_MISSING_TAMAGUI_BOUNDARY");
}


const frontendDesignSkill = ".agents/skills/bthwani-frontend-design-excellence-contract/SKILL.md";
if (exists(frontendDesignSkill)) {
  const s = read(frontendDesignSkill);
  const requiredFrontendPhrases = [
    "premium",
    "modern",
    "mobile-first",
    "web-ready",
    "visual hierarchy",
    "interaction states",
    "empty",
    "loading",
    "error",
    "success",
    "accessibility",
    "NEEDS_VISUAL_EVIDENCE",
    "توجب الالتزام بنظام الألوان المركزي",
    "تجب إزالة ومعالجة وتصحيح الضجيج والتكرار والكود الميت والتسرب والتشظي والتبعثر",
    "@bthwani/ui-kit",
    "governance/"
  ];
  for (const phrase of requiredFrontendPhrases) {
    if (!s.includes(phrase)) {
      errors.push(`FRONTEND_DESIGN_SKILL_MISSING_PHRASE:${phrase}`);
    }
  }
}
const authority = ".agents/AUTHORITY_BOUNDARY.md";
if (exists(authority)) {
  const s = read(authority);
  if (!s.includes("Governance decides project policy")) errors.push("AUTHORITY_BOUNDARY_MISSING_GOVERNANCE_SPLIT");
  if (!s.includes("Donor files are extraction sources only")) errors.push("AUTHORITY_BOUNDARY_MISSING_DONOR_RULE");
}

const status = errors.length ? "FAIL" : warnings.length ? "PASS_WITH_WARNINGS" : "PASS";
const result = {
  guard: "guard-bthwani-agent-package",
  repo,
  checked_at: new Date().toISOString(),
  status,
  failCount: errors.length,
  warnCount: warnings.length,
  infoCount: info.length,
  errors,
  warnings,
  info
};

if (jsonOut) {
  fs.mkdirSync(path.dirname(jsonOut), { recursive: true });
  fs.writeFileSync(jsonOut, JSON.stringify(result, null, 2) + "\n");
}

if (mdOut) {
  fs.mkdirSync(path.dirname(mdOut), { recursive: true });
  const md = [
    `# ${result.guard}`,
    "",
    `Status: ${result.status}`,
    `Fail count: ${result.failCount}`,
    `Warn count: ${result.warnCount}`,
    "",
    "## Errors",
    ...(errors.length ? errors.map((x) => `- ${x}`) : ["- none"]),
    "",
    "## Warnings",
    ...(warnings.length ? warnings.map((x) => `- ${x}`) : ["- none"]),
    ""
  ].join("\n");
  fs.writeFileSync(mdOut, md);
}

console.log(JSON.stringify(result, null, 2));
process.exit(errors.length ? 1 : 0);
