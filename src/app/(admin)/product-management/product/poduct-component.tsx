"use client";

import ButtonCustom from "@/components/custom/ButtonCustom";
import showToast from "@/components/error-handle/show-toast";
import CenteredLoading from "@/components/loading/center_loading";
import ModalConfirm from "@/components/modal/modal_confirm";
import Pagination from "@/components/pagination/Pagination";
import { productHeader } from "@/constants/data/header_table";
import {
  deletedBannerService,
  getBannerService,
} from "@/redux/action/event-management/banner_service";

import { Product, ProductListModel } from "@/redux/model/product/product-model";
import { formatTimestamp } from "@/utils/date/format_timestamp";
import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";

interface ProductComponentProps {
  initialData: ProductListModel;
}

const ProductComponent: React.FC<ProductComponentProps> = ({ initialData }) => {
  const [product, setProduct] = useState<ProductListModel>(initialData);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [modelItem, setModelItem] = useState<Product | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  async function onCallApi({ page = 1 }: { page?: number }) {
    const response = await getBannerService({
      page,
    });
    setProduct(response);
  }

  useEffect(() => {}, []);

  function onAddNewClick() {}

  function onDeleteBanner(item: Product) {
    setModelItem(item);
    setOpenModalDelete(true);
  }

  function onEditBanner(item: Product) {
    setModelItem(item);
  }

  async function onConfirmDelete() {
    setOpenModalDelete(false);
    setLoading(true);
    const response = await deletedBannerService({ id: modelItem?.id });
    if (response.success) {
      showToast(response.message, "success");
      onCallApi({});
    } else {
      showToast(response.message, "error");
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="p-4 bg-white flex justify-between">
        <h1 className="font-bold text-xl">Product</h1>
      </div>
      <div className="mt-4 bg-white min-h-full">
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
                      <td>{value.description}</td>
                      <td>{value.viewCount}</td>
                      <td>{value.isPublic ? "true" : "false"}</td>
                      <td>{formatTimestamp(value.createdAt)}</td>
                      <td>{value.categoryId || "- - -"}</td>
                      <td>{value.category?.name || "- - -"}</td>
                      <td>{value.subcategoryId || "- - -"}</td>
                      <td>{value.subcategory?.name || "- - -"}</td>
                      <td>
                        <div className="flex gap-2">
                          <ButtonCustom
                            onClick={() => onEditBanner(value)}
                            className="w-6 h-6 "
                          >
                            <FiEdit size={14} className="text-white" />
                          </ButtonCustom>
                          <button
                            onClick={() => onDeleteBanner(value)}
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
          {product.data.length > 0 && (
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

      <ModalConfirm
        onClose={() => setOpenModalDelete(false)}
        isOpen={openModalDelete}
        onConfirm={onConfirmDelete}
      />

      <CenteredLoading loading={loading} />
    </div>
  );
};

export default ProductComponent;
