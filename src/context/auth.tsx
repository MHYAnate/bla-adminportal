"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, setAuthToken, clearAuthTokens } from '@/lib/auth';
import { checkAuth } from '@/services/auth';

type AuthContextType = {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, remember?: boolean) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuthStatus = async () => {
            console.log('Checking authentication status...');

            // First check if token exists and is valid (client-side)
            const isValidLocally = checkAuth();

            if (isValidLocally) {
                // Optionally validate with server (uncomment if you have a check endpoint)
                // try {
                //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check`, {
                //         headers: {
                //             'Authorization': `Bearer ${getAuthToken()}`,
                //         },
                //     });
                //     
                //     if (response.ok) {
                //         setIsAuthenticated(true);
                //     } else {
                //         console.log('Server token validation failed');
                //         clearAuthTokens();
                //         setIsAuthenticated(false);
                //     }
                // } catch (error) {
                //     console.error('Token validation error:', error);
                //     // Don't clear token on network error, use local validation
                //     setIsAuthenticated(true);
                // }

                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }

            setIsLoading(false);
        };

        checkAuthStatus();
    }, []);

    const login = (token: string, remember = false) => {
        console.log('Login called with token:', !!token, 'remember:', remember);
        setAuthToken(token, remember);
        setIsAuthenticated(true);
        router.push('/admin');
    };

    const logout = () => {
        console.log('Logout called');
        clearAuthTokens();
        setIsAuthenticated(false);
        router.replace('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}