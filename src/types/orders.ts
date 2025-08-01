// types/orders.ts
export interface OrderStatusUpdateParams {
  orderId: string;
  status: string;
  notes: string;
  trackingNumber?: string;
  carrier?: string;
}

export interface BulkOrderStatusUpdateParams {
  orderIds: string[];
  status: string;
  notes: string;
}

export interface CancelOrderParams {
  orderId: string;
  reason: string;
}

export interface ShipOrderParams {
  orderId: string;
  trackingNumber: string;
  carrier: string;
}

export interface ProcessRefundParams {
  orderId: string;
  amount: number;
  reason: string;
}

export interface OrderNoteParams {
  orderId: string;
  content: string;
  type?: string;
  isInternal?: boolean;
}

export interface ArchiveOrderParams {
  orderId: string;
  reason: string;
}

export interface BulkArchiveParams {
  olderThanDays: number;
  reason: string;
}

export interface OrderAnalyticsFilters {
  timeframe?: string;
  enabled?: boolean;
}

export interface ArchivedOrdersFilters {
  page?: number;
  limit?: number;
  enabled?: boolean;
}