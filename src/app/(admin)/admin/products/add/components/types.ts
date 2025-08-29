export type ProfitType = 'MARKUP' | 'COMMISSION';

export interface BaseProductOption {
  id?: number;
  value: string;
  inventory: number;
  weight: number;
  unit: string;
  image?: string[];
  imageFiles?: File[];
  newImages?: File[];
  profitType: ProfitType;
}

export interface MarkupProductOption extends BaseProductOption {
  profitType: 'MARKUP';
  stockPrice: number;
  retailPrice: number;
  discountType: 'NONE' | 'PERCENTAGE' | 'FIXED';
  bulkDiscount: number;
  minimumBulkQuantity: number;
}

export interface CommissionProductOption extends BaseProductOption {
  profitType: 'COMMISSION';
  supplierPrice: number;
  commissionRate: number;
}

export type ProductOption = MarkupProductOption | CommissionProductOption;

export interface CreateProductPayload {
  name: string;
  shortDescription?: string;
  description: string;
  processingTimeDays: number;
  minDeliveryDays: number;
  maxDeliveryDays: number;
  includeSaturdays: boolean;
  acceptsReturns: boolean;
  categoryId: string;
  manufacturerId: string;
  options: ProductOption[];
  type: string;
}