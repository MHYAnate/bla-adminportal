"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, setAuthToken, clearAuthTokens, checkAuth } from "@/lib/auth";
import httpService from "@/services/httpService";

// ✅ FIXED: Enhanced type definitions
type Permission = {
    id: number;
    name: string;
    description?: string;
    type?: 'read' | 'write';
};

type Role = {
    id: number;
    name: string;
    description?: string;
    permissions?: Permission[];
};

type UserRole = {
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

type UserData = {
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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);

    const router = useRouter();

    // ✅ FIXED: Fetch complete user profile from API with safe logging
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
                        // ✅ FIXED: Safe logging - only log serializable data
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
                                ['PRODUCT_MANAGER', 'INVENTORY_MANAGER', 'SUPER_ADMIN'].includes(role.role?.name || role.name)
                            )) {
                            userType = 'ADMIN';
                        }

                        return {
                            ...response.data,
                            type: userType,
                            isAdmin: userType === 'ADMIN'
                        };
                    } else if (response && !response.data && response.id) {
                        // Sometimes the response itself is the user data
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
                                ['PRODUCT_MANAGER', 'INVENTORY_MANAGER', 'SUPER_ADMIN'].includes(role.role?.name || role.name)
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

    // ✅ FIXED: Extract user data from login response with safe logging
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
                role.role?.name?.includes('ADMIN')
            )) {
                userType = 'ADMIN';
            } else if (userData.type) {
                userType = userData.type;
            }

            return {
                id: userData.id,
                email: userData.email,
                type: userType, // Set the type field
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

    // ✅ FIXED: Validate and set auth state with safe logging
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

    // FIXED: Better initial auth check
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

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                token,
                userData,
                login,
                logout,
                refreshAuth
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