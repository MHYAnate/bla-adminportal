// Create this component to test your frontend services: src/components/FrontendServiceTester.jsx

"use client";

import React, { useState } from "react";
import {
  useGetDashboardReports,
  useGetFinancialReports,
  useGetFinancialSummary,
  useFinancialDashboard,
  checkRouteAvailability,
} from "@/services/reports";
import {
  useGetDashboardInfo,
  useGetEnhancedDashboard,
  debugDashboardRoutes,
  validateDashboardData,
  formatDashboardMetrics,
} from "@/services/dashboard";

export default function FrontendServiceTester() {
  const [activeTest, setActiveTest] = useState("all");

  // Test all the services
  const dashboardReports = useGetDashboardReports({
    enabled: activeTest === "all" || activeTest === "dashboard-reports",
  });
  const financialReports = useGetFinancialReports({
    enabled: activeTest === "all" || activeTest === "financial-reports",
  });
  const financialSummary = useGetFinancialSummary({
    enabled: activeTest === "all" || activeTest === "financial-summary",
  });
  const dashboardInfo = useGetDashboardInfo({
    enabled: activeTest === "all" || activeTest === "dashboard-info",
  });
  const enhancedDashboard = useGetEnhancedDashboard({
    enabled: activeTest === "all" || activeTest === "enhanced-dashboard",
  });
  const unifiedDashboard = useFinancialDashboard({
    enabled: activeTest === "all" || activeTest === "unified",
  });

  const getServiceStatus = (service, name) => {
    if (service.isLoading || service.isDashboardInfoLoading)
      return {
        status: "loading",
        color: "bg-yellow-100 border-yellow-400",
        message: "Loading...",
      };
    if (service.error || service.dashboardError)
      return {
        status: "error",
        color: "bg-red-100 border-red-400",
        message:
          service.error?.message ||
          service.dashboardError?.message ||
          "Unknown error",
      };
    if (service.hasData || service.dashboardData || service.data)
      return {
        status: "success",
        color: "bg-green-100 border-green-400",
        message: "Success",
      };
    return {
      status: "no-data",
      color: "bg-gray-100 border-gray-400",
      message: "No data",
    };
  };

  const services = [
    {
      name: "Dashboard Reports",
      key: "dashboard-reports",
      service: dashboardReports,
      description: "useGetDashboardReports - Financial dashboard metrics",
    },
    {
      name: "Financial Reports",
      key: "financial-reports",
      service: financialReports,
      description: "useGetFinancialReports - Detailed financial data",
    },
    {
      name: "Financial Summary",
      key: "financial-summary",
      service: financialSummary,
      description: "useGetFinancialSummary - Quick financial overview",
    },
    {
      name: "Dashboard Info",
      key: "dashboard-info",
      service: dashboardInfo,
      description: "useGetDashboardInfo - Admin dashboard data",
    },
    {
      name: "Enhanced Dashboard",
      key: "enhanced-dashboard",
      service: enhancedDashboard,
      description: "useGetEnhancedDashboard - Combined admin + financial",
    },
    {
      name: "Unified Dashboard",
      key: "unified",
      service: unifiedDashboard,
      description: "useFinancialDashboard - All financial data combined",
    },
  ];

  const runDiagnostics = () => {
    console.log("🔍 Running Frontend Service Diagnostics...");

    // Check route availability
    const routeCheck = checkRouteAvailability();
    console.log("📍 Route Availability:", routeCheck);

    // Debug dashboard routes
    const routeDebug = debugDashboardRoutes();
    console.log("🛣️ Route Debug:", routeDebug);

    // Validate data structures
    services.forEach(({ name, service }) => {
      if (service.dashboardData) {
        const validation = validateDashboardData(service.dashboardData);
        console.log(`✅ ${name} Data Validation:`, validation);

        if (service.dashboardData.metrics) {
          const formatted = formatDashboardMetrics(
            service.dashboardData.metrics
          );
          console.log(`💰 ${name} Formatted Metrics:`, formatted);
        }
      }
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Frontend Service Tester</h2>
        <p className="text-gray-600">
          Test all frontend services to ensure they work with the backend
        </p>

        <div className="mt-4 space-x-2">
          <button
            onClick={() => setActiveTest("all")}
            className={`px-3 py-1 rounded text-sm ${
              activeTest === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Test All
          </button>
          {services.map(({ name, key }) => (
            <button
              key={key}
              onClick={() => setActiveTest(key)}
              className={`px-3 py-1 rounded text-sm ${
                activeTest === key ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {name}
            </button>
          ))}
          <button
            onClick={runDiagnostics}
            className="px-3 py-1 rounded text-sm bg-purple-500 text-white"
          >
            Run Diagnostics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(({ name, key, service, description }) => {
          const status = getServiceStatus(service, name);

          return (
            <div key={key} className={`p-4 border rounded-lg ${status.color}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{name}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    status.status === "success"
                      ? "bg-green-200 text-green-800"
                      : status.status === "loading"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {status.status.toUpperCase()}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">{description}</p>
              <p className="text-sm font-medium">{status.message}</p>

              {/* Show key data points */}
              {status.status === "success" && (
                <div className="mt-3 text-xs space-y-1">
                  {service.dashboardData?.metrics && (
                    <div>
                      <strong>Revenue:</strong> ₦
                      {(
                        service.dashboardData.metrics.revenue?.value ||
                        service.dashboardData.metrics.revenue?.currentMonth ||
                        0
                      ).toLocaleString()}
                    </div>
                  )}
                  {service.financialData && (
                    <div>
                      <strong>Net Revenue:</strong> ₦
                      {(
                        service.financialData.revenue?.netRevenue || 0
                      ).toLocaleString()}
                    </div>
                  )}
                  {service.totalSales && (
                    <div>
                      <strong>Total Sales:</strong> ₦
                      {service.totalSales.toLocaleString()}
                    </div>
                  )}
                  {service.data?.summary && (
                    <div>
                      <strong>Summary Revenue:</strong> ₦
                      {(
                        service.data.summary.revenue?.current || 0
                      ).toLocaleString()}
                    </div>
                  )}
                  {service.calculationMethod && (
                    <div>
                      <strong>Method:</strong> {service.calculationMethod}
                    </div>
                  )}
                </div>
              )}

              {/* Show error details */}
              {status.status === "error" && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-red-600 text-sm">
                    View Error Details
                  </summary>
                  <pre className="mt-2 p-2 bg-red-50 rounded text-xs overflow-auto max-h-32">
                    {JSON.stringify(
                      service.error || service.dashboardError,
                      null,
                      2
                    )}
                  </pre>
                </details>
              )}

              {/* Show data preview */}
              {status.status === "success" &&
                (service.dashboardData || service.data) && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-blue-600 text-sm">
                      View Data Preview
                    </summary>
                    <pre className="mt-2 p-2 bg-blue-50 rounded text-xs overflow-auto max-h-32">
                      {JSON.stringify(
                        service.dashboardData || service.data,
                        null,
                        2
                      )}
                    </pre>
                  </details>
                )}
            </div>
          );
        })}
      </div>

      {/* Summary Section */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold mb-2">Test Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium">✅ Successful</div>
            <div>
              {
                services.filter(
                  (s) => getServiceStatus(s.service).status === "success"
                ).length
              }
              /{services.length}
            </div>
          </div>
          <div>
            <div className="font-medium">⏳ Loading</div>
            <div>
              {
                services.filter(
                  (s) => getServiceStatus(s.service).status === "loading"
                ).length
              }
              /{services.length}
            </div>
          </div>
          <div>
            <div className="font-medium">❌ Errors</div>
            <div>
              {
                services.filter(
                  (s) => getServiceStatus(s.service).status === "error"
                ).length
              }
              /{services.length}
            </div>
          </div>
          <div>
            <div className="font-medium">📊 Has Data</div>
            <div>
              {
                services.filter(
                  (s) =>
                    s.service.hasData ||
                    s.service.dashboardData ||
                    s.service.data
                ).length
              }
              /{services.length}
            </div>
          </div>
        </div>
      </div>

      {/* Data Consistency Check */}
      {unifiedDashboard.allSuccessful && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-semibold mb-2">🎯 Data Consistency Check</h3>
          <div className="text-sm space-y-1">
            <div>
              <strong>Dashboard Revenue:</strong> ₦
              {(
                dashboardReports.dashboardData?.metrics?.revenue?.value || 0
              ).toLocaleString()}
            </div>
            <div>
              <strong>Financial Reports Revenue:</strong> ₦
              {(
                financialReports.financialData?.revenue?.netRevenue || 0
              ).toLocaleString()}
            </div>
            <div>
              <strong>Summary Revenue:</strong> ₦
              {(
                financialSummary.data?.summary?.revenue?.current || 0
              ).toLocaleString()}
            </div>
            <div className="mt-2 text-xs text-gray-600">
              All services should show consistent revenue numbers (accounting
              for refunds)
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-4 space-x-2">
        <button
          onClick={() => {
            services.forEach((s) => s.service.refetch?.());
            dashboardInfo.refetchDashboardData?.();
            enhancedDashboard.refetchDashboardData?.();
            unifiedDashboard.refreshAll?.();
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh All Services
        </button>

        <button
          onClick={() => {
            const report = {
              timestamp: new Date().toISOString(),
              services: services.map((s) => ({
                name: s.name,
                status: getServiceStatus(s.service).status,
                hasData: Boolean(
                  s.service.hasData || s.service.dashboardData || s.service.data
                ),
                error:
                  s.service.error?.message || s.service.dashboardError?.message,
              })),
              routes: checkRouteAvailability(),
              consistency: {
                dashboardRevenue:
                  dashboardReports.dashboardData?.metrics?.revenue?.value || 0,
                financialRevenue:
                  financialReports.financialData?.revenue?.netRevenue || 0,
                summaryRevenue:
                  financialSummary.data?.summary?.revenue?.current || 0,
              },
            };

            console.log("📋 Frontend Service Test Report:", report);

            // Copy to clipboard if available
            if (navigator.clipboard) {
              navigator.clipboard.writeText(JSON.stringify(report, null, 2));
              alert("Test report copied to clipboard!");
            }
          }}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
}
