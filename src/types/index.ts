import React, { ReactNode } from "react";

export type CellValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined
  | object
  | ReactNode;

export interface DataItem {
  [key: string]: CellValue;
  id?: string | number;
}

export interface ITableProps<T extends DataItem> {
  tableData: T[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  statusKey?: keyof T;
  onRowClick?: (item: T) => void;
  setFilter?: React.Dispatch<React.SetStateAction<string>>;
  isLoading?: boolean;
  showPagination?: boolean;
}
// export interface IPaginationProps {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }
export interface IPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void; // Remove optional modifier
}
export interface AdminsData extends DataItem   {
  id: string | number;
  name: string;
  role: string;
  description: string;
  date: string;
  status: string;
  rolecount: number;
  action?: any;
 
  // avatar?: string;
  // roles?: string[];
  // permissions?: string[];
}

export interface AdminData  extends DataItem   {
  id:any;
  email:string;
  createdAt:any;
  status:string;
  profile:any;
  roles:{
    role:{
      id:number;
      name:string;
      discription:string;
    }
  }
  name:string;
  role:string;
  description:string;
  date:string;
  rolecount:string;
  action:any;
 

}

export interface RoleData {
  [x: string]: any;
  toLowerCase(): unknown;
  email: any;
  data:{
    name:string;
  }
  id: number;
  name: string;
  description: string;
  permissions: Array<{
    id: number;
    name: string;
  }>;
  createdAt: string;
  updatedAt: string;
  _count: {
    users: number;
  };
}



export interface CustomersData extends DataItem {
  [key: string]: string | number | undefined;
  id?: string | number;
  name: string;
  customerType: string;
  customerid: string;
  customerstatus: string;
  ststus?: string;
  kycStatus: string;
  kyc?: string;
  email?: string;
  profile?: Record<string | number, string | number> | any;
}

// export interface ReportsData extends DataItem {
//   name: string;
//   customertype: string;
//   totalsales: number | string;
//   aov: number | string;
//   ordercount: number;
//   email: string;
//   id?: string | number;
// }

// export interface ReportsData extends DataItem {
//   name: string;
//   status: string; // Changed from 'customertype'
//   totalsales: number | string;
//   aov: number | string;
//   ordercount: number;
//   email: string;
//   id?: string | number;
// }


// File: @/types/index.ts

export interface EnhancedTableProps<T extends DataItem> extends ITableProps<T> {
  // ... other props
  onPageChange: (page: number) => void; // Make required
  onPageSizeChange: (size: number) => void;
}

export type DashboardData = {
  metrics: {
    customers: MetricSummary;
    orders: MetricSummary;
    profits: MetricSummary;
    revenue: MetricSummary;
  };
  charts: {
    orderSummary: OrderSummaryItem[];
    salesPerformance: SalesPerformanceItem[];
  };
  lastUpdated: string; // ISO date string
};



type MetricSummary = {
  total: number;
  currentMonth: number;
  previousMonth: number;
  changePercentage: number;
  trend: "up" | "down";
};

type OrderSummaryItem = {
  status: "SCHEDULED" | "PROCESSING" | "PENDING"; // Extend if needed
  sales: number;
};

type SalesPerformanceItem = {
  month: string; // Format: YYYY-MM
  total_sales: number;
  orders_count: number;
};


export interface ReportsData extends DataItem {
  id: string | number;
  name: string;
  status: string;
  ordercount: number;
  totalsales: string;
  aov: string;
  email: string;
  lastOrderDate?: string;
}

export interface RegisteredReportsData extends DataItem {
  id: string | number;
  name: string;
  email: string;
  type: string;
  status: string;
  kycStatus: string;
  joinDate: string;
  role: string;
}

// types/reports.ts
export interface FinancialReport {
  customerId: string;
  name: string;
  email: string;
  type: string;
  totalSales: number;
  orderCount: number;
  aov: number;
}

export interface DashboardMetrics {
  revenue: Metric;
  sales: Metric;
  profit: Metric;
}

interface Metric {
  value: number;
  dailyChange: number;
  trend: 'up' | 'down';
}

export interface ChartData {
  month: string;
  value: number;
}
export interface OrdersData extends DataItem {
  name: string;
  customertype: string;
  orderid: string;
  status: string;
  amount: number | string;
  id?: string | number;
  email: string;
  user?: Record<string | number, string | number> | any;
}

export interface ProductData extends DataItem {
  productname: string;
  id?: string | number;
  price: number | string;
  quantity: number;
  productid?: string;
  status: string;
  product?: Record<string | number, string | number> | any;
}

export interface ManufacturerData extends DataItem {
  productname: string;
  id?: string | number;
  category: string;
  stocklevel: number;
  skuid: string;
  amount: string | number;
  status: string;
}

export interface FeedbackData extends DataItem {
  status: string;
  customerName: string;
  customerType: string;
  feedbackId: string;

  dateSubmitted: string;
}

export interface InventoryData extends DataItem {
  status: string;
  productname: string | number;
  currentStock: string | number;
  minStockLimit: string | number;
  maxStockLimit: string;
}
export interface VendorsData extends DataItem {
  status: string;
  name: string;
  contact: string;
  phonenumber: string;
  totalproducts: number | string;
  id?: number | string;
  email: string;
}

export interface StockData extends DataItem {
  id?: string;
  productname: string;
  createddate: string;
  costprice: number | string;
  sellingprice: number | string;
  change: string;
  updatedby: string;
  role: string;
  url?: string;
}

export interface IReportCard {
  description: string;
  value: number | string;
  isProgressive: boolean;
  icon: ReactNode;
  count: number;
  title: string;
}

export interface IOrderCard {
  value: number | string;
  icon: ReactNode;
  title: string;
}

export interface IOrderItem {
  productName: string;
  url?: string;
  quantity: number;
  price: number | string;
  total: number | string;
  status: string;
}

export interface ISupplierCard {
  status: boolean;
  total: string | number;
  logo: string;
  name: string;
  contactPerson: string;
  email: string;
  country: string;
  id: string | number;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderDetails {
  name: string;
  price: string | number;
  orderid: string;
  url?: string;
  date: string;
  status: string;
  id: string | number;
}

export interface IFinancialReportCard {
  description: string;
  value: number | string;
  isProgressive: boolean;
  count: number;
  title: string;
}

// Admin interfaces
// export interface AdminsData {
//   id: string | number;
//   name: string;
//   email?: string;
//   role: string;
//   description: string;
//   date: string;
//   status: string;
//   rolecount: number;
//   avatar?: string;
//   roles?: string[];
//   permissions?: string[];
// }

export interface AdminRole {
  id: number;
  name: string;
  description: string;
  permissions: Array<{
    id: number;
    name: string;
  }>;
  createdAt: string;
  updatedAt: string;
  _count: {
    users: number;
  };
}

export interface AdminPermission {
  id: number;
  name: string;
  description: string;
  category: string;
}

export interface AdminFormData {
  email: string;
  name?: string;
  roleNames: string[];
  status?: string;
}

export interface AdminInviteData {
  email: string;
  roleNames: string[];
}


// export interface AdminsData {
//   id: string | number;
//   name: string;
//   role: string;
//   description: string;
//   date: string;
//   status: string;
//   rolecount: number;
//   action?: any;
// }

// export interface RoleData {
//   id: number;
//   name: string;
//   description: string;
//   createdAt: string;
//   updatedAt: string;
//   permissions: {
//     id: number;
//     name: string;
//   }[];
//   _count: {
//     users: number;
//   };
// }

export interface Permission {
  id: number;
  name: string;
}

