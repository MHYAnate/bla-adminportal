// "use client";

// import {
// 	Form,
// 	FormControl,
// 	FormField,
// 	FormItem,
// 	FormLabel,
// 	FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { useCallback, useEffect, useState } from "react";
// import Image from "next/image";
// import { useDropzone } from "react-dropzone";
// import { UploadIcon } from "../../../../../../../../public/icons";
// import { CountryDropdown } from "@/components/ui/country-dropdown";
// import { useUpdateManufacturer } from "@/services/manufacturers";
// import { toast } from "sonner";
// import { useQueryClient } from "@tanstack/react-query";

// // Schema definitions
// const commonFormSchema = {
// 	name: z.string().min(3, "Name must be at least 3 characters long."),
// 	contactPerson: z.string().min(3, "Contact person name is required."),
// 	email: z.string().email("Please enter a valid email address."),
// 	phone: z.string().optional(),
// 	country: z.string().min(1, "Country is required."),
// };

// const updateSchema = z.object({
// 	...commonFormSchema,
// 	logo: z
// 		.union([z.string().url("Invalid logo URL"), z.instanceof(File)])
// 		.optional(),
// });

// type UpdateFormSchemaType = z.infer<typeof updateSchema>;

// interface Manufacturer {
// 	id: number;
// 	name: string;
// 	contactPerson: string;
// 	email: string;
// 	phone?: string;
// 	country: string;
// 	logo?: string;
// }

// interface UpdateParams {
// 	id: any;
// 	payload: any;
// }

// interface IProps {
// 	setClose: () => void;
// 	manufacturer: Manufacturer;
// }

// const EditManufacturer: React.FC<IProps> = ({ setClose, manufacturer }) => {
// 	const [isSubmitting, setIsSubmitting] = useState(false);
// 	const [preview, setPreview] = useState(manufacturer?.logo || null);
// 	const queryClient = useQueryClient();

// 	const { updateManufacturerPayload, updateManufacturerIsLoading } =
// 		useUpdateManufacturer({
// 			onSuccessCallback: setClose,
// 			queryClient,
// 		});

// 	const form = useForm<UpdateFormSchemaType>({
// 		resolver: zodResolver(updateSchema),
// 		defaultValues: {
// 			name: manufacturer?.name || "",
// 			contactPerson: manufacturer?.contactPerson || "",
// 			email: manufacturer?.email || "",
// 			phone: manufacturer?.phone || "",
// 			country: manufacturer?.country || "",
// 			logo: manufacturer?.logo || undefined,
// 		},
// 	});

// 	useEffect(() => {
// 		if (manufacturer) {
// 			form.reset({
// 				name: manufacturer.name,
// 				contactPerson: manufacturer.contactPerson,
// 				email: manufacturer.email,
// 				phone: manufacturer.phone || "",
// 				country: manufacturer.country,
// 				logo: manufacturer.logo || undefined,
// 			});
// 			setPreview(manufacturer.logo || null);
// 		}
// 	}, [manufacturer, form]);

// 	const onDrop = useCallback(
// 		(acceptedFiles: File[]) => {
// 			const file = acceptedFiles[0];
// 			if (file) {
// 				setPreview(URL.createObjectURL(file));
// 				form.setValue("logo", file, { shouldValidate: true });
// 			}
// 		},
// 		[form]
// 	);

// 	const { getRootProps, getInputProps, isDragActive, fileRejections } =
// 		useDropzone({
// 			onDrop,
// 			maxFiles: 1,
// 			maxSize: 5000000,
// 			accept: {
// 				"image/png": [".png"],
// 				"image/jpeg": [".jpg", ".jpeg"],
// 			},
// 		});

// 	const uploadImageToCloudinary = async (file: File): Promise<string> => {
// 		const formData = new FormData();
// 		formData.append("file", file);
// 		formData.append(
// 			"upload_preset",
// 			process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
// 		);

// 		const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
// 		const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

// 		try {
// 			const response = await fetch(uploadUrl, {
// 				method: "POST",
// 				body: formData,
// 			});

// 			if (!response.ok) {
// 				const errorData = await response.json();
// 				throw new Error(`Cloudinary Error: ${errorData.error.message}`);
// 			}

// 			const data = await response.json();
// 			return data.secure_url;
// 		} catch (error) {
// 			console.error("Image upload failed:", error);
// 			throw error;
// 		}
// 	};



// 	async function onSubmit(values: UpdateFormSchemaType) {
// 		setIsSubmitting(true);

// 		try {
// 			let logoUrl: string | undefined = values.logo as string | undefined;

// 			if (values.logo instanceof File) {
// 				logoUrl = await uploadImageToCloudinary(values.logo);
// 				toast.success("Logo updated!");
// 			}

// 			// Prepare payload with proper typing
// 			const payload: UpdateParams["payload"] = {
// 				name: values.name,
// 				contactPerson: values.contactPerson,
// 				email: values.email,
// 				phone: values.phone,
// 				country: values.country,
// 				logo: "hhtps//edith",
// 			};

// 			// Create update parameters with proper typing
// 			const updateParams: any = {
// 				id: manufacturer.id,
// 				payload,
// 			};

// 			// Call with typed parameters
// 			await updateManufacturerPayload(updateParams as any);
// 		} catch (error: any) {
// 			// Error handling remains the same
// 		} finally {
// 			setIsSubmitting(false);
// 		}
// 	}
// 	const isLoading = isSubmitting || updateManufacturerIsLoading;

//   return (
//     <div>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Manufacturer Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g., Acme Inc." {...field} disabled={isLoading} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="contactPerson"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Contact Person</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g., Jane Doe" {...field} disabled={isLoading} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email Address</FormLabel>
//                   <FormControl>
//                     <Input type="email" placeholder="contact@acme.com" {...field} disabled={isLoading} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="phone"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Phone Number (Optional)</FormLabel>
//                   <FormControl>
//                     <Input placeholder="+1 555-123-4567" {...field} disabled={isLoading} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <FormField
//             control={form.control}
//             name="country"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Country</FormLabel>
//                 <CountryDropdown
//                   placeholder="-- Select a country --"
//                   defaultValue={field.value}
//                   onChange={(country) => field.onChange(country.name)}
//                   disabled={isLoading}
//                 />
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="logo"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Manufacturer Logo</FormLabel>
//                 <FormControl>
//                   <div
//                     {...getRootProps()}
//                     className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
//                       isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
//                     } ${isLoading ? 'cursor-not-allowed opacity-60' : 'hover:border-primary/70'}`}
//                   >
//                     {preview ? (
//                       <Image 
//                         src={!preview.includes("res.cloudinary.com")?"/images/user-avatar.jpg":preview} 
//                         alt="Logo preview" 
//                         width={200} 
//                         height={120} 
//                         className="object-contain rounded-md" 
//                       />
//                     ) : (
//                       <div className="flex flex-col items-center">
//                         <UploadIcon />
//                         <p className="mt-2 text-sm text-gray-600">
//                           Drag & drop or click to select a file
//                         </p>
//                       </div>
//                     )}
//                     <input {...getInputProps()} disabled={isLoading} />
//                     <p className="mt-2 text-sm text-gray-600">
//                       {isDragActive ? "Drop the logo here!" : "PNG or JPG (Max 5MB)"}
//                     </p>
//                   </div>
//                 </FormControl>
//                 {fileRejections.length > 0 && (
//                   <p className="text-destructive text-sm mt-1">
//                     {fileRejections[0].errors[0].message}
//                   </p>
//                 )}
//               </FormItem>
//             )}
//           />

//           <div className="flex justify-end gap-4 pt-4">
//             <Button 
//               type="button" 
//               variant="outline" 
//               size="xl" 
//               onClick={setClose} 
//               disabled={isLoading}
//             >
//               Cancel
//             </Button>
//             <Button 
//               type="submit" 
//               variant="warning" 
//               size="xl" 
//               disabled={isLoading}
//             >
//               {isLoading ? "Updating..." : "Update Manufacturer"}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default EditManufacturer;

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
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { UploadIcon } from "../../../../../../../../public/icons";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { useUpdateManufacturer } from "@/services/manufacturers";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/app/(admin)/admin/manufacturers/apiClient"; // Import your API client

