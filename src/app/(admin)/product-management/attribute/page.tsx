"use client";

import ButtonCustom from "@/components/custom/ButtonCustom";
import showToast from "@/components/error-handle/show-toast";
import CenteredLoading from "@/components/loading/center_loading";
import AttributeModal from "@/components/modal/attribute-modal";
import Pagination from "@/components/pagination/Pagination";
import { attributeHeader } from "@/constants/data/header_table";
import {
  createAttributeService,
  getAttributeService,
} from "@/redux/action/product-management/attribute-service";
import { AttributeListModel } from "@/redux/model/attribute-model/attribute-model";
import { formatTimestamp } from "@/utils/date/format_timestamp";
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";

const AttributeComponent = () => {
  const [attribute, setAttribute] = useState<AttributeListModel>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    onCallApi({});
  }, []);

  async function onCallApi({ page = 1 }: { page?: number }) {
    const response = await getAttributeService({
      page,
    });
    setAttribute(response);
  }

  function onAddNewClick() {
    setOpenModal(true);
  }

  async function onConfirm(data: string) {
    setOpenModal(false);
    setLoading(true);

    const response = await createAttributeService({ name: data });
    if (response.success) {
      onCallApi({});
      showToast(response.message, "success");
    } else {
      showToast(response.message, "error");
    }

    setLoading(false);
  }

  function onClose() {
    setOpenModal(false);
  }
  return (
    <div className="min-h-screen">
      <div className="p-4 bg-white flex justify-between">
        <h1 className="font-bold text-xl">Attribute </h1>
        <ButtonCustom
          className="px-4 h-9 ml-2 font-normal text-xs"
          onClick={onAddNewClick}
        >
          <IoMdAdd className="text-white mr-1" size={18} /> Add New
        </ButtonCustom>
      </div>
      <div className="mt-4 bg-white min-h-full">
        <div>
          <div className="overflow-x-auto min-h-[50vh]">
            <table>
              <thead className="bg-gray-100">
                <tr>
                  {attributeHeader.map((header, index) => (
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
                {attribute?.data.map((value, index) => {
                  const displayIndex =
                    ((attribute.pagination?.currentPage || 1) - 1) * 15 +
                    index +
                    1;
                  return (
                    <tr key={value.id} className="hover:bg-gray-200">
                      <td>{displayIndex}</td>
                      <td>{value.id}</td>
                      <td>{value.name}</td>
                      <td>{formatTimestamp(value.createdAt)}</td>
                      <td>{formatTimestamp(value.updatedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {attribute && attribute.data.length > 0 && (
            <div className="flex justify-end mr-8 mt-8">
              <Pagination
                currentPage={attribute.pagination?.currentPage || 1}
                onPageChange={(page) => onCallApi({ page })}
                totalPages={attribute.pagination?.totalPages || 1}
              />
            </div>
          )}
        </div>
      </div>
      <AttributeModal
        isOpen={openModal}
        onConfirm={onConfirm}
        onClose={onClose}
        title="Create Attribude"
      />
      <CenteredLoading loading={loading} />
    </div>
  );
};

export default AttributeComponent;
