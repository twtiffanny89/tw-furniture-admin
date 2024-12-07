import { axiosWithAuth } from "@/utils/api/axios";

export async function getAllUserService() {
  try {
    const response = await axiosWithAuth.get("/v1/admin/user?page=1&limit=10");
    console.log("### ===response", response);
    return {
      success: true,
      data: "Login successful! Welcome back 🎉.",
    };
  } catch (e) {
    console.log("### ===response", e);
    return {
      success: false,
      data: "Login failed. Please try again.",
    };
  }
}
