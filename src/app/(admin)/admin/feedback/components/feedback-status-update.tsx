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
    useUpdateFeedbackStatus,
    getFeedbackStatusBadgeColor,
    getFeedbackTypeBadgeColor,
    formatRatingStars
} from "@/services/feedback";
import { toast } from "sonner";

interface FeedbackStatusUpdateProps {
    feedback: any; // Keep it simple for now
    onSuccess: () => void;
    onClose: () => void;
}

const FeedbackStatusUpdate: React.FC<FeedbackStatusUpdateProps> = ({
    feedback,
    onSuccess,
    onClose
}) => {
    // Form state
    const [formData, setFormData] = useState({
        status: feedback.status || 'NEW',
        adminNotes: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Mutation
    const updateStatusMutation = useUpdateFeedbackStatus({
        onSuccess: () => {
            onSuccess();
            toast.success('Feedback status updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update feedback status');
        }
    });

    // Validation
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.status) {
            newErrors.status = 'Status is required';
        }

        if (formData.status === 'RESOLVED' && !formData.adminNotes.trim()) {
            newErrors.adminNotes = 'Admin notes are required when marking feedback as resolved';
        }

        if (formData.status === 'CLOSED' && !formData.adminNotes.trim()) {
            newErrors.adminNotes = 'Admin notes are required when closing feedback';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission - FIXED VERSION
    const handleSubmit = (): void => {
        if (!validateForm()) return;

        // Use mutate instead of mutateAsync and cast to any
        updateStatusMutation.mutate({
            feedbackId: feedback.id,
            data: {
                status: formData.status,
                adminNotes: formData.adminNotes
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

    const isLoading: boolean = updateStatusMutation.isPending;

    // Status descriptions
    const statusDescriptions: Record<string, string> = {
        NEW: "Feedback has been received and is awaiting review",
        REVIEWED: "Feedback has been reviewed by an admin",
        IN_PROGRESS: "Feedback is being actively addressed",
        RESOLVED: "Issues mentioned in feedback have been resolved",
        CLOSED: "Feedback has been fully processed and closed"
    };

    return (
        <div className="space-y-6">
            {/* Current Feedback Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Update Feedback Status</span>
                        <div className="flex space-x-2">
                            <Badge className={getFeedbackTypeBadgeColor(feedback.type)}>
                                {feedback.type}
                            </Badge>
                            <Badge className={getFeedbackStatusBadgeColor(feedback.status)}>
                                Current: {feedback?.status?.replace('_', ' ') || ''}
                            </Badge>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Feedback ID:</span> {feedback.feedbackId || `FB-${feedback.id}`}
                        </div>
                        <div>
                            <span className="font-medium">Customer:</span> {feedback.customer}
                        </div>
                        <div>
                            <span className="font-medium">Type:</span> {feedback.type}
                        </div>
                        <div>
                            <span className="font-medium">Submitted:</span> {feedback.formattedDate}
                        </div>
                        {feedback.rating && (
                            <div className="md:col-span-2">
                                <span className="font-medium">Rating:</span>
                                <span className="ml-2 text-yellow-500">{formatRatingStars(feedback.rating)}</span>
                                <span className="ml-1 text-gray-600">({feedback.rating}/5)</span>
                            </div>
                        )}
                    </div>

                    {/* Feedback Preview */}
                    <div className="mt-4">
                        <span className="font-medium text-sm">Feedback Message:</span>
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700 line-clamp-3">
                                {feedback.messageSnippet || feedback.message}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Status Update Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Update Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <AlertDescription>
                            <strong>Status Flow:</strong> New → Reviewed → In Progress → Resolved → Closed
                            <br />
                            Choose the appropriate status based on the current state of addressing this feedback.
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
                                <SelectItem value="REVIEWED">Reviewed</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="RESOLVED">Resolved</SelectItem>
                                <SelectItem value="CLOSED">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && (
                            <p className="text-sm text-red-600 mt-1">{errors.status}</p>
                        )}
                        {formData.status && statusDescriptions[formData.status] && (
                            <p className="text-sm text-gray-600 mt-1">
                                {statusDescriptions[formData.status]}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="adminNotes">
                            Admin Notes
                            {(formData.status === 'RESOLVED' || formData.status === 'CLOSED') &&
                                <span className="text-red-500"> *</span>
                            }
                        </Label>
                        <Textarea
                            id="adminNotes"
                            placeholder={
                                formData.status === 'RESOLVED'
                                    ? "Describe how the feedback was addressed or what actions were taken..."
                                    : formData.status === 'CLOSED'
                                        ? "Provide final notes about this feedback before closing..."
                                        : "Add any notes about the status change..."
                            }
                            value={formData.adminNotes}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                handleInputChange('adminNotes', e.target.value)
                            }
                            rows={4}
                            className={errors.adminNotes ? 'border-red-500' : ''}
                        />
                        {errors.adminNotes && (
                            <p className="text-sm text-red-600 mt-1">{errors.adminNotes}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                            {formData.status === 'RESOLVED' || formData.status === 'CLOSED'
                                ? "Required: Explain the resolution or closure reason for record keeping."
                                : "Optional: Add notes about this status change for team reference."
                            }
                        </p>
                    </div>

                    {/* Status-specific guidance */}
                    {formData.status === 'REVIEWED' && (
                        <Alert>
                            <AlertDescription>
                                <strong>Reviewed Status:</strong> Use this when an admin has looked at the feedback and determined next steps.
                            </AlertDescription>
                        </Alert>
                    )}

                    {formData.status === 'IN_PROGRESS' && (
                        <Alert>
                            <AlertDescription>
                                <strong>In Progress Status:</strong> Use this when actively working on addressing the feedback or implementing suggested changes.
                            </AlertDescription>
                        </Alert>
                    )}

                    {formData.status === 'RESOLVED' && (
                        <Alert>
                            <AlertDescription>
                                <strong>Resolved Status:</strong> Use this when the issues or suggestions in the feedback have been addressed.
                                This may trigger a notification to the customer if configured.
                            </AlertDescription>
                        </Alert>
                    )}

                    {formData.status === 'CLOSED' && (
                        <Alert>
                            <AlertDescription>
                                <strong>Closed Status:</strong> Use this for feedback that has been fully processed and no further action is needed.
                                This is the final state for feedback.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Status'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Impact Assessment (for certain feedback types) */}
            {(feedback.type === 'COMPLAINTS' || feedback.type === 'SUGGESTIONS') && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {feedback.type === 'COMPLAINTS' ? 'Complaint Impact' : 'Suggestion Value'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-red-50 rounded-lg">
                                <div className="text-lg font-semibold text-red-700">High</div>
                                <div className="text-sm text-red-600">
                                    {feedback.type === 'COMPLAINTS' ? 'Immediate Action Required' : 'High Value Suggestion'}
                                </div>
                            </div>
                            <div className="p-3 bg-yellow-50 rounded-lg">
                                <div className="text-lg font-semibold text-yellow-700">Medium</div>
                                <div className="text-sm text-yellow-600">
                                    {feedback.type === 'COMPLAINTS' ? 'Needs Attention' : 'Consider Implementation'}
                                </div>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <div className="text-lg font-semibold text-green-700">Low</div>
                                <div className="text-sm text-green-600">
                                    {feedback.type === 'COMPLAINTS' ? 'Minor Issue' : 'Nice to Have'}
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-3 text-center">
                            Consider the impact level when updating the status and planning follow-up actions.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default FeedbackStatusUpdate;