// // "use client";

// // import AddProduct from "./components/product-details";
// // import AddPricing from "./components/pricing";
// // import { z } from "zod";
// // import { useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { Form } from "@/components/ui/form";
// // import { useState } from "react";
// // import { Button } from "@/components/ui/button";
// // import { toast } from "sonner";
// // import { useRouter } from "next/navigation";
// // // ✅ FIXED: Use the service hook instead of direct API calls
// // import { useCreateProduct } from "@/services/products";

// // // Product option type updated for new pricing structure
// // export type ProductOption = {
// //   value: string;
// //   imageFiles?: File[];
// //   images?: string[];
// //   inventory: number;
// //   stockPrice: number; // What we pay manufacturer
// //   price: number; // What customers pay individually
// //   discountType: "NONE" | "PERCENTAGE" | "FIXED";
// //   bulkDiscount: number;
// //   minimumBulkQuantity: number;
// //   weight: number;
// //   unit: string;
// // };

// // export default function AddProductsPage() {
// //   const router = useRouter();
// //   const [activeTab, setActiveTab] = useState<"add-product" | "add-pricing" | "pricing">("add-product");

// //   // ✅ FIXED: Use the service hook instead of manual state management
// //   const { createProduct, isCreating } = useCreateProduct({
// //     onSuccess: () => {
// //       toast.success("Product created successfully with three-tier pricing!");
// //       router.push("/admin/products");
// //     }
// //   });

// //   // Enhanced form schema with proper price validation
// //   const formSchema = z.object({
// //     name: z.string().min(3, "Product name must be at least 3 characters"),
// //     description: z.string().min(10, "Description must be at least 10 characters"),
// //     // shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
// //     categoryId: z.string().min(1, "Category is required"),
// //     manufacturerId: z.string().min(1, "Manufacturer is required"),
// //     processingTimeDays: z.number().min(1, "Processing time must be at least 1 day").default(1),
// //     minDeliveryDays: z.number().min(1, "Minimum delivery days must be at least 1").default(1),
// //     maxDeliveryDays: z.number().min(1, "Maximum delivery days must be at least 1").default(7),
// //     includeSaturdays: z.boolean().default(false),
// //     acceptsReturns: z.boolean().default(true),
// //     options: z.array(
// //       z.object({
// //         value: z.string().min(1, "Option value is required"),
// //         inventory: z.number().min(0, "Inventory cannot be negative"),
// //         stockPrice: z.number().min(0, "Stock price cannot be negative"),
// //         price: z.number().min(0.01, "Retail price must be at least 0.01"),
// //         discountType: z.enum(["NONE", "PERCENTAGE", "FIXED"]).default("NONE"),
// //         bulkDiscount: z.number().min(0).default(0),
// //         minimumBulkQuantity: z.number().min(1).default(1),
// //         weight: z.number().min(0.1, "Weight must be at least 0.1"),
// //         unit: z.string().min(1, "Unit is required"),
// //         imageFiles: z.array(z.instanceof(File)).optional(),
// //       })
// //         .refine((option) => {
// //           // Stock price must be less than retail price for profitability
// //           if (option.stockPrice > 0 && option.stockPrice >= option.price) {
// //             return false;
// //           }
// //           return true;
// //         }, {
// //           message: "Stock price must be less than retail price for profitability",
// //           path: ["stockPrice"]
// //         })
// //         .refine((option) => {
// //           // If bulk pricing is enabled, validate discount values
// //           if (option.discountType !== "NONE") {
// //             if (option.bulkDiscount <= 0) {
// //               return false;
// //             }
// //             if (option.discountType === "PERCENTAGE" && option.bulkDiscount > 100) {
// //               return false;
// //             }
// //             if (option.discountType === "FIXED" && option.bulkDiscount >= option.price) {
// //               return false;
// //             }
// //             if (option.minimumBulkQuantity < 2) {
// //               return false;
// //             }

// //             // Calculate bulk price and ensure it's profitable
// //             let bulkPrice = option.price;
// //             if (option.discountType === "PERCENTAGE") {
// //               bulkPrice = option.price * (1 - option.bulkDiscount / 100);
// //             } else if (option.discountType === "FIXED") {
// //               bulkPrice = option.price - option.bulkDiscount;
// //             }

