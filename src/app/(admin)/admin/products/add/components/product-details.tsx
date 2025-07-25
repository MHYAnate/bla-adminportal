"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Header from "@/app/(admin)/components/header";
import { UseFormReturn } from "react-hook-form";
import { useGetManufacturers } from "@/services/manufacturers";
import { useGetCategoriesForSelection } from "@/services/categories";
import { useEffect, useState } from "react";
import CategoryForm from "../../../categories/components/categoryForm";
import CategorySuccessModal from "../../../categories/components/categorySuccessModal";

interface iProps {
  form: UseFormReturn<any>;
}

const AddProduct: React.FC<iProps> = ({ form }) => {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdCategoryName, setCreatedCategoryName] = useState("");

  const {
    getManufacturersData,
    getManufacturersIsLoading,
  } = useGetManufacturers();

  const {
    getCategoriesSelectionData,
    getCategoriesSelectionIsLoading,
    getCategoriesSelectionError,
    refetchCategoriesSelection
  } = useGetCategoriesForSelection();

  useEffect(() => {
    if (getManufacturersData?.data?.length > 0 && !form.getValues("manufacturerId")) {
      form.setValue("manufacturerId", getManufacturersData.data[0].id.toString());
    }
  }, [getManufacturersData, form]);

  const handleCreateCategory = () => {
    setShowCategoryForm(true);
  };

  const handleCategorySuccess = async (categoryData: any) => {
    try {
      setShowCategoryForm(false);

      if (categoryData?.id) {
        form.setValue('categoryId', categoryData.id.toString());
      }

      setShowSuccessModal(true);
      setCreatedCategoryName(categoryData?.name || "New Category");

      setTimeout(async () => {
        await refetchCategoriesSelection();
      }, 500);

    } catch (err) {
      console.error('Error handling new category:', err);
    }
  };

  const handleCategoryFormClose = () => {
    setShowCategoryForm(false);
    setTimeout(() => {
      refetchCategoriesSelection();
    }, 500);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setCreatedCategoryName("");
  };

  return (
    <div className="relative">
      {/* Header with Create Category Button */}
      <div className="flex justify-between items-start mb-6">
        <Header
          title="Add Product"
          subtext="Manage Stores and Supplies"
        />
        <Button
          type="button"
          onClick={handleCreateCategory}
          className="bg-[#F7931E] hover:bg-[#e8851a] text-white px-6 py-2 rounded-lg font-medium"
        >
          Create Category
        </Button>
      </div>

      <div className="my-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Premium Quality Rice"
                  {...field}
                />
              </FormControl>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
      </div>

      <div className="mb-6">
        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Brief product summary (e.g., Premium quality basmati rice, perfect for special occasions)"
                  {...field}
                />
              </FormControl>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
      </div>

      <div className="flex gap-6 mb-6">
        <FormField
          control={form.control}
          name="manufacturerId"
          render={({ field, fieldState }) => (
            <FormItem className="w-full">
              <FormLabel>Manufacturer</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={getManufacturersIsLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select manufacturer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getManufacturersIsLoading ? (
                    <SelectItem value="loading" disabled>Loading manufacturers...</SelectItem>
                  ) : getManufacturersData?.data?.length > 0 ? (
                    getManufacturersData.data.map((manu: any) => (
                      <SelectItem key={manu.id} value={manu.id.toString()}>
                        {manu.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-manufacturers" disabled>No manufacturers available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field, fieldState }) => (
            <FormItem className="w-full">
              <FormLabel>Product Category</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value}
                disabled={getCategoriesSelectionIsLoading}
              >
                <FormControl>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getCategoriesSelectionIsLoading ? (
                    <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                  ) : getCategoriesSelectionError ? (
                    <SelectItem value="error" disabled>Error loading categories</SelectItem>
                  ) : getCategoriesSelectionData && getCategoriesSelectionData.length > 0 ? (
                    getCategoriesSelectionData.map((cat: any) => {
                      return (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{cat.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })
                  ) : (
                    <SelectItem value="no-categories" disabled>
                      No categories available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
      </div>

      <div className="mb-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detailed product description..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
      </div>

      {/* Category Form Modal */}
      <CategoryForm
        isOpen={showCategoryForm}
        onClose={handleCategoryFormClose}
        onSuccess={handleCategorySuccess}
        mode="create"
      />

      {/* Success Modal */}
      <CategorySuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        categoryName={createdCategoryName}
      />
    </div>
  );
};

export default AddProduct;