"use server";

import { FileImageUpload } from "@/redux/model/global/file-Image-upload";
import { axiosServerWithAuth } from "@/utils/api/axios_server";

interface getBannerParams {
  page?: number;
  limit?: number;
}

interface FileImageUpdate {
  fileContent: string;
  fileExtension: string;
  imageId: string;
}

interface deletBannerParams {
  id?: string;
}
export async function getBannerService({
  page = 1,
  limit = 10,
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
      message: "Banner deleted successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to deleted banner. Please try again!",
    };
  }
}

export async function uploadBannerService(data: FileImageUpload) {
  try {
    await axiosServerWithAuth.post("/v1/admin/banner/image", data);
    return {
      success: true,
      message: "Banner created successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to created banner. Please try again!",
    };
  }
}

export async function updateBannerService(data: FileImageUpdate) {
  try {
    await axiosServerWithAuth.post("/v1/admin/banner/image", data);
    return {
      success: true,
      message: "Banner updated successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to updated banner. Please try again!",
    };
  }
}
