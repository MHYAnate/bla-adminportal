"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCreateCategory, useUpdateCategory } from "@/services/categories";

const categorySchema = z.object({
    name: z
        .string()
        .min(1, "Category name is required")
        .max(100, "Category name must be less than 100 characters")
        .trim(),
    description: z
        .string()
        .max(500, "Description must be less than 500 characters")
        .optional()
        .or(z.literal("")),
});

interface CategoryFormProps {
    isOpen: boolean;
    onClose: () => void;
    category?: {
        id: string;
        name: string;
        description?: string;
    };
    mode: 'create' | 'edit';
    onSuccess?: (data: any) => void;
}

const CategoryForm = ({
    isOpen,
    onClose,
    category,
    mode,
    onSuccess
}: CategoryFormProps) => {
    const form = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: category?.name || "",
            description: category?.description || "",
        },
        mode: 'onChange',
    });

    const { createCategory, isCreating } = useCreateCategory();
    const { updateCategory, isUpdating } = useUpdateCategory();

    const isSubmitting = isCreating || isUpdating;

    // Reset form when category changes or modal opens/closes
    React.useEffect(() => {
        if (isOpen) {
            form.reset({
                name: category?.name || "",
                description: category?.description || "",
            });
        }
    }, [isOpen, category, form]);

    const handleClose = () => {
        form.reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={!isSubmitting ? handleClose : undefined}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {mode === 'create' ? 'Create Category' : 'Edit Category'}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {mode === 'create'
                                    ? 'Enter details of the category'
                                    : 'Update category information'
                                }
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={isSubmitting}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="p-6">
                        <Form {...form}>
                            <div className="space-y-6">
                                {/* Category Image Placeholder */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700">
                                        Category Image
                                    </label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center bg-gray-50">
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                                                <svg
                                                    className="w-6 h-6 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 4v16m8-8H4"
                                                    />
                                                </svg>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-1">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                SVG, PNG, JPG or GIF (max. 800x400px)
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Category Details Section */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-gray-700">Category Details</h3>

                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Category Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g., Frozen Foods, Electronics"
                                                        {...field}
                                                        disabled={isSubmitting}
                                                        className="h-12 border-gray-200 focus:border-[#F7931E] focus:ring-[#F7931E]"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-gray-700">
                                                    Description
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe what products belong to this category..."
                                                        className="min-h-[100px] resize-none border-gray-200 focus:border-[#F7931E] focus:ring-[#F7931E]"
                                                        {...field}
                                                        disabled={isSubmitting}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Form Actions */}
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleClose}
                                        disabled={isSubmitting}
                                        className="flex-1 h-12 border-gray-200 text-gray-600 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Button>

                                    {/* Main submit button */}
                                    <Button
                                        type="button"
                                        onClick={async () => {
                                            const formValues = form.getValues();

                                            if (!formValues.name?.trim()) {
                                                toast.error("Please enter a category name");
                                                return;
                                            }

                                            // Validate form
                                            const isValid = await form.trigger();

                                            if (!isValid) {
                                                toast.error("Please fix form errors before submitting");
                                                return;
                                            }

                                            // Call create/update function
                                            try {
                                                let result;
                                                if (mode === 'create') {
                                                    result = await createCategory(formValues);
                                                } else if (mode === 'edit' && category) {
                                                    result = await updateCategory({
                                                        id: category.id,
                                                        ...formValues
                                                    });
                                                }

                                                toast.success(`Category ${mode === 'create' ? 'created' : 'updated'} successfully!`);

                                                if (onSuccess && result) {
                                                    onSuccess(result);
                                                }

                                                handleClose();
                                            } catch (error) {
                                                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                                                toast.error(`Failed to ${mode} category: ${errorMessage}`);
                                            }
                                        }}
                                        disabled={isSubmitting}
                                        className="flex-1 h-12 bg-[#F7931E] hover:bg-[#e8851a] text-white font-medium"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                {mode === 'create' ? 'Creating...' : 'Updating...'}
                                            </div>
                                        ) : (
                                            mode === 'create' ? 'Create Category' : 'Update Category'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategoryForm;