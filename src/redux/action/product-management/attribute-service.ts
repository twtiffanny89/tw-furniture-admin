"use server";

import { axiosServerWithAuth } from "@/utils/api/axios_server";
import axios from "axios";

interface getAttributeParams {
  page?: number;
  limit?: number;
}

interface deletedParams {
  id?: string;
}

interface createdParams {
  name?: string;
}

interface updateParams {
  id: string;
  data: createdParams;
}

export async function getAttributeService({
  page = 1,
  limit = 15,
}: getAttributeParams) {
  try {
    const response = await axiosServerWithAuth.get(
      `/v1/admin/attribute?page=${page}&limit=${limit}`
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

export async function deletedAttributeService({ id }: deletedParams) {
  try {
    await axiosServerWithAuth.delete(`/v1/admin/attribute/${id}`);
    return {
      success: true,
      message: "Attribute deleted successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to deleted attribute. Please try again!",
    };
  }
}

export async function createAttributeService(data: createdParams) {
  try {
    await axiosServerWithAuth.post("/v1/admin/attribute", data);
    return {
      success: true,
      message: "Attribute created successfully!",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 400) {
        return {
          success: false,
          message:
            "This Attribute name is already taken. Please choose a different name.!",
          data: null,
        };
      }
      return {
        success: false,
        message: "Failed to created Attribute name. Please try again!",
        data: null,
      };
    }
  }
  return {
    success: false,
    message: "Failed to created Attribute. Please try again!",
    data: null,
  };
}

export async function onUpdateAttribute({ id, data }: updateParams) {
  try {
    await axiosServerWithAuth.patch(`/v1/admin/attribute/${id}`, data);
    return {
      success: true,
      message: "Attribute updated successfully!",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 400) {
        return {
          success: false,
          message:
            "This Attribute name is already taken. Please choose a different name.!",
          data: null,
        };
      }
      return {
        success: false,
        message: "Failed to updated Attribute. Please try again!",
        data: null,
      };
    }
  }
  return {
    success: false,
    message: "Failed to updated Attribute. Please try again!",
    data: null,
  };
}
