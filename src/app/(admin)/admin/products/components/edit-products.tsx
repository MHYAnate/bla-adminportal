"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { apiClient } from "@/app/(admin)/admin/manufacturers/apiClient";
import { Trash, UploadCloud, Copy, Info } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  manufacturerId: z.string().min(1, "Manufacturer is required"),
  isActive: z.boolean().optional(),
  type: z.string().min(1, "Type is required"),
  processingTimeDays: z.coerce.number().min(1).default(1),
  minDeliveryDays: z.coerce.number().min(1).default(1),
  maxDeliveryDays: z.coerce.number().min(1).default(7),
  includeSaturdays: z.boolean().default(false),
  acceptsReturns: z.boolean().default(true),
  options: z.array(z.object({
    id: z.number().optional(),
    value: z.string().min(1, "Option value is required"),
    stockPrice: z.coerce.number().min(0, "Stock price cannot be negative"),
    price: z.coerce.number().min(0.01, "Retail price must be greater than 0"),
    inventory: z.coerce.number().min(0, "Inventory must be 0 or more"),
    discountType: z.enum(["NONE", "PERCENTAGE", "FIXED"]).default("NONE"),
    bulkDiscount: z.coerce.number().min(0).default(0),
    minimumBulkQuantity: z.coerce.number().min(1).default(1),
    weight: z.coerce.number().min(0.1, "Weight must be greater than 0"),
    unit: z.string().min(1, "Unit is required"),
    image: z.array(z.string()).optional(),
    newImages: z.array(z.instanceof(File)).optional(),
  })
    .refine((option) => {
      if (option.stockPrice > 0 && option.stockPrice >= option.price) {
        return false;
      }
      return true;
    }, {
      message: "Stock price must be less than retail price for profitability",
      path: ["stockPrice"]
    })
    .refine((option) => {
      if (option.discountType !== "NONE") {
        if (option.bulkDiscount <= 0) return false;
        if (option.discountType === "PERCENTAGE" && option.bulkDiscount > 100) return false;
        if (option.discountType === "FIXED" && option.bulkDiscount >= option.price) return false;
        if (option.minimumBulkQuantity < 2) return false;

        let bulkPrice = option.price;
        if (option.discountType === "PERCENTAGE") {
          bulkPrice = option.price * (1 - option.bulkDiscount / 100);
        } else if (option.discountType === "FIXED") {
          bulkPrice = option.price - option.bulkDiscount;
        }

        if (option.stockPrice > 0 && bulkPrice <= option.stockPrice) {
          return false;
        }
      }
      return true;
    }, {
      message: "Invalid bulk pricing configuration",
      path: ["bulkDiscount"]
    })).min(1, "At least one product option is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface Manufacturer {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface IProps {
  product: any;
  manufacturers: Manufacturer[];
  categories?: Category[];
  setClose: () => void;
}

const EditProductForm: React.FC<IProps> = ({
  product,
  manufacturers,
  categories = [],
  setClose
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedOption, setCopiedOption] = useState<any>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      categoryId: "",
      manufacturerId: "",
      isActive: false,
      type: "platform",
      processingTimeDays: 1,
      minDeliveryDays: 1,
      maxDeliveryDays: 7,
      includeSaturdays: false,
      acceptsReturns: true,
      options: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const calculatePricingMetrics = useCallback((index: number) => {
    const stockPrice = form.getValues(`options.${index}.stockPrice`);
    const retailPrice = form.getValues(`options.${index}.price`);
    const discountType = form.getValues(`options.${index}.discountType`);
    const bulkDiscount = form.getValues(`options.${index}.bulkDiscount`);

    if (stockPrice >= 0 && retailPrice > 0) {
      const retailMargin = stockPrice > 0 ? ((retailPrice - stockPrice) / retailPrice) * 100 : 0;

      let bulkPrice = 0;
      let bulkMargin = 0;

      if (discountType !== "NONE" && bulkDiscount > 0) {
        if (discountType === "PERCENTAGE") {
          bulkPrice = retailPrice * (1 - bulkDiscount / 100);
        } else if (discountType === "FIXED") {
          bulkPrice = retailPrice - bulkDiscount;
        }

        if (bulkPrice > 0 && stockPrice > 0) {
          bulkMargin = ((bulkPrice - stockPrice) / bulkPrice) * 100;
        }
      }

      const retailMarginElement = document.getElementById(`retail-margin-${index}`);
      const bulkMarginElement = document.getElementById(`bulk-margin-${index}`);
      const bulkPriceElement = document.getElementById(`bulk-price-display-${index}`);

      if (retailMarginElement) {
        retailMarginElement.textContent = `${retailMargin.toFixed(1)}%`;
        retailMarginElement.className = `text-lg font-bold ${retailMargin > 20 ? 'text-green-600' : retailMargin > 10 ? 'text-yellow-600' : 'text-red-600'}`;
      }

      if (bulkMarginElement && discountType !== "NONE") {
        bulkMarginElement.textContent = `${bulkMargin.toFixed(1)}%`;
        bulkMarginElement.className = `text-lg font-bold ${bulkMargin > 15 ? 'text-green-600' : bulkMargin > 8 ? 'text-yellow-600' : 'text-red-600'}`;
      }

      if (bulkPriceElement && discountType !== "NONE" && bulkPrice > 0) {
        bulkPriceElement.textContent = `₦${bulkPrice.toFixed(2)}`;
      }
    }
  }, [form]);

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        categoryId: String(product.categoryId),
        manufacturerId: String(product.manufacturerId),
        isActive: product.isActive || false,
        type: product.type || "platform",
        processingTimeDays: product.processingTimeDays || 1,
        minDeliveryDays: product.minDeliveryDays || 1,
        maxDeliveryDays: product.maxDeliveryDays || 7,
        includeSaturdays: product.includeSaturdays || false,
        acceptsReturns: product.acceptsReturns !== false,
        options: product.options?.map((opt: any) => ({
          id: opt.id,
          value: opt.value,
          stockPrice: opt.stockPrice || opt.manufacturerPrice || 0,
          price: opt.price || 0,
          inventory: opt.inventory || 0,
          discountType: opt.discountType || "NONE",
          bulkDiscount: opt.bulkDiscount || opt.markupValue || 0,
          minimumBulkQuantity: opt.minimumBulkQuantity || opt.moq || 1,
          weight: opt.weight || 0,
          unit: opt.unit || "",
          image: opt.image || [],
          newImages: [],
        })) || [],
      });
    }
  }, [product, form]);

  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (!files || files.length === 0) return [];

    const formData = new FormData();
    files.forEach(file => formData.append("images", file));
    formData.append("folder", "products");

    try {
      setIsUploading(true);
      const response = await apiClient.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.urls || [];
    } catch (error) {
      toast.error("Image upload failed. Please try again.");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyOption = (index: number) => {
    const optionToCopy = form.getValues(`options.${index}`);
    const { id, ...optionData } = optionToCopy;
    setCopiedOption(optionData);
    toast.success("Option copied!");
  };

  const handlePasteOption = () => {
    if (copiedOption) {
      append({
        ...copiedOption,
        newImages: [],
      });
      toast.info("Option pasted!");
    } else {
      toast.warning("No option copied yet.");
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);

    try {
      const processedOptions = await Promise.all(
        values.options.map(async (option) => {
          let uploadedImageUrls: string[] = [];

          if (option.newImages && option.newImages.length > 0) {
            uploadedImageUrls = await uploadImages(option.newImages);
          }

          const allImages = [...(option.image || []), ...uploadedImageUrls];

          return {
            value: option.value,
            stockPrice: option.stockPrice,
            retailPrice: option.price,
            discountType: option.discountType,
            bulkDiscount: option.bulkDiscount,
            minimumBulkQuantity: option.minimumBulkQuantity,
            inventory: option.inventory,
            weight: option.weight,
            unit: option.unit,
            image: allImages,
          };
        })
      );

      const updateData = {
        name: values.name,
        description: values.description,
        shortDescription: values.shortDescription,
        type: values.type,
        isActive: values.isActive,
        processingTimeDays: values.processingTimeDays,
        minDeliveryDays: values.minDeliveryDays,
        maxDeliveryDays: values.maxDeliveryDays,
        includeSaturdays: values.includeSaturdays,
        acceptsReturns: values.acceptsReturns,
        categoryId: parseInt(values.categoryId),
        manufacturerId: parseInt(values.manufacturerId),
        options: processedOptions
      };

      const response = await apiClient.patch(`/admin/products/${product.id}`, updateData);

      if (response.data.success) {
        toast.success("Product updated successfully!");
        setClose();
      } else {
        throw new Error(response.data.error || "Failed to update product");
      }
    } catch (error: any) {
      console.error("Update failed:", error);

      if (error.message.includes("stock price") || error.message.includes("Stock price")) {
        toast.error("Stock price must be less than retail price for profitability");
      } else if (error.message.includes("bulk") || error.message.includes("Bulk")) {
        toast.error("Invalid bulk pricing configuration. Check your discount settings.");
      } else {
        toast.error(error.message || "Failed to update product");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Product Details */}
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Premium Rice" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="platform">Platform</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="mt-4">
              <FormField control={form.control} name="shortDescription" render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief product summary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <FormField control={form.control} name="categoryId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  {categories.length > 0 ? (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={String(category.id)}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <FormControl>
                      <Input placeholder="Category ID" {...field} />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="manufacturerId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select manufacturer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {manufacturers.map(manufacturer => (
                        <SelectItem key={manufacturer.id} value={String(manufacturer.id)}>
                          {manufacturer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="mt-4">
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Product description..." className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Delivery & Processing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <FormField control={form.control} name="processingTimeDays" render={({ field }) => (
                <FormItem>
                  <FormLabel>Processing Time (Days)</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="minDeliveryDays" render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Delivery Days</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="maxDeliveryDays" render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Delivery Days</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Product Status</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Active products are visible to customers
                    </p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="includeSaturdays" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Include Saturdays</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Include Saturday in delivery
                    </p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />

              <FormField control={form.control} name="acceptsReturns" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Accepts Returns</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Product accepts returns
                    </p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />
            </div>
          </div>

          {/* Product Options */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Product Options</h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePasteOption}
                  disabled={!copiedOption}
                >
                  Paste Option
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => append({
                    value: "",
                    stockPrice: 0,
                    price: 0,
                    inventory: 0,
                    discountType: "NONE",
                    bulkDiscount: 0,
                    minimumBulkQuantity: 1,
                    weight: 0,
                    unit: "",
                    image: [],
                    newImages: []
                  })}
                >
                  Add Option
                </Button>
              </div>
            </div>

            {fields.map((field, index) => (
              <OptionFormFields
                key={field.id}
                form={form}
                index={index}
                onCopy={handleCopyOption}
                onRemove={remove}
                calculatePricingMetrics={calculatePricingMetrics}
              />
            ))}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={setClose}
              disabled={isSubmitting || isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

// Option form fields component
interface OptionFormFieldsProps {
  form: any;
  index: number;
  onCopy: (index: number) => void;
  onRemove: (index: number) => void;
  calculatePricingMetrics: (index: number) => void;
}

const OptionFormFields: React.FC<OptionFormFieldsProps> = ({
  form,
  index,
  onCopy,
  onRemove,
  calculatePricingMetrics
}) => {
  return (
    <div className="p-4 border rounded-lg space-y-4 relative bg-slate-50">
      <div className="absolute top-2 right-2 flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onCopy(index)}
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="h-7 w-7"
          onClick={() => onRemove(index)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      <p className="font-semibold text-md">Option #{index + 1}</p>

      {/* Basic Option Details */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name={`options.${index}.value`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specific Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 5KG Premium Pack" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`options.${index}.unit`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormControl>
                <Input placeholder="e.g., kg, grams" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`options.${index}.weight`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" min="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Pricing Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
          <Info size={16} />
          Pricing Configuration
        </h4>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <FormField
            control={form.control}
            name={`options.${index}.stockPrice`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-900">
                  Stock Price (₦)
                  <span className="text-xs font-normal text-blue-600 block">What you pay manufacturer</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      calculatePricingMetrics(index);
                    }}
                    className="border-blue-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`options.${index}.price`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-900">
                  Retail Price (₦)
                  <span className="text-xs font-normal text-blue-600 block">What customers pay individually</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      calculatePricingMetrics(index);
                    }}
                    className="border-blue-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Profit Margin Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-3 rounded border">
            <div className="text-sm text-gray-600">Retail Profit Margin</div>
            <div id={`retail-margin-${index}`} className="text-lg font-bold text-gray-800">
              0%
            </div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="text-sm text-gray-600">Bulk Profit Margin</div>
            <div id={`bulk-margin-${index}`} className="text-lg font-bold text-gray-800">
              0%
            </div>
          </div>
        </div>

        {/* Bulk Pricing Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name={`options.${index}.discountType`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-900">Bulk Discount Type</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    calculatePricingMetrics(index);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-blue-300 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="NONE">No Bulk Pricing</SelectItem>
                    <SelectItem value="PERCENTAGE">Percentage Discount</SelectItem>
                    <SelectItem value="FIXED">Fixed Amount Discount</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`options.${index}.bulkDiscount`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-900">
                  {form.watch(`options.${index}.discountType`) === "PERCENTAGE"
                    ? "Discount Percentage (%)"
                    : "Discount Amount (₦)"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max={form.watch(`options.${index}.discountType`) === "PERCENTAGE" ? "100" : undefined}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      calculatePricingMetrics(index);
                    }}
                    disabled={form.watch(`options.${index}.discountType`) === "NONE"}
                    className="border-blue-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`options.${index}.minimumBulkQuantity`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-blue-900">Minimum Bulk Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    {...field}
                    disabled={form.watch(`options.${index}.discountType`) === "NONE"}
                    className="border-blue-300 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Calculated Bulk Price Display */}
        {form.watch(`options.${index}.discountType`) !== "NONE" && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded p-3">
            <div className="text-sm text-green-700 font-medium">Calculated Bulk Price:</div>
            <div id={`bulk-price-display-${index}`} className="text-lg font-bold text-green-800">
              ₦0.00
            </div>
            <div className="text-xs text-green-600 mt-1">
              This price will be automatically calculated and applied for bulk orders
            </div>
          </div>
        )}
      </div>

      {/* Inventory */}
      <FormField
        control={form.control}
        name={`options.${index}.inventory`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Inventory</FormLabel>
            <FormControl>
              <Input type="number" min="0" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Image Upload Component */}
      <ImageUploader form={form} index={index} />
    </div>
  );
};

// Image uploader component
const ImageUploader = ({ form, index }: { form: any; index: number }) => {
  const existingImages = form.watch(`options.${index}.image`) || [];
  const newFiles = form.watch(`options.${index}.newImages`) || [];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const currentFiles = form.getValues(`options.${index}.newImages`) || [];
    form.setValue(`options.${index}.newImages`, [...currentFiles, ...acceptedFiles]);
  }, [form, index]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
    onDrop,
  });

  const removeExistingImage = (imgUrl: string) => {
    const updatedImages = existingImages.filter((url: string) => url !== imgUrl);
    form.setValue(`options.${index}.image`, updatedImages);
  };

  const removeNewFile = (fileIndex: number) => {
    const updatedFiles = newFiles.filter((_: any, i: number) => i !== fileIndex);
    form.setValue(`options.${index}.newImages`, updatedFiles);
  };

  return (
    <div className="space-y-2">
      <FormLabel>Product Images</FormLabel>
      <div
        {...getRootProps()}
        className={`p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-gray-400'
          }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-1 text-sm text-gray-600">
          Drag & drop or click to add images
        </p>
      </div>

      {(existingImages.length > 0 || newFiles.length > 0) && (
        <div className="flex gap-2 flex-wrap mt-2">
          {existingImages.map((url: string, imgIndex: number) => (
            <div key={`existing-${imgIndex}`} className="relative h-20 w-20">
              <Image
                src={url}
                alt="Product image"
                fill
                className="rounded-md object-cover"
              />
              <button
                type="button"
                onClick={() => removeExistingImage(url)}
                className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 h-5 w-5 flex items-center justify-center shadow-md"
              >
                <Trash className="h-3 w-3" />
              </button>
            </div>
          ))}

          {newFiles.map((file: File, fileIndex: number) => (
            <div key={`new-${fileIndex}`} className="relative h-20 w-20">
              <Image
                src={URL.createObjectURL(file)}
                alt="Preview"
                fill
                className="rounded-md object-cover"
              />
              <button
                type="button"
                onClick={() => removeNewFile(fileIndex)}
                className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 h-5 w-5 flex items-center justify-center shadow-md"
              >
                <Trash className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditProductForm;