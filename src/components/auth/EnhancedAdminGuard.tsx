"use client";

import { useAuth } from '@/context/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface EnhancedAdminGuardProps {
    children: React.ReactNode;
    requireSuperAdmin?: boolean;
    redirectTo?: string;
}

// Helper function to safely extract role names
const getUserRoleNames = (userData: any): string[] => {
    if (!userData) return [];

    if (Array.isArray(userData.roles)) {
        return userData.roles.map((userRole: any) => {
            // Try nested structure first, then flat structure
            return userRole.role?.name || userRole.name || '';
        }).filter(Boolean);
    }

    // Check if userData has a single role field
    if (userData.role && typeof userData.role === 'string') {
        return [userData.role];
    }

    return [];
};

// Helper function to check if user is admin
const checkIsAdmin = (userData: any): boolean => {
    if (!userData) return false;

    // Check if user has adminProfile
    if (userData.adminProfile) return true;

    // Check if user has admin roles
    if (userData.isAdmin === true) return true;

    // Check role names
    const roleNames = getUserRoleNames(userData);
    const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'PRODUCT_MANAGER', 'ORDER_MANAGER', 'CUSTOMER_MANAGER', 'INVENTORY_MANAGER', 'SUPPORT_AGENT'];

    return roleNames.some(role =>
        adminRoles.includes(role.toUpperCase()) ||
        role.toUpperCase().includes('ADMIN') ||
        role.toUpperCase().includes('MANAGER')
    );
};

// Helper function to check if user is super admin
const checkIsSuperAdmin = (userData: any): boolean => {
    if (!userData) return false;

    // Check explicit super admin flag
    if (userData.isSuperAdmin === true) return true;

    // Check role names
    const roleNames = getUserRoleNames(userData);
    return roleNames.some(role =>
        role.toUpperCase() === 'SUPER_ADMIN' ||
        role.toUpperCase() === 'SUPERADMIN'
    );
};

const EnhancedAdminGuard: React.FC<EnhancedAdminGuardProps> = ({
    children,
    requireSuperAdmin = false,
    redirectTo = '/login'
}) => {
    const { userData, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [isValidating, setIsValidating] = useState(true);

    useEffect(() => {
        const validateAccess = () => {
            console.log('🔍 Admin Guard - Starting validation:', {
                isAuthenticated,
                isLoading,
                hasUserData: !!userData,
                userType: userData?.type,
                rolesCount: Array.isArray(userData?.roles) ? userData.roles.length : 0,
                hasAdminProfile: !!userData?.adminProfile,
                requireSuperAdmin
            });

            // Still loading auth state
            if (isLoading) {
                console.log('⏳ Auth still loading...');
                setIsValidating(true);
                return;
            }

            // Not authenticated - redirect to login
            if (!isAuthenticated) {
                console.log('❌ User not authenticated, redirecting to login');
                router.replace(redirectTo);
                return;
            }

            // No user data - redirect to login
            if (!userData) {
                console.log('❌ No user data available, redirecting to login');
                router.replace(redirectTo);
                return;
            }

            // Check if user is admin
            const isAdmin = checkIsAdmin(userData);
            if (!isAdmin) {
                console.log('❌ User is not an admin, redirecting');
                router.replace('/unauthorized');
                return;
            }

            // Check super admin requirement
            if (requireSuperAdmin) {
                const isSuperAdmin = checkIsSuperAdmin(userData);
                if (!isSuperAdmin) {
                    console.log('❌ Super admin required but user is not super admin');
                    router.replace('/unauthorized');
                    return;
                }
                console.log('✅ Super admin access validated successfully');
            } else {
                console.log('✅ Admin access validated successfully');
            }

            setIsValidating(false);
        };

        validateAccess();
    }, [isAuthenticated, isLoading, userData, requireSuperAdmin, router, redirectTo]);

    // Show loading while validating
    if (isLoading || isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Validating access...</p>
                </div>
            </div>
        );
    }

    // If we get here, user has valid access
    return <>{children}</>;
};

export default EnhancedAdminGuard;