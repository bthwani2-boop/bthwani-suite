# BTHWANI EVIDENCE STANDARD — V4

Required evidence after package check or execution.

## Package Check Evidence

- SUMMARY.txt
- evidence.json
- commands.log
- git-branch.txt
- git-head.txt
- git-status.txt
- git-status-sb.txt
- git-untracked.txt
- package-file-list.txt
- sha256-verification.txt
- section-verification.txt
- contradiction-check.txt
- manifest-check.txt
- generated handoff zip named `{SESSION_ID}.zip`

## Local Change Evidence

- git-status-before.txt
- git-status-after.txt
- git-diff-stat.txt
- git-diff-name-status.txt
- git-diff-check.txt
- git-untracked.txt
- staged diff files when staged changes exist
- LOCAL_CHANGE_REVIEW.patch
- UNTRACKED_FILE_REVIEW.patch where needed
- verification outputs
- screenshots only when the visual evidence gate requires them


## V4 Required Evidence Status Fields

```text
PACKAGE_RECHECK_STATUS:
PACKAGE_RECHECK_VERSION:
EVIDENCE_ZIP:
LEGACY_PACKAGE_FILES:
UNTRACKED_FILES_CLASSIFIED:
ROLLBACK_READY:
```
