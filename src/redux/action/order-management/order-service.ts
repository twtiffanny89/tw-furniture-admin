"use server";

import { axiosServerWithAuth } from "@/utils/api/axios_server";

interface getAllProductParams {
  page?: number;
  limit?: number;
  search?: string;
  filterBy?: string;
  paymentStatus?: string;
}

export async function getAllProductOrderService({
  page = 1,
  limit = 15,
  search,
  filterBy,
  paymentStatus,
}: getAllProductParams) {
  try {
    const params = new URLSearchParams();

    // Add parameters only if they are defined
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (filterBy) params.append("filterBy", filterBy);
    if (paymentStatus) params.append("paymentStatus", paymentStatus);

    const response = await axiosServerWithAuth.get(
      `/v1/admin/order?${params.toString()}`
    );
    return {
      data: response.data.data.data,
      pagination: response.data.data.pageInfo,
    };
  } catch {
    return {
      data: [],
      pagination: null,
    };
  }
}

export async function getProductOrderDetailService({
  orderId,
}: {
  orderId: string;
}) {
  try {
    const response = await axiosServerWithAuth.get(
      `/v1/admin/order/${orderId}`
    );
    return response.data.data;
  } catch {
    return null;
  }
}

export async function updateProductOrderDetailService({
  orderId,
  status,
  paymentStatus,
}: {
  orderId: string;
  status?: string;
  paymentStatus?: string;
}) {
  try {
    const response = await axiosServerWithAuth.post(
      `/v1/admin/order/${orderId}`,
      {
        status,
        paymentStatus,
      }
    );
    return {
      success: true,
      data: response.data.data,
    };
  } catch {
    return {
      success: false,
      data: null,
    };
  }
}
