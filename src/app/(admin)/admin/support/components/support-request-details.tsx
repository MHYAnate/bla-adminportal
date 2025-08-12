"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LoadingSvg from "@/components/load";
import {
    useSupportRequestDetails,
    getStatusBadgeColor,
    getPriorityBadgeColor,
    getCategoryDisplayName
} from "@/services/support";
import { CalendarIcon, UserIcon, MailIcon, PhoneIcon } from "../../../../../../public/icons";

interface SupportRequestDetailsProps {
    supportId: string | number;
    onClose: () => void;
}

const SupportRequestDetails: React.FC<SupportRequestDetailsProps> = ({
    supportId,
    onClose
}) => {
    const {
        data: supportRequest,
        isLoading,
        error
    } = useSupportRequestDetails(supportId);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSvg />
            </div>
        );
    }

    if (error || !supportRequest) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <p className="text-red-600 mb-4">Error loading support request details</p>
                <Button onClick={onClose}>Close</Button>
            </div>
        );
    }

    const request = supportRequest.data || supportRequest;

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-semibold text-blue-600">
                        {request.supportId || `SUP-${request.id}`}
                    </h3>
                    <p className="text-gray-600 mt-1">{request.subject}</p>
                </div>
                <div className="flex space-x-2">
                    <Badge className={getStatusBadgeColor(request.status)}>
                        {request.status?.replace('_', ' ') || ''}
                    </Badge>
                    <Badge className={getPriorityBadgeColor(request.priority)}>
                        {request.priority}
                    </Badge>
                </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <div className="h-5 w-5">
                                <UserIcon />
                            </div>
                            <span>Customer Information</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Name</label>
                            <p className="text-gray-900">
                                {request.user?.profile?.fullName || request.user?.email || 'Unknown Customer'}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            <div className="flex items-center space-x-2">
                                <div className="h-4 w-4 text-gray-400">
                                    <MailIcon />
                                </div>
                                <p className="text-gray-900">{request.user?.email || 'N/A'}</p>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Customer Type</label>
                            <Badge variant="outline" className="mt-1">
                                {request.user?.type === 'business' ? 'Business Owner' : 'Individual'}
                            </Badge>
                        </div>

                        {request.user?.profile?.phoneNumber && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Phone</label>
                                <div className="flex items-center space-x-2">
                                    <div className="h-4 w-4 text-gray-400">
                                        <PhoneIcon />
                                    </div>
                                    <p className="text-gray-900">{request.user.profile.phoneNumber}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Request Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <div className="h-5 w-5">
                                <CalendarIcon />
                            </div>
                            <span>Request Details</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Category</label>
                            <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700">
                                {getCategoryDisplayName(request.category)}
                            </Badge>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Created</label>
                            <p className="text-gray-900">
                                {new Date(request.createdAt).toLocaleDateString()} at{' '}
                                {new Date(request.createdAt).toLocaleTimeString()}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Last Updated</label>
                            <p className="text-gray-900">
                                {new Date(request.updatedAt).toLocaleDateString()} at{' '}
                                {new Date(request.updatedAt).toLocaleTimeString()}
                            </p>
                        </div>

                        {request.resolvedAt && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Resolved</label>
                                <p className="text-gray-900">
                                    {new Date(request.resolvedAt).toLocaleDateString()} at{' '}
                                    {new Date(request.resolvedAt).toLocaleTimeString()}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Support Tracking Information */}
            {(request.assignedAdmin || request.resolutionChannel || request.internalNotes) && (
                <Card>
                    <CardHeader>
                        <CardTitle>Support Tracking Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Assigned Admin</label>
                                <p className="text-gray-900">
                                    {request.assignedAdmin?.adminProfile?.fullName ||
                                        request.assignedAdmin?.email ||
                                        'Unassigned'}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Resolution Channel</label>
                                <p className="text-gray-900">
                                    {request.resolutionChannel || 'Not specified'}
                                </p>
                            </div>
                        </div>

                        {request.internalNotes && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Internal Notes</label>
                                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                    <p className="text-gray-800 whitespace-pre-wrap">{request.internalNotes}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Message Content */}
            <Card>
                <CardHeader>
                    <CardTitle>Customer Message</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {request.message || 'No message provided'}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Related Information */}
            {(request.product || request.order) && (
                <Card>
                    <CardHeader>
                        <CardTitle>Related Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {request.product && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Related Product</label>
                                <p className="text-gray-900">{request.product.name}</p>
                                {request.product.description && (
                                    <p className="text-sm text-gray-600 mt-1">{request.product.description}</p>
                                )}
                            </div>
                        )}

                        {request.order && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Related Order</label>
                                <p className="text-gray-900">Order #{request.order.orderNumber}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Status: {request.order.status} |
                                    Total: ${request.order.totalAmount}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Support History/Timeline */}
            {request.statusHistory && request.statusHistory.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Status History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {request.statusHistory.map((history: any, index: number) => (
                                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0">
                                        <Badge className={getStatusBadgeColor(history.status)} variant="outline">
                                            {history.status?.replace('_', ' ') || ''}
                                        </Badge>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-800">
                                            Status changed to <strong>{history.status?.replace('_', ' ') || ''}</strong>
                                            {history.adminUser && ` by ${history.adminUser.adminProfile?.fullName || history.adminUser.email}`}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(history.createdAt).toLocaleDateString()} at{' '}
                                            {new Date(history.createdAt).toLocaleTimeString()}
                                        </p>
                                        {history.notes && (
                                            <p className="text-sm text-gray-600 mt-2 italic">"{history.notes}"</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={onClose}>
                    Close
                </Button>
                {request.status !== 'RESOLVED' && (
                    <Button
                        onClick={() => {
                            // This would typically open the update modal
                            // You can pass a callback to handle this
                            console.log('Update support request:', request.id);
                        }}
                    >
                        Update Request
                    </Button>
                )}
            </div>
        </div>
    );
};

export default SupportRequestDetails;