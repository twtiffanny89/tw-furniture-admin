"use server";

import { axiosServerWithAuth } from "@/utils/api/axios_server";

interface getAllUserParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function getAllUserService({
  page = 1,
  limit = 15,
  search = "",
}: getAllUserParams) {
  try {
    const response = await axiosServerWithAuth.get(
      `/v1/admin/user?page=${page}&limit=${limit}&search=${search}`
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
