"use client";

import ButtonCustom from "@/components/custom/ButtonCustom";
import CashImage from "@/components/custom/CashImage";
import showToast from "@/components/error-handle/show-toast";
import CenteredLoading from "@/components/loading/center_loading";
import BannerModal from "@/components/modal/banner_modal";
import ModalConfirm from "@/components/modal/modal_confirm";
import Pagination from "@/components/pagination/Pagination";
import { eventHeader } from "@/constants/data/header_table";
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
import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";

const BannerPage = () => {
  const [banner, setBanner] = useState<BannerListModel>();
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [modelItem, setModelItem] = useState<BannerModel | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    onCallFirstApi({});
  }, []);

  async function onCallFirstApi({ page = 1 }: { page?: number }) {
    setLoading(true);
    const response = await getBannerService({
      page,
    });
    setBanner(response);
    setLoading(false);
  }

  async function onCallApi({ page = 1 }: { page?: number }) {
    const response = await getBannerService({
      page,
    });
    setBanner(response);
  }

  function onAddNewClick() {
    setModelItem(null); // Clear any existing item data
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
      onCallApi({ page: banner?.pagination?.currentPage });
    } else {
      showToast(response.message, "error");
    }
    setModelItem(null); // Clear after delete
    setLoading(false);
  }

  async function onConfirm(data: ProcessedImage) {
    setOpenModal(false);
    setLoading(true);

    if (modelItem) {
      // Edit mode - only update if new image is provided
      if (data.type) {
        const response = await updateBannerService({
          fileContent: data.base64.replace(base64Cut.cutHead, ""),
          fileExtension: data.type,
          imageId: modelItem.id,
        });
        if (response.success) {
          showToast(response.message, "success");
          onCallApi({ page: banner?.pagination?.currentPage });
        } else {
          showToast(response.message, "error");
        }
      } else {
        // No new image selected, just close modal
        showToast("No changes made", "info");
      }
      setModelItem(null); // Clear after edit
    } else {
      // Create mode
      const response = await uploadBannerService({
        fileContent: data.base64.replace(base64Cut.cutHead, ""),
        fileExtension: data?.type || ".png",
      });

      if (response.success) {
        showToast(response.message, "success");
        onCallApi({});
      } else {
        showToast(response.message, "error");
      }
    }
    setLoading(false);
  }

  // Fixed onClose function to properly clear initial data
  function onClose() {
    setOpenModal(false);
    setModelItem(null); // Clear the initial data when closing
  }

  // Fixed onCloseDelete function
  function onCloseDelete() {
    setOpenModalDelete(false);
    setModelItem(null); // Clear the initial data when closing delete modal
  }

  // Custom header component for consistency
  const CustomHeader = () => (
    <div className="p-4 bg-white rounded-md shadow-sm">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-xl">
          {`Banner Management Total: ${banner?.pagination?.total || 0}`}
        </h1>
        <ButtonCustom
          className="px-4 h-9 ml-2 font-normal text-xs"
          onClick={onAddNewClick}
        >
          <IoMdAdd className="text-white mr-1" size={18} /> Add New
        </ButtonCustom>
      </div>
    </div>
  );

  return (
    <div>
      {/* Use custom header */}
      <CustomHeader />

      <div className="mt-4 bg-white rounded-md shadow-sm">
        <div className="overflow-x-auto min-h-[50vh]">
          <table className="w-full">
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
              {loading ? (
                <tr>
                  <td colSpan={eventHeader.length} className="text-center py-4">
                    <CenteredLoading loading={true} />
                  </td>
                </tr>
              ) : banner?.data && banner.data.length > 0 ? (
                banner.data.map((value, index) => {
                  const displayIndex =
                    ((banner.pagination?.currentPage || 1) - 1) * 5 + index + 1;
                  return (
                    <tr key={value.id} className="hover:bg-gray-200">
                      <td className="border border-gray-300 px-4 py-2">
                        {displayIndex}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex justify-center">
                          <CashImage
                            width={240}
                            height={135}
                            imageUrl={`${config.BASE_URL}${value.imageUrl}`}
                          />
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex gap-2">
                          <ButtonCustom
                            onClick={() => onEditBanner(value)}
                            className="w-6 h-6"
                            title="Edit Banner"
                          >
                            <FiEdit size={14} className="text-white" />
                          </ButtonCustom>
                          <ButtonCustom
                            onClick={() => onDeleteBanner(value)}
                            className="w-6 h-6 bg-red-600 hover:bg-red-700"
                            title="Delete Banner"
                          >
                            <MdDeleteOutline size={16} className="text-white" />
                          </ButtonCustom>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={eventHeader.length} className="text-center py-4">
                    No banners found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {banner && banner.data && banner.data.length > 0 && (
          <div className="flex justify-end mr-8 my-4">
            <Pagination
              currentPage={banner.pagination?.currentPage || 1}
              onPageChange={(page) => onCallApi({ page })}
              totalPages={banner.pagination?.totalPages || 1}
            />
          </div>
        )}
      </div>

      <BannerModal
        isOpen={openModal}
        onConfirm={onConfirm}
        onClose={onClose} // Use the fixed onClose function
        title={modelItem ? "Edit Banner" : "Create Banner"}
        initialData={modelItem}
      />

      <ModalConfirm
        onClose={onCloseDelete} // Use the fixed onCloseDelete function
        isOpen={openModalDelete}
        onConfirm={onConfirmDelete}
      />

      <CenteredLoading loading={loading} />
    </div>
  );
};

export default BannerPage;
