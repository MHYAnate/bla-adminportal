// src/components/widgets/feeedback.tsx (update existing or create new)
"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getFeedbackTypeBadgeColor,
  getFeedbackStatusBadgeColor,
  formatRatingStars
} from "@/services/feedback";

interface FeedbackCardProps {
  feedback: {
    id: number;
    feedbackId: string;
    type: string;
    customer: string;
    customerType: string;
    customerEmail: string;
    messageSnippet: string;
    rating?: number;
    ratingStars?: string;
    status: string;
    product?: string;
    title?: string;
    formattedDate: string;
    formattedTime: string;
  };
  onClick: () => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, onClick }) => {
  return (
    <Card
      className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-900">{feedback.feedbackId}</p>
              <p className="text-xs text-gray-500">{feedback.formattedDate}</p>
            </div>
            <Badge className={`${getFeedbackTypeBadgeColor(feedback.type)} text-xs`}>
              {feedback.type}
            </Badge>
          </div>

          {/* Customer Info */}
          <div>
            <p className="font-medium text-gray-900">{feedback.customer}</p>
            <p className="text-sm text-gray-600">{feedback.customerType}</p>
            <p className="text-xs text-gray-500">{feedback.customerEmail}</p>
          </div>

          {/* Feedback Content */}
          <div>
            {feedback.title && (
              <p className="font-medium text-sm text-gray-900 mb-1">{feedback.title}</p>
            )}
            <p className="text-sm text-gray-700 line-clamp-3">{feedback.messageSnippet}</p>
          </div>

          {/* Rating */}
          {feedback.rating && (
            <div className="flex items-center gap-2">
              <span className="text-sm">{feedback.ratingStars}</span>
              <span className="text-xs text-gray-500">({feedback.rating}/5)</span>
            </div>
          )}

          {/* Product */}
          {feedback.product && feedback.product !== 'N/A' && (
            <div>
              <p className="text-xs text-gray-500">Product: {feedback.product}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <Badge className={`${getFeedbackStatusBadgeColor(feedback.status)} text-xs`}>
              {feedback.status}
            </Badge>
            <p className="text-xs text-gray-500">{feedback.formattedTime}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;