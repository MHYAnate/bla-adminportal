"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/app/(admin)/components/header";

interface iProps {
  form: any;
}

const AddProduct: React.FC<iProps> = ({ form }) => {
  return (
    <div>
      <Header
        title="Add product"
        subtext="Tell your buyers all they need to know about this product "
      />

      <div className="flex gap-6 my-6">
        <FormField
          control={form.control}
          name="productname"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Nescafe Classic Coffe"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Product Brand</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select A Brand" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="usdc">Cocoa</SelectItem>
                  <SelectItem value="usdt">Textile</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex gap-6 mb-6">
        <FormField
          control={form.control}
          name="productcategory"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Product Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Admin role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="usdc">Cocoa</SelectItem>
                  <SelectItem value="usdt">Textile</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shortdescription"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Oryza Sativa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex gap-6 mb-6">
        <FormField
          control={form.control}
          name="fulldescription"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none h-[169px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AddProduct;
