/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ButtonCustom from "@/components/custom/ButtonCustom";
import CashImage from "@/components/custom/CashImage";
import {
  productPreviewSuggestionHeader,
  variantsPreviewHeader,
} from "@/constants/data/header_table";
import { routed } from "@/constants/navigation/routed";
import {
  getProductPreviewByIdService,
  getProductSuggestionService,
} from "@/redux/action/product-management/product-service";
import { ProductDetailModel } from "@/redux/model/product/product-detail";
import {
  ProductPreview,
  ProductPreviewListModel,
} from "@/redux/model/product/product-preview-model";
import { config } from "@/utils/config/config";
import { formatTimestamp } from "@/utils/date/format_timestamp";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";

const PreveiwPage = ({ params }: { params: { id: string } }) => {
  const [productDetail, setProductDetail] = useState<ProductDetailModel | null>(
    null
  );
  const [productSuggestion, setProductSuggestion] =
    useState<ProductPreviewListModel | null>(null);
  const productId = params.id;
  const router = useRouter();

  useEffect(() => {
    getProductDetail();
    getProductSuggestion();
  }, []);

  async function getProductSuggestion() {
    const resposne = await getProductSuggestionService({
      productId: productId!,
      page: 1,
      limit: 1000,
    });

    setProductSuggestion(resposne.data);
  }

  async function getProductDetail() {
    const response = await getProductPreviewByIdService({
      productId: productId,
    });
    setProductDetail(response.data);
  }

  const colorAttribute = productDetail?.attributes?.find(
    (attr) => attr.attribute.name === "Color"
  );

  function onViewProduct(value: ProductPreview): void {
    router.push(
      `/${routed.productManagement}/${routed.product}/${routed.preview}/${value.productTo.id}`
    );
  }

  return (
    <div>
      <div className="p-4 bg-white flex justify-between">
        <h1 className="font-bold text-xl">Product Detail</h1>
      </div>
      <div className="mt-4 bg-white p-4">
        <h3>Product Information</h3>
        <div className="h-[1px] my-4 w-full bg-slate-400" />
        <div className="flex flex-col gap-1">
          <div className="flex space-x-8 items-center">
            <h6 className="opacity-50 text-sm flex-[1]">Name</h6>
            <p className="flex-[4] text-sm">{productDetail?.name}</p>
          </div>
          <div className="flex space-x-8 items-center">
            <h6 className="opacity-50 text-sm flex-[1]">Category</h6>
            <p className="flex-[4] text-sm">{productDetail?.category?.name}</p>
          </div>
          <div className="flex space-x-8 items-center">
            <h6 className="opacity-50 text-sm flex-[1]">Sub-Category</h6>
            <p className="flex-[4] text-sm">
              {productDetail?.subcategory?.name}
            </p>
          </div>
          <div className="flex space-x-8 items-center">
            <h6 className="opacity-50 text-sm flex-[1]">Base Price</h6>
            <p className="flex-[4] text-sm">{productDetail?.basePrice}</p>
          </div>
          <div className="flex space-x-8 items-center">
            <h6 className="opacity-50 text-sm flex-[1]">Decription</h6>
            <p className="flex-[4] text-sm">
              {productDetail?.description || "- - -"}
            </p>
          </div>
          <div className="flex space-x-8 items-center">
            <h6 className="opacity-50 text-sm flex-[1]">Product View</h6>
            <p className="flex-[4] text-sm">
              {productDetail?.viewCount + " Viewers"}
            </p>
          </div>
          <div className="flex space-x-8 items-center">
            <h6 className="opacity-50 text-sm flex-[1]">Status</h6>
            <p className="flex-[4] text-sm">
              {productDetail?.isPublic ? "Active" : "InActive"}
            </p>
          </div>
          <div className="flex space-x-8 items-center">
            <h6 className="opacity-50 text-sm flex-[1]">Create At</h6>
            <p className="flex-[4] text-sm">
              {formatTimestamp(productDetail?.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white p-4">
        <h3>Product Attribude</h3>
        <div className="h-[1px] my-4 w-full bg-slate-400" />
        <div className="flex flex-wrap gap-4">
          {colorAttribute?.values.map((value) => (
            <div
              key={value.id}
              className="flex flex-col items-center justify-center  border rounded-md"
            >
              <CashImage
                width={96}
                height={96}
                imageUrl={`${config.BASE_URL}${value.attributeValue?.image[0]?.imageUrl}`}
              />
              <span className="mt-1 text-sm font-bold">
                {value.attributeValue.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 bg-white p-4">
        <h3>Product Variants</h3>
        <div className="h-[1px] my-4 w-full bg-slate-400" />
        <div className="mt-4 overflow-x-auto">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead className="bg-gray-100">
              <tr>
                {variantsPreviewHeader.map((header, index) => (
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
              {productDetail?.variants?.map((value, index) => (
                <tr key={value.id} className="hover:bg-gray-200">
                  <td>{index + 1}</td>
                  <td>
                    {value?.attributes?.map((attribute, index) =>
                      index === value.attributes.length - 1
                        ? attribute.attributeValue.label
                        : `${attribute.attributeValue.label}, `
                    )}
                  </td>
                  <td>{value.price}</td>
                  <td>{value.stock}</td>
                  <td>{value.discount || "- - -"}</td>
                  <td>{value.discountType || "- - -"}</td>
                  <td>
                    {formatTimestamp(value?.discountStartDate) || "- - -"}
                  </td>
                  <td>{formatTimestamp(value?.discountEndDate) || "- - -"}</td>
                  <td>
                    <div className="flex gap-2">
                      {value?.images.map((img, index) => (
                        <CashImage
                          key={index}
                          imageUrl={`${config.BASE_URL}${img?.imageUrl}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td>{formatTimestamp(value.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {productSuggestion && productSuggestion?.data.length > 0 && (
        <div className="mt-4 bg-white p-4">
          <h3>Product Suggestion</h3>
          <div className="h-[1px] my-4 w-full bg-slate-400" />
          <div>
            <div className="overflow-x-auto">
              <table>
                <thead className="bg-gray-100">
                  <tr>
                    {productPreviewSuggestionHeader.map((header, index) => (
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
                  {productSuggestion?.data.map((value, index: number) => {
                    const displayIndex =
                      ((productSuggestion.pagination?.currentPage || 1) - 1) *
                        15 +
                      index +
                      1;
                    return (
                      <tr key={value.id} className="hover:bg-gray-200">
                        <td>{displayIndex}</td>
                        <td>{value.productTo.id}</td>
                        <td>{value.productTo.name}</td>
                        <td>{value.productTo.description}</td>
                        <td>{value.productTo.viewCount}</td>
                        <td>
                          {formatTimestamp(value.productTo.createdAt) ||
                            "- - -"}
                        </td>
                        <td>
                          <ButtonCustom
                            variant="cancel"
                            onClick={() => onViewProduct(value)}
                            className="w-6 h-6"
                          >
                            <FaEye size={14} className="text-white" />
                          </ButtonCustom>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreveiwPage;
