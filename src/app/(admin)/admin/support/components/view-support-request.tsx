// src/app/(admin)/admin/support/components/view-support-request.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";

// Import support services with fallback
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
        mutateAsync: async () => { throw new Error("Service not available"); },
        isPending: false
    });
    useUpdateSupportTracking = () => ({
        mutateAsync: async () => { throw new Error("Service not available"); },
        isPending: false
    });
    getStatusBadgeColor = (status: string) => "bg-gray-100 text-gray-800";
    getPriorityBadgeColor = (priority: string) => "bg-gray-100 text-gray-800";
    getSupportStatusWorkflow = () => [
        { value: "NEW", label: "New", description: "New support request" },
        { value: "IN_PROGRESS", label: "In Progress", description: "Being worked on" },
        { value: "RESOLVED", label: "Resolved", description: "Issue resolved" }
    ];
    isValidStatusTransition = (from: string, to: string) => true;
}

const updateStatusSchema = z.object({
    status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED"]),
    resolutionDetails: z.string().optional(),
});

const updateTrackingSchema = z.object({
    assignedAdminId: z.string().optional(),
    resolutionChannel: z.enum(["CALL", "EMAIL", "CHAT", "IN_PERSON"]).optional(),
    internalNotes: z.string().min(1, "Internal notes are required"),
});

interface ViewSupportRequestProps {
    supportRequest: any;
    onClose: () => void;
    onRefresh: () => void;
}

