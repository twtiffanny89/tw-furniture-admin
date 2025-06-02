/* eslint-disable @next/next/no-img-element */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import Input from "../custom/Input";
import MessgaeError from "../error-handle/message_error";
import ButtonCustom from "../custom/ButtonCustom";
import { LuImagePlus } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { MdToggleOn, MdToggleOff } from "react-icons/md";
import { resizeImageConvertBase64 } from "@/utils/security/image_convert";
import { Category } from "@/redux/model/category/category_model";
import CashImage from "../custom/CashImage";
import { config } from "@/utils/config/config";
import { Switch } from "../custom/Switch";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  title: string;
  initialData?: Category | null;
}

type ProcessedImage = {
  base64: string;
  type: string | null;
};

const CategoryModal = ({
  isOpen,
  onClose,
  initialData,
  title,
  onConfirm,
}: CategoryModalProps) => {
  const [nameCategory, setNameCategory] = useState("");
  const [image, setImage] = useState<ProcessedImage | null>(null);
  const [isActive, setIsActive] = useState(true); // Default to active
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setNameCategory(initialData.name);
      setImage({ base64: initialData.image?.imageUrl, type: null });
      setIsActive(initialData.isPublic ?? true); // Use initialData.isActive or default to true
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
    if (!nameCategory) newErrors.nameCategory = "Name category is required.";
    if (!image) newErrors.image = "Image category is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onConfirm({
      nameCategory,
      image,
      isActive,
    });
  };

  const resetForm = () => {
    setNameCategory("");
    setImage(null);
    setIsActive(true); // Reset to default active state
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
      }
    }
  };

  const toggleActive = () => {
    setIsActive(!isActive);
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
          <div className="my-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Category
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              type="text"
              placeholder="Input category name..."
              value={nameCategory}
              onChange={(e) => {
                setNameCategory(e.target.value);
                setErrors((prev) => ({ ...prev, nameCategory: "" }));
              }}
              required
              className="h-11"
            />
            {errors.nameCategory && (
              <MessgaeError message={errors.nameCategory} type="error" />
            )}
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Image category<span className="text-red-500 ml-1">*</span>
            </label>
            {image ? (
              <div className="relative w-24 h-24">
                {image.type ? (
                  <img
                    src={image.base64}
                    alt="Uploaded Preview"
                    className="w-full h-full object-cover rounded-md border"
                  />
                ) : (
                  <CashImage
                    width={96}
                    height={96}
                    imageUrl={`${config.BASE_URL}${image.base64}`}
                  />
                )}

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white px-1 py-1 rounded"
                >
                  <IoClose />
                </button>
              </div>
            ) : (
              <label
                htmlFor="fileInput"
                className="flex items-center justify-center w-24 h-24 bg-[#00000026] rounded-md cursor-pointer relative"
              >
                <input
                  id="fileInput"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
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

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex items-center space-x-3">
              <Switch checked={isActive} onChange={toggleActive} />
              <span
                className={`text-sm font-medium ${
                  isActive ? "text-green-600" : "text-gray-500"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
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

export default CategoryModal;
