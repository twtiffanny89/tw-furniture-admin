"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IoMdClose, IoMdEye, IoMdEyeOff } from "react-icons/io";
import ButtonCustom from "@/components/custom/ButtonCustom";
import Input from "@/components/custom/Input";

// Define Zod schema for user form validation
const userFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" })
    .trim(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .trim(),
  firstName: z.string().min(1, { message: "First name is required" }).trim(),
  lastName: z.string().min(1, { message: "Last name is required" }).trim(),
});

// Type for the form data based on the Zod schema
export type UserFormData = z.infer<typeof userFormSchema>;

interface UserRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  isSubmitting?: boolean;
}

export function UserRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: UserRegistrationModalProps) {
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Initialize the form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
    mode: "onChange", // Validate on change for better UX
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      reset({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
      });
      setShowPassword(false); // Reset password visibility
    }
  }, [isOpen, reset]);

  // Handle form submission
  const handleFormSubmit = async (data: UserFormData) => {
    try {
      console.log("Final submit data:", data);
      onSubmit(data);
    } catch (error) {
      console.error("Error submitting user form:", error);
      toast.error("An error occurred while creating user");
    }
  };

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Create User Account
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Fill in the information below to create a new user account.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-4"
        >
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("firstName")}
              placeholder="Enter first name"
              disabled={isSubmitting}
              className={`w-full h-10 ${
                errors.firstName ? "border-red-500" : ""
              }`}
              autoFocus
              autoComplete="given-name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("lastName")}
              placeholder="Enter last name"
              disabled={isSubmitting}
              className={`w-full h-10 ${
                errors.lastName ? "border-red-500" : ""
              }`}
              autoComplete="family-name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("email")}
              type="email"
              placeholder="Enter email address"
              disabled={isSubmitting}
              className={`w-full h-10 ${errors.email ? "border-red-500" : ""}`}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                disabled={isSubmitting}
                className={`w-full h-10 pr-10 ${
                  errors.password ? "border-red-500" : ""
                }`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                disabled={isSubmitting}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <IoMdEyeOff size={18} />
                ) : (
                  <IoMdEye size={18} />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t mt-6">
            <ButtonCustom
              variant="cancel"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4"
            >
              Cancel
            </ButtonCustom>
            <ButtonCustom
              type="submit"
              className="px-6 py-2 bg-primary text-white hover:bg-green-950 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Creating...
                </>
              ) : (
                "Create User"
              )}
            </ButtonCustom>
          </div>
        </form>
      </div>
    </div>
  );
}
