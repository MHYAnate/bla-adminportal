import {
  FinancialReportIcon,
  InventoryManagementIcon,
  OrderIcon,
  ProductIcon,
  ReportIcon,
  StoreManagementIcon,
  UserIcon,
} from "../../public/icons";
import { ROUTES } from "./routes";

export const adminSidebarList = [
  {
    id: 1,
    sidebar: "Admin Management",
    icon: <UserIcon />,
    child: [
      {
        sidebar: "Admins",
        href: ROUTES.ADMIN.SIDEBAR.ADMINS,
      },
      {
        sidebar: "Roles and  Permissions",
        href: ROUTES.ADMIN.SIDEBAR.ROLES,
      },
      // {
      //   sidebar: "Permissions",
      //   href: ROUTES.ADMIN.SIDEBAR.PERMISSIONS,
      // },
    ],
  },
  {
    id: 2,
    sidebar: "Customers",
    icon: <UserIcon />,
    href: ROUTES.ADMIN.SIDEBAR.CUSTOMERS,
  },
  {
    id: 3,
    sidebar: "Products",
    href: ROUTES.ADMIN.SIDEBAR.PRODUCTS,
    icon: <ProductIcon />,
  },
  {
    id: 4,
    sidebar: "Manufacturers ",
    icon: <UserIcon />,
    href: ROUTES.ADMIN.SIDEBAR.MANUFACTURERS,
  },
  {
    id: 5,
    sidebar: "Orders",
    icon: <OrderIcon />,
    href: ROUTES.ADMIN.SIDEBAR.ORDERS,
  },
  {
    id: 6,
    sidebar: "Reports",
    icon: <ReportIcon />,
    child: [
      {
        sidebar: "Customer report",
        href: ROUTES.ADMIN.SIDEBAR.CUSTOMERSREPORTS,
      },
      {
        sidebar: "Business report",
        href: ROUTES.ADMIN.SIDEBAR.BUSINNESREPORTS,
      },
    ],
  },
  {
    id: 7,
    sidebar: "Inventory Management",
    icon: <InventoryManagementIcon />,
    href: ROUTES.ADMIN.SIDEBAR.INVEMTORYMANAGEMENT,
  },
  {
    id: 8,
    sidebar: "Financial and Transaction Reports",
    icon: <FinancialReportIcon />,
    // href: ROUTES.ADMIN.SIDEBAR.FINANCIALREPORTS,
    child: [
      {
        sidebar: "Financial Report",
        href: ROUTES.ADMIN.SIDEBAR.FINANCIALREPORTS,
      },
      {
        sidebar: "Transaction Report",
        href: ROUTES.ADMIN.SIDEBAR.TRANSACTIONMANAGEMENT,
      },
    ],
  },
  {
    id: 9,
    sidebar: "Support & Feedback",
    icon: <UserIcon />,
    child: [
      {
        sidebar: "Feedback",
        href: ROUTES.ADMIN.SIDEBAR.FEEDBACK,
      },
      {
        sidebar: "Support",
        href: ROUTES.ADMIN.SIDEBAR.SUPPORT,
      },
    ],
  },
  // {
  //   id: 9,
  //   sidebar: "Settings & logout",
  //   icon: <InventoryManagementIcon />,
  //   child: [
  //     {
  //       sidebar: "Settings",
  //       href: ROUTES.ADMIN.SIDEBAR.FEEDBACK,
  //     },
  //     {
  //       sidebar: "logout",
  //       href: ROUTES.ADMIN.SIDEBAR.SUPPORT,
  //     },
  //   ],
  // },
    // {
  //   id: 9,
  //   sidebar: "Transaction Management",
  //   icon: <FinancialReportIcon />,
  //   href: ROUTES.ADMIN.SIDEBAR.TRANSACTIONMANAGEMENT,
  // },
  // {
  //   id: 11,
  //   sidebar: "Supply Management",
  //   icon: <StoreManagementIcon />,
  //   child: [
  //     {
  //       sidebar: "Manufacturers",
  //       href: ROUTES.ADMIN.SIDEBAR.SUPPLYMANAGEMENTMANUFACTURERS,
  //     },
  //     {
  //       sidebar: "Vendors",
  //       href: ROUTES.ADMIN.SIDEBAR.SUPPLYMANAGEMENTVENDORS,
  //     },
  //   ],
  // },
  // {
  //   id: 6,
  //   sidebar: "Store Management",
  //   icon: <StoreManagementIcon />,
  //   href: ROUTES.ADMIN.SIDEBAR.STOREMANAGEMENT,
  // },
  
];

export const productTypeList = [
  {
    text: "Platform",
    value: "platform",
  },
  {
    text: "Service",
    value: "service",
  },
];