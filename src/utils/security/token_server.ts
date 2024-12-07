import { keyStorage } from "@/constants/storage/key_storage";
import { cookies } from "next/headers";

export const getServerCookieToken = (): string | undefined => {
  return cookies().get(keyStorage.TOKEN)?.value; // Retrieve token from cookies (server-side)
};
