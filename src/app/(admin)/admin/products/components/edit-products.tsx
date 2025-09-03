// // src/app/(admin)/admin/products/components/edit-products.tsx

// "use client";

// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm, useFieldArray } from "react-hook-form";
// import { z } from "zod";
// import { useEffect, useState, useCallback, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { toast } from "sonner";
// import { useUpdateProduct } from "@/services/products";
// import { useGetManufacturers } from "@/services/manufacturers";
// import { useGetCategoriesForSelection } from "@/services/categories";
// import { Trash, UploadCloud, Copy, Info } from "lucide-react";
// import Image from "next/image";
// import { useDropzone } from "react-dropzone";

// // UPDATED: Removed shortDescription from schema + Naira currency
// const productSchema = z.object({
//   name: z.string().min(3, "Name must be at least 3 characters"),
//   description: z.string().optional(),
//   // REMOVED: shortDescription field completely
//   categoryId: z.string().min(1, "Category is required"),
//   manufacturerId: z.string().min(1, "Manufacturer is required"),
//   isActive: z.boolean().optional(),
//   type: z.string().min(1, "Type is required"),
//   processingTimeDays: z.coerce.number().min(1).default(1),
//   minDeliveryDays: z.coerce.number().min(1).default(1),
//   maxDeliveryDays: z.coerce.number().min(1).default(7),
//   includeSaturdays: z.boolean().default(false),
//   acceptsReturns: z.boolean().default(true),
//   options: z.array(z.object({
//     id: z.number().optional(),
//     value: z.string().min(1, "Option value is required"),
//     stockPrice: z.coerce.number().min(0, "Stock price cannot be negative"),
//     price: z.coerce.number().min(0.01, "Retail price must be greater than 0"),
//     inventory: z.coerce.number().min(0, "Inventory must be 0 or more"),
//     discountType: z.enum(["NONE", "PERCENTAGE", "FIXED"]).default("NONE"),
//     bulkDiscount: z.coerce.number().min(0).default(0),
//     minimumBulkQuantity: z.coerce.number().min(1).default(1),
//     weight: z.coerce.number().min(0.1, "Weight must be greater than 0"),
//     unit: z.string().min(1, "Unit is required"),
//     image: z.array(z.string()).optional(),
//     newImages: z.array(z.instanceof(File)).optional(),
//   })
//     .refine((option) => {
//       if (option.stockPrice > 0 && option.stockPrice >= option.price) {
//         return false;
//       }
//       return true;
//     }, {
//       message: "Stock price must be less than retail price for profitability",
//       path: ["stockPrice"]
//     })
//     .refine((option) => {
//       if (option.discountType !== "NONE") {
//         if (option.bulkDiscount <= 0) return false;
//         if (option.discountType === "PERCENTAGE" && option.bulkDiscount > 100) return false;
//         if (option.discountType === "FIXED" && option.bulkDiscount >= option.price) return false;
//         if (option.minimumBulkQuantity < 2) return false;

//         let bulkPrice = option.price;
//         if (option.discountType === "PERCENTAGE") {
//           bulkPrice = option.price * (1 - option.bulkDiscount / 100);
//         } else if (option.discountType === "FIXED") {
//           bulkPrice = option.price - option.bulkDiscount;
//         }

//         if (option.stockPrice > 0 && bulkPrice <= option.stockPrice) {
//           return false;
//         }
//       }
//       return true;
//     }, {
//       message: "Invalid bulk pricing configuration",
//       path: ["bulkDiscount"]
//     })).min(1, "At least one product option is required"),
// });

// type ProductFormValues = z.infer<typeof productSchema>;

// interface IProps {
//   product: any;
//   manufacturers?: any[]; // Keep as fallback but we'll fetch fresh data
//   categories?: any[];    // Keep as fallback but we'll fetch fresh data
//   setClose: () => void;
// }

// const EditProductForm: React.FC<IProps> = ({
//   product,
//   manufacturers: propManufacturers = [],
//   categories: propCategories = [],
//   setClose
// }) => {
//   const [isUploading, setIsUploading] = useState(false);
//   const [copiedOption, setCopiedOption] = useState<any>(null);

//   // FETCH FRESH DATA: Always fetch manufacturers and categories to ensure we have latest data
//   const {
//     getManufacturersData,
//     getManufacturersIsLoading,
//   } = useGetManufacturers();

//   const {
//     getCategoriesSelectionData,
//     getCategoriesSelectionIsLoading,
//     getCategoriesSelectionError,
//   } = useGetCategoriesForSelection();

//   const { updateProduct, isUpdating } = useUpdateProduct({
//     onSuccess: () => {
//       toast.success("Product updated successfully!");
//       setClose();
//     }
//   });

//   const form = useForm<ProductFormValues>({
//     resolver: zodResolver(productSchema),
//     defaultValues: {
//       name: "",
//       description: "",
//       // REMOVED: shortDescription: "",
//       categoryId: "",
//       manufacturerId: "",
//       isActive: false,
//       type: "platform",
//       processingTimeDays: 1,
//       minDeliveryDays: 1,
//       maxDeliveryDays: 7,
//       includeSaturdays: false,
//       acceptsReturns: true,
//       options: [],
//     }
//   });

//   const { fields, append, remove } = useFieldArray({
//     control: form.control,
//     name: "options",
//   });

//   // ENHANCED: Better form population with proper data handling
//   useEffect(() => {
//     if (product && Object.keys(product).length > 0) {
//       console.log('📝 Populating form with product data:', product);

//       // Basic product information
//       form.setValue("name", product.name || "");
//       form.setValue("description", product.description || "");
//       // REMOVED: shortDescription population
//       form.setValue("categoryId", product.categoryId ? String(product.categoryId) : "");
//       form.setValue("manufacturerId", product.manufacturerId ? String(product.manufacturerId) : "");
//       form.setValue("isActive", Boolean(product.isActive));
//       form.setValue("type", product.type || "platform");

//       // Delivery settings with fallbacks
//       form.setValue("processingTimeDays", product.processingTimeDays || 1);
//       form.setValue("minDeliveryDays", product.minDeliveryDays || 1);
//       form.setValue("maxDeliveryDays", product.maxDeliveryDays || 7);
//       form.setValue("includeSaturdays", Boolean(product.includeSaturdays));
//       form.setValue("acceptsReturns", Boolean(product.acceptsReturns));

//       // Handle product options
//       if (product.options && Array.isArray(product.options) && product.options.length > 0) {
//         const processedOptions = product.options.map((option: any) => ({
//           id: option.id,
//           value: option.value || "",
//           stockPrice: Number(option.stockPrice) || 0,
//           price: Number(option.price) || 0,
//           inventory: Number(option.inventory) || 0,
//           discountType: option.discountType || "NONE",
//           bulkDiscount: Number(option.bulkDiscount) || 0,
//           minimumBulkQuantity: Number(option.minimumBulkQuantity) || 1,
//           weight: Number(option.weight) || 0.1,
//           unit: option.unit || "",
//           image: option.image || [],
//           newImages: [],
//         }));

//         form.setValue("options", processedOptions);
//         console.log('📦 Populated options:', processedOptions);
//       } else {
//         // If no options exist, create a default one
//         form.setValue("options", [{
//           value: "",
//           stockPrice: 0,
//           price: 0,
//           inventory: 0,
//           discountType: "NONE",
//           bulkDiscount: 0,
//           minimumBulkQuantity: 1,
//           weight: 0.1,
//           unit: "",
//           image: [],
//           newImages: [],
//         }]);
//       }

//       console.log('✅ Form populated successfully');
//     }
//   }, [product, form]);

//   // DETERMINE DATA SOURCE: Use fresh fetched data if available, fallback to props
//   const manufacturers = getManufacturersData?.data?.length > 0 ? getManufacturersData.data : propManufacturers;
//   const categories = getCategoriesSelectionData?.length > 0 ? getCategoriesSelectionData : propCategories;

//   // ENHANCED: Debug logging for manufacturers and categories
//   useEffect(() => {
//     console.log('🔍 Data Sources:', {
//       fetchedManufacturers: getManufacturersData?.data?.length || 0,
//       propManufacturers: propManufacturers.length,
//       finalManufacturers: manufacturers.length,
//       fetchedCategories: getCategoriesSelectionData?.length || 0,
//       propCategories: propCategories.length,
//       finalCategories: categories.length,
//       currentFormValues: form.getValues()
//     });
//   }, [getManufacturersData, getCategoriesSelectionData, manufacturers, categories, propManufacturers, propCategories, product]);

//   const calculatePricingMetrics = useCallback((index: number) => {
//     const stockPrice = form.getValues(`options.${index}.stockPrice`);
//     const retailPrice = form.getValues(`options.${index}.price`);
//     const discountType = form.getValues(`options.${index}.discountType`);
//     const bulkDiscount = form.getValues(`options.${index}.bulkDiscount`);

//     if (stockPrice >= 0 && retailPrice > 0) {
//       const retailMargin = stockPrice > 0 ?
//         ((retailPrice - stockPrice) / retailPrice * 100).toFixed(1) : "N/A";

//       let bulkPrice = retailPrice;
//       if (discountType === "PERCENTAGE") {
//         bulkPrice = retailPrice * (1 - bulkDiscount / 100);
//       } else if (discountType === "FIXED") {
//         bulkPrice = retailPrice - bulkDiscount;
//       }

//       const bulkMargin = stockPrice > 0 && bulkPrice > stockPrice ?
//         ((bulkPrice - stockPrice) / bulkPrice * 100).toFixed(1) : "N/A";

//       return { retailMargin, bulkPrice: bulkPrice.toFixed(2), bulkMargin };
//     }

//     return { retailMargin: "N/A", bulkPrice: "0.00", bulkMargin: "N/A" };
//   }, [form]);

//   const uploadToCloudinary = async (file: File): Promise<string> => {
//     setIsUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('upload_preset', 'buylocalapp');
//       formData.append('folder', 'products');

//       const response = await fetch(
//         'https://api.cloudinary.com/v1_1/dttudmvko/image/upload',
//         {
//           method: 'POST',
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Upload failed');
//       }

//       const data = await response.json();
//       return data.secure_url;
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error("Failed to upload image. Please try again.");
//       throw error;
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleCopyOption = (index: number) => {
//     const optionToCopy = form.getValues(`options.${index}`);
//     const { id, ...optionData } = optionToCopy;
//     setCopiedOption(optionData);
//     toast.success("Option copied!");
//   };

//   const handlePasteOption = () => {
//     if (copiedOption) {
//       append({
//         ...copiedOption,
//         newImages: [],
//       });
//       toast.info("Option pasted!");
//     } else {
//       toast.warning("No option copied yet.");
//     }
//   };

//   const onSubmit = async (values: any) => {
//     try {
//       console.log('📤 Submitting product update via service hook:', values);

//       await updateProduct({
//         id: product.id,
//         payload: values
//       } as any);

//     } catch (error) {
//       console.error("Update failed:", error);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//           {/* Product Details */}
//           <div className="p-4 border rounded-lg">
//             <h3 className="text-lg font-medium mb-4">Product Details</h3>
//             <div className="grid grid-cols-1 gap-6">
//               <FormField control={form.control} name="name" render={({ field }:any) => (
//                 <FormItem>
//                   <FormLabel>Product Name</FormLabel>
//                   <FormControl><Input placeholder="e.g., Premium Rice" {...field} /></FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />

//               {/* <FormField control={form.control} name="type" render={({ field }:any) => (
//                 <FormItem>
//                   <FormLabel>Product Type</FormLabel>
//                   <Select onValueChange={field.onChange} value={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select type" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="platform">Platform</SelectItem>
//                       <SelectItem value="business">Business</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )} /> */}
//             </div>

//             {/* REMOVED: Short Description field completely */}

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
//               <FormField control={form.control} name="categoryId" render={({ field }:any) => (
//                 <FormItem>
//                   <FormLabel>Category</FormLabel>
//                   {getCategoriesSelectionIsLoading ? (
//                     <Select disabled>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Loading categories..." />
//                         </SelectTrigger>
//                       </FormControl>
//                     </Select>
//                   ) : categories.length > 0 ? (
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select category" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {categories.map((category: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
//                           <SelectItem key={category.id} value={String(category.id)}>
//                             {category.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   ) : (
//                     <FormControl>
//                       <Input placeholder="Category ID" {...field} />
//                     </FormControl>
//                   )}
//                   <FormMessage />
//                 </FormItem>
//               )} />

//               <FormField control={form.control} name="manufacturerId" render={({ field }:any) => (
//                 <FormItem>
//                   <FormLabel>Manufacturer</FormLabel>
//                   {getManufacturersIsLoading ? (
//                     <Select disabled>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Loading manufacturers..." />
//                         </SelectTrigger>
//                       </FormControl>
//                     </Select>
//                   ) : manufacturers.length > 0 ? (
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select manufacturer" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {manufacturers.map((manufacturer: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
//                           <SelectItem key={manufacturer.id} value={String(manufacturer.id)}>
//                             {manufacturer.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   ) : (
//                     <FormControl>
//                       <Input placeholder="Manufacturer ID" {...field} />
//                     </FormControl>
//                   )}
//                   <FormMessage />
//                 </FormItem>
//               )} />
//             </div>

//             <div className="mt-4">
//               <FormField control={form.control} name="description" render={({ field }:any) => (
//                 <FormItem>
//                   <FormLabel>Description</FormLabel>
//                   <FormControl>
//                     <Textarea placeholder="Product description" className="min-h-[100px]" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//             </div>

//             <div className="mt-4 flex items-center space-x-2">
//               <FormField control={form.control} name="isActive" render={({ field }:any) => (
//                 <FormItem className="flex flex-row items-center space-x-2 space-y-0">
//                   <FormControl>
//                     <Switch checked={field.value} onCheckedChange={field.onChange} />
//                   </FormControl>
//                   <FormLabel>Active Product</FormLabel>
//                 </FormItem>
//               )} />
//             </div>
//           </div>

//           {/* Product Options */}
//           <div className="p-4 border rounded-lg">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-medium">Product Options</h3>
//               <div className="flex gap-2">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={handlePasteOption}
//                   disabled={!copiedOption}
//                 >
//                   <Copy className="h-4 w-4 mr-1" />
//                   Paste Option
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={() => append({
//                     value: "",
//                     stockPrice: 0,
//                     price: 0,
//                     inventory: 0,
//                     discountType: "NONE",
//                     bulkDiscount: 0,
//                     minimumBulkQuantity: 1,
//                     weight: 0.1,
//                     unit: "",
//                     image: [],
//                     newImages: [],
//                   })}
//                 >
//                   Add Option
//                 </Button>
//               </div>
//             </div>

//             {fields.map((field, index) => {
//               const metrics = calculatePricingMetrics(index);

//               return (
//                 <div key={field.id} className="p-4 border rounded-lg mb-4 relative">
//                   <div className="flex justify-between items-start mb-4">
//                     <h4 className="font-medium">Option {index + 1}</h4>
//                     <div className="flex gap-2">
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => handleCopyOption(index)}
//                       >
//                         <Copy className="h-4 w-4" />
//                       </Button>
//                       {fields.length > 1 && (
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => remove(index)}
//                         >
//                           <Trash className="h-4 w-4" />
//                         </Button>
//                       )}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     <FormField control={form.control} name={`options.${index}.value`} render={({ field }:any) => (
//                       <FormItem>
//                         <FormLabel>Option Value</FormLabel>
//                         <FormControl><Input placeholder="e.g., 1kg, 5kg" {...field} /></FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )} />

//                     <FormField control={form.control} name={`options.${index}.weight`} render={({ field }:any) => (
//                       <FormItem>
//                         <FormLabel>Weight</FormLabel>
//                         <FormControl>
//                           <Input
//                             type="number"
//                             step="0.1"
//                             min="0.1"
//                             placeholder="0.0"
//                             {...field}
//                             onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )} />

//                     <FormField control={form.control} name={`options.${index}.unit`} render={({ field }:any) => (
//                       <FormItem>
//                         <FormLabel>Unit</FormLabel>
//                         <Select onValueChange={field.onChange} value={field.value}>
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select unit" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             <SelectItem value="kg">Kilograms (kg)</SelectItem>
//                             <SelectItem value="g">Grams (g)</SelectItem>
//                             <SelectItem value="lb">Pounds (lb)</SelectItem>
//                             <SelectItem value="oz">Ounces (oz)</SelectItem>
//                             <SelectItem value="l">Liters (l)</SelectItem>
//                             <SelectItem value="ml">Milliliters (ml)</SelectItem>
//                             <SelectItem value="pcs">Pieces (pcs)</SelectItem>
//                             <SelectItem value="pack">Pack</SelectItem>
//                             <SelectItem value="box">Box</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )} />

//                     <FormField control={form.control} name={`options.${index}.stockPrice`} render={({ field }:any) => (
//                       <FormItem>
//                         <FormLabel>Stock Price (₦)</FormLabel>
//                         <FormControl>
//                           <Input
//                             type="number"
//                             step="0.01"
//                             min="0"
//                             placeholder="0.00"
//                             {...field}
//                             onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )} />

//                     <FormField control={form.control} name={`options.${index}.price`} render={({ field }:any) => (
//                       <FormItem>
//                         <FormLabel>Retail Price (₦)</FormLabel>
//                         <FormControl>
//                           <Input
//                             type="number"
//                             step="0.01"
//                             min="0.01"
//                             placeholder="0.00"
//                             {...field}
//                             onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )} />

//                     <FormField control={form.control} name={`options.${index}.inventory`} render={({ field }:any) => (
//                       <FormItem>
//                         <FormLabel>Inventory</FormLabel>
//                         <FormControl>
//                           <Input
//                             type="number"
//                             min="0"
//                             placeholder="0"
//                             {...field}
//                             onChange={e => field.onChange(parseInt(e.target.value) || 0)}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )} />
//                   </div>

//                   {/* Pricing Metrics Display */}
//                   {metrics.retailMargin !== "N/A" && (
//                     <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//                       <div className="flex items-center gap-2 mb-2">
//                         <Info className="h-4 w-4 text-blue-500" />
//                         <span className="text-sm font-medium">Pricing Metrics</span>
//                       </div>
//                       <div className="grid grid-cols-3 gap-4 text-sm">
//                         <div>
//                           <span className="text-gray-600">Retail Margin:</span>
//                           <span className="ml-2 font-medium">{metrics.retailMargin}%</span>
//                         </div>
//                         <div>
//                           <span className="text-gray-600">Bulk Price:</span>
//                           <span className="ml-2 font-medium">₦{metrics.bulkPrice}</span>
//                         </div>
//                         <div>
//                           <span className="text-gray-600">Bulk Margin:</span>
//                           <span className="ml-2 font-medium">{metrics.bulkMargin}%</span>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* Bulk Discount Section */}
//                   <div className="mt-4 p-3 border rounded-lg">
//                     <h5 className="font-medium mb-3">Bulk Pricing</h5>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <FormField control={form.control} name={`options.${index}.discountType`} render={({ field }:any) => (
//                         <FormItem>
//                           <FormLabel>Discount Type</FormLabel>
//                           <Select onValueChange={field.onChange} value={field.value}>
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               <SelectItem value="NONE">No Discount</SelectItem>
//                               <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
//                               <SelectItem value="FIXED">Fixed Amount (₦)</SelectItem>
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )} />

//                       {form.watch(`options.${index}.discountType`) !== "NONE" && (
//                         <>
//                           <FormField control={form.control} name={`options.${index}.bulkDiscount`} render={({ field }:any) => (
//                             <FormItem>
//                               <FormLabel>
//                                 Discount {form.watch(`options.${index}.discountType`) === "PERCENTAGE" ? "(%)" : "(₦)"}
//                               </FormLabel>
//                               <FormControl>
//                                 <Input
//                                   type="number"
//                                   step={form.watch(`options.${index}.discountType`) === "PERCENTAGE" ? "1" : "0.01"}
//                                   min="0"
//                                   max={form.watch(`options.${index}.discountType`) === "PERCENTAGE" ? "100" : undefined}
//                                   placeholder="0"
//                                   {...field}
//                                   onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
//                                 />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )} />

//                           <FormField control={form.control} name={`options.${index}.minimumBulkQuantity`} render={({ field }:any) => (
//                             <FormItem>
//                               <FormLabel>Minimum Bulk Quantity</FormLabel>
//                               <FormControl>
//                                 <Input
//                                   type="number"
//                                   min="2"
//                                   placeholder="2"
//                                   {...field}
//                                   onChange={e => field.onChange(parseInt(e.target.value) || 1)}
//                                 />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )} />
//                         </>
//                       )}
//                     </div>
//                   </div>

//                   {/* Image Upload Section */}
//                   <div className="mt-4">
//                     <ProductImageUpload index={index} form={form} />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Delivery Settings */}
//           <div className="p-4 border rounded-lg">
//             <h3 className="text-lg font-medium mb-4">Delivery Settings</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <FormField control={form.control} name="processingTimeDays" render={({ field }:any) => (
//                 <FormItem>
//                   <FormLabel>Processing Time (Days)</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       min="1"
//                       {...field}
//                       onChange={e => field.onChange(parseInt(e.target.value) || 1)}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />

//               <FormField control={form.control} name="minDeliveryDays" render={({ field }:any) => (
//                 <FormItem>
//                   <FormLabel>Minimum Delivery Days</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       min="1"
//                       {...field}
//                       onChange={e => field.onChange(parseInt(e.target.value) || 1)}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />

//               <FormField control={form.control} name="maxDeliveryDays" render={({ field }:any) => (
//                 <FormItem>
//                   <FormLabel>Maximum Delivery Days</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       min="1"
//                       {...field}
//                       onChange={e => field.onChange(parseInt(e.target.value) || 1)}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//             </div>

//             <div className="flex gap-6 mt-4">
//               <FormField control={form.control} name="includeSaturdays" render={({ field }:any) => (
//                 <FormItem className="flex flex-row items-center space-x-2 space-y-0">
//                   <FormControl>
//                     <Switch checked={field.value} onCheckedChange={field.onChange} />
//                   </FormControl>
//                   <FormLabel>Include Saturdays in Delivery</FormLabel>
//                 </FormItem>
//               )} />

//               <FormField control={form.control} name="acceptsReturns" render={({ field }:any) => (
//                 <FormItem className="flex flex-row items-center space-x-2 space-y-0">
//                   <FormControl>
//                     <Switch checked={field.value} onCheckedChange={field.onChange} />
//                   </FormControl>
//                   <FormLabel>Accepts Returns</FormLabel>
//                 </FormItem>
//               )} />
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-end gap-4 pt-6">
//             <Button type="button" variant="outline" onClick={setClose}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isUpdating || isUploading}>
//               {isUpdating ? "Updating..." : "Update Product"}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// };

// // Image Upload Component
// const ProductImageUpload: React.FC<{ index: number; form: any }> = ({ index, form }) => {
//   const existingImages = form.watch(`options.${index}.image`) || [];
//   const newFiles = form.watch(`options.${index}.newImages`) || [];

//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     const currentFiles = form.getValues(`options.${index}.newImages`) || [];
//     form.setValue(`options.${index}.newImages`, [...currentFiles, ...acceptedFiles]);
//   }, [form, index]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
//     onDrop,
//   });

//   const removeExistingImage = (imgUrl: string) => {
//     const updatedImages = existingImages.filter((url: string) => url !== imgUrl);
//     form.setValue(`options.${index}.image`, updatedImages);
//   };

//   const removeNewFile = (fileIndex: number) => {
//     const updatedFiles = newFiles.filter((_: any, i: number) => i !== fileIndex);
//     form.setValue(`options.${index}.newImages`, updatedFiles);
//   };

//   return (
//     <div className="space-y-2">
//       <FormLabel>Product Images</FormLabel>
//       <div
//         {...getRootProps()}
//         className={`p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
//           }`}
//       >
//         <input {...getInputProps()} />
//         <UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
//         <p className="text-sm text-gray-600">
//           {isDragActive ? 'Drop images here...' : 'Drag & drop images, or click to select'}
//         </p>
//       </div>

//       {/* Display existing and new images */}
//       {(existingImages.length > 0 || newFiles.length > 0) && (
//         <div className="grid grid-cols-3 gap-2 mt-4">
//           {existingImages.map((imageUrl: string, imgIndex: number) => (
//             <div key={`existing-${imgIndex}`} className="relative">
//               <Image
//                 src={imageUrl}
//                 alt={`Product image ${imgIndex + 1}`}
//                 className="w-full h-20 object-cover rounded border"
//                 width={80}
//                 height={80}
//               />
//               <Button
//                 type="button"
//                 variant="destructive"
//                 size="sm"
//                 className="absolute -top-2 -right-2 h-6 w-6 p-0"
//                 onClick={() => removeExistingImage(imageUrl)}
//               >
//                 <Trash className="h-3 w-3" />
//               </Button>
//             </div>
//           ))}

//           {newFiles.map((file: File, fileIndex: number) => (
//             <div key={`new-${fileIndex}`} className="relative">
//               <Image
//                 src={URL.createObjectURL(file)}
//                 alt={`New image ${fileIndex + 1}`}
//                 className="w-full h-20 object-cover rounded border"
//                 width={80}
//                 height={80}
//               />
//               <Button
//                 type="button"
//                 variant="destructive"
//                 size="sm"
//                 className="absolute -top-2 -right-2 h-6 w-6 p-0"
//                 onClick={() => removeNewFile(fileIndex)}
//               >
//                 <Trash className="h-3 w-3" />
//               </Button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default EditProductForm;

"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../add/components/ui/form";
import { Input } from "../add/components/ui/input";
import { Button } from "../add/components/ui/button";
import { Switch } from "../add/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState, useCallback } from "react";
import { Textarea } from "../add/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../add/components/ui/select";
import { toast } from "sonner";

import { Trash, Copy, Info, Upload, X, DollarSign, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { useUpdateProduct } from "@/services/products";
import { useGetManufacturers } from "@/services/manufacturers";
import { useGetCategoriesForSelection } from "@/services/categories";




// MARKUP option schema (must be plain ZodObject)
const markupOptionSchema = z.object({
  id: z.number().optional(),
  profitType: z.literal("MARKUP"),
  value: z.string().min(1, "Option value is required"),
  stockPrice: z.coerce.number().min(0, "Stock price cannot be negative"),
  price: z.coerce.number().min(0.01, "Retail price must be greater than 0"),
  inventory: z.coerce.number().min(0, "Inventory must be 0 or more"),
  discountType: z.enum(["NONE", "PERCENTAGE", "FIXED"]).default("NONE"),
  bulkDiscount: z.coerce.number().min(0).default(0),
  minimumBulkQuantity: z.coerce.number().min(1).default(1),
  weight: z.coerce.number().min(0.1, "Weight must be greater than 0"),
  unit: z.string().min(1, "Unit is required"),
  image: z.array(z.string()).optional(),
  newImages: z.array(z.instanceof(File)).optional(),
});

// COMMISSION option schema
const commissionOptionSchema = z.object({
  id: z.number().optional(),
  profitType: z.literal("COMMISSION"),
  value: z.string().min(1, "Option value is required"),
  supplierPrice: z.coerce.number().min(0.01, "Supplier price must be greater than 0"),
  commissionRate: z
    .coerce.number()
    .min(0.1, "Commission rate must be at least 0.1%")
    .max(100, "Commission rate cannot exceed 100%"),
  inventory: z.coerce.number().min(0, "Inventory must be 0 or more"),
  weight: z.coerce.number().min(0.1, "Weight must be greater than 0"),
  unit: z.string().min(1, "Unit is required"),
  image: z.array(z.string()).optional(),
  newImages: z.array(z.instanceof(File)).optional(),
});

// Discriminated union
const optionSchema = z.discriminatedUnion("profitType", [
  markupOptionSchema,
  commissionOptionSchema,
]);

// Final product schema
export const productSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().optional(),
    shortDescription: z.string().optional(),
    categoryId: z.string().min(1, "Category is required"),
    manufacturerId: z.string().min(1, "Manufacturer is required"),
    isActive: z.boolean().optional(),
    type: z.string().min(1, "Type is required"),
    processingTimeDays: z.coerce.number().min(1).default(1),
    minDeliveryDays: z.coerce.number().min(1).default(1),
    maxDeliveryDays: z.coerce.number().min(1).default(7),
    includeSaturdays: z.boolean().default(false),
    acceptsReturns: z.boolean().default(true),
    options: z.array(optionSchema).min(1, "At least one product option is required"),
  })
  .superRefine((data, ctx) => {
    // Delivery days validation
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
        if (option.stockPrice > 0 && option.stockPrice >= option.price) {
          ctx.addIssue({
            path: ["options", index, "stockPrice"],
            code: z.ZodIssueCode.custom,
            message: "Stock price must be less than retail price",
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

          if (option.discountType === "FIXED" && option.bulkDiscount >= option.price) {
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

          let bulkPrice = option.price;
          if (option.discountType === "PERCENTAGE") {
            bulkPrice = option.price * (1 - option.bulkDiscount / 100);
          } else if (option.discountType === "FIXED") {
            bulkPrice = option.price - option.bulkDiscount;
          }

          if (option.stockPrice > 0 && bulkPrice <= option.stockPrice) {
            ctx.addIssue({
              path: ["options", index, "bulkDiscount"],
              code: z.ZodIssueCode.custom,
              message: "Bulk price must be greater than stock price for profitability",
            });
          }
        }
      }
    });
  });

type ProductFormValues = z.infer<typeof productSchema>;

interface Props {
  product: any;
  manufacturers?: any[];
  categories?: any[];
  setClose: () => void;
}



