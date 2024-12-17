/* eslint-disable @next/next/no-img-element */
"use client";

import ButtonCustom from "@/components/custom/ButtonCustom";
import CashImage from "@/components/custom/CashImage";
import Input from "@/components/custom/Input";
import showToast from "@/components/error-handle/show-toast";
import CenteredLoading from "@/components/loading/center_loading";
import { base64Cut } from "@/constants/image/base64_cut";
import {
  updateAboutUsService,
  updateImageAboutUsService,
} from "@/redux/action/user-management/about_us_service";
import { AboutUsModel } from "@/redux/model/about-us/about_us_model";
import { UpdateAboutUsModel } from "@/redux/model/about-us/update_about_us_model";
import { ProcessedImage } from "@/redux/model/global/ProcessedImage";
import { config } from "@/utils/config/config";
import { resizeImageConvertBase64 } from "@/utils/security/image_convert";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { LuImagePlus } from "react-icons/lu";

interface AboutUsComponentProps {
  initialData: AboutUsModel;
}

const AboutUsComponent: React.FC<AboutUsComponentProps> = ({ initialData }) => {
  // State for the main form
  const [formData, setFormData] = useState<UpdateAboutUsModel>({
    email: initialData?.email || "",
    location: initialData?.location || "",
    phoneNumber: initialData?.phoneNumber || "",
    phoneStore: initialData?.phoneStore || "",
    availableTime: initialData.availableTime || "",
    showroomHours: initialData.showroomHours || "",
    websiteUrl: initialData?.websiteUrl || "",
    telegramUrl: initialData?.telegramUrl || "",
    messagerUrl: initialData?.messagerUrl || "",
    facebookUrl: initialData?.facebookUrl || "",
    instagramUrl: initialData?.instagramUrl || "",
    twitterUrl: initialData?.twitterUrl || "",
    description: initialData?.description || "",
  });

  const [loading, setLoading] = useState(false);
  const [isUplaodImage, setIsUplaodImage] = useState(false);
  const [isUplaodData, setIsUplaodData] = useState(false);

  const [imageData, setImageData] = useState<ProcessedImage | null>(
    initialData.image
      ? {
          base64: initialData.image.imageUrl,
          type: null,
        }
      : null
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsUplaodData(true);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const resizedBase64 = await resizeImageConvertBase64(file);
      const fileExtension = `.${file.type.split("/")[1]}`;
      setIsUplaodImage(true);
      setImageData({
        base64: resizedBase64,
        type: fileExtension,
      });
    }
  };

  const handleRemoveImage = () => {
    setImageData(null); // Clear the image state
    setIsUplaodImage(false);
  };

  const handleFormSubmit = async () => {
    setLoading(true);
    if (isUplaodData) {
      console.log("### ===dddjdj", formData);
      const response = await updateAboutUsService({
        aboutUsId: initialData.id,
        data: formData,
      });
      if (response.success) {
        console.log("### ===dddjdj", response.data);
        setIsUplaodData(false);
        showToast(response.message, "success");
      } else {
        showToast(response.message, "error");
      }
    }

    if (imageData?.type && isUplaodImage) {
      const response = await updateImageAboutUsService({
        aboutUsId: initialData.id,
        data: {
          fileContent: imageData.base64.replace(base64Cut.cutHead, ""),
          fileExtension: imageData.type,
        },
      });
      if (response.success) {
        showToast(response.message, "success");
        setIsUplaodImage(false);
      } else {
        showToast(response.message, "error");
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="p-4 bg-white flex justify-between">
        <h1 className="font-bold text-xl">About us</h1>
        <div className="flex gap-4">
          <ButtonCustom
            className={`px-4 py-1  ${
              !isUplaodData && !isUplaodImage && "bg-gray-600"
            }`}
            disabled={!isUplaodData && !isUplaodImage}
            onClick={handleFormSubmit}
          >
            Update
          </ButtonCustom>
        </div>
      </div>
      <div className="p-4 mt-4 bg-white">
        <div className="grid grid-cols-3 gap-4">
          {/* Dynamic form inputs */}
          {Object.entries(formData).map(([key, value]) =>
            key !== "description" ? (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Input
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  className="h-11"
                />
              </div>
            ) : null
          )}
        </div>
        <div className="flex gap-4 mt-8">
          {/* Image upload */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Image subcategory<span className="text-red-500 ml-1">*</span>
            </label>
            {imageData ? (
              <div className="relative w-24 h-24">
                {imageData?.type ? (
                  <img
                    src={imageData.base64}
                    alt="Uploaded Preview"
                    className="w-full h-full object-cover rounded-md border"
                  />
                ) : (
                  <CashImage
                    width={96}
                    height={96}
                    imageUrl={`${config.BASE_URL}${imageData.base64}`}
                  />
                )}

                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white px-1 py-1 rounded"
                >
                  <IoClose />
                </button>
              </div>
            ) : (
              <label
                htmlFor="fileInput"
                className="flex items-center justify-center w-24 h-24 bg-[#00000026] rounded-md cursor-pointer"
              >
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <LuImagePlus className="text-gray-500 text-2xl rounded" />
              </label>
            )}
          </div>
          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={8}
            placeholder="Type your text here..."
            className="w-full p-2 border rounded"
            style={{
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>
      </div>
      <CenteredLoading loading={loading} text="Updating, please wait ..." />
    </div>
  );
};

export default AboutUsComponent;
