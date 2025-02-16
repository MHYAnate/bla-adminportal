import { ReactNode } from "react";

export type CellValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined
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
}

export interface AdminsData extends DataItem {
  id: string | number;
  name: string;
  role: string;
  description: string;
  date: string;
  status: string;
  rolecount: number;
}

export interface ReportsData extends DataItem {
  name: string;
  customertype: string;
  totalsales: number | string;
  aov: number | string;
  ordercount: number;
  email: string;
  id?: string | number;
}

export interface OrdersData extends DataItem {
  name: string;
  customertype: string;
  orderid: string;
  status: string;
  amount: number | string;
  id?: string | number;
  email: string;
}

export interface ProductData extends DataItem {
  productname: string;
  id?: string | number;
  price: number | string;
  quantity: number;
  productid: string;
  status: string;
}

export interface IReportCard {
  description: string;
  value: number | string;
  isProgressive: boolean;
  icon: ReactNode;
  count: number;
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
