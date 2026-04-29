import fs from 'node:fs';
import path from 'node:path';
import { ROOT, gitLsFiles, readTextSafe, readJson, runGuard } from './_guard-common.mjs';

runGuard({
  guardId: 'GUARD-16_PACKAGE_EXPORTS_COMPLETENESS',
  guardName: 'Package Exports Completeness',
  prefix: 'GUARD_16_PACKAGE_EXPORTS_COMPLETENESS',
  configPath: 'tools/guards/guard-package-exports-completeness.config.json',
  collect: () => {
    const files = gitLsFiles();
    const packageJsons = files.filter((file) => /^packages\/[^/]+\/package\.json$/.test(file));
    const findings = [];
    for (const packageJson of packageJsons) {
      const pkgRoot = packageJson.replace('/package.json', '');
      const json = JSON.parse(readTextSafe(path.join(ROOT, packageJson)) || '{}');
      if (!json.exports) {
        findings.push({ type: 'PACKAGE_MISSING_EXPORTS_MAP', severity: 'warning', file: packageJson, package: json.name ?? pkgRoot, reason: 'Package has no exports map.' });
      }
      const packageFiles = files.filter((file) => file.startsWith(`${pkgRoot}/src/public/`) && /\.(ts|tsx)$/.test(file));
      for (const publicFile of packageFiles) {
        const exportText = JSON.stringify(json.exports ?? {});
        if (!exportText.includes(publicFile) && !exportText.includes(publicFile.replace(`${pkgRoot}/`, './'))) {
          findings.push({ type: 'PUBLIC_FILE_NOT_MAPPED_IN_PACKAGE_EXPORTS', severity: 'warning', file: publicFile, package: json.name ?? pkgRoot, reason: 'src/public file is not directly mapped in package.json exports.' });
        }
      }
    }
    return {
      findings,
      headers: ['type', 'severity', 'file', 'package', 'reason'],
      issueFileName: 'package-exports-completeness-findings.csv',
      baseCounts: { PackagesScanned: packageJsons.length },
      blockedDecision: 'BLOCKED_BY_PACKAGE_EXPORTS_COMPLETENESS',
      warningDecision: 'READY_FOR_PACKAGE_EXPORTS_REVIEW_WITH_WARNINGS',
      passDecision: 'PASS_PACKAGE_EXPORTS_COMPLETENESS_GUARD',
    };
  },
});
