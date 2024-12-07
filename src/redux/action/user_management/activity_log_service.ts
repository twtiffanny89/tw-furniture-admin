import { axiosServerWithAuth } from "@/utils/api/axios_server";

export async function getActivityLogService({}) {
  try {
    const response = await axiosServerWithAuth.get(
      `/v1/admin/user/activity-log?page=1&limit=10&dateFrom=2024-12-06&dateTo=2024-12-08`
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