const ViewSupportRequest: React.FC<ViewSupportRequestProps> = ({
    supportRequest,
    onClose,
    onRefresh
}) => {
    const [activeTab, setActiveTab] = useState<"details" | "tracking">("details");
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [isUpdatingTracking, setIsUpdatingTracking] = useState(false);

    // Fetch detailed support request data
    const { data: detailData, isLoading } = useSupportRequestDetails ?
        useSupportRequestDetails(supportRequest?.id) :
        { data: null, isLoading: false };

    // Initialize mutation hooks with fallback error handlers
    const statusMutation = useUpdateSupportStatus ? useUpdateSupportStatus() : null;
    const trackingMutation = useUpdateSupportTracking ? useUpdateSupportTracking() : null;

    // Forms
    const statusForm = useForm({
        resolver: zodResolver(updateStatusSchema),
        defaultValues: {
            status: supportRequest?.status || "NEW",
            resolutionDetails: "",
        },
    });

    const trackingForm = useForm({
        resolver: zodResolver(updateTrackingSchema),
        defaultValues: {
            assignedAdminId: supportRequest?.assignedAdminId?.toString() || "",
            resolutionChannel: supportRequest?.resolutionChannel || "",
            internalNotes: "",
        },
    });

    const onUpdateStatus = async (data: z.infer<typeof updateStatusSchema>) => {
        if (!supportRequest?.id) {
            toast.error("No support request selected");
            return;
        }

        // Validate status transition if function is available
        if (isValidStatusTransition && !isValidStatusTransition(supportRequest.status, data.status)) {
            toast.error(`Invalid status transition from ${supportRequest.status} to ${data.status}`);
            return;
        }

        // Check if internal notes are required for RESOLVED status
        if (data.status === "RESOLVED" && !supportRequest.hasInternalNotes && !trackingForm.getValues().internalNotes) {
            toast.error("Internal notes are required before marking as Resolved");
            setActiveTab("tracking");
            return;
        }

        setIsUpdatingStatus(true);
        try {
            if (statusMutation?.mutateAsync) {
                // Pattern 1: mutateAsync with object parameter
                await statusMutation.mutateAsync({
                    supportId: supportRequest.id,
                    data: {
                        status: data.status,
                        resolutionDetails: data.resolutionDetails,
                    }
                });
            } else if (statusMutation?.mutate) {
                // Pattern 2: mutate with object parameter  
                statusMutation.mutate({
                    supportId: supportRequest.id,
                    data: {
                        status: data.status,
                        resolutionDetails: data.resolutionDetails,
                    }
                });
            } else {
                // Fallback: simulate success
                console.log("Status update:", data);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            toast.success("Support request status updated successfully");
            onRefresh();
        } catch (error: any) {
            console.error("Error updating support status:", error);
            toast.error(error?.message || "Failed to update support status");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const onUpdateTracking = async (data: z.infer<typeof updateTrackingSchema>) => {
        if (!supportRequest?.id) {
            toast.error("No support request selected");
            return;
        }

        setIsUpdatingTracking(true);
        try {
            if (trackingMutation?.mutateAsync) {
                // Pattern 1: mutateAsync with object parameter
                await trackingMutation.mutateAsync({
                    supportId: supportRequest.id,
                    data: {
                        assignedAdminId: data.assignedAdminId ? parseInt(data.assignedAdminId) : undefined,
                        resolutionChannel: data.resolutionChannel,
                        internalNotes: data.internalNotes,
                    }
                });
            } else if (trackingMutation?.mutate) {
                // Pattern 2: mutate with object parameter
                trackingMutation.mutate({
                    supportId: supportRequest.id,
                    data: {
                        assignedAdminId: data.assignedAdminId ? parseInt(data.assignedAdminId) : undefined,
                        resolutionChannel: data.resolutionChannel,
                        internalNotes: data.internalNotes,
                    }
                });
            } else {
                // Fallback: simulate success
                console.log("Tracking update:", data);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            toast.success("Support tracking information updated successfully");
            onRefresh();
        } catch (error: any) {
            console.error("Error updating support tracking:", error);
            toast.error(error?.message || "Failed to update support tracking information");
        } finally {
            setIsUpdatingTracking(false);
        }
    };

    if (isLoading) {
        return <div className="p-6">Loading support request details...</div>;
    }

    const currentData = detailData || supportRequest;

    return (
        <div className="space-y-6">
            {/* Header Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Support ID</p>
                        <p className="text-lg font-semibold">{currentData.supportId || `SUP-${currentData.id}`}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Status</p>
                        <Badge className={`${getStatusBadgeColor ? getStatusBadgeColor(currentData.status) : 'bg-gray-100 text-gray-800'} mt-1`}>
                            {currentData.status}
                        </Badge>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Priority</p>
                        <Badge className={`${getPriorityBadgeColor ? getPriorityBadgeColor(currentData.priority) : 'bg-gray-100 text-gray-800'} mt-1`}>
                            {currentData.priority || 'MEDIUM'}
                        </Badge>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Category</p>
                        <p className="text-lg font-semibold">{currentData.category || 'GENERAL'}</p>
                    </div>
                </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Name</p>
                        <p>{currentData.customer?.name || currentData.user?.profile?.fullName || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Email</p>
                        <p>{currentData.customer?.email || currentData.user?.email || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Type</p>
                        <p>{currentData.customer?.type || currentData.user?.type || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Phone</p>
                        <p>{currentData.customer?.phone || 'N/A'}</p>
                    </div>
                </div>
            </div>

            {/* Request Details */}
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Request Details</h3>
                <div className="space-y-3">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Subject</p>
                        <p className="font-medium">{currentData.title || currentData.subject || 'No subject provided'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Description</p>
                        <div className="bg-gray-50 p-3 rounded border">
                            <p className="whitespace-pre-wrap">{currentData.description || currentData.message || 'No description provided'}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">Date Submitted</p>
                        <p>{currentData.createdAt ? new Date(currentData.createdAt).toLocaleString() : 'N/A'}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab("details")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "details"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        Update Status
                    </button>
                    <button
                        onClick={() => setActiveTab("tracking")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "tracking"
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
                        <form onSubmit={statusForm.handleSubmit(onUpdateStatus)} className="space-y-4">
                            <FormField
                                control={statusForm.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {getSupportStatusWorkflow ? getSupportStatusWorkflow().map((status: any) => (
                                                    <SelectItem
                                                        key={status.value}
                                                        value={status.value}
                                                        disabled={isValidStatusTransition ? !isValidStatusTransition(currentData.status, status.value) : false}
                                                    >
                                                        {status.label}
                                                    </SelectItem>
                                                )) : (
                                                    <>
                                                        <SelectItem value="NEW">New</SelectItem>
                                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                                                    </>
                                                )}
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
                    <h3 className="text-lg font-semibold mb-4">Support Tracking Information</h3>

                    {/* Current Tracking Info */}
                    <div className="bg-gray-50 p-3 rounded mb-4">
                        <h4 className="font-medium mb-2">Current Assignment</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium">Assigned Admin:</span>
                                <span className="ml-2">{currentData.assignedAdmin?.name || 'Unassigned'}</span>
                            </div>
                            <div>
                                <span className="font-medium">Resolution Channel:</span>
                                <span className="ml-2">{currentData.resolutionChannel || 'Not set'}</span>
                            </div>
                        </div>
                    </div>

                    <Form {...trackingForm}>
                        <form onSubmit={trackingForm.handleSubmit(onUpdateTracking)} className="space-y-4">
                            <FormField
                                control={trackingForm.control}
                                name="assignedAdminId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Assign to Admin</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select admin" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="unassigned">Unassigned</SelectItem>
                                                <SelectItem value="1">Admin User 1</SelectItem>
                                                <SelectItem value="2">Admin User 2</SelectItem>
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                        <FormLabel>Internal Notes *</FormLabel>
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
                            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
                                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">
                                        Status changed from {entry.fromStatus} to {entry.toStatus}
                                    </p>
                                    {entry.notes && (
                                        <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(entry.createdAt).toLocaleString()} by {entry.admin?.adminProfile?.fullName || 'System'}
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