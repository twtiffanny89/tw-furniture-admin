"use server";

import { UpdateAboutUsModel } from "@/redux/model/about-us/update_about_us_model";
import { axiosServerWithAuth } from "@/utils/api/axios_server";

interface updateAboutUsParams {
  aboutUsId: string;
  data: UpdateAboutUsModel;
}

interface updateImageParams {
  aboutUsId: string;
  data: imageCategory;
}

interface imageCategory {
  fileContent: string;
  fileExtension: string;
}

export async function getAboutUsService() {
  try {
    const response = await axiosServerWithAuth.get(`/v1/admin/about-us`);
    return response.data.data;
  } catch {
    return null;
  }
}

export async function updateAboutUsService({
  aboutUsId,
  data,
}: updateAboutUsParams) {
  try {
    await axiosServerWithAuth.patch(`/v1/admin/about-us/${aboutUsId}`, data);
    return {
      success: true,
      message: "About us updated successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to updated About us. Please try again!",
    };
  }
}

export async function updateImageAboutUsService({
  aboutUsId,
  data,
}: updateImageParams) {
  try {
    const response = await axiosServerWithAuth.post(
      `/v1/admin/about-us/${aboutUsId}/image`,
      data
    );
    return {
      success: true,
      data: response.data.imageUrl,
      message: "Image updated successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to updated Image. Please try again!",
    };
  }
}
