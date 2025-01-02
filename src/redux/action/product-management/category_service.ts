"use server";

import { axiosServerWithAuth } from "@/utils/api/axios_server";
import axios from "axios";

interface getCategoryParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface uploadCategoryParams {
  name?: string;
  isPublic?: boolean;
}

interface updateCategoryParams {
  categoryId: string;
  data: uploadCategoryParams;
}

interface imageCategory {
  fileContent: string;
  fileExtension: string;
}

interface uploadImageCategoryParams {
  categoryId: string;
  data: imageCategory;
}

interface deleteCategoryParams {
  categoryId: string;
}
export async function getCategoryService({
  page = 1,
  limit = 15,
  search = "",
}: getCategoryParams) {
  try {
    const response = await axiosServerWithAuth.get(
      `/v1/admin/category?page=${page}&limit=${limit}&search=${search}`
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

export async function uploadCategory(data: uploadCategoryParams) {
  try {
    const response = await axiosServerWithAuth.post("/v1/admin/category", data);
    return {
      success: true,
      message: "Category created successfully!",
      data: response.data.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 400) {
        return {
          success: false,
          message:
            "This category name is already taken. Please choose a different name.!",
          data: null,
        };
      }
      return {
        success: false,
        message: "Failed to create Category. Please try again!",
        data: null,
      };
    }
  }
  return {
    success: false,
    message: "Failed to create Category. Please try again!",
    data: null,
  };
}

export async function uploadImageCategory({
  categoryId,
  data,
}: uploadImageCategoryParams) {
  try {
    await axiosServerWithAuth.post(
      `/v1/admin/category/${categoryId}/image`,
      data
    );
    return {
      success: true,
      message: "Image Category created successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to create Image Category. Please try again!",
      data: null,
    };
  }
}

export async function onUpdateCategory({
  categoryId,
  data,
}: updateCategoryParams) {
  try {
    await axiosServerWithAuth.patch(`/v1/admin/category/${categoryId}`, data);
    return {
      success: true,
      message: "Categories updated successfully!",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 400) {
        return {
          success: false,
          message:
            "This categories name is already taken. Please choose a different name.!",
          data: null,
        };
      }
      return {
        success: false,
        message: "Failed to updated Categories. Please try again!",
        data: null,
      };
    }
  }
  return {
    success: false,
    message: "Failed to updated Category. Please try again!",
    data: null,
  };
}

export async function onDeleteCategory({ categoryId }: deleteCategoryParams) {
  try {
    await axiosServerWithAuth.delete(`/v1/admin/category/${categoryId}`);
    return {
      success: true,
      message: "Category deleted successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to deleted Category. Please try again!",
      data: null,
    };
  }
}