// //             // Bulk price must be greater than stock price for profitability
// //             if (option.stockPrice > 0 && bulkPrice <= option.stockPrice) {
// //               return false;
// //             }
// //           }
// //           return true;
// //         }, {
// //           message: "Invalid bulk pricing configuration. Check discount values and ensure bulk price maintains profitability.",
// //           path: ["bulkDiscount"]
// //         })
// //     ).min(1, "At least one product option is required"),
// //   })
// //     .refine((data) => {
// //       // Validate delivery timeline
// //       return data.minDeliveryDays <= data.maxDeliveryDays;
// //     }, {
// //       message: "Minimum delivery days cannot be greater than maximum delivery days",
// //       path: ["maxDeliveryDays"]
// //     });

// //   type FormSchemaType = z.infer<typeof formSchema>;

// //   const form = useForm<FormSchemaType>({
// //     resolver: zodResolver(formSchema),
// //     defaultValues: {
// //       name: "",
// //       description: "",
// //       // shortDescription: "",
// //       categoryId: "",
// //       manufacturerId: "",
// //       processingTimeDays: 1,
// //       minDeliveryDays: 1,
// //       maxDeliveryDays: 7,
// //       includeSaturdays: false,
// //       acceptsReturns: true,
// //       options: [{
// //         value: "",
// //         inventory: 0,
// //         stockPrice: 0, // What we pay manufacturer
// //         price: 0, // What customers pay individually
// //         discountType: "NONE",
// //         bulkDiscount: 0,
// //         minimumBulkQuantity: 1,
// //         weight: 0,
// //         unit: "",
// //         imageFiles: [],
// //       }],
// //     },
// //   });

// //   // ✅ FIXED: Use the service hook instead of direct API calls (same as edit)
// //   const handleFinalSubmit = async (values: FormSchemaType) => {
// //     try {
// //       console.log('📤 Submitting product creation via service hook:', values);

// //       // ✅ Call createProduct with the form values directly (same pattern as edit)
// //       await createProduct(values as any);

// //       // Success handling is done in the service hook

// //     } catch (error) {
// //       console.error("Create failed:", error);
// //       // Error handling is done in the service hook
// //     }
// //   };

// //   const onSubmit = async () => {
// //     try {
// //       // Validate current tab fields
// //       const fields = activeTab === "add-product"
// //         ? ["name", "description", "categoryId", "manufacturerId"]
// //         : ["options"];

// //       const isValid = await form.trigger(fields as any);
// //       if (!isValid) return;

// //       if (activeTab === "add-product") {
// //         setActiveTab("add-pricing");
// //       } else {
// //         await handleFinalSubmit(form.getValues());
// //       }
// //     } catch (error) {
// //       toast.error("Validation failed. Please check your inputs.");
// //     }
// //   };

// //   return (
// //     <section>
// //       <Form {...form}>
// //         <form onSubmit={(e) => e.preventDefault()} className="mb-8 mt-6">
// //           {activeTab === "add-pricing" ? (
// //             <AddPricing form={form} isSubmitting={isCreating} />
// //           ) : (
// //             <AddProduct form={form} />
// //           )}

// //           <div className="flex justify-end gap-5 mt-8">
// //             {activeTab === "add-pricing" && (
// //               <Button
// //                 variant="outline"
// //                 type="button"
// //                 className="w-auto py-4 px-[3rem] font-bold text-base"
// //                 size="xl"
// //                 onClick={() => setActiveTab("add-product")}
// //                 disabled={isCreating}
// //               >
// //                 Back
// //               </Button>
// //             )}
// //             <Button
// //               type="button"
// //               variant="warning"
// //               className="w-auto px-[3rem] py-4 font-bold text-base"
// //               size="xl"
// //               onClick={onSubmit}
// //               disabled={isCreating}
// //             >
// //               {isCreating ? "Processing..." :
// //                 activeTab === "add-product" ? "Next" : "Create Product"}
// //             </Button>
// //           </div>
// //         </form>
// //       </Form>
// //     </section>
// //   );
// // }

// // "use client";
// // import { useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { productFormSchema } from "./components/schema";
// // import { useCreateProductWithProfit } from "@/services/products";
// // import { Form } from "@/components/ui/form";
// // import { Button } from "@/components/ui/button";
// // import { useState } from "react";
// // import AddProduct from "./components/AddProduct";
// // import AddProfitOptions from "./components/AddProfitOptions";

// // export default function AddProductsPage() {
// //   const [activeTab, setActiveTab] = useState<"details" | "options">("details");

// //   const { createProduct, isCreating } = useCreateProductWithProfit({
// //     onSuccess: () => console.log("✅ Product created"),
// //   });

// //   const form = useForm({
// //     resolver: zodResolver(productFormSchema),
// //     defaultValues: {
// //       name: "",
// //       description: "",
// //       categoryId: "",
// //       manufacturerId: "",
// //       processingTimeDays: 1,
// //       minDeliveryDays: 1,
// //       maxDeliveryDays: 7,
// //       includeSaturdays: false,
// //       acceptsReturns: true,
// //       options: [],
// //     },
// //   });

// //   const handleSubmit = async (values: any) => {
// //     await createProduct(values);
// //   };

// //   return (
// //     <Form {...form}>
// //       <form onSubmit={(e) => e.preventDefault()}>
// //         {activeTab === "details" ? (
// //           <AddProduct form={form} />
// //         ) : (
// //           <AddProfitOptions form={form} isSubmitting={isCreating} />
// //         )}

// //         <div className="flex justify-end gap-4 mt-6">
// //           {activeTab === "options" && (
// //             <Button type="button" onClick={() => setActiveTab("details")} variant="outline">
// //               Back
// //             </Button>
// //           )}
// //           <Button
// //             type="button"
// //             onClick={async () => {
// //               const valid = await form.trigger(
// //                 activeTab === "details"
// //                   ? ["name", "description", "categoryId", "manufacturerId"]
// //                   : ["options"]
// //               );
// //               if (!valid) return;
// //               if (activeTab === "details") setActiveTab("options");
// //               else handleSubmit(form.getValues());
// //             }}
// //             disabled={isCreating}
// //           >
// //             {isCreating ? "Processing..." : activeTab === "details" ? "Next" : "Create Product"}
// //           </Button>
// //         </div>
// //       </form>
// //     </Form>
// //   );
// // }



// // src/app/(admin)/admin/products/add/page.tsx
// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Form } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import ProductDetailsTab from "./components/product-details-tab";
// import PricingOptionsTab from "./components/pricing-options-tab";
// import { useCreateProduct } from "@/services/products";

// // Product option type with dual profit support
// export type ProductOption = {
//   value: string;
//   imageFiles?: File[];
//   images?: string[];
//   inventory: number;
//   weight: number;
//   unit: string;
//   // MARKUP fields
//   stockPrice?: number;
//   retailPrice?: number;
//   discountType?: "NONE" | "PERCENTAGE" | "FIXED";
//   bulkDiscount?: number;
//   minimumBulkQuantity?: number;
//   // COMMISSION fields
//   supplierPrice?: number;
//   commissionRate?: number;
//   // Profit type selector
//   profitType: "MARKUP" | "COMMISSION";
// };

// // Form schema with dual profit validation
// const formSchema = z.object({
//   name: z.string().min(3, "Product name must be at least 3 characters"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   shortDescription: z.string().optional(),
//   categoryId: z.string().min(1, "Category is required"),
//   manufacturerId: z.string().min(1, "Manufacturer is required"),
//   processingTimeDays: z.number().min(1, "Processing time must be at least 1 day").default(1),
//   minDeliveryDays: z.number().min(1, "Minimum delivery days must be at least 1").default(1),
//   maxDeliveryDays: z.number().min(1, "Maximum delivery days must be at least 1").default(7),
//   includeSaturdays: z.boolean().default(false),
//   acceptsReturns: z.boolean().default(true),
//   options: z.array(
//     z.object({
//       value: z.string().min(1, "Option value is required"),
//       inventory: z.number().min(0, "Inventory cannot be negative"),
//       weight: z.number().min(0.1, "Weight must be at least 0.1"),
//       unit: z.string().min(1, "Unit is required"),
//       imageFiles: z.array(z.instanceof(File)).optional(),
//       profitType: z.enum(["MARKUP", "COMMISSION"]),
//       // MARKUP validation
//       stockPrice: z.number().min(0, "Stock price cannot be negative").optional(),
//       retailPrice: z.number().min(0.01, "Retail price must be at least 0.01").optional(),
//       discountType: z.enum(["NONE", "PERCENTAGE", "FIXED"]).default("NONE").optional(),
//       bulkDiscount: z.number().min(0).default(0).optional(),
//       minimumBulkQuantity: z.number().min(1).default(1).optional(),
//       // COMMISSION validation
//       supplierPrice: z.number().min(0, "Supplier price cannot be negative").optional(),
//       commissionRate: z.number().min(0, "Commission rate cannot be negative").max(100, "Commission rate cannot exceed 100%").optional(),
//     })
//     .superRefine((data, ctx) => {
//       // MARKUP validation
//       if (data.profitType === "MARKUP") {
//         if (!data.retailPrice || data.retailPrice <= 0) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: "Retail price is required for markup products",
//             path: ["retailPrice"],
//           });
//         }
        
//         if (data.stockPrice && data.stockPrice >= (data.retailPrice || 0)) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: "Stock price must be less than retail price",
//             path: ["stockPrice"],
//           });
//         }
        
//         if (data.discountType !== "NONE") {
//           if (!data.bulkDiscount || data.bulkDiscount <= 0) {
//             ctx.addIssue({
//               code: z.ZodIssueCode.custom,
//               message: "Bulk discount is required when discount type is enabled",
//               path: ["bulkDiscount"],
//             });
//           }
          
//           if (data.discountType === "PERCENTAGE" && (data.bulkDiscount || 0) > 100) {
//             ctx.addIssue({
//               code: z.ZodIssueCode.custom,
//               message: "Percentage discount cannot exceed 100%",
//               path: ["bulkDiscount"],
//             });
//           }
          
//           if (!data.minimumBulkQuantity || (data.minimumBulkQuantity || 0) < 2) {
//             ctx.addIssue({
//               code: z.ZodIssueCode.custom,
//               message: "Minimum bulk quantity must be at least 2",
//               path: ["minimumBulkQuantity"],
//             });
//           }
//         }
//       }
      
//       // COMMISSION validation
//       if (data.profitType === "COMMISSION") {
//         if (!data.supplierPrice || data.supplierPrice <= 0) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: "Supplier price is required for commission products",
//             path: ["supplierPrice"],
//           });
//         }
        
//         if (!data.commissionRate || data.commissionRate <= 0 || data.commissionRate > 100) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: "Commission rate must be between 1-100%",
//             path: ["commissionRate"],
//           });
//         }
        
//         // Commission products cannot have bulk pricing
//         if (data.discountType && data.discountType !== "NONE") {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: "Commission products do not support bulk pricing",
//             path: ["discountType"],
//           });
//         }
//       }
//     })
//   ).min(1, "At least one product option is required"),
// })
// .refine((data) => data.minDeliveryDays <= data.maxDeliveryDays, {
//   message: "Minimum delivery days cannot be greater than maximum delivery days",
//   path: ["maxDeliveryDays"],
// });

// type FormSchemaType = z.infer<typeof formSchema>;

// export default function AddProductsPage() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState<"details" | "pricing">("details");

//   const { createProduct, isCreating } = useCreateProduct({
//     onSuccess: () => {
//       toast.success("Product created successfully!");
//       router.push("/admin/products");
//     }
//   });

//   const form = useForm<FormSchemaType>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       description: "",
//       shortDescription: "",
//       categoryId: "",
//       manufacturerId: "",
//       processingTimeDays: 1,
//       minDeliveryDays: 1,
//       maxDeliveryDays: 7,
//       includeSaturdays: false,
//       acceptsReturns: true,
//       options: [{
//         value: "",
//         inventory: 0,
//         weight: 0,
//         unit: "",
//         profitType: "MARKUP",
//         stockPrice: 0,
//         retailPrice: 0,
//         discountType: "NONE",
//         bulkDiscount: 0,
//         minimumBulkQuantity: 1,
//         imageFiles: [],
//       }],
//     },
//   });

//   const handleFinalSubmit = async (values: FormSchemaType) => {
//     try {
//       await createProduct(values as any);
//     } catch (error) {
//       console.error("Create failed:", error);
//     }
//   };

//   const onSubmit = async () => {
//     try {
//       const fields = activeTab === "details"
//         ? ["name", "description", "categoryId", "manufacturerId"]
//         : ["options"];

//       const isValid = await form.trigger(fields as any);
//       if (!isValid) return;

