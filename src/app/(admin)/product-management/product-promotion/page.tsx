"use client";

import ButtonCustom from "@/components/custom/ButtonCustom";
import { Switch } from "@/components/custom/Switch";
import showToast from "@/components/error-handle/show-toast";
import Pagination from "@/components/pagination/Pagination";
import { productHeader } from "@/constants/data/header_table";
import { routed } from "@/constants/navigation/routed";
import {
  editProductService,
  getAllProductPromotionService,
  getAllProductService,
} from "@/redux/action/product-management/product-service";
import { Product, ProductListModel } from "@/redux/model/product/product-model";
import { formatTimestamp } from "@/utils/date/format_timestamp";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";

const ProductPromotionPage = () => {
  const [product, setProduct] = useState<ProductListModel>();
  const [loadingUpdate, setLoadingUpdate] = useState({
    id: "",
    loading: false,
  });
  const router = useRouter();

  useEffect(() => {
    onCallApi({});
  }, []);

  async function onCallApi({ page = 1 }: { page?: number }) {
    const response = await getAllProductPromotionService({
      page,
    });
    setProduct(response);
  }

  function onEditBanner(item: Product) {
    router.push(
      `/${routed.productManagement}/${routed.product}/${routed.create}?id=${item.id}`
    );
  }

  async function toggleCategoryStatus(value: Product) {
    setLoadingUpdate({
      id: value.id,
      loading: true,
    });

    const response = await editProductService({
      productId: value.id,
      data: {
        isPublic: !value.isPublic,
      },
    });

    if (response.success) {
      onCallApi({ page: product!.pagination?.currentPage });
      showToast(response.message, "success");
    } else {
      showToast(response?.message ?? "Error", "error");
    }

    setLoadingUpdate({
      id: value.id,
      loading: false,
    });
  }

  function onViewProduct(value: Product): void {
    router.push(
      `/${routed.productManagement}/${routed.product}/${routed.preview}/${value.id}`
    );
  }

  return (
    <div>
      <div className="p-4 bg-white flex justify-between">
        <h1 className="font-bold text-xl">Product Promotions</h1>
      </div>
      <div className="mt-4 bg-white">
        <div>
          <div className="overflow-x-auto min-h-[50vh]">
            <table>
              <thead className="bg-gray-100">
                <tr>
                  {productHeader.map((header, index) => (
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
                {product?.data.map((value, index) => {
                  const displayIndex =
                    ((product.pagination?.currentPage || 1) - 1) * 15 +
                    index +
                    1;

                  return (
                    <tr key={value.id} className="hover:bg-gray-200">
                      <td>{displayIndex}</td>
                      <td>{value.id}</td>
                      <td>{value.name}</td>
                      <td>{value.description || "- - -"}</td>
                      <td>{`${value.viewCount} Views`}</td>
                      <td>
                        <div className="flex gap-2 items-center">
                          <Switch
                            disable={loadingUpdate.loading}
                            checked={value.isPublic}
                            onChange={() => toggleCategoryStatus(value)}
                          />
                          <span
                            className={
                              value.isPublic ? "text-green-500" : "text-red-500"
                            }
                          >
                            {value.isPublic ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>

                      <td>{formatTimestamp(value.createdAt)}</td>
                      <td>{value.category?.name || "- - -"}</td>
                      <td>{value.subcategory?.name || "- - -"}</td>
                      <td>
                        <div className="flex gap-2">
                          <ButtonCustom
                            variant="cancel"
                            onClick={() => onViewProduct(value)}
                            className="w-6 h-6"
                          >
                            <FaEye size={14} className="text-white" />
                          </ButtonCustom>
                          <ButtonCustom
                            onClick={() => onEditBanner(value)}
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
          {product && product?.data.length > 0 && (
            <div className="flex justify-end mr-8 mt-8">
              <Pagination
                currentPage={product.pagination?.currentPage || 1}
                onPageChange={(page) => onCallApi({ page })}
                totalPages={product.pagination?.totalPages || 1}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPromotionPage;