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
    const resposne = await getAboutUsService();
    setAboutUsData(resposne);
    setFormData({
      email: resposne?.email ? resposne?.email.trim() : "",
      location: resposne?.location ? resposne?.location.trim() : "",
      phoneNumber: resposne?.phoneNumber ? resposne?.phoneNumber.trim() : "",
      phoneStore: resposne?.phoneStore ? resposne?.phoneStore.trim() : "",
      bankName: resposne?.bankName ? resposne?.bankName.trim() : "",
      bankNumber: resposne?.bankNumber ? resposne?.bankNumber.trim() : "",
      availableTime: resposne?.availableTime
        ? resposne?.availableTime.trim()
        : "",
      showroomHours: resposne?.showroomHours
        ? resposne?.showroomHours.trim()
        : "",
      websiteUrl: resposne?.websiteUrl ? resposne?.websiteUrl.trim() : "",
      telegramUrl: resposne?.telegramUrl ? resposne?.telegramUrl.trim() : "",
      messagerUrl: resposne?.messagerUrl ? resposne?.messagerUrl.trim() : "",
      facebookUrl: resposne?.facebookUrl ? resposne?.facebookUrl.trim() : "",
      instagramUrl: resposne?.instagramUrl ? resposne?.instagramUrl.trim() : "",
      twitterUrl: resposne?.twitterUrl ? resposne?.twitterUrl.trim() : "",
      description: resposne?.description ? resposne?.description.trim() : "",
    });
    setImageQRData(
      resposne?.abaQrImage
        ? {
            base64: resposne?.abaQrImage?.imageUrl,
            type: null,
          }
        : null
    );
    setImageData(
      resposne?.image
        ? {
            base64: resposne?.image?.imageUrl,
            type: null,
          }
        : null
    );
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
      const resizedBase64 = await resizeImageConvertBase64(file);
      const fileExtension = `.${file.type.split("/")[1]}`;
      setImageData({
        base64: resizedBase64,
        type: fileExtension,
      });
    }
  };

  const handleImagQReUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const resizedBase64 = await resizeImageConvertBase64(file);
      const fileExtension = `.${file.type.split("/")[1]}`;
      setImageQRData({
        base64: resizedBase64,
        type: fileExtension,
      });
    }
  };

  const handleRemoveImage = () => {
    setImageData(null); // Clear the image state
  };

  const handleRemoveImageQR = () => {
    setImageQRData(null); // Clear the image state
  };

  const handleFormSubmit = async () => {
    setLoading(true);

    const response = await updateAboutUsService({
      aboutUsId: aboutUsData?.id || "",
      data: formData,
    });
    if (response.success) {
      showToast(response.message, "success");
    } else {
      showToast(response.message, "error");
    }

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
          ...prev,
          base64: responseImg.data?.imageUrl, // Ensure base64 is a string
          type: null,
        }));
        showToast(responseImg.message, "success");
      } else {
        showToast(responseImg.message, "error");
      }
    }

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
          ...prev,
          base64: responseQR.data?.imageUrl || "",
          type: null,
        }));
        showToast(responseQR.message, "success");
      } else {
        showToast(responseQR.message, "error");
      }
    }

    setLoading(false);
  };

  return (
    <div>
      <div className="p-4 bg-white flex justify-between">
        <h1 className="font-bold text-xl">About us</h1>
        <div className="flex gap-4">
          <ButtonCustom className={`px-4 py-1`} onClick={handleFormSubmit}>
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

        <div className="flex gap-8 mt-4">
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Aboutus Profile<span className="text-red-500 ml-1">*</span>
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

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Image QR Code<span className="text-red-500 ml-1">*</span>
            </label>
            {imageQRData ? (
              <div className="relative w-24 h-24">
                {imageQRData?.type ? (
                  <img
                    src={imageQRData.base64}
                    alt="Uploaded Preview"
                    className="w-full h-full object-cover rounded-md border"
                  />
                ) : (
                  <CashImage
                    width={96}
                    height={96}
                    imageUrl={`${config.BASE_URL}${imageQRData.base64}`}
                  />
                )}

                <button
                  onClick={handleRemoveImageQR}
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
                  onChange={handleImagQReUpload}
                  className="hidden"
                />
                <LuImagePlus className="text-gray-500 text-2xl rounded" />
              </label>
            )}
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={8}
            placeholder="Type your text here..."
            className="w-full p-2 rounded border border-gray-300 focus:border-primary focus:outline-none text-base"
          />
        </div>
      </div>
      <CenteredLoading loading={loading} text="Updating, please wait ..." />
    </div>
  );
};

export default AboutUsComponent;
