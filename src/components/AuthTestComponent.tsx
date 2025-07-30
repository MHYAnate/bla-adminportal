"use client";

import React, { useState } from 'react';
import httpService from '@/services/httpService';
import { routes } from '@/services/api-routes';
import { getAuthToken } from '@/lib/auth';

export default function AuthTestComponent() {
    const [testResult, setTestResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const testAuthenticatedRequest = async () => {
        setLoading(true);
        setTestResult(null);

        try {
            console.log('Testing authenticated request...');

            // Check token first
            const token = getAuthToken();
            console.log('Token exists:', !!token);

            if (!token) {
                setTestResult('No token found - not logged in');
                setLoading(false);
                return;
            }

            // Test dashboard endpoint (or any authenticated endpoint you have)
            const response = await httpService.getData(routes.dashboard());
            console.log('Authenticated request successful:', response);
            setTestResult('✅ Authenticated request successful');

        } catch (error: any) {
            console.error('Authenticated request failed:', error);
            setTestResult(`❌ Failed: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
        }

        setLoading(false);
    };

    const checkTokenStatus = () => {
        const token = getAuthToken();
        console.log('=== TOKEN STATUS ===');
        console.log('Token exists:', !!token);
        console.log('Token value:', token ? `${token.substring(0, 20)}...` : 'None');
        console.log('Storage check:');
        console.log('- sessionStorage:', sessionStorage.getItem('auth_token') ? 'Found' : 'None');
        console.log('- localStorage:', localStorage.getItem('auth_token') ? 'Found' : 'None');
        console.log('===================');
    };

    return (
        <div className="p-4 border rounded m-4">
            <h3 className="font-bold mb-4">Authentication Test</h3>

            <div className="space-y-2">
                <button
                    onClick={checkTokenStatus}
                    className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                >
                    Check Token Status
                </button>

                <button
                    onClick={testAuthenticatedRequest}
                    disabled={loading}
                    className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
                >
                    {loading ? 'Testing...' : 'Test Authenticated Request'}
                </button>
            </div>

            {testResult && (
                <div className="mt-4 p-2 bg-gray-100 rounded">
                    <strong>Result:</strong> {testResult}
                </div>
            )}
        </div>
    );
}