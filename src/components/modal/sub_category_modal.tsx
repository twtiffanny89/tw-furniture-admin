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
import { resizeImageConvertBase64 } from "@/utils/security/image_convert";
import CashImage from "../custom/CashImage";
import { Subcategory } from "@/redux/model/sub-category/sub_categpry_model";
import DropDownMenu from "../custom/drop_down_menu";
import {
  Category,
  CategorySelect,
} from "@/redux/model/category/category_model";
import { config } from "@/utils/config/config";

interface SubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  title: string;
  loadingButton?: boolean;
  initialData?: Subcategory | null;
  category: Category[];
  onLoadMore?: () => void;
  isLoading?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  value: string;
  hasNext?: boolean;
}

type ProcessedImage = {
  base64: string;
  type: string | null;
};

const SubCategoryModal = ({
  isOpen,
  onClose,
  loadingButton = false,
  initialData,
  title,
  onConfirm,
  category,
  onLoadMore,
  isLoading,
  onChange,
  onClearSearch,
  value,
  hasNext,
}: SubCategoryModalProps) => {
  const [nameSub, setNameSub] = useState("");
  const [image, setImage] = useState<ProcessedImage | null>(null);
  const [categoryItem, setCategoryItem] = useState<CategorySelect | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setNameSub(initialData.name);
      setImage({ base64: initialData.image?.imageUrl, type: null });
      setCategoryItem(initialData.category);
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const handleConfirm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!nameSub) newErrors.nameCategory = "Name Subcategories is required.";
    if (!image) newErrors.image = "Image Subcategory is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onConfirm({
      nameSub,
      image,
      idCategory: categoryItem?.id,
    });
  };

  const resetForm = () => {
    setNameSub("");
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
      const resizedBase64 = await resizeImageConvertBase64(file);
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

  function onItemSelect(value: CategorySelect) {
    setCategoryItem(value);
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
        <form>
          <div className="my-4 ">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Name Subcategories
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              type="text"
              placeholder="Input Subcategory name..."
              value={nameSub}
              onChange={(e) => {
                setNameSub(e.target.value);
                setErrors((prev) => ({ ...prev, nameCategory: "" }));
              }}
              required
              className="h-11"
            />
            {errors.nameCategory && (
              <MessgaeError message={errors.nameCategory} type="error" />
            )}
          </div>

          <DropDownMenu
            onItemSelect={onItemSelect}
            onClearSearch={onClearSearch}
            value={value}
            dataList={category}
            onChange={onChange}
            label="Category"
            onLoadMore={onLoadMore}
            isLoading={isLoading}
            selectedOption={categoryItem}
            hasNext={hasNext}
          />

          <div className="mb-4 mt-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Image subcategory<span className="text-red-500 ml-1">*</span>
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
              loading={loadingButton}
              textLoading="Saving..."
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

export default SubCategoryModal;
