import axios from "axios";

export async function getAllUserService() {
  try {
    const response = await axios.get(
      "http://143.198.199.248/v1/admin/user/activity-log?page=1&limit=10&dateFrom=2024-12-06&dateTo=2024-12-07",
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbTRjOHJhZ2UwMDAwd2E1ajV6MnRqcGt2Iiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzMzNTY1MjUxLCJleHAiOjE3MzM1NjcwNTF9.HtJHxlEjaeWVeWcg4L3cp20Jod6aKEPzFCkB-L_7KnM`, // Add the token in the Authorization header
        },
      }
    );
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
