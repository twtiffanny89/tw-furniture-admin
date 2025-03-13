"use server";

import { axiosServerWithAuth } from "@/utils/api/axios_server";

export async function getAllDashboardService() {
  try {
    const response = await axiosServerWithAuth.get(`/v1/admin/dashboard`);
    return response.data.data.data;
  } catch {
    return [];
  }
}
