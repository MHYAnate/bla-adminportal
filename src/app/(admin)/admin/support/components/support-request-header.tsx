"use client";

import { Badge } from "@/components/ui/badge";
import { getStatusBadgeColor, getPriorityBadgeColor } from "../constants/support-constants";
import type { SupportRequest } from "../types/support-types";

interface SupportRequestHeaderProps {
  supportRequest: SupportRequest;
}

const SupportRequestHeader: React.FC<SupportRequestHeaderProps> = ({
  supportRequest
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-600">Support ID</p>
          <p className="text-lg font-semibold">
            {supportRequest.supportId || `#${supportRequest.id.toString().padStart(6, '0')}`}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Status</p>
          <Badge className={`${getStatusBadgeColor(supportRequest.status)} mt-1`}>
            {supportRequest.status}
          </Badge>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Priority</p>
          <Badge className={`${getPriorityBadgeColor(supportRequest.priority || 'MEDIUM')} mt-1`}>
            {supportRequest.priority || 'MEDIUM'}
          </Badge>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Category</p>
          <p className="text-lg font-semibold">
            {supportRequest.category || 'GENERAL'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportRequestHeader;