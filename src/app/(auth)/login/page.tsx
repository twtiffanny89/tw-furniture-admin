"use client";

import ButtonCustom from "@/components/custom/ButtonCustom";
import Input from "@/components/custom/Input";
import MessgaeError from "@/components/error-handle/message_error";
import showToast from "@/components/error-handle/show-toast";
import { routed } from "@/constants/navigation/routed";
import { LoginService } from "@/redux/action/auth/login_service";
import { getCookieToken } from "@/utils/security/token";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const LoginPage = () => {
  const [username, setUsername] = useState("menghorfreelance@gmail.com");
  const [password, setPassword] = useState("71OV58HM");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const router = useRouter();

  console.log("## ==", getCookieToken());
  console.log("## ==dd", process.env.NEXT_PUBLIC_BASE_URL);

  const handleLogin = async () => {
    setLoading(true);
    const response = await LoginService({ password, username });
    if (response.success) {
      showToast(response.data, "success");
      router.replace(`/${routed.userManagement}/${routed.allUser}`);
    } else {
      showToast(response.data, "error");
    }
    setLoading(false);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (usernameError) {
      setUsernameError(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) {
      setPasswordError(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg transition-transform duration-300 hover:scale-x-105">
        <h1 className="text-2xl font-bold">Welcome to,</h1>
        <h2 className="text-2xl font-bold mb-2">TW Furniture Kh - Admin</h2>
        <p className="text-base mb-4 text-black opacity-50">
          Please login to use dashboard
        </p>
        <div className="h-[1px] bg-[#D9D9D9] w-full mb-4" />
        <form onSubmit={handleLogin} className="">
          <div className="mb-4">
            <label className="block text-sm font-medium text-black">
              Username
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              disabled={loading}
              type="text"
              id="email"
              value={username}
              onChange={handleUsernameChange} // Use new handler
              placeholder="Enter your username"
              className="mt-1 w-full h-11 px-4"
              onKeyDown={handleKeyPress}
            />
            {usernameError && (
              <MessgaeError message={usernameError} type="error" />
            )}
          </div>

          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-black"
            >
              Password
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <Input
                disabled={loading}
                type={passwordVisible ? "text" : "password"} // Toggle input type between text and password
                id="password"
                value={password}
                onChange={handlePasswordChange} // Use new handler
                placeholder="Enter your password"
                className="mt-1 w-full h-11 px-4"
                autoComplete="new-password"
                onKeyDown={handleKeyPress}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 z-10 pr-3 flex items-center text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {passwordError && (
              <MessgaeError message={passwordError} type="error" />
            )}
          </div>

          <ButtonCustom
            onClick={handleLogin}
            className={`w-full h-11 `}
            loading={loading}
            textLoading="Logging in..."
            scaleOnHover={false}
          >
            Login
          </ButtonCustom>
          <p className="text-center mt-4 text-[#00000096]">
            Contact Support: +855 12345678
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