// Schema definitions
const commonFormSchema = {
  name: z.string().min(3, "Name must be at least 3 characters long."),
  contactPerson: z.string().min(3, "Contact person name is required."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  country: z.string().min(1, "Country is required."),
};

const updateSchema = z.object({
  ...commonFormSchema,
  logo: z
    .union([z.string().url("Invalid logo URL"), z.instanceof(File)])
    .optional(),
});

type UpdateFormSchemaType = z.infer<typeof updateSchema>;

interface Manufacturer {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone?: string;
  country: string;
  logo?: string;
}

interface IProps {
  setClose: () => void;
  manufacturer: Manufacturer;
}

const EditManufacturer: React.FC<IProps> = ({ setClose, manufacturer }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(manufacturer?.logo || null);
  const queryClient = useQueryClient();

  const { updateManufacturerPayload, updateManufacturerIsLoading } =
    useUpdateManufacturer({
      onSuccessCallback: setClose,
      queryClient,
    });

  const form = useForm<UpdateFormSchemaType>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      name: manufacturer?.name || "",
      contactPerson: manufacturer?.contactPerson || "",
      email: manufacturer?.email || "",
      phone: manufacturer?.phone || "",
      country: manufacturer?.country || "",
      logo: manufacturer?.logo || undefined,
    },
  });

  useEffect(() => {
    if (manufacturer) {
      form.reset({
        name: manufacturer.name,
        contactPerson: manufacturer.contactPerson,
        email: manufacturer.email,
        phone: manufacturer.phone || "",
        country: manufacturer.country,
        logo: manufacturer.logo || undefined,
      });
      setPreview(manufacturer.logo || null);
    }
  }, [manufacturer, form]);

  // NEW: Upload image using backend endpoint
  const uploadImageToBackend = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("images", file); // Field name must be "images"
    formData.append("folder", "manufacturers"); // Optional folder parameter

    try {
      const response = await apiClient.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.urls && response.data.urls.length > 0) {
        return response.data.urls[0]; // Return the first URL
      }
      
      throw new Error("No URL returned from server");
    } catch (error: any) {
      console.error("Backend upload failed:", error);
      const errorMessage = error.response?.data?.error || error.message || "Image upload failed";
      toast.error(errorMessage);
      throw error;
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setPreview(URL.createObjectURL(file));
        form.setValue("logo", file, { shouldValidate: true });
      }
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 5000000,
      accept: {
        "image/png": [".png"],
        "image/jpeg": [".jpg", ".jpeg"],
      },
    });

  async function onSubmit(values: UpdateFormSchemaType) {
    setIsSubmitting(true);

    try {
      let logoUrl: string | undefined = values.logo as string | undefined;

      // If a new file is selected, upload to backend
      if (values.logo instanceof File) {
        toast.info("Uploading logo...");
        logoUrl = await uploadImageToBackend(values.logo);
        toast.success("Logo updated!");
      }

      // Prepare payload
      const payload = {
        name: values.name,
        contactPerson: values.contactPerson,
        email: values.email,
        phone: values.phone,
        country: values.country,
        logo: logoUrl,
      };


						const updateParams: any = {
				id: manufacturer.id,
				payload,
			};

      // Update manufacturer
      await updateManufacturerPayload(updateParams as any);

    } catch (error: any) {
      console.error("Update failed:", error);
      const errorMessage = error?.response?.data?.error || error.message || "An unexpected error occurred.";
      
      // Handle specific field errors
      if (errorMessage.includes("name")) {
        form.setError("name", { message: errorMessage });
      } else if (errorMessage.includes("email")) {
        form.setError("email", { message: errorMessage });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const isLoading = isSubmitting || updateManufacturerIsLoading;

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Acme Inc." {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Doe" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contact@acme.com" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 555-123-4567" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <CountryDropdown
                  placeholder="-- Select a country --"
                  defaultValue={field.value}
                  onChange={(country) => field.onChange(country.name)}
                  disabled={isLoading}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturer Logo</FormLabel>
                <FormControl>
                  <div
                    {...getRootProps()}
                    className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
                    } ${isLoading ? 'cursor-not-allowed opacity-60' : 'hover:border-primary/70'}`}
                  >
                    {preview ? (
                      <Image 
                        src={preview} 
                        alt="Logo preview" 
                        width={200} 
                        height={120} 
                        className="object-contain rounded-md" 
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <UploadIcon />
                        <p className="mt-2 text-sm text-gray-600">
                          Drag & drop or click to select a file
                        </p>
                      </div>
                    )}
                    <input {...getInputProps()} disabled={isLoading} />
                    <p className="mt-2 text-sm text-gray-600">
                      {isDragActive ? "Drop the logo here!" : "PNG or JPG (Max 5MB)"}
                    </p>
                  </div>
                </FormControl>
                {fileRejections.length > 0 && (
                  <p className="text-destructive text-sm mt-1">
                    {fileRejections[0].errors[0].message}
                  </p>
                )}
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              size="xl" 
              onClick={setClose} 
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="warning" 
              size="xl" 
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Manufacturer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditManufacturer;