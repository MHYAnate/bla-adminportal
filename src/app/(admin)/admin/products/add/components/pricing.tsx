"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/app/(admin)/components/header";
import { UseFormReturn } from "react-hook-form";
import { Plus, Trash, X, Info } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Key, useCallback } from "react";

interface iProps {
  form: UseFormReturn<any>;
  isSubmitting: boolean;
}

const Pricing: React.FC<iProps> = ({ form, isSubmitting }) => {
  const { control, getValues, setValue, watch } = form;
  const options = watch("options") || [];

  const addOption = () => {
    setValue("options", [
      ...options,
      {
        value: "",
        inventory: 0,
        stockPrice: 0,
        price: 0,
        discountType: "NONE",
        bulkDiscount: 0,
        minimumBulkQuantity: 1,
        weight: 0,
        unit: "",
        imageFiles: [],
      },
    ]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 1) {
      alert("At least one option is required");
      return;
    }
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setValue("options", newOptions);
    alert("Option removed successfully");
  };

  const calculateBulkPrice = useCallback((index: number) => {
    const retailPrice = getValues(`options.${index}.price`);
    const discountType = getValues(`options.${index}.discountType`);
    const bulkDiscount = getValues(`options.${index}.bulkDiscount`);

    if (retailPrice > 0 && discountType !== "NONE" && bulkDiscount > 0) {
      let bulkPrice = retailPrice;

      if (discountType === "PERCENTAGE") {
        bulkPrice = retailPrice * (1 - bulkDiscount / 100);
      } else if (discountType === "FIXED") {
        bulkPrice = retailPrice - bulkDiscount;
      }

      if (bulkPrice > 0 && bulkPrice < retailPrice) {
        const bulkPriceElement = document.getElementById(`bulk-price-display-${index}`);
        if (bulkPriceElement) {
          bulkPriceElement.textContent = `₦${bulkPrice.toFixed(2)}`;
        }
      }
    }
  }, [getValues]);

  const calculateMargins = useCallback((index: number) => {
    const stockPrice = getValues(`options.${index}.stockPrice`);
    const retailPrice = getValues(`options.${index}.price`);
    const discountType = getValues(`options.${index}.discountType`);
    const bulkDiscount = getValues(`options.${index}.bulkDiscount`);

    if (stockPrice > 0 && retailPrice > 0) {
      const retailMargin = ((retailPrice - stockPrice) / retailPrice) * 100;

      let bulkMargin = 0;
      if (discountType !== "NONE" && bulkDiscount > 0) {
        let bulkPrice = retailPrice;
        if (discountType === "PERCENTAGE") {
          bulkPrice = retailPrice * (1 - bulkDiscount / 100);
        } else if (discountType === "FIXED") {
          bulkPrice = retailPrice - bulkDiscount;
        }

        if (bulkPrice > stockPrice) {
          bulkMargin = ((bulkPrice - stockPrice) / bulkPrice) * 100;
        }
      }

      const retailMarginElement = document.getElementById(`retail-margin-${index}`);
      const bulkMarginElement = document.getElementById(`bulk-margin-${index}`);

      if (retailMarginElement) {
        retailMarginElement.textContent = `${retailMargin.toFixed(1)}%`;
        retailMarginElement.className = `text-sm font-medium ${retailMargin > 20 ? 'text-green-600' : retailMargin > 10 ? 'text-yellow-600' : 'text-red-600'}`;
      }

      if (bulkMarginElement && discountType !== "NONE") {
        bulkMarginElement.textContent = `${bulkMargin.toFixed(1)}%`;
        bulkMarginElement.className = `text-sm font-medium ${bulkMargin > 15 ? 'text-green-600' : bulkMargin > 8 ? 'text-yellow-600' : 'text-red-600'}`;
      }
    }
  }, [getValues]);

  const onDrop = useCallback((acceptedFiles: File[], index: number) => {
    const currentFiles = getValues(`options.${index}.imageFiles`) || [];
    const newFiles = [...currentFiles, ...acceptedFiles];
    setValue(`options.${index}.imageFiles`, newFiles, { shouldValidate: true });
  }, [getValues, setValue]);

  const removeImage = (index: number, imageIndex: number) => {
    const currentFiles = [...getValues(`options.${index}.imageFiles`)];
    currentFiles.splice(imageIndex, 1);
    setValue(`options.${index}.imageFiles`, currentFiles, { shouldValidate: true });
  };

  return (
    <div>
      <Header
        title="Pricing & Inventory"
        subtext="Configure product options and pricing structure"
      />

      {options.map((_: any, index: any) => (
        <div key={index} className="mb-8 p-4 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-medium">Option #{index + 1}</h3>
              <p className="text-sm text-gray-500">
                Configure pricing and inventory for this variant
              </p>
            </div>
            {options.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeOption(index)}
                disabled={isSubmitting}
                className="flex items-center gap-1"
              >
                <Trash size={16} />
                Remove
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField
              control={control}
              name={`options.${index}.value`}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Specific Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Large, 50KG" {...field} disabled={isSubmitting} />
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <FormField
              control={control}
              name={`options.${index}.unit`}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., grams, Kg" {...field} disabled={isSubmitting} />
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`options.${index}.weight`}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={field.value}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        field.onChange(val);
                      }}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`options.${index}.inventory`}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Inventory Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(parseInt(e.target.value) || 0);
                      }}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
          </div>

          {/* Pricing Section */}
          <div className="p-4 mb-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Info size={16} />
              Pricing Configuration
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField
                control={control}
                name={`options.${index}.stockPrice`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      Stock Price (₦)
                      <span className="text-xs font-normal block">What you pay manufacturer</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={field.value}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          field.onChange(value);
                          calculateMargins(index);
                        }}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`options.${index}.price`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      Retail Price (₦)
                      <span className="text-xs font-normal block">What customers pay individually</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={field.value}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          field.onChange(value);
                          calculateBulkPrice(index);
                          calculateMargins(index);
                        }}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>

            {/* Bulk Pricing Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={control}
                name={`options.${index}.discountType`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Bulk Discount Type</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          calculateBulkPrice(index);
                          calculateMargins(index);
                        }}
                        disabled={isSubmitting}
                      >
                        <option value="NONE">No Bulk Pricing</option>
                        <option value="PERCENTAGE">Percentage Discount</option>
                        <option value="FIXED">Fixed Amount Discount</option>
                      </select>
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`options.${index}.bulkDiscount`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      {watch(`options.${index}.discountType`) === "PERCENTAGE"
                        ? "Discount Percentage (%)"
                        : "Discount Amount (₦)"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        max={watch(`options.${index}.discountType`) === "PERCENTAGE" ? "100" : undefined}
                        value={field.value}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          field.onChange(value);
                          calculateBulkPrice(index);
                          calculateMargins(index);
                        }}
                        disabled={isSubmitting || watch(`options.${index}.discountType`) === "NONE"}
                      />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`options.${index}.minimumBulkQuantity`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Minimum Bulk Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        value={field.value}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          field.onChange(val);
                        }}
                        disabled={isSubmitting || watch(`options.${index}.discountType`) === "NONE"}
                      />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>

            {/* Calculated Bulk Price Display */}
            {watch(`options.${index}.discountType`) !== "NONE" && (
              <div className="mt-4 rounded p-3">
                <div className="text-sm font-medium">Calculated Bulk Price:</div>
                <div id={`bulk-price-display-${index}`} className="text-lg font-bold">
                  ₦0.00
                </div>
                <div className="text-xs mt-1">
                  This price will be automatically calculated and applied for bulk orders
                </div>
              </div>
            )}
          </div>

          {/* Image Upload Section */}
          <FormField
            control={control}
            name={`options.${index}.imageFiles`}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Product Images</FormLabel>
                <div className="flex flex-wrap gap-4 mb-4">
                  {field.value?.map((file: Blob | MediaSource, imgIndex: Key | null | undefined) => (
                    <div key={imgIndex} className="relative group">
                      <div className="relative w-24 h-24 rounded-md overflow-hidden border">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`Option image`}
                          fill
                          className="object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index, imgIndex as any)}
                          disabled={isSubmitting}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Dropzone
                  onDrop={(files: File[]) => onDrop(files, index)}
                  maxFiles={5 - (field.value?.length || 0)}
                  disabled={field.value?.length >= 5 || isSubmitting}
                />
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
        </div>
      ))}

      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h3 className="font-medium mb-4">Delivery & Return Policies</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormField
            control={control}
            name="shortDescription"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Short Description</FormLabel>
                <FormControl>
                  <Input placeholder="Brief product summary" {...field} disabled={isSubmitting} />
                </FormControl>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="processingTimeDays"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Processing Time (Days)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    value={field.value || 1}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    disabled={isSubmitting}
                  />
                </FormControl>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <FormField
            control={control}
            name="minDeliveryDays"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Min Delivery Days</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    value={field.value || 1}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    disabled={isSubmitting}
                  />
                </FormControl>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="maxDeliveryDays"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Max Delivery Days</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    value={field.value || 7}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 7)}
                    disabled={isSubmitting}
                  />
                </FormControl>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <div className="flex items-center space-x-2">
            <FormField
              control={control}
              name="includeSaturdays"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value || false}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                      className="rounded border-gray-300"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    Include Saturdays in delivery
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={control}
          name="acceptsReturns"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value !== false}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                  className="rounded border-gray-300"
                />
              </FormControl>
              <FormLabel className="text-sm font-normal">
                This product accepts returns
              </FormLabel>
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={addOption}
          disabled={isSubmitting || options.length >= 5}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add Product Option
        </Button>

        {options.length >= 5 && (
          <p className="text-sm text-gray-500">Maximum 5 options allowed</p>
        )}

        <p className="text-sm text-gray-600">
          {options.length} of 5 options
        </p>
      </div>
    </div>
  );
};

// Dropzone component
const Dropzone = ({ onDrop, maxFiles, disabled }: any) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize: 5 * 1024 * 1024, // 5MB
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${disabled
        ? 'bg-gray-100 cursor-not-allowed'
        : isDragActive
          ? 'border-primary bg-primary/10'
          : 'border-gray-300 hover:border-primary/70'
        }`}
    >
      <input {...getInputProps()} />
      <p className="text-gray-600">
        {isDragActive
          ? "Drop images here"
          : disabled
            ? "Maximum 5 images reached"
            : "Drag & drop images here, or click to select"}
      </p>
      <p className="text-sm text-gray-500 mt-2">
        PNG, JPG up to 5MB (max {maxFiles} files)
      </p>
    </div>
  );
};

export default Pricing;