/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ButtonCustom from "@/components/custom/ButtonCustom";
import CashImage from "@/components/custom/CashImage";
import Input from "@/components/custom/Input";
import { Switch } from "@/components/custom/Switch";
import showToast from "@/components/error-handle/show-toast";
import CenteredLoading from "@/components/loading/center_loading";
import SubCategoryModal from "@/components/modal/sub_category_modal";
import Pagination from "@/components/pagination/Pagination";
import { headerSubCategory } from "@/constants/data/header_table";
import { base64Cut } from "@/constants/image/base64_cut";
import { getCategoryService } from "@/redux/action/product-management/category_service";
import {
  createSubCategory,
  getSubCategoryService,
  updatedSubCategory,
  uploadImageSubCategory,
} from "@/redux/action/product-management/sub_category_service";
import { CategoryListModel } from "@/redux/model/category/category_model";
import {
  Subcategory,
  SubCategoryListModel,
} from "@/redux/model/sub-category/sub_categpry_model";
import { config } from "@/utils/config/config";
import { formatTimestamp } from "@/utils/date/format_timestamp";
import { debounce } from "@/utils/debounce/debounce";
import { useCallback, useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { HiRefresh } from "react-icons/hi";
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

const SubCategoryComponent = () => {
  const [subCategories, setSubCategories] =
    useState<SubCategoryListModel | null>();
  const [category, setCategory] = useState<CategoryListModel>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [subCategoryItem, setSubCategoryItem] = useState<Subcategory | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [searchAdd, setSearchAdd] = useState("");
  const [loadingSelect, setLoadingSelect] = useState<boolean>(false);
  const [loadingUpdate, setLoadingUpdate] = useState({
    id: "",
    loading: false,
  });
  // Add status filter state
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    onCallFirstApi();
  }, [statusFilter]); // Add statusFilter as dependency to reload when it changes

  async function onCallFirstApi() {
    setLoading(true);
    // Include status filter in the API call
    const params: any = {};

    if (statusFilter !== "ALL") {
      params.filterBy = statusFilter === "ACTIVE" ? "public" : "draft";
    }

    const response = await getSubCategoryService(params);
    setSubCategories(response);
    setLoading(false);
    const responseCategory = await getCategoryService({});
    setCategory(responseCategory);
  }

  const onRefreshClick = useCallback(
    debounce(async () => {
      onCallApi({});
      showToast("Refresh page successfully!", "success");
    }, 300),
    [statusFilter]
  );

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

    const response = await getSubCategoryService(params);
    setSubCategories(response);
  }

  function onAddCategory() {
    setOpenModal(true);
  }

  async function onCreateCategory(data: any) {
    const response = await createSubCategory({
      name: data.nameSub.trim(),
      categoryId: data.idCategory,
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
    const response = await updatedSubCategory({
      subCategoryId: data.id,
      data: {
        name: data.nameSub.trim(),
        categoryId: data.idCategory,
      },
    });

    if (response.success) {
      showToast(response.message, "success");
    } else {
      showToast(response.message, "error");
    }

    if (data.image.type) {
      const responseImage = await uploadImageSubCategory({
        subcategoryId: subCategoryItem!.id,
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
    setOpenModal(false);
    setLoading(true);
    if (subCategoryItem) {
      await onEditCategory(data);
      setSubCategoryItem(null);
      onCallApi({
        page: subCategories?.pagination?.currentPage,
        search: search,
      });
    } else {
      await onCreateCategory(data);
      onCallApi({});
    }
    setLoading(false);
  }

  function onOpenModalSub(item: Subcategory) {
    setSubCategoryItem(item);
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
    }, 500),
    [statusFilter]
  );

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    // The API call will be triggered by the useEffect
  };

  const fetchMoreData = async () => {
    if (
      category?.pagination &&
      category.pagination!.currentPage < category.pagination!.totalPages
    ) {
      setLoadingSelect(true);
      // Simulate fetching data
      const result = await getCategoryService({
        page: category.pagination!.currentPage + 1,
      });
      setCategory((prev) => ({
        data: [...prev!.data, ...result.data], // Concatenate new categories with existing ones
        pagination: result.pagination, // Update pagination metadata
      }));
    }
    setLoadingSelect(false);
  };

  async function onCallApiCatgory({
    search = "",
  }: {
    page?: number;
    search?: string;
  }) {
    const response = await getCategoryService({
      search: search,
    });
    setCategory(response);
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchAdd(e.target.value);
    onSearchCategory(e.target.value);
  }

  const onSearchCategory = useCallback(
    debounce(async (query: string) => {
      if (query && query.length > 0) {
        onCallApiCatgory({ search: query });
      } else {
        onCallApiCatgory({});
      }
    }, 500),
    []
  );

  function onClearSearch() {
    setSearchAdd("");
  }

  async function toggleCategoryStatus(value: Subcategory) {
    if (subCategories) {
      setSubCategories({
        ...subCategories,
        data: subCategories.data.map((cat) =>
          cat.id === value.id ? { ...cat, isPublic: !value.isPublic } : cat
        ),
      });
    }
    setLoadingUpdate({
      id: value.id,
      loading: true,
    });

    const response = await updatedSubCategory({
      subCategoryId: value.id,
      data: {
        isPublic: !value.isPublic,
      },
    });

    if (response.success) {
      showToast(response.message, "success");

      // If we're filtering by status, refresh the list after toggling
      if (statusFilter !== "ALL") {
        onCallApi({ page: subCategories?.pagination?.currentPage, search });
      }
    } else {
      showToast(response?.message ?? "Error", "error");
      if (subCategories) {
        setSubCategories({
          ...subCategories,
          data: subCategories.data.map((cat) =>
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
          {`Sub Category Management Total: ${
            subCategories?.pagination?.total || 0
          }`}
        </h1>
      </div>
      <div className="flex mt-2 gap-2">
        <div className="flex flex-1 gap-2">
          <Input
            className="max-w-md h-9"
            placeholder="Search Subcategories id, name..."
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
            Add Sub Category
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
              {loading ? (
                <tr>
                  <td
                    colSpan={headerSubCategory.length}
                    className="text-center py-4"
                  >
                    <CenteredLoading loading={true} />
                  </td>
                </tr>
              ) : subCategories?.data && subCategories.data.length > 0 ? (
                subCategories.data.map((sub, index) => {
                  const displayIndex =
                    ((subCategories.pagination?.currentPage || 1) - 1) * 10 +
                    index +
                    1;
                  return (
                    <tr key={sub.id} className="hover:bg-gray-200">
                      <td className="border border-gray-300 px-4 py-2">
                        {displayIndex}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <CashImage
                          width={64}
                          height={64}
                          imageUrl={`${config.BASE_URL}${sub.image?.imageUrl}`}
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {sub.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formatTimestamp(sub.createdAt)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2 items-center">
                          <Switch
                            disabled={loadingUpdate.loading}
                            checked={sub.isPublic}
                            onChange={() => toggleCategoryStatus(sub)}
                          />
                          <span
                            className={
                              sub.isPublic ? "text-green-500" : "text-red-500"
                            }
                          >
                            {sub.isPublic ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {sub.category?.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{`${
                        sub._count?.products || 0
                      } Items`}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2">
                          <ButtonCustom
                            onClick={() => onOpenModalSub(sub)}
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
                    colSpan={headerSubCategory.length}
                    className="text-center py-4"
                  >
                    No subcategories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {subCategories && subCategories.data.length > 0 && (
          <div className="flex justify-end mr-8 my-4">
            <Pagination
              currentPage={subCategories.pagination?.currentPage || 1}
              onPageChange={(val) => onCallApi({ page: val })}
              totalPages={subCategories.pagination?.totalPages || 1}
            />
          </div>
        )}
      </div>

      <SubCategoryModal
        category={category?.data || []}
        title="Sub category"
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={onConfirm}
        initialData={subCategoryItem}
        isLoading={loadingSelect}
        onLoadMore={fetchMoreData}
        onChange={onChange}
        value={searchAdd}
        onClearSearch={onClearSearch}
        hasNext={
          (category?.pagination &&
            category.pagination!.currentPage <
              category.pagination!.totalPages) ||
          false
        }
      />

      <CenteredLoading loading={loading} />
    </div>
  );
};

export default SubCategoryComponent;
