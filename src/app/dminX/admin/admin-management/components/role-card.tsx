import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RoleData } from '@/types';

interface RoleCardProps {
  role: RoleData;
}

const RoleCard: React.FC<RoleCardProps> = ({ role }) => {
  // Define colors for different roles
  const getBgColor = () => {
    switch(role.name) {
      case 'super_admin':
        return 'bg-[#B59BFD]';
      case 'admin':
        return 'bg-[#FFC94D]';
      case 'business_owner':
        return 'bg-[#ABFFD5]';
      case 'customer':
        return 'bg-[#FFCEDB]';
      default:
        return 'bg-[#F9FAFB]';
    }
  };

  return (
    <Card className={!role.name.includes('admin')? "hidden":"bg-white flex-1"}>
      <CardContent className={`p-6 ${getBgColor()} rounded-t-lg h-[140px]`}>
        <h2 className="font-semibold text-xl text-[#111827] capitalize">
          {role.name.replace(/_/g, ' ')}
        </h2>
        <p className="text-[#111827] text-sm font-medium mt-2 line-clamp-2">
          {role.description}
        </p>
      </CardContent>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-3">
          <p className="text-[#6B7280] font-medium text-sm">Total Users</p>
          <span className="font-semibold text-base text-[#111827]">{role._count.users}</span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-[#6B7280] font-medium text-sm">Permissions</p>
          <span className="font-semibold text-base text-[#111827]">{role.permissions.length}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleCard;