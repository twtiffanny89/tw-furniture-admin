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

interface AttributeValue {
  id: string;
  valueType: string;
  value: string;
  label: string;
  attributeId: string;
  image?: { imageUrl: string }[];
}

interface Attribute {
  attribute: {
    id: string;
    name: string;
  };
  values: AttributeValue[];
}

export interface FormData {
  selectedAttributes: Record<string, AttributeValue>;
  price: string;
  stock: string;
  sku: string;
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
  onSubmit: (data: FormData) => void;
}

const AddVariantsModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  attributes,
  onSubmit,
}) => {
  const initialSelectedAttributes = attributes.reduce(
    (acc, attr) => ({ ...acc, [attr.attribute.name]: "" }),
    {}
  );

  const [selectedAttributes, setSelectedAttributes] = useState(
    initialSelectedAttributes
  );
  const [selectedFromDate, setSelectedFromDate] = useState<string>("");
  const [selectedToDate, setSelectedToDate] = useState<string>("");
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountType, setDiscountType] = useState<string | undefined>(
    undefined
  );
  const [imagesList, setImagesList] = useState<ProcessedImage[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSelectChange = (
    attributeName: string,
    selectedValue: AttributeValue
  ) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: selectedValue,
    }));
  };

  useEffect(() => {
    if (isOpen) {
      clearForm();
    }
  }, [isOpen]);

  const clearForm = () => {
    // Reset all the form fields to their initial values
    setSelectedAttributes(initialSelectedAttributes); // Reset selected attributes
    setStock(""); // Reset stock
    setSku(""); // Reset SKU
    setPrice(""); // Reset price
    setDiscount(""); // Reset discount
    setDiscountType(undefined); // Reset discount type
    setSelectedFromDate(""); // Reset start date
    setSelectedToDate(""); // Reset end date
    setImagesList([]); // Clear the uploaded images
    setErrors({}); // Clear any validation errors
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Price, stock, SKU validation
    if (!price) newErrors.price = "Price is required.";
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

    return Object.keys(newErrors).length === 0; // If no errors, return true
  };

  const handleSubmit = () => {
    console.log("### ==dd");
    if (!validateForm()) return;

    const formData = {
      selectedAttributes,
      price,
      stock,
      sku,
      discount,
      discountType,
      selectedFromDate,
      selectedToDate,
      imagesList,
    };

    // Pass the data to the parent component via onSubmit prop
    onSubmit(formData);

    onClose();
  };

  const handleRemoveImageList = (index: number) => {
    setImagesList((prev) => prev.filter((_, i) => i !== index));
  };

  // Assuming resizeImageConvertBase64 is defined elsewhere in your code
  const handleImageListUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Ensure the number of images doesn't exceed 5
    if (imagesList.length + files.length > 5) {
      setErrors((prev) => ({
        ...prev,
        images: "You can upload a maximum of 5 images.",
      }));
      return;
    }

    try {
      const promises = Array.from(files).map(async (file) => {
        // Cast the file to File type
        const resizedBase64 = await resizeImageConvertBase64(file as File); // Your resize function
        const fileExtension = `.${(file as File).type.split("/")[1]}`;
        return {
          base64: resizedBase64,
          type: fileExtension,
        };
      });

      const processedImages = await Promise.all(promises);

      // Update the imagesList state with the new images
      setImagesList((prevImages) => [...prevImages, ...processedImages]);

      // Clear any previous errors if images were uploaded successfully
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
                  onValueChange={(value) => {
                    // Find the selected value object from the list of values for this attribute
                    const selectedValue = values.find(
                      (valueObj) => valueObj.value === value
                    );
                    if (selectedValue) {
                      handleSelectChange(attribute.name, selectedValue); // Pass the full object
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
                        <SelectItem key={value.id} value={value.value}>
                          <div className="flex items-center gap-2">
                            {value.label}
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
                Stock (Optional)
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

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                SKU (Optional) <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                placeholder="Input a Stock Keeping Unit code..."
                value={sku}
                onChange={(e) => {
                  setSku(e.target.value);
                  setErrors((prev) => ({ ...prev, sku: "" }));
                }}
                className="h-11"
              />
              {errors.sku && <MessgaeError message={errors.sku} type="error" />}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Multiple Images <span className="text-red-500 ml-1">*</span>
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

          {/* Discount */}

          <div className="flex gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Discount <span className="text-red-500 ml-1">*</span>
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
                Discount <span className="text-red-500 ml-1">*</span>
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
                Discount <span className="text-red-500 ml-1">*</span>
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
                Discount <span className="text-red-500 ml-1">*</span>
              </label>
              <DateRangePicker
                initialDate={selectedToDate}
                onDateChange={setSelectedToDate}
                title="Discount To Date"
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
