import { keyStorage } from "@/constants/storage/key_storage";
import Cookies from "js-cookie";
import { cookies } from "next/headers";

// Function to store a cookie
export const setCookieToken = (value: string) => {
  Cookies.set(keyStorage.TOKEN, value, {
    secure: process.env.NODE_ENV === "production", // Secure cookie in production
    sameSite: "Strict", // Prevent CSRF attacks
    path: "/", // Available across the entire app
  });
};

// Function to retrieve a cookie
export const getCookieToken = () => {
  // Client environment
  return Cookies.get(keyStorage.TOKEN);
};

// Function to retrieve all cookies
export const getAllCookies = () => {
  return Cookies.get();
};

// Function to remove all cookies
export const removeAllCookies = () => {
  const allCookies = Cookies.get();
  for (const cookie in allCookies) {
    Cookies.remove(cookie, { path: "/" });
  }
};
