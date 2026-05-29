# BTHWANI ROLLBACK PROTOCOL — V4

Rollback must be explicit per task.

## Single tracked file

```powershell
git restore -- "<FILE_PATH>"
```

## Multiple tracked files

```powershell
git restore -- "<FILE_1>" "<FILE_2>"
```

## Staged changes

```powershell
git restore --staged .
```

## Untracked files

```powershell
git ls-files --others --exclude-standard
```

Do not run `git clean -fd` unless the human explicitly approves after reviewing the untracked file list.

## Task package rollback field

Every task must include:

```text
Rollback files:
Rollback command:
Untracked rollback:
Rollback risk:
```


## V4 Rollback Completeness Gate

A task rollback is incomplete if any of these are missing:

```text
tracked files list
untracked files list
restore command
staged-change handling
manual cleanup warning
human approval needed for destructive cleanup
```

No task may claim ready if rollback is not explicit.
