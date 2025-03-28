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
import { UploadIcn, UploadIcon } from "../../../../../../public/icons";

const formSchema = z.object({
  name: z.string().min(5, "Name must be greater 4"),
  type: z.string({
    required_error: "Please select cusgtomer type.",
  }),
  email: z.string().email(),
  phonenumber: z.string(),
  cacnumber: z.string(),
  password: z.string(),
  address: z.string(),
  rolecount: z.number(),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  // cacdocument: z
  //   .instanceof(FileList)
  //   .refine((files) => files.length > 0, "File is required")
  //   .refine(
  //     (files) => files[0]?.size <= 5 * 1024 * 1024,
  //     "File size must be less than 5MB"
  //   )
  //   .refine(
  //     (files) => files[0]?.type === "application/pdf",
  //     "Only PDF files are allowed"
  //   ),
  // kyc: z
  //   .instanceof(FileList)
  //   .refine((files) => files.length > 0, "File is required")
  //   .refine(
  //     (files) => files[0]?.size <= 5 * 1024 * 1024,
  //     "File size must be less than 5MB"
  //   )
  //   .refine(
  //     (files) => files[0]?.type === "application/pdf",
  //     "Only PDF files are allowed"
  //   ),
});

type FormSchemaType = z.infer<typeof formSchema>;
interface iProps {
  setClose: () => void;
}

const CreateCustomer: React.FC<iProps> = ({ setClose }) => {
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
    },
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
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Admin name" {...field} />
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
                  <FormLabel>Customer Type</FormLabel>
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
                      <SelectItem value="usdc">USDC</SelectItem>
                      <SelectItem value="usdt">USDT</SelectItem>
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
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin1524887@g.com"
                      {...field}
                    />
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
                    <Input type="text" placeholder="9011221122" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-6 mb-14">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Set Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Lagos, Nigeria..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCustomer;
