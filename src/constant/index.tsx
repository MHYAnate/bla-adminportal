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
        sidebar: "Roles and Permissions",
        href: ROUTES.ADMIN.SIDEBAR.ROLES,
      },
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
    isCollapsible: true,
    child: [
      {
        sidebar: "Products Dashboard",
        href: ROUTES.ADMIN.SIDEBAR.PRODUCTS,
      },
      {
        sidebar: "Product Categories",
        href: ROUTES.ADMIN.SIDEBAR.CATEGORIES,
      },
    ],
  },
  {
    id: 4,
    sidebar: "Manufacturers",
    icon: <UserIcon />,
    href: ROUTES.ADMIN.SIDEBAR.MANUFACTURERS,
  },
  {
    id: 5,
    sidebar: "Orders",
    icon: <OrderIcon />,
    href: ROUTES.ADMIN.SIDEBAR.ORDERS,
    isCollapsible: true,
    subItems: [
      {
        id: 5.1,
        sidebar: "Delivered",
        href: `${ROUTES.ADMIN.SIDEBAR.ORDERS}?status=delivered`,
      },
      {
        id: 5.2,
        sidebar: "Ongoing",
        href: `${ROUTES.ADMIN.SIDEBAR.ORDERS}?status=ongoing`,
      },
      {
        id: 5.3,
        sidebar: "Cancelled",
        href: `${ROUTES.ADMIN.SIDEBAR.ORDERS}?status=cancelled`,
      }
    ]
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
      // {
      //   sidebar: "Business report",
      //   href: ROUTES.ADMIN.SIDEBAR.BUSINNESREPORTS,
      // },
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

export const productFilterList = [
  // Stock Status Filters
  {
    text: "All Products",
    value: "all",
    category: "stock"
  },
  // {
  //   text: "In Stock",
  //   value: "in_stock",
  //   category: "stock"
  // },
  // {
  //   text: "Low Stock",
  //   value: "low_stock",
  //   category: "stock"
  // },
  {
    text: "Out of Stock",
    value: "out_of_stock",
    category: "stock"
  },


  // Status Filters
  {
    text: "Active Products",
    value: "active",
    category: "status"
  },
  {
    text: "Inactive Products",
    value: "inactive",
    category: "status"
  },

  // Pricing Filters
  {
    text: "Has Bulk Pricing",
    value: "has_bulk_pricing",
    category: "pricing"
  },
  {
    text: "No Bulk Pricing",
    value: "no_bulk_pricing",
    category: "pricing"
  },
  {
    text: "High Value (>₦50,000)",
    value: "high_value",
    category: "pricing"
  },
  {
    text: "Mid Value (₦10,000-₦50,000)",
    value: "mid_value",
    category: "pricing"
  },
  {
    text: "Low Value (<₦10,000)",
    value: "low_value",
    category: "pricing"
  },

  // Performance Filters
  // {
  //   text: "Best Sellers",
  //   value: "best_sellers",
  //   category: "performance"
  // },
  {
    text: "New Products (Last 30 Days)",
    value: "new_products",
    category: "performance"
  },
  {
    text: "Recently Updated",
    value: "recently_updated",
    category: "performance"
  },

  // Returns & Delivery
  {
    text: "Accepts Returns",
    value: "accepts_returns",
    category: "policy"
  },
  {
    text: "Fast Delivery (1-3 Days)",
    value: "fast_delivery",
    category: "policy"
  },
  {
    text: "Standard Delivery (4-7 Days)",
    value: "standard_delivery",
    category: "policy"
  }
];