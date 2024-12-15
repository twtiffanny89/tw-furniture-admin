/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCallback, useState } from "react";
import CashImage from "@/components/custom/CashImage";
import showToast from "@/components/error-handle/show-toast";
import Header from "@/components/header/header";
import Pagination from "@/components/pagination/Pagination";
import { headerCategory } from "@/constants/data/header_table";
import {
  Category,
  CategoryListModel,
} from "@/redux/model/category/category_model";
import { FiEdit } from "react-icons/fi";
import ButtonCustom from "@/components/custom/ButtonCustom";
import CategoryModal from "@/components/modal/category_modal";
import {
  getCategoryService,
  onDeleteCategory,
  onUpdateCategory,
  uploadCategory,
  uploadImageCategory,
} from "@/redux/action/product-management/category_service";
import { base64Cut } from "@/constants/image/base64_cut";
import { formatTimestamp } from "@/utils/date/format_timestamp";
import { debounce } from "@/utils/debounce/debounce";
import { MdDeleteOutline } from "react-icons/md";
import ModalConfirm from "@/components/modal/modal_confirm";
import { config } from "@/utils/config/config";

interface CategoryComponentProps {
  initialData: CategoryListModel;
}

const CategoryComponent: React.FC<CategoryComponentProps> = ({
  initialData,
}) => {
  const [category, setCategory] = useState<CategoryListModel>(initialData);
  const [categoryItem, setCategoryItem] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

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
    const response = await getCategoryService({
      page,
      search,
    });
    setCategory(response);
  }

  async function onEditCategory(data: any) {
    if (data.nameCategory != categoryItem?.name) {
      const response = await onUpdateCategory({
        categoryId: categoryItem!.id,
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
      const responseImage = await uploadImageCategory({
        categoryId: categoryItem!.id,
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

  async function onCreateCategory(data: any) {
    const response = await uploadCategory({
      name: data.nameCategory,
    });
    if (response.success) {
      const responseImage = await uploadImageCategory({
        categoryId: response.data.id,
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

  async function onConfirm(data: any) {
    setOpenModal(false);
    setLoading(true);
    if (categoryItem) {
      onEditCategory(data);
      setCategoryItem(null);
      onCallApi({ page: category.pagination?.currentPage, search: search });
    } else {
      await onCreateCategory(data);
      onCallApi({});
    }

    setLoading(false);
  }

  function onAddCategory() {
    setOpenModal(true);
  }

  function onOpenModalCategory(item: Category) {
    setCategoryItem(item);
    setOpenModal(true);
  }

  function onDeleteItemCategory(item: Category) {
    setCategoryItem(item);
    setOpenModalDelete(true);
  }

  async function onConfirmDelete() {
    const resposne = await onDeleteCategory({ categoryId: categoryItem!.id });
    if (resposne.success) {
      showToast(resposne.message, "success");
      onCallApi({ page: category.pagination?.currentPage, search: search });
    } else {
      showToast(resposne.message, "error");
    }
    setOpenModalDelete(false);
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
        title="Category"
        onRefreshClick={onRefreshClick}
        onSearchChange={onSearchChange}
        showAdd={true}
        placeholder="Search categories id, name ..."
        onAddNewClick={onAddCategory}
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
                {category?.data.map((categories, index) => {
                  const displayIndex =
                    ((category.pagination?.currentPage || 1) - 1) * 15 +
                    index +
                    1;
                  return (
                    <tr key={categories.id} className="hover:bg-gray-200">
                      <td>{displayIndex}</td>
                      <td>{categories.id}</td>
                      <td>
                        <CashImage
                          width={32}
                          height={32}
                          imageUrl={`${config.BASE_URL}${categories.image?.imageUrl}`}
                        />
                      </td>
                      <td>{categories.name}</td>
                      <td>{formatTimestamp(categories.createdAt)}</td>
                      <td>{formatTimestamp(categories.updatedAt)}</td>
                      <td>{`${categories._count.subcategories} Items`}</td>
                      <td>{`${categories._count.products} Items`}</td>
                      <td>
                        <div className="flex gap-2">
                          <ButtonCustom
                            onClick={() => onOpenModalCategory(categories)}
                            className="w-6 h-6 "
                          >
                            <FiEdit size={14} className="text-white" />
                          </ButtonCustom>
                          <button
                            onClick={() => onDeleteItemCategory(categories)}
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
          {category.data.length > 0 && (
            <div className="flex justify-end mr-8 mt-8">
              <Pagination
                currentPage={category.pagination?.currentPage || 1}
                onPageChange={(page) => onCallApi({ page })}
                totalPages={category.pagination?.totalPages || 1}
              />
            </div>
          )}
        </div>
      </div>

      <CategoryModal
        title="Category"
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={onConfirm}
        initialData={categoryItem}
      />
      <ModalConfirm
        onClose={() => setOpenModalDelete(false)}
        isOpen={openModalDelete}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
};

export default CategoryComponent;
