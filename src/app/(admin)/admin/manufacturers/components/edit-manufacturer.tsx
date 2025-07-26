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
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { UploadIcon } from "../../../../../../public/icons";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import { useUpdateManufacturer } from "@/services/manufacturers";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api/client";
import { updateSchema, UpdateFormSchemaType } from "./validation-shemas";

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
        useUpdateManufacturer(() => {
            toast.success("Manufacturer updated successfully!");
            queryClient.invalidateQueries({ queryKey: ['manufacturers'] });
            setClose();
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

    const uploadImageToBackend = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("images", file);
        formData.append("folder", "manufacturers");

        try {
            const response = await apiClient.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.urls && response.data.urls.length > 0) {
                return response.data.urls[0];
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
            }

            // Prepare payload
            const payload = {
                name: values.name,
                contactPerson: values.contactPerson,
                email: values.email,
                phone: values.phone || undefined,
                country: values.country,
                logo: logoUrl,
            };

            // Call the update function - adjust this based on your hook structure
            updateManufacturerPayload({
                id: manufacturer.id,
                payload,
            } as any);

        } catch (error: any) {
            console.error("Update failed:", error);
            const errorMessage = error?.response?.data?.message ||
                error?.response?.data?.error ||
                error.message ||
                "An unexpected error occurred.";

            // Handle specific field errors
            if (errorMessage.toLowerCase().includes("name")) {
                form.setError("name", { message: errorMessage });
            } else if (errorMessage.toLowerCase().includes("email")) {
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
                                        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
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