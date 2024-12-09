"use client";

import Button from "@/components/custom/button";
import CashImage from "@/components/custom/CashImage";
import showToast from "@/components/error-handle/show-toast";
import Header from "@/components/header/header";
import SubCategoryModal from "@/components/modal/sub_category_modal";
import Pagination from "@/components/pagination/pagination";
import {
  headerAllUser,
  headerCategory,
  headerSubCategory,
} from "@/constants/data/header_table";
import { base64Cut } from "@/constants/image/base64_cut";
import {
  createSubCategory,
  getSubCategoryService,
  updatedSubCategory,
  uploadImageSubCategory,
} from "@/redux/action/product-management/sub_category_service";
import { getAllUserService } from "@/redux/action/user-management/all_user_service";
import { CategoryListModel } from "@/redux/model/category/category_model";
import {
  Subcategory,
  SubCategoryListModel,
} from "@/redux/model/sub-category/sub_categpry_model";
import { formatTimestamp } from "@/utils/date/format_timestamp";
import { debounce } from "@/utils/debounce/debounce";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { LuView } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";

interface SubCategoryComponentProps {
  initialData: SubCategoryListModel;
}

const SubCategoryComponent: React.FC<SubCategoryComponentProps> = ({
  initialData,
}) => {
  const [subCategory, setSubCategory] =
    useState<SubCategoryListModel>(initialData);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [subItem, setSubItem] = useState<Subcategory | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const onRefreshClick = useCallback(
    debounce(async () => {
      onCallApi({});
      showToast("Refresh page successfully!", "success");
    }), // 300ms debounce delay
    [] // Empty array ensures this function is only created once
  );

  async function onCallApi({
    page = 1,
    search = "",
  }: {
    page?: number;
    search?: string;
  }) {
    const response = await getSubCategoryService({ page, search });
    setSubCategory(response);
  }

  function onAddCategory() {
    setOpenModal(true);
  }

  async function onCreateCategory(data: any) {
    const response = await createSubCategory({
      name: data.nameCategory,
      categoryId: "cm4h93x97002hjz0qtyz2w46l",
    });
    if (response.success) {
      const responseImage = await uploadImageSubCategory({
        subcategoryId: response.data.id,
        data: {
          fileContent: data.image.base64.replace(base64Cut.cutHead, ""),
          fileExtension: data.image.type,
        },
      });
      showToast(response.message, "success");
      if (responseImage.success) {
        showToast(responseImage.message, "success");
      } else {
        showToast(responseImage.message, "error");
      }
    } else {
      showToast(response.message, "error");
    }
  }

  async function onEditCategory(data: any) {
    if (data.nameCategory != subItem?.name) {
      const response = await updatedSubCategory({
        subCategoryId: subItem!.id,
        data: {
          name: data.nameCategory,
        },
      });

      if (response?.success) {
        showToast(response.message, "success");
      } else {
        showToast(response?.message ?? "Error", "error");
      }
    }

    if (data.image.type) {
      const responseImage = await uploadImageSubCategory({
        subcategoryId: subItem!.id,
        data: {
          fileContent: data.image.base64.replace(base64Cut.cutHead, ""),
          fileExtension: data.image.type,
        },
      });
      if (responseImage.success) {
        showToast(responseImage.message, "success");
      } else {
        showToast(responseImage.message, "error");
      }
    }
  }

  async function onConfirm(data: any) {
    setLoading(true);
    if (subItem) {
      onEditCategory(data);
      setSubItem(null);
      onCallApi({ page: subCategory.pagination?.currentPage, search: search });
    } else {
      await onCreateCategory(data);
      onCallApi({});
    }
    setOpenModal(false);
    setLoading(false);
  }

  function onOpenModalSub(item: Subcategory) {
    setSubItem(item);
    setOpenModal(true);
  }

  const onSearchChange = useCallback(
    debounce(async (query: string) => {
      if (query && query.length > 0) {
        onCallApi({ search: query });
        setSearch(query);
      } else {
        onCallApi({});
        setSearch("");
      }
    }),
    []
  );

  return (
    <div>
      <Header
        title="Subcategories"
        onRefreshClick={onRefreshClick}
        showAdd={true}
        placeholder="Search Subcategories id, name ..."
        onAddNewClick={onAddCategory}
        onSearchChange={onSearchChange}
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
                {subCategory?.data.map((sub, index) => {
                  const displayIndex =
                    ((subCategory.pagination?.currentPage || 1) - 1) * 15 +
                    index +
                    1;
                  return (
                    <tr key={sub.id} className="hover:bg-gray-200">
                      <td>{displayIndex}</td>
                      <td>{sub.id}</td>
                      <td>
                        <CashImage
                          width={32}
                          height={32}
                          imageUrl={`${process.env.NEXT_PUBLIC_BASE_URL}${sub.image?.imageUrl}`}
                        />
                      </td>
                      <td>{sub.name}</td>
                      <td>{`${sub._count?.products || 0} Items`}</td>
                      <td>{sub.category?.id}</td>
                      <td>{sub.category?.name}</td>
                      <td>{formatTimestamp(sub.createdAt)}</td>
                      <td>{formatTimestamp(sub.updatedAt)}</td>
                      <td>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => onOpenModalSub(sub)}
                            className="w-6 h-6 "
                          >
                            <FiEdit size={14} className="text-white" />
                          </Button>
                          <button
                            // onClick={() => onDeleteItemCategory(categories)}
                            className="w-6 h-6 bg-red-600 rounded flex justify-center items-center"
                          >
                            <MdDeleteOutline size={16} className="text-white" />
                          </button>
                        </div>
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
                onPageChange={(val) => onCallApi({ page: val })}
                totalPages={subCategory.pagination?.totalPages || 1}
              />
            </div>
          )}
        </div>
      </div>

      <SubCategoryModal
        title="Sub category"
        isOpen={openModal}
        loadingButton={loading}
        onClose={() => setOpenModal(false)}
        onConfirm={onConfirm}
        initialData={subItem}
      />
    </div>
  );
};

export default SubCategoryComponent;
