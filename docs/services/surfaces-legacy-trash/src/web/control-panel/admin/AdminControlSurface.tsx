// AdminControlSurface - Admin control panel surface
// Generated for BTH Surfaces Package - Phase 1
// Target: admin
// Layout: sidebar-based

import React from 'react';
import { Card, Button, Loading } from '@bthwani/ui-kit';

export interface AdminControlSurfaceProps {
  children?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const AdminControlSurface: React.FC<AdminControlSurfaceProps> = ({
  children,
  loading = false,
  error = null,
  onRetry,
}) => {
  if (loading) {
    return (
      <div className='surface-loading'>
        <Loading size='lg' />
        <p>Loading admin surface...</p>
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
    <div className='surface-container admin-surface sidebar-based-layout'>
      <header className='surface-header'>
        <h1 className='surface-title'>Admin control panel surface</h1>
      </header>

      <main className='surface-content'>
        {children || (
          <div className='surface-placeholder'>
            <Card className='p-8 text-center'>
              <h2 className='text-xl font-semibold mb-4'>
                AdminControlSurface
              </h2>
              <p className='text-gray-600 mb-4'>
                Surface for admin with sidebar-based layout
              </p>
              <div className='grid grid-cols-2 gap-4 mt-6'>
                <div className='p-4 border rounded'>dashboard</div>{' '}
                <div className='p-4 border rounded'>orders</div>{' '}
                <div className='p-4 border rounded'>users</div>{' '}
                <div className='p-4 border rounded'>finance</div>{' '}
                <div className='p-4 border rounded'>support</div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminControlSurface;
