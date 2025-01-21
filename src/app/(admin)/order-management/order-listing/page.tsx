"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import ButtonCustom from "@/components/custom/ButtonCustom";
import CashImage from "@/components/custom/CashImage";
import Input from "@/components/custom/Input";
import showToast from "@/components/error-handle/show-toast";
import CenteredLoading from "@/components/loading/center_loading";
import Pagination from "@/components/pagination/Pagination";
import { headerAllOrder } from "@/constants/data/header_table";
import {
  FilterOrderStatus,
  PaymentStatus,
} from "@/constants/enum/order-status";
import { routed } from "@/constants/navigation/routed";
import { getAllProductOrderService } from "@/redux/action/order-management/order-service";
import {
  OrderDetailModel,
  OrderListModel,
} from "@/redux/model/order/order-model";
import { config } from "@/utils/config/config";
import { formatTimestamp } from "@/utils/date/format_timestamp";
import { debounce } from "@/utils/debounce/debounce";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { HiRefresh } from "react-icons/hi";

const AllOrderPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [orderData, setOrderData] = useState<OrderListModel | null>(null);
  const rounter = useRouter();
  const searchParams = useSearchParams();
  const pageId = searchParams.get("page") || "1";
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    PaymentStatus.ALL
  );
  const [filterStatus, setFilterStatus] = useState<FilterOrderStatus>(
    FilterOrderStatus.ALL
  );

  async function onCallApi({
    page = pageId ? parseInt(pageId, 10) : 1,
    search,
    filterBy,
    paymentStatus,
  }: {
    page?: number;
    search?: string;
    filterBy?: string;
    paymentStatus?: string;
  }) {
    setLoading(true);
    const response = await getAllProductOrderService({
      page,
      search,
      filterBy,
      paymentStatus,
    });
    setOrderData(response);
    setLoading(false);
  }

  useEffect(() => {
    const parsedPageId = parseInt(pageId, 10) || 1;
    if (parsedPageId && !orderData) {
      onCallApi({ page: parsedPageId });
    }
  }, [pageId, orderData]);

  const onRefreshClick = useCallback(
    debounce(async () => {
      onCallApi({});
      showToast("Refresh page successfully!", "success");
    }),
    []
  );

  function onSearchChange(value: string) {
    rounter.push(
      `/${routed.orderManagement}/${routed.allOrder}?search=${value}`
    );
    onSearchClick(value);
  }

  const onSearchClick = useCallback(
    debounce(async (value: string) => {
      const response = await getAllProductOrderService({
        page: pageId ? parseInt(pageId, 10) : 1,
        search: value,
      });
      setOrderData(response);
    }),
    [pageId]
  );

  function onViewProduct(value: OrderDetailModel) {
    rounter.push(`/${routed.orderManagement}/${routed.allOrder}/${value.id}`);
  }

  function onPaymentFilter(e: React.ChangeEvent<HTMLSelectElement>) {
    setPaymentStatus(e.target.value as PaymentStatus);
    onCallApi({
      paymentStatus:
        e.target.value == PaymentStatus.ALL ? undefined : e.target.value,
    });
  }

  function onFilterOrderStatus(e: React.ChangeEvent<HTMLSelectElement>) {
    setFilterStatus(e.target.value as FilterOrderStatus);
    onCallApi({ filterBy: e.target.value });
  }

  return (
    <div>
      <div className="p-4 bg-white">
        <h1 className="font-bold text-xl">Order Management</h1>
        <div className="flex mt-2 ">
          <div className="flex flex-1 gap-2">
            <Input
              className="max-w-md h-9"
              placeholder={"Search order by id..."}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSearchChange?.(e.target.value)
              }
            />
            <ButtonCustom className="w-9 h-9" onClick={onRefreshClick}>
              <HiRefresh size={20} />
            </ButtonCustom>
          </div>
          <div className="flex space-x-8 items-center">
            <div className="flex space-x-8 items-center">
              <select
                onChange={onFilterOrderStatus}
                value={filterStatus}
                className="mt-1 w-full bg-[#00000010] border border-gray-300 rounded max-w-96 flex items-center px-4 h-9 cursor-pointer"
              >
                <option value={FilterOrderStatus.ALL}>All</option>
                <option value={FilterOrderStatus.PROCESS}>Process</option>
                <option value={FilterOrderStatus.SUCCESS}>Success</option>
                <option value={FilterOrderStatus.FAIL}>Fail</option>
              </select>
            </div>
            <div className="flex space-x-8 items-center">
              <select
                onChange={onPaymentFilter}
                value={paymentStatus}
                className="mt-1 w-full bg-[#00000010] border border-gray-300 rounded max-w-96 flex items-center px-4 h-9 cursor-pointer"
              >
                <option value={PaymentStatus.ALL}>All</option>
                <option value={PaymentStatus.PAID}>Paid</option>
                <option value={PaymentStatus.UNPAID}>Unpaid</option>
              </select>
            </div>
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
                        <td
                          className={
                            value.paymentStatus === PaymentStatus.PAID
                              ? "text-primary"
                              : "text-red-500"
                          }
                        >
                          {value.paymentStatus || "- - -"}
                        </td>
                        <td>${value.totalAmount || "- - -"}</td>
                        <td className="text-primary font-semibold">
                          {value.status || "- - -"}
                        </td>

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
                onPageChange={(value) => {
                  rounter.push("/order-management/order-listing?page=" + value);
                  onCallApi({ page: value });
                }}
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
