'use client';

import React, { useState, useCallback, ReactNode } from 'react';
import { semanticRoles, BTHWANI_SPACING } from '@bthwani/ui-kit';
import { X, ChevronUp } from 'lucide-react';

export interface SmartPanelItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'success';
  isLoading?: boolean;
}

export interface SmartPanelProps {
  /**  Panel title */
  title: string;
  /**  List of action items */
  items: SmartPanelItem[];
  /** Panel subtitle or description */
  subtitle?: string;
  /** Whether the panel is open */
  isOpen?: boolean;
  /** Callback when panel requests to close */
  onClose?: () => void;
  /** Custom footer content */
  footerContent?: ReactNode;
  /** Whether to show a handle at the top */
  showHandle?: boolean;
}

/**
 * SmartPanel — Bottom drawer for quick decisions and advanced options
 * 
 * Features:
 * - Sticky bottom position
 * - Draggable handle (visual)
 * - Action items with icons
 * - Loading states
 * - Close button
 * 
 * Usage:
 * <SmartPanel
 *   title="Quick Actions"
 *   subtitle="Issue #1: Driver offline"
 *   items={[
 *     { id: '1', label: 'Reassign', onClick: () => {} },
 *     { id: '2', label: 'Contact Driver', onClick: () => {}, icon: <Phone /> },
 *   ]}
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 * />
 */
export const SmartPanel = ({
  title,
  items,
  subtitle,
  isOpen = false,
  onClose,
  footerContent,
  showHandle = true,
}: SmartPanelProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = useCallback((id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-200"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        onClick={onClose}
        role="presentation"
      />

      {/* Bottom Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl border border-t shadow-2xl transition-all duration-300"
        style={{
          backgroundColor: semanticRoles.surface,
          borderColor: semanticRoles.border,
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        {/* Handle Area */}
        {showHandle && (
          <div className="flex justify-center pt-3 pb-2">
            <div
              className="h-1 w-12 rounded-full"
              style={{ backgroundColor: semanticRoles.border }}
            />
          </div>
        )}

        {/* Header */}
        <div className="border-b px-6 py-4" style={{ borderColor: semanticRoles.border }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3
                className="text-lg font-semibold leading-snug"
                style={{ color: semanticRoles.text }}
              >
                {title}
              </h3>
              {subtitle && (
                <p
                  className="mt-1 text-sm line-clamp-2"
                  style={{ color: semanticRoles.textSecondary }}
                >
                  {subtitle}
                </p>
              )}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg transition-colors hover:bg-black/5"
                aria-label="Close panel"
              >
                <X className="h-5 w-5" style={{ color: semanticRoles.textMuted }} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="divide-y" style={{ borderColor: semanticRoles.border }}>
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                item.onClick();
                toggleItem(item.id);
              }}
              disabled={item.isLoading}
              className="w-full px-6 py-4 text-left transition-colors hover:bg-black/2 active:bg-black/5 disabled:opacity-50"
              style={{
                color:
                  item.variant === 'destructive'
                    ? semanticRoles.stateError.icon
                    : item.variant === 'success'
                      ? semanticRoles.stateSuccess.icon
                      : semanticRoles.text,
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {item.icon && (
                    <div className="shrink-0">
                      {item.icon}
                    </div>
                  )}
                  <span className="font-medium truncate">{item.label}</span>
                </div>
                {item.isLoading && (
                  <div className="shrink-0 h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        {footerContent && (
          <div className="border-t px-6 py-4" style={{ borderColor: semanticRoles.border }}>
            {footerContent}
          </div>
        )}

        {/* Safe Area Spacer */}
        <div className="h-safe" />
      </div>
    </>
  );
};

export default SmartPanel;
