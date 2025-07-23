// "use client";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import { useCallback, useState } from "react";
// import Image from "next/image";
// import { useDropzone } from "react-dropzone";
// import { UploadIcon } from "../../../../../../public/icons";

// const formSchema = z.object({
//   productname: z.string().min(5, "Name must be greater 4"),
//   brand: z.string(),
//   price: z.number(),
//   productcategory: z.string(),
//   quantity: z.string(),
//   discount: z.string(),
//   productid: z.string(),
//   productstatus: z.string(),
//   image: z
//     .instanceof(File)
//     .refine((file) => file.size !== 0, "Please upload an image"),
// });

// type FormSchemaType = z.infer<typeof formSchema>;
// interface iProps {
//   setClose: () => void;
// }

// const EditProduct: React.FC<iProps> = ({ setClose }) => {
//   const [preview, setPreview] = useState<string | ArrayBuffer | null>("");

//   const form = useForm<FormSchemaType>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       productname: "",
//       brand: "",
//       price: 0,
//       productcategory: "",
//       quantity: "",
//       discount: "",
//       productid: "",
//       productstatus: "",
//       image: new File([""], "filename"),
//     },
//   });

//   const onDrop = useCallback(
//     (acceptedFiles: File[]) => {
//       const reader = new FileReader();
//       try {
//         reader.onload = () => setPreview(reader.result);
//         reader.readAsDataURL(acceptedFiles[0]);
//         form.setValue("image", acceptedFiles[0]);
//         form.clearErrors("image");
//       } catch (error) {
//         setPreview(null);
//         form.resetField("image");
//       }
//     },
//     [form]
//   );

//   const { getRootProps, getInputProps, isDragActive, fileRejections } =
//     useDropzone({
//       onDrop,
//       maxFiles: 1,
//       maxSize: 1000000,
//       accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
//     });

//   async function onSubmit(values: FormSchemaType) {
//     await Promise.resolve(true);
//     console.warn(values);
//   }

//   return (
//     <div>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
//           <div className="flex gap-6 mb-6">
//             <FormField
//               control={form.control}
//               name="productname"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Product Name</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="text"
//                       placeholder="Nescafe Classic Coffe"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="brand"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Product Name</FormLabel>
//                   <FormControl>
//                     <Input type="text" placeholder="Nestle" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <div className="flex gap-6 mb-6">
//             <FormField
//               control={form.control}
//               name="price"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Price</FormLabel>
//                   <FormControl>
//                     <Input type="text" placeholder="NGN 580" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="productcategory"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Product Category</FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Admin role" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="usdc">Cocoa</SelectItem>
//                       <SelectItem value="usdt">Textile</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <div className="flex gap-6 mb-6">
//             <FormField
//               control={form.control}
//               name="quantity"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Product Name</FormLabel>
//                   <FormControl>
//                     <Input type="text" placeholder="120" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="discount"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Product Name</FormLabel>
//                   <FormControl>
//                     <Input type="text" placeholder="NGN 0" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           <div className="flex gap-6 mb-6">
//             <FormField
//               control={form.control}
//               name="productid"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Product ID</FormLabel>
//                   <FormControl>
//                     <Input type="text" placeholder="NGN 580" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="productstatus"
//               render={({ field }) => (
//                 <FormItem className="w-full">
//                   <FormLabel>Product Status</FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Available Option" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="usdc">Cocoa</SelectItem>
//                       <SelectItem value="usdt">Textile</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           {/* <div>
//             <FormField
//               control={form.control}
//               name="image"
//               render={() => (
//                 <FormItem className="mb-14">
//                   <FormLabel
//                     className={`${
//                       fileRejections.length !== 0 && "text-destructive"
//                     }`}
//                   ></FormLabel>
//                   <FormControl>
//                     <div
//                       {...getRootProps()}
//                       className="mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border border-[#3B82F6] p-8 shadow-sm shadow-foreground"
//                     >
//                       {preview && (
//                         <Image
//                           src={preview as string}
//                           alt="Uploaded image"
//                           className="rounded-lg object-contain"
//                           width={400}
//                           height={300}
//                           layout="intrinsic"
//                         />
//                       )}
//                       {preview && <UploadIcon />}
//                       <Input {...getInputProps()} type="file" />
//                       {isDragActive ? (
//                         <p>Drop the image!</p>
//                       ) : (
//                         <div className="text-center">
//                           <p className="mb-1 font-medium text-sm text-[#111217]">
//                             Drag & Drop or{" "}
//                             <span className="text-warning">choose file</span> to
//                             upload
//                           </p>
//                           <p className="font-normal text-xs text-[#A4A5AB]">
//                             Supported formats : Jpeg, png
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </FormControl>
//                   <FormMessage>
//                     {fileRejections.length !== 0 && (
//                       <p>
//                         Image must be less than 1MB and of type png, jpg, or
//                         jpeg
//                       </p>
//                     )}
//                   </FormMessage>
//                 </FormItem>
//               )}
//             />
//           </div> */}
//           <div className="gap-5 justify-end flex">
//             <Button
//               variant="outline"
//               className="w-auto py-4 px-[3rem] font-bold text-base"
//               size="xl"
//               onClick={(e) => {
//                 e.preventDefault();
//                 setClose();
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="warning"
//               className="w-auto px-[3rem] py-4 font-bold text-base"
//               size="xl"
//             >
//               Create
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default EditProduct;

"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { apiClient } from "@/app/(admin)/admin/manufacturers/apiClient";

// Zod schema for form validation
const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  manufacturerId: z.string().min(1, "Manufacturer is required"),
  type: z.string().min(1, "Type is required"),
  options: z.array(z.object({
    name: z.string().min(1, "Option name required"),
    value: z.string().min(1, "Option value required")
  })).optional()
});

type ProductFormValues = z.infer<typeof productSchema>;

interface Option {
  name: string;
  value: string;
}

interface Category {
  id: number;
  name: string;
}

interface Manufacturer {
  id: number;
  name: string;
}

// interface ProductWithOptions extends Product {
//   options: any[];
// }

interface IProps {
  product: any;
  manufacturers: Manufacturer[];
  setClose: () => void;
}

const EditProductForm: React.FC<IProps> = ({ 
  product,  
  manufacturers, 
  setClose 
}) => {
 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [options, setOptions] = useState<Option[]>(
    product.options?.map((opt: { name: any; value: any; }) => ({ name: opt.name, value: opt.value })) || []
  );

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      description: product.description || "",
      categoryId: String(product.categoryId),
      manufacturerId: String(product.manufacturerId),
      type: product.type || "",
      options: product.options?.map((opt: { name: any; value: any; }) => ({ 
        name: opt.name, 
        value: opt.value 
      })) || []
    }
  });

  useEffect(() => {
    form.reset({
      name: product.name,
      description: product.description || "",
      categoryId: String(product.categoryId),
      manufacturerId: String(product.manufacturerId),
      type: product.type || "",
      options: product.options?.map((opt: { name: any; value: any; }) => ({ 
        name: opt.name, 
        value: opt.value 
      })) || []
    });
    setOptions(product.options?.map((opt: { name: any; value: any; }) => ({ name: opt.name, value: opt.value })) || []);
  }, [product, form]);

  const addOption = () => {
    setOptions([...options, { name: "", value: "" }]);
  };

  const removeOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
    form.setValue("options", newOptions);
  };

  const handleOptionChange = (index: number, field: "name" | "value", val: string) => {
    const newOptions = [...options];
    newOptions[index][field] = val;
    setOptions(newOptions);
    form.setValue("options", newOptions);
  };

  const onSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    
    try {
      const payload = {
        ...values,
        categoryId: parseInt(values.categoryId),
        manufacturerId: parseInt(values.manufacturerId),
        options: options.filter(opt => opt.name && opt.value)
      };

      const response = await apiClient.patch(
        `/admin/products/${product.id}`,
        payload
      );

      if (response.data.success) {
        toast.success("succes");
        setClose();
      } else {
        
        throw new Error(response.data.error || "Failed to update product");
       
      }
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.error("error failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Premium Headphones" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Electronics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Product description..." 
                    className="min-h-[120px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                 
                    <FormControl>
                    <Input placeholder="Categories this" {...field} />
                    </FormControl>
                    
                
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="manufacturerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a manufacturer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {manufacturers.map(manufacturer => (
                        <SelectItem key={manufacturer.id} value={String(manufacturer.id)}>
                          {manufacturer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Options</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addOption}
              >
                Add Option
              </Button>
            </div>
            
            {options.map((option, index) => (
              <div key={index} className="flex gap-3 items-end">
                <div className="flex-1">
                  <FormLabel>Option Name</FormLabel>
                  <Input
                    placeholder="e.g., Color"
                    value={option.name}
                    onChange={(e) => handleOptionChange(index, "name", e.target.value)}
                  />
                </div>
                
                <div className="flex-1">
                  <FormLabel>Value</FormLabel>
                  <Input
                    placeholder="e.g., Black"
                    value={option.value}
                    onChange={(e) => handleOptionChange(index, "value", e.target.value)}
                  />
                </div>
                
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeOption(index)}
                  className="mb-1"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={setClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditProductForm;