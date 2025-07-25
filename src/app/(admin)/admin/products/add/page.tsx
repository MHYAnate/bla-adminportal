"use client";

import AddProduct from "./components/product-details";
import AddPricing from "./components/pricing";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { apiClient } from "@/app/(admin)/admin/manufacturers/apiClient";
import { routes } from "@/services/api-routes/index";
import { ErrorHandler } from "@/services/errorHandler";

// Product option type updated for new pricing structure
export type ProductOption = {
  value: string;
  imageFiles?: File[];
  images?: string[];
  inventory: number;
  stockPrice: number; // What we pay manufacturer
  price: number; // What customers pay individually
  discountType: "NONE" | "PERCENTAGE" | "FIXED";
  bulkDiscount: number;
  minimumBulkQuantity: number;
  weight: number;
  unit: string;
};

export default function AddProductsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"add-product" | "add-pricing" | "pricing">("add-product");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Enhanced form schema with proper price validation
  const formSchema = z.object({
    name: z.string().min(3, "Product name must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
    categoryId: z.string().min(1, "Category is required"),
    manufacturerId: z.string().min(1, "Manufacturer is required"),
    processingTimeDays: z.number().min(1, "Processing time must be at least 1 day").default(1),
    minDeliveryDays: z.number().min(1, "Minimum delivery days must be at least 1").default(1),
    maxDeliveryDays: z.number().min(1, "Maximum delivery days must be at least 1").default(7),
    includeSaturdays: z.boolean().default(false),
    acceptsReturns: z.boolean().default(true),
    options: z.array(
      z.object({
        value: z.string().min(1, "Option value is required"),
        inventory: z.number().min(0, "Inventory cannot be negative"),
        stockPrice: z.number().min(0, "Stock price cannot be negative"),
        price: z.number().min(0.01, "Retail price must be at least 0.01"),
        discountType: z.enum(["NONE", "PERCENTAGE", "FIXED"]).default("NONE"),
        bulkDiscount: z.number().min(0).default(0),
        minimumBulkQuantity: z.number().min(1).default(1),
        weight: z.number().min(0.1, "Weight must be at least 0.1"),
        unit: z.string().min(1, "Unit is required"),
        imageFiles: z.array(z.instanceof(File)).optional(),
      })
        .refine((option) => {
          // Stock price must be less than retail price for profitability
          if (option.stockPrice > 0 && option.stockPrice >= option.price) {
            return false;
          }
          return true;
        }, {
          message: "Stock price must be less than retail price for profitability",
          path: ["stockPrice"]
        })
        .refine((option) => {
          // If bulk pricing is enabled, validate discount values
          if (option.discountType !== "NONE") {
            if (option.bulkDiscount <= 0) {
              return false;
            }
            if (option.discountType === "PERCENTAGE" && option.bulkDiscount > 100) {
              return false;
            }
            if (option.discountType === "FIXED" && option.bulkDiscount >= option.price) {
              return false;
            }
            if (option.minimumBulkQuantity < 2) {
              return false;
            }

            // Calculate bulk price and ensure it's profitable
            let bulkPrice = option.price;
            if (option.discountType === "PERCENTAGE") {
              bulkPrice = option.price * (1 - option.bulkDiscount / 100);
            } else if (option.discountType === "FIXED") {
              bulkPrice = option.price - option.bulkDiscount;
            }

            // Bulk price must be greater than stock price for profitability
            if (option.stockPrice > 0 && bulkPrice <= option.stockPrice) {
              return false;
            }
          }
          return true;
        }, {
          message: "Invalid bulk pricing configuration. Check discount values and ensure bulk price maintains profitability.",
          path: ["bulkDiscount"]
        })
    ).min(1, "At least one product option is required"),
  })
    .refine((data) => {
      // Validate delivery timeline
      return data.minDeliveryDays <= data.maxDeliveryDays;
    }, {
      message: "Minimum delivery days cannot be greater than maximum delivery days",
      path: ["maxDeliveryDays"]
    });

  type FormSchemaType = z.infer<typeof formSchema>;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      categoryId: "",
      manufacturerId: "",
      processingTimeDays: 1,
      minDeliveryDays: 1,
      maxDeliveryDays: 7,
      includeSaturdays: false,
      acceptsReturns: true,
      options: [{
        value: "",
        inventory: 0,
        stockPrice: 0, // What we pay manufacturer
        price: 0, // What customers pay individually
        discountType: "NONE",
        bulkDiscount: 0,
        minimumBulkQuantity: 1,
        weight: 0,
        unit: "",
        imageFiles: [],
      }],
    },
  });

  // Upload images to backend
  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (!files || files.length === 0) return [];

    try {
      const formData = new FormData();
      files.forEach(file => formData.append("images", file));
      formData.append("folder", "products");

      const response = await apiClient.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data.urls || [];
    } catch (error: any) {
      console.error("Image upload failed:", error);
      throw new Error(error.response?.data?.error || error.message || "Image upload failed");
    }
  };

  const createProduct = async (payload: any) => {
    try {
      setIsSubmitting(true);
      const response = await apiClient.post(routes.createProduct(), payload);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalSubmit = async (values: FormSchemaType) => {
    try {
      // Validate pricing logic before submission
      for (const [index, option] of values.options.entries()) {
        // Validate stock price vs retail price
        if (option.stockPrice > 0 && option.stockPrice >= option.price) {
          toast.error(`Option ${index + 1}: Stock price (₦${option.stockPrice}) must be less than retail price (₦${option.price}) for profitability`);
          return;
        }

        // Validate bulk pricing if enabled
        if (option.discountType !== "NONE") {
          if (option.bulkDiscount <= 0) {
            toast.error(`Option ${index + 1}: Bulk discount value is required when bulk pricing is enabled`);
            return;
          }

          if (option.minimumBulkQuantity < 2) {
            toast.error(`Option ${index + 1}: Minimum bulk quantity must be at least 2`);
            return;
          }

          // Calculate bulk price
          let bulkPrice = option.price;
          if (option.discountType === "PERCENTAGE") {
            if (option.bulkDiscount > 100) {
              toast.error(`Option ${index + 1}: Percentage discount cannot exceed 100%`);
              return;
            }
            bulkPrice = option.price * (1 - option.bulkDiscount / 100);
          } else if (option.discountType === "FIXED") {
            if (option.bulkDiscount >= option.price) {
              toast.error(`Option ${index + 1}: Fixed discount cannot be greater than or equal to retail price`);
              return;
            }
            bulkPrice = option.price - option.bulkDiscount;
          }

          // Validate bulk price profitability
          if (option.stockPrice > 0 && bulkPrice <= option.stockPrice) {
            toast.error(`Option ${index + 1}: Bulk price (₦${bulkPrice.toFixed(2)}) must be greater than stock price (₦${option.stockPrice}) to maintain profitability`);
            return;
          }
        }
      }

      // Upload images for each option
      const optionsWithImages = await Promise.all(
        values.options.map(async (option) => {
          let images: string[] = [];
          if (option.imageFiles && option.imageFiles.length > 0) {
            images = await uploadImages(option.imageFiles);
          }
          return {
            ...option,
            image: images, // Backend expects 'image' array
            imageFiles: undefined, // Remove client-only field
          };
        })
      );

      // Create payload matching backend expectations
      const payload = {
        name: values.name,
        description: values.description,
        shortDescription: values.shortDescription,
        categoryId: parseInt(values.categoryId),
        manufacturerId: parseInt(values.manufacturerId),
        type: "platform",
        processingTimeDays: values.processingTimeDays,
        minDeliveryDays: values.minDeliveryDays,
        maxDeliveryDays: values.maxDeliveryDays,
        includeSaturdays: values.includeSaturdays,
        acceptsReturns: values.acceptsReturns,
        options: optionsWithImages.map(option => ({
          value: option.value,
          stockPrice: option.stockPrice, // What we pay manufacturer
          retailPrice: option.price, // What customers pay individually (backend processes as 'price')
          discountType: option.discountType,
          bulkDiscount: option.bulkDiscount,
          minimumBulkQuantity: option.minimumBulkQuantity,
          inventory: option.inventory,
          weight: option.weight,
          unit: option.unit,
          image: option.image, // Array of image URLs
        })),
      };

      // Create product
      const response = await createProduct(payload);

      toast.success("Product created successfully with three-tier pricing!");
      router.push("/admin/products");
    } catch (error: any) {
      console.error("Product creation failed:", error);

      // Handle specific error cases
      if (error.message.includes("name")) {
        form.setError("name", {
          type: "manual",
          message: "A product with this name already exists"
        });
        setActiveTab("add-product");
      } else if (error.message.includes("category")) {
        form.setError("categoryId", {
          type: "manual",
          message: "Invalid category selected"
        });
        setActiveTab("add-product");
      } else if (error.message.includes("manufacturer")) {
        form.setError("manufacturerId", {
          type: "manual",
          message: "Invalid manufacturer selected"
        });
        setActiveTab("add-product");
      } else if (error.message.includes("delivery") || error.message.includes("processing")) {
        toast.error("Invalid delivery timeline. Min delivery days cannot exceed max delivery days.");
        setActiveTab("add-pricing");
      } else if (error.message.includes("bulk") || error.message.includes("discount") || error.message.includes("stock price")) {
        toast.error("Invalid pricing configuration. Please check your price settings.");
        setActiveTab("add-pricing");
      } else {
        const errorMessage = ErrorHandler(error) || "Failed to create product";
        toast.error(errorMessage);
      }
    }
  };

  const onSubmit = async () => {
    try {
      // Validate current tab fields
      const fields = activeTab === "add-product"
        ? ["name", "description", "categoryId", "manufacturerId"]
        : ["options"];

      const isValid = await form.trigger(fields as any);
      if (!isValid) return;

      if (activeTab === "add-product") {
        setActiveTab("add-pricing");
      } else {
        await handleFinalSubmit(form.getValues());
      }
    } catch (error) {
      toast.error("Validation failed. Please check your inputs.");
    }
  };

  return (
    <section>
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="mb-8 mt-6">
          {activeTab === "add-pricing" ? (
            <AddPricing form={form} isSubmitting={isSubmitting} />
          ) : (
            <AddProduct form={form} />
          )}

          <div className="flex justify-end gap-5 mt-8">
            {activeTab === "add-pricing" && (
              <Button
                variant="outline"
                type="button"
                className="w-auto py-4 px-[3rem] font-bold text-base"
                size="xl"
                onClick={() => setActiveTab("add-product")}
                disabled={isSubmitting}
              >
                Back
              </Button>
            )}
            <Button
              type="button"
              variant="warning"
              className="w-auto px-[3rem] py-4 font-bold text-base"
              size="xl"
              onClick={onSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." :
                activeTab === "add-product" ? "Next" : "Create Product"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}