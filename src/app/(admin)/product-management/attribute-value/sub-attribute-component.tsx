"use client";

import ButtonCustom from "@/components/custom/ButtonCustom";
import showToast from "@/components/error-handle/show-toast";
import CenteredLoading from "@/components/loading/center_loading";
import SubAttributeModal from "@/components/modal/sub-attribute-modal";
import Pagination from "@/components/pagination/Pagination";
import { subAttributeHeader } from "@/constants/data/header_table";
import { AttributeListModel } from "@/redux/model/attribute-model/attribute-model";
import { SubAttrinuteListModel } from "@/redux/model/sub-attribute-model/sub-attribute-model";
import { formatTimestamp } from "@/utils/date/format_timestamp";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  createAttributeValueService,
  getSubAttributeService,
} from "@/redux/action/product-management/sub-attribude-service";

interface AttributeComponentProps {
  initialData: SubAttrinuteListModel;
  initialAttribute: AttributeListModel;
}

const SubAttributeComponent: React.FC<AttributeComponentProps> = ({
  initialData,
  initialAttribute,
}) => {
  const [subAttribute, setSubAttribute] =
    useState<SubAttrinuteListModel>(initialData);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function onCallApi({ page = 1 }: { page?: number }) {
    const response = await getSubAttributeService({
      page,
    });
    setSubAttribute(response);
  }

  function onAddNewClick() {
    setOpenModal(true);
  }

  async function onConfirm(data: string) {
    setOpenModal(false);
    setLoading(true);

    const filter = initialAttribute.data.find((item) => item.name === "Size");
    const response = await createAttributeValueService({
      label: data,
      value: data,
      attributeId: filter?.id,
    });
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
    <div>
      <div className="p-4 bg-white flex justify-between">
        <h1 className="font-bold text-xl">Sub Attribute</h1>
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
                  {subAttributeHeader.map((header, index) => (
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
                {subAttribute?.data.map((value, index) => {
                  const displayIndex =
                    ((subAttribute.pagination?.currentPage || 1) - 1) * 15 +
                    index +
                    1;
                  return (
                    <tr key={value.id} className="hover:bg-gray-200">
                      <td>{displayIndex}</td>
                      <td>{value.id}</td>
                      <td>{value.label}</td>
                      <td className="text-amber-700 font-semibold">
                        {value.valueType}
                      </td>
                      <td>{formatTimestamp(value.createdAt)}</td>
                      <td>{value.attributeId}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {subAttribute.data.length > 0 && (
            <div className="flex justify-end mr-8 mt-8">
              <Pagination
                currentPage={subAttribute.pagination?.currentPage || 1}
                onPageChange={(page) => onCallApi({ page })}
                totalPages={subAttribute.pagination?.totalPages || 1}
              />
            </div>
          )}
        </div>
      </div>

      <SubAttributeModal
        isOpen={openModal}
        onConfirm={onConfirm}
        onClose={onClose}
        title="Create Attribute Value"
      />

      <CenteredLoading loading={loading} />
    </div>
  );
};

export default SubAttributeComponent;
