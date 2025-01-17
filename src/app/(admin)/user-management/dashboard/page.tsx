/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { getCategoryService } from "@/redux/action/product-management/category_service";
import {
  getAllProductPromotionService,
  getAllProductService,
} from "@/redux/action/product-management/product-service";
import { getSubCategoryService } from "@/redux/action/product-management/sub_category_service";
import { getActivityLogService } from "@/redux/action/user-management/activity_log_service";
import { getAllUserService } from "@/redux/action/user-management/all_user_service";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [totalUser, setTotalUser] = useState(0);
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalProductPromotion, setTotalProductPromotion] = useState(0);
  const [totalViewApp, setTotalViewApp] = useState(0);
  const [totalSubcategories, setTotalSubcategories] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const rounter = useRouter();

  useEffect(() => {
    // Call API here
    onCallApi();
  }, []);

  async function onCallApi() {
    callGetUser();
    callGetAllProduct();
    callGetAllProductPromotion();
    callGetViewAppToday();
    callGetAllCategories();
    callGetAllSubcategories();
  }

  async function callGetUser() {
    const resposne = await getAllUserService({ limit: 1 });
    setTotalUser(resposne.pagination?.total || 0);
  }

  async function callGetAllProduct() {
    const resposne = await getAllProductService({ limit: 1 });
    setTotalProduct(resposne.pagination?.total || 0);
  }

  async function callGetAllProductPromotion() {
    const resposne = await getAllProductPromotionService({ limit: 1 });
    setTotalProductPromotion(resposne.pagination?.total || 0);
  }

  async function callGetViewAppToday() {
    const today = new Date().toISOString().split("T")[0];
    const response = await getActivityLogService({
      limit: 1,
      dateFrom: `${today}`,
      dateTo: `${today}`,
    });
    setTotalViewApp(response.pagination?.total || 0);
  }

  async function callGetAllCategories() {
    const resposne = await getCategoryService({ limit: 1 });
    setTotalCategories(resposne.pagination?.total || 0);
  }

  async function callGetAllSubcategories() {
    const resposne = await getSubCategoryService({ limit: 1 });
    setTotalSubcategories(resposne.pagination?.total || 0);
  }

  return (
    <div>
      <div className="p-4 bg-white">
        <div className="flex">
          <h1 className="font-bold text-xl">Dashboard</h1>
        </div>
      </div>
      <div className="mt-4 bg-white flex flex-wrap">
        {[
          {
            title: "Total Users",
            count: totalUser,
            icon: "👤",
            link: "/user-management/user-listing",
          },
          {
            title: "Total Products",
            count: totalProduct,
            icon: "📦",
            link: "/product-management/product",
          },
          {
            title: "Total Products Promotion",
            count: totalProductPromotion,
            icon: "🏷️",
            link: "/product-management/product-promotion",
          },
          {
            title: "Total Orders Processing",
            count: 20,
            icon: "🔄",
            link: "/order-management/order-listing",
          },
          {
            title: "Total Completed Order",
            count: 20,
            icon: "✅",
            link: "/order-management/order-listing",
          },
          {
            title: "Total Viewr App Today",
            count: totalViewApp,
            icon: "👁️",
            link: "/user-management/activity-log",
          },
          {
            title: "Total Categories",
            count: totalCategories,
            icon: "📂",
            link: "/product-management/category",
          },
          {
            title: "Total Subcategories",
            count: totalSubcategories,
            icon: "📁",
            link: "/product-management/sub-category",
          },
        ].map((item, index) => (
          <div
            key={index}
            onClick={() => rounter.push(item.link)}
            className="h-40 min-w-[250px] bg-primary m-2 flex-grow items-center justify-center flex transform transition-transform duration-300 hover:scale-105 cursor-pointer rounded"
          >
            <div className="text-center">
              <div className="text-white mb-2 flex items-center justify-center flex-col">
                <span className="text-4xl mb-2">{item.icon}</span>
                <span>{item.title}</span>
              </div>
              <div className="text-white text-center">{item.count}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
