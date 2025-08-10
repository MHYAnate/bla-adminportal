// Enhanced Debug component to check your admin status
// Add this temporarily to your admin page to see your current status

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import httpService from "@/services/httpService";

interface TestResponse {
    success: boolean;
    data?: any;
    error?: string;
    status?: number;
}

const DebugAdminStatus = () => {
    const [status, setStatus] = useState<any>(null);
    const [currentAdmin, setCurrentAdmin] = useState<any>(null);
    const [testResponse, setTestResponse] = useState<TestResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const checkStatus = async () => {
        setLoading(true);
        try {
            // Check admin status
            const statusResponse = await httpService.getData('admin/manage/status');
            console.log('🔍 Admin Status Response:', statusResponse);
            setStatus(statusResponse);

            // Get current admin details  
            const adminResponse = await httpService.getData('admin/manage/current');
            console.log('🔍 Current Admin Response:', adminResponse);
            setCurrentAdmin(adminResponse);

            // Test a Super Admin only endpoint to see what error we get
            try {
                const testSuperAdminResponse = await httpService.getData('admin/manage/system/validate');
                console.log('✅ Super Admin Test Success:', testSuperAdminResponse);
                setTestResponse({ success: true, data: testSuperAdminResponse });
            } catch (testError: unknown) {
                console.log('❌ Super Admin Test Failed:', testError);
                const err = testError as any;
                setTestResponse({
                    success: false,
                    error: err.response?.data?.error || err.message,
                    status: err.response?.status
                });
            }

        } catch (error: unknown) {
            console.error('❌ Error checking status:', error);
        } finally {
            setLoading(false);
        }
    };

    // Test the exact role update endpoint that's failing
    const testRoleUpdate = async () => {
        try {
            console.log('🧪 Testing role update endpoint...');

            // Try to call the roles endpoint with a dummy payload to see the exact error
            const response = await httpService.putData(
                { roleNames: ['ADMIN'] },
                'admin/manage/67/roles'
            );
            console.log('✅ Role update test success:', response);
            alert('Role update test succeeded!');
        } catch (error: unknown) {
            console.error('❌ Role update test failed:', error);
            const err = error as any;
            alert(`Role update failed: ${err.response?.data?.error || err.message}`);
        }
    };

    useEffect(() => {
        checkStatus();
    }, []);

    return (
        <Card className="w-full max-w-6xl mx-auto mb-4">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">🔍 Enhanced Admin Status Debug</h3>
                    <div className="flex gap-2">
                        <Button onClick={checkStatus} disabled={loading} size="sm">
                            {loading ? "Checking..." : "Refresh Status"}
                        </Button>
                        <Button onClick={testRoleUpdate} variant="outline" size="sm">
                            Test Role Update
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Admin Status */}
                    <div>
                        <h4 className="font-medium mb-2">1. Admin Status Check:</h4>
                        <div className="bg-gray-50 p-3 rounded text-sm">
                            {status ? (
                                <pre>{JSON.stringify(status, null, 2)}</pre>
                            ) : (
                                <p>Loading admin status...</p>
                            )}
                        </div>
                    </div>

                    {/* Super Admin Test */}
                    <div>
                        <h4 className="font-medium mb-2">2. Super Admin Endpoint Test:</h4>
                        <div className="bg-gray-50 p-3 rounded text-sm">
                            {testResponse ? (
                                <div>
                                    <p className={testResponse.success ? "text-green-600" : "text-red-600"}>
                                        {testResponse.success ? "✅ SUCCESS" : "❌ FAILED"}
                                    </p>
                                    <pre className="mt-2">{JSON.stringify(testResponse, null, 2)}</pre>
                                </div>
                            ) : (
                                <p>Running test...</p>
                            )}
                        </div>
                    </div>

                    {/* Current Admin Details */}
                    <div>
                        <h4 className="font-medium mb-2">3. Current Admin Details:</h4>
                        <div className="bg-gray-50 p-3 rounded text-sm max-h-96 overflow-y-auto">
                            {currentAdmin ? (
                                <pre>{JSON.stringify(currentAdmin, null, 2)}</pre>
                            ) : (
                                <p>Loading current admin...</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Detailed Analysis */}
                {status && currentAdmin && (
                    <div className="mt-6 p-4 bg-blue-50 rounded">
                        <h4 className="font-medium mb-2">🔍 Detailed Analysis:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <h5 className="font-medium mb-1">Status Endpoint Says:</h5>
                                <ul className="space-y-1">
                                    <li>Is Admin: <span className="font-mono">{status.isAdmin ? '✅ true' : '❌ false'}</span></li>
                                    <li>Is Super Admin: <span className="font-mono">{status.isSuperAdmin ? '✅ true' : '❌ false'}</span></li>
                                    <li>Roles: <span className="font-mono">{JSON.stringify(status.roles)}</span></li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-medium mb-1">Current Admin Endpoint Says:</h5>
                                <ul className="space-y-1">
                                    <li>Email: <span className="font-mono">{currentAdmin.email}</span></li>
                                    <li>User ID: <span className="font-mono">{currentAdmin.id}</span></li>
                                    <li>Roles Count: <span className="font-mono">{currentAdmin.roles?.length || 0}</span></li>
                                    <li>Admin Profile: <span className="font-mono">{currentAdmin.adminProfile?.username || 'None'}</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Backend Middleware Check */}
                <div className="mt-4 p-4 bg-yellow-50 rounded">
                    <h4 className="font-medium mb-2">🛠️ Backend Middleware Debug:</h4>
                    <p className="text-sm mb-2">The backend uses <code>superAdminAuth</code> middleware. Check these:</p>
                    <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li><strong>req.isSuperAdmin</strong> - This should be <code>true</code></li>
                        <li><strong>req.adminUser</strong> - Should contain your admin data</li>
                        <li><strong>req.user</strong> - Should contain your user data</li>
                        <li>Check server logs for middleware debug output</li>
                    </ol>
                </div>

                {/* Troubleshooting */}
                <div className="mt-4 p-4 bg-red-50 rounded">
                    <h4 className="font-medium mb-2">🚨 If Still Getting 403:</h4>
                    <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>Check your browser network tab for the exact request headers</li>
                        <li>Verify the Authorization header contains your token</li>
                        <li>Check server logs to see what <code>req.isSuperAdmin</code> returns</li>
                        <li>Ensure your token hasn't expired or been invalidated</li>
                        <li>Try logging out and logging back in</li>
                        <li>Check if the middleware is correctly identifying your Super Admin role</li>
                    </ol>
                </div>
            </CardContent>
        </Card>
    );
};

export default DebugAdminStatus;