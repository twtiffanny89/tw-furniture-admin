"use server";

import { axiosServerWithAuth } from "@/utils/api/axios_server";
import axios from "axios";

interface getSubCategoryParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface createSubParams {
  name: string;
  categoryId: string;
}

interface imageCategory {
  fileContent: number;
  fileExtension: number;
}

interface uploadImageParams {
  subcategoryId: string;
  data: imageCategory;
}

interface nameSub {
  name: string;
}

interface updateSubParams {
  subCategoryId: string;
  data: nameSub;
}

export async function getSubCategoryService({
  page = 1,
  limit = 15,
  search = "",
}: getSubCategoryParams) {
  try {
    const response = await axiosServerWithAuth.get(
      `/v1/admin/subcategory?page=${page}&limit=${limit}&search=${search}`
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

export async function createSubCategory(data: createSubParams) {
  try {
    const response = await axiosServerWithAuth.post(
      "/v1/admin/subcategory",
      data
    );
    return {
      success: true,
      message: "Subcategory created successfully!",
      data: response.data.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 409) {
        return {
          success: false,
          message:
            "This Subcategory name is already taken. Please choose a different name.!",
          data: null,
        };
      }
      return {
        success: false,
        message: "Failed to create Subcategory. Please try again!",
        data: null,
      };
    }
    return {
      success: false,
      message: "Failed to create Subcategory. Please try again!",
      data: null,
    };
  }
}

export async function uploadImageSubCategory({
  subcategoryId,
  data,
}: uploadImageParams) {
  try {
    await axiosServerWithAuth.post(
      `/v1/admin/subcategory/${subcategoryId}/image`,
      data
    );
    return {
      success: true,
      message: "Image Subcategory created successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to create Image Subcategory. Please try again!",
      data: null,
    };
  }
}

export async function updatedSubCategory({
  subCategoryId,
  data,
}: updateSubParams) {
  try {
    const response = await axiosServerWithAuth.post(
      `/v1/admin/subcategory/${subCategoryId}`,
      data
    );
    return {
      success: true,
      message: "Subcategory updated successfully!",
      data: response.data.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 409) {
        return {
          success: false,
          message:
            "This Subcategory name is already taken. Please choose a different name.!",
          data: null,
        };
      }
      return {
        success: false,
        message: "Failed to updated Subcategory. Please try again!",
        data: null,
      };
    }
    return {
      success: false,
      message: "Failed to updated Subcategory. Please try again!",
      data: null,
    };
  }
}
