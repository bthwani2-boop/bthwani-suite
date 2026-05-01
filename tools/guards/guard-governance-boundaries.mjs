#!/usr/bin/env node
/**
 * BThwani Governance Boundaries Guard v1.1.0
 *
 * CHECK-only guard.
 * Writes evidence under tools/registry/runs.
 * Does not modify repository source files.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const DEFAULT_CONFIG = "tools/guards/guard-governance-boundaries.config.json";

const args = process.argv.slice(2);
const argValue = (name, fallback) => {
  const idx = args.indexOf(name);
  if (idx >= 0 && args[idx + 1]) return args[idx + 1];
  const prefixed = args.find((arg) => arg.startsWith(`${name}=`));
  if (prefixed) return prefixed.slice(name.length + 1);
  return fallback;
};

const configPath = path.resolve(ROOT, argValue("--config", DEFAULT_CONFIG));

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function exists(filePath) {
  return fs.existsSync(filePath);
}

function toPosix(value) {
  return value.replace(/\\/g, "/").replace(/^\/+/, "");
}

function rel(filePath) {
  return toPosix(path.relative(ROOT, filePath));
}

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

function escapeCsv(value) {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function writeCsv(filePath, rows) {
  const headers = rows.length ? Object.keys(rows[0]) : ["empty"];
  const lines = [
    headers.map(escapeCsv).join(","),
    ...rows.map((row) => headers.map((h) => escapeCsv(row[h])).join(",")),
  ];
  writeFile(filePath, `${lines.join("\n")}\n`);
}

function hashFile(filePath) {
  if (!exists(filePath)) return "MISSING";
  const h = crypto.createHash("sha256");
  h.update(fs.readFileSync(filePath));
  return h.digest("hex");
}

function regexMatch(text, pattern, flags = "") {
  try {
    return new RegExp(pattern, flags).test(text);
  } catch {
    return false;
  }
}

function matchPatterns(text, patterns = []) {
  return patterns.some((pattern) => regexMatch(text, pattern));
}

function shouldIgnore(repoPath, config) {
  const p = toPosix(repoPath);
  return (config.ignore || []).some((pattern) => regexMatch(p, pattern));
}

function allowedExtension(filePath, config) {
  const ext = path.extname(filePath);
  return (config.extensions || []).includes(ext);
}

function walk(rootDir, config, output = []) {
  if (!exists(rootDir)) return output;
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(rootDir, entry.name);
    const repoPath = rel(full);
    if (shouldIgnore(repoPath, config)) continue;

    if (entry.isDirectory()) {
      walk(full, config, output);
    } else if (entry.isFile() && allowedExtension(full, config)) {
      output.push(full);
    }
  }
  return output;
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

function extractImports(text) {
  const specs = new Set();
  const patterns = [
    /import\s+(?:type\s+)?(?:[^'"`]+?\s+from\s+)?["'`]([^"'`]+)["'`]/g,
    /export\s+(?:type\s+)?(?:[^'"`]+?\s+from\s+)?["'`]([^"'`]+)["'`]/g,
    /require\(\s*["'`]([^"'`]+)["'`]\s*\)/g,
    /import\(\s*["'`]([^"'`]+)["'`]\s*\)/g,
  ];
  for (const pattern of patterns) {
    let m;
    while ((m = pattern.exec(text))) specs.add(m[1]);
  }
  return [...specs];
}

function addIssue(issues, severity, code, repoPath, detail, line = "", lineNumber = "") {
  issues.push({
    severity,
    code,
    path: repoPath,
    lineNumber,
    detail,
    line: line.length > 300 ? `${line.slice(0, 300)}...` : line,
  });
}

function lineScan(text, callback) {
  const lines = text.split(/\r?\n/);
  lines.forEach((line, idx) => callback(line, idx + 1));
}

function checkGovernanceFiles(config, issues) {
  for (const file of config.requiredGovernanceFiles || []) {
    const full = path.resolve(ROOT, file);
    if (!exists(full)) addIssue(issues, "error", "MISSING_REQUIRED_GOVERNANCE_FILE", file, "Required governance file is missing.");
  }

  for (const file of config.expectedGovernanceFiles || []) {
    const full = path.resolve(ROOT, file);
    if (!exists(full)) addIssue(issues, "warn", "MISSING_EXPECTED_GOVERNANCE_FILE", file, "Expected governance file is missing. This may be acceptable only during phased setup.");
  }
}

function checkPublicExports(repoPath, text, issues) {
  if (!repoPath.startsWith("packages/surfaces/src/public/")) return;

  const forbiddenPatterns = [
    /\bfunction\b/,
    /\bclass\b/,
    /\bconst\b/,
    /\blet\b/,
    /\bvar\b/,
    /\breturn\b/,
    /\bimport\s+/,
    /\bReact\b/,
    /\bStyleSheet\b/,
    /from\s+["'`].*\/src\//,
  ];

  const lines = text.split(/\r?\n/);
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*") || trimmed.endsWith("*/")) return;
    if (trimmed.startsWith("export ")) return;
    if (forbiddenPatterns.some((p) => p.test(trimmed))) {
      addIssue(issues, "error", "PUBLIC_SURFACE_EXPORT_HAS_LOGIC", repoPath, "packages/surfaces/src/public must remain export-only gateway.", trimmed, idx + 1);
    }
  });

  if (repoPath.endsWith("index.ts") && !/export\s+\*\s+as|export\s+\{/.test(text) && /export\s+\{\s*\}/.test(text)) {
    addIssue(issues, "warn", "PUBLIC_INDEX_EMPTY", repoPath, "public/index.ts is empty. This may be intentional, but verify public entry strategy.");
  }
}

