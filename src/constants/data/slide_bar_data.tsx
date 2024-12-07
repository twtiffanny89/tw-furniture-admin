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
        label: "Position",
        href: "/login",
        icon: <FaCog />, // Add an icon
      },
      {
        label: "User Management",
        href: "/user-management",
        icon: <MdGroup />, // Add an icon
      },
      {
        label: "User Request",
        href: "/user-request",
        icon: <MdPersonAdd />, // Add an icon
      },
      {
        label: "Cash Management",
        href: "/cash-management",
        icon: <FaMoneyBillWave />, // Add an icon
      },
      {
        label: "Cash Report",
        href: "/cash-report",
        icon: <FaFileInvoiceDollar />,
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
