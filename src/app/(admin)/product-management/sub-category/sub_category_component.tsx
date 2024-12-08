"use client";

import CashImage from "@/components/custom/CashImage";
import showToast from "@/components/error-handle/show-toast";
import Header from "@/components/header/header";
import Pagination from "@/components/pagination/pagination";
import {
  headerAllUser,
  headerCategory,
  headerSubCategory,
} from "@/constants/data/header_table";
import { getAllUserService } from "@/redux/action/user-management/all_user_service";
import { CategoryListModel } from "@/redux/model/category/category_model";
import { SubCategoryListModel } from "@/redux/model/sub-category/sub_categpry_model";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { LuView } from "react-icons/lu";

interface SubCategoryComponentProps {
  initialData: SubCategoryListModel;
}

const SubCategoryComponent: React.FC<SubCategoryComponentProps> = ({
  initialData,
}) => {
  const [subCategory, setSubCategory] =
    useState<SubCategoryListModel>(initialData);
  const router = useRouter();

  // const response = await
  async function onRefreshClick() {
    router.refresh();
    showToast("Refresh page successfully!", "success");
  }

  async function onPageChange(value: number) {
    const response = await getAllUserService({ page: value });
    setSubCategory(response);
  }

  return (
    <div>
      <Header
        onRefreshClick={onRefreshClick}
        onExportClick={() => onPageChange(1)}
      />

      <div className="mt-4 bg-white min-h-full">
        <div>
          <div className="overflow-x-auto min-h-[50vh]">
            <table>
              <thead className="bg-gray-100">
                <tr>
                  {headerSubCategory.map((header, index) => (
                    <th
                      key={header + index.toString()}
                      className="border border-gray-300 px-4 py-2 text-left"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subCategory?.data.map((sub) => {
                  return (
                    <tr key={sub.id} className="hover:bg-gray-200">
                      <td className="truncate">{sub.id}</td>
                      <td className="truncate">
                        <CashImage
                          width={32}
                          height={32}
                          imageUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/${sub?.image}`}
                        />
                      </td>
                      <td className="truncate">{sub.name}</td>
                      <td className="truncate">{sub.createdAt}</td>
                      <td className="truncate">{sub.updatedAt}</td>
                      <td className="truncate">{sub.category.id}</td>
                      <td className="truncate">{sub.category.name}</td>
                      <td className="truncate">{sub._count.products}</td>
                      <td className="flex items-center truncate">
                        <button
                          onClick={() => {}}
                          className="bg-gray-400 text-white px-2 p-1 rounded hover:bg-gray-500 mr-2 flex items-center"
                        >
                          <LuView size={14} className="text-white" />
                        </button>
                        <button
                          onClick={() => {}}
                          className="bg-blue-500 text-white px-2 p-1 rounded hover:bg-blue-600 mr-2 flex items-center"
                        >
                          <FiEdit size={14} className="text-white" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {subCategory.data.length > 0 && (
            <div className="flex justify-end mr-8 mt-8">
              <Pagination
                currentPage={subCategory.pagination?.currentPage || 1}
                onPageChange={onPageChange}
                totalPages={subCategory.pagination?.totalPages || 1}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubCategoryComponent;
