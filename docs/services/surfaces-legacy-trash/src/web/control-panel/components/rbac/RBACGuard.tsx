'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '@bthwani/states';

interface RBACGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
  allowedSurfaces?: string[];
  fallback?: ReactNode;
}

export const RBACGuard: React.FC<RBACGuardProps> = ({
  children,
  allowedRoles = [],
  allowedSurfaces = [],
  fallback = null,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='flex justify-center items-center p-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      fallback || (
        <div className='flex flex-col items-center justify-center p-8 text-center'>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            Access Denied
          </h3>
          <p className='text-gray-600'>
            You must be logged in to access this resource.
          </p>
        </div>
      )
    );
  }

  // Check role permissions
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      fallback || (
        <div className='flex flex-col items-center justify-center p-8 text-center'>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            Insufficient Permissions
          </h3>
          <p className='text-gray-600'>
            Your role does not have access to this resource.
          </p>
        </div>
      )
    );
  }

  // Check surface permissions
  if (allowedSurfaces.length > 0 && !allowedSurfaces.includes(user.surface)) {
    return (
      fallback || (
        <div className='flex flex-col items-center justify-center p-8 text-center'>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            Surface Access Denied
          </h3>
          <p className='text-gray-600'>
            You do not have access to this surface.
          </p>
        </div>
      )
    );
  }

  return <>{children}</>;
};
