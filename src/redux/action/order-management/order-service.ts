"use server";

import { axiosServerWithAuth } from "@/utils/api/axios_server";

interface getAllProductParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function getAllProductOrderService({
  page = 1,
  limit = 15,
  search = "",
}: getAllProductParams) {
  try {
    const response = await axiosServerWithAuth.get(
      `/v1/admin/order?page=${page}&limit=${limit}&search=${search}`
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
