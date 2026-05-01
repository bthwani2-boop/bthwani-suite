import path from 'node:path';
import { parseArgs, createReport, finalize, walkFiles, readText, rel, CODE_EXTENSIONS, lineNumber } from './lib/guard-utils.mjs';

const args = parseArgs();
const report = createReport('API-BINDING-RUNTIME', 'governance/09_API_BINDING_RUNTIME.md');
const root = args.root;
const files = walkFiles(root, { startDirs: ['packages/surfaces/src/service-owned', 'apps'], extensions: CODE_EXTENSIONS });

const dataHints = /\b(fetch|axios|useQuery|apiClient|ApiClient|queryClient\.|serviceClient\.|httpClient\.|request\(|mutate\(|useMutation|subscribe\()/;
const stateHints = {
  loading: /\b(loading|isLoading|pending|isPending|skeleton)\b/i,
  error: /\b(error|isError|failed|onError)\b/i,
  empty: /\b(empty|isEmpty|noData|notFound)\b/i,
  success: /\b(success|data|items|result|completed)\b/i,
  retry: /\b(retry|refetch|reload|tryAgain)\b/i,
  offline: /\b(offline|network|connectivity|stale)\b/i,
};

for (const file of files) {
  const relative = rel(root, file);
  const name = path.basename(relative);
  if (!/Screen\.[tj]sx?$|screen\.[tj]sx?$|Page\.[tj]sx?$|page\.[tj]sx?$/.test(name)) continue;
  const text = readText(file);
  if (!dataHints.test(text)) continue;
  for (const [state, regex] of Object.entries(stateHints)) {
    if (!regex.test(text)) {
      report.warn(relative, `Data-bound screen appears to lack explicit ${state} state handling.`, 'heuristic screen-state check');
    }
  }
}

const contractFiles = walkFiles(root, { startDirs: ['contracts', 'packages/api-types', 'packages/surfaces/src/service-owned'], extensions: CODE_EXTENSIONS });
for (const file of contractFiles) {
  const relative = rel(root, file);
  if (!/(contract|schema|api-type|apiTypes)/i.test(relative)) continue;
  const text = readText(file);
  if (/request/i.test(text) && !/response/i.test(text)) {
    report.warn(relative, 'Contract-like file mentions request but not response. Verify request/response/error coverage.');
  }
  if (/response/i.test(text) && !/error/i.test(text)) {
    report.warn(relative, 'Contract-like file mentions response but not error schema. Verify error coverage.');
  }
}

finalize(report, args);
