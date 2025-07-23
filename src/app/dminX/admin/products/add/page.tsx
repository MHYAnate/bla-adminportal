"use client";

import AddProduct from "./components/product-details";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import AddPricing from "./components/pricing";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AddProductsPage() {
  const [activeTab, setActiveTab] = useState<string>("add-product");
  const formSchema = z.object({
    productname: z.string().min(5, "Name must be greater 4"),
    brand: z.string(),
    fulldescription: z
      .string()
      .min(10, {
        message: "Bio must be at least 10 characters.",
      })
      .max(160, {
        message: "Bio must not be longer than 30 characters.",
      }),
    shortdescription: z.string(),
    productcategory: z.string(),
    itemunit: z.number(),
    quantity: z.string(),
    price: z.string().min(10, { message: "Greater than 10" }),
    processingtime: z.string(),
    location: z.string(),
    acceptreturns: z.string(),
  });
  const formData = {
    productname: "",
    brand: "",
    productcategory: "",
    fulldescription: "",
    shortdescription: "",
    price: "",
    quantity: "",
    itemunit: 0,
    processingtime: "",
    location: "",
    acceptreturns: "",
  };
  type FormSchemaType = z.infer<typeof formSchema>;
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });
  async function onSubmit(values: FormSchemaType) {
    const isValid = await trigger();
    if (isValid) {
      if (activeTab === "add-product") {
        setActiveTab("add-pricing");
      }
    } else {
      alert("Please complete the required fields.");
    }
    console.warn(values);
  }

  const {
    watch,
    formState: { errors },
    trigger,
  } = form;
  console.log(errors);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveTab("add-pricing");
  };
  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8 mt-6">
          {activeTab === "add-pricing" ? (
            <AddPricing form={form} />
          ) : (
            <AddProduct form={form} />
          )}
          <div className="gap-5 justify-end flex">
            {activeTab === "add-pricing" && (
              <Button
                variant="outline"
                className="w-auto py-4 px-[3rem] font-bold text-base"
                size="xl"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("add-product");
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              variant="warning"
              className="w-auto px-[3rem] py-4 font-bold text-base"
              size="xl"
            >
              Next
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
