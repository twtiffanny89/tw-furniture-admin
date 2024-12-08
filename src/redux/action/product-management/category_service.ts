"use server";

import { axiosServerWithAuth } from "@/utils/api/axios_server";

interface getCategoryParams {
  page?: number;
  limit?: number;
}

export async function getCategoryService({
  page = 1,
  limit = 10,
}: getCategoryParams) {
  try {
    const response = await axiosServerWithAuth.get(
      `/v1/admin/category?page=${page}&limit=${limit}`
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
