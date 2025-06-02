/* eslint-disable @next/next/no-img-element */
"use client";

import ButtonCustom from "@/components/custom/ButtonCustom";
import CashImage from "@/components/custom/CashImage";
import Input from "@/components/custom/Input";
import showToast from "@/components/error-handle/show-toast";
import CenteredLoading from "@/components/loading/center_loading";
import { base64Cut } from "@/constants/image/base64_cut";
import {
  getAboutUsService,
  updateAboutUsService,
  updateImageAboutUsService,
  updateImageQRAboutUsService,
} from "@/redux/action/user-management/about_us_service";
import { AboutUsModel } from "@/redux/model/about-us/about_us_model";
import { UpdateAboutUsModel } from "@/redux/model/about-us/update_about_us_model";
import { ProcessedImage } from "@/redux/model/global/ProcessedImage";
import { config } from "@/utils/config/config";
import { resizeImageConvertBase64 } from "@/utils/security/image_convert";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { LuImagePlus } from "react-icons/lu";
import { HiRefresh } from "react-icons/hi";

const AboutUsComponent = () => {
  const [formData, setFormData] = useState<UpdateAboutUsModel>({
    email: "",
    location: "",
    phoneNumber: "",
    phoneStore: "",
    bankName: "",
    bankNumber: "",
    availableTime: "",
    showroomHours: "",
    websiteUrl: "",
    telegramUrl: "",
    messagerUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    description: "",
  });
  const [aboutUsData, setAboutUsData] = useState<AboutUsModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState<ProcessedImage | null>(null);
  const [imageQRData, setImageQRData] = useState<ProcessedImage | null>(null);

  useEffect(() => {
    onCallApi();
  }, []);

  async function onCallApi() {
    setLoading(true);
    try {
      const response = await getAboutUsService();
      setAboutUsData(response);
      setFormData({
        email: response?.email ? response?.email.trim() : "",
        location: response?.location ? response?.location.trim() : "",
        phoneNumber: response?.phoneNumber ? response?.phoneNumber.trim() : "",
        phoneStore: response?.phoneStore ? response?.phoneStore.trim() : "",
        bankName: response?.bankName ? response?.bankName.trim() : "",
        bankNumber: response?.bankNumber ? response?.bankNumber.trim() : "",
        availableTime: response?.availableTime
          ? response?.availableTime.trim()
          : "",
        showroomHours: response?.showroomHours
          ? response?.showroomHours.trim()
          : "",
        websiteUrl: response?.websiteUrl ? response?.websiteUrl.trim() : "",
        telegramUrl: response?.telegramUrl ? response?.telegramUrl.trim() : "",
        messagerUrl: response?.messagerUrl ? response?.messagerUrl.trim() : "",
        facebookUrl: response?.facebookUrl ? response?.facebookUrl.trim() : "",
        instagramUrl: response?.instagramUrl
          ? response?.instagramUrl.trim()
          : "",
        twitterUrl: response?.twitterUrl ? response?.twitterUrl.trim() : "",
        description: response?.description ? response?.description.trim() : "",
      });
      setImageQRData(
        response?.abaQrImage
          ? {
              base64: response?.abaQrImage?.imageUrl,
              type: null,
            }
          : null
      );
      setImageData(
        response?.image
          ? {
              base64: response?.image?.imageUrl,
              type: null,
            }
          : null
      );
    } catch (error) {
      console.error("Error fetching about us data:", error);
      showToast("Failed to load data", "error");
    }
    setLoading(false);
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const resizedBase64 = await resizeImageConvertBase64(file);
        const fileExtension = `.${file.type.split("/")[1]}`;
        setImageData({
          base64: resizedBase64,
          type: fileExtension,
        });
      } catch (error) {
        console.error("Image upload failed:", error);
        // Reset file input
        event.target.value = "";
      }
    }
  };

  const handleImageQRUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const resizedBase64 = await resizeImageConvertBase64(file);
        const fileExtension = `.${file.type.split("/")[1]}`;
        setImageQRData({
          base64: resizedBase64,
          type: fileExtension,
        });
      } catch (error) {
        console.error("QR image upload failed:", error);
        // Reset file input
        event.target.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setImageData(null);
  };

  const handleRemoveImageQR = () => {
    setImageQRData(null);
  };

  const handleRefresh = async () => {
    await onCallApi();
    showToast("Data refreshed successfully!", "success");
  };

  const handleFormSubmit = async () => {
    setLoading(true);

    try {
      // Update basic form data
      const response = await updateAboutUsService({
        aboutUsId: aboutUsData?.id || "",
        data: formData,
      });
      if (response.success) {
        showToast(response.message, "success");
      } else {
        showToast(response.message, "error");
      }

      // Update profile image if changed
      if (imageData?.type) {
        const responseImg = await updateImageAboutUsService({
          aboutUsId: aboutUsData?.id || "",
          data: {
            fileContent: imageData.base64.replace(base64Cut.cutHead, ""),
            fileExtension: imageData.type,
          },
        });
        if (responseImg.success) {
          setImageData((prev) => ({
            ...prev!,
            base64: responseImg.data?.imageUrl || "",
            type: null,
          }));
          showToast(responseImg.message, "success");
        } else {
          showToast(responseImg.message, "error");
        }
      }

      // Update QR image if changed
      if (imageQRData?.type) {
        const responseQR = await updateImageQRAboutUsService({
          aboutUsId: aboutUsData?.id || "",
          data: {
            fileContent: imageQRData.base64.replace(base64Cut.cutHead, ""),
            fileExtension: imageQRData.type,
          },
        });
        if (responseQR.success) {
          setImageQRData((prev) => ({
            ...prev!,
            base64: responseQR.data?.imageUrl || "",
            type: null,
          }));
          showToast(responseQR.message, "success");
        } else {
          showToast(responseQR.message, "error");
        }
      }
    } catch (error) {
      console.error("Update failed:", error);
      showToast("Update failed", "error");
    }

    setLoading(false);
  };

  // Helper function to format field labels
  const formatLabel = (key: string) => {
    const labelMap: { [key: string]: string } = {
      phoneNumber: "Phone Number",
      phoneStore: "Store Phone",
      bankName: "Bank Name",
      bankNumber: "Bank Number",
      availableTime: "Available Time",
      showroomHours: "Showroom Hours",
      websiteUrl: "Website URL",
      telegramUrl: "Telegram URL",
      messagerUrl: "Messenger URL",
      facebookUrl: "Facebook URL",
      instagramUrl: "Instagram URL",
      twitterUrl: "Twitter URL",
    };

    return (
      labelMap[key] ||
      key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
    );
  };

  // Custom header component
  const CustomHeader = () => (
    <div className="p-4 bg-white rounded-md shadow-sm">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-xl">About Us Management</h1>
        <div className="flex gap-2">
          <ButtonCustom
            className="w-9 h-9"
            onClick={handleRefresh}
            title="Refresh Data"
          >
            <HiRefresh size={20} />
          </ButtonCustom>
          <ButtonCustom
            className="px-4 h-9"
            onClick={handleFormSubmit}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </ButtonCustom>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <CustomHeader />

      <div className="p-6 mt-4 bg-white rounded-md shadow-sm">
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {Object.entries(formData).map(([key, value]) =>
            key !== "description" ? (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {formatLabel(key)}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Input
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  className="h-11"
                  placeholder={`Enter ${formatLabel(key).toLowerCase()}`}
                />
              </div>
            ) : null
          )}
        </div>

        {/* Image Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          {/* Profile Image */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              About Us Profile Image<span className="text-red-500 ml-1">*</span>
            </label>

            {imageData ? (
              <div className="relative w-32 h-32">
                {imageData.type ? (
                  <img
                    src={imageData.base64}
                    alt="Profile Preview"
                    className="w-full h-full object-cover rounded-md border"
                  />
                ) : (
                  <CashImage
                    width={128}
                    height={128}
                    imageUrl={`${config.BASE_URL}${imageData.base64}`}
                  />
                )}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white px-1 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  <IoClose />
                </button>
              </div>
            ) : (
              <label
                htmlFor="profileImageInput"
                className="flex flex-col items-center justify-center w-32 h-32 bg-gray-100 rounded-md cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
              >
                <input
                  id="profileImageInput"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <LuImagePlus className="text-gray-500 text-2xl mb-1" />
                <span className="text-xs text-gray-500">Upload Profile</span>
              </label>
            )}
          </div>

          {/* QR Code Image */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              QR Code Image<span className="text-red-500 ml-1">*</span>
            </label>
            {imageQRData ? (
              <div className="relative w-32 h-32">
                {imageQRData.type ? (
                  <img
                    src={imageQRData.base64}
                    alt="QR Code Preview"
                    className="w-full h-full object-cover rounded-md border"
                  />
                ) : (
                  <CashImage
                    width={128}
                    height={128}
                    imageUrl={`${config.BASE_URL}${imageQRData.base64}`}
                  />
                )}
                <button
                  type="button"
                  onClick={handleRemoveImageQR}
                  className="absolute top-2 right-2 bg-red-500 text-white px-1 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  <IoClose />
                </button>
              </div>
            ) : (
              <label
                htmlFor="qrImageInput"
                className="flex flex-col items-center justify-center w-32 h-32 bg-gray-100 rounded-md cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
              >
                <input
                  id="qrImageInput"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImageQRUpload}
                  className="hidden"
                />
                <LuImagePlus className="text-gray-500 text-2xl mb-1" />
                <span className="text-xs text-gray-500">Upload QR Code</span>
              </label>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Description<span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={6}
            placeholder="Enter a detailed description about your business..."
            className="w-full p-3 rounded-md border border-gray-300 focus:border-primary focus:outline-none text-base resize-vertical"
          />
        </div>
      </div>

      <CenteredLoading loading={loading} text="Updating, please wait..." />
    </div>
  );
};

export default AboutUsComponent;