//       if (activeTab === "details") {
//         setActiveTab("pricing");
//       } else {
//         await handleFinalSubmit(form.getValues());
//       }
//     } catch (error) {
//       toast.error("Validation failed. Please check your inputs.");
//     }
//   };

//   return (
//     <section className="container mx-auto py-6">
//       <Form {...form}>
//         <form onSubmit={(e) => e.preventDefault()} className="mb-8">
//           <div className="flex border-b mb-6">
//             <button
//               type="button"
//               onClick={() => setActiveTab("details")}
//               className={`py-2 px-4 font-medium ${
//                 activeTab === "details"
//                   ? "border-b-2 border-blue-500 text-blue-600"
//                   : "text-gray-500"
//               }`}
//             >
//               Product Details
//             </button>
//             <button
//               type="button"
//               onClick={() => setActiveTab("pricing")}
//               className={`py-2 px-4 font-medium ${
//                 activeTab === "pricing"
//                   ? "border-b-2 border-blue-500 text-blue-600"
//                   : "text-gray-500"
//               }`}
//             >
//               Pricing & Options
//             </button>
//           </div>

//           {activeTab === "details" ? (
//             <ProductDetailsTab isSubmitting={isCreating} form={form} />
//           ) : (
//             <PricingOptionsTab form={form} isSubmitting={isCreating} />
//           )}

//           <div className="flex justify-end gap-4 mt-8">
//             {activeTab === "pricing" && (
//               <Button
//                 variant="outline"
//                 type="button"
//                 onClick={() => setActiveTab("details")}
//                 disabled={isCreating}
//               >
//                 Back
//               </Button>
//             )}
//             <Button
//               type="button"
//               onClick={onSubmit}
//               disabled={isCreating}
//             >
//               {isCreating ? "Processing..." : activeTab === "details" ? "Next" : "Create Product"}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </section>
//   );
// }

"use client";

import AddProduct from "./components/productdetails";
import AddPricing from "./components/pricingtab";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./components/ui/form";
import { useState } from "react";
import { Button } from "./components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreateProduct } from "@/services/products";

// Enhanced form schema with dual profit support
// const formSchema = z.object({
//   name: z.string().min(3, "Product name must be at least 3 characters"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   shortDescription: z.string().optional(),
//   categoryId: z.string().min(1, "Category is required"),
//   manufacturerId: z.string().min(1, "Manufacturer is required"),
//   processingTimeDays: z.number().min(1, "Processing time must be at least 1 day").default(1),
//   minDeliveryDays: z.number().min(1, "Minimum delivery days must be at least 1").default(1),
//   maxDeliveryDays: z.number().min(1, "Maximum delivery days must be at least 1").default(7),
//   includeSaturdays: z.boolean().default(false),
//   acceptsReturns: z.boolean().default(true),
//   options: z.array(
//     z.discriminatedUnion('profitType', [
//       // MARKUP profit type
//       z.object({
//         profitType: z.literal('MARKUP'),
//         value: z.string().min(1, "Option value is required"),
//         inventory: z.number().min(0, "Inventory cannot be negative"),
//         weight: z.number().min(0.1, "Weight must be at least 0.1"),
//         unit: z.string().min(1, "Unit is required"),
//         stockPrice: z.number().min(0, "Stock price cannot be negative"),
//         retailPrice: z.number().min(0.01, "Retail price must be at least 0.01"),
//         discountType: z.enum(["NONE", "PERCENTAGE", "FIXED"]).default("NONE"),
//         bulkDiscount: z.number().min(0).default(0),
//         minimumBulkQuantity: z.number().min(1).default(1),
//         imageFiles: z.array(z.instanceof(File)).optional(),
//       }).refine((option) => {
//         // Stock price must be less than retail price
//         if (option.stockPrice > 0 && option.stockPrice >= option.retailPrice) {
//           return false;
//         }
//         return true;
//       }, {
//         message: "Stock price must be less than retail price for profitability",
//         path: ["stockPrice"]
//       }).refine((option) => {
//         // Validate bulk pricing configuration
//         if (option.discountType !== "NONE") {
//           if (option.bulkDiscount <= 0) return false;
//           if (option.discountType === "PERCENTAGE" && option.bulkDiscount > 100) return false;
//           if (option.discountType === "FIXED" && option.bulkDiscount >= option.retailPrice) return false;
//           if (option.minimumBulkQuantity < 2) return false;

