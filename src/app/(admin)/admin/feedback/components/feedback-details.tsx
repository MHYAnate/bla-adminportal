// app/(admin)/admin/feedback/components/feedback-details.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LoadingSvg from "@/components/load";
import {
    useFeedbackDetails,
    getFeedbackTypeBadgeColor,
    getFeedbackStatusBadgeColor,
    getCustomerTypeDisplayName,
    formatRatingStars
} from "@/services/feedback";
import { CalendarIcon, UserIcon, MailIcon, ShoppingBagIcon } from "../../../../../../public/icons";

interface FeedbackDetailsProps {
    feedbackId: string | number;
    onClose: () => void;
}

const FeedbackDetails: React.FC<FeedbackDetailsProps> = ({
    feedbackId,
    onClose
}) => {
    const {
        data: feedbackData,
        isLoading,
        error
    } = useFeedbackDetails(feedbackId);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSvg />
            </div>
        );
    }

    if (error || !feedbackData) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <p className="text-red-600 mb-4">Error loading feedback details</p>
                <Button onClick={onClose}>Close</Button>
            </div>
        );
    }

    const feedback = feedbackData.data || feedbackData;

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-semibold text-purple-600">
                        {feedback.feedbackId || `FB-${feedback.id}`}
                    </h3>
                    <p className="text-gray-600 mt-1">{feedback.title || feedback.subject || 'Feedback'}</p>
                </div>
                <div className="flex space-x-2">
                    <Badge className={getFeedbackTypeBadgeColor(feedback.type)}>
                        {feedback.type}
                    </Badge>
                    <Badge className={getFeedbackStatusBadgeColor(feedback.status)}>
                        {feedback?.status?.replace('_', ' ') || ''}
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
                                {feedback.user?.profile?.fullName || feedback.user?.email || 'Anonymous'}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            <div className="flex items-center space-x-2">
                                <div className="h-4 w-4 text-gray-400">
                                    <MailIcon />
                                </div>
                                <p className="text-gray-900">{feedback.user?.email || 'N/A'}</p>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Customer Type</label>
                            <Badge variant="outline" className="mt-1">
                                {getCustomerTypeDisplayName(feedback.user?.type)}
                            </Badge>
                        </div>

                        {feedback.user?.profile?.phoneNumber && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Phone</label>
                                <p className="text-gray-900">{feedback.user.profile.phoneNumber}</p>
                            </div>
                        )}

                        {feedback.user?.profile?.address && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Address</label>
                                <p className="text-gray-900 text-sm">
                                    {typeof feedback.user.profile.address === 'string'
                                        ? feedback.user.profile.address
                                        : `${feedback.user.profile.address.street}, ${feedback.user.profile.address.city}, ${feedback.user.profile.address.state}`
                                    }
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Feedback Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <div className="h-5 w-5" >
                                <CalendarIcon />
                            </div>
                            <span>Feedback Details</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Type</label>
                            <Badge className={getFeedbackTypeBadgeColor(feedback.type)} variant="outline">
                                {feedback.type}
                            </Badge>
                        </div>

                        {feedback.rating && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Rating</label>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-yellow-500 text-lg">{formatRatingStars(feedback.rating)}</span>
                                    <span className="text-gray-600">({feedback.rating}/5)</span>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-medium text-gray-600">Submitted</label>
                            <p className="text-gray-900">
                                {new Date(feedback.createdAt).toLocaleDateString()} at{' '}
                                {new Date(feedback.createdAt).toLocaleTimeString()}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Last Updated</label>
                            <p className="text-gray-900">
                                {new Date(feedback.updatedAt).toLocaleDateString()} at{' '}
                                {new Date(feedback.updatedAt).toLocaleTimeString()}
                            </p>
                        </div>

                        {feedback.adminNotes && (
                            <div>
                                <label className="text-sm font-medium text-gray-600">Admin Notes</label>
                                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                    <p className="text-gray-800 text-sm">{feedback.adminNotes}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Related Information */}
            {(feedback.product || feedback.order) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <div className="h-5 w-5">
                                <ShoppingBagIcon />
                            </div>
                            <span>Related Information</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {feedback.product && (
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Related Product</label>
                                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                        <p className="font-medium text-gray-900">{feedback.product.name}</p>
                                        {feedback.product.description && (
                                            <p className="text-sm text-gray-600 mt-1">{feedback.product.description}</p>
                                        )}
                                        {feedback.product.category && (
                                            <Badge variant="outline" className="mt-2">
                                                {feedback.product.category.name}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )}

                            {feedback.order && (
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Related Order</label>
                                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                        <p className="font-medium text-gray-900">Order #{feedback.order.orderNumber}</p>
                                        <div className="text-sm text-gray-600 mt-1 space-y-1">
                                            <p>Status: <span className="font-medium">{feedback.order.status}</span></p>
                                            <p>Total: <span className="font-medium">${feedback.order.totalAmount}</span></p>
                                            <p>Date: {new Date(feedback.order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Feedback Message */}
            <Card>
                <CardHeader>
                    <CardTitle>Customer Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {feedback.message || 'No message provided'}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Attachments */}
            {feedback.attachments && feedback.attachments.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Attachments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {feedback.attachments.map((attachment: any, index: number) => (
                                <div key={index} className="border rounded-lg p-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {attachment.filename || `Attachment ${index + 1}`}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {attachment.fileSize && `${(attachment.fileSize / 1024).toFixed(1)} KB`}
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(attachment.url, '_blank')}
                                        >
                                            View
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Status History */}
            {feedback.statusHistory && feedback.statusHistory.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Status History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {feedback.statusHistory.map((history: any, index: number) => (
                                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0">
                                        <Badge className={getFeedbackStatusBadgeColor(history.status)} variant="outline">
                                            {history?.status?.replace('_', ' ') || ''}
                                        </Badge>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-800">
                                            Status changed to <strong>{history?.status?.replace('_', ' ') || ''}</strong>
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

            {/* Feedback Analytics */}
            {feedback.type === 'RATINGS' && feedback.rating && (
                <Card>
                    <CardHeader>
                        <CardTitle>Rating Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-900">{feedback.rating}</div>
                                <div className="text-sm text-gray-600">Out of 5</div>
                                <div className="text-yellow-500 mt-1">{formatRatingStars(feedback.rating)}</div>
                            </div>

                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-lg font-semibold text-gray-900">
                                    {feedback.rating >= 4 ? 'Positive' : feedback.rating >= 3 ? 'Neutral' : 'Negative'}
                                </div>
                                <div className="text-sm text-gray-600">Sentiment</div>
                                <div className={`w-3 h-3 rounded-full mx-auto mt-2 ${feedback.rating >= 4 ? 'bg-green-500' :
                                    feedback.rating >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}></div>
                            </div>

                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-lg font-semibold text-gray-900">
                                    {Math.round(feedback.rating * 20)}%
                                </div>
                                <div className="text-sm text-gray-600">Satisfaction</div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${feedback.rating * 20}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Similar Feedback */}
            {feedback.similarFeedback && feedback.similarFeedback.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Similar Feedback</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {feedback.similarFeedback.slice(0, 3).map((similar: any, index: number) => (
                                <div key={index} className="p-3 border rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-medium text-purple-600">{similar.feedbackId}</span>
                                        <Badge className={getFeedbackTypeBadgeColor(similar.type)} variant="outline">
                                            {similar.type}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2">{similar.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(similar.createdAt).toLocaleDateString()}
                                    </p>
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
                {feedback.status !== 'CLOSED' && (
                    <Button
                        onClick={() => {
                            // This would typically open the update modal
                            // You can pass a callback to handle this
                            console.log('Update feedback status:', feedback.id);
                        }}
                    >
                        Update Status
                    </Button>
                )}
                {feedback.user?.email && (
                    <Button
                        variant="outline"
                        onClick={() => {
                            window.location.href = `mailto:${feedback.user.email}?subject=Re: ${feedback.title || 'Your Feedback'}&body=Dear ${feedback.user.profile?.fullName || 'Customer'},%0D%0A%0D%0AThank you for your feedback...`;
                        }}
                    >
                        Reply to Customer
                    </Button>
                )}
            </div>
        </div>
    );
};

export default FeedbackDetails;