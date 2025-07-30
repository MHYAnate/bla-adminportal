// components/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.replace('/login');
        } else {
            // Additional checks can go here
            setAuthChecked(true);
        }
    }, [router]);

    if (!authChecked) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
}