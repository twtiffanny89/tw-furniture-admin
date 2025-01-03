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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  AttributeListModel,
  AttributeModel,
} from "@/redux/model/attribute-model/attribute-model";
import { getAttributeService } from "@/redux/action/product-management/attribute-service";
import { ProcessedImage } from "@/redux/model/global/ProcessedImage";
import { IoClose } from "react-icons/io5";
import { LuImagePlus } from "react-icons/lu";
import { resizeImageConvertBase64 } from "@/utils/security/image_convert";
import { MainValue } from "@/redux/model/product/product-detail";
import CashImage from "../custom/CashImage";
import { config } from "@/utils/config/config";

interface SubAttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    name: string;
    selectedAttribute: AttributeModel;
    image?: ProcessedImage | null;
  }) => void;
  title: string;
  initialData?: MainValue | null;
}

const AddAttributeModal = ({
  isOpen,
  onClose,
  initialData,
  title,
  onConfirm,
}: SubAttributeModalProps) => {
  const [name, setName] = useState("");
  const [selectedValue, setSelectedValue] = useState<AttributeModel | null>(
    null
  );
  const [image, setImage] = useState<ProcessedImage | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [attribute, setAttribute] = useState<AttributeListModel | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.attributeValue?.label || "");
      if (initialData) {
        setImage({
          base64: initialData?.attributeValue?.image[0]?.imageUrl || "",
          type: null,
        });
      } else {
        callApiWhenOpen();
        resetForm();
      }
    }
  }, [initialData, isOpen]);

  async function callApiWhenOpen() {
    const response = await getAttributeService({});
    setAttribute(response);
  }

  const handleConfirm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = "Name is required.";
    if (!initialData) {
      if (!selectedValue)
        newErrors.selectedValue = "Attribute selection is required.";
    }

    if (selectedValue?.name === "Color" && !image) {
      newErrors.image = "Image is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onConfirm({
      name,
      selectedAttribute: selectedValue!,
      image, // Pass the image data if available
    });
  };

  const resetForm = () => {
    setName("");
    setSelectedValue(null);
    setImage(null); // Clear the image on reset
    setErrors({});
  };

  const handleSelectChange = (value: string) => {
    // Find the full object based on selected id
    const selectedAttribute = attribute?.data.find((item) => item.id === value);
    setSelectedValue(selectedAttribute || null);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Please fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form>
          {!initialData && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Select Attribute
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Select
                onValueChange={handleSelectChange}
                value={selectedValue?.id || undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an option" />
                </SelectTrigger>
                <SelectContent>
                  {attribute?.data.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.selectedValue && (
                <MessgaeError message={errors.selectedValue} type="error" />
              )}
            </div>
          )}

          {/* Input for Name */}
          <div className="my-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              type="text"
              placeholder="Input attribute name..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
              required
              className="h-11"
            />
            {errors.name && <MessgaeError message={errors.name} type="error" />}
          </div>

          {/* Single Image Upload */}
          {(initialData?.attributeValue?.valueType == "COLOR" ||
            selectedValue?.name === "Color") && (
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Single Image<span className="text-red-500 ml-1">*</span>
              </label>
              {image ? (
                <div className="relative w-[96px] h-[96px]">
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
              {errors.image && (
                <MessgaeError message={errors.image} type="error" />
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            <ButtonCustom
              onClick={onClose}
              className="px-4 py-1.5"
              variant="cancel"
            >
              Cancel
            </ButtonCustom>
            <ButtonCustom
              onClick={handleConfirm}
              className="px-4 py-1.5 transition"
            >
              {initialData ? "Update" : "Create"}
            </ButtonCustom>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAttributeModal;
