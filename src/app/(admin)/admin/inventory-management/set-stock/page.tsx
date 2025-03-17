"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/app/(admin)/components/header";

export default function SetStockLimitPage() {
  const formSchema = z.object({
    productName: z.string().min(5, "Name must be greater 4"),
    productId: z.string(),
    reorder: z.string(),
    currentStockLevel: z.string(),
    maxStockLevel: z.string(),
    minStockLevel: z.string(),
    supplierdescription: z
      .string()
      .min(10, {
        message: "Bio must be at least 10 characters.",
      })
      .max(160, {
        message: "Bio must not be longer than 30 characters.",
      }),
  });

  type FormSchemaType = z.infer<typeof formSchema>;
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productId: "",
      reorder: "",
      currentStockLevel: "",
      supplierdescription: "",
      maxStockLevel: "",
      minStockLevel: "",
    },
  });
  async function onSubmit(values: FormSchemaType) {
    console.warn(values);
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <Header
            title="Set Stock Limits"
            subtext="Define minimum and maximum stock levels to optimize inventory management."
          />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8 mt-6">
              <div className="flex gap-6 mb-6">
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Product Id</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Cocoa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Produc Id</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Cocoa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-6 mb-6">
                <FormField
                  control={form.control}
                  name="minStockLevel"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Minimum Stock Level</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxStockLevel"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Maximum Stock Level</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-6 mb-6">
                <FormField
                  control={form.control}
                  name="currentStockLevel"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Current Stock Level</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reorder"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Reorder Quantity</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-6 mb-10">
                <FormField
                  control={form.control}
                  name="supplierdescription"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Supplier Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about the product"
                          className="resize-none h-[169px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  variant="warning"
                  className="w-auto px-[3rem] py-4 font-bold text-base"
                  size="xl"
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
