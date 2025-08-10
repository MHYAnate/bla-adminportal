"use client";

import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';

type ConditionalRenderProps = {
    children: React.ReactNode;
    requiredPermissions?: string[];
    requiredRoles?: string[];
    requireAll?: boolean;
    allowSuperAdmin?: boolean;
    fallback?: React.ReactNode;
};

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
    children,
    requiredPermissions = [],
    requiredRoles = [],
    requireAll = false,
    allowSuperAdmin = true,
    fallback = null
}) => {
    const { hasPermission, hasRole, isSuperAdmin, isAuthenticated } = usePermissions();

    // Don't render anything if not authenticated
    if (!isAuthenticated) {
        return fallback ? <>{fallback}</> : null;
    }

    // Super admin bypass
    if (allowSuperAdmin && isSuperAdmin()) {
        return <>{children}</>;
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

    // Determine if should render
    const shouldRender = requireAll
        ? hasRequiredPermissions && hasRequiredRoles
        : hasRequiredPermissions || hasRequiredRoles;

    return shouldRender ? <>{children}</> : (fallback ? <>{fallback}</> : null);
};
