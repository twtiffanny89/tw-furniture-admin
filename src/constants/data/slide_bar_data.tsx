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
      {
        label: "About us",
        href: `/${routed.userManagement}/${routed.aboutUs}`,
        icon: <FaCog />, // Add an icon
      },
    ],
  },
  {
    title: "Product Management",
    items: [
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
        label: "Logout",
        href: "/logout",
        icon: <FaSignOutAlt />,
      },
    ],
  },
];
