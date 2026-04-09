'use client';

import React from 'react';
import { semanticRoles } from '@bthwani/ui-kit';

interface ConfirmDeleteModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDeleteModal({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDeleteModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: semanticRoles.overlay }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      <div
        className="w-full max-w-md rounded-xl border p-6 shadow-lg"
        style={{
          backgroundColor: semanticRoles.surface,
          borderColor: semanticRoles.border,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="confirm-delete-title"
          className="text-lg font-semibold"
          style={{ color: semanticRoles.text }}
        >
          {title}
        </h2>
        <p
          className="mt-2 text-sm"
          style={{ color: semanticRoles.textSecondary }}
        >
          {message}
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
            style={{
              borderColor: semanticRoles.border,
              color: semanticRoles.text,
              backgroundColor: semanticRoles.surface,
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-60"
            style={{ backgroundColor: semanticRoles.stateError?.text ?? '#EF4444' }}
          >
            {loading ? '...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
