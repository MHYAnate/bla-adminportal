// src/app/(admin)/admin/feedback/components/view-feedback.tsx
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
import Image from "next/image";

// Type definitions
type FeedbackStatus = 'NEW' | 'REVIEWED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

interface StatusOption {
    value: string;
    label: string;
    description: string;
}

// Import the functions - fallback if they don't exist
let useFeedbackDetails: any, useUpdateFeedbackStatus: any, getFeedbackStatusBadgeColor: any,
    getFeedbackTypeBadgeColor: any, getFeedbackStatusWorkflow: any, formatRatingStars: any,
    isValidFeedbackTransition: any;

try {
    const feedbackService = require("@/services/feedback");
    useFeedbackDetails = feedbackService.useFeedbackDetails;
    useUpdateFeedbackStatus = feedbackService.useUpdateFeedbackStatus;
    getFeedbackStatusBadgeColor = feedbackService.getFeedbackStatusBadgeColor;
    getFeedbackTypeBadgeColor = feedbackService.getFeedbackTypeBadgeColor;
    getFeedbackStatusWorkflow = feedbackService.getFeedbackStatusWorkflow;
    formatRatingStars = feedbackService.formatRatingStars;
    isValidFeedbackTransition = feedbackService.isValidFeedbackTransition;
} catch (error) {
    console.log("Some feedback service functions not available, using fallbacks");
    // Fallback functions with proper types
    useFeedbackDetails = () => ({ data: null, isLoading: false });
    useUpdateFeedbackStatus = () => ({ mutate: () => { }, isPending: false });
    getFeedbackStatusBadgeColor = () => "bg-gray-100 text-gray-800";
    getFeedbackTypeBadgeColor = () => "bg-blue-100 text-blue-800";
    getFeedbackStatusWorkflow = (): StatusOption[] => [
        { value: 'NEW', label: 'New', description: 'Newly submitted' },
        { value: 'REVIEWED', label: 'Reviewed', description: 'Has been reviewed' },
        { value: 'IN_PROGRESS', label: 'In Progress', description: 'Being worked on' },
        { value: 'RESOLVED', label: 'Resolved', description: 'Has been resolved' },
        { value: 'CLOSED', label: 'Closed', description: 'Closed and archived' },
    ];
    formatRatingStars = (rating: number): string => {
        if (!rating) return '☆☆☆☆☆';
        const filled = '★'.repeat(Math.floor(rating));
        const empty = '☆'.repeat(5 - Math.floor(rating));
        return filled + empty;
    };
    isValidFeedbackTransition = (currentStatus: string, newStatus: string): boolean => {
        const transitions: Record<FeedbackStatus, FeedbackStatus[]> = {
            'NEW': ['REVIEWED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
            'REVIEWED': ['IN_PROGRESS', 'RESOLVED', 'CLOSED'],
            'IN_PROGRESS': ['RESOLVED', 'CLOSED', 'REVIEWED'],
            'RESOLVED': ['CLOSED', 'IN_PROGRESS'],
            'CLOSED': ['IN_PROGRESS']
        };
        return transitions[currentStatus as FeedbackStatus]?.includes(newStatus as FeedbackStatus) || false;
    };
}

const updateStatusSchema = z.object({
    status: z.enum(["NEW", "REVIEWED", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
    adminNotes: z.string().optional(),
});

interface ViewFeedbackProps {
    feedback: any;
    onClose: () => void;
    onRefresh: () => void;
}

const ViewFeedback: React.FC<ViewFeedbackProps> = ({
    feedback,
    onClose,
    onRefresh
}) => {
    // Fetch detailed feedback data with fallback
    const { data: detailData, isLoading } = useFeedbackDetails ?
        useFeedbackDetails(feedback?.id) :
        { data: null, isLoading: false };

    // Mutation for updating status with fallback
    const updateStatusMutation = useUpdateFeedbackStatus ?
        useUpdateFeedbackStatus({
            onSuccess: () => {
                toast.success("Feedback status updated successfully");
                onRefresh();
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || "Failed to update feedback status");
            }
        }) :
        {
            mutate: (vars: any) => {
                toast.success("Status update completed (demo mode)");
                onRefresh();
            },
            isPending: false
        };

    // Form for status update
    const statusForm = useForm({
        resolver: zodResolver(updateStatusSchema),
        defaultValues: {
            status: (feedback?.status as FeedbackStatus) || "NEW",
            adminNotes: "",
        },
    });

    const onUpdateStatus = (data: z.infer<typeof updateStatusSchema>) => {
        // Validate status transition
        if (isValidFeedbackTransition && !isValidFeedbackTransition(feedback.status, data.status)) {
            toast.error(`Invalid status transition from ${feedback.status} to ${data.status}`);
            return;
        }

        // Call mutation with correct parameters
        updateStatusMutation.mutate({
            feedbackId: feedback.id,
            data: {
                status: data.status,
                adminNotes: data.adminNotes,
            }
        });
    };

    if (isLoading) {
        return (
            <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading feedback details...</p>
            </div>
        );
    }

    const currentData = detailData || feedback;

    console.log( detailData, " detailData")

    console.log( feedback, " feedback")

    return (
        // <div className="space-y-6">
        //     {/* Feedback Header */}
        //     <div className="bg-gray-50 p-4 rounded-lg">
        //         <div className="grid grid-cols-2 gap-4">
        //             <div>
        //                 <p className="text-sm font-medium text-gray-600">Feedback ID</p>
        //                 <p className="text-lg font-semibold">{currentData.feedbackId || `FB-${currentData.id}`}</p>
        //             </div>
        //             <div>
        //                 <p className="text-sm font-medium text-gray-600">Type</p>
        //                 <Badge className={`${getFeedbackTypeBadgeColor ? getFeedbackTypeBadgeColor(currentData.type) : 'bg-blue-100 text-blue-800'} mt-1`}>
        //                     {currentData.type}
        //                 </Badge>
        //             </div>
        //             <div>
        //                 <p className="text-sm font-medium text-gray-600">Status</p>
        //                 <Badge className={`${getFeedbackStatusBadgeColor ? getFeedbackStatusBadgeColor(currentData.status) : 'bg-gray-100 text-gray-800'} mt-1`}>
        //                     {currentData.status}
        //                 </Badge>
        //             </div>
        //             <div>
        //                 <p className="text-sm font-medium text-gray-600">Date Submitted</p>
        //                 <p>{new Date(currentData.createdAt).toLocaleDateString()}</p>
        //             </div>
        //         </div>
        //     </div>

        //     {/* Customer Information */}
        //     <div className="bg-white border border-gray-200 p-4 rounded-lg">
        //         <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
        //         <div className="grid grid-cols-2 gap-4">
        //             <div>
        //                 <p className="text-sm font-medium text-gray-600">Name</p>
        //                 <p>{currentData.customer?.name || currentData.user?.profile?.fullName || 'N/A'}</p>
        //             </div>
        //             <div>
        //                 <p className="text-sm font-medium text-gray-600">Email</p>
        //                 <p>{currentData.customer?.email || currentData.user?.email || 'N/A'}</p>
        //             </div>
        //             <div>
        //                 <p className="text-sm font-medium text-gray-600">Customer Type</p>
        //                 <p>{currentData.customer?.type || (currentData.user?.type === 'business' ? 'Business Owner' : 'Individual') || 'N/A'}</p>
        //             </div>
        //             <div>
        //                 <p className="text-sm font-medium text-gray-600">Phone</p>
        //                 <p>{currentData.customer?.phone || 'N/A'}</p>
        //             </div>
        //         </div>
        //     </div>

        //     {/* Feedback Content */}
        //     <div className="bg-white border border-gray-200 p-4 rounded-lg">
        //         <h3 className="text-lg font-semibold mb-3">Feedback Content</h3>

        //         {currentData.title && (
        //             <div className="mb-3">
        //                 <p className="text-sm font-medium text-gray-600">Subject</p>
        //                 <p className="font-medium">{currentData.title}</p>
        //             </div>
        //         )}

        //         <div className="mb-3">
        //             <p className="text-sm font-medium text-gray-600">Message</p>
        //             <div className="bg-gray-50 p-3 rounded border mt-1">
        //                 <p className="whitespace-pre-wrap">{currentData.message}</p>
        //             </div>
        //         </div>

        //         {currentData.rating && (
        //             <div className="mb-3">
        //                 <p className="text-sm font-medium text-gray-600">Rating</p>
        //                 <div className="flex items-center gap-2 mt-1">
        //                     <span className="text-lg">{formatRatingStars ? formatRatingStars(currentData.rating) : `${currentData.rating}/5 ⭐`}</span>
        //                     <span className="text-sm text-gray-500">({currentData.rating}/5)</span>
        //                 </div>
        //             </div>
        //         )}

        //         {currentData.category && (
        //             <div className="mb-3">
        //                 <p className="text-sm font-medium text-gray-600">Category</p>
        //                 <p>{currentData.category}</p>
        //             </div>
        //         )}

        //         {currentData.product && (
        //             <div className="mb-3">
        //                 <p className="text-sm font-medium text-gray-600">Related Product</p>
        //                 <p>{typeof currentData.product === 'object' ? currentData.product.name : currentData.product}</p>
        //             </div>
        //         )}
        //     </div>

        //     {/* Status Update Form */}
        //     <div className="bg-white border border-gray-200 p-4 rounded-lg">
        //         <h3 className="text-lg font-semibold mb-4">Update Status</h3>
        //         <Form {...statusForm}>
        //             <form onSubmit={statusForm.handleSubmit(onUpdateStatus)} className="space-y-4">
        //                 <FormField
        //                     control={statusForm.control}
        //                     name="status"
        //                     render={({ field }) => (
        //                         <FormItem>
        //                             <FormLabel>Status</FormLabel>
        //                             <Select onValueChange={field.onChange} defaultValue={field.value}>
        //                                 <FormControl>
        //                                     <SelectTrigger>
        //                                         <SelectValue placeholder="Select status" />
        //                                     </SelectTrigger>
        //                                 </FormControl>
        //                                 <SelectContent>
        //                                     {getFeedbackStatusWorkflow().map((status: StatusOption) => (
        //                                         <SelectItem
        //                                             key={status.value}
        //                                             value={status.value}
        //                                             disabled={isValidFeedbackTransition ? !isValidFeedbackTransition(currentData.status, status.value) : false}
        //                                         >
        //                                             <div>
        //                                                 <div className="font-medium">{status.label}</div>
        //                                                 <div className="text-xs text-gray-500">{status.description}</div>
        //                                             </div>
        //                                         </SelectItem>
        //                                     ))}
        //                                 </SelectContent>
        //                             </Select>
        //                             <FormMessage />
        //                         </FormItem>
        //                     )}
        //                 />

        //                 <FormField
        //                     control={statusForm.control}
        //                     name="adminNotes"
        //                     render={({ field }) => (
        //                         <FormItem>
        //                             <FormLabel>Admin Notes (Optional)</FormLabel>
        //                             <FormControl>
        //                                 <Textarea
        //                                     placeholder="Add notes about this status change..."
        //                                     className="min-h-[100px]"
        //                                     {...field}
        //                                 />
        //                             </FormControl>
        //                             <FormMessage />
        //                         </FormItem>
        //                     )}
        //                 />

        //                 <Button
        //                     type="submit"
        //                     disabled={updateStatusMutation.isPending}
        //                     className="w-full"
        //                 >
        //                     {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
        //                 </Button>
        //             </form>
        //         </Form>
        //     </div>
        // </div>








    //         <div className="flex flex-col bg-white p-10 rounded-xl shadow-sm">
    //   {/* Avatar */}
    //   <div className="mb-6">
    //     <Image
    //       width={100}
    //       height={100}
    //       alt="Customer avatar"
    //       src="/images/bladmin-login.jpg"
    //       className="w-[100px] h-[100px] rounded-full object-cover"
    //     />
    //   </div>

    //   {/* Customer Info */}
    //   <h6 className="text-[#111827] font-bold text-xl mb-2">
    //     {currentData.customer?.name || currentData.user?.profile?.fullName || "N/A"}
    //   </h6>
    //   <p className="text-sm text-[#687588] mb-6">
    //     {currentData.customer?.type || (currentData.user?.type === "business" ? "Business Owner" : "Individual") || "N/A"}
    //   </p>

    //   {/* Feedback Type */}
    //   <div className="flex items-center justify-between mb-6">
    //     <p className="text-sm text-[#111827] font-semibold">Feedback Type</p>
    //     <Badge className={`${getFeedbackTypeBadgeColor?.(currentData.type) || "bg-blue-100 text-blue-800"} text-xs`}>
    //       {currentData.type}
    //     </Badge>
    //   </div>

    //   {/* Feedback ID */}
    //   <div className="flex items-center justify-between mb-6">
    //     <p className="text-sm text-[#111827] font-semibold">Feedback ID</p>
    //     <p className="text-sm text-[#687588]">#{currentData.feedbackId || `FB-${currentData.id}`}</p>
    //   </div>

    //   {/* Date Submitted */}
    //   <div className="flex items-center justify-between mb-6">
    //     <p className="text-sm text-[#111827] font-semibold">Date Submitted</p>
    //     <p className="text-sm text-[#687588]">
    //       {new Date(currentData.createdAt).toLocaleDateString()} at {new Date(currentData.createdAt).toLocaleTimeString()}
    //     </p>
    //   </div>

    //   {/* Status */}
    //   <div className="flex items-center justify-between mb-6">
    //     <p className="text-sm text-[#111827] font-semibold">Status</p>
    //     <Badge className={`${getFeedbackStatusBadgeColor?.(currentData.status) || "bg-gray-100 text-gray-800"} text-xs`}>
    //       {currentData.status}
    //     </Badge>
    //   </div>

    //   {/* Rating */}
    //   {currentData.rating && (
    //     <div className="flex items-center justify-between mb-6">
    //       <p className="text-sm text-[#111827] font-semibold">Rating</p>
    //       <div className="flex items-center gap-2">
    //         <span className="text-sm text-[#687588]">
    //           {formatRatingStars?.(currentData.rating) || `${currentData.rating}/5 ⭐`}
    //         </span>
    //         <span className="text-xs text-gray-500">({currentData.rating}/5)</span>
    //       </div>
    //     </div>
    //   )}

    //   {/* Category */}
    //   {currentData.category && (
    //     <div className="flex items-center justify-between mb-6">
    //       <p className="text-sm text-[#111827] font-semibold">Category</p>
    //       <p className="text-sm text-[#687588]">{currentData.category}</p>
    //     </div>
    //   )}

    //   {/* Product */}
    //   {currentData.product && (
    //     <div className="flex items-center justify-between mb-6">
    //       <p className="text-sm text-[#111827] font-semibold">Related Product</p>
    //       <p className="text-sm text-[#687588]">
    //         {typeof currentData.product === "object" ? currentData.product.name : currentData.product}
    //       </p>
    //     </div>
    //   )}

    //   {/* Feedback Message */}
    //   <div className="mb-10">
    //     <p className="text-sm text-[#111827] font-semibold mb-4">Feedback Message</p>
    //     <p className="text-sm text-[#687588] whitespace-pre-wrap">{currentData.message}</p>
    //   </div>

    //   {/* Close Button */}
    //   <div className="flex justify-end">
    //     <Button
    //       variant="outline"
    //       className="font-bold text-base py-4 px-[52px] flex gap-2 items-center"
    //       size="xl"
    //     //   onClick={() => setClose(false)}
    //     >
    //       Close
    //     </Button>
    //   </div>
    // </div>

    <div className="flex flex-col bg-white px-10 pt-0 pb-10 rounded-xl shadow-sm">
    {/* Avatar */}
    <div className="flex items-start gap-6 mb-10">
  {/* Avatar */}
  <Image
    width={100}
    height={100}
    alt="Customer avatar"
    src="/images/user-avatar.jpg"
    className="w-[100px] h-[100px] rounded-full object-cover flex-shrink-0"
  />

  {/* Customer Info */}
  <div className="grid grid-cols-2 gap-x-10 gap-y-6 w-full">
    {/* Full Name */}
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
      <p className="text-base text-gray-800 font-semibold">
        {currentData.customer?.name || currentData.user?.profile?.fullName || "N/A"}
      </p>
    </div>

    {/* Customer Type */}
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Customer Type</p>
      <p className="text-base text-gray-800">
        {currentData.customer?.type ||
          (currentData.user?.type === "business" ? "Business Owner" : "Individual") ||
          "N/A"}
      </p>
    </div>

    {/* Email */}
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 break-words">Email</p>
      <p className="text-base text-gray-800">
        {currentData.customer?.email || currentData.user?.email || "N/A"}
      </p>
    </div>

    {/* Phone */}
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
      <p className="text-base text-gray-800">
        {currentData.customer?.phone || "N/A"}
      </p>
    </div>
  </div>
</div>

    {/* Feedback Type */}
    <div className="flex items-center justify-between mb-6">
      <p className="text-sm text-[#111827] font-semibold">Feedback Type</p>
      <Badge className={`${getFeedbackTypeBadgeColor?.(currentData.type) || "bg-blue-100 text-blue-800"} text-xs`}>
        {currentData.type}
      </Badge>
    </div>

    {/* Feedback ID */}
    <div className="flex items-center justify-between mb-6">
      <p className="text-sm text-[#111827] font-semibold">Feedback ID</p>
      <p className="text-sm text-[#687588]">#{currentData.feedbackId || `FB-${currentData.id}`}</p>
    </div>

    {/* Date Submitted */}
    <div className="flex items-center justify-between mb-6">
      <p className="text-sm text-[#111827] font-semibold">Date Submitted</p>
      <p className="text-sm text-[#687588]">
      {new Date(currentData.dateSubmitted).toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
})} at {new Date(currentData.dateSubmitted).toLocaleTimeString("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
})}
      </p>
    </div>

    {/* Status */}
    {/* <div className="flex items-center justify-between mb-6">
      <p className="text-sm text-[#111827] font-semibold">Status</p>
      <Badge className={`${getFeedbackStatusBadgeColor?.(currentData.status) || "bg-gray-100 text-gray-800"} text-xs`}>
        {currentData.status}
      </Badge>
    </div> */}

    {/* Rating */}
    {currentData.rating && (
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-[#111827] font-semibold mb-2">Rating</p>
          <div className="text-lg text-[#FBBF24]">{formatRatingStars?.(currentData.rating)}</div>
        </div>
        <p className="text-sm text-[#687588] font-medium">{currentData.rating} Rating</p>
      </div>
    )}

    {/* Category */}
    {currentData.category && (
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[#111827] font-semibold">Category</p>
        <p className="text-sm text-[#687588]">{currentData.category}</p>
      </div>
    )}

    {/* Product */}
    {currentData.product && (
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[#111827] font-semibold">Related Product</p>
        <p className="text-sm text-[#687588]">
          {typeof currentData.product === "object" ? currentData.product.name : currentData.product}
        </p>
      </div>
    )}

    {/* Feedback Message */}
    <div className="mb-6">
      <p className="text-sm text-[#111827] font-semibold mb-4">Feedback Message</p>
      <p className="text-sm text-[#687588] whitespace-pre-wrap">{currentData.message}</p>
    </div>
  </div>


    );
};

export default ViewFeedback;