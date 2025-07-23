"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCallback, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { UploadIcon } from "../../../../../public/icons";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { useCreateManufacturer } from "@/services/manufacturers";
import { toast } from "sonner";
import { apiClient } from "./apiClient"; // Import your API client

// Zod schema for form validation
const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long."),
  contactPerson: z.string().min(3, "Contact person name is required."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  country: z.string().min(1, "Country is required."),
  logo: z
    .instanceof(File, { message: "A logo image is required." })
    .refine((file) => file.size > 0, "A logo image is required."),
});

type FormSchemaType = z.infer<typeof formSchema>;

interface IProps {
  setClose: () => void;
}

const AddManufacturer: React.FC<IProps> = ({ setClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const { createManufacturerPayload, createManufacturerIsLoading } = useCreateManufacturer(setClose);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      country: "",
      logo: undefined,
    },
  });

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

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 5000000, // 5MB
    accept: { "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] },
  });
  
  async function onSubmit(values: FormSchemaType) {
    setIsSubmitting(true);

    try {
        // NEW: Upload via backend endpoint
        toast.info("Uploading logo...");
        const logoUrl = await uploadImageToBackend(values.logo);
        toast.success("Logo uploaded!");

        // Prepare the final payload
        const payload = {
          name: values.name,
          contactPerson: values.contactPerson,
          email: values.email,
          country: values.country,
          logo: logoUrl,
          phone: values.phone || undefined,
        };

        // Create manufacturer
        await createManufacturerPayload(payload as any);

    } catch (error: any) {
        console.error("Creation failed:", error);
        const errorMessage = error?.response?.data?.error || error.message || "An unexpected error occurred.";
        
        if (errorMessage.includes("name")) {
            form.setError("name", { type: "manual", message: errorMessage });
        } else if (errorMessage.includes("email")) {
            form.setError("email", { type: "manual", message: errorMessage });
        } else {
            toast.error(errorMessage);
        }
    } finally {
        setIsSubmitting(false);
    }
  }

  const isLoading = isSubmitting || createManufacturerIsLoading;

  return (
    <div>
        <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
           {/* Form Fields... */}
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
                    <Input placeholder="e.g., Jane Doe" {...field} disabled={createManufacturerIsLoading} />
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
                    <Input type="email" placeholder="contact@acme.com" {...field} disabled={createManufacturerIsLoading} />
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
                    <Input placeholder="+1 555-123-4567" {...field} disabled={createManufacturerIsLoading} />
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
                  disabled={createManufacturerIsLoading}
                />
                <FormMessage />
              </FormItem>
            )}
          />
            {/* ... other fields like contactPerson, email, phone, country */}
          {/* </div> */}

          {/* Logo Upload Field */}
          <FormField
            control={form.control}
            name="logo"
            render={() => (
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
                      <Image src={preview} alt="Logo preview" width={200} height={120} className="object-contain rounded-md" />
                    ) : (
                      <UploadIcon />
                    )}
                    <Input {...getInputProps()} disabled={isLoading} />
                    <p className="mt-2 text-sm text-gray-600">
                      {isDragActive ? "Drop the logo here!" : "Drag & drop or click to select a file"}
                    </p>
                    <p className="text-xs text-gray-500">PNG or JPG (Max 5MB)</p>
                  </div>
                </FormControl>
                <FormMessage>
                  {fileRejections.length > 0 && "Invalid file. Please check size and type."}
                </FormMessage>
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" size="xl" onClick={setClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="warning" size="xl" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Manufacturer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddManufacturer;