/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import {
  getProductOrderDetailService,
  updateProductOrderDetailService,
} from "@/redux/action/order-management/order-service";
import { IoChevronBackOutline } from "react-icons/io5";
import {
  OrderDetailModel,
  ProductOrderModel,
} from "@/redux/model/order/order-model";
import { openGoogleMap } from "@/utils/google-map/open_google_map";
import CashImage from "@/components/custom/CashImage";
import { config } from "@/utils/config/config";
import { headerProductOrder } from "@/constants/data/header_table";
import { routed } from "@/constants/navigation/routed";
import CenteredLoading from "@/components/loading/center_loading";
import { useRouter } from "next/navigation";
import showToast from "@/components/error-handle/show-toast";
import { OrderStatus, PaymentStatus } from "@/constants/enum/order-status";

const Page = ({ params }: { params: { id: string } }) => {
  const orderId = params.id;
  const [orderDetail, setOrderDetail] = useState<OrderDetailModel | null>(null);
  const [loading, setLoading] = useState(false);
  const rounter = useRouter();

  useEffect(() => {
    onCallFirstApi();
  }, []);

  async function onCallFirstApi() {
    setLoading(true);
    const response = await getProductOrderDetailService({
      orderId,
    });
    setOrderDetail(response);
    setLoading(false);
  }

  async function onUpdateOrderStatus(e: React.ChangeEvent<HTMLSelectElement>) {
    if (orderDetail?.status === e.target.value) return;
    setOrderDetail({ ...orderDetail!, status: e.target.value });
    const response = await updateProductOrderDetailService({
      orderId,
      status: e.target.value,
    });
    if (response.success) {
      showToast("Update order status successfully", "success");
    } else {
      showToast("Update order status failed", "error");
    }
  }

  async function onUpdatePaymentStatus(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    if (orderDetail?.paymentStatus === e.target.value) return;
    setOrderDetail({ ...orderDetail!, paymentStatus: e.target.value });
    const response = await updateProductOrderDetailService({
      orderId,
      status: orderDetail?.status,
      paymentStatus: e.target.value,
    });
    if (response.success) {
      showToast("Update payment status successfully", "success");
    } else {
      showToast("Update payment status failed", "error");
    }
  }
  return (
    <div>
      <div className="p-4 bg-white flex items-center">
        <IoChevronBackOutline
          className="cursor-pointer"
          size={28}
          onClick={() => rounter.back()}
        />
        <div className="flex items-center">
          <h1 className="font-bold text-xl ml-4">Order Detail</h1>
          <h1 className="font-bold text-xl ml-1">{orderDetail?.id ?? ""}</h1>
        </div>
      </div>

      <div className="p-4 mt-4 bg-white">
        <div className=" bg-white">
          <h1 className="font-bold text-lg">Customer Information</h1>
        </div>

        <div className="h-[1px] w-full bg-[#D9D9D9] my-4" />

        <div className="gap-2 flex flex-col">
          <div className="flex space-x-8 items-center">
            <h6 className="opacity-50 text-sm flex-[1]">Contact Number</h6>
            <p className="flex-[4] text-sm">
              {orderDetail?.user.phoneNumber || "- - -"}
            </p>
          </div>
          <div className="flex space-x-8 items-center">
            <h6 className="opacity-50 text-sm flex-[1]">Customer Name</h6>
            <p className="flex-[4] text-sm">
              {`${orderDetail?.user?.firstName ?? ""} ${
                orderDetail?.user?.lastName ?? ""
              }`.trim() ||
                "- - -" ||
                "- - -"}
            </p>
          </div>
          <div className="flex space-x-8 items-center">
            <h6 className="opacity-50 text-sm flex-[1]">Delivery Address</h6>
            <p className="flex-[4] text-sm">
              {orderDetail?.address?.combinedString || "- - -"}
            </p>
          </div>

          <div className="flex space-x-8 items-center">
            <h6 className="opacity-50 text-sm flex-[1]">
              View Customer Address
            </h6>
            <p
              className="flex-[4] text-sm underline cursor-pointer hover:text-primary"
              onClick={() =>
                openGoogleMap(
                  String(orderDetail?.address?.lat ?? ""),
                  String(orderDetail?.address?.lng ?? "")
                )
              }
            >
              {`${orderDetail?.address?.lat} ${orderDetail?.address?.lng}` ||
                "- - -"}
            </p>
          </div>

          {orderDetail?.address?.image &&
            orderDetail.address.image.length > 0 && (
              <div className="flex space-x-8 items-center">
                <h6 className="opacity-50 text-sm flex-[1]">
                  Photo Address Delivery
                </h6>
                <div className="flex gap-2 flex-[4]">
                  {orderDetail?.address?.image.map((image, index) => (
                    <CashImage
                      key={index}
                      width={44}
                      height={44}
                      imageUrl={config.BASE_URL + image?.imageUrl}
                    />
                  ))}
                </div>
              </div>
            )}

          <div className="flex space-x-8 items-center">
            <h6 className="opacity-50 text-sm flex-[1]">Schedule Time</h6>
            <p className="flex-[4] text-sm">
              {orderDetail?.deliverySchedule || "- - -"}
            </p>
          </div>

          <div className="flex space-x-8 items-center">
            <h6 className="opacity-50 text-sm flex-[1]">Additional Notes</h6>
            <p className="flex-[4] text-sm">{orderDetail?.noted || "- - -"}</p>
          </div>

          <div className="flex space-x-8 items-center">
            <h6 className="opacity-50 text-sm flex-[1]">Payment Method</h6>
            <p className="flex-[4] text-sm">
              {orderDetail?.paymentMethod || "- - -"}
            </p>
          </div>

          <div className="flex space-x-8 items-center mb-2">
            <h6 className="opacity-50 text-sm flex-[1]">Total Price</h6>
            <p className="flex-[4] text-sm">
              ${orderDetail?.totalAmount || "- - -"}
            </p>
          </div>

          {/* Payment */}
          <div className="flex space-x-8 items-center">
            <h6 className="opacity-50 text-sm flex-[1]">Order Status</h6>
            <div className="flex-[4] relative">
              <select
                onChange={onUpdateOrderStatus}
                value={orderDetail?.status}
                className="mt-1 w-full  border border-gray-300 rounded max-w-96 bg-[#00000010] flex items-center px-4 h-9 cursor-pointer"
              >
                <option value={OrderStatus.PENDING}>Pending</option>
                <option value={OrderStatus.STORE_ACCEPTED}>
                  Store Accepted
                </option>
                <option value={OrderStatus.PROCESSING}>Processing</option>
                <option value={OrderStatus.DELIVERING}>Delivering</option>
                <option value={OrderStatus.DELIVERED}>Delivered</option>
                <option value={OrderStatus.CANCELLED}>Cancelled</option>
                <option value={OrderStatus.RETURN}>Return</option>
                <option value={OrderStatus.SYSTEM_CANCELED}>
                  System Canceled
                </option>
              </select>
            </div>
          </div>

          {/* Payment */}
          <div className="flex space-x-8 items-center">
            <h6 className="opacity-50 text-sm flex-[1]">Payment Status</h6>
            <div className="flex-[4] relative">
              <select
                onChange={onUpdatePaymentStatus}
                value={orderDetail?.paymentStatus}
                className="mt-1 w-full bg-[#00000010] border border-gray-300 rounded max-w-96 flex items-center px-4 h-9 cursor-pointer"
              >
                <option value={PaymentStatus.PAID}>Paid</option>
                <option value={PaymentStatus.UNPAID}>Unpaid</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white  items-center mt-4">
        <h1 className="font-bold text-lg">Customer Information</h1>

        <div className="h-[1px] w-full bg-[#D9D9D9] my-4" />

        <div className="overflow-x-auto">
          <table>
            <thead className="bg-gray-100">
              <tr>
                {headerProductOrder.map((header, index) => (
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
              {orderDetail?.items?.map(
                (value: ProductOrderModel, index: number) => {
                  return (
                    <tr key={value.id} className="hover:bg-gray-200">
                      <td>{index + 1}</td>
                      <td>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(
                              `/${routed.productManagement}/${routed.product}/${routed.preview}/${value.variant?.productId}`,
                              "_blank"
                            );
                          }}
                          className="text-blue-500 underline"
                        >
                          {value.variant?.productId || "- - -"}
                        </a>
                      </td>
                      <td>{value.name || "- - -"}</td>
                      <td>{value.id || "- - -"}</td>
                      <td>
                        {value.variant?.images?.[0]?.imageUrl ? (
                          <CashImage
                            width={44}
                            height={44}
                            imageUrl={
                              config.BASE_URL + value.variant.images[0].imageUrl
                            }
                          />
                        ) : (
                          "- - -"
                        )}
                      </td>
                      <td>{value.quantity || "- - -"}</td>
                      <td>${value.price || "- - -"}</td>
                      <td>
                        {value.discount
                          ? value.discount.formatDiscountType || "- - -"
                          : "- - -"}
                      </td>
                      <td>
                        {value.discount
                          ? `$${value.discount.priceAfterDiscount}` || "- - -"
                          : `$${value.price}` || "- - -"}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CenteredLoading loading={loading} />
    </div>
  );
};

export default Page;
