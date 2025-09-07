"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { UseFormReturn } from "react-hook-form";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useGetManufacturers } from "@/services/manufacturers";
import { useGetCategoriesForSelection } from "@/services/categories";
import CategoryForm from "../../../categories/components/categoryForm";
import CategorySuccessModal from "../../../categories/components/categorySuccessModal";





interface Props {
  form: UseFormReturn<any>;
}

const AddProduct: React.FC<Props> = ({ form }) => {
  // const [showCategoryForm, setShowCategoryForm] = useState(false);

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdCategoryName, setCreatedCategoryName] = useState("");


  const {
    getManufacturersData,
    getManufacturersIsLoading,
    setManufacturersFilter,
  } = useGetManufacturers();
   useEffect(() => {
      if (getManufacturersData) {
        setManufacturersFilter({ page: "1", pageSize: 1000 });
      }
    }, []);

  console.log(getManufacturersData,"apm")

  const {
    getCategoriesSelectionData,
    getCategoriesSelectionIsLoading,
    getCategoriesSelectionError,
    refetchCategoriesSelection
  } = useGetCategoriesForSelection();

  // useEffect(() => {
  //   if (getManufacturersData?.data?.length > 0 && !form.getValues("manufacturerId")) {
  //     form.setValue("manufacturerId", getManufacturersData.data[0].id.toString());
  //   }
  // }, [getManufacturersData, form]);

  // const handleCreateCategory = () => {
  //   setShowCategoryForm(true);
  // };

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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">Create a new product with advanced pricing options</p>
        </div>
        <Button
          type="button"
          onClick={handleCreateCategory}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Category
        </Button>
      </div>

      {/* Product Information Card */}
      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Information</h2>
          
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Product Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Premium Quality Rice"
                      className="h-11"
                      {...field}
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
              name="shortDescription"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Short Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief product summary for listings"
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="manufacturerId"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Manufacturer</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={getManufacturersIsLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
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
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Product Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={getCategoriesSelectionIsLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getCategoriesSelectionIsLoading ? (
                          <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                        ) : getCategoriesSelectionError ? (
                          <SelectItem value="error" disabled>Error loading categories</SelectItem>
                        ) : getCategoriesSelectionData && getCategoriesSelectionData.length > 0 ? (
                          getCategoriesSelectionData.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              <div className="flex flex-col">
                                <span className="font-medium">{cat.name}</span>
                              </div>
                            </SelectItem>
                          ))
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

            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Product Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed product description for customers..."
                      className="min-h-[120px] resize-none"
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
        </div>
      </div>
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