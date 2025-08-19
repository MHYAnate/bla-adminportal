// src/app/(admin)/admin/create-role/components/permissions-section.tsx
import React from "react";

interface Permission {
    id: number;
    name: string;
    description: string;
    category: string;
}

interface PermissionsSectionProps {
    groupedPermissions: Record<string, Permission[]>;
    selectedPermissionIds: Set<number>;
    onPermissionChange: (permissionId: number) => void;
    isLoading?: boolean;
    disabled?: boolean;
}

export const PermissionsSection: React.FC<PermissionsSectionProps> = ({
    groupedPermissions,
    selectedPermissionIds,
    onPermissionChange,
    isLoading = false,
    disabled = false
}) => {
    const formatPermissionName = (name: string) => {
        return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatPermissionDescription = (permission: Permission) => {
        // Map permission names to descriptions that match your UI
        const descriptionMap: Record<string, string> = {
            "view_orders": "Allows the user to view all orders, including order details, status, and customer information.",
            "inventory_management": "Track, update, and manage stock levels efficiently to ensure seamless operations.",
            "order_management": "Oversee order processing, fulfillment, and status updates for smooth transactions.",
            "reports_analytics": "Access detailed insights and generate reports to drive data-informed decisions.",
            "financial_operations": "Manage transactions, invoices, and financial records with accuracy and compliance."
        };

        return descriptionMap[permission.name] || permission.description || `Allows the user to view all orders, including order details, status, and customer information.`;
    };

    const isPermissionSelected = (permissionId: number) => {
        return selectedPermissionIds.has(permissionId);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <p className="text-gray-600">Loading permissions...</p>
            </div>
        );
    }

    if (Object.keys(groupedPermissions).length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>No permissions available</p>
            </div>
        );
    }

    if (disabled) {
        return (
            <div className="space-y-8">
                <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-500 mb-2">Complete Role Details First</h3>
                    <p className="text-sm text-gray-400">Please fill in the role name and description before configuring permissions.</p>
                </div>
            </div>
        );
    }

    // Helper function to get category display name
    const getCategoryDisplayName = (category: string) => {
        const categoryMap: Record<string, string> = {
            'admin': 'Admin Access',
            'manager': 'Manager Access',
            'general': 'General Access',
            'user': 'User Management',
            'product': 'Product Management',
            'order': 'Order Management',
            'inventory': 'Inventory Management',
            'report': 'Reports & Analytics',
            'financial': 'Financial Operations',
            'system': 'System Administration'
        };

        return categoryMap[category.toLowerCase()] || category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ' Access';
    };

    // Helper function to determine if category should use single column layout
    const usesSingleColumnLayout = (category: string) => {
        return ['admin', 'system'].includes(category.toLowerCase());
    };

    return (
        <div className="space-y-8">
            {Object.entries(groupedPermissions).map(([category, permissions]) => {
                const displayName = getCategoryDisplayName(category);
                const singleColumn = usesSingleColumnLayout(category);

                return (
                    <div key={category}>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">{displayName}</h4>
                        <div className={singleColumn ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
                            {permissions.map((permission) => (
                                <div
                                    key={permission.id}
                                    className={`flex items-start justify-between p-4 border border-gray-200 rounded-lg transition-colors ${disabled
                                        ? 'opacity-50 cursor-not-allowed bg-gray-50'
                                        : 'cursor-pointer hover:bg-gray-50'
                                        }`}
                                    onClick={() => !disabled && onPermissionChange(permission.id)}
                                >
                                    <div className="flex-1">
                                        <h5 className="text-base font-medium text-gray-900 mb-1">
                                            {formatPermissionName(permission.name)}
                                            {singleColumn && " - Read-Only"}
                                        </h5>
                                        <p className="text-sm text-gray-600">
                                            {formatPermissionDescription(permission)}
                                        </p>
                                    </div>
                                    <div className="ml-4">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${disabled
                                            ? 'border-gray-200 bg-gray-100'
                                            : isPermissionSelected(permission.id)
                                                ? 'bg-green-500 border-green-500'
                                                : 'border-gray-300 hover:border-gray-400'
                                            }`}>
                                            {!disabled && isPermissionSelected(permission.id) && (
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            {Object.keys(groupedPermissions).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <p>No permissions available</p>
                </div>
            )}
        </div>
    );
};