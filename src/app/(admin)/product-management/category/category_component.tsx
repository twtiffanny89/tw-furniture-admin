"use client";

import { useState } from "react";
import CashImage from "@/components/custom/CashImage";
import showToast from "@/components/error-handle/show-toast";
import Header from "@/components/header/header";
import Pagination from "@/components/pagination/pagination";
import { headerCategory } from "@/constants/data/header_table";
import { getAllUserService } from "@/redux/action/user-management/all_user_service";
import { CategoryListModel } from "@/redux/model/category/category_model";
import { useRouter } from "next/navigation";
import { FiEdit } from "react-icons/fi";
import { LuView } from "react-icons/lu";
import Button from "@/components/custom/button";

interface CategoryComponentProps {
  initialData: CategoryListModel;
}

const CategoryComponent: React.FC<CategoryComponentProps> = ({
  initialData,
}) => {
  const [category, setCategory] = useState<CategoryListModel>(initialData);
  const router = useRouter();

  async function onRefreshClick() {
    router.refresh();
    showToast("Refresh page successfully!", "success");
  }

  async function onPageChange(value: number) {
    const response = await getAllUserService({ page: value });
    setCategory(response);
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
                  {headerCategory.map((header, index) => (
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
                {category?.data.map((user) => {
                  return (
                    <tr key={user.id} className="hover:bg-gray-200">
                      <td>{user.id}</td>
                      <td>
                        <CashImage
                          width={32}
                          height={32}
                          imageUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/${user?.image}`}
                        />
                      </td>
                      <td>{user.name}</td>
                      <td>{user.createdAt}</td>
                      <td>{user.updatedAt}</td>
                      <td>{user._count.subcategories}</td>
                      <td>{user._count.products}</td>
                      <td>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {}}
                            className="w-6 h-6 bg-gray-500 hover:bg-slate-600"
                          >
                            <LuView size={14} className="text-white" />
                          </Button>
                          <Button onClick={() => {}} className="w-6 h-6 ">
                            <FiEdit size={14} className="text-white" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {category.data.length > 0 && (
            <div className="flex justify-end mr-8 mt-8">
              <Pagination
                currentPage={category.pagination?.currentPage || 1}
                onPageChange={onPageChange}
                totalPages={category.pagination?.totalPages || 1}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryComponent;
