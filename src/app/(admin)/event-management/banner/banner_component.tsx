"use client";

import Button from "@/components/custom/button";
import CashImage from "@/components/custom/CashImage";
import showToast from "@/components/error-handle/show-toast";
import ModalConfirm from "@/components/modal/modal_confirm";
import Pagination from "@/components/pagination/pagination";
import { eventHeader, headerCategory } from "@/constants/data/header_table";
import {
  deletedBannerService,
  getBannerService,
} from "@/redux/action/event-management/banner_service";
import {
  BannerListModel,
  BannerModel,
} from "@/redux/model/banner/banner_model";
import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";

interface BannerComponentProps {
  initialData: BannerListModel;
}

const BannerComponent: React.FC<BannerComponentProps> = ({ initialData }) => {
  const [banner, setBanner] = useState<BannerListModel>(initialData);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [modelItem, setModelItem] = useState<BannerModel | null>(null);

  async function onCallApi({ page = 1 }: { page?: number }) {
    const response = await getBannerService({
      page,
    });
    setBanner(response);
  }

  function onAddNewClick() {}

  function onDeleteBanner(item: BannerModel) {
    setModelItem(item);
    setOpenModalDelete(true);
  }

  async function onConfirmDelete() {
    const response = await deletedBannerService({ id: modelItem?.id });
    if (response.success) {
      showToast(response.message, "success");
      onCallApi({});
    } else {
      showToast(response.message, "error");
    }
  }

  return (
    <div>
      <div className="p-4 bg-white flex justify-between">
        <h1 className="font-bold text-xl">Banner</h1>
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
                      <td className="max-w-[361px]">
                        <CashImage
                          borderRadius={4}
                          width={361}
                          height={200}
                          fit="contain"
                          imageUrl={`${process.env.NEXT_PUBLIC_BASE_URL}${value.imageUrl}`}
                        />
                      </td>

                      <td>
                        <button
                          onClick={() => onDeleteBanner(value)}
                          className="w-6 h-6 bg-red-600 rounded flex justify-center items-center"
                        >
                          <MdDeleteOutline size={16} className="text-white" />
                        </button>
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

      <ModalConfirm
        onClose={() => setOpenModalDelete(false)}
        isOpen={openModalDelete}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
};

export default BannerComponent;
