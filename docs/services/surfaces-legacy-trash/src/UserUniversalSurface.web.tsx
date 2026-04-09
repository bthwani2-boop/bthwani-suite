// UserUniversalSurface.web.tsx - Web implementation
import React from 'react';
import { useI18n } from '@bthwani/ui-kit';

export interface UserUniversalSurfaceProps {
  children?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  navigation?: any;
  platform?: 'mobile' | 'web' | 'control panel';
  theme?: any;
}

export const UserUniversalSurface: React.FC<UserUniversalSurfaceProps> = ({
  children,
  loading = false,
  error = null,
  onRetry,
  navigation,
  platform = 'web',
  theme,
}) => {
  const { t } = useI18n();

  if (loading) {
    return (
      <div className='universal-surface-loading'>
        <div className='loading-spinner'>{t('common.loading')}</div>
        <p>{t('surfaces.universal_user.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='universal-surface-error'>
        <div className='error-card'>
          <h3 className='error-title'>
            {t('surfaces.universal_user.error_title')}
          </h3>
          <p className='error-message'>{error}</p>
          {onRetry && (
            <button onClick={onRetry} className='retry-button'>
              {t('common.retry')}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`universal-user-surface ${platform}-platform`}>
      {children || (
        <div className='surface-placeholder'>
          <div className='placeholder-card'>
            <h2 className='surface-title'>
              {t('surfaces.universal_user.title')}
            </h2>
            <p className='surface-description'>
              {t('surfaces.universal_user.description', { platform })}
            </p>
            <div className='nav-grid'>
              <div className='nav-item'>Home</div>
              <div className='nav-item'>Profile</div>
              <div className='nav-item'>Orders</div>
              <div className='nav-item'>Settings</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

