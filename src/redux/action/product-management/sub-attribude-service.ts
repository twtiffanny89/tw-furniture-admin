"use server";

import { axiosServerWithAuth } from "@/utils/api/axios_server";

interface getSubAttributeParams {
  page?: number;
  limit?: number;
}

interface createdParams {
  value?: string;
  label?: string;
  attributeId?: string;
  valueType?: string;
  isActive?: boolean;
}

interface updateParams {
  id: string;
  data: createdParams;
}

interface deletedParams {
  id?: string;
}

export async function getSubAttributeService({
  page = 1,
  limit = 15,
}: getSubAttributeParams) {
  try {
    const response = await axiosServerWithAuth.get(
      `/v1/admin/attribute-value?page=${page}&limit=${limit}`
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

export async function createAttributeValueService(data: createdParams) {
  try {
    const response = await axiosServerWithAuth.post(
      "/v1/admin/attribute-value",
      data
    );
    return {
      success: true,
      data: response.data.data,
      message: "Attribute value created successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to created Attribute value. Please try again!",
    };
  }
}

export async function onUpdateSubAttribute({ id, data }: updateParams) {
  try {
    await axiosServerWithAuth.patch(`/v1/admin/attribute-value/${id}`, data);
    return {
      success: true,
      message: "Attribute value updated successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to updated Attribute value. Please try again!",
      data: null,
    };
  }
}

export async function deletedSubAttributeService({ id }: deletedParams) {
  try {
    await axiosServerWithAuth.delete(`/v1/admin/attribute-value/${id}`);
    return {
      success: true,
      message: "Attribute value deleted successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to deleted Attribute value. Please try again!",
    };
  }
}
