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
  getAllProductPromotionService,
} from "@/redux/action/product-management/product-service";
import { Product, ProductListModel } from "@/redux/model/product/product-model";
import { config } from "@/utils/config/config";
import { formatTimestamp } from "@/utils/date/format_timestamp";
import { debounce } from "@/utils/debounce/debounce";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { HiRefresh } from "react-icons/hi";

const ProductPromotionPage = () => {
  const [product, setProduct] = useState<ProductListModel | null>(null);
  const [loadingUpdate, setLoadingUpdate] = useState({
    id: "",
    loading: false,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageId = searchParams.get("page") || "1";

  useEffect(() => {
    const parsedPageId = parseInt(pageId, 10) || 1;
    if (parsedPageId && !product) {
      onCallProApi({ page: parsedPageId });
    }
  }, [pageId, product]);

  async function onCallProApi({ page = 1 }: { page?: number }) {
    setLoading(true);
    const response = await getAllProductPromotionService({
      page,
    });
    setProduct(response);
    setLoading(false);
  }

  function onEditBanner(item: Product) {
    router.push(
      `/${routed.productManagement}/${routed.product}/${routed.create}?id=${item.id}`
    );
  }

  async function toggleProductPromotionStatus(value: Product) {
    if (product) {
      setProduct({
        ...product,
        data: product.data.map((cat) =>
          cat.id === value.id ? { ...cat, isPublic: !value.isPublic } : cat
        ),
      });
    }
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
      showToast(response.message, "success");
    } else {
      showToast(response?.message ?? "Error", "error");
      if (product) {
        setProduct({
          ...product,
          data: product.data.map((cat) =>
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

  function onViewProduct(value: Product): void {
    router.push(
      `/${routed.productManagement}/${routed.product}/${routed.preview}/${value.id}`
    );
  }

  const onRefreshClick = useCallback(
    debounce(async () => {
      onCallProApi({});
      showToast("Refresh page successfully!", "success");
    }),
    []
  );

  async function onSearchChange(value: string) {
    onSearchClick(value);
  }

  const onSearchClick = useCallback(
    debounce(async (value: string) => {
      const response = await getAllProductPromotionService({
        page: pageId ? parseInt(pageId, 10) : 1,
        search: value,
      });
      setProduct(response);
    }),
    [pageId]
  );

  return (
    <div>
      <div className="p-4 bg-white">
        <div className="flex">
          <h1 className="font-bold text-xl">Product Listing</h1>
        </div>
        <div className="flex mt-2 ">
          <div className="flex flex-1 gap-2">
            <Input
              className="max-w-md h-9"
              placeholder={"Search Product id, name ..."}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSearchChange?.(e.target.value)
              }
            />
            <ButtonCustom className="w-9 h-9" onClick={onRefreshClick}>
              <HiRefresh size={20} />
            </ButtonCustom>
          </div>
        </div>
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
                      <td className="max-w-72">{value.id}</td>
                      <td>
                        <CashImage
                          width={32}
                          height={32}
                          imageUrl={`${config.BASE_URL}${
                            value?.mainImage
                              ? value?.mainImage[0]?.imageUrl
                              : ""
                          }`}
                        />
                      </td>
                      <td>{value.name}</td>
                      <td>{value.description || "- - -"}</td>
                      <td>{`${value.viewCount} Views`}</td>
                      <td>
                        <div className="flex gap-2 items-center">
                          <Switch
                            disable={loadingUpdate.loading}
                            checked={value.isPublic}
                            onChange={() => toggleProductPromotionStatus(value)}
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
                onPageChange={(page) => {
                  router.push(
                    `/${routed.productManagement}/${routed.product}?page=${page}`
                  );
                  onCallProApi({ page });
                }}
                totalPages={product.pagination?.totalPages || 1}
              />
            </div>
          )}
        </div>
      </div>

      <CenteredLoading loading={loading} />
    </div>
  );
};

export default ProductPromotionPage;
