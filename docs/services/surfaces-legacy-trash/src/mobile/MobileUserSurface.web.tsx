// MobileUserSurface.web.tsx - Web stub (RN shells use .native)
import React from 'react';

export interface MobileUserSurfaceProps {
  children?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const MobileUserSurface: React.FC<MobileUserSurfaceProps> = ({
  children,
  loading = false,
  error = null,
  onRetry,
}) => {
  return (
    <div data-surface="MobileUserSurface.web">
      {loading && <span>Loading...</span>}
      {error && <span>{error}</span>}
      {children}
    </div>
  );
};
