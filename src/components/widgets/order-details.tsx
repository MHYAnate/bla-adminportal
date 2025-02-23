import Image from "next/image";
import { HorizontalDots } from "../../../public/icons";
import { Badge } from "../ui/badge";
import { IOrderDetails } from "@/types";
interface iProps {
  item: IOrderDetails;
}

const OrderDetailsCard: React.FC<iProps> = ({ item }) => {
  return (
    <div className="p-6 border border-[#F1F2F4] rounded-[1rem]">
      <div className="flex items-center gap-2.5 mb-4">
        <h5 className="mb-2.5 font-bold text-xl text-[#111827]">
          {item?.name}
        </h5>
        <Badge
          variant={
            item.status.toLowerCase() === "delivered"
              ? "success"
              : item?.status.toLowerCase() === "ongoing"
              ? "warning"
              : "destructive"
          }
          className="py-1 px-4 font-semibold rounded-[8px] me-auto"
        >
          {item.status}
        </Badge>
        <HorizontalDots />
      </div>
      <p className="font-medium text-sm text-[#687588] mb-4">N{item.price}</p>
      <div className="flex items-center gap-4 mb-4">
        <div>
          <Image
            width={24}
            height={24}
            className="object-cover"
            alt="Supplier image"
            src={item.url || "/images/bladmin-login.jpg"}
          />
        </div>
        <p className="font-medium text-sm text-[#687588] mb-4 me-auto">
          Order#: {item.orderid}
        </p>
        <p className="font-medium text-sm text-[#687588] mb-4">{item.date}</p>
      </div>
    </div>
  );
};

export default OrderDetailsCard;
