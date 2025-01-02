"use client";

import ButtonCustom from "@/components/custom/ButtonCustom";
import CashImage from "@/components/custom/CashImage";
import { Switch } from "@/components/custom/Switch";
import showToast from "@/components/error-handle/show-toast";
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
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";

const ProductComponent = () => {
  const [product, setProduct] = useState<ProductListModel>();
  const [loadingUpdate, setLoadingUpdate] = useState({
    id: "",
    loading: false,
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const pageId = searchParams.get("page") || "1";

  useEffect(() => {
    const parsedPageId = parseInt(pageId, 10) || 1;
    if (parsedPageId) {
      onCallApi({ page: parsedPageId });
    }
  }, [pageId]);

  async function onCallApi({ page = 1 }: { page?: number }) {
    const response = await getAllProductService({
      page,
    });
    setProduct(response);
  }

  function onAddNewClick() {
    router.push(
      `/${routed.productManagement}/${routed.product}/${routed.create}`
    );
  }

  function onEditBanner(item: Product) {
    router.push(
      `/${routed.productManagement}/${routed.product}/${routed.create}?id=${item.id}`
    );
  }

  async function toggleCategoryStatus(value: Product) {
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

  return (
    <div>
      <div className="p-4 bg-white flex justify-between">
        <h1 className="font-bold text-xl">Product Listing</h1>

        <ButtonCustom
          className="px-4 h-9 ml-2 font-normal text-xs"
          onClick={onAddNewClick}
        >
          <IoMdAdd className="text-white mr-1" size={18} /> Add New
        </ButtonCustom>
      </div>
      <div className="mt-4 bg-white ">
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
                            value.mainImage ? value.mainImage[0]?.imageUrl : ""
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
                onPageChange={(page) => {
                  router.push(
                    `/${routed.productManagement}/${routed.product}?page=${page}`
                  );
                }}
                totalPages={product.pagination?.totalPages || 1}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductComponent;
