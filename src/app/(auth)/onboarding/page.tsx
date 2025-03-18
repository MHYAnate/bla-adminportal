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
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { CalendarIcon, UploadIcon } from "../../../../public/icons";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(5, "Name must be greater 4"),
  username: z.string().min(5, "Name must be greater 4"),
  role: z.string(),
  type: z.string({
    required_error: "Please select cusgtomer type.",
  }),
  email: z.string().email(),
  phonenumber: z.string(),
  cacnumber: z.string(),
  password: z.string(),
  confirmpassword: z.string(),
  address: z.string(),
  rolecount: z.number(),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  image: z
    .instanceof(File)
    .refine((file) => file.size !== 0, "Please upload an image"),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function AdminOnboardingPage() {
  const [preview, setPreview] = useState<string | ArrayBuffer | null>("");

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      email: "",
      phonenumber: "",
      cacnumber: "",
      password: "",
      address: "",
      username: "",
      role: "",
      confirmpassword: "",
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
    <div className="flex">
      <div className="bg-[#0F3D30] flex-1">
        <div className="w-full">
          <Image
            height={720}
            width={550}
            alt="Admin onboarding image"
            src="/images/bladmin-login.jpg"
            className="object-cover w-full"
          />
        </div>
        <div className="py-[64.75px] px-[50px]">
          <div className="w-[218px] h-[138.47px]">
            <Image
              height={138.47}
              width={218}
              alt="Auth login image"
              src="/images/logo.png"
              quality={100}
              priority
              className="object-cover w-full h-auto"
            />
          </div>
          <h2 className="my-6 font-bold text-[2rem] text-white leading-[2.5rem]">
            Welcome Aboard! Complete Your Registration.
          </h2>
          <p className="font-medium text-base text-white">
            Fill in your details to set up your account and access your assigned
            admin role.
          </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-9 flex-1">
          <h2 className="font-bold text-[2rem] text-[#000] font-dmsans mb-6">
            Setup your account as an Admin
          </h2>
          <div className="flex gap-6 mb-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Admin name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="tao@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-6 mb-6">
            <FormField
              control={form.control}
              name="phonenumber"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="9011221122" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-14">
                        <SelectValue placeholder="Customer Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="usdc">Male</SelectItem>
                      <SelectItem value="usdt">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-6 mb-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="mutiu05" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Assign Role</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Inventory Manager"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-6 mb-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Password(Required)</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmpassword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Confirm Password (Required)</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-6 mb-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    What is your favorite meal (For account recovery)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="What is your favorite meal (For account recovery)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="w-full mb-6">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "text-left flex justify-between font-normal h-14 border-[",
                          !field.value && ""
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
          <div className="gap-5 justify-center flex">
            <Button
              variant="warning"
              className="w-auto px-[3rem] py-4 font-bold text-base"
              size="xl"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
