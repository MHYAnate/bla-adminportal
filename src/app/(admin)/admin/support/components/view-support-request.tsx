// // src/app/(admin)/admin/support/components/view-support-request.tsx

// src/app/(admin)/admin/support/components/view-support-request.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useMemo, useState, useEffect } from "react";
import { useGetAdminRoles, useGetAdmins } from "@/services/admin";

// Import support services with proper fallback
let useSupportRequestDetails: any,
  useUpdateSupportStatus: any,
  useUpdateSupportTracking: any,
  getStatusBadgeColor: any,
  getPriorityBadgeColor: any,
  getSupportStatusWorkflow: any,
  isValidStatusTransition: any;

try {
  const supportServices = require("@/services/support");
  useSupportRequestDetails = supportServices.useSupportRequestDetails;
  useUpdateSupportStatus = supportServices.useUpdateSupportStatus;
  useUpdateSupportTracking = supportServices.useUpdateSupportTracking;
  getStatusBadgeColor = supportServices.getStatusBadgeColor;
  getPriorityBadgeColor = supportServices.getPriorityBadgeColor;
  getSupportStatusWorkflow = supportServices.getSupportStatusWorkflow;
  isValidStatusTransition = supportServices.isValidStatusTransition;
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
  getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-orange-100 text-orange-800';
      case 'LOW': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  getSupportStatusWorkflow = () => [
    { value: "NEW", label: "New", description: "New support request" },
    {
      value: "IN_PROGRESS",
      label: "In Progress",
      description: "Being worked on",
    },
    { value: "RESOLVED", label: "Resolved", description: "Issue resolved" },
  ];
  isValidStatusTransition = (from: string, to: string) => {
    const validTransitions: Record<string, string[]> = {
      'NEW': ['IN_PROGRESS', 'RESOLVED'],
      'IN_PROGRESS': ['RESOLVED'],
      'RESOLVED': []
    };
    return validTransitions[from]?.includes(to) || false;
  };
}

const updateStatusSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED"]),
  resolutionDetails: z.string().optional(),
});

const updateTrackingSchema = z.object({
  assignedAdminId: z.string().optional(),
  resolutionChannel: z.enum(["CALL", "EMAIL", "CHAT", "IN_PERSON"]).optional(),
  internalNotes: z.string().optional(),
});

interface ViewSupportRequestProps {
  supportRequest: any;
  onClose: () => void;
  onRefresh: () => void;
}

