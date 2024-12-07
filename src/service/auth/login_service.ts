import { axiosNoAuth } from "@/utils/api/axios";

interface LoginServiceParam {
  username: string;
  password: string;
}

export async function LoginService(data: LoginServiceParam) {
  console.log("## ", process.env.NEXT_PUBLIC_BASE_URL);
  try {
    const response = await axiosNoAuth.post("/v1/admin/auth/login", data);
    return response.data;
  } catch (e) {
    console.log("## ==", e);
    return null;
  }
}
