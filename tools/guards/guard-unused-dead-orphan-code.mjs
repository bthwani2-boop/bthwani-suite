#!/usr/bin/env node
/**
 * BThwani GUARD-03 — Unused / Dead / Orphan Code Guard
 *
 * CHECK-only guard:
 * - scans source files
 * - builds import/export consumer map
 * - identifies orphan files, orphan screens, unconsumed public exports, duplicate candidates
 * - creates remediation queues without deleting or modifying product code
 * - writes evidence under tools/registry/runs
 * - creates a session-named ZIP when PowerShell is available
 *
 * No external npm dependencies.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const DEFAULT_CONFIG = "tools/guards/guard-unused-dead-orphan-code.config.json";
const args = process.argv.slice(2);

const argValue = (name, fallback) => {
  const idx = args.indexOf(name);
  if (idx >= 0 && args[idx + 1]) return args[idx + 1];
  const prefixed = args.find((arg) => arg.startsWith(`${name}=`));
  if (prefixed) return prefixed.slice(name.length + 1);
  return fallback;
};

const configPath = path.resolve(ROOT, argValue("--config", DEFAULT_CONFIG));

function exists(filePath) {
  return fs.existsSync(filePath);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

function toPosix(value) {
  return value.replace(/\\/g, "/").replace(/^\/+/, "");
}

function rel(filePath) {
  return toPosix(path.relative(ROOT, filePath));
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function escapeCsv(value) {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function writeCsv(filePath, rows, defaultHeaders = ["empty"]) {
  const headers = rows.length ? Object.keys(rows[0]) : defaultHeaders;
  const lines = [
    headers.map(escapeCsv).join(","),
    ...rows.map((row) => headers.map((h) => escapeCsv(row[h])).join(",")),
  ];
  writeFile(filePath, `${lines.join("\n")}\n`);
}

function sha256(text) {
  const h = crypto.createHash("sha256");
  h.update(text);
  return h.digest("hex");
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

function shouldIgnore(repoPath, config) {
  const p = toPosix(repoPath);
  return (config.ignore || []).some((pattern) => regexMatch(p, pattern));
}

function allowedExtension(filePath, config) {
  const ext = path.extname(filePath);
  return (config.extensions || []).includes(ext);
}

function walkFiles(rootDir, config, output = []) {
  if (!exists(rootDir)) return output;
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(rootDir, entry.name);
    const repoPath = rel(full);
    if (shouldIgnore(repoPath, config)) continue;

    if (entry.isDirectory()) {
      walkFiles(full, config, output);
    } else if (entry.isFile() && allowedExtension(full, config)) {
      output.push(full);
    }
  }
  return output;
}

function candidatePaths(basePath) {
  const candidates = [];
  const exts = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json"];
  candidates.push(basePath);
  for (const ext of exts) candidates.push(`${basePath}${ext}`);
  for (const ext of exts) candidates.push(path.join(basePath, `index${ext}`));
  return candidates;
}

function firstExisting(candidates) {
  for (const candidate of candidates) {
    if (exists(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

function packageTargetFor(prefix) {
  const mappings = [
    ["@bthwani/surfaces", "packages/surfaces/src"],
    ["@bthwani/ui-kit", "packages/ui-kit/src"],
    ["@bthwani/dsh/backend", "dsh/backend/src"],
    ["@bthwani/wlt/backend", "wlt/backend/src"],
    ["@bthwani/knz/backend", "knz/backend/src"],
    ["@bthwani/arb/backend", "arb/backend/src"],
    ["@bthwani/amn/backend", "amn/backend/src"],
    ["@bthwani/esf/backend", "esf/backend/src"],
    ["@bthwani/mrf/backend", "mrf/backend/src"],
    ["@bthwani/snd/backend", "snd/backend/src"],
    ["@bthwani/kwd/backend", "kwd/backend/src"],
  ];
  return mappings.find(([p]) => p === prefix)?.[1] || "";
}

function resolvePackageImport(spec) {
  const packages = [
    "@bthwani/surfaces",
    "@bthwani/ui-kit",
    "@bthwani/dsh/backend",
    "@bthwani/wlt/backend",
    "@bthwani/knz/backend",
    "@bthwani/arb/backend",
    "@bthwani/amn/backend",
    "@bthwani/esf/backend",
    "@bthwani/mrf/backend",
    "@bthwani/snd/backend",
    "@bthwani/kwd/backend",
  ];

  for (const pkg of packages) {
    const target = packageTargetFor(pkg);
    if (!target) continue;

    if (spec === pkg) return firstExisting(candidatePaths(path.resolve(ROOT, target, "index")));

    if (spec.startsWith(`${pkg}/`)) {
      const subpath = spec.slice(pkg.length + 1);
      return firstExisting(candidatePaths(path.resolve(ROOT, target, subpath)));
    }
  }

  return null;
}

function resolveImport(importerFile, spec) {
  if (spec.startsWith(".")) {
    return firstExisting(candidatePaths(path.resolve(path.dirname(importerFile), spec)));
  }

  if (spec.startsWith("@bthwani/")) {
    return resolvePackageImport(spec);
  }

  return null;
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

function extractExports(text) {
  const exports = [];

  const namedDecl = /\bexport\s+(?:type\s+)?(?:const|let|var|function|class|interface|type|enum)\s+([A-Za-z0-9_$]+)/g;
  let m;
  while ((m = namedDecl.exec(text))) exports.push({ name: m[1], kind: "decl" });

  const namedList = /\bexport\s+(?:type\s+)?\{([^}]+)\}/g;
  while ((m = namedList.exec(text))) {
    const parts = m[1].split(",");
    for (const part of parts) {
      const clean = part.trim().split(/\s+as\s+/i).pop()?.trim();
      if (clean && !clean.includes(" from ")) exports.push({ name: clean, kind: "list" });
    }
  }

  if (/\bexport\s+default\b/.test(text)) exports.push({ name: "default", kind: "default" });
  if (/\bexport\s+\*/.test(text)) exports.push({ name: "*", kind: "star" });

  return exports;
}

