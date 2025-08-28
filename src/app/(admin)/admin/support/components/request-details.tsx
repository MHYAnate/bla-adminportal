"use client";

import type { SupportRequest } from "../types/support-types";

interface RequestDetailsProps {
  supportRequest: SupportRequest;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({
  supportRequest
}) => {
  return (
    <div className="bg-white border border-gray-200 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Request Details</h3>
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-600">Subject</p>
          <p className="font-medium">
            {supportRequest.title ||
              supportRequest.subject ||
              'No subject provided'}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Description</p>
          <div className="bg-gray-50 p-3 rounded border">
            <p className="whitespace-pre-wrap">
              {supportRequest.description ||
                supportRequest.message ||
                'No description  provided'}
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Date Submitted</p>
          <p>
            {supportRequest.createdAt
              ? new Date(supportRequest.createdAt).toLocaleString()
              : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;