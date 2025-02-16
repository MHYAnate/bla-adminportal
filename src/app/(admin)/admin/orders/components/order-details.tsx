import Image from "next/image";
import {
  CallIcon,
  LocationIcon,
  MailIcon,
} from "../../../../../../public/icons";
import { Badge } from "@/components/ui/badge";

const OrderDetails: React.FC = () => {
  return (
    <>
      <Image
        width={100}
        height={100}
        alt="Customer avatar"
        src="/images/bladmin-login.jpg"
        className="w-[100px] h-[100px] rounded-full"
      />
      <div className="mt-6">
        <div className="flex gap-6 items-center mb-2.5">
          <h5 className="text-[1.5rem] font-bold text-[#111827]">
            John Okafor
          </h5>
          <Badge variant={"success"} className="py-1 px-[26px] font-bold">
            DELIVERED
          </Badge>
        </div>
        <div className="flex gap-3 items-center mb-4">
          <MailIcon />
          <p className="font-semibold text-sm text-[#111827]">
            mirablestore@gmail.com
          </p>
        </div>
        <div className="flex gap-3 items-center mb-4">
          <CallIcon />
          <p className="font-semibold text-sm text-[#111827]">09012345678</p>
        </div>
        <div className="flex gap-3 items-center mb-4">
          <LocationIcon />
          <p className="font-semibold text-sm text-[#111827]">
            Lagos, Nigeria.
          </p>
        </div>
        <p className="font-semibold text-sm text-[#687588] mb-2.5">
          Order#: 777892
        </p>
        <div className="flex gap-3 items-center mb-2.5">
          <p className="font-normal text-sm text-[#687588]">Shipping address</p>
          <p className="font-semibold text-sm text-[#111827]">
            68 Bode Thomas Surulere, Lagos Nigeria.
          </p>
        </div>
        <div className="flex gap-3 items-center mb-2.5">
          <p className="font-normal text-sm text-[#687588]">Date</p>
          <p className="font-semibold text-sm text-[#111827]">
            15th, May 2025.
          </p>
        </div>
        <div className="flex gap-3 items-center mb-6">
          <p className="font-normal text-sm text-[#687588]">Time</p>
          <p className="font-semibold text-sm text-[#111827]">11:55pm</p>
        </div>
        <h5 className="text-[1rem] font-medium text-[#111827] mb-6">
          Order Details
        </h5>
      </div>
    </>
  );
};

export default OrderDetails;
