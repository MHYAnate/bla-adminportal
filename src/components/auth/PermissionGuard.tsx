"use client";

import React from 'react';
import { usePageProtection } from '@/hooks/usePageProtection';

type PermissionGuardProps = {
    children: React.ReactNode;
    requiredPermissions?: string[];
    requiredRoles?: string[];
    requireAll?: boolean;
    redirectTo?: string;
    allowSuperAdmin?: boolean;
    fallback?: React.ReactNode;
};

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
    children,
    requiredPermissions = [],
    requiredRoles = [],
    requireAll = false,
    redirectTo = '/admin/unauthorized',
    allowSuperAdmin = true,
    fallback = null
}) => {
    const { isAuthorized, isLoading } = usePageProtection({
        requiredPermissions,
        requiredRoles,
        requireAll,
        redirectTo,
        allowSuperAdmin
    });

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Show fallback or nothing if not authorized
    if (!isAuthorized) {
        return fallback ? <>{fallback}</> : null;
    }

    // Render children if authorized
    return <>{children}</>;
};
