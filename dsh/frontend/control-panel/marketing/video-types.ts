// Re-export from canonical location: dsh/frontend/shared/contracts/marketing/video-types.ts
export * from '../../shared/contracts/marketing/video-types';
// Backward compat — EditorWorkspaceTab was named EditorWorkspaceTab locally, now VideoEditorWorkspaceTab
export type { VideoEditorWorkspaceTab as EditorWorkspaceTab } from '../../shared/contracts/marketing/video-types';
