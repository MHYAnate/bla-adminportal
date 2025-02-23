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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { UploadIcon } from "../../../../../../../public/icons";

const formSchema = z.object({
  vendorname: z.string().min(5, "Name must be greater 4"),
  contactperson: z.string(),
  email: z.string().email(),
  phonenumber: z.string(),
  status: z.string(),
  country: z.string(),
  totalproducts: z.number(),
  address: z.string(),
  image: z
    .instanceof(File)
    .refine((file) => file.size !== 0, "Please upload an image"),
});

type FormSchemaType = z.infer<typeof formSchema>;
interface iProps {
  setClose: () => void;
}

const AddVendor: React.FC<iProps> = ({ setClose }) => {
  const [preview, setPreview] = useState<string | ArrayBuffer | null>("");

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendorname: "",
      contactperson: "",
      email: "",
      phonenumber: "",
      status: "",
      country: "",
      totalproducts: 0,
      address: "",
      image: new File([""], "filename"),
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader();
      try {
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(acceptedFiles[0]);
        form.setValue("image", acceptedFiles[0]);
        form.clearErrors("image");
      } catch (error) {
        setPreview(null);
        form.resetField("image");
      }
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 1000000,
      accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    });

  async function onSubmit(values: FormSchemaType) {
    await Promise.resolve(true);
    console.warn(values);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
          <div className="flex gap-6 mb-6">
            <FormField
              control={form.control}
              name="vendorname"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Vendor Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Dangote" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactperson"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Tman" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-6 mb-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="sam@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phonenumber"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="+234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-6 mb-6">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Product Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="usdc">Active</SelectItem>
                      <SelectItem value="usdt">In-active</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Product Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="usdc">Nigeria</SelectItem>
                      <SelectItem value="usdt">Botswana</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="totalproducts"
            render={({ field }) => (
              <FormItem className="w-full mb-6">
                <FormLabel>Total number of products</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="w-full mb-6">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Arifanla" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem className="mb-14">
                  <FormLabel
                    className={`${
                      fileRejections.length !== 0 && "text-destructive"
                    }`}
                  ></FormLabel>
                  <FormControl>
                    <div
                      {...getRootProps()}
                      className="mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border border-[#3B82F6] p-8 shadow-sm shadow-foreground"
                    >
                      {preview && (
                        <Image
                          src={preview as string}
                          alt="Uploaded image"
                          className="rounded-lg object-contain"
                          width={400}
                          height={300}
                          layout="intrinsic"
                        />
                      )}
                      {preview && <UploadIcon />}
                      <Input {...getInputProps()} type="file" />
                      {isDragActive ? (
                        <p>Drop the image!</p>
                      ) : (
                        <div className="text-center">
                          <p className="mb-1 font-medium text-sm text-[#111217]">
                            Drag & Drop or{" "}
                            <span className="text-warning">choose file</span> to
                            upload
                          </p>
                          <p className="font-normal text-xs text-[#A4A5AB]">
                            Supported formats : Jpeg, png
                          </p>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage>
                    {fileRejections.length !== 0 && (
                      <p>
                        Image must be less than 1MB and of type png, jpg, or
                        jpeg
                      </p>
                    )}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
          <div className="gap-5 justify-end flex">
            <Button
              variant="outline"
              className="w-auto py-4 px-[3rem] font-bold text-base"
              size="xl"
              onClick={(e) => {
                e.preventDefault();
                setClose();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="warning"
              className="w-auto px-[3rem] py-4 font-bold text-base"
              size="xl"
            >
              Create
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddVendor;
