"use server";

import { axiosServerWithAuth } from "@/utils/api/axios_server";

interface getAllUserParams {
  page?: number;
  limit?: number;
  search?: string;
  filterBy?: string;
}

export async function getAllUserService({
  page = 1,
  limit = 15,
  search = "",
  filterBy = "USER",
}: getAllUserParams) {
  try {
    const response = await axiosServerWithAuth.get(
      `/v1/admin/user?page=${page}&limit=${limit}&search=${search}&filterBy=${filterBy}`
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

interface CreateUserModel {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

export async function createUserService(data: CreateUserModel) {
  try {
    const response = await axiosServerWithAuth.post(
      `/v1/admin/user/create-admin-user`,
      data
    );
    return {
      success: true,
      data: response.data.data,
      message: "Admin created successfully!",
    };
  } catch {
    return {
      success: false,
      message: "Failed to Admin created. Please try again!",
    };
  }
}

// Add this function to your user service file (all_user_service.ts)

export async function deleteUserService(userId: string) {
  try {
    const response = await axiosServerWithAuth.delete(
      `/v1/admin/user/${userId}/delete-admin-user`
    );

    // Check if the response indicates success
    if (response.status === 200 || response.status === 204) {
      return {
        success: true,
        data: response.data?.data || null,
        message: "Admin user deleted successfully!",
      };
    } else {
      throw new Error("Unexpected response from server");
    }
  } catch (error: any) {
    console.error("Delete user error:", error);

    // Handle different error scenarios
    let errorMessage = "Failed to delete admin user. Please try again!";

    if (error.response?.status === 404) {
      errorMessage = "User not found.";
    } else if (error.response?.status === 403) {
      errorMessage = "You don't have permission to delete this user.";
    } else if (error.response?.status === 400) {
      errorMessage = error.response?.data?.message || "Invalid request.";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    // Return error object instead of throwing
    return {
      success: false,
      message: errorMessage,
    };
  }
}
