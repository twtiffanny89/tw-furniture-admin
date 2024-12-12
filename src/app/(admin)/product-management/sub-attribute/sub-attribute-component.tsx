"use client";

import Button from "@/components/custom/button";
import showToast from "@/components/error-handle/show-toast";
import CenteredLoading from "@/components/loading/center_loading";
import AttributeModal from "@/components/modal/attribute-modal";
import ModalConfirm from "@/components/modal/modal_confirm";
import SubAttributeModal from "@/components/modal/sub-attribute-modal";
import Pagination from "@/components/pagination/pagination";
import {
  attributeHeader,
  subAttributeHeader,
} from "@/constants/data/header_table";
import {
  createAttributeService,
  deletedAttributeService,
  getAttributeService,
  onUpdateAttribute,
} from "@/redux/action/product-management/attribute-service";
import {
  createSubAttributeService,
  deletedSubAttributeService,
  getSubAttributeService,
  onUpdateSubAttribute,
} from "@/redux/action/product-management/sub-attribude-service";
import {
  AttributeListModel,
  AttributeModel,
} from "@/redux/model/attribute-model/attribute-model";
import {
  SubAttributeModel,
  SubAttrinuteListModel,
} from "@/redux/model/sub-attribute-model/sub-attribute-model";

import { formatTimestamp } from "@/utils/date/format_timestamp";
import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";

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
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [modelItem, setModelItem] = useState<SubAttributeModel | null>(null);
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

  function onDeleteAttribte(item: SubAttributeModel) {
    setModelItem(item);
    setOpenModalDelete(true);
  }

  function onEditAttribte(item: SubAttributeModel) {
    setModelItem(item);
    setOpenModal(true);
  }

  async function onConfirmDelete() {
    setOpenModalDelete(false);
    setLoading(true);
    const response = await deletedSubAttributeService({ id: modelItem?.id });
    if (response.success) {
      onCallApi({});
      showToast(response.message, "success");
    } else {
      showToast(response.message, "error");
    }
    setLoading(false);
  }

  async function onConfirm(data: string) {
    setOpenModal(false);
    setLoading(true);
    if (modelItem) {
      const filter = initialAttribute.data.find((item) => item.name === "Size");
      const response = await onUpdateSubAttribute({
        id: modelItem.id,
        data: { attributeId: filter?.id, label: data, value: data },
      });
      if (response.success) {
        onCallApi({});
        showToast(response.message, "success");
      } else {
        showToast(response.message, "error");
      }
    } else {
      const filter = initialAttribute.data.find((item) => item.name === "Size");
      const response = await createSubAttributeService({
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
        <Button
          className="px-4 h-9 ml-2 font-normal text-xs"
          onClick={onAddNewClick}
        >
          <IoMdAdd className="text-white mr-1" size={18} /> Add New
        </Button>
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
                      <td>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => onEditAttribte(value)}
                            className="w-6 h-6 "
                          >
                            <FiEdit size={14} className="text-white" />
                          </Button>
                          <button
                            onClick={() => onDeleteAttribte(value)}
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
        title="Create Sub-Attribute"
        initialData={modelItem}
      />

      <ModalConfirm
        onClose={() => setOpenModalDelete(false)}
        isOpen={openModalDelete}
        onConfirm={onConfirmDelete}
      />

      <CenteredLoading loading={loading} />
    </div>
  );
};

export default SubAttributeComponent;
