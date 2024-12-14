import { axiosNoAuth } from "@/utils/api/axios";
import { setCookieToken } from "@/utils/security/token";

interface LoginServiceParam {
  username: string;
  password: string;
}

export async function LoginService(data: LoginServiceParam) {
  try {
    const response = await axiosNoAuth.post("/v1/admin/auth/login", data);
    setCookieToken(response.data.data.accessToken);
    return {
      success: true,
      test: response.data,
      data: "Login successful! Welcome back 🎉.",
    };
  } catch (e) {
    return {
      success: false,
      test: e,
      data: "Login failed. Please try again.",
    };
  }
}
