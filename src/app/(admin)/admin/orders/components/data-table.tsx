"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ProductTableComponent } from "@/components/custom-table/productIndex";
import { formatMoney } from "@/lib/utils";
import { useMemo, useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import httpService from "@/services/httpService";
import { routes } from "@/services/api-routes";

interface DataTableProps {
  data: any[];
  currentPage: number;
  onPageChange: (value: number) => void;
  pageSize: number;
  totalPages: number;
  setPageSize: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  mapStatusToFrontend: (status: string) => string;
  onRefreshData: () => void;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  currentPage,
  onPageChange,
  pageSize,
  totalPages,
  setPageSize,
  loading,
  mapStatusToFrontend,
  onRefreshData,
}) => {
  const router = useRouter();
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // FIXED: Handle status change with proper API call
  const handleStatusChange = useCallback(async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);

      const mapStatusForUpdate = (status: string): string => {
        switch (status.toLowerCase()) {
          case 'ongoing':
            return 'PROCESSING';
          case 'delivered':
            return 'DELIVERED';
          case 'cancelled':
            return 'CANCELLED';
          default:
            return 'PROCESSING';
        }
      };

      const backendStatus = mapStatusForUpdate(newStatus);

      console.log(`Updating order ${orderId} status to:`, {
        frontendStatus: newStatus,
        backendStatus: backendStatus
      });

      // ✅ FIXED: Use patchData instead of putData
      const response = await httpService.patchData(
        { status: backendStatus },
        routes.updateOrderStatus(orderId)
      );

      console.log('Status update response:', response);
      toast.success(`Order status updated to ${newStatus}`);

      if (onRefreshData) {
        onRefreshData();
      }

    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  }, [onRefreshData]);

  // FIXED: Handle view order details with proper ID extraction
  const handleViewOrder = useCallback((orderId: string) => {
    if (!orderId) {
      toast.error("Invalid order ID");
      return;
    }

    console.log('Navigating to order details with ID:', orderId);
    console.log('Full navigation path:', `/admin/orders/${orderId}`);

    // Test the navigation
    router.push(`/admin/orders/${orderId}`);

    // Add this to verify the navigation attempt
    console.log('Navigation command executed');
  }, [router]);

  // Memoize cell renderers to prevent unnecessary re-renders
  const cellRenderers = useMemo(() => ({
    customerName: (item: any) => {
      const customer = item?.customer || item?.user;
      const profileImage = customer?.profileImage || customer?.profile?.profileImage;
      const name = customer?.name ||
        customer?.profile?.fullName ||
        customer?.businessProfile?.businessName ||
        "Unknown Customer";
      const email = customer?.email || "No email";

      return (
        <div className="font-medium flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={profileImage || "/images/placeholder-user.png"}
              width={36}
              height={36}
              alt="Customer avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/placeholder-user.png";
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-900 truncate" title={name}>
              {name}
            </p>
            <p className="font-normal text-[0.75rem] text-[#A0AEC0] truncate" title={email}>
              {email}
            </p>
          </div>
        </div>
      );
    },

    customerType: (item: any) => {
      const customer = item?.customer || item?.user;
      const type = customer?.type || "individual";
      const paymentStatus = item?.paymentStatus || "pending";

      return (
        <div className="font-medium">
          <p className="capitalize text-gray-900">
            {type}
          </p>
          <p className="font-normal text-[0.75rem] text-[#A0AEC0] capitalize">
            {paymentStatus}
          </p>
        </div>
      );
    },

    amount: (item: any) => {
      const amount = Number(item?.totalPrice) || Number(item?.amount) || 0;
      return (
        <div className="font-medium text-gray-900">
          {formatMoney(amount)}
        </div>
      );
    },

    productName: (item: any) => {
      // Handle multiple items in order
      const items = Array.isArray(item?.items) ? item.items : [item];
      const firstItem = items[0] || {};
      const totalItems = items.length;

      const product = firstItem?.product || firstItem;
      const productImage = product?.image || product?.images?.[0] || "/images/placeholder-product.png";
      const productName = product?.name || product?.productName || "Unknown Product";
      const brand = product?.manufacturer?.name || product?.brand || "No Brand";

      return (
        <div className="font-medium flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={productImage}
              width={36}
              height={36}
              alt="Product image"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/placeholder-product.png";
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-900 truncate" title={productName}>
              {productName}
              {totalItems > 1 && (
                <span className="ml-1 text-sm text-gray-500">
                  (+{totalItems - 1} more)
                </span>
              )}
            </p>
            <p className="font-normal text-[0.75rem] text-[#A0AEC0] truncate" title={brand}>
              {brand}
            </p>
          </div>
        </div>
      );
    },

    orderId: (item: any) => {
      const orderId = item?.orderId || item?.id || 'N/A';
      return (
        <div className="font-medium text-gray-600">
          #{orderId}
        </div>
      );
    },

    status: (item: any) => {
      const backendStatus = item?.status || 'pending';
      const frontendStatus = mapStatusToFrontend(backendStatus);
      const orderId = item?.id || item?.orderId;
      const isUpdating = updatingOrderId === orderId;

      const getVariant = (status: string) => {
        switch (status) {
          case 'delivered':
            return 'default' as const;
          case 'ongoing':
            return 'secondary' as const;
          case 'cancelled':
            return 'destructive' as const;
          default:
            return 'secondary' as const;
        }
      };

      const getBadgeColor = (status: string) => {
        switch (status) {
          case 'delivered':
            return 'bg-green-100 text-green-800 hover:bg-green-200';
          case 'ongoing':
            return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
          case 'cancelled':
            return 'bg-red-100 text-red-800 hover:bg-red-200';
          default:
            return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
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
                  className={`capitalize ${getBadgeColor(frontendStatus)}`}
                >
                  {isUpdating ? 'Updating...' : frontendStatus}
                </Badge>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleStatusChange(orderId, 'ongoing')}
              disabled={frontendStatus === 'ongoing' || isUpdating}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                Ongoing
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(orderId, 'delivered')}
              disabled={frontendStatus === 'delivered' || isUpdating}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Delivered
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(orderId, 'cancelled')}
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

    // FIXED: Only show View button with proper ID handling
    actions: (item: any) => {
      // FIXED: Get the correct order ID
      const orderId = item?.id || item?.orderId;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log('View button clicked for order:', orderId, 'Full item:', item);
              handleViewOrder(orderId);
            }}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-1"
            title="View Order Details"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">View</span>
          </Button>
        </div>
      );
    },
  }), [mapStatusToFrontend, updatingOrderId, handleStatusChange, handleViewOrder]);

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
    customerName: "Customer",
    customerType: "Type",
    amount: "Amount",
    productName: "Product",
    orderId: "Order ID",
    status: "Status",
    actions: "Actions",
  }), []);

  // Memoize processed data
  const processedData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.map((item, index) => {
      // FIXED: Ensure we have a valid ID and log for debugging
      const id = item.id || item.orderId || `order-${index}`;

      console.log(`Processing item ${index}:`, {
        originalId: item.id,
        orderId: item.orderId,
        finalId: id,
        status: item.status
      });

      return {
        ...item,
        id,
        // Normalize data structure
        customer: item.customer || item.user || {},
        totalPrice: item.totalPrice || item.amount || 0,
        status: item.status || 'pending',
        items: Array.isArray(item.items) ? item.items : [item],
        // Add computed fields
        displayName: item.customer?.name ||
          item.user?.profile?.fullName ||
          item.user?.businessProfile?.businessName ||
          "Unknown Customer",
        displayEmail: item.customer?.email || item.user?.email || "No email",
      };
    });
  }, [data]);

  // Debug processed data
  useEffect(() => {
    if (processedData.length > 0) {
      console.log('DataTable processed data:', {
        count: processedData.length,
        sampleItem: processedData[0],
        allIds: processedData.map(item => item.id)
      });
    }
  }, [processedData]);

  // Loading state
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
          <div className="mt-4 flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (processedData.length === 0) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-4">
              No orders match your current filters. Try adjusting your search criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                window.location.reload();
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
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
      </CardContent>
    </Card>
  );
};

export default DataTable;