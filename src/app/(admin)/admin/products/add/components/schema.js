import { z } from "zod";

// export const productFormSchema = z.object({
//   name: z.string().min(3, "Product name must be at least 3 characters"),
//   description: z.string().min(10, "Description must be at least 10 characters"),
//   shortDescription: z.string().optional(),
//   categoryId: z.string().min(1, "Category is required"),
//   manufacturerId: z.string().min(1, "Manufacturer is required"),
//   processingTimeDays: z.coerce.number().min(1).default(1),
//   minDeliveryDays: z.coerce.number().min(1).default(1),
//   maxDeliveryDays: z.coerce.number().min(1).default(7),
//   includeSaturdays: z.boolean().default(false),
//   acceptsReturns: z.boolean().default(true),

//   options: z.array(
//     z.object({
//       profitType: z.enum(["MARKUP", "COMMISSION"]), // ✅ accepts both
//       value: z.string().min(1),
//       // Markup fields
//       stockPrice: z.coerce.number().optional(),
//       retailPrice: z.coerce.number().optional(),
//       discountType: z.enum(["NONE", "PERCENTAGE", "FIXED"]).default("NONE").optional(),
//       bulkDiscount: z.coerce.number().optional(),
//       minimumBulkQuantity: z.coerce.number().optional(),

//       // Commission fields
//       supplierPrice: z.coerce.number().optional(),
//       commissionRate: z.coerce.number().optional(),

//       // Shared fields
//       inventory: z.coerce.number().min(0),
//       unit: z.string().min(1),
//       imageFiles: z.array(z.instanceof(File)).optional(),
//     })
//     .superRefine((option, ctx) => {
//       // ✅ Conditional validation based on profitType

//       if (option.profitType === "MARKUP") {
//         if (!option.retailPrice || option.retailPrice <= 0) {
//           ctx.addIssue({
//             path: ["retailPrice"],
//             code: "custom",
//             message: "Retail price is required and must be greater than 0",
//           });
//         }
//         if (option.stockPrice && option.retailPrice && option.stockPrice >= option.retailPrice) {
//           ctx.addIssue({
//             path: ["stockPrice"],
//             code: "custom",
//             message: "Stock price must be less than retail price",
//           });
//         }
//         if (option.discountType && option.discountType !== "NONE") {
//           if (!option.bulkDiscount || option.bulkDiscount <= 0) {
//             ctx.addIssue({
//               path: ["bulkDiscount"],
//               code: "custom",
//               message: "Bulk discount must be greater than 0",
//             });
//           }
//           if (!option.minimumBulkQuantity || option.minimumBulkQuantity < 2) {
//             ctx.addIssue({
//               path: ["minimumBulkQuantity"],
//               code: "custom",
//               message: "Minimum bulk quantity must be at least 2",
//             });
//           }
//         }
//       }

//       if (option.profitType === "COMMISSION") {
//         if (!option.supplierPrice || option.supplierPrice <= 0) {
//           ctx.addIssue({
//             path: ["supplierPrice"],
//             code: "custom",
//             message: "Supplier price is required for commission products",
//           });
//         }
//         if (!option.commissionRate || option.commissionRate <= 0 || option.commissionRate > 100) {
//           ctx.addIssue({
//             path: ["commissionRate"],
//             code: "custom",
//             message: "Commission rate must be between 1 and 100",
//           });
//         }
//         if (option.discountType && option.discountType !== "NONE") {
//           ctx.addIssue({
//             path: ["discountType"],
//             code: "custom",
//             message: "Commission products cannot have bulk discounts",
//           });
//         }
//       }
//     })
//   ).min(1, "At least one option is required"),
// })
// .refine((data) => data.minDeliveryDays <= data.maxDeliveryDays, {
//   message: "Minimum delivery days cannot be greater than maximum delivery days",
//   path: ["maxDeliveryDays"],
// });

export const formSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  manufacturerId: z.string().min(1, "Manufacturer is required"),
  isActive: z.boolean().default(true),
  type: z.string().min(1, "Type is required").default("platform"),
  processingTimeDays: z.coerce.number().min(1, "Processing time must be at least 1 day").default(1),
  minDeliveryDays: z.coerce.number().min(1, "Minimum delivery days must be at least 1").default(1),
  maxDeliveryDays: z.coerce.number().min(1, "Maximum delivery days must be at least 1").default(7),
  includeSaturdays: z.boolean().default(false),
  acceptsReturns: z.boolean().default(true),
  options: z.array(
    z.object({
      id: z.number().optional(),
      value: z.string().min(1, "Option value is required"),
      inventory: z.coerce.number().min(0, "Inventory cannot be negative"),
      weight: z.coerce.number().min(0.1, "Weight must be at least 0.1"),
      unit: z.string().min(1, "Unit is required"),
      imageFiles: z.array(z.instanceof(File)).optional(),
      images: z.array(z.string()).optional(),
      profitType: z.enum(["MARKUP", "COMMISSION"], {
        required_error: "Please select a pricing model",
      }),
      // MARKUP fields
      stockPrice: z.coerce.number().min(0, "Stock price cannot be negative").optional(),
      retailPrice: z.coerce.number().min(0.01, "Retail price must be at least 0.01").optional(),
      discountType: z.enum(["NONE", "PERCENTAGE", "FIXED"]).default("NONE").optional(),
      bulkDiscount: z.coerce.number().min(0).default(0).optional(),
      minimumBulkQuantity: z.coerce.number().min(1).default(1).optional(),
      // COMMISSION fields
      supplierPrice: z.coerce.number().min(0, "Supplier price cannot be negative").optional(),
      commissionRate: z.coerce.number().min(0, "Commission rate cannot be negative").max(100, "Commission rate cannot exceed 100%").optional(),
    })
    // ... your refinements
  ).min(1, "At least one product option is required"),
})
.refine((data) => data.minDeliveryDays <= data.maxDeliveryDays, {
  message: "Minimum delivery days cannot be greater than maximum delivery days",
  path: ["maxDeliveryDays"],
});
