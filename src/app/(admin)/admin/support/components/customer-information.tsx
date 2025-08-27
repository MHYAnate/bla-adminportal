"use client";

import type { SupportRequest } from "../types/support-types";

interface CustomerInformationProps {
  supportRequest: SupportRequest;
}

const CustomerInformation: React.FC<CustomerInformationProps> = ({
  supportRequest
}) => {
  return (
    <div className="bg-white border border-gray-200 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-600">Name</p>
          <p>
            {supportRequest.customer?.name ||
              supportRequest.user?.profile?.fullName ||
              'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Email</p>
          <p>
            {supportRequest.customer?.email || supportRequest.user?.email || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Type</p>
          <p>
            {supportRequest.customer?.type || supportRequest.user?.type || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Phone</p>
          <p>{supportRequest.customer?.phone || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerInformation;