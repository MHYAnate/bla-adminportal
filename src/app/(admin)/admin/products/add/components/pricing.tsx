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
import { Button } from "@/components/ui/button";
import Header from "@/app/(admin)/components/header";

interface iProps {
  form: any;
}

const AddPricing: React.FC<iProps> = ({ form }) => {
  return (
    <div>
      <Header
        title="Add product"
        subtext="Tell your buyers all they need to know about this product "
      />
      <div className="flex gap-6 mb-6">
        <FormField
          control={form.control}
          name="itemunit"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Item Unit</FormLabel>
              <FormControl>
                <Input type="text" placeholder="45" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="text" placeholder="50" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem className="w-full mb-6">
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input type="text" placeholder="5000" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex gap-6 mb-6">
        <FormField
          control={form.control}
          name="processingtime"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Processing Time</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="How long does it take to prepare an order? Select a processing time." />
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
          name="processingtime"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Delivery location(s)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
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
      <FormField
        control={form.control}
        name="acceptreturns"
        render={({ field }) => (
          <FormItem className="w-full mb-6">
            <FormLabel>Do you accept returns</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AddPricing;
