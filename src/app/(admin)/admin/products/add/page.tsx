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
// ✅ FIXED: Use the service hook instead of direct API calls
import { useCreateProduct } from "@/services/products";

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

  // ✅ FIXED: Use the service hook instead of manual state management
  const { createProduct, isCreating } = useCreateProduct({
    onSuccess: () => {
      toast.success("Product created successfully with three-tier pricing!");
      router.push("/admin/products");
    }
  });

  // Enhanced form schema with proper price validation
  const formSchema = z.object({
    name: z.string().min(3, "Product name must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    // shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
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
      // shortDescription: "",
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

  // ✅ FIXED: Use the service hook instead of direct API calls (same as edit)
  const handleFinalSubmit = async (values: FormSchemaType) => {
    try {
      console.log('📤 Submitting product creation via service hook:', values);

      // ✅ Call createProduct with the form values directly (same pattern as edit)
      await createProduct(values as any);

      // Success handling is done in the service hook

    } catch (error) {
      console.error("Create failed:", error);
      // Error handling is done in the service hook
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
            <AddPricing form={form} isSubmitting={isCreating} />
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
                disabled={isCreating}
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
              disabled={isCreating}
            >
              {isCreating ? "Processing..." :
                activeTab === "add-product" ? "Next" : "Create Product"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}