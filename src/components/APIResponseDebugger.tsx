"use client";

import React, { useState } from 'react';
import httpService from '@/services/httpService';
import { routes } from '@/services/api-routes';

export default function APIResponseDebugger() {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [adminData, setAdminData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const testDashboardAPI = async () => {
        setLoading(true);
        try {
            console.log('Fetching dashboard data...');
            const response = await httpService.getData(routes.dashboard());
            console.log('Raw dashboard response:', response);
            console.log('Dashboard response type:', typeof response);
            console.log('Dashboard response keys:', Object.keys(response || {}));
            setDashboardData(response);
        } catch (error: any) {
            console.error('Dashboard API error:', error);
            setDashboardData({ error: error.message });
        }
        setLoading(false);
    };

    const testAdminAPI = async () => {
        setLoading(true);
        try {
            console.log('Fetching admin data...');
            const response = await httpService.getData(routes.admins({ pageNumber: 1, pageSize: 10 }));
            console.log('Raw admin response:', response);
            console.log('Admin response type:', typeof response);
            console.log('Admin response keys:', Object.keys(response || {}));
            setAdminData(response);
        } catch (error: any) {
            console.error('Admin API error:', error);
            setAdminData({ error: error.message });
        }
        setLoading(false);
    };

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold">API Response Debugger</h2>

            <div className="space-x-4">
                <button
                    onClick={testDashboardAPI}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                    Test Dashboard API
                </button>

                <button
                    onClick={testAdminAPI}
                    disabled={loading}
                    className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
                >
                    Test Admin API
                </button>
            </div>

            {dashboardData && (
                <div className="border p-4 rounded">
                    <h3 className="font-bold mb-2">Dashboard Data:</h3>
                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-96">
                        {JSON.stringify(dashboardData, null, 2)}
                    </pre>
                </div>
            )}

            {adminData && (
                <div className="border p-4 rounded">
                    <h3 className="font-bold mb-2">Admin Data:</h3>
                    <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-96">
                        {JSON.stringify(adminData, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}