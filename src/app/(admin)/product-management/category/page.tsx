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
import { HiRefresh } from "react-icons/hi";
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
import Input from "@/components/custom/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Status filter options like in the product page
const STATUS_OPTIONS = [
  { value: "ALL", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

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
  // Add status filter state
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    onCallFirstApi({});
  }, [statusFilter]); // Add statusFilter as dependency to reload when it changes

  const onRefreshClick = useCallback(
    debounce(async () => {
      onCallApi({});
      showToast("Refresh page successfully!", "success");
    }),
    [statusFilter]
  );

  async function onCallFirstApi({
    page = 1,
    search = "",
  }: {
    page?: number;
    search?: string;
  }) {
    setLoading(true);
    // Include status filter in the API call
    const params: any = { page, search };

    if (statusFilter !== "ALL") {
      params.filterBy = statusFilter === "ACTIVE" ? "public" : "draft";
    }

    const response = await getCategoryService(params);
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
    // Include status filter in the API call
    const params: any = { page, search };

    if (statusFilter !== "ALL") {
      params.filterBy = statusFilter === "ACTIVE" ? "public" : "draft";
    }

    const response = await getCategoryService(params);
    setCategory(response);
  }

  async function onEditCategory(data: any) {
    setOpenModal(false);
    setLoading(true);

    if (data.nameCategory != categoryItem?.name) {
      const response = await onUpdateCategory({
        categoryId: categoryItem!.id,
        data: {
          name: data.nameCategory.trim(),
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
      name: data.nameCategory.trim(),
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
    [statusFilter]
  );

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    // The API call will be triggered by the useEffect
  };

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

      // If we're filtering by status, refresh the list after toggling
      if (statusFilter !== "ALL") {
        onCallApi({ page: category?.pagination?.currentPage, search });
      }
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

  // Create a custom header section similar to product page
  const CustomHeader = () => (
    <div className="p-4 bg-white rounded-md shadow-sm">
      <div className="flex justify-between">
        <h1 className="font-bold text-xl">
          {`Category Management Total: ${category?.pagination?.total || 0}`}
        </h1>
      </div>
      <div className="flex mt-2 gap-2">
        <div className="flex flex-1 gap-2">
          <Input
            className="max-w-md h-9"
            placeholder="Search categories id, name..."
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <ButtonCustom className="w-9 h-9" onClick={onRefreshClick}>
            <HiRefresh size={20} />
          </ButtonCustom>
        </div>

        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ButtonCustom className="h-8 px-4" onClick={onAddCategory}>
            Add Category
          </ButtonCustom>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Replace the old header with the new custom header */}
      <CustomHeader />

      <div className="mt-4 bg-white rounded-md shadow-sm">
        <div className="overflow-x-auto min-h-[50vh]">
          <table className="w-full">
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
              {loading ? (
                <tr>
                  <td
                    colSpan={headerCategory.length}
                    className="text-center py-4"
                  >
                    <CenteredLoading loading={true} />
                  </td>
                </tr>
              ) : category?.data && category.data.length > 0 ? (
                category.data.map((categories, index) => {
                  const displayIndex =
                    ((category.pagination?.currentPage || 1) - 1) * 10 +
                    index +
                    1;
                  return (
                    <tr key={categories.id} className="hover:bg-gray-200">
                      <td className="border border-gray-300 px-4 py-2">
                        {displayIndex}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <CashImage
                          width={64}
                          height={64}
                          imageUrl={`${config.BASE_URL}${categories.image?.imageUrl}`}
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {categories.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formatTimestamp(categories.createdAt)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2 items-center">
                          <Switch
                            disabled={loadingUpdate.loading}
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
                      <td className="border border-gray-300 px-4 py-2">{`${categories._count.subcategories} Items`}</td>
                      <td className="border border-gray-300 px-4 py-2">{`${categories._count.products} Items`}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2">
                          <ButtonCustom
                            onClick={() => onOpenModalCategory(categories)}
                            className="w-6 h-6"
                          >
                            <FiEdit size={14} className="text-white" />
                          </ButtonCustom>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={headerCategory.length}
                    className="text-center py-4"
                  >
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {category && category.data.length > 0 && (
          <div className="flex justify-end mr-8 my-4">
            <Pagination
              currentPage={category.pagination?.currentPage || 1}
              onPageChange={(page) => onCallFirstApi({ page })}
              totalPages={category.pagination?.totalPages || 1}
            />
          </div>
        )}
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