function fileKind(repoPath, text) {
  const p = repoPath.toLowerCase();
  const base = path.basename(p);
  const stem = base.replace(/\.(tsx|ts|jsx|js|mjs|cjs|json|md)$/i, "");

  if (p.includes("/public/")) return "PUBLIC_EXPORT";
  if (base === "index.ts" || base === "index.tsx" || base === "index.js") return "BARREL";
  if (p.startsWith("apps/")) return "APP_FILE";
  if (/screen|page|view|workspace|surface|flow/.test(stem)) return "SCREEN_OR_SURFACE";
  if (/card|sheet|modal|drawer|dialog|list|item|row|header|banner|section/.test(stem)) return "UI_FRAGMENT";
  if (/fixture|mock|sample|demo|example|storybook|stories/.test(p)) return "FIXTURE_OR_DEMO";
  if (/config|\.config|tsconfig|project|package/.test(base)) return "CONFIG";
  if (/guard|script|tool/.test(p)) return "TOOLING";
  if (/\bReact\b|from ['"]react|from ['"]react-native|StyleSheet|View|Text|ScrollView/.test(text)) return "UI_CODE";
  return "SOURCE";
}

function isEntryFile(repoPath, config) {
  return (config.entryPathPatterns || []).some((pattern) => regexMatch(repoPath, pattern));
}

function isProtectedFile(repoPath, config) {
  return (config.protectedPathPatterns || []).some((pattern) => regexMatch(repoPath, pattern));
}

function hasDomainSignals(repoPath, text, config) {
  const hay = `${repoPath}\n${text}`.toLowerCase();
  return (config.domainTerms || []).some((term) => hay.includes(term.toLowerCase()));
}

function normalizedBody(text) {
  return text
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function addRisk(risks, severity, code, repoPath, detail, recommendation, evidence = "") {
  risks.push({
    severity,
    code,
    path: repoPath,
    detail,
    recommendation,
    evidence,
  });
}

function createHandoffZip(evidenceRoot) {
  const script = `
$Root = "${evidenceRoot.replace(/"/g, '""')}"
$ZipPath = Join-Path $Root ((Split-Path $Root -Leaf) + ".zip")
if (Test-Path -LiteralPath $ZipPath) { Remove-Item -LiteralPath $ZipPath -Force }
$Items = Get-ChildItem -LiteralPath $Root -Force | Where-Object { $_.Name -ne ((Split-Path $Root -Leaf) + ".zip") }
if ($Items) { Compress-Archive -Path $Items.FullName -DestinationPath $ZipPath -Force }
`;
  try {
    execFileSync("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", script], { stdio: "ignore" });
    return path.join(evidenceRoot, `${path.basename(evidenceRoot)}.zip`);
  } catch {
    return "";
  }
}

function summarize(risks) {
  return {
    error: risks.filter((x) => x.severity === "error").length,
    warn: risks.filter((x) => x.severity === "warn").length,
    info: risks.filter((x) => x.severity === "info").length,
  };
}

function decisionFromCounts(counts) {
  if (counts.error > 0) return "BLOCKED_BY_DEAD_CODE_HIGH_RISK";
  if (counts.warn > 0) return "READY_FOR_DEAD_CODE_REVIEW_WITH_WARNINGS";
  return "PASS_NO_UNUSED_OR_DEAD_CODE_RISKS";
}

function main() {
  if (!exists(configPath)) {
    console.error(`Missing config: ${configPath}`);
    process.exit(2);
  }

  const config = readJson(configPath);
  const sessionId = `GUARD_03_UNUSED_DEAD_ORPHAN_CODE-${nowStamp()}`;
  const evidenceRoot = path.resolve(ROOT, config.evidenceRoot || "tools/registry/runs", sessionId);
  ensureDir(evidenceRoot);

  const sourceFiles = [];
  for (const root of config.scanRoots || []) {
    walkFiles(path.resolve(ROOT, root), config, sourceFiles);
  }

  const allFileSet = new Set(sourceFiles.map(rel));
  const importRecords = [];
  const consumersByResolved = new Map();
  const unresolvedImports = [];

  for (const importer of sourceFiles) {
    const importerRepo = rel(importer);
    const specs = extractImports(readText(importer));
    for (const spec of specs) {
      const resolved = resolveImport(importer, spec);
      const resolvedRepo = resolved ? rel(resolved) : "";

      importRecords.push({ importer: importerRepo, spec, resolved: resolvedRepo });

      if (resolvedRepo) {
        if (!consumersByResolved.has(resolvedRepo)) consumersByResolved.set(resolvedRepo, new Set());
        consumersByResolved.get(resolvedRepo).add(importerRepo);
      } else if (spec.startsWith(".") || spec.startsWith("@bthwani/")) {
        unresolvedImports.push({ importer: importerRepo, spec, severity: "warn" });
      }
    }
  }

  const fileRows = [];
  const riskRows = [];
  const remediationRows = [];
  const exportsRows = [];
  const duplicateGroups = new Map();

  for (const file of sourceFiles) {
    const repoPath = rel(file);
    const text = readText(file);
    const kind = fileKind(repoPath, text);
    const isEntry = isEntryFile(repoPath, config);
    const isProtected = isProtectedFile(repoPath, config);
    const exports = extractExports(text);
    const consumers = [...(consumersByResolved.get(repoPath) || new Set())].filter((x) => x !== repoPath);
    const consumerCount = consumers.length;
    const domainSignals = hasDomainSignals(repoPath, text, config);
    const bodyHash = sha256(normalizedBody(text));
    const byteSize = fs.statSync(file).size;

    if (!duplicateGroups.has(bodyHash)) duplicateGroups.set(bodyHash, []);
    duplicateGroups.get(bodyHash).push(repoPath);

    const row = {
      path: repoPath,
      kind,
      bytes: byteSize,
      sha256: hashFile(file),
      normalizedBodyHash: bodyHash,
      importCount: extractImports(text).length,
      exportCount: exports.length,
      consumerCount,
      consumers: consumers.join(";"),
      isEntry,
      isProtected,
      hasDomainSignals: domainSignals,
      recommendedStatus: "KEEP_AS_IS",
      priority: "LOW",
    };

    if (!isEntry && !isProtected && consumerCount === 0) {
      if (kind === "SCREEN_OR_SURFACE" || kind === "UI_CODE" || kind === "UI_FRAGMENT") {
        row.recommendedStatus = "ORPHAN_SCREEN_OR_UI_REVIEW";
        row.priority = domainSignals ? "HIGH" : "MEDIUM";
        addRisk(
          riskRows,
          domainSignals ? "warn" : "warn",
          "ORPHAN_SCREEN_OR_UI_CANDIDATE",
          repoPath,
          "Source file has no detected import consumers and appears to be screen/UI/product code.",
          "Do not delete. Verify route/public export/runtime registration first, then decide move/merge/archive.",
          `kind=${kind}; consumerCount=${consumerCount}; domainSignals=${domainSignals}`
        );
      } else if (kind !== "BARREL" && kind !== "PUBLIC_EXPORT" && kind !== "CONFIG" && kind !== "TOOLING") {
        row.recommendedStatus = "ORPHAN_SOURCE_REVIEW";
        row.priority = "MEDIUM";
        addRisk(
          riskRows,
          "warn",
          "ORPHAN_SOURCE_FILE_CANDIDATE",
          repoPath,
          "Source file has no detected import consumers.",
          "Do not delete. Verify dynamic usage and package exports before action.",
          `kind=${kind}; consumerCount=${consumerCount}`
        );
      }
    }

    if (kind === "PUBLIC_EXPORT" && consumerCount === 0 && !repoPath.endsWith("index.ts")) {
      row.recommendedStatus = "PUBLIC_EXPORT_WITH_NO_DIRECT_CONSUMERS_REVIEW";
      row.priority = "MEDIUM";
      addRisk(
        riskRows,
        "warn",
        "PUBLIC_EXPORT_NO_DIRECT_CONSUMERS",
        repoPath,
        "Public export file has no direct import consumers detected.",
        "Confirm package subpath export usage, app-shell usage, and runtime entry before pruning.",
        `consumerCount=${consumerCount}`
      );
    }

    if (exports.length > 0) {
      for (const exp of exports) {
        exportsRows.push({
          file: repoPath,
          exportName: exp.name,
          exportKind: exp.kind,
          fileConsumerCount: consumerCount,
          fileConsumers: consumers.join(";"),
          needsReview: consumerCount === 0 && !isEntry && !isProtected,
        });
      }
    }

    fileRows.push(row);
  }

  for (const [hash, paths] of duplicateGroups.entries()) {
    const realPaths = paths.filter((p) => {
      const full = path.resolve(ROOT, p);
      return exists(full) && fs.statSync(full).size > (config.minDuplicateBytes || 200);
    });

    if (realPaths.length > 1) {
      for (const p of realPaths) {
        addRisk(
          riskRows,
          "warn",
          "DUPLICATE_BODY_CANDIDATE",
          p,
          "File has identical normalized body hash with another source file.",
          "Review for merge only after owner/consumer proof; do not delete automatically.",
          `duplicates=${realPaths.join(";")}`
        );
      }
    }
  }

  for (const imp of unresolvedImports) {
    addRisk(
      riskRows,
      imp.severity,
      "UNRESOLVED_INTERNAL_IMPORT_REVIEW",
      imp.importer,
      `Import could not be resolved by GUARD-03 resolver: ${imp.spec}`,
      "Verify alias/export config. If valid dynamic tooling import, allowlist later; otherwise fix import.",
      `spec=${imp.spec}`
    );
  }

  for (const row of fileRows) {
    if (row.recommendedStatus !== "KEEP_AS_IS") {
      remediationRows.push({
        path: row.path,
        kind: row.kind,
        consumerCount: row.consumerCount,
        recommendedStatus: row.recommendedStatus,
        priority: row.priority,
        requiredProof: "consumer map + public export proof + route/runtime proof + tsc + guards + rollback path",
        safeAction: "REVIEW_ONLY_NO_DELETE",
      });
    }
  }

  const counts = summarize(riskRows);
  const decision = decisionFromCounts(counts);

  writeCsv(path.join(evidenceRoot, "source-files-inventory.csv"), fileRows);
  writeCsv(path.join(evidenceRoot, "imports-consumer-map.csv"), importRecords);
  writeCsv(path.join(evidenceRoot, "exports-consumer-map.csv"), exportsRows);
  writeCsv(path.join(evidenceRoot, "unused-orphan-risk-report.csv"), riskRows);
  writeCsv(path.join(evidenceRoot, "dead-code-remediation-queue.csv"), remediationRows);
  writeCsv(path.join(evidenceRoot, "unresolved-imports-report.csv"), unresolvedImports);
  writeFile(path.join(evidenceRoot, "unused-orphan-risk-report.json"), `${JSON.stringify(riskRows, null, 2)}\n`);
  writeFile(path.join(evidenceRoot, "status.txt"), `${decision}\n`);

  const byCode = {};
  for (const risk of riskRows) {
    const key = `${risk.severity}:${risk.code}`;
    byCode[key] = (byCode[key] || 0) + 1;
  }

  const riskCodes = Object.entries(byCode)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => `- ${count} — ${key}`)
    .join("\n") || "No unused/dead/orphan risks detected.";

  const summary = `# GUARD-03 — Unused / Dead / Orphan Code Guard

**Decision:** ${decision}
**EvidenceRoot:** ${toPosix(path.relative(ROOT, evidenceRoot))}
**GuardVersion:** 1.0.0

## Counts

| Type | Count |
|---|---:|
| scanned source files | ${fileRows.length} |
| import records | ${importRecords.length} |
| export records | ${exportsRows.length} |
| remediation queue items | ${remediationRows.length} |
| error risks | ${counts.error} |
| warning risks | ${counts.warn} |
| info risks | ${counts.info} |

## Risk Codes

${riskCodes}

## Output Files

- source-files-inventory.csv
- imports-consumer-map.csv
- exports-consumer-map.csv
- unused-orphan-risk-report.csv
- dead-code-remediation-queue.csv
- unresolved-imports-report.csv
- unused-orphan-risk-report.json
- {SESSION_ID}.zip

## Rule

This guard is CHECK-only. It does not move, delete, rename, or refactor files.

No file may be deleted from this report without zero-reference proof, runtime/route proof, owner decision, rollback path, diff-check PASS, tsc PASS, GUARD-01 PASS, GUARD-02 PASS, and GUARD-03 re-run.
`;

  writeFile(path.join(evidenceRoot, "SUMMARY.md"), summary);

  const evidence = {
    issueCode: "GUARD_03_UNUSED_DEAD_ORPHAN_CODE",
    sessionId,
    evidenceRoot: toPosix(path.relative(ROOT, evidenceRoot)),
    configPath: rel(configPath),
    mode: "CHECK_ONLY",
    guardVersion: "1.0.0",
    decision,
    counts,
    sourceFileCount: fileRows.length,
    importRecordCount: importRecords.length,
    exportRecordCount: exportsRows.length,
    remediationQueueCount: remediationRows.length,
    outputFiles: [
      "SUMMARY.md",
      "status.txt",
      "evidence.json",
      "source-files-inventory.csv",
      "imports-consumer-map.csv",
      "exports-consumer-map.csv",
      "unused-orphan-risk-report.csv",
      "dead-code-remediation-queue.csv",
      "unresolved-imports-report.csv",
      "unused-orphan-risk-report.json",
      `${path.basename(evidenceRoot)}.zip`,
    ],
  };
  writeFile(path.join(evidenceRoot, "evidence.json"), `${JSON.stringify(evidence, null, 2)}\n`);

  const zip = createHandoffZip(evidenceRoot);

  console.log("");
  console.log("GUARD-03 Unused / Dead / Orphan Code Guard complete.");
  console.log(`Decision: ${decision}`);
  console.log(`EvidenceRoot: ${evidenceRoot}`);
  console.log(`HandoffZip: ${zip || "ZIP_CREATE_SKIPPED"}`);
  console.log(`SourceFiles: ${fileRows.length}`);
  console.log(`RemediationQueue: ${remediationRows.length}`);
  console.log(`Errors: ${counts.error}`);
  console.log(`Warnings: ${counts.warn}`);
  console.log("");
  console.log("Key outputs:");
  console.log(`- ${path.join(evidenceRoot, "SUMMARY.md")}`);
  console.log(`- ${path.join(evidenceRoot, "status.txt")}`);
  console.log(`- ${path.join(evidenceRoot, "dead-code-remediation-queue.csv")}`);
  console.log(`- ${path.join(evidenceRoot, `${path.basename(evidenceRoot)}.zip`)}`);

  process.exit(decision === "BLOCKED_BY_DEAD_CODE_HIGH_RISK" && config.failOnError ? 1 : 0);
}

main();
