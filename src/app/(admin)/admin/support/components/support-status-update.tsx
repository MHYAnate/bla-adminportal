"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    useUpdateSupportStatus,
    useUpdateSupportTracking,
    getStatusBadgeColor
} from "@/services/support";
import { useGetAdmins } from "@/services/admin";
import { toast } from "sonner";

// =================== TYPESCRIPT INTERFACES ===================

interface SupportRequestData {
    id: string | number;
    supportId?: string;
    customer: string;
    subject: string;
    category: string;
    status: string;
    assignedAdminId?: number | string;
    resolutionChannel?: string;
    internalNotes?: string;
}

interface AdminData {
    id: number;
    email: string;
    adminProfile?: {
        fullName: string;
    };
}

interface SupportStatusUpdateProps {
    supportRequest: SupportRequestData;
    onSuccess: () => void;
    onClose: () => void;
}

// =================== COMPONENT ===================

const SupportStatusUpdate: React.FC<SupportStatusUpdateProps> = ({
    supportRequest,
    onSuccess,
    onClose
}) => {
    // Form state
    const [formData, setFormData] = useState({
        status: supportRequest.status || 'NEW',
        assignedAdminId: supportRequest.assignedAdminId?.toString() || '',
        resolutionChannel: supportRequest.resolutionChannel || '',
        internalNotes: supportRequest.internalNotes || ''
    });

    const [activeTab, setActiveTab] = useState<'status' | 'tracking'>('status');
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Get available admins for assignment
    const { adminsData, isAdminsLoading } = useGetAdmins({ enabled: true });
    const adminsList = Array.isArray(adminsData) ? adminsData : [];

    // Mutations
    const updateStatusMutation = useUpdateSupportStatus({
        onSuccess: () => {
            onSuccess();
            toast.success('Support request status updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update status');
        }
    });

    const updateTrackingMutation = useUpdateSupportTracking({
        onSuccess: () => {
            onSuccess();
            toast.success('Support tracking information updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update tracking information');
        }
    });

    // Validation
    const validateForm = (type: 'status' | 'tracking'): boolean => {
        const newErrors: Record<string, string> = {};

        if (type === 'status') {
            if (!formData.status) {
                newErrors.status = 'Status is required';
            }

            // Check status transition rules: New → In Progress → Resolved
            if (formData.status === 'RESOLVED' && !formData.internalNotes.trim()) {
                newErrors.internalNotes = 'Internal notes are required before marking as resolved';
            }
        }

        if (type === 'tracking') {
            if (formData.assignedAdminId && isNaN(Number(formData.assignedAdminId))) {
                newErrors.assignedAdminId = 'Please select a valid admin';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission - FIXED VERSION
    const handleStatusUpdate = (): void => {
        if (!validateForm('status')) return;

        updateStatusMutation.mutate({
            supportId: supportRequest.id,
            data: {
                status: formData.status,
                internalNotes: formData.internalNotes
            }
        } as any);
    };

    const handleTrackingUpdate = (): void => {
        if (!validateForm('tracking')) return;

        updateTrackingMutation.mutate({
            supportId: supportRequest.id,
            data: {
                assignedAdminId: formData.assignedAdminId ? Number(formData.assignedAdminId) : null,
                resolutionChannel: formData.resolutionChannel,
                internalNotes: formData.internalNotes
            }
        } as any);
    };

    const handleInputChange = (field: string, value: string): void => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear errors for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const isLoading: boolean = updateStatusMutation.isPending || updateTrackingMutation.isPending;

    return (
        <div className="space-y-6">
            {/* Current Request Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Update Support Request</span>
                        <Badge className={getStatusBadgeColor(supportRequest.status)}>
                            Current: {supportRequest.status?.replace('_', ' ') || ''}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Ticket ID:</span> {supportRequest.supportId || `SUP-${supportRequest.id}`}
                        </div>
                        <div>
                            <span className="font-medium">Customer:</span> {supportRequest.customer}
                        </div>
                        <div>
                            <span className="font-medium">Subject:</span> {supportRequest.subject}
                        </div>
                        <div>
                            <span className="font-medium">Category:</span> {supportRequest.category}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tab Navigation */}
            <div className="flex space-x-1 border-b">
                <Button
                    variant={activeTab === 'status' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('status')}
                    className="rounded-b-none"
                >
                    Update Status
                </Button>
                <Button
                    variant={activeTab === 'tracking' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('tracking')}
                    className="rounded-b-none"
                >
                    Tracking Information
                </Button>
            </div>

            {/* Status Update Form */}
            {activeTab === 'status' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Update Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <AlertDescription>
                                <strong>Status Flow:</strong> New → In Progress → Resolved
                                <br />
                                Internal notes are required when marking a ticket as "Resolved".
                            </AlertDescription>
                        </Alert>

                        <div>
                            <Label htmlFor="status">New Status *</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: string) => handleInputChange('status', value)}
                            >
                                <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NEW">New</SelectItem>
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-red-600 mt-1">{errors.status}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="internalNotes">
                                Internal Resolution Notes
                                {formData.status === 'RESOLVED' && <span className="text-red-500"> *</span>}
                            </Label>
                            <Textarea
                                id="internalNotes"
                                placeholder="Describe how the issue was resolved or your notes about the current status..."
                                value={formData.internalNotes}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    handleInputChange('internalNotes', e.target.value)
                                }
                                rows={4}
                                className={errors.internalNotes ? 'border-red-500' : ''}
                            />
                            {errors.internalNotes && (
                                <p className="text-sm text-red-600 mt-1">{errors.internalNotes}</p>
                            )}
                            <p className="text-sm text-gray-500 mt-1">
                                These notes are for internal use and will help track the resolution process.
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <Button variant="outline" onClick={onClose} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button onClick={handleStatusUpdate} disabled={isLoading}>
                                {isLoading ? 'Updating...' : 'Update Status'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Tracking Information Form */}
            {activeTab === 'tracking' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Support Tracking Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <AlertDescription>
                                Update the tracking information to better manage and monitor support requests.
                            </AlertDescription>
                        </Alert>

                        <div>
                            <Label htmlFor="assignedAdminId">Assigned Admin</Label>
                            <Select
                                value={formData.assignedAdminId}
                                onValueChange={(value: string) => handleInputChange('assignedAdminId', value)}
                            >
                                <SelectTrigger className={errors.assignedAdminId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select admin to assign" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Unassigned</SelectItem>
                                    {adminsList.map((admin: AdminData) => (
                                        <SelectItem key={admin.id} value={admin.id.toString()}>
                                            {admin.adminProfile?.fullName || admin.email}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.assignedAdminId && (
                                <p className="text-sm text-red-600 mt-1">{errors.assignedAdminId}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="resolutionChannel">Issue Resolution Channel</Label>
                            <Select
                                value={formData.resolutionChannel}
                                onValueChange={(value: string) => handleInputChange('resolutionChannel', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select communication channel" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Not specified</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="phone">Phone Call</SelectItem>
                                    <SelectItem value="chat">Live Chat</SelectItem>
                                    <SelectItem value="in-person">In Person</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-sm text-gray-500 mt-1">
                                How was or will this issue be communicated with the customer?
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="trackingNotes">Internal Notes</Label>
                            <Textarea
                                id="trackingNotes"
                                placeholder="Add any internal notes about this support request..."
                                value={formData.internalNotes}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    handleInputChange('internalNotes', e.target.value)
                                }
                                rows={3}
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Internal notes for team reference and tracking purposes.
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <Button variant="outline" onClick={onClose} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button onClick={handleTrackingUpdate} disabled={isLoading}>
                                {isLoading ? 'Updating...' : 'Update Tracking Info'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default SupportStatusUpdate;