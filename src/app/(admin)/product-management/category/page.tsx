/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCallback, useEffect, useState } from "react";
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
  onUpdateCategory,
  uploadCategory,
  uploadImageCategory,
} from "@/redux/action/product-management/category_service";
import { base64Cut } from "@/constants/image/base64_cut";
import { formatTimestamp } from "@/utils/date/format_timestamp";
import { debounce } from "@/utils/debounce/debounce";
import { config } from "@/utils/config/config";
import CenteredLoading from "@/components/loading/center_loading";
import { Switch } from "@/components/custom/Switch";

const CategoryComponent = () => {
  const [category, setCategory] = useState<CategoryListModel | null>(null);
  const [categoryItem, setCategoryItem] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState({
    id: "",
    loading: false,
  });

  useEffect(() => {
    onCallFirstApi({});
  }, []);

  const onRefreshClick = useCallback(
    debounce(async () => {
      onCallApi({});
      showToast("Refresh page successfully!", "success");
    }),
    []
  );

  async function onCallFirstApi({
    page = 1,
    search = "",
  }: {
    page?: number;
    search?: string;
  }) {
    setLoading(true);
    const response = await getCategoryService({
      page,
      search,
    });
    setCategory(response);
    setLoading(false);
  }

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
    setOpenModal(false);
    setLoading(true);

    if (data.nameCategory != categoryItem?.name) {
      const response = await onUpdateCategory({
        categoryId: categoryItem!.id,
        data: {
          name: data.nameCategory,
          isPublic: undefined,
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

    setCategoryItem(null);
    onCallApi({ page: category!.pagination?.currentPage, search: search });
    setLoading(false);
  }

  async function onCreateCategory(data: any) {
    setOpenModal(false);
    setLoading(true);
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
    onCallApi({});
    setLoading(false);
  }

  function onConfirm(data: any) {
    if (categoryItem) {
      onEditCategory(data);
    } else {
      onCreateCategory(data);
    }
  }

  function onAddCategory() {
    setOpenModal(true);
  }

  function onOpenModalCategory(item: Category) {
    setCategoryItem(item);
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

  async function toggleCategoryStatus(value: Category) {
    if (category) {
      setCategory({
        ...category,
        data: category.data.map((cat) =>
          cat.id === value.id ? { ...cat, isPublic: !value.isPublic } : cat
        ),
      });
    }
    setLoadingUpdate({
      id: value.id,
      loading: true,
    });

    const response = await onUpdateCategory({
      categoryId: value.id,
      data: {
        name: undefined,
        isPublic: !value.isPublic,
      },
    });

    if (response.success) {
      showToast(response.message, "success");
    } else {
      showToast(response?.message ?? "Error", "error");
      if (category) {
        setCategory({
          ...category,
          data: category.data.map((cat) =>
            cat.id === value.id ? { ...cat, isPublic: value.isPublic } : cat
          ),
        });
      }
    }
    setLoadingUpdate({
      id: value.id,
      loading: false,
    });
  }

  return (
    <div>
      <Header
        title="Categories"
        onRefreshClick={onRefreshClick}
        onSearchChange={onSearchChange}
        showAdd={true}
        placeholder="Search categories id, name ..."
        onAddNewClick={onAddCategory}
      />

      <div className="mt-4 bg-white">
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
                      <td className="max-w-72">{categories.id}</td>
                      <td>
                        <CashImage
                          width={32}
                          height={32}
                          imageUrl={`${config.BASE_URL}${categories.image?.imageUrl}`}
                        />
                      </td>
                      <td>{categories.name}</td>
                      <td>{formatTimestamp(categories.createdAt)}</td>
                      <td>
                        <div className="flex gap-2 items-center">
                          <Switch
                            disable={loadingUpdate.loading}
                            checked={categories.isPublic}
                            onChange={() => toggleCategoryStatus(categories)}
                          />
                          <span
                            className={
                              categories.isPublic
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            {categories.isPublic ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
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
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {category && category.data.length > 0 && (
            <div className="flex justify-end mr-8 mt-8">
              <Pagination
                currentPage={category.pagination?.currentPage || 1}
                onPageChange={(page) => onCallFirstApi({ page })}
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

      <CenteredLoading loading={loading} />
    </div>
  );
};

export default CategoryComponent;
