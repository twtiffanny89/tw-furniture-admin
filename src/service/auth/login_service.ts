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
      data: "",
    };
  } catch {
    return {
      success: false,
      data: "",
    };
  }
}
