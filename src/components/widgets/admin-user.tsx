import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AdminIcon, UserGroupIcon } from "../../../public/icons";

interface AdminUsersCardProps {
  rolename: string;
  total: number;
  count: number;
}

const AdminUsersCard: React.FC<AdminUsersCardProps> = ({ rolename, total, count }) => {
  return (
    <Card className="bg-white mb-6 flex-1">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#FFC94D] p-3 rounded-full">
            <AdminIcon />
          </div>
          <div>
            <h2 className="font-semibold text-base text-[#111827]">{rolename}</h2>
            <p className="text-[#6B7280] text-xs font-medium">Admin with permission to manage products</p>
          </div>
        </div>
        <div className="flex gap-[14px]">
          <div className="py-2 px-4 bg-[#F9FAFB] rounded-lg">
            <div className="flex items-center gap-2">
              <AdminIcon />
              <p className="font-medium text-sm text-[#111827]">{count} administrators</p>
            </div>
          </div>
          <div className="py-2 px-4 bg-[#F9FAFB] rounded-lg">
            <div className="flex items-center gap-2">
              <UserGroupIcon />
              <p className="font-medium text-sm text-[#111827]">{total} permissions</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminUsersCard;