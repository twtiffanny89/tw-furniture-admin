/* eslint-disable @next/next/no-img-element */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import MessgaeError from "../error-handle/message_error";
import ButtonCustom from "../custom/ButtonCustom";
import { LuImagePlus } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { resizeImageConvertBase64 } from "@/utils/security/image_convert";
import CashImage from "../custom/CashImage";
import { ProcessedImage } from "@/redux/model/global/ProcessedImage";
import { BannerModel } from "@/redux/model/banner/banner_model";
import { config } from "@/utils/config/config";

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: ProcessedImage) => void;
  title: string;
  initialData?: BannerModel | null;
}

const BannerModal = ({
  isOpen,
  onClose,
  initialData,
  title,
  onConfirm,
}: BannerModalProps) => {
  const [image, setImage] = useState<ProcessedImage | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Edit mode - populate with existing data
        setImage({ base64: initialData.imageUrl, type: null });
        setErrors({}); // Clear any previous errors
      } else {
        // Create mode - reset to default values
        resetForm();
      }
    }
  }, [initialData, isOpen]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const handleConfirm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!image) {
      newErrors.image = "Image banner is required.";
      setErrors(newErrors);
      return;
    }
    onConfirm(image);
  };

  const resetForm = () => {
    setImage(null);
    setErrors({});
  };

  const handleRemoveImage = () => {
    setImage(null); // Clear the image state
    // Clear image error when removing image
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const resizedBase64 = await resizeImageConvertBase64(file);
        const fileExtension = `.${file.type.split("/")[1]}`;
        setImage({
          base64: resizedBase64,
          type: fileExtension,
        });
        // Clear image error if upload is successful
        setErrors((prev) => ({ ...prev, image: "" }));
      } catch (error) {
        // Error handling is already done in resizeImageConvertBase64 function
        console.error("Image upload failed:", error);
        // Reset file input
        event.target.value = "";
      }
    }
  };

  function onCloseFrom() {
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onCloseFrom}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Please upload a banner image. Supported formats: PNG, JPEG, JPG (Max
            5MB)
          </DialogDescription>
        </DialogHeader>
        <form onKeyDown={handleKeyPress}>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Image Banner<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="text-xs text-gray-500 mb-2">
              Recommended size: 1920x1080px or 16:9 aspect ratio
            </div>
            {image ? (
              <div className="relative w-[360px] h-[200px]">
                {image.type ? (
                  <img
                    src={image.base64}
                    alt="Uploaded Preview"
                    className="w-full h-full object-cover rounded-md border"
                  />
                ) : (
                  <CashImage
                    borderRadius={0}
                    width={361}
                    height={200}
                    imageUrl={`${config.BASE_URL}${image.base64}`}
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
                htmlFor="fileInput"
                className="flex flex-col items-center justify-center w-[361px] h-[200px] bg-[#00000026] rounded-md cursor-pointer relative border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
              >
                <input
                  id="fileInput"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <LuImagePlus className="text-gray-500 text-3xl mb-2" />
                <span className="text-gray-500 text-sm">
                  Click to upload banner
                </span>
                <span className="text-gray-400 text-xs mt-1">
                  PNG, JPEG, JPG up to 5MB
                </span>
              </label>
            )}
            {errors.image && (
              <MessgaeError message={errors.image} type="error" />
            )}
          </div>

          <div className="flex justify-end space-x-2 mt-8">
            <ButtonCustom
              onClick={onCloseFrom}
              className="px-4 py-1.5"
              variant="cancel"
            >
              Cancel
            </ButtonCustom>
            <ButtonCustom
              onClick={handleConfirm}
              className="px-4 py-1.5 transition"
            >
              Save
            </ButtonCustom>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BannerModal;