function isAllowedSurfacesPublicImport(spec, config) {
  if (spec === "@bthwani/surfaces") return true;

  const allowed = config.allowedSurfacesPublicImports || [];
  return allowed.some((pattern) => regexMatch(spec, pattern));
}

function checkImports(repoPath, imports, issues, config) {
  const sourceArea =
    repoPath.startsWith("apps/") ? "apps" :
    repoPath.startsWith("packages/app-shells/") ? "app-shells" :
    repoPath.startsWith("packages/surfaces/") ? "surfaces" :
    repoPath.startsWith("packages/ui-kit/") ? "ui-kit" :
    "other";

  for (const spec of imports) {
    const isSurfaceInternal =
      spec.includes("packages/surfaces/src/") ||
      spec.includes("/service-owned/") ||
      spec.includes("/surface-owned/");

    if ((sourceArea === "apps" || sourceArea === "app-shells") && isSurfaceInternal) {
      addIssue(issues, "error", "APP_OR_SHELL_DEEP_SURFACES_IMPORT", repoPath, `apps/app-shells must consume surfaces public exports only. Import: ${spec}`);
    }

    if ((sourceArea === "apps" || sourceArea === "app-shells") && spec.startsWith("@bthwani/surfaces/") && !isAllowedSurfacesPublicImport(spec, config)) {
      addIssue(issues, "error", "APP_OR_SHELL_DEEP_SURFACES_IMPORT", repoPath, `apps/app-shells may import only approved @bthwani/surfaces public subpaths. Import: ${spec}`);
    }

    if (sourceArea === "apps" && spec.startsWith("../") && spec.includes("packages/")) {
      addIssue(issues, "error", "APP_RELATIVE_PACKAGE_IMPORT", repoPath, `apps must not relative-import package internals. Import: ${spec}`);
    }

    if (sourceArea === "ui-kit" && (
      spec.includes("/service-owned/") ||
      spec.includes("/surface-owned/") ||
      spec.startsWith("@bthwani/surfaces") ||
      spec.startsWith("@bthwani/app-shells")
    )) {
      addIssue(issues, "error", "UI_KIT_IMPORTS_SURFACE_OR_SHELL", repoPath, `ui-kit must not import surfaces/app-shells. Import: ${spec}`);
    }

    if (sourceArea === "surfaces" && spec.startsWith("@bthwani/ui-kit/")) {
      addIssue(issues, "warn", "DEEP_UI_KIT_IMPORT", repoPath, `Prefer @bthwani/ui-kit public exports. Import: ${spec}`);
    }
  }
}

