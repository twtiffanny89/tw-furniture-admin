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
        label: "All user",
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
    title: "OTHER",
    items: [
      {
        label: "Profile",
        href: "/profile",
        icon: <FaUserCircle />,
      },
      {
        label: "Logout",
        href: "/logout",
        icon: <FaSignOutAlt />,
      },
    ],
  },
];
