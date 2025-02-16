import Image from "next/image";
import { Badge } from "../ui/badge";
import { IOrderItem } from "@/types";
interface iProps {
  item: IOrderItem;
}

const OrderItemCard: React.FC<iProps> = ({ item }) => {
  return (
    <div className="flex gap-6 items-center">
      <div className="p-[1rem]">
        <div className="w-[167px] h-[216px]">
          <Image
            height={216}
            width={167}
            alt="Ordered product image"
            src={item?.url || "/images/bladmin-login.jpg"}
            className="object-cover h-full"
          />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-[1.25rem] text-[#111827] mb-2.5">
          {item.productName}
        </h4>
        <p className="font-medium text-[0.875rem] text-[#687588] mb-2.5">
          NGN{item.price} X {item.quantity}
        </p>
        <h6 className="font-medium text-[1rem] text-[#111827] mb-2.5">
          Total: NGN{item.total}
        </h6>
        <p className="font-medium text-[0.875rem] text-[#687588] mb-2.5">
          {item.quantity} items
        </p>
        <Badge
          variant={
            item.status.toLowerCase() === "delivered"
              ? "success"
              : item.status.toLowerCase() === "pending"
              ? "tertiary"
              : "warning"
          }
          className="py-1 px-[26px] font-bold"
        >
          {item.status.toUpperCase()}
        </Badge>
      </div>
    </div>
  );
};

export default OrderItemCard;