function checkAppsShellOnly(repoPath, text, issues, config) {
  if (!repoPath.startsWith("apps/")) return;

  const configOrTestPath = /(?:^|\/)(app|package|project)\.json$|\.(spec|test)\.[^.]+$/.test(repoPath);
  if (configOrTestPath) return;

  const allowedAppPath = (config.allowedAppFiles || []).some((pattern) => regexMatch(repoPath, pattern));
  if (allowedAppPath) return;

  const productSignals = [
    /\bStyleSheet\.create\b/,
    /\bFlatList\b/,
    /\bSectionList\b/,
    /\bModal\b/,
    /\bVideo\b/,
    /\bScreen\b/,
    /\buseState\s*\(/,
    /\buseReducer\s*\(/,
    /\buseQuery\s*\(/,
    /\bfetch\s*\(/,
    /\baxios\b/,
    /#[0-9a-fA-F]{6}\b/,
  ];

  if (productSignals.some((p) => p.test(text))) {
    addIssue(issues, "warn", "APP_PRODUCT_CONTENT_CANDIDATE", repoPath, "apps should be shell/host only. This file appears to contain product UI/domain content.");
  }
}

function checkUiKit(repoPath, text, issues, config) {
  if (!repoPath.startsWith("packages/ui-kit/")) return;

  const domainRegex = /\b(dsh|amn|arb|knz|kwd|mrf|snd|wlt|esf|order|orders|store|stores|cart|checkout|captain|merchant|wallet)\b/i;
  lineScan(text, (line, lineNumber) => {
    if (domainRegex.test(line) && !/example|docs|README|comment/i.test(line)) {
      addIssue(issues, "warn", "UI_KIT_DOMAIN_CONTENT_CANDIDATE", repoPath, "ui-kit must not contain service/domain content.", line.trim(), lineNumber);
    }
  });
}

function checkSurfaceDesignSystem(repoPath, text, issues, config) {
  if (!repoPath.startsWith("packages/surfaces/")) return;

  const localDesignPatterns = [
    /\bcreateTamagui\b/,
    /\bTamaguiProvider\b/,
    /\btokens\s*[:=]/,
    /\bthemes\s*[:=]/,
    /\bcreateTokens\b/,
  ];

  if (localDesignPatterns.some((p) => p.test(text))) {
    addIssue(issues, "error", "SURFACE_LOCAL_DESIGN_SYSTEM", repoPath, "surfaces must not define local design system primitives/tokens/providers.");
  }
}

function checkLegacy(repoPath, text, issues, config) {
  const legacyRules = config.legacyRules || [];

  lineScan(text, (line, lineNumber) => {
    for (const rule of legacyRules) {
      const re = new RegExp(rule.pattern, rule.flags || "");
      if (!re.test(line)) continue;

      const allowByPath = matchPatterns(repoPath, rule.allowPathPatterns || []);
      const allowByLine = (rule.allowLinePatterns || []).some((p) => regexMatch(line, p));
      if (allowByPath || allowByLine) continue;

      let severity = rule.severity || "warn";
      if (matchPatterns(repoPath, rule.warnPathPatterns || [])) severity = "warn";

      addIssue(issues, severity, rule.code, repoPath, rule.detail, line.trim(), lineNumber);
    }
  });
}

function summarize(issues) {
  return {
    error: issues.filter((x) => x.severity === "error").length,
    warn: issues.filter((x) => x.severity === "warn").length,
    info: issues.filter((x) => x.severity === "info").length,
  };
}

function main() {
  if (!exists(configPath)) {
    console.error(`Missing config: ${configPath}`);
    process.exit(2);
  }

  const config = readJson(configPath);
  const sessionId = `GUARD_01_GOVERNANCE_BOUNDARIES-${nowStamp()}`;
  const evidenceRoot = path.resolve(ROOT, config.evidenceRoot || "tools/registry/runs", sessionId);
  ensureDir(evidenceRoot);

  const issues = [];
  const fileRows = [];

  checkGovernanceFiles(config, issues);

  const scanFiles = [];
  for (const root of config.scanRoots || []) {
    walk(path.resolve(ROOT, root), config, scanFiles);
  }

  for (const filePath of [...new Set(scanFiles)]) {
    const repoPath = rel(filePath);
    const text = readText(filePath);
    const imports = extractImports(text);

    fileRows.push({
      path: repoPath,
      bytes: fs.statSync(filePath).size,
      sha256: hashFile(filePath),
      importCount: imports.length,
    });

    checkPublicExports(repoPath, text, issues, config);
    checkImports(repoPath, imports, issues, config);
    checkAppsShellOnly(repoPath, text, issues, config);
    checkUiKit(repoPath, text, issues, config);
    checkSurfaceDesignSystem(repoPath, text, issues, config);
    checkLegacy(repoPath, text, issues, config);
  }

  const counts = summarize(issues);
  const decision = counts.error > 0 ? "FAIL" : counts.warn > 0 ? "PASS_WITH_WARNINGS" : "PASS";

  writeCsv(path.join(evidenceRoot, "scanned-files.csv"), fileRows);
  writeCsv(path.join(evidenceRoot, "issues.csv"), issues);
  writeFile(path.join(evidenceRoot, "issues.json"), `${JSON.stringify(issues, null, 2)}\n`);
  writeFile(path.join(evidenceRoot, "status.txt"), `${decision}\n`);

  const byCode = {};
  for (const issue of issues) {
    const key = `${issue.severity}:${issue.code}`;
    byCode[key] = (byCode[key] || 0) + 1;
  }

  const topCodes = Object.entries(byCode)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => `- ${count} — ${key}`)
    .join("\n") || "No issues.";

  const summary = `# GUARD-01 — Governance Boundaries Guard

**Decision:** ${decision}  
**EvidenceRoot:** ${toPosix(path.relative(ROOT, evidenceRoot))}  
**GuardVersion:** 1.1.0  

## Counts

| Severity | Count |
|---|---:|
| error | ${counts.error} |
| warn | ${counts.warn} |
| info | ${counts.info} |

## Scanned Files

${fileRows.length}

## Issue Codes

${topCodes}

## Top Issues

${issues.slice(0, 80).map((x) => `- **${x.severity} / ${x.code}** — \`${x.path}${x.lineNumber ? `:${x.lineNumber}` : ""}\` — ${x.detail}`).join("\n") || "No issues detected."}

## Rule

This guard is CHECK-only. It does not modify source files.
`;

  writeFile(path.join(evidenceRoot, "SUMMARY.md"), summary);

  const evidence = {
    issueCode: "GUARD_01_GOVERNANCE_BOUNDARIES",
    sessionId,
    evidenceRoot: toPosix(path.relative(ROOT, evidenceRoot)),
    configPath: rel(configPath),
    mode: "CHECK_ONLY",
    guardVersion: "1.1.0",
    decision,
    counts,
    scannedFileCount: fileRows.length,
    outputFiles: ["SUMMARY.md", "status.txt", "issues.csv", "issues.json", "scanned-files.csv"],
  };
  writeFile(path.join(evidenceRoot, "evidence.json"), `${JSON.stringify(evidence, null, 2)}\n`);

  console.log("");
  console.log("GUARD-01 Governance Boundaries Guard complete.");
  console.log(`Decision: ${decision}`);
  console.log(`EvidenceRoot: ${evidenceRoot}`);
  console.log(`Errors: ${counts.error}`);
  console.log(`Warnings: ${counts.warn}`);
  console.log("");
  console.log("Key outputs:");
  console.log(`- ${path.join(evidenceRoot, "SUMMARY.md")}`);
  console.log(`- ${path.join(evidenceRoot, "status.txt")}`);
  console.log(`- ${path.join(evidenceRoot, "issues.csv")}`);

  process.exit(decision === "FAIL" && config.failOnError ? 1 : 0);
}

main();
