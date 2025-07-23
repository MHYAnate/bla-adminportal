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

// Product option type
export type ProductOption = {
  name: string;
  value: string;
  imageFiles?: File[];
  images?: string[];
  inventory: number;
  stockPrice: number;
  markupType: "PERCENTAGE" | "FIXED";
  markupValue: number;
  retailPrice: number; // Changed from sellingPrice
  bulkPrice: number;   // New field
  weight: number;
  unit: string;
  moq: number;
};

export default function AddProductsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"add-product" | "add-pricing">("add-product");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form schema with validation
  const formSchema = z.object({
    name: z.string().min(3, "Product name must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    categoryId: z.string().min(1, "Category is required"),
    manufacturerId: z.string().min(1, "Manufacturer is required"),
    options: z.array(
      z.object({
        
        value: z.string().min(1, "Option value is required"),
        inventory: z.number().min(0, "Inventory cannot be negative"),
        stockPrice: z.number().min(0.01, "Cost price must be at least 0.01"),
        markupType: z.enum(["PERCENTAGE", "FIXED"]),
        markupValue: z.number().min(0, "Markup value cannot be negative"),
        retailPrice: z.number().min(0.01, "Retail price must be at least 0.01"), // New field
        bulkPrice: z.number().min(0.01, "Bulk price must be at least 0.01"),
        weight: z.number().min(0.1, "Weight must be at least 0.1kg"),
        unit: z.string().min(1, "Unit is required"),
        moq: z.number().min(1, "MOQ must be at least 1"),
        imageFiles: z.array(z.instanceof(File)).optional(),
      })
    ).min(1, "At least one product option is required"),
  });

  type FormSchemaType = z.infer<typeof formSchema>;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      manufacturerId: "",
      options: [{
       
        value: "",
        inventory: 0,
        stockPrice: 0,
        markupType: "PERCENTAGE",
        markupValue: 0,
        retailPrice: 0,  // New field
        bulkPrice: 0,    // New field
        weight: 0,
        unit: "",
        moq: 1,
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
      // Upload images for each option
      const optionsWithImages = await Promise.all(
        values.options.map(async (option) => {
          let images: string[] = [];
          if (option.imageFiles && option.imageFiles.length > 0) {
            images = await uploadImages(option.imageFiles);
          }
          return {
            ...option,
            images,
            imageFiles: undefined, // Remove client-only field
          };
        })
      );

      const allRetailPrices = values.options.map(opt => opt.retailPrice);
      const allBulkPrices = values.options.map(opt => opt.bulkPrice);
      const minPrice = Math.min(...allBulkPrices);
      const maxPrice = Math.max(...allRetailPrices);

      // Create payload
      const payload = {
        name: values.name,
        description: values.description,
        categoryId: parseInt(values.categoryId),
        manufacturerId: parseInt(values.manufacturerId),
        type: "platform",
        criticalLevel: 5,
        targetLevel: 50,
        stockAlert: false,
        priceRange: { min: minPrice, max: maxPrice },
        options: optionsWithImages.map(option => ({
          value: option.value,
          price: option.retailPrice,       
          sellingPrice: option.bulkPrice,  
          stockPrice: option.stockPrice,   
          moq: option.moq,
          images: option.images,
          inventory: option.inventory,
          markupType: option.markupType,
          markupValue: option.markupValue,
          weight: option.weight,
          unit: option.unit,
          lowStockThreshold: 5
        })),
      };

      // Create product
      const response = await createProduct(payload);
      
      toast.success("Product created successfully!");
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