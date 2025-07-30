// components/APITest.tsx (temporary for testing)
"use client";

import React from 'react';
import { routes } from '@/services/api-routes';

export default function APITest() {
    const testAPI = async () => {
        const baseURL = process.env.NEXT_PUBLIC_API_URL;
        const loginRoute = routes.login();

        console.log('Testing API endpoint construction...');
        console.log('Base URL:', baseURL);
        console.log('Login route:', loginRoute);

        // Test different URL constructions
        const url1 = `${baseURL}/${loginRoute}`;
        const url2 = `${baseURL?.replace(/\/+$/, '')}/${loginRoute?.replace(/^\/+/, '')}`;

        console.log('URL method 1:', url1);
        console.log('URL method 2:', url2);

        // Test if the endpoint is reachable
        try {
            const response = await fetch(url2, {
                method: 'OPTIONS', // OPTIONS request to check if endpoint exists
            });
            console.log('Endpoint test response:', response.status);
        } catch (error) {
            console.error('Endpoint test error:', error);
        }
    };

    return (
        <div className="p-4 border rounded">
            <h3>API Test</h3>
            <button
                onClick={testAPI}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Test API Endpoint
            </button>
        </div>
    );
}