//           // Calculate bulk price and ensure profitability
//           let bulkPrice = option.retailPrice;
//           if (option.discountType === "PERCENTAGE") {
//             bulkPrice = option.retailPrice * (1 - option.bulkDiscount / 100);
//           } else if (option.discountType === "FIXED") {
//             bulkPrice = option.retailPrice - option.bulkDiscount;
//           }

//           if (option.stockPrice > 0 && bulkPrice <= option.stockPrice) {
//             return false;
//           }
//         }
//         return true;
//       }, {
//         message: "Invalid bulk pricing configuration. Ensure bulk price maintains profitability.",
//         path: ["bulkDiscount"]
//       }),
      
//       // COMMISSION profit type
//       z.object({
//         profitType: z.literal('COMMISSION'),
//         value: z.string().min(1, "Option value is required"),
//         inventory: z.number().min(0, "Inventory cannot be negative"),
//         weight: z.number().min(0.1, "Weight must be at least 0.1"),
//         unit: z.string().min(1, "Unit is required"),
//         supplierPrice: z.number().min(0.01, "Supplier price must be greater than 0"),
//         commissionRate: z.number().min(0.1, "Commission rate must be at least 0.1%").max(100, "Commission rate cannot exceed 100%"),
//         imageFiles: z.array(z.instanceof(File)).optional(),
//       })
//     ])
//   ).min(1, "At least one product option is required"),
// })

// const markupOptionSchema = z
//   .object({
//     profitType: z.literal("MARKUP"),
//     value: z.string().min(1, "Option value is required"),
//     inventory: z.number().min(0, "Inventory cannot be negative"),
//     weight: z.number().min(0.1, "Weight must be at least 0.1"),
//     unit: z.string().min(1, "Unit is required"),
//     stockPrice: z.number().min(0, "Stock price cannot be negative"),
//     retailPrice: z.number().min(0.01, "Retail price must be at least 0.01"),
//     discountType: z.enum(["NONE", "PERCENTAGE", "FIXED"]).default("NONE"),
//     bulkDiscount: z.number().min(0).default(0),
//     minimumBulkQuantity: z.number().min(1).default(1),
//     imageFiles: z.array(z.instanceof(File)).optional(),
//   })
//   .superRefine((option, ctx) => {
//     if (option.stockPrice > 0 && option.stockPrice >= option.retailPrice) {
//       ctx.addIssue({
//         path: ["stockPrice"],
//         code: z.ZodIssueCode.custom,
//         message: "Stock price must be less than retail price for profitability",
//       });
//     }

//     if (option.discountType !== "NONE") {
//       if (option.bulkDiscount <= 0) {
//         ctx.addIssue({
//           path: ["bulkDiscount"],
//           code: z.ZodIssueCode.custom,
//           message: "Bulk discount must be greater than 0",
//         });
//       }

//       if (
//         option.discountType === "PERCENTAGE" &&
//         option.bulkDiscount > 100
//       ) {
//         ctx.addIssue({
//           path: ["bulkDiscount"],
//           code: z.ZodIssueCode.custom,
//           message: "Percentage discount cannot exceed 100%",
//         });
//       }

//       if (
//         option.discountType === "FIXED" &&
//         option.bulkDiscount >= option.retailPrice
//       ) {
//         ctx.addIssue({
//           path: ["bulkDiscount"],
//           code: z.ZodIssueCode.custom,
//           message: "Fixed discount must be less than retail price",
//         });
//       }

//       if (option.minimumBulkQuantity < 2) {
//         ctx.addIssue({
//           path: ["minimumBulkQuantity"],
//           code: z.ZodIssueCode.custom,
//           message: "Minimum bulk quantity must be at least 2",
//         });
//       }

//       let bulkPrice = option.retailPrice;
//       if (option.discountType === "PERCENTAGE") {
//         bulkPrice = option.retailPrice * (1 - option.bulkDiscount / 100);
//       } else if (option.discountType === "FIXED") {
//         bulkPrice = option.retailPrice - option.bulkDiscount;
//       }

//       if (option.stockPrice > 0 && bulkPrice <= option.stockPrice) {
//         ctx.addIssue({
//           path: ["bulkDiscount"],
//           code: z.ZodIssueCode.custom,
//           message:
//             "Invalid bulk pricing configuration. Ensure bulk price maintains profitability.",
//         });
//       }
//     }
//   });

// const commissionOptionSchema = z.object({
//   profitType: z.literal("COMMISSION"),
//   value: z.string().min(1, "Option value is required"),
//   inventory: z.number().min(0, "Inventory cannot be negative"),
//   weight: z.number().min(0.1, "Weight must be at least 0.1"),
//   unit: z.string().min(1, "Unit is required"),
//   supplierPrice: z.number().min(0.01, "Supplier price must be greater than 0"),
//   commissionRate: z
//     .number()
//     .min(0.1, "Commission rate must be at least 0.1%")
//     .max(100, "Commission rate cannot exceed 100%"),
//   imageFiles: z.array(z.instanceof(File)).optional(),
// });

// export const formSchema = z.object({
//   name: z.string().min(3, "Product name must be at least 3 characters"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   shortDescription: z.string().optional(),
//   categoryId: z.string().min(1, "Category is required"),
//   manufacturerId: z.string().min(1, "Manufacturer is required"),
//   processingTimeDays: z
//     .number()
//     .min(1, "Processing time must be at least 1 day")
//     .default(1),
//   minDeliveryDays: z
//     .number()
//     .min(1, "Minimum delivery days must be at least 1")
//     .default(1),
//   maxDeliveryDays: z
//     .number()
//     .min(1, "Maximum delivery days must be at least 1")
//     .default(7),
//   includeSaturdays: z.boolean().default(false),
//   acceptsReturns: z.boolean().default(true),
//   options: z
//     .array(z.discriminatedUnion("profitType", [markupOptionSchema, commissionOptionSchema]))
//     .min(1, "At least one product option is required"),
// })
// .refine((data) => {
//   return data.minDeliveryDays <= data.maxDeliveryDays;
// }, {
//   message: "Minimum delivery days cannot be greater than maximum delivery days",
//   path: ["maxDeliveryDays"]
// });


// 1️⃣ Base MARKUP schema (must be ZodObject)
const markupOptionBaseSchema = z.object({
  profitType: z.literal("MARKUP"),
  value: z.string().min(1, "Option value is required"),
  inventory: z.number().min(0, "Inventory cannot be negative"),
  weight: z.number().min(0.1, "Weight must be at least 0.1"),
  unit: z.string().min(1, "Unit is required"),
  stockPrice: z.number().min(0, "Stock price cannot be negative"),
  retailPrice: z.number().min(0.01, "Retail price must be at least 0.01"),
  discountType: z.enum(["NONE", "PERCENTAGE", "FIXED"]).default("NONE"),
  bulkDiscount: z.number().min(0).default(0),
  minimumBulkQuantity: z.number().min(1).default(1),
  imageFiles: z.array(z.instanceof(File)).optional(),
});

// 2️⃣ COMMISSION schema
const commissionOptionSchema = z.object({
  profitType: z.literal("COMMISSION"),
  value: z.string().min(1, "Option value is required"),
  inventory: z.number().min(0, "Inventory cannot be negative"),
  weight: z.number().min(0.1, "Weight must be at least 0.1"),
  unit: z.string().min(1, "Unit is required"),
  supplierPrice: z.number().min(0.01, "Supplier price must be greater than 0"),
  commissionRate: z
    .number()
    .min(0.1, "Commission rate must be at least 0.1%")
    .max(100, "Commission rate cannot exceed 100%"),
  imageFiles: z.array(z.instanceof(File)).optional(),
});

// 3️⃣ Discriminated union using plain schemas
const optionSchema = z.discriminatedUnion("profitType", [
  markupOptionBaseSchema,
  commissionOptionSchema,
]);

// 4️⃣ Final form schema with top-level refinement
const formSchema = z
  .object({
    name: z.string().min(3, "Product name must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    shortDescription: z.string().optional(),
    categoryId: z.string().min(1, "Category is required"),
    manufacturerId: z.string().min(1, "Manufacturer is required"),
    processingTimeDays: z.number().min(1).default(1),
    minDeliveryDays: z.number().min(1).default(1),
    maxDeliveryDays: z.number().min(1).default(7),
    includeSaturdays: z.boolean().default(false),
    acceptsReturns: z.boolean().default(true),
    options: z.array(optionSchema).min(1, "At least one product option is required"),
  })
  .superRefine((data, ctx) => {
    // Delivery days check
    if (data.minDeliveryDays > data.maxDeliveryDays) {
      ctx.addIssue({
        path: ["maxDeliveryDays"],
        code: z.ZodIssueCode.custom,
        message: "Minimum delivery days cannot be greater than maximum delivery days",
      });
    }

    // MARKUP-specific validations
    data.options.forEach((option, index) => {
      if (option.profitType === "MARKUP") {
        if (option.stockPrice > 0 && option.stockPrice >= option.retailPrice) {
          ctx.addIssue({
            path: ["options", index, "stockPrice"],
            code: z.ZodIssueCode.custom,
            message: "Stock price must be less than retail price for profitability",
          });
        }

        if (option.discountType !== "NONE") {
          if (option.bulkDiscount <= 0) {
            ctx.addIssue({
              path: ["options", index, "bulkDiscount"],
              code: z.ZodIssueCode.custom,
              message: "Bulk discount must be greater than 0",
            });
          }

          if (option.discountType === "PERCENTAGE" && option.bulkDiscount > 100) {
            ctx.addIssue({
              path: ["options", index, "bulkDiscount"],
              code: z.ZodIssueCode.custom,
              message: "Percentage discount cannot exceed 100%",
            });
          }

          if (option.discountType === "FIXED" && option.bulkDiscount >= option.retailPrice) {
            ctx.addIssue({
              path: ["options", index, "bulkDiscount"],
              code: z.ZodIssueCode.custom,
              message: "Fixed discount must be less than retail price",
            });
          }

          if (option.minimumBulkQuantity < 2) {
            ctx.addIssue({
              path: ["options", index, "minimumBulkQuantity"],
              code: z.ZodIssueCode.custom,
              message: "Minimum bulk quantity must be at least 2",
            });
          }

          let bulkPrice = option.retailPrice;
          if (option.discountType === "PERCENTAGE") {
            bulkPrice = option.retailPrice * (1 - option.bulkDiscount / 100);
          } else if (option.discountType === "FIXED") {
            bulkPrice = option.retailPrice - option.bulkDiscount;
          }

          if (option.stockPrice > 0 && bulkPrice <= option.stockPrice) {
            ctx.addIssue({
              path: ["options", index, "bulkDiscount"],
              code: z.ZodIssueCode.custom,
              message: "Invalid bulk pricing configuration. Ensure bulk price maintains profitability.",
            });
          }
        }
      }
    });
  });

type FormSchemaType = z.infer<typeof formSchema>;

export default function CreateProductPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"add-product" | "add-pricing">("add-product");

  const { createProduct, isCreating } = useCreateProduct({
    onSuccess: () => {
      toast.success("Product created successfully with dual profit support!");
      router.push("/admin/products");
    }
  });

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      categoryId: "",
      manufacturerId: "",
      processingTimeDays: 1,
      minDeliveryDays: 1,
      maxDeliveryDays: 7,
      includeSaturdays: false,
      acceptsReturns: true,
      options: [{
        profitType: 'MARKUP',
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
      } as any],
    },
  });

  const handleFinalSubmit = async (values: FormSchemaType) => {
    try {
      console.log('📤 Submitting product creation:', values);
      await createProduct(values as any);
    } catch (error) {
      console.error("Create failed:", error);
    }
  };

  const onSubmit = async () => {
    try {
      const fields = activeTab === "add-product"
        ? ["name", "description", "categoryId", "manufacturerId"]
        : ["options"];

      const isValid = await form.trigger(fields as any);
      if (!isValid) return;

      if (activeTab === "add-product") {
        setActiveTab("add-pricing");
      } else {
        await handleFinalSubmit(form.getValues());
      }
    } catch (error) {
      toast.error("Validation failed. Please check your inputs.");
    }
  };

  return (
    <section className="max-w-6xl mx-auto p-6">
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          {activeTab === "add-pricing" ? (
            <AddPricing form={form} isSubmitting={isCreating} />
          ) : (
            <AddProduct form={form} />
          )}

          <div className="flex justify-end gap-4 pt-6 border-t">
            {activeTab === "add-pricing" && (
              <Button
                variant="outline"
                type="button"
                onClick={() => setActiveTab("add-product")}
                disabled={isCreating}
                className="px-8 py-3"
              >
                Back
              </Button>
            )}
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isCreating}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isCreating ? "Processing..." :
                activeTab === "add-product" ? "Next: Configure Pricing" : "Create Product"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}