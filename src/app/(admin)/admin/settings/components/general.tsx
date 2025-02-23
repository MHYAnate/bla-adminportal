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
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(5, "Name must be greater 4"),
  status: z.string({
    required_error: "Change status",
  }),
  username: z.string(),
  email: z.string().email(),
  phonenumber: z.string(),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
});

type FormSchemaType = z.infer<typeof formSchema>;
interface iProps {}

const SettingsGeneral: React.FC<iProps> = () => {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      status: "",
      username: "",
      email: "",
      phonenumber: "",
    },
  });

  async function onSubmit(values: FormSchemaType) {
    await Promise.resolve(true);
    console.warn(values);
  }

  return (
    <div>
      <h6 className="text-[#111827] text-xl font-bold mb-6">General</h6>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
          <div className="flex gap-6 mb-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Admin name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="admin1524887" {...field} />
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
                  <FormLabel>Emaiil</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="admin1524887@gmail.com"
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
                    <Input type="text" placeholder="09011223321" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-6 mb-14">
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "text-left font-normal h-14 border-[",
                            !field.value && ""
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-14">
                        <SelectValue placeholder="Admin role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="usdc">Active</SelectItem>
                      <SelectItem value="usdt">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="gap-5 justify-end flex">
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

export default SettingsGeneral;
