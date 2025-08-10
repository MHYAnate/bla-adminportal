"use client";

import { usePermissions } from './usePermissions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type ProtectionConfig = {
  requiredPermissions?: string[];
  requiredRoles?: string[];
  requireAll?: boolean; // true = require ALL permissions/roles, false = require ANY
  redirectTo?: string;
  allowSuperAdmin?: boolean;
};

export const usePageProtection = (config: ProtectionConfig) => {
  const {
    requiredPermissions = [],
    requiredRoles = [],
    requireAll = false,
    redirectTo = '/admin/unauthorized',
    allowSuperAdmin = true
  } = config;

  const { hasPermission, hasRole, isSuperAdmin, isAuthenticated, userData } = usePermissions();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for authentication to be determined
    if (userData === undefined) {
      setIsLoading(true);
      return;
    }

    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      router.replace('/login');
      setIsAuthorized(false);
      setIsLoading(false);
      return;
    }

    // Super admin bypass
    if (allowSuperAdmin && isSuperAdmin()) {
      setIsAuthorized(true);
      setIsLoading(false);
      return;
    }

    // Check permissions
    let hasRequiredPermissions = true;
    if (requiredPermissions.length > 0) {
      if (requireAll) {
        hasRequiredPermissions = requiredPermissions.every(permission => 
          hasPermission(permission, 'read')
        );
      } else {
        hasRequiredPermissions = requiredPermissions.some(permission => 
          hasPermission(permission, 'read')
        );
      }
    }

    // Check roles
    let hasRequiredRoles = true;
    if (requiredRoles.length > 0) {
      if (requireAll) {
        hasRequiredRoles = requiredRoles.every(role => hasRole(role));
      } else {
        hasRequiredRoles = requiredRoles.some(role => hasRole(role));
      }
    }

    // Determine authorization
    const authorized = requireAll 
      ? hasRequiredPermissions && hasRequiredRoles
      : hasRequiredPermissions || hasRequiredRoles;

    if (!authorized) {
      router.replace(redirectTo);
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }

    setIsLoading(false);
  }, [
    userData,
    isAuthenticated,
    requiredPermissions,
    requiredRoles,
    requireAll,
    redirectTo,
    allowSuperAdmin,
    hasPermission,
    hasRole,
    isSuperAdmin,
    router
  ]);

  return { isAuthorized, isLoading };
};
