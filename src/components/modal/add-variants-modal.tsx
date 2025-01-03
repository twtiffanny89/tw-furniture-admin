/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "../ui/select";
import Input from "../custom/Input";
import MessgaeError from "../error-handle/message_error";
import { ProcessedImage } from "@/redux/model/global/ProcessedImage";
import { resizeImageConvertBase64 } from "@/utils/security/image_convert";
import { LuImagePlus } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { Button } from "../ui/button";
import { DateRangePicker } from "../custom/date_range_picker";
import {
  Attribute,
  MainValue,
  Variant,
} from "@/redux/model/product/product-detail";
import CashImage from "../custom/CashImage";
import { config } from "@/utils/config/config";
import { delelteVariantImageValueProductService } from "@/redux/action/product-management/product-service";
import showToast from "../error-handle/show-toast";

export interface FormData {
  selectedAttributes: Record<string, MainValue>;
  price: string;
  stock: string;
  discount: string;
  discountType: string | undefined;
  selectedFromDate: string;
  selectedToDate: string;
  imagesList: ProcessedImage[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  attributes: Attribute[];
  initialData?: Variant | null;
  onSubmit: (data: FormData) => void;
}

interface SelectedAttribute {
  attributeValue: {
    value: string;
    label: string;
  };
}

const AddVariantsModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  attributes,
  onSubmit,
  initialData,
}) => {
  const initialSelectedAttributes = attributes.reduce(
    (acc, attr) => ({ ...acc, [attr.attribute.name]: "" }),
    {}
  );

  const [selectedAttributes, setSelectedAttributes] = useState<any>({});
  const [selectedFromDate, setSelectedFromDate] = useState<string>("");
  const [selectedToDate, setSelectedToDate] = useState<string>("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountType, setDiscountType] = useState<string | undefined>(
    undefined
  );
  const [imagesList, setImagesList] = useState<ProcessedImage[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSelectChange = (attributeName: string, selectedValue: any) => {
    setSelectedAttributes((prevState: any) => ({
      ...prevState,
      [attributeName]: selectedValue,
    }));
  };

  useEffect(() => {
    if (isOpen) {
      clearForm();
      setDataWhenEdit();
    }
  }, [isOpen]);

  function setDataWhenEdit() {
    if (initialData) {
      const initialSelected: Record<string, SelectedAttribute> = {};
      attributes.forEach(({ attribute, values }) => {
        const selectedValue = initialData.attributes.find(
          (attr: any) => attr.attributeId === attribute.id
        );
        if (selectedValue) {
          const value = selectedValue.attributeValue.value;
          initialSelected[attribute.name] = {
            attributeValue: {
              value,
              label: selectedValue.attributeValue.label,
            },
          };
        }
      });
      setSelectedAttributes(initialSelected);

      setPrice(initialData.price);
      setStock(String(initialData.stock));
      setDiscount(initialData.discount || "");
      setDiscountType(
        initialData.discount ? initialData.discountType : undefined
      );
      setSelectedFromDate(initialData.discountStartDate || "");
      setSelectedToDate(initialData.discountEndDate || "");

      const images = initialData.images.map((image) => ({
        base64: image.imageUrl,
        id: image.id,
        type: null,
      }));
      setImagesList(images);
    }
  }

  const clearForm = () => {
    setSelectedAttributes(initialSelectedAttributes);
    setStock("");
    setPrice("");
    setDiscount("");
    setDiscountType(undefined);
    setSelectedFromDate("");
    setSelectedToDate("");
    setImagesList([]);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!stock) newErrors.stock = "Stock is required.";
    if (imagesList.length === 0) {
      newErrors.images = "At least one image is required.";
    }

    if (discount || discountType || selectedFromDate || selectedToDate) {
      if (!discount) newErrors.discount = "Discount is required.";
      if (!discountType) newErrors.discountType = "Discount type is required.";
      if (!selectedFromDate) newErrors.fromdate = "From Date is required.";
      if (!selectedToDate) newErrors.todate = "To Date is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const formData: FormData = {
      selectedAttributes,
      price,
      stock,
      discount,
      discountType,
      selectedFromDate,
      selectedToDate,
      imagesList,
    };

    onSubmit(formData);
  };

  const handleRemoveImageList = async (
    index: number,
    imagesData: ProcessedImage
  ) => {
    if (imagesData.id) {
      const response = await delelteVariantImageValueProductService(
        imagesData.id
      );
      if (response.success) {
        showToast(response.message, "success");
      } else {
        showToast(response.message, "error");
      }
    }
    setImagesList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageListUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (imagesList.length + files.length > 5) {
      setErrors((prev) => ({
        ...prev,
        images: "You can upload a maximum of 5 images.",
      }));
      return;
    }

    try {
      const promises = Array.from(files).map(async (file) => {
        const resizedBase64 = await resizeImageConvertBase64(file as File);
        const fileExtension = `.${(file as File).type.split("/")[1]}`;
        return {
          base64: resizedBase64,
          type: fileExtension,
        };
      });

      const processedImages = await Promise.all(promises);

      setImagesList((prevImages) => [...prevImages, ...processedImages]);
      setErrors((prev) => ({ ...prev, images: "" }));
    } catch (error) {
      console.error("Error uploading images:", error);
      setErrors((prev) => ({
        ...prev,
        images: "There was an error uploading the images.",
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div
        className="relative bg-white w-11/12 max-w-4xl h-5/6 max-h-[85vh] p-6 rounded-lg overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-500 p-2 rounded-full"
          onClick={onClose}
        >
          &times;
        </button>

        <h3 className="text-xl font-semibold mb-4">Add Variant</h3>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {attributes.map(({ attribute, values }) => (
              <div key={attribute.id} className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {attribute.name}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Select
                  disabled={initialData != null}
                  value={
                    selectedAttributes[attribute.name]?.attributeValue?.value ||
                    ""
                  }
                  onValueChange={(value) => {
                    const selectedValue = values.find(
                      (valueObj) => valueObj.attributeValue.value === value
                    );
                    if (selectedValue) {
                      handleSelectChange(attribute.name, selectedValue);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${attribute.name}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{attribute.name}</SelectLabel>
                      {values.map((value) => (
                        <SelectItem
                          key={value.id}
                          value={value.attributeValue.value}
                        >
                          <div className="flex items-center gap-2">
                            {value.attributeValue.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Price
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                placeholder="Input Price..."
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
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Stock
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                placeholder="Input stock quantity..."
                value={stock}
                onChange={(e) => {
                  setStock(e.target.value);
                  setErrors((prev) => ({ ...prev, stock: "" }));
                }}
                required
                className="h-11"
              />
              {errors.stock && (
                <MessgaeError message={errors.stock} type="error" />
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Cover Images <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {imagesList.map((image, index) => (
                <div key={index} className="relative w-[96px] h-[96px]">
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
                    onClick={() => handleRemoveImageList(index, image)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-1 py-1 rounded"
                  >
                    <IoClose />
                  </button>
                </div>
              ))}

              <label
                htmlFor="multipleFileInput"
                className={`flex items-center justify-center w-[96px] h-[96px] bg-[#00000026] rounded-md cursor-pointer relative ${
                  imagesList.length >= 5 ? "hidden" : ""
                }`}
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
            {errors.images && (
              <MessgaeError message={errors.images} type="error" />
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Discount
              </label>
              <Input
                placeholder="0.0"
                value={discount}
                onChange={(e) => {
                  setDiscount(e.target.value);
                  setErrors((prev) => ({ ...prev, discount: "" }));
                }}
                className="h-11"
              />
              {errors.discount && (
                <MessgaeError message={errors.discount} type="error" />
              )}
            </div>
            <div className="w-[150px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Discount Type
              </label>
              <Select
                value={discountType}
                onValueChange={(value) => {
                  setDiscountType(value);
                  setErrors((prev) => ({ ...prev, discountType: "" }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Discount Type</SelectLabel>
                    <SelectItem value="PERCENTAGE">PERCENTAGE</SelectItem>
                    <SelectItem value="AMOUNT">AMOUNT</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.discountType && (
                <MessgaeError message={errors.discountType} type="error" />
              )}
            </div>
          </div>

          <div className="h-1" />

          <div className="flex flex-wrap gap-4 mt-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Discount Start Date
              </label>
              <DateRangePicker
                initialDate={selectedFromDate}
                onDateChange={setSelectedFromDate}
                title="Discount Start Date"
                className="h-11"
              />
              {errors.fromdate && (
                <MessgaeError message={errors.fromdate} type="error" />
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Discount End Date
              </label>
              <DateRangePicker
                initialDate={selectedToDate}
                onDateChange={setSelectedToDate}
                title="Discount End Date"
                className="h-11"
              />
              {errors.todate && (
                <MessgaeError message={errors.todate} type="error" />
              )}
            </div>
          </div>

          <div className="flex justify-end ">
            <Button className="h-11 text-white px-4" onClick={handleSubmit}>
              Save Variant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVariantsModal;
