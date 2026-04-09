'use client'

import React, { ReactNode } from 'react'
import { RBACGuard } from './RBACGuard'

interface RoleBasedRouteProps {
  children: ReactNode
  roles?: string[]
  surfaces?: string[]
  fallback?: ReactNode
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  roles,
  surfaces,
  fallback
}) => {
  return (
    <RBACGuard
      allowedRoles={roles}
      allowedSurfaces={surfaces}
      fallback={fallback}
    >
      {children}
    </RBACGuard>
  )
}
