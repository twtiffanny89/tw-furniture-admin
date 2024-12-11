/* eslint-disable @next/next/no-img-element */
"use client";

import Button from "@/components/custom/button";
import Input from "@/components/custom/input";
import { AboutUsModel } from "@/redux/model/about-us/about_us_model";
import { ProcessedImage } from "@/redux/model/global/ProcessedImage";
import { resizeImageConvertBase64 } from "@/utils/security/image_convert";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { LuImagePlus } from "react-icons/lu";

interface AboutUsComponentProps {
  initialData: AboutUsModel;
}

const AboutUsComponent: React.FC<AboutUsComponentProps> = ({ initialData }) => {
  // State for the main form
  const [formData, setFormData] = useState({
    email: "",
    location: "",
    phoneNumber: "",
    phoneStore: "",
    availableTime: "",
    showroomHours: "",
    websiteUrl: "",
    telegramLink: "",
    messengerLink: "",
    facebookLink: "",
    instagramLink: "",
    twitterLink: "",
    description: "",
  });

  console.log("### ===hahahah", initialData);

  // Separate state for image
  const [imageData, setImageData] = useState<ProcessedImage | null>(null);

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
      const resizedBase64 = await resizeImageConvertBase64(file, 1920, 1080);
      const fileExtension = `.${file.type.split("/")[1]}`;
      setImageData({
        base64: resizedBase64,
        type: fileExtension,
      });
    }
  };

  const handleRemoveImage = () => {
    setImageData(null); // Clear the image state
  };

  const handleFormSubmit = () => {
    // API payload for the main form
    const payload = {
      ...formData,
      image: imageData?.base64,
    };
    console.log("### Form Payload:", payload);
    // Make API call here
  };

  return (
    <div>
      <div className="p-4 bg-white flex justify-between">
        <h1 className="font-bold text-xl">About us</h1>
        <Button className="px-4" onClick={handleFormSubmit}>
          Update
        </Button>
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
        <div className="flex gap-4 mt-4">
          {/* Image upload */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Image subcategory<span className="text-red-500 ml-1">*</span>
            </label>
            {imageData ? (
              <div className="relative w-24 h-24">
                <img
                  src={imageData.base64}
                  alt="Uploaded Preview"
                  className="w-full h-full object-cover rounded-md border"
                />
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
    </div>
  );
};

export default AboutUsComponent;
