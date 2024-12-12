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
    if (initialData) {
      setImage({ base64: initialData.imageUrl, type: null });
    } else {
      resetForm();
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
      newErrors.image = "Image banner is required."; // Add error if image is null
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
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const resizedBase64 = await resizeImageConvertBase64(file, 1920, 1080);
      const fileExtension = `.${file.type.split("/")[1]}`;
      setImage({
        base64: resizedBase64,
        type: fileExtension,
      });
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
            Please fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onKeyDown={handleKeyPress}>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Image Banner<span className="text-red-500 ml-1">*</span>
            </label>
            {image ? (
              <div className="relative w-[360px] h-[200px] ">
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
                    imageUrl={`${process.env.NEXT_PUBLIC_BASE_URL}${image.base64}`}
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
                className="flex items-center justify-center w-[361px] h-[200px] bg-[#00000026] rounded-md cursor-pointer relative"
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
