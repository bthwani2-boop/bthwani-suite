#!/usr/bin/env node
/**
 * BThwani GUARD-02 — Shared Folder Ownership Guard
 *
 * CHECK-only guard:
 * - scans shared folders and shared files
 * - classifies ownership
 * - counts import consumers
 * - identifies shared misuse risk
 * - writes evidence under tools/registry/runs
 * - creates _HANDOFF.zip when PowerShell Compress-Archive is available
 *
 * No external npm dependencies.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const DEFAULT_CONFIG = "tools/guards/guard-shared-folder-ownership.config.json";
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

function walkDirs(rootDir, config, output = []) {
  if (!exists(rootDir)) return output;
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(rootDir, entry.name);
    const repoPath = rel(full);
    if (shouldIgnore(repoPath, config)) continue;

    if (entry.isDirectory()) {
      output.push(full);
      walkDirs(full, config, output);
    }
  }
  return output;
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

function candidatePaths(basePath) {
  const candidates = [];
  const exts = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json"];

  candidates.push(basePath);

  for (const ext of exts) candidates.push(`${basePath}${ext}`);

  for (const ext of exts) {
    candidates.push(path.join(basePath, `index${ext}`));
  }

  return candidates;
}

function firstExisting(candidates) {
  for (const candidate of candidates) {
    if (exists(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

function resolvePackageImport(spec) {
  const mappings = [
    ["@bthwani/app-shells", "packages/app-shells"],
    ["@bthwani/surfaces", "packages/surfaces/src"],
    ["@bthwani/ui-kit", "packages/ui-kit/src"],
  ];

  for (const [prefix, target] of mappings) {
    if (spec === prefix) return firstExisting(candidatePaths(path.resolve(ROOT, target, "index")));
    if (spec.startsWith(`${prefix}/`)) {
      const subpath = spec.slice(prefix.length + 1);
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

function classifySharedFolder(repoPath) {
  const p = toPosix(repoPath);

  if (p.startsWith("apps/")) return "INVALID_APP_SHARED";
  if (p === "packages/app-shells/shared" || p.startsWith("packages/app-shells/shared/")) return "SHELL_SHARED";
  if (p === "packages/app-shells/mobile/shared" || p.startsWith("packages/app-shells/mobile/shared/")) return "MOBILE_SHELL_SHARED";
  if (p === "packages/app-shells/web/shared" || p.startsWith("packages/app-shells/web/shared/")) return "WEB_SHELL_SHARED";
  if (p.startsWith("packages/surfaces/src/service-owned/")) return "SERVICE_SHARED";
  if (p.startsWith("packages/surfaces/src/surface-owned/")) return "SURFACE_SHARED";
  if (p.startsWith("packages/ui-kit/")) return "UI_KIT_INTERNAL_SHARED";
  if (p.startsWith("packages/")) return "PACKAGE_SHARED_NEEDS_OWNER_DECISION";
  return "UNKNOWN_SHARED";
}

function addRisk(risks, severity, code, repoPath, detail, recommendation, lineNumber = "", line = "") {
  risks.push({
    severity,
    code,
    path: repoPath,
    lineNumber,
    detail,
    recommendation,
    line: line.length > 300 ? `${line.slice(0, 300)}...` : line,
  });
}

function lineScan(text, callback) {
  const lines = text.split(/\r?\n/);
  lines.forEach((line, idx) => callback(line, idx + 1));
}

function hasAnyTerm(text, terms) {
  const lower = text.toLowerCase();
  return terms.some((term) => lower.includes(term.toLowerCase()));
}

function folderFiles(folderPath, config) {
  return walkFiles(folderPath, config, []);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function createHandoffZip(evidenceRoot) {
  const script = `
$Root = "${evidenceRoot.replace(/"/g, '""')}"
$ZipPath = Join-Path $Root "_HANDOFF.zip"
if (Test-Path -LiteralPath $ZipPath) { Remove-Item -LiteralPath $ZipPath -Force }
$Items = Get-ChildItem -LiteralPath $Root -Force | Where-Object { $_.Name -ne "_HANDOFF.zip" }
if ($Items) { Compress-Archive -Path $Items.FullName -DestinationPath $ZipPath -Force }
`;
  try {
    execFileSync("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", script], { stdio: "ignore" });
    return path.join(evidenceRoot, "_HANDOFF.zip");
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
  if (counts.error > 0) return "BLOCKED_BY_INVALID_SHARED_STRUCTURE";
  if (counts.warn > 0) return "READY_FOR_SHARED_REVIEW_WITH_WARNINGS";
  return "PASS_SHARED_STRUCTURE_CLEAN";
}

function main() {
  if (!exists(configPath)) {
    console.error(`Missing config: ${configPath}`);
    process.exit(2);
  }

  const config = readJson(configPath);
  const sessionId = `GUARD_02_SHARED_FOLDER_OWNERSHIP-${nowStamp()}`;
  const evidenceRoot = path.resolve(ROOT, config.evidenceRoot || "tools/registry/runs", sessionId);
  ensureDir(evidenceRoot);

  const scanFiles = [];
  for (const root of config.scanRoots || []) {
    walkFiles(path.resolve(ROOT, root), config, scanFiles);
  }

  const scanDirs = [];
  for (const root of config.scanRoots || []) {
    walkDirs(path.resolve(ROOT, root), config, scanDirs);
  }

  const sharedFolders = scanDirs
    .map((dir) => ({ fullPath: dir, repoPath: rel(dir) }))
    .filter((x) => path.basename(x.fullPath).toLowerCase() === "shared");

  const importRecords = [];
  const consumerMap = new Map();

  for (const importer of scanFiles) {
    const importerRepo = rel(importer);
    const imports = extractImports(readText(importer));
    for (const spec of imports) {
      const resolved = resolveImport(importer, spec);
      const resolvedRepo = resolved ? rel(resolved) : "";
      importRecords.push({ importer: importerRepo, spec, resolved: resolvedRepo });
      if (resolvedRepo) {
        if (!consumerMap.has(resolvedRepo)) consumerMap.set(resolvedRepo, new Set());
        consumerMap.get(resolvedRepo).add(importerRepo);
      }
    }
  }

  const risks = [];
  const folderRows = [];
  const fileRows = [];
  const remediationRows = [];

  const domainTerms = config.domainTerms || [];
  const productTerms = config.productTerms || [];
  const surfaceGlobalTerms = config.surfaceGlobalTerms || [];
  const localDesignPatterns = config.localDesignPatterns || [];

  for (const folder of sharedFolders) {
    const classification = classifySharedFolder(folder.repoPath);
    const files = folderFiles(folder.fullPath, config);
    const relativeFiles = files.map(rel);

    let folderExternalConsumers = new Set();
    let domainRiskCount = 0;
    let productRiskCount = 0;

    if (classification === "INVALID_APP_SHARED") {
      addRisk(
        risks,
        "error",
        "INVALID_SHARED_FOLDER_IN_APPS",
        folder.repoPath,
        "apps must remain host/shell only and must not own shared product/infrastructure folders.",
        "Move app shared code later to app-shells, surfaces, or ui-kit after owner proof."
      );
    }

    if (files.length === 0) {
      addRisk(
        risks,
        "warn",
        "EMPTY_SHARED_FOLDER",
        folder.repoPath,
        "Shared folder has no scanned source files.",
        "Delete later only after zero-reference proof, or add owner/consumer documentation."
      );
    }

    for (const file of files) {
      const repoPath = rel(file);
      const text = readText(file);
      const consumerSet = new Set();

      for (const [resolvedRepo, importers] of consumerMap.entries()) {
        if (resolvedRepo === repoPath || resolvedRepo.startsWith(`${repoPath.replace(/\/index\.(ts|tsx|js|jsx|mjs|cjs|json)$/i, "")}/`)) {
          for (const importer of importers) consumerSet.add(importer);
        }
      }

      for (const importer of consumerSet) {
        if (!importer.startsWith(folder.repoPath + "/")) folderExternalConsumers.add(importer);
      }

      const externalConsumers = [...consumerSet].filter((x) => !x.startsWith(folder.repoPath + "/"));
      const internalConsumers = [...consumerSet].filter((x) => x.startsWith(folder.repoPath + "/"));

      const hasDomain = hasAnyTerm(text, domainTerms) || hasAnyTerm(repoPath, domainTerms);
      const hasProduct = hasAnyTerm(text, productTerms) || hasAnyTerm(repoPath, productTerms);
      const hasSurfaceGlobal = hasAnyTerm(text, surfaceGlobalTerms) || hasAnyTerm(repoPath, surfaceGlobalTerms);

      if (hasDomain) domainRiskCount += 1;
      if (hasProduct) productRiskCount += 1;

      if (externalConsumers.length === 0) {
        addRisk(
          risks,
          "warn",
          "ORPHAN_SHARED_FILE_CANDIDATE",
          repoPath,
          "Shared file has no external import consumers detected.",
          "Keep only with justification; otherwise move closer to its owner or remove later after zero-reference proof."
        );
      } else if (externalConsumers.length === 1) {
        addRisk(
          risks,
          "warn",
          "SINGLE_CONSUMER_SHARED_FILE_CANDIDATE",
          repoPath,
          "Shared file has only one external consumer detected.",
          "Move closer to its only consumer unless a planned second consumer is documented."
        );
      }

      if (classification.includes("SHELL") && (hasDomain || hasProduct)) {
        addRisk(
          risks,
          "error",
          "APP_SHELL_SHARED_PRODUCT_OR_DOMAIN_CONTENT",
          repoPath,
          "app-shells shared folders must not contain service/product content.",
          "Move later to surfaces service-owned/surface-owned or ui-kit based on ownership."
        );
      }

      if (classification === "SURFACE_SHARED" && hasDomain) {
        addRisk(
          risks,
          "warn",
          "SURFACE_SHARED_SERVICE_TERM_REVIEW",
          repoPath,
          "surface-owned shared file appears to mention service/domain terms.",
          "Confirm it is truly surface-global; otherwise move later to service-owned."
        );
      }

      if (classification === "SERVICE_SHARED" && hasSurfaceGlobal) {
        addRisk(
          risks,
          "warn",
          "SERVICE_SHARED_SURFACE_GLOBAL_TERM_REVIEW",
          repoPath,
          "service-owned shared file appears to mention surface-global terms.",
          "Confirm it is truly service-specific; otherwise move later to surface-owned."
        );
      }

      if (classification === "UI_KIT_INTERNAL_SHARED" && (hasDomain || hasProduct)) {
        addRisk(
          risks,
          "error",
          "UI_KIT_SHARED_DOMAIN_OR_PRODUCT_CONTENT",
          repoPath,
          "ui-kit shared code must remain domain-neutral and service-neutral.",
          "Move domain/product content later to surfaces."
        );
      }

      lineScan(text, (line, lineNumber) => {
        for (const pattern of localDesignPatterns) {
          if (regexMatch(line, pattern)) {
            const allowedUiKit = repoPath.startsWith("packages/ui-kit/");
            if (!allowedUiKit) {
              addRisk(
                risks,
                "error",
                "SHARED_LOCAL_DESIGN_SYSTEM_OUTSIDE_UI_KIT",
                repoPath,
                "Shared file appears to define local design-system primitives/tokens outside ui-kit.",
                "Move reusable design system logic to packages/ui-kit or consume ui-kit public exports.",
                lineNumber,
                line.trim()
              );
            }
          }
        }
      });

      let recommendedAction = "KEEP_WITH_JUSTIFICATION";
      let priority = "LOW";

      if (classification === "INVALID_APP_SHARED") {
        recommendedAction = "MOVE_LATER_TO_APP_SHELLS_OR_SURFACES_OR_UI_KIT";
        priority = "HIGH";
      } else if (classification.includes("SHELL") && (hasDomain || hasProduct)) {
        recommendedAction = "MOVE_LATER_TO_SURFACES_OR_UI_KIT";
        priority = "HIGH";
      } else if (externalConsumers.length === 0) {
        recommendedAction = "ORPHAN_CANDIDATE_REVIEW";
        priority = "MEDIUM";
      } else if (externalConsumers.length === 1) {
        recommendedAction = "MOVE_CLOSER_TO_ONLY_CONSUMER_OR_JUSTIFY";
        priority = "MEDIUM";
      } else if (classification === "SURFACE_SHARED" && hasDomain) {
        recommendedAction = "REVIEW_MOVE_TO_SERVICE_OWNED";
        priority = "MEDIUM";
      } else if (classification === "SERVICE_SHARED" && hasSurfaceGlobal) {
        recommendedAction = "REVIEW_MOVE_TO_SURFACE_OWNED";
        priority = "MEDIUM";
      }

      fileRows.push({
        path: repoPath,
        folder: folder.repoPath,
        classification,
        bytes: fs.statSync(file).size,
        sha256: hashFile(file),
        externalConsumerCount: externalConsumers.length,
        internalConsumerCount: internalConsumers.length,
        externalConsumers: externalConsumers.join(";"),
        internalConsumers: internalConsumers.join(";"),
        hasDomainTerms: hasDomain,
        hasProductTerms: hasProduct,
        hasSurfaceGlobalTerms: hasSurfaceGlobal,
        recommendedAction,
        priority,
      });

      remediationRows.push({
        path: repoPath,
        folder: folder.repoPath,
        classification,
        externalConsumerCount: externalConsumers.length,
        recommendedAction,
        priority,
        reason: `${classification}; externalConsumers=${externalConsumers.length}; hasDomain=${hasDomain}; hasProduct=${hasProduct}; hasSurfaceGlobal=${hasSurfaceGlobal}`,
      });
    }

    folderRows.push({
      folder: folder.repoPath,
      classification,
      fileCount: files.length,
      externalConsumerCount: folderExternalConsumers.size,
      externalConsumers: [...folderExternalConsumers].join(";"),
      domainRiskFileCount: domainRiskCount,
      productRiskFileCount: productRiskCount,
      decision: classification === "INVALID_APP_SHARED"
        ? "INVALID_SHARED"
        : files.length === 0
          ? "EMPTY_REVIEW"
          : folderExternalConsumers.size === 0
            ? "NO_EXTERNAL_CONSUMERS_REVIEW"
            : "REVIEW_WITH_EVIDENCE",
    });
  }

  const counts = summarize(risks);
  const decision = decisionFromCounts(counts);

  writeCsv(path.join(evidenceRoot, "shared-folders-inventory.csv"), folderRows);
  writeCsv(path.join(evidenceRoot, "shared-files-consumer-count.csv"), fileRows);
  writeCsv(path.join(evidenceRoot, "shared-risk-report.csv"), risks);
  writeCsv(path.join(evidenceRoot, "shared-remediation-queue.csv"), remediationRows);
  writeCsv(path.join(evidenceRoot, "import-resolution-report.csv"), importRecords);
  writeFile(path.join(evidenceRoot, "shared-risk-report.json"), `${JSON.stringify(risks, null, 2)}\n`);
  writeFile(path.join(evidenceRoot, "status.txt"), `${decision}\n`);

  const byCode = {};
  for (const risk of risks) {
    const key = `${risk.severity}:${risk.code}`;
    byCode[key] = (byCode[key] || 0) + 1;
  }

  const issueCodes = Object.entries(byCode)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => `- ${count} — ${key}`)
    .join("\n") || "No shared ownership risks detected.";

  const summary = `# GUARD-02 — Shared Folder Ownership Guard

**Decision:** ${decision}  
**EvidenceRoot:** ${toPosix(path.relative(ROOT, evidenceRoot))}  
**GuardVersion:** 1.0.0  

## Counts

| Type | Count |
|---|---:|
| shared folders | ${folderRows.length} |
| shared files | ${fileRows.length} |
| error risks | ${counts.error} |
| warning risks | ${counts.warn} |
| info risks | ${counts.info} |

## Risk Codes

${issueCodes}

## Output Files

- shared-folders-inventory.csv
- shared-files-consumer-count.csv
- shared-risk-report.csv
- shared-remediation-queue.csv
- import-resolution-report.csv
- shared-risk-report.json
- _HANDOFF.zip

## Rule

This guard is CHECK-only. It does not move, delete, rename, or refactor files.

Use the remediation queue to plan small fixes only after owner/consumer proof.
`;

  writeFile(path.join(evidenceRoot, "SUMMARY.md"), summary);

  const evidence = {
    issueCode: "GUARD_02_SHARED_FOLDER_OWNERSHIP",
    sessionId,
    evidenceRoot: toPosix(path.relative(ROOT, evidenceRoot)),
    configPath: rel(configPath),
    mode: "CHECK_ONLY",
    guardVersion: "1.0.0",
    decision,
    counts,
    sharedFolderCount: folderRows.length,
    sharedFileCount: fileRows.length,
    outputFiles: [
      "SUMMARY.md",
      "status.txt",
      "evidence.json",
      "shared-folders-inventory.csv",
      "shared-files-consumer-count.csv",
      "shared-risk-report.csv",
      "shared-remediation-queue.csv",
      "import-resolution-report.csv",
      "shared-risk-report.json",
      "_HANDOFF.zip",
    ],
  };
  writeFile(path.join(evidenceRoot, "evidence.json"), `${JSON.stringify(evidence, null, 2)}\n`);

  const zip = createHandoffZip(evidenceRoot);

  console.log("");
  console.log("GUARD-02 Shared Folder Ownership Guard complete.");
  console.log(`Decision: ${decision}`);
  console.log(`EvidenceRoot: ${evidenceRoot}`);
  console.log(`HandoffZip: ${zip || "ZIP_CREATE_SKIPPED"}`);
  console.log(`SharedFolders: ${folderRows.length}`);
  console.log(`SharedFiles: ${fileRows.length}`);
  console.log(`Errors: ${counts.error}`);
  console.log(`Warnings: ${counts.warn}`);
  console.log("");
  console.log("Key outputs:");
  console.log(`- ${path.join(evidenceRoot, "SUMMARY.md")}`);
  console.log(`- ${path.join(evidenceRoot, "status.txt")}`);
  console.log(`- ${path.join(evidenceRoot, "shared-risk-report.csv")}`);
  console.log(`- ${path.join(evidenceRoot, "_HANDOFF.zip")}`);

  process.exit(decision === "BLOCKED_BY_INVALID_SHARED_STRUCTURE" && config.failOnError ? 1 : 0);
}

main();
