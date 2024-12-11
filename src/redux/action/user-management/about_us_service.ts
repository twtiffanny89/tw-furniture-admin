"use server";

import { axiosServerWithAuth } from "@/utils/api/axios_server";

export async function getAboutUsService() {
  try {
    const response = await axiosServerWithAuth.get(`/v1/admin/about-us`);
    return response.data.data;
  } catch {
    return null;
  }
}
