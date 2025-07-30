"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isValid, setIsValid] = useState<boolean | null>(null);

    useEffect(() => {
        const token = getToken();

        if (!token) {
            router.replace('/login');
            return;
        }

        // Optional: Add token validation API call here if needed
        setIsValid(true);
    }, [router]);

    if (isValid === null) {
        return <div>Loading...</div>;
    }

    if (!isValid) {
        return null; // Already redirecting
    }

    return <>{children}</>;
}