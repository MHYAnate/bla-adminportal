// // src/components/widgets/feeedback.tsx (update existing or create new)
// "use client";

// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   getFeedbackTypeBadgeColor,
//   getFeedbackStatusBadgeColor,
//   formatRatingStars
// } from "@/services/feedback";

// interface FeedbackCardProps {
//   feedback: {
//     id: number;
//     feedbackId: string;
//     type: string;
//     customer: string;
//     customerType: string;
//     customerEmail: string;
//     messageSnippet: string;
//     rating?: number;
//     ratingStars?: string;
//     status: string;
//     product?: string;
//     title?: string;
//     formattedDate: string;
//     formattedTime: string;
//   };
//   onClick: () => void;
// }

// const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, onClick }) => {
//   return (
//     <Card
//       className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
//       onClick={onClick}
//     >
//       <CardContent className="p-4">
//         <div className="space-y-3">
//           {/* Header */}
//           <div className="flex justify-between items-start">
//             <div>
//               <p className="text-sm font-medium text-gray-900">{feedback.feedbackId}</p>
//               <p className="text-xs text-gray-500">{feedback.formattedDate}</p>
//             </div>
//             <Badge className={`${getFeedbackTypeBadgeColor(feedback.type)} text-xs`}>
//               {feedback.type}
//             </Badge>
//           </div>

//           {/* Customer Info */}
//           <div>
//             <p className="font-medium text-gray-900">{feedback.customer}</p>
//             <p className="text-sm text-gray-600">{feedback.customerType}</p>
//             <p className="text-xs text-gray-500">{feedback.customerEmail}</p>
//           </div>

//           {/* Feedback Content */}
//           <div>
//             {feedback.title && (
//               <p className="font-medium text-sm text-gray-900 mb-1">{feedback.title}</p>
//             )}
//             <p className="text-sm text-gray-700 line-clamp-3">{feedback.messageSnippet}</p>
//           </div>

//           {/* Rating */}
//           {feedback.rating && (
//             <div className="flex items-center gap-2">
//               <span className="text-sm">{feedback.ratingStars}</span>
//               <span className="text-xs text-gray-500">({feedback.rating}/5)</span>
//             </div>
//           )}

//           {/* Product */}
//           {feedback.product && feedback.product !== 'N/A' && (
//             <div>
//               <p className="text-xs text-gray-500">Product: {feedback.product}</p>
//             </div>
//           )}

//           {/* Footer */}
//           <div className="flex justify-between items-center pt-2 border-t border-gray-100">
//             <Badge className={`${getFeedbackStatusBadgeColor(feedback.status)} text-xs`}>
//               {feedback.status}
//             </Badge>
//             <p className="text-xs text-gray-500">{feedback.formattedTime}</p>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default FeedbackCard;

"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getFeedbackTypeBadgeColor,
  getFeedbackStatusBadgeColor,
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
      className="border border-gray-200 bg-white rounded-xl transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.01] hover:rounded-xl cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-10 ">
        {/* Header with Avatar and Customer Info */}
        <div className="flex gap-4 items-center mb-10">
          <Image
            width={100}
            height={100}
            alt="Customer avatar"
            src="/images/user-avatar.jpg"
            className="w-[100px] h-[100px] rounded-full object-cover"
          />
          <div>
            <h6 className="text-[#111827] font-bold text-xl mb-2">{feedback.customer}</h6>
            <p className="text-sm text-[#687588] mb-1">{feedback.customerType}</p>
            <p className="text-xs text-[#9CA3AF]">{feedback.customerEmail}</p>
          </div>
        </div>

        {/* Feedback Type */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#111827] font-semibold">Feedback Type</p>
          <Badge className={`${getFeedbackTypeBadgeColor(feedback.type)} text-xs`}>
            {feedback.type}
          </Badge>
        </div>

        {/* Feedback ID */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#111827] font-semibold">Feedback ID</p>
          <p className="text-sm text-[#687588]">#{feedback.feedbackId}</p>
        </div>

        {/* Date & Time */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#111827] font-semibold">Date Submitted</p>
          <p className="text-sm text-[#687588]">
            {feedback.formattedDate}, at {feedback.formattedTime}
          </p>
        </div>

        {/* Title */}
        {feedback.title && (
          <div className="mb-6">
            <p className="text-sm text-[#111827] font-semibold">Title</p>
            <p className="text-sm text-[#687588]">{feedback.title}</p>
          </div>
        )}

        {/* Rating */}
        {feedback.rating && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-[#111827] font-semibold">Rating</p>
            <div className="flex items-center gap-2 text-sm text-[#687588]">
              <span>{feedback.ratingStars}</span>
              <span className="text-xs text-[#9CA3AF]">({feedback.rating}/5)</span>
            </div>
          </div>
        )}

        {/* Product Info */}
        {feedback.product && feedback.product !== "N/A" && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-[#111827] font-semibold">Product</p>
            <p className="text-sm text-[#687588]">{feedback.product}</p>
          </div>
        )}

        {/* Feedback Message */}
        <div className="mb-6">
          <p className="text-sm text-[#111827] font-semibold mb-4">Feedback Message</p>
          <p className="text-sm text-[#687588] line-clamp-3">{feedback.messageSnippet}</p>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* <Badge className={`${getFeedbackStatusBadgeColor(feedback.status)} text-xs`}>
            {feedback.status}
          </Badge> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;