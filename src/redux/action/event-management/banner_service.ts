"use server";

import { axiosServerWithAuth } from "@/utils/api/axios_server";

interface getBannerParams {
  page?: number;
  limit?: number;
}

interface deletBannerParams {
  id?: string;
}
export async function getBannerService({
  page = 1,
  limit = 15,
}: getBannerParams) {
  try {
    const response = await axiosServerWithAuth.get(
      `/v1/admin/banner/image?page=${page}&limit=${limit}`
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

export async function deletedBannerService({ id }: deletBannerParams) {
  try {
    await axiosServerWithAuth.delete(`/v1/admin/banner/${id}`);
    return {
      success: true,
      message: "Banner imaeg deleted successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to deleted banner image. Please try again!",
    };
  }
}
