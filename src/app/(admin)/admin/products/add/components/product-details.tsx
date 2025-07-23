"use client";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/app/(admin)/components/header";
import { UseFormReturn } from "react-hook-form";
import { useGetManufacturers } from "@/services/manufacturers";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect } from "react";

interface iProps {
  form: UseFormReturn<any>;
}

const AddProduct: React.FC<iProps> = ({ form }) => {
  const {
    getManufacturersData,
    getManufacturersIsLoading,
  } = useGetManufacturers();

  const categories = [
    { id: "1", name: "Dry Staples & Grains" },
    { id: "2", name: "Spices & Seasonings" },
    { id: "3", name: "Oils & Fats" },
  ];

  useEffect(() => {
    if (getManufacturersData?.data?.length > 0 && !form.getValues("manufacturerId")) {
      form.setValue("manufacturerId", getManufacturersData.data[0].id.toString());
    }
  }, [getManufacturersData, form]);

  return (
    <div>
      <Header
        title="Add product"
        subtext="Tell your buyers all they need to know about this product"
      />

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
                    <SelectItem value="loading">Loading manufacturers...</SelectItem>
                  ) : (
                    getManufacturersData?.data?.map((manu: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                      <SelectItem key={manu.id} value= {manu.id ? manu.id.toString():""}>
                        {manu.name}
                      </SelectItem>
                    ))
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
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
    </div>
  );
};

export default AddProduct;