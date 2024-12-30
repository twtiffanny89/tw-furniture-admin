import { keyStorage } from "@/constants/storage/key_storage";
import { cookies } from "next/headers";

export const getServerCookieToken = (): string | undefined => {
  return cookies().get(keyStorage.TOKEN)?.value; // Retrieve token from cookies (server-side)
};

export const logout = (): boolean => {
  const cookieStore = cookies();

  // Delete the token cookie
  cookieStore.delete(keyStorage.TOKEN);

  // Check if the cookie still exists
  const token = cookieStore.get(keyStorage.TOKEN)?.value;

  // Return true if the cookie was successfully deleted, false otherwise
  return !token;
};
