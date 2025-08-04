import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RoleData } from '@/types';

interface RoleCardProps {
  role: RoleData;
}

const RoleCard: React.FC<RoleCardProps> = ({ role }) => {
  // Define colors for different roles
  const getBgColor = () => {
    const roleName = role.name?.toLowerCase();
    switch (roleName) {
      case 'super_admin':
        return 'bg-[#B59BFD]';
      case 'admin':
        return 'bg-[#FFC94D]';
      case 'business_owner':
      case 'business':
        return 'bg-[#ABFFD5]';
      case 'customer':
      case 'individual':
        return 'bg-[#FFCEDB]';
      default:
        return 'bg-[#F9FAFB]';
    }
  };

  // Fix the visibility logic - show cards for business and individual customer types
  const shouldShowCard = () => {
    const roleName = role.name?.toLowerCase();
    return roleName === 'business' || roleName === 'individual' ||
      roleName === 'business_owner' || roleName === 'customer';
  };

  // Don't render if card shouldn't be shown
  if (!shouldShowCard()) {
    return null;
  }

  return (
    <Card className="bg-white flex-1">
      <CardContent className={`p-6 ${getBgColor()} rounded-t-lg h-[140px]`}>
        <h2 className="font-semibold text-xl text-[#111827] capitalize">
          {role.name?.replace(/_/g, ' ') || 'Unknown Role'}
        </h2>
        <p className="text-[#111827] text-sm font-medium mt-2 line-clamp-2">
          {role.description || 'No description available'}
        </p>
      </CardContent>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[#6B7280] font-medium text-sm">Total Users</p>
          <span className="font-semibold text-base text-[#111827]">
            {role._count?.users || 0}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-[#6B7280] font-medium text-sm">Permissions</p>
          <span className="font-semibold text-base text-[#111827]">
            {role.permissions?.length || 0}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleCard;