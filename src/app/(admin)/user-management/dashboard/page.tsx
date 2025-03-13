// pages/index.tsx
"use client";
import { useEffect, useState } from "react";
import { getAllDashboardService } from "@/redux/action/user-management/dashboard_service";
import { useRouter } from "next/navigation";
import CenteredLoading from "@/components/loading/center_loading";

interface DashboardItem {
  title: string;
  count: number;
  icon?: string;
  link?: string;
}

const getIconForTitle = (title: string) => {
  const icons: { [key: string]: string } = {
    "Total Users": "👤",
    "Total Products": "📦",
    "Total Products on Promotion": "🏷️",
    "Total Orders Processing": "🔄",
    "Total Completed Orders": "✅",
    "Total Failed Orders": "❌",
    "Total Viewers App Today": "👁️",
    "Total Categories": "📂",
    "Total Subcategories": "📁",
  };
  return icons[title] || "❓";
};

const getLinkForTitle = (title: string) => {
  const links: { [key: string]: string } = {
    "Total Users": "/user-management/user-listing",
    "Total Products": "/product-management/product",
    "Total Products on Promotion": "/product-management/product-promotion",
    "Total Orders Processing": "/order-management/order-listing",
    "Total Completed Orders": "/order-management/order-listing",
    "Total Failed Orders": "/order-management/order-listing",
    "Total Viewers App Today": "/user-management/activity-log",
    "Total Categories": "/product-management/category",
    "Total Subcategories": "/product-management/sub-category",
  };
  return links[title] || "/";
};

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardItem[]>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const response = await getAllDashboardService(); // Adjust API endpoint

    const mappedData = response.map((item: DashboardItem) => ({
      ...item,
      icon: getIconForTitle(item.title),
      link: getLinkForTitle(item.title),
    }));

    setDashboardData(mappedData);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-wrap justify-center">
      {dashboardData.map((item, index) => (
        <div
          key={index}
          onClick={() => router.push(item.link || "/")}
          className="h-40 border border-primary min-w-[250px] bg-white m-2 flex-grow items-center justify-center flex transform transition-transform duration-300 hover:scale-105 cursor-pointer rounded"
        >
          <div className="text-center ">
            <div className="text-black mb-2 flex items-center justify-center flex-col">
              <span className="text-4xl mb-2 text-black">{item.icon}</span>
              <span className="text-black">{item.title}</span>
            </div>
            <div className="text-black text-center">{item.count}</div>
          </div>
        </div>
      ))}

      <CenteredLoading loading={isLoading} />
    </div>
  );
}
