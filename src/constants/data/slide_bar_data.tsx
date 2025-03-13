import {
  FaUsers,
  FaClipboardList,
  FaBox,
  FaStream,
  FaImage,
  FaThList,
  FaListAlt,
  FaSignOutAlt,
  FaInfoCircle,
  FaTags,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { routed } from "../navigation/routed";

export const slideBarData = [
  {
    title: "User Management",
    items: [
      {
        label: "Dashboard",
        href: `/${routed.userManagement}/${routed.dashboard}`,
        icon: <MdDashboard />,
      },
      {
        label: "User Listing",
        href: `/${routed.userManagement}/${routed.allUser}`,
        icon: <FaUsers />,
      },
      {
        label: "Activity Log",
        href: `/${routed.userManagement}/${routed.activityLog}`,
        icon: <FaClipboardList />,
      },
    ],
  },
  {
    title: "Product Management",
    items: [
      {
        label: "Categories",
        href: `/${routed.productManagement}/${routed.category}`,
        icon: <FaThList />, // Distinct icon for categories
      },
      {
        label: "Subcategories",
        href: `/${routed.productManagement}/${routed.subCategory}`,
        icon: <FaListAlt />, // Distinct icon for subcategories
      },
      {
        label: "Products",
        href: `/${routed.productManagement}/${routed.product}`,
        icon: <FaBox />,
      },
      {
        label: "Products Promotion",
        href: `/${routed.productManagement}/${routed.productPromotion}`,
        icon: <FaTags />, // Or use FaGift, FaBullhorn, or FaPercent
      },
    ],
  },
  {
    title: "Order Management",
    items: [
      {
        label: "Order Listing",
        href: `/${routed.orderManagement}/${routed.allOrder}`,
        icon: <FaClipboardList />,
      },
    ],
  },
  {
    title: "Event Management",
    items: [
      {
        label: "Banners",
        href: `/${routed.eventManagement}/${routed.banner}`,
        icon: <FaImage />, // New icon for banners
      },
    ],
  },
  {
    title: "Other",
    items: [
      {
        label: "About Us",
        href: `/${routed.userManagement}/${routed.aboutUs}`,
        icon: <FaInfoCircle />,
      },
      {
        label: "Logout",
        href: "/logout",
        icon: <FaSignOutAlt />,
      },
    ],
  },
];
