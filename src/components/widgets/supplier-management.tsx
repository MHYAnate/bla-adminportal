import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { HorizontalDots, MailIcon, PhoneIcon } from "../../../public/icons";
import { Badge } from "../ui/badge";
import { ISupplierCard } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { Switch } from "../ui/switch";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface iProps {
  item: any;
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
  showToggle,
  showOptions,
  setTab,
  setOpen,
  loading,
}) => {
  // Local state to handle optimistic updates
  const [localStatus, setLocalStatus] = useState(item?.status);

  const handleToggle = async () => {
    if (handleUpdateManufacturerStatus) {
      // Optimistic update
      setLocalStatus(!localStatus);

      try {
        await handleUpdateManufacturerStatus();
      } catch (error) {
        // Revert on error
        setLocalStatus(localStatus);
      }
    }
  };

  return (
    <Card className="relative h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between mb-6">
          <div className="w-[146px] h-[76px] relative overflow-hidden rounded-lg border bg-gray-50 flex items-center justify-center">
            <Image
              width={146}
              height={76}
              alt="Supplier image"
              src={item?.logo && item.logo.includes("res.cloudinary.com") ? item.logo : "/images/bladmin-login.jpg"}
              className="object-contain w-full h-full"
              priority={false}
            />
          </div>

          {showOptions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="h-auto cursor-pointer">
                <div className="p-2">
                  <span className="sr-only">Open menu</span>
                  <HorizontalDots />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-50">
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

        <div className="flex-grow">
          <div className="flex justify-between text-[#111827] mb-6 items-start">
            <div className="flex-1 min-w-0">
              <h5 className="mb-2.5 font-bold text-xl text-[#111827] truncate">
                {item?.name}
              </h5>
              <div className="flex gap-2 mb-2.5 text-sm items-center">
                <MailIcon />
                <p className="truncate text-sm">{item?.email || "----"}</p>
              </div>
              <div className="flex gap-2 mb-2.5 text-sm items-center">
                <PhoneIcon />
                <p className="truncate text-sm">{item?.phone || "----"}</p>
              </div>
              <p className="text-[#687588] mb-2 text-xs font-normal">
                Country: {item?.country || "----"}
              </p>
              <p className="text-[#687588] mb-2 text-xs font-normal">
                Date Joined: {formatDateTime(item?.createdAt)}
              </p>
              <p className="text-[#687588] text-xs font-normal">
                Last Updated: {formatDateTime(item?.updatedAt)}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2 ml-4">
              <Badge
                variant={localStatus ? "success" : "destructive"}
                className="py-1 px-3 font-semibold rounded-lg text-xs"
              >
                {localStatus ? "ACTIVE" : "INACTIVE"}
              </Badge>
              {showToggle && (
                <Switch
                  checked={localStatus}
                  onCheckedChange={handleToggle}
                  disabled={loading}
                />
              )}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t">
          <h5 className="font-bold text-lg text-[#111827]">
            {item?._count?.products || 0} Product(s)
          </h5>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierManagementCard;