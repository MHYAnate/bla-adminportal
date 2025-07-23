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
  Lock,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
interface PermissionsTabProps {
  adminData: any;
  roles: any[];
}

const PermissionsTab: React.FC<PermissionsTabProps> = ({ adminData, roles }) => {

  const formatPermissionName = (permission: string) => {
    return permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getCurrentUserPermissions = () => {
    const permissions = new Set();
    adminData.roles?.forEach((userRole: any) => {
      const fullRole = roles.find(role => role.id === userRole.role.id);
      fullRole?.permissions?.forEach((perm: any) => {
        permissions.add(perm.name);
      });
    });
    return Array.from(permissions);
  };

  const currentUserPermissions = getCurrentUserPermissions();

  // Helper function to format permission names (replace with your actual function)
// const formatPermissionName = (permission: any) => {
//   return permission.name || permission
// }

const getPermissionDescription = (permission: any) => {
  return permission.description || "Permission description not available."
}

const isPermissionEnabled = (permission: any) => {
  return permission.enabled || false
}

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
              <h2 className="text-xl font-semibold text-gray-900">Assigned Permissions</h2>
              
            </div>
          </div>
        </div>

        {/* Admin Info */}
        
      </div>

        <div className="space-y-6">
          {/* Effective Permissions Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-green-600" />
              Effective Permissions ({currentUserPermissions.length})
            </h3>
            
            {currentUserPermissions.length > 0 ? (
              <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Role Permissions</h2>
        
              <div className="space-y-6">
                {currentUserPermissions.map((permission: any, index: number) => (
                  <div key={index} className="flex items-start justify-between py-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1 space-y-1 pr-4">
                      <h3 className="text-base font-medium text-gray-900">{formatPermissionName(permission)}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{`This permission gives the ${adminData.roles[0].role.name} the access ${formatPermissionName(permission)} on BuyLocal Admin Portal`}</p>
                    </div>
        
                    <div className="flex-shrink-0">
                      <Switch
                        checked={true}
                        onCheckedChange={(checked) => {
                          // Handle permission toggle here
                          console.log(`Permission ${formatPermissionName(permission)} toggled to:`, checked)
                        }}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Lock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No permissions available</p>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default PermissionsTab;