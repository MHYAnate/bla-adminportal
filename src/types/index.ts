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
export interface CustomersData extends DataItem {
  id?: string | number;
  customername: string;
  customertype: string;
  customerid: string;
  customerstatus: string;
  kyc: string;
  email?: string;
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

export interface ManufacturerData extends DataItem {
  productname: string;
  id?: string | number;
  category: string;
  stocklevel: number;
  skuid: string;
  amount: string | number;
  status: string;
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
  isActive: boolean;
  url: string;
  total: string | number;
  status: string;
  name: string;
  email: string;
  location: string;
  id: string;
  phonenumber: string;
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
