/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ButtonCustom from "@/components/custom/ButtonCustom";
import CashImage from "@/components/custom/CashImage";
import Input from "@/components/custom/Input";
import { Switch } from "@/components/custom/Switch";
import showToast from "@/components/error-handle/show-toast";
import CenteredLoading from "@/components/loading/center_loading";
import Pagination from "@/components/pagination/Pagination";
import { productHeader } from "@/constants/data/header_table";
import { routed } from "@/constants/navigation/routed";
import {
  editProductService,
  getAllProductService,
} from "@/redux/action/product-management/product-service";
import { Product, ProductListModel } from "@/redux/model/product/product-model";
import { config } from "@/utils/config/config";
import { formatTimestamp } from "@/utils/date/format_timestamp";
import { debounce } from "@/utils/debounce/debounce";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { FaEye } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { HiRefresh } from "react-icons/hi";
import { IoMdAdd } from "react-icons/io";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_OPTIONS } from "@/constants/enum/order-status";
import { Globe, Lock } from "lucide-react";

const ProductComponent = () => {
  const [product, setProduct] = useState<ProductListModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const pageId = searchParams.get("page") || "1";
  const currentPage = parseInt(pageId, 10) || 1;

  // We don't need client-side filtering as we're filtering via API
  const filteredProducts = useMemo(() => {
    return product?.data || [];
  }, [product?.data]);

  // Load products on initial render, page change, or status filter change
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, statusFilter]);

  // Fetch products from API with status filter
  const fetchProducts = async (page: number, search: string = searchQuery) => {
    setLoading(true);
    try {
      // Only send filter parameter if not "ALL"
      const params: any = { page, search };

      if (statusFilter !== "ALL") {
        params.filterBy = statusFilter === "ACTIVE" ? "public" : "draft";
      }

      const response = await getAllProductService(params);
      setProduct(response);
    } catch (error) {
      showToast("Failed to fetch products", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle navigation to product creation page
  const handleAddNew = () => {
    router.push(
      `/${routed.productManagement}/${routed.product}/${routed.create}`
    );
  };

  // Handle navigation to product edit page
  const handleEdit = (item: Product) => {
    router.push(
      `/${routed.productManagement}/${routed.product}/${routed.create}?id=${item.id}`
    );
  };

  // Handle navigation to product preview page
  const handleViewProduct = (item: Product) => {
    router.push(
      `/${routed.productManagement}/${routed.product}/${routed.preview}/${item.id}`
    );
  };

  // Toggle product public status
  const toggleProductStatus = async (product: Product) => {
    // Optimistic update
    updateProductInState(product.id, { isPublic: !product.isPublic });

    try {
      const response = await editProductService({
        productId: product.id,
        data: { isPublic: !product.isPublic },
      });

      if (response.success) {
        showToast(response.message, "success");

        // If we're filtering by status, refresh the list after toggling
        if (statusFilter !== "ALL") {
          fetchProducts(currentPage, searchQuery);
        }
      } else {
        // Revert on failure
        showToast(response?.message ?? "Error", "error");
        updateProductInState(product.id, { isPublic: product.isPublic });
      }
    } catch (error) {
      // Revert on error
      showToast("Failed to update product status", "error");
      updateProductInState(product.id, { isPublic: product.isPublic });
    }
  };

  // Update product in state
  const updateProductInState = (
    productId: string,
    updates: Partial<Product>
  ) => {
    if (!product) return;

    setProduct({
      ...product,
      data: product.data.map((item) =>
        item.id === productId ? { ...item, ...updates } : item
      ),
    });
  };

  // Handle refresh
  const handleRefresh = useCallback(
    debounce(async () => {
      await fetchProducts(currentPage);
      showToast("Refresh successful!", "success");
    }, 300),
    [currentPage]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  // Handle search execution (debounced)
  const handleSearch = useCallback(
    debounce(async (value: string) => {
      await fetchProducts(currentPage, value);
    }, 500),
    [currentPage]
  );

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    // Refresh the product list when filter changes
    fetchProducts(currentPage, searchQuery);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    router.push(`/${routed.productManagement}/${routed.product}?page=${page}`);
    fetchProducts(page);
  };

  // Calculate display index for each product
  const getDisplayIndex = (index: number) => {
    return ((product?.pagination?.currentPage || 1) - 1) * 10 + index + 1;
  };

  return (
    <div>
      <div className="p-4 bg-white rounded-md shadow-sm">
        <div className="flex justify-between">
          <h1 className="font-bold text-xl">
            {`Product Listing Total: ${product?.pagination?.total || 0}`}
          </h1>
        </div>
        <div className="flex mt-2 gap-2">
          <div className="flex flex-1 gap-2">
            <Input
              className="max-w-md h-9"
              placeholder="Search Product id, name..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <ButtonCustom className="w-9 h-9" onClick={handleRefresh}>
              <HiRefresh size={20} />
            </ButtonCustom>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
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
            <ButtonCustom
              className="px-4 h-9 ml-2 font-normal text-xs"
              onClick={handleAddNew}
            >
              <IoMdAdd className="text-white mr-1" size={18} /> Add New
            </ButtonCustom>
          </div>
        </div>
      </div>
      <div className="mt-4 bg-white rounded-md shadow-sm">
        <div className="overflow-x-auto min-h-[50vh]">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                {productHeader.map((header, index) => (
                  <th
                    key={`${header}-${index}`}
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
                    colSpan={productHeader.length}
                    className="text-center py-4"
                  >
                    <CenteredLoading loading={true} />
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-200">
                    <td className="border border-gray-300 px-4 py-2">
                      {getDisplayIndex(index)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 max-w-72 truncate">
                      {item.id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <CashImage
                        width={64}
                        height={64}
                        imageUrl={`${config.BASE_URL}${
                          item.mainImage ? item.mainImage[0]?.imageUrl : ""
                        }`}
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.description || "- - -"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {`${item.viewCount} Views`}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex gap-2 items-center">
                        <span
                          className={
                            item.isPublic ? "text-green-500" : "text-red-500"
                          }
                        >
                          {item.isPublic ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {formatTimestamp(item.createdAt)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex gap-2">
                        <ButtonCustom
                          onClick={() => toggleProductStatus(item)}
                          className="w-6 h-6"
                          title={item.isPublic ? "Public" : "Private"}
                        >
                          {item.isPublic ? (
                            <Globe size={14} className="text-white" />
                          ) : (
                            <Lock size={14} className="text-white" />
                          )}
                        </ButtonCustom>
                        <ButtonCustom
                          variant="cancel"
                          onClick={() => handleViewProduct(item)}
                          className="w-6 h-6"
                        >
                          <FaEye size={14} className="text-white" />
                        </ButtonCustom>
                        <ButtonCustom
                          onClick={() => handleEdit(item)}
                          className="w-6 h-6"
                        >
                          <FiEdit size={14} className="text-white" />
                        </ButtonCustom>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={productHeader.length}
                    className="text-center py-4"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {product && product.data.length > 0 && (
          <div className="flex justify-end mr-8 my-4 pb-8">
            <Pagination
              currentPage={product.pagination?.currentPage || 1}
              onPageChange={handlePageChange}
              totalPages={product.pagination?.totalPages || 1}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductComponent;
