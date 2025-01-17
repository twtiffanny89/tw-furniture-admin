/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { getProductOrderDetailService } from "@/redux/action/order-management/order-service";
import { IoChevronBackOutline } from "react-icons/io5";
import { OrderDetailModel } from "@/redux/model/order/order-model";
import { openGoogleMap } from "@/utils/google-map/open_google_map";
import CashImage from "@/components/custom/CashImage";
import { config } from "@/utils/config/config";

const Page = ({ params }: { params: { id: string } }) => {
  const orderId = params.id;
  const [orderDetail, setOrderDetail] = useState<OrderDetailModel | null>(null);

  useEffect(() => {
    onCallFirstApi();
  }, []);

  async function onCallFirstApi() {
    const response = await getProductOrderDetailService({
      orderId,
    });
    setOrderDetail(response);
  }
  return (
    <div>
      <div className="p-4 bg-white flex items-center">
        <IoChevronBackOutline size={28} />
        <h1 className="font-bold text-xl ml-4">Order Detail (#0123)</h1>
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

          {/* Payment */}
          <div className="flex space-x-8 items-center">
            <h6 className="opacity-50 text-sm flex-[1]">Order Status</h6>
            <div className="flex-[4] relative">
              <select
                value={orderDetail?.status}
                className="mt-1 w-full  border border-gray-300 rounded max-w-96 bg-[#00000010] flex items-center px-4 h-9 cursor-pointer"
              >
                <option value="PENDING">Pending</option>
                <option value="STORE_ACCEPTED">Store Accepted</option>
                <option value="PROCESSING">Processing</option>
                <option value="DELIVERING">Delivering</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="RETURN">Return</option>
                <option value="SYSTEM_CANCELED">System Canceled</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-8 items-center">
            <h6 className="opacity-50 text-sm flex-[1]">Payment Method</h6>
            <p className="flex-[4] text-sm">
              {orderDetail?.paymentMethod || "- - -"}
            </p>
          </div>

          {/* Payment */}
          <div className="flex space-x-8 items-center">
            <h6 className="opacity-50 text-sm flex-[1]">Payment Status</h6>
            <div className="flex-[4] relative">
              <select
                value={orderDetail?.paymentStatus}
                className="mt-1 w-full bg-[#00000010] border border-gray-300 rounded max-w-96 flex items-center px-4 h-9 cursor-pointer"
              >
                <option value="PAID">Paid</option>
                <option value="UNPAID">Unpaid</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
