"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { IOrderItem } from "@/types";

// Extend IOrderItem to include view handler
interface ExtendedIOrderItem extends IOrderItem {
  productId?: string;
  onView?: () => void;
}

interface OrderItemCardProps {
  item: ExtendedIOrderItem;
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({ item }) => {
  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
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
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Product Image */}
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={item.image || "/images/placeholder-product.png"}
            width={64}
            height={64}
            alt={item.productName || "Product"}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/placeholder-product.png";
            }}
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 text-sm mb-1 truncate">
                {item.productName || "Unknown Product"}
              </h4>
              <p className="text-xs text-gray-500 mb-1">
                {item.category || "No Category"} • {item.brand || "No Brand"}
              </p>
              {item.productId && (
                <p className="text-xs text-gray-400">
                  ID: #{item.productId}
                </p>
              )}
            </div>

            {/* Status Badge */}
            <Badge
              variant={getStatusVariant(item.status || 'ongoing')}
              className="text-xs ml-2"
            >
              {item.status?.toUpperCase() || 'ONGOING'}
            </Badge>
          </div>

          {/* Price and Quantity Info */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
            <div>
              <p className="text-gray-500">Unit Price</p>
              <p className="font-semibold text-gray-800">
                ₦{typeof item.price === 'string' ? item.price : item.price?.toLocaleString() || '0'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Quantity</p>
              <p className="font-semibold text-gray-800">{item.quantity || 0}</p>
            </div>
            <div>
              <p className="text-gray-500">Total</p>
              <p className="font-semibold text-gray-800">
                ₦{typeof item.total === 'string' ? item.total : item.total?.toLocaleString() || '0'}
              </p>
            </div>
          </div>

          {/* Action Button */}
          {item.onView && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={item.onView}
                className="flex items-center gap-2 text-xs"
              >
                <Eye className="w-3 h-3" />
                View Tracking
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderItemCard;