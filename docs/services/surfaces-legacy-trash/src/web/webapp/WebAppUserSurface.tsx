// WebAppUserSurface - Web app surface for end users
// Generated for BTH Surfaces Package - Phase 1
// Target: webapp
// Layout: header-based

import React from 'react';
import { Card, Button, Loading } from '@bthwani/ui-kit';

export interface WebAppUserSurfaceProps {
  children?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const WebAppUserSurface: React.FC<WebAppUserSurfaceProps> = ({
  children,
  loading = false,
  error = null,
  onRetry,
}) => {
  if (loading) {
    return (
      <div className='surface-loading'>
        <Loading size='lg' />
        <p>Loading webapp surface...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='surface-error'>
        <Card className='p-6'>
          <h3 className='text-lg font-semibold text-red-600 mb-2'>
            Error Loading Surface
          </h3>
          <p className='text-gray-600 mb-4'>{error}</p>
          {onRetry && (
            <Button onClick={onRetry} variant='primary'>
              Retry
            </Button>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className='surface-container webapp-surface header-based-layout'>
      <header className='surface-header'>
        <h1 className='surface-title'>Web app surface for end users</h1>
      </header>

      <main className='surface-content'>
        {children || (
          <div className='surface-placeholder'>
            <Card className='p-8 text-center'>
              <h2 className='text-xl font-semibold mb-4'>WebAppUserSurface</h2>
              <p className='text-gray-600 mb-4'>
                Surface for webapp with header-based layout
              </p>
              <div className='grid grid-cols-2 gap-4 mt-6'>
                <div className='p-4 border rounded'>home</div>{' '}
                <div className='p-4 border rounded'>search</div>{' '}
                <div className='p-4 border rounded'>orders</div>{' '}
                <div className='p-4 border rounded'>wallet</div>{' '}
                <div className='p-4 border rounded'>profile</div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default WebAppUserSurface;
