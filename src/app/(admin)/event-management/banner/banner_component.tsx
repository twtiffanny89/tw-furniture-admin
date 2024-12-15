"use client";

import ButtonCustom from "@/components/custom/ButtonCustom";
import CashImage from "@/components/custom/CashImage";
import showToast from "@/components/error-handle/show-toast";
import CenteredLoading from "@/components/loading/center_loading";
import BannerModal from "@/components/modal/banner_modal";
import ModalConfirm from "@/components/modal/modal_confirm";
import Pagination from "@/components/pagination/Pagination";
import { eventHeader, headerCategory } from "@/constants/data/header_table";
import { base64Cut } from "@/constants/image/base64_cut";
import {
  deletedBannerService,
  getBannerService,
  updateBannerService,
  uploadBannerService,
} from "@/redux/action/event-management/banner_service";
import {
  BannerListModel,
  BannerModel,
} from "@/redux/model/banner/banner_model";
import { ProcessedImage } from "@/redux/model/global/ProcessedImage";
import { config } from "@/utils/config/config";
import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";

interface BannerComponentProps {
  initialData: BannerListModel;
}

const BannerComponent: React.FC<BannerComponentProps> = ({ initialData }) => {
  const [banner, setBanner] = useState<BannerListModel>(initialData);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [modelItem, setModelItem] = useState<BannerModel | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function onCallApi({ page = 1 }: { page?: number }) {
    const response = await getBannerService({
      page,
    });
    setBanner(response);
  }

  function onAddNewClick() {
    setOpenModal(true);
  }

  function onDeleteBanner(item: BannerModel) {
    setModelItem(item);
    setOpenModalDelete(true);
  }

  function onEditBanner(item: BannerModel) {
    setModelItem(item);
    setOpenModal(true);
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

  async function onConfirm(data: ProcessedImage) {
    setOpenModal(false);
    setLoading(true);
    if (modelItem) {
      if (data.type) {
        const response = await updateBannerService({
          fileContent: data.base64.replace(base64Cut.cutHead, ""),
          fileExtension: data.type,
          imageId: modelItem.id,
        });
        if (response.success) {
          onCallApi({});
          showToast(response.message, "success");
        } else {
          showToast(response.message, "error");
        }
      }
    } else {
      const response = await uploadBannerService({
        fileContent: data.base64.replace(base64Cut.cutHead, ""),
        fileExtension: data?.type || ".png",
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
        <h1 className="font-bold text-xl">Banner</h1>
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
                  {eventHeader.map((header, index) => (
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
                {banner?.data.map((value, index) => {
                  const displayIndex =
                    ((banner.pagination?.currentPage || 1) - 1) * 15 +
                    index +
                    1;
                  return (
                    <tr key={value.id} className="hover:bg-gray-200">
                      <td>{displayIndex}</td>
                      <td>{value.id}</td>
                      <td>{value.bannerType}</td>
                      <td className="max-w-full">
                        <CashImage
                          width={361}
                          height={200}
                          imageUrl={`${config.BASE_URL}${value.imageUrl}`}
                        />
                      </td>

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
          {banner.data.length > 0 && (
            <div className="flex justify-end mr-8 mt-8">
              <Pagination
                currentPage={banner.pagination?.currentPage || 1}
                onPageChange={(page) => onCallApi({ page })}
                totalPages={banner.pagination?.totalPages || 1}
              />
            </div>
          )}
        </div>
      </div>

      <BannerModal
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

export default BannerComponent;
