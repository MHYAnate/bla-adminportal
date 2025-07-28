import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { HorizontalDots, MailIcon, PhoneIcon } from "../../../public/icons";
import { Badge } from "../ui/badge";
import { ISupplierCard } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { Switch } from "../ui/switch";
import { useEffect, useState } from "react";
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
  handleUpdateManufacturerStatus?: () => Promise<void>;
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
  const [localStatus, setLocalStatus] = useState<boolean>(item?.status || false);

  // Sync local state with prop changes
  useEffect(() => {
    setLocalStatus(item?.status || false);
  }, [item?.status]);

  const handleToggle = async () => {
    if (handleUpdateManufacturerStatus) {
      const previousStatus = localStatus;

      // Optimistic update - show the change immediately
      setLocalStatus(!localStatus);

      try {
        await handleUpdateManufacturerStatus();
        // If successful, the parent component will refetch data
        // and the useEffect above will sync the state
      } catch (error) {
        // Revert to previous state on error
        setLocalStatus(previousStatus);
        console.error("Toggle failed:", error);
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
              src={
                item?.logo && item.logo.includes("res.cloudinary.com")
                  ? item.logo
                  : "/images/bladmin-login.jpg"
              }
              className="object-contain w-full h-full"
              priority={false}
            />
          </div>

          {showOptions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="h-auto cursor-pointer">
                <div className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                  <span className="sr-only">Open menu</span>
                  <HorizontalDots />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-50">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
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
                  className="cursor-pointer text-red-600 hover:text-red-700"
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
                {item?.name || "Unknown Supplier"}
              </h5>
              <div className="flex gap-2 mb-2.5 text-sm items-center">
                <MailIcon />
                <p className="truncate text-sm text-gray-600">
                  {item?.email || "----"}
                </p>
              </div>
              <div className="flex gap-2 mb-2.5 text-sm items-center">
                <PhoneIcon />
                <p className="truncate text-sm text-gray-600">
                  {item?.phone || "----"}
                </p>
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
                className={`py-1 px-3 font-semibold rounded-lg text-xs transition-colors ${localStatus
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                  }`}
              >
                {localStatus ? "ACTIVE" : "INACTIVE"}
              </Badge>
              {showToggle && (
                <div className="relative">
                  <Switch
                    checked={localStatus}
                    onCheckedChange={handleToggle}
                    disabled={loading}
                    className={`transition-opacity ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-lg text-[#111827]">
              {item?._count?.products || 0} Product{(item?._count?.products || 0) !== 1 ? 's' : ''}
            </h5>
            {(item?._count?.products || 0) > 0 && (
              <div className="text-xs text-gray-500">
                View Products →
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierManagementCard;