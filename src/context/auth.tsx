"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, setAuthToken, clearAuthTokens, checkAuth } from "@/lib/auth";
import httpService from "@/services/httpService";

// ✅ Enhanced role change event system
const ROLE_CHANGE_EVENT = 'admin-role-changed';

// ✅ Enhanced function to emit role change events
export const emitRoleChangeEvent = (adminId: any, newRoles = []) => {
    console.log(`🔄 Emitting role change event for admin ${adminId}:`, {
        adminId,
        rolesCount: Array.isArray(newRoles) ? newRoles.length : 0,
        timestamp: Date.now()
    });

    window.dispatchEvent(new CustomEvent(ROLE_CHANGE_EVENT, {
        detail: {
            adminId: String(adminId),
            newRoles,
            timestamp: Date.now(),
            source: 'adminService'
        }
    }));
};

// ✅ Enhanced type definitions - EXPORTED for use in window types
export type Permission = {
    id: number;
    name: string;
    description?: string;
    type?: 'read' | 'write';
};

export type Role = {
    id: number;
    name: string;
    description?: string;
    permissions?: Permission[];
};

export type UserRole = {
    id: number;
    userId: number;
    roleId: number;
    createdAt: string;
    updatedAt: string;
    role: Role;
    // Flat structure for compatibility
    name?: string;
    description?: string;
    permissions?: Permission[];
};

export type UserData = {
    id: number;
    email: string;
    type: string;
    roles: UserRole[];
    isAdmin?: boolean;
    adminProfile?: any;
    requiresAddress?: boolean;
    hasAddress?: boolean;
    nextStep?: string;
    role?: string | Role; // Can be either string or object
    [key: string]: any;
};

type AuthContextType = {
    isAuthenticated: boolean;
    isLoading: boolean;
    token: string | null;
    userData: UserData | null;
    login: (token: string, remember?: boolean, loginResponse?: any) => Promise<void>;
    logout: () => void;
    refreshAuth: () => Promise<void>;
    forceRefreshUserData: () => Promise<void>;
    refreshTrigger: number;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const router = useRouter();

    // ✅ Enhanced: Fetch complete user profile from API with better error handling
    const fetchUserProfile = async (): Promise<UserData | null> => {
        try {
            console.log("📡 Fetching user profile from API...");

            let response;
            const endpoints = ['auth/profile', 'auth/me', 'user/profile', 'admin/manage/current'];

            for (const endpoint of endpoints) {
                try {
                    console.log(`🔄 Trying endpoint: ${endpoint}`);
                    response = await httpService.getData(endpoint);
                    if (response && (response.success !== false) && response.data) {
                        console.log(`✅ User profile fetched from ${endpoint}:`, {
                            id: response.data.id,
                            email: response.data.email,
                            type: response.data.type,
                            rolesCount: Array.isArray(response.data.roles) ? response.data.roles.length : 0,
                            hasAdminProfile: !!response.data.adminProfile,
                            isAdmin: response.data.isAdmin
                        });

                        // Determine user type for admin users
                        let userType = response.data.type || 'USER';

                        // Check if this is an admin user
                        if (response.data.adminProfile ||
                            response.data.roles?.some((role: any) =>
                                role.role?.type === 'ADMIN' ||
                                role.name?.includes('ADMIN') ||
                                role.role?.name?.includes('ADMIN') ||
                                ['PRODUCT_MANAGER', 'INVENTORY_MANAGER', 'SUPER_ADMIN', 'ORDER_MANAGER', 'CUSTOMER_MANAGER', 'SUPPORT_AGENT'].includes(role.role?.name || role.name)
                            )) {
                            userType = 'ADMIN';
                        }

                        return {
                            ...response.data,
                            type: userType,
                            isAdmin: userType === 'ADMIN'
                        };
                    } else if (response && !response.data && response.id) {
                        console.log(`✅ User profile fetched (direct data) from ${endpoint}:`, {
                            id: response.id,
                            email: response.email,
                            type: response.type,
                            rolesCount: Array.isArray(response.roles) ? response.roles.length : 0,
                            hasAdminProfile: !!response.adminProfile,
                            isAdmin: response.isAdmin
                        });

                        let userType = response.type || 'USER';
                        if (response.adminProfile ||
                            response.roles?.some((role: any) =>
                                role.role?.type === 'ADMIN' ||
                                role.name?.includes('ADMIN') ||
                                role.role?.name?.includes('ADMIN') ||
                                ['PRODUCT_MANAGER', 'INVENTORY_MANAGER', 'SUPER_ADMIN', 'ORDER_MANAGER', 'CUSTOMER_MANAGER', 'SUPPORT_AGENT'].includes(role.role?.name || role.name)
                            )) {
                            userType = 'ADMIN';
                        }

                        return {
                            ...response,
                            type: userType,
                            isAdmin: userType === 'ADMIN'
                        };
                    }
                } catch (endpointError: unknown) {
                    console.log(`❌ Endpoint ${endpoint} failed:`, (endpointError as any).response?.status);
                    continue;
                }
            }

            throw new Error('All profile endpoints failed');
        } catch (error) {
            console.error("❌ Failed to fetch user profile:", error);
            throw error;
        }
    };

    // ✅ Enhanced: Extract user data from login response
    const extractUserDataFromLoginResponse = (loginResponse: any): UserData | null => {
        try {
            if (!loginResponse) return null;

            // Check multiple possible locations for user data
            let userData = null;

            if (loginResponse.data?.user) {
                userData = loginResponse.data.user;
            } else if (loginResponse.user) {
                userData = loginResponse.user;
            } else if (loginResponse.data && !loginResponse.data.user) {
                userData = loginResponse.data;
            } else {
                userData = loginResponse;
            }

            if (!userData || !userData.email) return null;

            // Determine user type based on roles and adminProfile
            let userType = 'USER'; // default

            if (userData.adminProfile || userData.roles?.some((role: any) =>
                role.role?.type === 'ADMIN' ||
                role.name?.includes('ADMIN') ||
                role.role?.name?.includes('ADMIN') ||
                ['PRODUCT_MANAGER', 'INVENTORY_MANAGER', 'SUPER_ADMIN', 'ORDER_MANAGER', 'CUSTOMER_MANAGER', 'SUPPORT_AGENT'].includes(role.role?.name || role.name)
            )) {
                userType = 'ADMIN';
            } else if (userData.type) {
                userType = userData.type;
            }

            return {
                id: userData.id,
                email: userData.email,
                type: userType,
                fullName: userData.fullName || userData.adminProfile?.fullName || 'N/A',
                roles: userData.roles || [],
                isAdmin: userType === 'ADMIN',
                adminProfile: userData.adminProfile,
                ...userData
            };
        } catch (error) {
            console.error("❌ Error extracting user data from login response:", error);
            return null;
        }
    };

    // ✅ Enhanced: Force refresh function with comprehensive updates
    const forceRefreshUserData = async () => {
        console.log("🔄 Force refreshing user data...");
        setIsLoading(true);

        try {
            const currentToken = token || getAuthToken();
            if (currentToken && checkAuth()) {
                // Force fresh API call
                const profile = await fetchUserProfile();
                if (profile) {
                    setUserData(profile);
                    setRefreshTrigger(prev => prev + 1);
                    console.log("✅ User data force refreshed:", {
                        id: profile.id,
                        rolesCount: Array.isArray(profile.roles) ? profile.roles.length : 0,
                        isAdmin: profile.isAdmin,
                        refreshTrigger: refreshTrigger + 1
                    });
                }
            }
        } catch (error) {
            console.error("❌ Force refresh failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Enhanced: Validate and set auth state
    const setAuthState = async (authToken: string, loginResponse?: any) => {
        try {
            setIsLoading(true);
            console.log("🔐 Setting auth state with token...");

            let profile: UserData | null = null;

            // First, try to use user data from login response if available
            if (loginResponse) {
                profile = extractUserDataFromLoginResponse(loginResponse);
                if (profile) {
                    console.log("🎯 User data extracted from login response:", {
                        id: profile.id,
                        email: profile.email,
                        type: profile.type,
                        rolesCount: Array.isArray(profile.roles) ? profile.roles.length : 0,
                        isAdmin: profile.isAdmin
                    });
                }
            }

            // If no profile from login response, fetch from API
            if (!profile) {
                console.log("🔄 No user data in login response, fetching from API...");
                profile = await fetchUserProfile();
            }

            if (profile) {
                setToken(authToken);
                setUserData(profile);
                setIsAuthenticated(true);
                setRefreshTrigger(prev => prev + 1);
                console.log("✅ Auth state set successfully with user data:", {
                    id: profile.id,
                    email: profile.email,
                    type: profile.type,
                    rolesCount: Array.isArray(profile.roles) ? profile.roles.length : 0,
                    isAdmin: profile.isAdmin,
                    hasAdminProfile: !!profile.adminProfile
                });
            } else {
                throw new Error('Failed to get user profile');
            }
        } catch (error) {
            console.error("❌ Failed to set auth state:", error);
            // Clear everything on error
            clearAuthTokens();
            setToken(null);
            setUserData(null);
            setIsAuthenticated(false);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Enhanced: Listen for role change events with improved handling
    useEffect(() => {
        const handleRoleChange = async (event: CustomEvent) => {
            const { adminId, newRoles, timestamp, source } = event.detail;

            console.log("🔄 Auth context detected role change:", {
                adminId,
                currentUserId: userData?.id,
                rolesCount: Array.isArray(newRoles) ? newRoles.length : 0,
                timestamp,
                source
            });

            // Only refresh if the current user's role was changed
            if (userData && String(userData.id) === String(adminId)) {
                console.log("🔄 Current user's role changed, refreshing auth data...");

                // Add small delay to ensure backend processing is complete
                setTimeout(async () => {
                    try {
                        await forceRefreshUserData();
                        console.log("✅ Auth data refreshed after role change");
                    } catch (error) {
                        console.error("❌ Failed to refresh auth data after role change:", error);
                    }
                }, 150);
            }
        };

        window.addEventListener(ROLE_CHANGE_EVENT, handleRoleChange as unknown as EventListener);

        return () => {
            window.removeEventListener(ROLE_CHANGE_EVENT, handleRoleChange as unknown as EventListener);
        };
    }, [userData?.id]);

    // ✅ Enhanced: Initial auth check
    useEffect(() => {
        const checkAuthStatus = async () => {
            console.log("🔍 Checking authentication status...");
            setIsLoading(true);

            try {
                const localToken = getAuthToken();

                if (localToken) {
                    const valid = checkAuth();
                    if (valid) {
                        console.log("🎫 Valid token found, fetching profile...");
                        await setAuthState(localToken);
                    } else {
                        console.log("❌ Invalid token, clearing auth");
                        clearAuthTokens();
                        setIsAuthenticated(false);
                        setToken(null);
                        setUserData(null);
                    }
                } else {
                    console.log("🚫 No token found");
                    setIsAuthenticated(false);
                    setToken(null);
                    setUserData(null);
                }
            } catch (error) {
                console.error("❌ Auth check failed:", error);
                // Clear everything on error
                clearAuthTokens();
                setIsAuthenticated(false);
                setToken(null);
                setUserData(null);
            } finally {
                setIsLoading(false);
            }
        };

        // Small delay to ensure proper hydration
        const timer = setTimeout(checkAuthStatus, 100);
        return () => clearTimeout(timer);
    }, []);

    const login = async (newToken: string, remember = false, loginResponse?: any) => {
        console.log("🔐 Login called with token:", !!newToken, "remember:", remember, "has loginResponse:", !!loginResponse);

        try {
            // Store token first
            setAuthToken(newToken, remember);

            // Then fetch profile and set auth state
            await setAuthState(newToken, loginResponse);

            console.log("✅ Login completed successfully");

            // Navigate to admin dashboard
            router.push("/admin");
        } catch (error) {
            console.error("❌ Login failed:", error);
            clearAuthTokens();
            throw error;
        }
    };

    const logout = () => {
        console.log("🚪 Logout called");
        clearAuthTokens();
        setToken(null);
        setUserData(null);
        setIsAuthenticated(false);
        setRefreshTrigger(0);
        router.replace("/login");
    };

    const refreshAuth = async () => {
        console.log("🔄 Refreshing authentication...");
        const currentToken = token || getAuthToken();

        if (currentToken && checkAuth()) {
            try {
                await setAuthState(currentToken);
            } catch (error) {
                console.error("❌ Auth refresh failed:", error);
                logout();
            }
        } else {
            console.log("🚫 No valid token for refresh");
            logout();
        }
    };

    // ✅ Enhanced: Make auth context available for debugging (with proper typing)
    useEffect(() => {
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
            (window as any).auth = {
                userData,
                isAuthenticated,
                forceRefreshUserData,
                refreshTrigger
            };
        }
    }, [userData, isAuthenticated, refreshTrigger]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                token,
                userData,
                login,
                logout,
                refreshAuth,
                forceRefreshUserData,
                refreshTrigger
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}