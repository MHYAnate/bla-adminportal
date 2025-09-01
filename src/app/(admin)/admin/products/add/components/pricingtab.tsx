"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { Plus, Trash, X, Info, Upload, DollarSign, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { ProfitType } from "./types";

interface Props {
  form: UseFormReturn<any>;
  isSubmitting: boolean;
}

const AddPricing: React.FC<Props> = ({ form, isSubmitting }) => {
  const { control, getValues, setValue, watch } = form;
  const options = watch("options") || [];
  const [expandedOptions, setExpandedOptions] = useState<number[]>([0]);

  const addOption = () => {
    setValue("options", [
      ...options,
      {
        profitType: 'MARKUP', // or 'COMMISSION'

        value: "",
        inventory: 0,
        stockPrice: 0,
        retailPrice: 0,
        discountType: "NONE",
        bulkDiscount: 0,
        minimumBulkQuantity: 1,
        weight: 0.1,
        unit: "",
        imageFiles: [],
      },
    ]);
    
    // Expand the newly added option
    setExpandedOptions([...expandedOptions, options.length]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 1) {
      return;
    }
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setValue("options", newOptions);
    
    // Update expanded options
    setExpandedOptions(expandedOptions.filter(i => i !== index).map(i => i > index ? i - 1 : i));
  };

  const toggleOptionExpansion = (index: number) => {
    if (expandedOptions.includes(index)) {
      setExpandedOptions(expandedOptions.filter(i => i !== index));
    } else {
      setExpandedOptions([...expandedOptions, index]);
    }
  };

  const calculateProfitMetrics = (option: any) => {
    if (option.profitType === 'COMMISSION') {
      const supplierPrice = parseFloat(option.supplierPrice || 0);
      const commissionRate = parseFloat(option.commissionRate || 0);
      const calculatedPrice = parseFloat(option.supplierPrice || 0);
      
      return {
        calculatedPrice: calculatedPrice.toFixed(2),
        commission: (calculatedPrice - supplierPrice).toFixed(2),
        margin: commissionRate.toFixed(1)
      };
    } else {
      const stockPrice = parseFloat(option.stockPrice || 0);
      const retailPrice = parseFloat(option.retailPrice || 0);
      
      if (stockPrice > 0 && retailPrice > 0) {
        const profit = retailPrice - stockPrice;
        const margin = (profit / retailPrice * 100);
        
        let bulkPrice = retailPrice;
        if (option.discountType === "PERCENTAGE") {
          bulkPrice = retailPrice * (1 - (option.bulkDiscount || 0) / 100);
        } else if (option.discountType === "FIXED") {
          bulkPrice = retailPrice - (option.bulkDiscount || 0);
        }
        
        const bulkProfit = bulkPrice - stockPrice;
        const bulkMargin = bulkProfit > 0 ? (bulkProfit / bulkPrice * 100) : 0;
        
        return {
          profit: profit.toFixed(2),
          margin: margin.toFixed(1),
          bulkPrice: bulkPrice.toFixed(2),
          bulkMargin: bulkMargin.toFixed(1)
        };
      }
    }
    return null;
  };

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pricing & Options</h1>
        <p className="text-gray-600 mt-2">Configure product variants and pricing structure</p>
      </div>

      {/* Options */}
      <div className="space-y-4">
        {options.map((option: any, index: number) => {
          const isExpanded = expandedOptions.includes(index);
          const metrics = calculateProfitMetrics(option);
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border">
              {/* Option Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleOptionExpansion(index)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        option.profitType === 'COMMISSION' ? 'bg-green-500' : 'bg-blue-500'
                      }`} />
                      <h3 className="font-semibold text-lg">
                        Option #{index + 1}
                        {option.value && ` - ${option.value}`}
                      </h3>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      option.profitType === 'COMMISSION' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {option.profitType || 'MARKUP'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {metrics && (
                      <div className="text-sm text-gray-600">
                        {option.profitType === 'COMMISSION' ? (
                          <span>₦{metrics.calculatedPrice} ({metrics.margin}% commission)</span>
                        ) : (
                          <span>₦{option.retailPrice} ({metrics.margin}% margin)</span>
                        )}
                      </div>
                    )}
                    
                    {options.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeOption(index);
                        }}
                        disabled={isSubmitting}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Option Content */}
              {isExpanded && (
                <div className="px-6 pb-6 space-y-6 border-t bg-gray-50/50">
                  {/* Basic Option Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={control}
                      name={`options.${index}.value`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Option Description</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 1kg, 5kg, Large" {...field} disabled={isSubmitting} />
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
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0.1)}
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
                      name={`options.${index}.unit`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
                          <FormControl>
                            <Input placeholder="kg, grams, pieces" {...field} disabled={isSubmitting} />
                          </FormControl>
                          {fieldState.error && (
                            <FormMessage>{fieldState.error.message}</FormMessage>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Profit Type Selection */}
                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Profit Configuration
                    </h4>
                    
                    <FormField
                      control={control}
                      name={`options.${index}.profitType`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profit Type</FormLabel>
                          <FormControl>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  value="MARKUP"
                                  checked={field.value === 'MARKUP'}
                                  onChange={() => field.onChange('MARKUP')}
                                  className="w-4 h-4 text-blue-600"
                                />
                                <span className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                                  Markup Pricing
                                </span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  value="COMMISSION"
                                  checked={field.value === 'COMMISSION'}
                                  onChange={() => field.onChange('COMMISSION')}
                                  className="w-4 h-4 text-green-600"
                                />
                                <span className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-green-500" />
                                  Commission Based
                                </span>
                              </label>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Pricing Configuration */}
                  {watch(`options.${index}.profitType`) === 'COMMISSION' ? (
                    <CommissionPricing form={form} index={index} metrics={metrics} />
                  ) : (
                    <MarkupPricing form={form} index={index} metrics={metrics} />
                  )}

                  {/* Inventory */}
                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-semibold mb-4">Inventory & Stock</h4>
                    <FormField
                      control={control}
                      name={`options.${index}.inventory`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>Available Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              value={field.value}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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

                  {/* Image Upload */}
                  <ImageUploadSection
                    form={form}
                    index={index}
                    onDrop={onDrop}
                    removeImage={removeImage}
                    isSubmitting={isSubmitting}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Option Button */}
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={addOption}
          disabled={isSubmitting || options.length >= 5}
          className="flex items-center gap-2 px-6 py-3"
        >
          <Plus className="w-4 h-4" />
          Add Product Option
          <span className="text-sm text-gray-500">({options.length}/5)</span>
        </Button>
      </div>

      {/* Delivery & Return Policies */}
      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery & Policies</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="minDeliveryDays"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Min Delivery</FormLabel>
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
                    <FormLabel>Max Delivery</FormLabel>
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
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <FormField
              control={control}
              name="includeSaturdays"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Include Saturdays in delivery calculation
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="acceptsReturns"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value !== false}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Accept product returns
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Commission Pricing Component
const CommissionPricing: React.FC<{ form: any; index: number; metrics: any }> = ({ form, index, metrics }) => (
  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
    <h4 className="font-semibold mb-4 flex items-center gap-2 text-green-800">
      <DollarSign className="w-4 h-4" />
      Commission-Based Pricing
    </h4>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <FormField
        control={form.control}
        name={`options.${index}.supplierPrice`}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Supplier Price (₦)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={field.value}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`options.${index}.commissionRate`}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Commission Rate (%)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0.1"
                max="100"
                step="0.1"
                placeholder="15.0"
                value={field.value}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        )}
      />
    </div>

    {/* {metrics && (
      <div className="bg-white rounded-lg p-4 border">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Customer Price:</span>
            <div className="font-bold text-lg text-green-600">₦{metrics.calculatedPrice}</div>
          </div>
          <div>
            <span className="text-gray-600">Your Commission:</span>
            <div className="font-bold text-lg text-green-600">₦{metrics.commission}</div>
          </div>
          <div>
            <span className="text-gray-600">Commission Rate:</span>
            <div className="font-bold text-lg text-green-600">{metrics.margin}%</div>
          </div>
        </div>
      </div>
    )} */}

    <div className="mt-4 p-3 bg-green-100 rounded-lg">
      <p className="text-sm text-green-800">
        <Info className="w-4 h-4 inline mr-2" />
        Commission products don't support bulk pricing. Price is calculated automatically.
      </p>
    </div>
  </div>
);

// Markup Pricing Component
const MarkupPricing: React.FC<{ form: any; index: number; metrics: any }> = ({ form, index, metrics }) => (
  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
    <h4 className="font-semibold mb-4 flex items-center gap-2 text-blue-800">
      <DollarSign className="w-4 h-4" />
      Markup-Based Pricing
    </h4>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <FormField
        control={form.control}
        name={`options.${index}.stockPrice`}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>
              Stock Price (₦)
              <span className="text-xs font-normal block text-gray-600">Cost from manufacturer</span>
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={field.value}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`options.${index}.retailPrice`}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>
              Retail Price (₦)
              <span className="text-xs font-normal block text-gray-600">Customer pays this price</span>
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={field.value}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        )}
      />
    </div>

    {/* Bulk Pricing Section */}
    <div className="bg-white rounded-lg p-4 border mb-4">
      <h5 className="font-medium mb-3">Bulk Pricing Options</h5>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name={`options.${index}.discountType`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Type</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  value={field.value}
                  onChange={field.onChange}
                >
                  <option value="NONE">No Bulk Pricing</option>
                  <option value="PERCENTAGE">Percentage Discount</option>
                  <option value="FIXED">Fixed Amount Discount</option>
                </select>
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch(`options.${index}.discountType`) !== "NONE" && (
          <>
            <FormField
              control={form.control}
              name={`options.${index}.bulkDiscount`}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    {form.watch(`options.${index}.discountType`) === "PERCENTAGE"
                      ? "Discount (%)"
                      : "Discount (₦)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      max={form.watch(`options.${index}.discountType`) === "PERCENTAGE" ? "100" : undefined}
                      value={field.value}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`options.${index}.minimumBulkQuantity`}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Min Bulk Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="2"
                      value={field.value}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 2)}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
          </>
        )}
      </div>
    </div>

    {/* Profit Metrics Display */}
    {metrics && (
      <div className="bg-white rounded-lg p-4 border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Profit:</span>
            <div className="font-bold text-lg text-blue-600">₦{metrics.profit}</div>
          </div>
          <div>
            <span className="text-gray-600">Margin:</span>
            <div className="font-bold text-lg text-blue-600">{metrics.margin}%</div>
          </div>
          {form.watch(`options.${index}.discountType`) !== "NONE" && (
            <>
              <div>
                <span className="text-gray-600">Bulk Price:</span>
                <div className="font-bold text-lg text-blue-600">₦{metrics.bulkPrice}</div>
              </div>
              <div>
                <span className="text-gray-600">Bulk Margin:</span>
                <div className="font-bold text-lg text-blue-600">{metrics.bulkMargin}%</div>
              </div>
            </>
          )}
        </div>
      </div>
    )}
  </div>
);

