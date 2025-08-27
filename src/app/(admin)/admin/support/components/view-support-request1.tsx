"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useGetAdmins } from "@/services/admin";
import SupportRequestHeader from "./support-request-header";
import CustomerInformation from "./customer-information";
import RequestDetails from "./request-details";
import StatusUpdateForm from "./status-update-form";
import TrackingUpdateForm from "./tracking-update-form";
import SupportTimeline from "./support-timeline";
import type { SupportRequest, StatusUpdateData, TrackingUpdateData } from "../types/support-types";

// Import support services with fallback
let useSupportRequestDetails: any,
    useUpdateSupportStatus: any,
    useUpdateSupportTracking: any;

try {
  const supportServices = require("@/services/support");
  useSupportRequestDetails = supportServices.useSupportRequestDetails;
  useUpdateSupportStatus = supportServices.useUpdateSupportStatus;
  useUpdateSupportTracking = supportServices.useUpdateSupportTracking;
} catch (error) {
  console.log("Support services not found, using fallbacks");
  // Fallback functions
  useSupportRequestDetails = () => ({ data: null, isLoading: false });
  useUpdateSupportStatus = () => ({
    mutateAsync: async () => {
      throw new Error("Service not available");
    },
    isPending: false,
  });
  useUpdateSupportTracking = () => ({
    mutateAsync: async () => {
      throw new Error("Service not available");
    },
    isPending: false,
  });
}

interface ViewSupportRequestProps {
  supportRequest: SupportRequest;
  onClose: () => void;
  onRefresh: () => void;
}

const ViewSupportRequest: React.FC<ViewSupportRequestProps> = ({
  supportRequest,
  onClose,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<"details" | "tracking">("details");

  // Fetch detailed support request data
  const { data: detailData, isLoading } = useSupportRequestDetails
    ? useSupportRequestDetails(supportRequest?.id)
    : { data: null, isLoading: false };

  // Fetch admins data
  const { adminsData, isAdminsLoading } = useGetAdmins({ enabled: true });

  // Filter admins with customer service roles
  const filteredAdmins = useMemo(() => {
    if (!adminsData) return [];
    
    return adminsData.filter(admin => {
      // Check if admin has the required roles
      const hasCustomerService = admin.roles?.some((role: { role: { name: string; }; }) => 
        role.role.name === "CUSTOMER_SERVICE" || 
        role.role.name === "Customer Relations Manager"
      );
      
      // Also check the top-level role property as fallback
      const hasTopLevelRole = 
        admin.role === "CUSTOMER_SERVICE" || 
        admin.role === "Customer Relations Manager";
      
      return hasCustomerService || hasTopLevelRole;
    });
  }, [adminsData]);

  // Initialize mutation hooks
  const statusMutation = useUpdateSupportStatus ? useUpdateSupportStatus() : null;
  const trackingMutation = useUpdateSupportTracking ? useUpdateSupportTracking() : null;

  const currentData = detailData || supportRequest;

  const handleStatusUpdate = async (data: StatusUpdateData) => {
    if (!supportRequest?.id) {
      throw new Error("No support request selected");
    }

    if (statusMutation?.mutateAsync) {
      // Call the API with the correct structure matching the controller
      await statusMutation.mutateAsync({
        supportId: supportRequest.id,
        status: data.status,
        resolutionDetails: data.resolutionDetails,
        // Include existing internal notes if available
        internalNotes: currentData.internalNotes,
      });
    } else {
      console.log("Status update:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    onRefresh();
  };

  const handleTrackingUpdate = async (data: TrackingUpdateData) => {
    if (!supportRequest?.id) {
      throw new Error("No support request selected");
    }

    if (trackingMutation?.mutateAsync) {
      // Call the API with the correct structure matching the controller
      await trackingMutation.mutateAsync({
        supportId: supportRequest.id,
        assignedAdminId: data.assignedAdminId,
        resolutionChannel: data.resolutionChannel,
        internalNotes: data.internalNotes,
      });
    } else {
      console.log("Tracking update:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    onRefresh();
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-lg">Loading support request details...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Information */}
      <SupportRequestHeader supportRequest={currentData} />

      {/* Customer Information */}
      <CustomerInformation supportRequest={currentData} />

      {/* Request Details */}
      <RequestDetails supportRequest={currentData} />

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("details")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "details"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Update Status
          </button>
          <button
            onClick={() => setActiveTab("tracking")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "tracking"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Support Tracking
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "details" && (
        <StatusUpdateForm
          supportRequest={currentData}
          onUpdate={handleStatusUpdate}
          isLoading={statusMutation?.isPending || false}
        />
      )}

      {activeTab === "tracking" && (
        <TrackingUpdateForm
          supportRequest={currentData}
          admins={filteredAdmins}
          onUpdate={handleTrackingUpdate}
          isLoading={trackingMutation?.isPending || false}
        />
      )}

      {/* Timeline */}
      {currentData.timeline && (
        <SupportTimeline timeline={currentData.timeline} />
      )}
    </div>
  );
};

export default ViewSupportRequest;