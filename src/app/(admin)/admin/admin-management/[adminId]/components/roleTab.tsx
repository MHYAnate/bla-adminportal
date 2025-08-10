"use client";
import {
  Shield,
  Users,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  User,
  Crown,
  Briefcase,
  Lock
} from 'lucide-react';
import { useState } from 'react';

interface RolesTabProps {
  adminData: any;
  roles: any;
}

const RolesTab: React.FC<RolesTabProps> = ({ adminData, roles }) => {


  const [expandedRoles, setExpandedRoles] = useState<Set<number>>(new Set());
  const [activeView, setActiveView] = useState<'current' | 'all'>('current');

  // Handle both roles.data and direct roles array
  const rolesArray = roles?.data || roles || [];

  const toggleRoleExpansion = (roleId: number) => {
    const newExpanded = new Set(expandedRoles);
    if (newExpanded.has(roleId)) {
      newExpanded.delete(roleId);
    } else {
      newExpanded.add(roleId);
    }
    setExpandedRoles(newExpanded);
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName?.toLowerCase()) {
      case 'super_admin':
        return <Crown className="w-5 h-5 text-purple-600" />;
      case 'admin':
        return <Shield className="w-5 h-5 text-blue-600" />;
      case 'business_owner':
        return <Briefcase className="w-5 h-5 text-green-600" />;
      case 'individual':
        return <User className="w-5 h-5 text-gray-600" />;
      default:
        return <Lock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName?.toLowerCase()) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'business_owner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'individual':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const formatPermissionName = (permission: string) => {
    return permission?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
  };

  // Fixed: Single getCurrentUserPermissions function with proper logic
  const getCurrentUserPermissions = () => {
    const permissions = new Set<string>();

    console.log('Getting current user permissions...');
    console.log('adminData?.roles:', adminData?.roles);
    console.log('rolesArray:', rolesArray);

    if (!adminData?.roles || !Array.isArray(adminData.roles)) {
      console.log('No admin roles found or roles is not an array');
      return [];
    }

    adminData.roles.forEach((userRole: any) => {
      console.log('Processing user role:', userRole);

      // Handle different role data structures
      let roleData;
      if (userRole.role) {
        roleData = userRole.role; // Nested structure: { role: { id, name, ... } }
      } else if (userRole.id && userRole.name) {
        roleData = userRole; // Direct structure: { id, name, ... }
      }

      console.log('Extracted roleData:', roleData);

      if (roleData) {
        const fullRole = rolesArray.find((role: any) => role.id === roleData.id);
        console.log('Found full role:', fullRole);

        if (fullRole?.permissions && Array.isArray(fullRole.permissions)) {
          fullRole.permissions.forEach((perm: any) => {
            if (perm?.name) {
              permissions.add(perm.name);
            }
          });
        }
      }
    });

    const permissionsArray = Array.from(permissions);
    console.log('Final permissions:', permissionsArray);
    return permissionsArray;
  };

  const currentUserPermissions = getCurrentUserPermissions();

  // Helper function to get assigned roles with proper error handling
  const getAssignedRoles = () => {
    if (!adminData?.roles || !Array.isArray(adminData.roles)) {
      return [];
    }

    return adminData.roles.map((userRole: any) => {
      // Handle both nested and direct role structures
      if (userRole.role) {
        return userRole.role; // Nested: { role: { id, name, ... } }
      } else if (userRole.id && userRole.name) {
        return userRole; // Direct: { id, name, ... }
      }
      return null;
    }).filter(Boolean); // Remove null values
  };

  const assignedRoles = getAssignedRoles();
  console.log('Processed assigned roles:', assignedRoles);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Role Management</h2>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveView('current')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeView === 'current'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Current Roles
            </button>
            <button
              onClick={() => setActiveView('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeView === 'all'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              All Roles
            </button>
          </div>
        </div>
      </div>

      {/* Current User View */}
      {activeView === 'current' && (
        <div className="space-y-6">
          {/* Assigned Roles */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Assigned Roles ({assignedRoles.length})
            </h3>

            {assignedRoles.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {assignedRoles.map((roleData: any, index: number) => {
                  const fullRole = rolesArray.find((role: any) => role.id === roleData.id);

                  return (
                    <div key={roleData.id || index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-3">
                        {getRoleIcon(roleData.name)}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 capitalize">
                            {roleData.name?.replace(/_/g, ' ') || 'Unknown Role'}
                          </h4>
                          <p className="text-sm text-gray-600">{roleData.description || 'No description'}</p>
                        </div>
                      </div>

                      {fullRole && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-700">
                            Permissions ({fullRole.permissions?.length || 0})
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {fullRole.permissions?.slice(0, 3).map((perm: any, permIndex: number) => (
                              <span
                                key={perm.id || permIndex}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                              >
                                {formatPermissionName(perm.name)}
                              </span>
                            ))}
                            {fullRole.permissions && fullRole.permissions.length > 3 && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                +{fullRole.permissions.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No roles assigned to this administrator</p>
                <p className="text-sm mt-1">Roles can be assigned from the General tab</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* All Roles View */}
      {activeView === 'all' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              System Roles ({rolesArray.length})
            </h3>
            <p className="text-gray-600 mt-1">All available roles and their permissions</p>
          </div>

          {rolesArray.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {rolesArray.map((role: any) => {
                const isExpanded = expandedRoles.has(role.id);
                const userHasRole = assignedRoles.some((assignedRole: any) => assignedRole.id === role.id);

                return (
                  <div key={role.id} className="p-6">
                    <div
                      className="flex items-center justify-between cursor-pointer hover:bg-gray-50 -m-2 p-2 rounded-lg transition-colors"
                      onClick={() => toggleRoleExpansion(role.id)}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        {getRoleIcon(role.name)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-lg font-medium text-gray-900 capitalize">
                              {role.name?.replace(/_/g, ' ') || 'Unknown Role'}
                            </h4>
                            {userHasRole && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                Assigned
                              </span>
                            )}
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(role.name)}`}>
                              {role.permissions?.length || 0} permissions
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">{role.description || 'No description available'}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>Created: {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : 'N/A'}</span>
                            <span>Users: {role._count?.users || 0}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 ml-9">
                        <h5 className="font-medium text-gray-900 mb-3">Permissions</h5>
                        {role.permissions && role.permissions.length > 0 ? (
                          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                            {role.permissions.map((permission: any) => {
                              const hasPermission = currentUserPermissions.includes(permission.name);
                              return (
                                <div
                                  key={permission.id}
                                  className={`flex items-center space-x-2 p-3 rounded-lg border ${hasPermission
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-gray-50 border-gray-200'
                                    }`}
                                >
                                  {hasPermission ? (
                                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                                  ) : (
                                    <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  )}
                                  <span className={`text-sm font-medium ${hasPermission ? 'text-green-800' : 'text-gray-700'
                                    }`}>
                                    {formatPermissionName(permission.name)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No permissions assigned to this role</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No roles available in the system</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RolesTab;