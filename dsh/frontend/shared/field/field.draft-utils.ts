// Canonical location: dsh/frontend/shared/field/field.draft-utils.ts
// Authority: dsh/frontend/shared/field — local UI draft utilities for field screens.
// Keys produced here are LOCAL DRAFT PLACEHOLDERS only.
// They MUST NOT be used as backend entity identifiers or runtime media keys.
// Replace with an API-issued key before any backend submission.

let _draftKeyCounter = 0;

export function resolveFieldDocumentDraftMediaKey(kind: string): string {
  return `field.doc.${kind}.draft-${++_draftKeyCounter}`;
}
