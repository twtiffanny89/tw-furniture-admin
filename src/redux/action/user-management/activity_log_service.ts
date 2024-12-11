"use server";

import { axiosServerWithAuth } from "@/utils/api/axios_server";

interface getActivityLogParams {
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}

export async function getActivityLogService({
  page = 1,
  limit = 15,
  dateFrom = "",
  dateTo = "",
}: getActivityLogParams) {
  try {
    const response = await axiosServerWithAuth.get(
      `/v1/admin/user/activity-log?page=${page}&limit=${limit}&dateFrom=${dateFrom}&dateTo=${dateTo}`
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
