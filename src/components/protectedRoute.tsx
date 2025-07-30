"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        console.log('ProtectedRoute - Auth state:', { isAuthenticated, isLoading });

        if (!isLoading && !isAuthenticated) {
            console.log('Redirecting to login - not authenticated');
            router.replace('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    // Show loading while auth is being determined
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // Don't render children if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}