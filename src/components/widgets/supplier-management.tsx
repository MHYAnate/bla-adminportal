import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { HorizontalDots, MailIcon, PhoneIcon } from "../../../public/icons";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { ISupplierCard } from "@/types";
interface iProps {
  item: ISupplierCard;
}

const SupplierManagementCard: React.FC<iProps> = ({ item }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between mb-6">
          <div>
            <Image
              width={146}
              height={76}
              className="object-cover"
              alt="Supplier image"
              src={item.url}
            />
          </div>
          <HorizontalDots />
        </div>
        <div className="flex justify-between text-[#111827] mb-6 items-start">
          <div>
            <h5 className="mb-2.5 font-bold text-2xl text-[#111827]">
              {item?.name}
            </h5>
            <div className="flex gap-2 mb-2.5 text-semibold text-sm items-center">
              <MailIcon />
              <p>{item.email}</p>
            </div>
            <div className="flex gap-2 mb-2.5 text-semibold text-sm items-center">
              <PhoneIcon />
              <p>{item.phonenumber}</p>
            </div>
            <p className="text-[#687588] text-sm font-normal">
              {item.location}
            </p>
          </div>
          <Badge
            variant={
              item.status.toLowerCase() === "verified"
                ? "success"
                : "destructive"
            }
            className="py-1 px-4 font-semibold rounded-[8px]"
          >
            {item.status.toUpperCase()}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <h5 className="mb-2.5 font-bold text-xl text-[#111827]">
            {item?.total} Products
          </h5>
          <Badge
            variant={item.isActive ? "success" : "destructive"}
            className="py-1 px-4 font-semibold rounded-[8px]"
          >
            {item.isActive ? "ACTIVATE" : "DEACTIVATE"}
          </Badge>
          <Switch id={item?.id} />
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierManagementCard;
