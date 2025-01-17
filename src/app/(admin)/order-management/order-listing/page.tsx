"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import ButtonCustom from "@/components/custom/ButtonCustom";
import CashImage from "@/components/custom/CashImage";
import Input from "@/components/custom/Input";
import showToast from "@/components/error-handle/show-toast";
import CenteredLoading from "@/components/loading/center_loading";
import Pagination from "@/components/pagination/Pagination";
import { headerAllOrder } from "@/constants/data/header_table";
import { routed } from "@/constants/navigation/routed";
import { getAllProductOrderService } from "@/redux/action/order-management/order-service";
import { getAllProductService } from "@/redux/action/product-management/product-service";
import {
  OrderDetailModel,
  OrderListModel,
} from "@/redux/model/order/order-model";
import { config } from "@/utils/config/config";
import { formatTimestamp } from "@/utils/date/format_timestamp";
import { debounce } from "@/utils/debounce/debounce";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { HiRefresh } from "react-icons/hi";

const AllOrderPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [orderData, setOrderData] = useState<OrderListModel | null>(null);
  const rounter = useRouter();

  async function onCallApi({
    page = 1,
    search = "",
  }: {
    page?: number;
    search?: string;
  }) {
    setLoading(true);
    const response = await getAllProductOrderService({ page, search });
    setOrderData(response);
    setLoading(false);
  }

  useEffect(() => {
    onCallApi({});
  }, []);

  const onRefreshClick = useCallback(
    debounce(async () => {
      onCallApi({});
      showToast("Refresh page successfully!", "success");
    }),
    []
  );

  function onSearchChange(value: string) {}

  function onViewProduct(value: OrderDetailModel) {
    rounter.push(`/${routed.orderManagement}/${routed.allOrder}/${value.id}`);
  }

  return (
    <div>
      <div className="p-4 bg-white">
        <h1 className="font-bold text-xl">Order Management</h1>
        <div className="flex mt-2 ">
          <div className="flex flex-1 gap-2">
            <Input
              className="max-w-md h-9"
              placeholder={""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSearchChange?.(e.target.value)
              }
            />
            <ButtonCustom className="w-9 h-9" onClick={onRefreshClick}>
              <HiRefresh size={20} />
            </ButtonCustom>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white">
        <div>
          <div className="overflow-x-auto min-h-[50vh]">
            <table>
              <thead className="bg-gray-100">
                <tr>
                  {headerAllOrder.map((header, index) => (
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
                {orderData?.data.map(
                  (value: OrderDetailModel, index: number) => {
                    const displayIndex =
                      ((orderData.pagination?.currentPage || 1) - 1) * 15 +
                      index +
                      1;
                    return (
                      <tr key={value.id} className="hover:bg-gray-200">
                        <td>{displayIndex}</td>
                        <td className="max-w-72">{value.id}</td>

                        <td>{value?.user?.phoneNumber || "- - -"}</td>

                        <td>
                          {`${value.user?.firstName ?? ""} ${
                            value.user?.lastName ?? ""
                          }`.trim() ||
                            "- - -" ||
                            "- - -"}
                        </td>
                        <td>{value.paymentMethod || "- - -"}</td>
                        <td>{value.paymentStatus || "- - -"}</td>
                        <td>{value.status || "- - -"}</td>
                        <td>{value.totalAmount || "- - -"}</td>
                        <td>{formatTimestamp(value.createdAt)}</td>
                        <td className="max-w-[380px]">
                          <div className="flex gap-2">
                            {value?.items.map((img, index) => (
                              <CashImage
                                key={index}
                                imageUrl={`${config.BASE_URL}${img?.variant?.images[0]?.imageUrl}`}
                              />
                            ))}
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <ButtonCustom
                              variant="cancel"
                              onClick={() => onViewProduct(value)}
                              className="w-6 h-6"
                            >
                              <FaEye size={14} className="text-white" />
                            </ButtonCustom>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
          {orderData && orderData.data.length > 0 && (
            <div className="flex justify-end mr-8 mt-8">
              <Pagination
                currentPage={orderData.pagination?.currentPage || 1}
                onPageChange={(value) => onCallApi({ page: value })}
                totalPages={orderData.pagination?.totalPages || 1}
              />
            </div>
          )}
        </div>
      </div>
      <CenteredLoading loading={loading} />
    </div>
  );
};

export default AllOrderPage;
