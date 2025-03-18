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

const ViewSupport: React.FC<iProps> = ({ setClose }) => {
  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <Image
          width={100}
          height={100}
          alt="Customer avatar"
          src="/images/bladmin-login.jpg"
          className="w-[100px] h-[100px] rounded-full"
        />
      </div>

      <h6 className="text-[#111827] font-bold text-xl mb-[10px]">
        Mirabel Okon
      </h6>
      <p className="text-sm text-[#687588] mb-6">Business Owner</p>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[#111827] font-semibold">Feedback Type</p>
        <p className="text-sm text-[#687588] ">Service Rating</p>
      </div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[#111827] font-semibold">Feedback ID</p>
        <p className="text-sm text-[#687588] ">#123423</p>
      </div>
      <div className="flex items-center justify-between mb-10">
        <p className="text-sm text-[#111827] font-semibold">Date Submitted</p>
        <p className="text-sm text-[#687588] ">March 12, 2025, at 2:30 PM</p>
      </div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-sm text-[#111827] font-semibold mb-4">Rating</p>
        </div>
        <p className="text-sm text-[#687588] ">4.5 Rating</p>
      </div>
      <div className="mb-10">
        <p className="text-sm text-[#111827] font-semibold mb-4">
          Feedback Message
        </p>
        <p className="text-sm text-[#687588] ">
          I recently purchased the 10 Bags of Mr. Rice, and I’m very impressed
          with the sound quality! The noise cancellation is excellent, and the
          battery life lasts as advertised. However, the packaging was slightly
          damaged upon arrival, and I was worried the product might be affected.
          Thankfully, it wasn’t, but I would love to see improvements in
          packaging for better protection in the future.
        </p>
      </div>
      <div className="flex justify-end items-end">
        <Button
          variant={"outline"}
          className="font-bold text-base w-auto py-4 px-[52px] flex gap-2 items-center"
          size={"xl"}
          onClick={() => setClose(false)}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default ViewSupport;