// Image Upload Section Component
const ImageUploadSection: React.FC<{
  form: any;
  index: number;
  onDrop: (files: File[], index: number) => void;
  removeImage: (index: number, imageIndex: number) => void;
  isSubmitting: boolean;
}> = ({ form, index, onDrop, removeImage, isSubmitting }) => {
  const images = form.watch(`options.${index}.imageFiles`) || [];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => onDrop(files, index),
    maxFiles: 5 - images.length,
    maxSize: 5 * 1024 * 1024, // 5MB
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    disabled: images.length >= 5 || isSubmitting,
  });

  return (
    <div className="bg-white rounded-lg p-4 border">
      <h4 className="font-semibold mb-4 flex items-center gap-2">
        <Upload className="w-4 h-4" />
        Product Images
        <span className="text-sm font-normal text-gray-500">({images.length}/5)</span>
      </h4>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          {images.map((file: File, imgIndex: number) => (
            <div key={imgIndex} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border bg-gray-100">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`Product image ${imgIndex + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index, imgIndex)}
                disabled={isSubmitting}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : images.length >= 5 || isSubmitting
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
        <p className="text-gray-600 font-medium">
          {isDragActive
            ? "Drop images here"
            : images.length >= 5
              ? "Maximum 5 images reached"
              : isSubmitting
                ? "Upload in progress..."
                : "Drag & drop images or click to browse"}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          PNG, JPG up to 5MB each
        </p>
      </div>
    </div>
  );
};

export default AddPricing;