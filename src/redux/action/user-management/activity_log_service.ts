"use server";

import { axiosServerWithAuth } from "@/utils/api/axios_server";

interface getActivityLogParams {
  page?: number;
  limit?: number;
}

export async function getActivityLogService({
  page = 1,
  limit = 10,
}: getActivityLogParams) {
  try {
    const response = await axiosServerWithAuth.get(
      `/v1/admin/user/activity-log?page=${page}&limit=${limit}&dateFrom=2024-12-06&dateTo=2024-12-10`
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
