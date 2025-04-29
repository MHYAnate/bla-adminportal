import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { HorizontalDots, MailIcon, PhoneIcon } from "../../../public/icons";
import { Badge } from "../ui/badge";
import { ISupplierCard } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { Switch } from "../ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface iProps {
  item: ISupplierCard;
  handleUpdateManufacturerStatus?: () => void;
  showToggle?: boolean;
  showOptions?: boolean;
  setTab?: React.Dispatch<React.SetStateAction<string>>;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  loading?: boolean;
}

const SupplierManagementCard: React.FC<iProps> = ({
  item,
  handleUpdateManufacturerStatus,
  showToggle = false,
  showOptions = false,
  setTab,
  setOpen,
  loading = false,
}) => {
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
              src={"/images/bladmin-login.jpg"}
              // img=item.logo ||
            />
          </div>
          {showOptions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="h-auto cursor-pointer">
                <div className="p-4">
                  <span className="sr-only">Open menu</span>
                  <HorizontalDots />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    if (setTab && setOpen) {
                      setTab("update");
                      setOpen(true);
                    }
                  }}
                >
                  Update
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (setTab && setOpen) {
                      setTab("delete");
                      setOpen(true);
                    }
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="flex justify-between text-[#111827] mb-6 items-start">
          <div>
            <h5 className="mb-2.5 font-bold text-2xl text-[#111827]">
              {item?.name}
            </h5>
            <div className="flex gap-2 mb-2.5 text-semibold text-sm items-center">
              <MailIcon />
              <p>{item.email || "----"}</p>
            </div>
            <div className="flex gap-2 mb-[10px] text-semibold text-sm items-center">
              <PhoneIcon />
              <p>{item?.phone || "----"}</p>
            </div>
            <p className="text-[#687588] mb-[10px] text-xs font-normal">
              Country: {item?.country || "----"}
            </p>
            <p className="text-[#687588] mb-[10px] text-xs font-normal">
              Date Joined:
              {formatDateTime(item?.createdAt)}
            </p>
            <p className="text-[#687588] text-xs font-normal">
              Last Updated: {formatDateTime(item?.updatedAt)}
            </p>
          </div>
          <Badge
            variant={item?.status ? "success" : "destructive"}
            className="py-1 px-4 font-semibold rounded-[8px]"
          >
            {item?.status ? "ACTIVE" : "INACTIVE"}
          </Badge>
          {showToggle && (
            <Switch
              checked={item?.status}
              onCheckedChange={handleUpdateManufacturerStatus}
              disabled={loading}
            />
          )}
        </div>
        <div className="flex justify-between items-center">
          <h5 className="mb-2.5 font-bold text-xl text-[#111827]">
            {item?.total || 0} Product(s)
          </h5>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierManagementCard;
