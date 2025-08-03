// types/orders.d.ts
import { UseMutationResult } from '@tanstack/react-query';

declare module '@/services/orders' {
  interface RefundRequest {
    orderId: string;
    amount: number;
    reason: string;
    refundType: 'full' | 'partial';
  }

  export const useProcessRefund: () => UseMutationResult<
    any,
    Error,
    RefundRequest
  >;
}