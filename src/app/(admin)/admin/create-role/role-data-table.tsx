"use client";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ViewIcon } from "./../../../../../public/icons";
import { TableComponent } from "@/components/custom-table";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import { Button } from "@/components/ui/button";
import { AdminData } from "@/types/index";

// Role data interface extending AdminData
interface RoleData extends AdminData {
    permissionCount: number;
    formattedName?: string;
    formattedDate?: string;
}

// interface RoleTableProps {
//     rolesData: any[];
//     loading: boolean;
//     refetch: () => void;
// }

// 1. Update component props interface
interface RoleTableProps {
    rolesData: any[];
    loading: boolean;
    refetch: () => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: string) => void;
}


// Role Details Dialog Component - Right Side Dialog
const RoleDetailsDialog: React.FC<{
    role: any;
    isOpen: boolean;
    onClose: () => void;
}> = ({ role, isOpen, onClose }) => {
    if (!role) return null;

    const formatPermissionName = (name: string) => {
        return name?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={onClose}
                />
            )}

            {/* Right Side Dialog */}
            <div className={`fixed top-0 right-0 h-full w-1/2 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {role.name?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Role Details'}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">View role permissions and assigned users</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            aria-label="Close"
                        >
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-6">
                            {/* Role Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-lg mb-3 text-gray-900">Role Information</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-gray-600">Role Name:</span>
                                        <span className="text-sm text-gray-900 font-medium">
                                            {role.name?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-gray-600">Status:</span>
                                        <Badge variant={role.status === 'active' ? 'success' : 'warning'} className="text-xs">
                                            {role.status || 'Active'}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-gray-600">Created Date:</span>
                                        <span className="text-sm text-gray-900">
                                            {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium text-gray-600">Total Permissions:</span>
                                        <span className="text-sm text-gray-900 font-semibold">
                                            {role.permissions?.length || 0}
                                        </span>
                                    </div>
                                    {role.description && (
                                        <div className="pt-2 border-t border-gray-200">
                                            <span className="text-sm font-medium text-gray-600">Description:</span>
                                            <p className="text-sm text-gray-900 mt-1">{role.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Permissions Section */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-lg text-gray-900">Permissions</h3>
                                    <span className="text-sm text-gray-500 bg-blue-100 px-2 py-1 rounded-full">
                                        {role.permissions?.length || 0} total
                                    </span>
                                </div>

                                {role.permissions && role.permissions.length > 0 ? (
                                    <div className="space-y-2">
                                        {role.permissions.map((permission: any, index: number) => (
                                            <div
                                                key={permission.id || index}
                                                className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-blue-900">
                                                        {formatPermissionName(permission.name)}
                                                    </p>
                                                    {permission.description && (
                                                        <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                                                            {permission.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                        <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-medium">No permissions assigned</p>
                                        <p className="text-xs mt-1">This role has no permissions configured</p>
                                    </div>
                                )}
                            </div>

                            {/* Active Users Section */}
                            {/* <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-lg text-gray-900">Active Users</h3>
                                    <span className="text-sm text-gray-500 bg-green-100 px-2 py-1 rounded-full">
                                        {role.users?.length || role._count?.users || 0} assigned
                                    </span>
                                </div>

                                {role.users && role.users.length > 0 ? (
                                    <div className="space-y-3">
                                        {role.users.map((user: any, index: number) => (
                                            <div
                                                key={user.id || index}
                                                className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                                            >
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-green-600 font-semibold text-sm">
                                                        {(user.fullName || user.username || user.email || 'U').charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-green-900 truncate">
                                                        {user.fullName || user.username || 'Unknown User'}
                                                    </p>
                                                    <p className="text-sm text-green-700 truncate">{user.email}</p>
                                                </div>
                                                <Badge
                                                    variant={user.status === 'active' ? 'success' : 'warning'}
                                                    className="text-xs flex-shrink-0"
                                                >
                                                    {user.status || 'Active'}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                        <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-medium">No users assigned</p>
                                        <p className="text-xs mt-1">No users are currently assigned to this role</p>
                                    </div>
                                )}
                            </div> */}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 p-6 bg-gray-50 mb-8">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                                Last updated: {role.updatedAt ? new Date(role.updatedAt).toLocaleDateString() : 'N/A'}
                            </div>
                            <Button onClick={onClose} variant="outline" className="px-6">
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const RoleDataTable: React.FC<RoleTableProps> = ({
    rolesData,
    loading,
    refetch,
    currentPage,
    totalPages,
    onPageChange,
    onPageSizeChange,
}) => {
    const pageSize = 10;
    // const [currentPage, setCurrentPage] = useState(1);
    const [nameFilter, setNameFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [selectedRole, setSelectedRole] = useState<any>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Status filter options
    const statusList = [
        { value: "", text: "All Statuses" },
        { value: "active", text: "Active" },
        { value: "inactive", text: "Inactive" },
    ];

    // Ensure rolesData is an array and filter it properly
    const safeRolesData = Array.isArray(rolesData) ? rolesData : [];

    const filteredData = safeRolesData.filter((role) => {
        if (!role || typeof role !== 'object') return false;

        const roleName = role.name || "";
        const nameMatch = nameFilter
            ? roleName.toLowerCase().includes(nameFilter.toLowerCase())
            : true;

        const status = role.status || "active";
        const statusMatch = statusFilter && statusFilter !== ""
            ? status.toLowerCase() === statusFilter.toLowerCase()
            : true;

        return nameMatch && statusMatch;
    });

    // Handle view role details - PROPERLY
    const handleViewRole = (role: any) => {
        console.log('🎯 Opening dialog for role:', role);
        setSelectedRole(role);
        setIsDialogOpen(true);
    };

    // Transform role data to match AdminData structure
    const tableData: RoleData[] = filteredData.map((role) => {
        const roleName = role.name || "";
        const permissionCount = role.permissions?.length || 0;

        return {
            id: role.id,
            email: "", // Required by AdminData but not used for roles
            name: roleName,
            profile: {
                username: roleName,
                fullName: roleName,
                phone: "",
                gender: "",
            },
            role: roleName,
            description: role.description || "No description available",
            date: role.createdAt,
            status: role.status || "active",
            createdAt: role.createdAt,
            roles: {
                role: {
                    id: role.id,
                    name: roleName,
                    discription: role.description || "",
                }
            },
            rolecount: String(permissionCount),
            action: "",

            // Additional fields for roles
            permissionCount: permissionCount,

            // Formatted fields for display
            formattedName: roleName === "super_admin"
                ? "Super Admin"
                : roleName.replace(/_/g, " ") || "Unknown Role",
            formattedDate: role.createdAt
                ? new Date(role.createdAt).toLocaleDateString()
                : "N/A",

            // Store the actual role index to find it later
            roleIndex: filteredData.indexOf(role),
        } as RoleData & { roleIndex: number };
    });

    // Cell renderers
    const cellRenderers = {
        name: (item: RoleData) => (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                        {item.formattedName?.charAt(0).toUpperCase() || "R"}
                    </span>
                </div>
                <div>
                    <p className="font-medium text-gray-900 capitalize">
                        {item.formattedName}
                    </p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                </div>
            </div>
        ),
        permissionCount: (item: RoleData) => (
            <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {item.permissionCount} {item.permissionCount === 1 ? 'permission' : 'permissions'}
                </span>
            </div>
        ),
        createdAt: (item: RoleData) => (
            <div className="text-sm text-gray-600">
                {item.formattedDate}
            </div>
        ),
        status: (item: RoleData) => (
            <Badge
                variant={
                    item.status?.toLowerCase() === "active"
                        ? "success"
                        : "warning"
                }
                className="py-1 px-[26px] font-medium"
            >
                {item.status?.toUpperCase() || "ACTIVE"}
            </Badge>
        ),
        action: (item: RoleData & { roleIndex: number }) => (
            <div className="flex gap-2.5">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Get the original role from filteredData using the stored index
                        const originalRole = filteredData[item.roleIndex];
                        console.log('🎯 View button clicked for role:', originalRole);
                        handleViewRole(originalRole);
                    }}
                    className="bg-[#27A376] p-2.5 rounded-lg hover:bg-[#1e8a5f] transition-colors"
                    title="View Permissions & Users"
                >
                    <ViewIcon />
                </button>
            </div>
        ),
    };

    const columnOrder: (keyof RoleData)[] = [
        "name",
        "permissionCount",
        "createdAt",
        "status",
        "action",
    ];

    const columnLabels: Partial<Record<keyof RoleData, string>> = {
        name: "Role Name",
        permissionCount: "Permissions",
        createdAt: "Created Date",
        status: "Status",
        action: "",
    };

    return (
        <>
            <Card className="bg-white">
                <CardContent className="p-6">
                    <h6 className="font-semibold text-lg text-[#111827] mb-1">
                        Available Roles
                    </h6>
                    <p className="text-[#687588] font-medium text-sm mb-6">
                        View all available roles and their permission counts.
                    </p>
                    <div className="flex items-center gap-4 mb-6">
                        <InputFilter
                            setQuery={setNameFilter}
                            placeholder="Search by role name"
                        />
                        <SelectFilter
                            setFilter={setStatusFilter}
                            placeholder="Status"
                            list={statusList}
                        />
                    </div>
                    {/* <TableComponent<RoleData>
                        tableData={tableData}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        totalPages={Math.ceil(tableData.length / pageSize)}
                        cellRenderers={cellRenderers}
                        columnOrder={columnOrder}
                        columnLabels={columnLabels}
                        isLoading={loading}
                    /> */}
                          <TableComponent<RoleData>
                        tableData={tableData}
                        currentPage={currentPage}
                        onPageChange={onPageChange}
                        totalPages={totalPages}
                        cellRenderers={cellRenderers}
                        columnOrder={columnOrder}
                        columnLabels={columnLabels}
                        isLoading={loading}
                        onPageSizeChange={onPageSizeChange}
                    />
                </CardContent>
            </Card>

            {/* Role Details Dialog - NO PAGE REDIRECT */}
            <RoleDetailsDialog
                role={selectedRole}
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    setSelectedRole(null);
                }}
            />
        </>
    );
};

export default RoleDataTable;