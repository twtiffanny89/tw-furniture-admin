"use server";

import { axiosNoAuth } from "@/utils/api/axios";

interface LoginServiceParam {
  username: string;
  password: string;
}

export async function LoginService(data: LoginServiceParam) {
  try {
    const response = await axiosNoAuth.post("/v1/admin/auth/login", data);
    return {
      success: true,
      data: response.data.data.accessToken,
      message: "Login successful! Welcome back 🎉.",
    };
  } catch {
    return {
      success: false,
      message: "Login failed. Please try again.",
    };
  }
}
