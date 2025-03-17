import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
interface iProps {
  setClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const ViewFeedback: React.FC<iProps> = ({ setClose }) => {
  const formSchema = z.object({
    productName: z.string().min(5, "Name must be greater 4"),
    statusUpdate: z.string(),
    internalNote: z.string(),
    feedbackmessage: z.string(),
    resolutionChannel: z.string(),
    assignteam: z.string(),
    supplierdescription: z
      .string()
      .min(10, {
        message: "Bio must be at least 10 characters.",
      })
      .max(160, {
        message: "Bio must not be longer than 30 characters.",
      }),
  });

  type FormSchemaType = z.infer<typeof formSchema>;
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      assignteam: "",
      resolutionChannel: "",
      supplierdescription: "",
      feedbackmessage: "",
      statusUpdate: "",
      internalNote: "",
    },
  });
  async function onSubmit(values: FormSchemaType) {
    console.warn(values);
  }

  const status = "Resolved";

  return (
    <div>
      <div className="flex gap-6 items-center">
        <div>
          <Image
            width={100}
            height={100}
            alt="Customer avatar"
            src="/images/bladmin-login.jpg"
            className="w-[100px] h-[100px] rounded-full"
          />
        </div>
        <div>
          <h6 className="text-[#111827] font-bold text-xl mb-[10px]">
            Mirabel Okon
          </h6>
          <p className="text-sm text-[#687588] mb-2">Business Owner</p>
          <div className="w-[333px]">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-[#111827] font-semibold">
                Feedback Status
              </p>
              <Badge
                variant={
                  status.toLowerCase() === "resolved" ? "success" : "tertiary"
                }
                className="py-1 px-[26px] font-semibold"
              >
                {status.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-[#111827] font-semibold">
                Feedback Category
              </p>
              <p className="text-sm text-[#687588] ">Product</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#111827] font-semibold">
                Date Submitted
              </p>
              <p className="text-sm text-[#687588] ">11/03/2025</p>
            </div>
          </div>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
          <FormField
            control={form.control}
            name="feedbackmessage"
            render={({ field }) => (
              <FormItem className="w-full mb-6">
                <FormLabel>Feedback Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit..."
                    className="resize-none h-[76px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <h6 className="text-[#111827] font-medium text-base mb-6">
            Support Tracking Information
          </h6>
          <FormField
            control={form.control}
            name="assignteam"
            render={({ field }) => (
              <FormItem className="w-full mb-6">
                <FormLabel>Assign Team</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select A Brand" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="usdc">Cocoa</SelectItem>
                    <SelectItem value="usdt">Textile</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="resolutionChannel"
            render={({ field }) => (
              <FormItem className="w-full mb-6">
                <FormLabel>Issue Resolution Channel</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Cocoa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <h6 className="text-[#111827] font-medium text-base mb-6">
            Admin Actions
          </h6>

          <FormField
            control={form.control}
            name="internalNote"
            render={({ field }) => (
              <FormItem className="w-full mb-6">
                <FormLabel>Add Internal Note</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="statusUpdate"
            render={({ field }) => (
              <FormItem className="w-full mb-10">
                <FormLabel>Mark as Addressed</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="usdc">Cocoa</SelectItem>
                    <SelectItem value="usdt">Textile</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-6">
            <Button
              variant="outline"
              className="w-auto px-[3rem] py-4 font-bold text-base text-black"
              size="xl"
              onClick={(e) => {
                e.preventDefault();
                setClose;
              }}
            >
              Cancel
            </Button>
            <Button
              variant="warning"
              className="w-auto px-[3rem] py-4 font-bold text-base"
              size="xl"
            >
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ViewFeedback;