const EditProductForm: React.FC<Props> = ({
  product,
  manufacturers: propManufacturers = [],
  categories: propCategories = [],
  setClose
}) => {
  const [copiedOption, setCopiedOption] = useState<any>(null);
  const [expandedOptions, setExpandedOptions] = useState<number[]>([0]);

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

  const {
    getCategoriesSelectionData,
    getCategoriesSelectionIsLoading,
  } = useGetCategoriesForSelection();

  const { updateProduct, isUpdating } = useUpdateProduct({
    onSuccess: () => {
      toast.success("Product updated successfully!");
      setClose();
    }
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      categoryId: "",
      manufacturerId: "",
      isActive: false,
      type: "platform",
      processingTimeDays: 1,
      minDeliveryDays: 1,
      maxDeliveryDays: 7,
      includeSaturdays: false,
      acceptsReturns: true,
      options: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  // Populate form with product data
  useEffect(() => {
    if (product && Object.keys(product).length > 0) {
      console.log('📝 Populating form with product data:', product);

      form.setValue("name", product.name || "");
      form.setValue("description", product.description || "");
      form.setValue("shortDescription", product.shortDescription || "");
      form.setValue("categoryId", product.categoryId ? String(product.categoryId) : "");
      form.setValue("manufacturerId", product.manufacturerId ? String(product.manufacturerId) : "");
      form.setValue("isActive", Boolean(product.isActive));
      form.setValue("type", product.type || "platform");
      form.setValue("processingTimeDays", product.processingTimeDays || 1);
      form.setValue("minDeliveryDays", product.minDeliveryDays || 1);
      form.setValue("maxDeliveryDays", product.maxDeliveryDays || 7);
      form.setValue("includeSaturdays", Boolean(product.includeSaturdays));
      form.setValue("acceptsReturns", Boolean(product.acceptsReturns));

      if (product.options && Array.isArray(product.options) && product.options.length > 0) {
        const processedOptions = product.options.map((option: any) => {
          const baseOption = {
            id: option.id,
            value: option.value || "",
            inventory: Number(option.inventory) || 0,
            weight: Number(option.weight) || 0.1,
            unit: option.unit || "",
            image: option.image || [],
            newImages: [],
            profitType: option.profitType || 'MARKUP',
          };

          if (option.profitType === 'COMMISSION') {
            return {
              ...baseOption,
              supplierPrice: Number(option.supplierPrice) || 0,
              commissionRate: Number(option.commissionRate) || 0,
            };
          } else {
            return {
              ...baseOption,
              stockPrice: Number(option.stockPrice) || 0,
              price: Number(option.retailPrice || option.price) || 0,
              discountType: option.discountType || "NONE",
              bulkDiscount: Number(option.bulkDiscount) || 0,
              minimumBulkQuantity: Number(option.minimumBulkQuantity) || 1,
            };
          }
        });

        form.setValue("options", processedOptions);
        setExpandedOptions(processedOptions.map((_:any, i:any) => i));
      }
    }
  }, [product, form]);

  const manufacturers = getManufacturersData?.data?.length > 0 ? getManufacturersData.data : propManufacturers;
  const categories = getCategoriesSelectionData?.length > 0 ? getCategoriesSelectionData : propCategories;

  const calculateProfitMetrics = useCallback((option: any) => {
    if (option.profitType === 'COMMISSION') {
      const supplierPrice = parseFloat(option.supplierPrice || 0);
      const commissionRate = parseFloat(option.commissionRate || 0);
      const calculatedPrice = supplierPrice * (1 + commissionRate / 100);
      
      return {
        calculatedPrice: calculatedPrice.toFixed(2),
        commission: (calculatedPrice - supplierPrice).toFixed(2),
        margin: commissionRate.toFixed(1)
      };
    } else {
      const stockPrice = parseFloat(option.stockPrice || 0);
      const retailPrice = parseFloat(option.price || 0);
      
      if (stockPrice >= 0 && retailPrice > 0) {
        const profit = retailPrice - stockPrice;
        const margin = stockPrice > 0 ? (profit / retailPrice * 100) : 100;
        
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
  }, []);

  const handleCopyOption = (index: number) => {
    const optionToCopy = form.getValues(`options.${index}`);
    const { id, newImages, ...optionData } = optionToCopy;
    setCopiedOption(optionData);
    toast.success("Option copied to clipboard!");
  };

  const handlePasteOption = () => {
    if (copiedOption) {
      append({
        ...copiedOption,
        newImages: [],
      });
      const newIndex = fields.length;
      setExpandedOptions([...expandedOptions, newIndex]);
      toast.success("Option pasted successfully!");
    }
  };

  const toggleOptionExpansion = (index: number) => {
    if (expandedOptions.includes(index)) {
      setExpandedOptions(expandedOptions.filter(i => i !== index));
    } else {
      setExpandedOptions([...expandedOptions, index]);
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    try {
      console.log('📤 Submitting product update:', values);
      await updateProduct({
        id: product.id,
        payload: values
      } as any);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Product Details */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-6">Product Information</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="name" render={({ field }:any) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Premium Rice" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="flex items-center space-x-4">
                  <FormField control={form.control} name="isActive" render={({ field }:any) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Active Product</FormLabel>
                    </FormItem>
                  )} />
                </div>
              </div>

              <FormField control={form.control} name="shortDescription" render={({ field }:any) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief product summary for listings" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="categoryId" render={({ field }:any) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    {getCategoriesSelectionIsLoading ? (
                      <Select disabled>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Loading categories..." />
                          </SelectTrigger>
                        </FormControl>
                      </Select>
                    ) : categories.length > 0 ? (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category: any) => (
                            <SelectItem key={category.id} value={String(category.id)}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <FormControl>
                        <Input placeholder="Category ID" {...field} />
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="manufacturerId" render={({ field }:any) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    {getManufacturersIsLoading ? (
                      <Select disabled>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Loading manufacturers..." />
                          </SelectTrigger>
                        </FormControl>
                      </Select>
                    ) : manufacturers.length > 0 ? (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select manufacturer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {manufacturers.map((manufacturer: any) => (
                            <SelectItem key={manufacturer.id} value={String(manufacturer.id)}>
                              {manufacturer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <FormControl>
                        <Input placeholder="Manufacturer ID" {...field} />
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="description" render={({ field }:any) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detailed product description" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>

          {/* Product Options with Dual Profit Support */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Product Options & Pricing</h2>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePasteOption}
                  disabled={!copiedOption || isUpdating}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Paste Option
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    append({
                      profitType: 'MARKUP',
                      value: "",
                      stockPrice: 0,
                      price: 0,
                      inventory: 0,
                      discountType: "NONE",
                      bulkDiscount: 0,
                      minimumBulkQuantity: 1,
                      weight: 0.1,
                      unit: "",
                      image: [],
                      newImages: [],
                    });
                    setExpandedOptions([...expandedOptions, fields.length]);
                  }}
                  disabled={isUpdating}
                >
                  Add Option
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => {
                const option = form.watch(`options.${index}`);
                const metrics = calculateProfitMetrics(option);
                const isExpanded = expandedOptions.includes(index);

                return (
                  <div key={field.id} className="border rounded-lg">
                    {/* Option Header */}
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleOptionExpansion(index)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            option.profitType === 'COMMISSION' ? 'bg-green-500' : 'bg-blue-500'
                          }`} />
                          <span className="font-medium">
                            Option {index + 1} {option.value && `- ${option.value}`}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            option.profitType === 'COMMISSION' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {option.profitType as any}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {metrics && (
                            <span className="text-sm text-gray-600">
                              {option.profitType === 'COMMISSION' 
                                ? `₦${metrics.calculatedPrice} (${metrics.margin}%)`
                                : `₦${option.price} (${metrics.margin}% margin)`
                              }
                            </span>
                          )}
                          
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e:any) => {
                                e.stopPropagation();
                                handleCopyOption(index);
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e:any) => {
                                  e.stopPropagation();
                                  remove(index);
                                  setExpandedOptions(expandedOptions.filter(i => i !== index));
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-4 border-t bg-gray-50/50">
                        <OptionConfiguration 
                          form={form} 
                          index={index} 
                          option={option} 
                          metrics={metrics} 
                          isUpdating={isUpdating}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Settings */}
          <DeliverySettings form={form} isUpdating={isUpdating} />

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={setClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isUpdating}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isUpdating ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

// Option Configuration Component
const OptionConfiguration: React.FC<{
  form: any;
  index: number;
  option: any;
  metrics: any;
  isUpdating: boolean;
}> = ({ form, index, option, metrics, isUpdating }) => (
  <div className="space-y-4">
    {/* Basic Info */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField control={form.control} name={`options.${index}.value`} render={({ field }:any) => (
        <FormItem>
          <FormLabel>Option Value</FormLabel>
          <FormControl><Input placeholder="e.g., 1kg, Large" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name={`options.${index}.weight`} render={({ field }:any) => (
        <FormItem>
          <FormLabel>Weight</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.1"
              min="0.1"
              {...field}
              onChange={(e: any)  => field.onChange(parseFloat(e.target.value) || 0.1)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name={`options.${index}.unit`} render={({ field }:any) => (
        <FormItem>
          <FormLabel>Unit</FormLabel>
          <FormControl><Input placeholder="kg, pieces, etc." {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </div>

    {/* Profit Type Selection */}
    <div className="bg-white rounded-lg p-4 border">
      <FormField control={form.control} name={`options.${index}.profitType`} render={({ field }:any) => (
        <FormItem>
          <FormLabel>Profit Model</FormLabel>
          <FormControl>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="MARKUP"
                  checked={field.value === 'MARKUP'}
                  onChange={() => field.onChange('MARKUP')}
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
                />
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Commission Based
                </span>
              </label>
            </div>
          </FormControl>
        </FormItem>
      )} />
    </div>

    {/* Pricing Configuration */}
    {option.profitType === 'COMMISSION' ? (
      <CommissionConfiguration form={form} index={index} metrics={metrics} />
    ) : (
      <MarkupConfiguration form={form} index={index} metrics={metrics} />
    )}

    {/* Inventory */}
    <FormField control={form.control} name={`options.${index}.inventory`} render={({ field }: any) => (
      <FormItem>
        <FormLabel>Inventory Quantity</FormLabel>
        <FormControl>
          <Input
            type="number"
            min="0"
            {...field}
            onChange={(e: any) => field.onChange(parseInt(e.target.value) || 0)}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />

    {/* Image Upload */}
    <ProductImageUpload index={index} form={form} disabled={isUpdating} />
  </div>
);

// Commission Configuration
const CommissionConfiguration: React.FC<{ form: any; index: number; metrics: any }> = ({ 
  form, index, metrics 
}) => (
  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
    <h4 className="font-medium mb-4 flex items-center gap-2 text-green-800">
      <TrendingUp className="w-4 h-4" />
      Commission Configuration
    </h4>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField control={form.control} name={`options.${index}.supplierPrice`} render={({ field }:any) => (
        <FormItem>
          <FormLabel>Supplier Price (₦)</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              {...field}
              onChange={(e:any) => field.onChange(parseFloat(e.target.value) || 0)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name={`options.${index}.commissionRate`} render={({ field }:any) => (
        <FormItem>
          <FormLabel>Commission Rate (%)</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.1"
              min="0.1"
              max="100"
              {...field}
              onChange={(e: any) => field.onChange(parseFloat(e.target.value) || 0)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </div>

    {metrics && (
      <div className="mt-4 bg-white rounded-lg p-4 border">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Customer Price:</span>
            <div className="font-bold text-green-600">₦{metrics.calculatedPrice}</div>
          </div>
          <div>
            <span className="text-gray-600">Your Commission:</span>
            <div className="font-bold text-green-600">₦{metrics.commission}</div>
          </div>
          <div>
            <span className="text-gray-600">Rate:</span>
            <div className="font-bold text-green-600">{metrics.margin}%</div>
          </div>
        </div>
      </div>
    )}
  </div>
);

// Markup Configuration
const MarkupConfiguration: React.FC<{ form: any; index: number; metrics: any }> = ({ 
  form, index, metrics 
}) => (
  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
    <h4 className="font-medium mb-4 flex items-center gap-2 text-blue-800">
      <DollarSign className="w-4 h-4" />
      Markup Configuration
    </h4>
    
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name={`options.${index}.stockPrice`} render={({ field }:any) => (
          <FormItem>
            <FormLabel>Stock Price (₦)</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                min="0"
                {...field}
                onChange={(e:any) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name={`options.${index}.price`} render={({ field }:any) => (
          <FormItem>
            <FormLabel>Retail Price (₦)</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                {...field}
                onChange={(e: any) => field.onChange(parseFloat(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      {/* Bulk Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField control={form.control} name={`options.${index}.discountType`} render={({ field }:any) => (
          <FormItem>
            <FormLabel>Bulk Discount Type</FormLabel>
            <FormControl>
              <select
                className="flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm"
                value={field.value}
                onChange={field.onChange}
              >
                <option value="NONE">No Bulk Pricing</option>
                <option value="PERCENTAGE">Percentage Discount</option>
                <option value="FIXED">Fixed Amount Discount</option>
              </select>
            </FormControl>
          </FormItem>
        )} />

        {form.watch(`options.${index}.discountType`) !== "NONE" && (
          <>
            <FormField control={form.control} name={`options.${index}.bulkDiscount`} render={({ field }:any) => (
              <FormItem>
                <FormLabel>
                  {form.watch(`options.${index}.discountType`) === "PERCENTAGE" ? "Discount (%)" : "Discount (₦)"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max={form.watch(`options.${index}.discountType`) === "PERCENTAGE" ? "100" : undefined}
                    {...field}
                    onChange={(e: any) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name={`options.${index}.minimumBulkQuantity`} render={({ field }:any) => (
              <FormItem>
                <FormLabel>Min Bulk Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="2"
                    {...field}
                    onChange={(e:any) => field.onChange(parseInt(e.target.value) || 2)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </>
        )}
      </div>

      {/* Metrics Display */}
      {metrics && (
        <div className="bg-white rounded-lg p-4 border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Profit:</span>
              <div className="font-bold text-blue-600">₦{metrics.profit}</div>
            </div>
            <div>
              <span className="text-gray-600">Margin:</span>
              <div className="font-bold text-blue-600">{metrics.margin}%</div>
            </div>
            {form.watch(`options.${index}.discountType`) !== "NONE" && (
              <>
                <div>
                  <span className="text-gray-600">Bulk Price:</span>
                  <div className="font-bold text-blue-600">₦{metrics.bulkPrice}</div>
                </div>
                <div>
                  <span className="text-gray-600">Bulk Margin:</span>
                  <div className="font-bold text-blue-600">{metrics.bulkMargin}%</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);

// Delivery Settings Component
const DeliverySettings: React.FC<{ form: any; isUpdating: boolean }> = ({ form, isUpdating }) => (
  <div className="bg-white rounded-xl shadow-sm border p-6">
    <h2 className="text-xl font-semibold mb-6">Delivery & Return Policy</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <FormField control={form.control} name="processingTimeDays" render={({ field }:any) => (
        <FormItem>
          <FormLabel>Processing Time (Days)</FormLabel>
          <FormControl>
            <Input
              type="number"
              min="1"
              {...field}
              onChange={(e: any) => field.onChange(parseInt(e.target.value) || 1)}
              disabled={isUpdating}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="minDeliveryDays" render={({ field }:any) => (
        <FormItem>
          <FormLabel>Min Delivery Days</FormLabel>
          <FormControl>
            <Input
              type="number"
              min="1"
              {...field}
              onChange={(e:any) => field.onChange(parseInt(e.target.value) || 1)}
              disabled={isUpdating}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="maxDeliveryDays" render={({ field }:any) => (
        <FormItem>
          <FormLabel>Max Delivery Days</FormLabel>
          <FormControl>
            <Input
              type="number"
              min="1"
              {...field}
              onChange={(e:any) => field.onChange(parseInt(e.target.value) || 1)}
              disabled={isUpdating}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </div>

    <div className="flex gap-6">
      <FormField control={form.control} name="includeSaturdays" render={({ field }:any) => (
        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isUpdating} />
          </FormControl>
          <FormLabel>Include Saturdays in Delivery</FormLabel>
        </FormItem>
      )} />

      <FormField control={form.control} name="acceptsReturns" render={({ field }:any) => (
        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isUpdating} />
          </FormControl>
          <FormLabel>Accept Returns</FormLabel>
        </FormItem>
      )} />
    </div>
  </div>
);

// Enhanced Image Upload Component
const ProductImageUpload: React.FC<{ index: number; form: any; disabled?: boolean }> = ({ 
  index, form, disabled = false 
}) => {
  const existingImages = form.watch(`options.${index}.image`) || [];
  const newFiles = form.watch(`options.${index}.newImages`) || [];
  const totalImages = existingImages.length + newFiles.length;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const currentFiles = form.getValues(`options.${index}.newImages`) || [];
    const remainingSlots = 5 - totalImages;
    const filesToAdd = acceptedFiles.slice(0, remainingSlots);
    form.setValue(`options.${index}.newImages`, [...currentFiles, ...filesToAdd]);
  }, [form, index, totalImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
    onDrop,
    maxFiles: 5 - totalImages,
    disabled: disabled || totalImages >= 5,
  });

  const removeExistingImage = (imgUrl: string) => {
    const updatedImages = existingImages.filter((url: string) => url !== imgUrl);
    form.setValue(`options.${index}.image`, updatedImages);
  };

  const removeNewFile = (fileIndex: number) => {
    const updatedFiles = newFiles.filter((_: any, i: number) => i !== fileIndex);
    form.setValue(`options.${index}.newImages`, updatedFiles);
  };

  return (
    <div className="bg-white rounded-lg p-4 border">
      <h4 className="font-medium mb-4 flex items-center gap-2">
        <Upload className="w-4 h-4" />
        Product Images
        <span className="text-sm font-normal text-gray-500">({totalImages}/5)</span>
      </h4>

      {/* Image Grid */}
      {totalImages > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          {existingImages.map((imageUrl: string, imgIndex: number) => (
            <div key={`existing-${imgIndex}`} className="relative group aspect-square">
              <Image
                src={imageUrl}
                alt={`Existing image ${imgIndex + 1}`}
                fill
                className="object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeExistingImage(imageUrl)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}

          {newFiles.map((file: File, fileIndex: number) => (
            <div key={`new-${fileIndex}`} className="relative group aspect-square">
              <Image
                src={URL.createObjectURL(file)}
                alt={`New image ${fileIndex + 1}`}
                fill
                className="object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeNewFile(fileIndex)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
          isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : disabled || totalImages >= 5
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 cursor-pointer'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-gray-600">
          {isDragActive
            ? "Drop images here"
            : disabled
              ? "Upload disabled"
              : totalImages >= 5
                ? "Maximum 5 images reached"
                : "Drag & drop or click to upload"}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          PNG, JPG up to 5MB each
        </p>
      </div>
    </div>
  );
};

export default EditProductForm;