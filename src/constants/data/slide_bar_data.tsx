import {
  FaHome,
  FaMoneyBillWave,
  FaCog,
  FaUserCircle,
  FaSignOutAlt,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { MdGroup, MdPersonAdd } from "react-icons/md";
import { routed } from "../navigation/routed";

export const slideBarData = [
  {
    title: "User Management",
    items: [
      {
        label: "User listing",
        href: `/${routed.userManagement}/${routed.allUser}`,
        icon: <FaHome />, // Add an icon
      },
      {
        label: "Activity log",
        href: `/${routed.userManagement}/${routed.activityLog}`,
        icon: <FaCog />, // Add an icon
      },
    ],
  },
  {
    title: "Product Management",
    items: [
      {
        label: "Product",
        href: `/${routed.productManagement}/${routed.product}`,
        icon: <FaHome />, // Add an icon
      },
      {
        label: "Category",
        href: `/${routed.productManagement}/${routed.category}`,
        icon: <FaHome />, // Add an icon
      },
      {
        label: "Sub category",
        href: `/${routed.productManagement}/${routed.subCategory}`,
        icon: <FaCog />, // Add an icon
      },
      {
        label: "Attribute",
        href: `/${routed.productManagement}/${routed.attribute}`,
        icon: <FaCog />, // Add an icon
      },
      {
        label: "Sub attribute",
        href: `/${routed.productManagement}/${routed.subAttribute}`,
        icon: <FaCog />, // Add an icon
      },
    ],
  },

  {
    title: "Order Management",
    items: [
      {
        label: "Order listing",
        href: `/${routed.orderManagement}/${routed.allOrder}`,
        icon: <FaHome />, // Add an icon
      },
    ],
  },
  {
    title: "Event Management",
    items: [
      {
        label: "Banner",
        href: `/${routed.eventManagement}/${routed.banner}`,
        icon: <FaHome />, // Add an icon
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        label: "About us",
        href: `/${routed.userManagement}/${routed.aboutUs}`,
        icon: <FaCog />, // Add an
      },
      {
        label: "Logout",
        href: "/logout",
        icon: <FaSignOutAlt />,
      },
    ],
  },
];
