"use client";

import Button from "@/components/custom/Button";
import Input from "@/components/custom/Input";
import MessgaeError from "@/components/error-handle/MessageError";
import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const LoginPage = () => {
  const [adUsername, setAdUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // const handleLogin = async (e: React.FormEvent) => {};

  const handleLogin = async () => {};

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdUsername(e.target.value);
    if (usernameError) {
      setUsernameError(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // handleLogin(e as unknown as React.FormEvent);
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
    <div
      data-aos="fade-up"
      className="flex items-center justify-center min-h-screen bg-gray-100"
    >
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
              value={adUsername}
              onChange={handleUsernameChange} // Use new handler
              placeholder="Enter your email"
              className="mt-1 w-full py-2 px-4"
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
                className="mt-1 w-full py-2 px-4"
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

          <Button
            type="submit"
            className={`w-full h-11`}
            loading={loading}
            textLoading="Logging in..."
            scaleOnHover={false}
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
