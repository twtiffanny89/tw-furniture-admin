"use client";

import ButtonCustom from "@/components/custom/ButtonCustom";
import showToast from "@/components/error-handle/show-toast";
import CenteredLoading from "@/components/loading/center_loading";
import AttributeModal from "@/components/modal/attribute-modal";
import ModalConfirm from "@/components/modal/modal_confirm";
import Pagination from "@/components/pagination/Pagination";
import { attributeHeader } from "@/constants/data/header_table";
import {
  createAttributeService,
  deletedAttributeService,
  getAttributeService,
  onUpdateAttribute,
} from "@/redux/action/product-management/attribute-service";
import {
  AttributeListModel,
  AttributeModel,
} from "@/redux/model/attribute-model/attribute-model";

import { formatTimestamp } from "@/utils/date/format_timestamp";
import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";

interface AttributeComponentProps {
  initialData: AttributeListModel;
}

const AttributeComponent: React.FC<AttributeComponentProps> = ({
  initialData,
}) => {
  const [attribute, setAttribute] = useState<AttributeListModel>(initialData);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [modelItem, setModelItem] = useState<AttributeModel | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function onCallApi({ page = 1 }: { page?: number }) {
    const response = await getAttributeService({
      page,
    });
    setAttribute(response);
  }

  function onAddNewClick() {
    setOpenModal(true);
  }

  function onDeleteAttribte(item: AttributeModel) {
    setModelItem(item);
    setOpenModalDelete(true);
  }

  function onEditAttribte(item: AttributeModel) {
    setModelItem(item);
    setOpenModal(true);
  }

  async function onConfirmDelete() {
    setOpenModalDelete(false);
    setLoading(true);
    const response = await deletedAttributeService({ id: modelItem?.id });
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
      const response = await onUpdateAttribute({
        id: modelItem.id,
        data: { name: data },
      });
      if (response.success) {
        onCallApi({});
        showToast(response.message, "success");
      } else {
        showToast(response.message, "error");
      }
    } else {
      const response = await createAttributeService({ name: data });
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
                      <td>
                        <div className="flex gap-2">
                          <ButtonCustom
                            onClick={() => onEditAttribte(value)}
                            className="w-6 h-6 "
                          >
                            <FiEdit size={14} className="text-white" />
                          </ButtonCustom>
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
          {attribute.data.length > 0 && (
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
        title="Create Banner"
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

export default AttributeComponent;
