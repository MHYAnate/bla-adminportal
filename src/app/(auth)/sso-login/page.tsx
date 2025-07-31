'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function SSOLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const email = searchParams.get('email');
        const userId = searchParams.get('userId');
        const token = searchParams.get('token');
        const signature = searchParams.get('signature');
        const timestamp = searchParams.get('timestamp');

        // Check for all required parameters
        if (!email || !userId || !token || !signature || !timestamp) {
            router.replace('/login?error=Missing+required+SSO+parameters');
            return;
        }

        // Optionally store in localStorage, cookies, or context
        localStorage.setItem('email', email);
        localStorage.setItem('userId', userId);
        localStorage.setItem('token', token);

        // Redirect to /admin
        router.replace('/admin');
    }, [router, searchParams]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg text-gray-600">Processing SSO login...</p>
        </div>
    );
}
