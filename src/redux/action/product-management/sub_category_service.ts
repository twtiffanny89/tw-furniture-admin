"use server";

import { axiosServerWithAuth } from "@/utils/api/axios_server";

interface getSubCategoryParams {
  page?: number;
  limit?: number;
}

export async function getSubCategoryService({
  page = 1,
  limit = 10,
}: getSubCategoryParams) {
  try {
    const response = await axiosServerWithAuth.get(
      `/v1/admin/subcategory?page=${page}&limit=${limit}`
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
