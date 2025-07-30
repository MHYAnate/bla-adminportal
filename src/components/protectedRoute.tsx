"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = getAuthToken();

            if (!token) {
                router.replace('/login');
                return;
            }

            // Optional: Verify token with backend
            // const isValid = await verifyToken(token);
            // if (!isValid) {
            //   clearAuthTokens();
            //   router.replace('/login');
            //   return;
            // }

            setIsAuthorized(true);
        };

        checkAuth();
    }, [router]);

    if (!isAuthorized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return <>{children}</>;
}