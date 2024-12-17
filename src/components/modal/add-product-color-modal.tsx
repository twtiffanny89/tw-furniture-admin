/* eslint-disable @next/next/no-img-element */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import React, { ChangeEvent, useEffect, useState } from "react";
import Input from "../custom/Input";
import MessgaeError from "../error-handle/message_error";
import ButtonCustom from "../custom/ButtonCustom";
import { AttributeModel } from "@/redux/model/attribute-model/attribute-model";
import { LuImagePlus } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import CashImage from "../custom/CashImage";
import { config } from "@/utils/config/config";
import { ProcessedImage } from "@/redux/model/global/ProcessedImage";
import { resizeImageConvertBase64 } from "@/utils/security/image_convert";

interface AttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  title: string;
  initialData?: AttributeModel | null;
}

const AddProductColorModal = ({
  isOpen,
  onClose,
  initialData,
  title,
  onConfirm,
}: AttributeModalProps) => {
  const [attribudeValueName, setAttribudeValueName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<ProcessedImage | null>(null);
  const [imagesList, setImagesList] = useState<ProcessedImage[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setAttribudeValueName(initialData.name);
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
    if (!attribudeValueName) newErrors.attribudeValueName = "Name is required.";
    if (!price) newErrors.price = "Price is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onConfirm({ attribudeValueName, price, image, imagesList });
  };

  const resetForm = () => {
    setAttribudeValueName("");
    setPrice("");
    setImage(null);
    setImagesList([]);
    setErrors({});
  };

  const onCloseFrom = () => {
    resetForm();
    onClose();
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const resizedBase64 = await resizeImageConvertBase64(file);
      const fileExtension = `.${file.type.split("/")[1]}`;
      setImage({
        base64: resizedBase64,
        type: fileExtension,
      });
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleImageListUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const promises = Array.from(files).map(async (file) => {
      const resizedBase64 = await resizeImageConvertBase64(file);
      const fileExtension = `.${file.type.split("/")[1]}`;
      return {
        base64: resizedBase64,
        type: fileExtension,
      };
    });

    const processedImages = await Promise.all(promises);
    setImagesList((prevImages) => [...prevImages, ...processedImages]);
  };

  const handleRemoveImageList = (index: number): void => {
    setImagesList((prevImages) => prevImages.filter((_, i) => i !== index));
  };

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
          {/* Attribute Value */}
          <div className="my-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Attribute Value
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              type="text"
              placeholder="Input attribute value..."
              value={attribudeValueName}
              onChange={(e) => {
                setAttribudeValueName(e.target.value);
                setErrors((prev) => ({ ...prev, attribudeValueName: "" }));
              }}
              required
              className="h-11"
            />
            {errors.attribudeValueName && (
              <MessgaeError message={errors.attribudeValueName} type="error" />
            )}
          </div>

          {/* Price */}
          <div className="my-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Price
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              type="text"
              placeholder="Input price value..."
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                setErrors((prev) => ({ ...prev, price: "" }));
              }}
              required
              className="h-11"
            />
            {errors.price && (
              <MessgaeError message={errors.price} type="error" />
            )}
          </div>

          {/* Single Image Upload */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Single Image<span className="text-red-500 ml-1">*</span>
            </label>
            {image ? (
              <div className="relative w-[96px] h-[96px]">
                <img
                  src={image.base64}
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
                htmlFor="singleFileInput"
                className="flex items-center justify-center w-[96px] h-[96px] bg-[#00000026] rounded-md cursor-pointer relative"
              >
                <input
                  id="singleFileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <LuImagePlus className="text-gray-500 text-2xl rounded" />
              </label>
            )}
          </div>

          {/* Multiple Images Upload */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Multiple Images<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {imagesList.map((image, index) => (
                <div key={index} className="relative w-[96px] h-[96px]">
                  <img
                    src={image.base64}
                    alt={`Uploaded Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-md border"
                  />
                  <button
                    onClick={() => handleRemoveImageList(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-1 py-1 rounded"
                  >
                    <IoClose />
                  </button>
                </div>
              ))}

              <label
                htmlFor="multipleFileInput"
                className="flex items-center justify-center w-[96px] h-[96px] bg-[#00000026] rounded-md cursor-pointer relative"
              >
                <input
                  id="multipleFileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageListUpload}
                  multiple
                  className="hidden"
                />
                <LuImagePlus className="text-gray-500 text-2xl rounded" />
              </label>
            </div>
          </div>

          {/* Action Buttons */}
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

export default AddProductColorModal;
