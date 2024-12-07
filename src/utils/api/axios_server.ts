import axios from "axios";
import { getServerCookieToken } from "../security/token_server";

// Axios instance with token (authentication required)
const axiosServerWithAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 400000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Adding an interceptor to include the token for requests that require authentication
axiosServerWithAuth.interceptors.request.use(
  (config) => {
    const token = getServerCookieToken();

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServerWithAuth.interceptors.response.use(
  (response) => {
    if (process.env.NEXT_PUBLIC_NODE_ENV == "development") {
      console.log(
        "%c## Success: %cEndpoint hit successfully! %cURL: " +
          response.config.url +
          " %cStatus: " +
          response.status,
        "color: green; font-size: 16px; font-weight: bold;", // Success color
        "color: green; font-size: 16px;", // Success message
        "color: blue; font-size: 14px;", // URL color
        "color: yellow; font-size: 14px;" // Status code color
      );
    }
    return response;
  },
  (error) => {
    if (process.env.NEXT_PUBLIC_NODE_ENV == "development") {
      const { response } = error;
      if (response) {
        console.log(
          "%c## Error: %cAn error occurred while hitting the endpoint! %cURL: " +
            response.config.url +
            " %cStatus: " +
            response.status,
          "color: red; font-size: 16px; font-weight: bold;", // Error color
          "color: red; font-size: 16px;", // Error message
          "color: blue; font-size: 14px;", // URL color
          "color: yellow; font-size: 14px;" // Status code color
        );
      }
    }
    return Promise.reject(error);
  }
);

export { axiosServerWithAuth };
