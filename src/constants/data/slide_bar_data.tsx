import {
  FaUsers,
  FaClipboardList,
  FaBox,
  FaStream,
  FaLayerGroup,
  FaImage,
  FaThList,
  FaListAlt,
  FaSignOutAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { routed } from "../navigation/routed";

export const slideBarData = [
  {
    title: "User Management",
    items: [
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
        label: "Products",
        href: `/${routed.productManagement}/${routed.product}`,
        icon: <FaBox />,
      },
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
        label: "Attributes",
        href: `/${routed.productManagement}/${routed.attribute}`,
        icon: <FaStream />, // New icon for attributes
      },
      {
        label: "Attribute Values",
        href: `/${routed.productManagement}/${routed.attributeValue}`,
        icon: <FaLayerGroup />, // New icon for attribute values
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