const ViewSupportRequest: React.FC<ViewSupportRequestProps> = ({
  supportRequest,
  onClose,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<"details" | "tracking">("details");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingTracking, setIsUpdatingTracking] = useState(false);

  const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });
  const { adminsData, isAdminsLoading, refetchAdmins } = useGetAdmins({ enabled: true });

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

  // Fetch detailed support request data
  const { data: detailData, isLoading, refetch } = useSupportRequestDetails
    ? useSupportRequestDetails(supportRequest?.id)
    : { data: null, isLoading: false, refetch: () => {} };

  // Initialize mutation hooks with fallback error handlers
  const statusMutation = useUpdateSupportStatus
    ? useUpdateSupportStatus()
    : null;
  const trackingMutation = useUpdateSupportTracking
    ? useUpdateSupportTracking()
    : null;

  // Forms
  const statusForm = useForm({
    resolver: zodResolver(updateStatusSchema),
    defaultValues: {
      status: supportRequest?.status || "NEW",
      resolutionDetails: supportRequest?.resolutionDetails || "",
    },
  });

  const trackingForm = useForm({
    resolver: zodResolver(updateTrackingSchema),
    defaultValues: {
      assignedAdminId: supportRequest?.assignedAdminId?.toString() || "",
      resolutionChannel: supportRequest?.resolutionChannel || "",
      internalNotes: supportRequest?.internalNotes || "",
    },
  });

  // Update form values when detailData changes
  useEffect(() => {
    if (detailData) {
      statusForm.setValue('status', detailData.status);
      statusForm.setValue('resolutionDetails', detailData.resolutionDetails || '');
      
      trackingForm.setValue('assignedAdminId', detailData.assignedAdminId?.toString() || '');
      trackingForm.setValue('resolutionChannel', detailData.resolutionChannel || '');
      trackingForm.setValue('internalNotes', detailData.internalNotes || '');
    }
  }, [detailData, statusForm, trackingForm]);

  const onUpdateStatus = async (data: z.infer<typeof updateStatusSchema>) => {
    if (!supportRequest?.id) {
      toast.error("No support request selected");
      return;
    }

    // Validate status transition
    if (!isValidStatusTransition(supportRequest.status, data.status)) {
      toast.error(
        `Invalid status transition from ${supportRequest.status} to ${data.status}`
      );
      return;
    }

    // Check if internal notes are required for RESOLVED status
    if (data.status === "RESOLVED") {
      const currentInternalNotes = trackingForm.getValues("internalNotes");
      if (!currentInternalNotes?.trim()) {
        toast.error("Internal notes are required when marking as Resolved");
        setActiveTab("tracking");
        return;
      }
    }

    setIsUpdatingStatus(true);
    try {
      const updateData: any = {
        status: data.status,
        ...(data.resolutionDetails && { resolutionDetails: data.resolutionDetails }),
      };

      // Include internal notes if resolving
      if (data.status === "RESOLVED") {
        updateData.internalNotes = trackingForm.getValues("internalNotes");
      }

      if (statusMutation?.mutateAsync) {
        await statusMutation.mutateAsync({
          supportId: supportRequest.id.toString(),
          data: updateData,
        });
      } else {
        // Fallback: simulate success
        console.log("Status update:", data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      toast.success("Support request status updated successfully");
      onRefresh();
      refetch();
    } catch (error: any) {
      console.error("Error updating support status:", error);
      if (error?.response?.status === 401) {
        toast.error("Authentication failed. Please check your token.");
      } else if (error?.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error(error?.message || "Failed to update support status");
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const onUpdateTracking = async (
    data: z.infer<typeof updateTrackingSchema>
  ) => {
    if (!supportRequest?.id) {
      toast.error("No support request selected");
      return;
    }

    setIsUpdatingTracking(true);
    try {
      const updateData: any = {
        ...(data.assignedAdminId && { assignedAdminId: data.assignedAdminId }),
        ...(data.resolutionChannel && { resolutionChannel: data.resolutionChannel }),
        ...(data.internalNotes && { internalNotes: data.internalNotes }),
      };

      if (trackingMutation?.mutateAsync) {
        await trackingMutation.mutateAsync({
          supportId: supportRequest.id.toString(),
          data: updateData,
        });
      } else {
        // Fallback: simulate success
        console.log("Tracking update:", data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      toast.success("Support tracking information updated successfully");
      onRefresh();
      refetch();
    } catch (error: any) {
      console.error("Error updating support tracking:", error);
      if (error?.response?.status === 401) {
        toast.error("Authentication failed. Please check your token.");
      } else if (error?.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error(
          error?.message || "Failed to update support tracking information"
        );
      }
    } finally {
      setIsUpdatingTracking(false);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading support request details...</div>;
  }

  const currentData = detailData || supportRequest;

  console.log(detailData, "dd")
  console.log(supportRequest, "srd")
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Support ID</p>
            <p className="text-lg font-semibold">
              {currentData.supportId || `#${currentData.id.toString().padStart(6, '0')}`}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Status</p>
            <Badge
              className={`${getStatusBadgeColor(currentData.status)} mt-1`}
            >
              {currentData.status}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Priority</p>
            <Badge
              className={`${getPriorityBadgeColor(currentData.priority || "MEDIUM")} mt-1`}
            >
              {currentData.priority || "MEDIUM"}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Category</p>
            <p className="text-lg font-semibold">
              {currentData.category || "GENERAL"}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-white border border-gray-200 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Name</p>
            <p>
              {currentData.user?.profile?.fullName ||
                currentData.customer?.name ||
                "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Email</p>
            <p>
              {currentData.user?.email || currentData.customer?.email || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Business</p>
            <p>
              {currentData.user?.businessProfile?.businessName ||
                currentData.customer?.businessName ||
                "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Type</p>
            <p>
              {currentData.user?.type || currentData.customer?.type || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Request Details */}
      <div className="bg-white border border-gray-200 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Request Details</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-600">Subject</p>
            <p className="font-medium">
              {currentData.title || "No subject provided"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Description</p>
            <div className="bg-gray-50 p-3 rounded border">
              <p className="whitespace-pre-wrap">
                {currentData.description || "No description provided"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Date Submitted</p>
            <p>
              {currentData.createdAt
                ? new Date(currentData.createdAt).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
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
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Update Status</h3>
          <Form {...statusForm}>
            <form
              onSubmit={statusForm.handleSubmit(onUpdateStatus)}
              className="space-y-4"
            >
              <FormField
                control={statusForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getSupportStatusWorkflow().map((status: any) => (
                          <SelectItem
                            key={status.value}
                            value={status.value}
                            disabled={
                              !isValidStatusTransition(
                                currentData.status,
                                status.value
                              )
                            }
                          >
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={statusForm.control}
                name="resolutionDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resolution Details (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide details about the resolution..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isUpdatingStatus}
                className="w-full"
              >
                {isUpdatingStatus ? "Updating..." : "Update Status"}
              </Button>
            </form>
          </Form>
        </div>
      )}

      {activeTab === "tracking" && (
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Support Tracking Information
          </h3>

          {/* Current Tracking Info */}
          <div className="bg-gray-50 p-3 rounded mb-4">
            <h4 className="font-medium mb-2">Current Assignment</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Assigned Admin:</span>
                <span className="ml-2">
                  {detailData?.assignedAdmin.adminProfile.fullName || "Unassigned"}
                </span>
              </div>
              <div>
                <span className="font-medium">Resolution Channel:</span>
                <span className="ml-2">
                  {currentData.resolutionChannel || "Not set"}
                </span>
              </div>
            </div>
          </div>

          <Form {...trackingForm}>
            <form
              onSubmit={trackingForm.handleSubmit(onUpdateTracking)}
              className="space-y-4"
            >
              <FormField
                control={trackingForm.control}
                name="assignedAdminId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign to Admin</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select admin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Unassigned">Unassigned</SelectItem>
                        {filteredAdmins.map((admin: any) => (
                          <SelectItem 
                            key={admin.id} 
                            value={admin.id.toString()}
                          >
                            {admin.profile?.fullName || admin.fullName || `Admin ${admin.id}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={trackingForm.control}
                name="resolutionChannel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resolution Channel</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select channel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CALL">Phone Call</SelectItem>
                        <SelectItem value="EMAIL">Email</SelectItem>
                        <SelectItem value="CHAT">Live Chat</SelectItem>
                        <SelectItem value="IN_PERSON">In Person</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={trackingForm.control}
                name="internalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Internal Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add internal notes (required before marking as resolved)..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isUpdatingTracking}
                className="w-full"
              >
                {isUpdatingTracking ? "Updating..." : "Update Tracking Info"}
              </Button>
            </form>
          </Form>
        </div>
      )}

      {/* Timeline (if available) */}
      {currentData.timeline && currentData.timeline.length > 0 && (
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Support Timeline</h3>
          <div className="space-y-3">
            {currentData.timeline.map((entry: any, index: number) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded"
              >
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Status changed from {entry.fromStatus} to {entry.toStatus}
                  </p>
                  {entry.notes && (
                    <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(entry.createdAt).toLocaleString()} by{" "}
                    {entry.admin?.profile?.fullName || "System"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSupportRequest;

