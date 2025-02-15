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
