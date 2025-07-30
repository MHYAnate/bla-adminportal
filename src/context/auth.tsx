"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, setAuthToken, clearAuthTokens } from '@/lib/auth';

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
        const checkAuth = () => {
            const token = getAuthToken();
            console.log('Auth check - token exists:', !!token);
            setIsAuthenticated(!!token);
            setIsLoading(false);
        };

        checkAuth();
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