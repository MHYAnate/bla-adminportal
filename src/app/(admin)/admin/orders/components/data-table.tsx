"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ProductTableComponent } from "@/components/custom-table/productIndex";
import { formatMoney } from "@/lib/utils";
import { useMemo, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Eye, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUpdateOrderStatus } from "@/services/orders";

interface DataTableProps {
  data: any[];
  currentPage: number;
  onPageChange: (value: number) => void;
  pageSize: number;
  totalPages: number;
  setPageSize: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  currentPage,
  onPageChange,
  pageSize,
  totalPages,
  setPageSize,
  loading,
}) => {
  const router = useRouter();
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Hook for updating order status
  const updateOrderStatusMutation = useUpdateOrderStatus();

  // Map backend status to frontend status
  const mapStatusToFrontend = useCallback((backendStatus: string): string => {
    switch (backendStatus?.toLowerCase()) {
      case 'pending':
      case 'processing':
      case 'shipped':
      case 'confirmed':
        return 'ongoing';
      case 'delivered':
      case 'completed':
        return 'delivered';
      case 'cancelled':
      case 'refunded':
        return 'cancelled';
      default:
        return 'ongoing';
    }
  }, []);

  // Map frontend status to backend status
  const mapStatusToBackend = useCallback((frontendStatus: string): string => {
    switch (frontendStatus) {
      case 'ongoing':
        return 'processing';
      case 'delivered':
        return 'delivered';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'processing';
    }
  }, []);

  // Handle status change
  const handleStatusChange = useCallback(async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);

      await updateOrderStatusMutation.mutateAsync({
        orderId,
        status: mapStatusToBackend(newStatus),
        notes: `Status updated to ${newStatus}`,
      });

      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  }, [updateOrderStatusMutation, mapStatusToBackend]);

  // Handle view order details - navigate to separate page
  const handleViewOrder = useCallback((orderId: string) => {
    router.push(`/admin/orders/${orderId}`);
  }, [router]);

  // Memoize cell renderers to prevent unnecessary re-renders
  const cellRenderers = useMemo(() => ({
    customerName: (item: any) => (
      <div className="font-medium flex items-center gap-3">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100">
          <Image
            src={item?.customer?.profileImage || item?.user?.profile?.profileImage || "/images/placeholder-user.png"}
            width={36}
            height={36}
            alt="Customer avatar"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/placeholder-user.png";
            }}
          />
        </div>
        <div>
          <p className="font-medium">
            {item?.customer?.name ||
              item?.user?.profile?.fullName ||
              item?.user?.businessProfile?.businessName ||
              item?.user?.email ||
              "Unknown Customer"}
          </p>
          <p className="font-normal text-[0.75rem] text-[#A0AEC0]">
            {item?.customer?.email || item?.user?.email || "No email"}
          </p>
        </div>
      </div>
    ),
    customerType: (item: any) => (
      <div className="font-medium">
        <p className="capitalize">
          {item?.customer?.type || item?.user?.type || "Individual"}
        </p>
        <p className="font-normal text-[0.75rem] text-[#A0AEC0]">
          {item?.paymentStatus || "Unknown"}
        </p>
      </div>
    ),
    amount: (item: any) => (
      <div className="font-medium">
        {formatMoney(Number(item?.totalPrice) || Number(item?.amount) || 0)}
      </div>
    ),
    productName: (item: any) => {
      // Handle multiple items in order
      const firstItem = Array.isArray(item?.items) ? item.items[0] : item;
      const totalItems = Array.isArray(item?.items) ? item.items.length : 1;

      return (
        <div className="font-medium flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={firstItem?.product?.image || firstItem?.image || "/images/placeholder-product.png"}
              width={36}
              height={36}
              alt="Product image"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/placeholder-product.png";
              }}
            />
          </div>
          <div>
            <p className="font-medium">
              {firstItem?.product?.name || firstItem?.productName || "Unknown Product"}
              {totalItems > 1 && ` (+${totalItems - 1} more)`}
            </p>
            <p className="font-normal text-[0.75rem] text-[#A0AEC0]">
              {firstItem?.product?.manufacturer?.name || firstItem?.brand || "No Brand"}
            </p>
          </div>
        </div>
      );
    },
    orderId: (item: any) => (
      <div className="font-medium text-gray-600">
        #{item?.orderId || item?.id || 'N/A'}
      </div>
    ),
    status: (item: any) => {
      const frontendStatus = mapStatusToFrontend(item?.status || 'ongoing');
      const isUpdating = updatingOrderId === (item?.id || item?.orderId);

      const getVariant = (status: string) => {
        switch (status) {
          case 'delivered':
            return 'success';
          case 'ongoing':
            return 'warning';
          case 'cancelled':
            return 'destructive';
          default:
            return 'secondary';
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto p-0 hover:bg-transparent"
              disabled={isUpdating}
            >
              <div className="flex items-center gap-2">
                <Badge
                  variant={getVariant(frontendStatus)}
                  className="capitalize"
                >
                  {isUpdating ? 'Updating...' : frontendStatus}
                </Badge>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleStatusChange(item?.id || item?.orderId, 'ongoing')}
              disabled={frontendStatus === 'ongoing' || isUpdating}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                Ongoing
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(item?.id || item?.orderId, 'delivered')}
              disabled={frontendStatus === 'delivered' || isUpdating}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Delivered
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(item?.id || item?.orderId, 'cancelled')}
              disabled={frontendStatus === 'cancelled' || isUpdating}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                Cancelled
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    actions: (item: any) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewOrder(item?.id || item?.orderId)}
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/admin/orders/${item?.id || item?.orderId}/edit`)}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // Handle delete - you can implement this
            toast.info("Delete functionality to be implemented");
          }}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
  }), [mapStatusToFrontend, updatingOrderId, handleStatusChange, handleViewOrder, router]);

  // Memoize column configuration
  const columnOrder: (keyof any)[] = useMemo(() => [
    "customerName",
    "customerType",
    "amount",
    "productName",
    "orderId",
    "status",
    "actions",
  ], []);

  const columnLabels = useMemo(() => ({
    customerName: "Name",
    customerType: "Customer",
    amount: "Amount",
    productName: "Product Name",
    orderId: "Order ID",
    status: "Order Status",
    actions: "Action",
  }), []);

  // Memoize processed data
  const processedData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.map((item, index) => ({
      ...item,
      id: item.id || item.orderId || `order-${index}`,
      // Ensure required fields exist
      customer: item.customer || item.user || {},
      totalPrice: item.totalPrice || item.amount || 0,
      status: item.status || 'ongoing',
      items: Array.isArray(item.items) ? item.items : [item],
    }));
  }, [data]);

  if (loading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {processedData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No orders found</p>
          </div>
        ) : (
          <ProductTableComponent<any>
            tableData={processedData}
            currentPage={currentPage}
            onPageChange={onPageChange}
            totalPages={totalPages}
            cellRenderers={cellRenderers}
            columnOrder={columnOrder}
            columnLabels={columnLabels}
            isLoading={loading}
            showPagination={processedData.length > 0}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default DataTable;