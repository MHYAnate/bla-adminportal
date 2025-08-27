"use client";

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
import { SUPPORT_STATUSES, isValidStatusTransition } from "../constants/support-constants";
import type { SupportRequest, StatusUpdateData } from "../types/support-types";

const updateStatusSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED"]),
  resolutionDetails: z.string().optional(),
});

interface StatusUpdateFormProps {
  supportRequest: SupportRequest;
  onUpdate: (data: StatusUpdateData) => Promise<void>;
  isLoading: boolean;
}

const StatusUpdateForm: React.FC<StatusUpdateFormProps> = ({
  supportRequest,
  onUpdate,
  isLoading
}) => {
  const form = useForm({
    resolver: zodResolver(updateStatusSchema),
    defaultValues: {
      status: supportRequest.status,
      resolutionDetails: supportRequest.resolutionDetails || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof updateStatusSchema>) => {
    // Validate status transition
    if (!isValidStatusTransition(supportRequest.status, data.status)) {
      toast.error(
        `Invalid status transition from ${supportRequest.status} to ${data.status}`
      );
      return;
    }

    // Check if internal notes are required for RESOLVED status
    if (data.status === "RESOLVED" && !supportRequest.hasInternalNotes && !supportRequest.internalNotes) {
      toast.error("Internal notes are required before marking as Resolved. Please update tracking information first.");
      return;
    }

    try {
      await onUpdate({
        status: data.status,
        resolutionDetails: data.resolutionDetails,
      });
      
      toast.success("Support request status updated successfully");
    } catch (error: any) {
      console.error("Error updating support status:", error);
      toast.error(error?.message || "Failed to update support status");
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Update Status</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
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
                    {SUPPORT_STATUSES.map((status:any) => (
                      <SelectItem
                        key={status.value}
                        value={status.value}
                        disabled={!isValidStatusTransition(supportRequest.status, status.value)}
                      >
                        <div className="flex flex-col">
                          <span>{status.label}</span>
                          {!isValidStatusTransition(supportRequest.status, status.value) && (
                            <span className="text-xs text-gray-500">
                              Cannot transition from {supportRequest.status}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
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

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Updating..." : "Update Status"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default StatusUpdateForm;