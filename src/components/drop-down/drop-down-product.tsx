// DropDownProduct.tsx
import React, { useEffect, useRef } from "react";
import { FiChevronDown, FiLoader, FiX } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useInView } from "react-intersection-observer";
import Input from "../custom/Input";
import { Product } from "@/redux/model/product/product-model";
import Image from "next/image"; // Import Image component
import { config } from "@/utils/config/config";

interface CustomSelectProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onItemSelect: (value: Product) => void;
  value: string;
  label: string;
  dataList: Product[];
  onLoadMore?: () => void;
  isLoading?: boolean;
  noNext?: boolean;
  selectedOption: Product | null;
}

const DropDownProduct = ({
  label,
  dataList,
  onChange,
  onLoadMore,
  isLoading = false,
  value = "",
  onClearSearch,
  onItemSelect,
  selectedOption,
  noNext,
}: CustomSelectProps) => {
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const { ref: endOfListRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [dataList]);

  useEffect(() => {
    if (inView && onLoadMore && !isLoading) {
      onLoadMore();
    }
  }, [inView, onLoadMore, isLoading]);

  // Helper function to safely get the image URL
  const getImageUrl = (product: Product) => {
    try {
      if (
        product &&
        product.mainImage &&
        Array.isArray(product.mainImage) &&
        product.mainImage.length > 0 &&
        product.mainImage[0].imageUrl
      ) {
        return `${config.BASE_URL}${product.mainImage[0].imageUrl}`;
      }
      return null;
    } catch (error) {
      console.error("Error getting image URL:", error);
      return null;
    }
  };

  // Check if the selected product has a valid image
  const selectedImageUrl = selectedOption ? getImageUrl(selectedOption) : null;

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
        <span className="text-red-500 ml-1">*</span>
      </label>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`flex h-11 justify-between items-center w-full border border-gray-300 rounded-md px-3 cursor-pointer`}
          >
            {/* Show image preview for selected product */}
            {selectedImageUrl && (
              <div className="h-8 w-8 mr-2 relative overflow-hidden rounded">
                <Image
                  src={selectedImageUrl}
                  alt={selectedOption?.name || "Selected product"}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
            )}
            <span
              className={`text-xs whitespace-nowrap py-0.5 overflow-hidden text-ellipsis ${
                selectedImageUrl ? "flex-1" : "flex-auto"
              }`}
            >
              {selectedOption
                ? selectedOption.name
                : `Select ${label.toLowerCase()}`}
            </span>
            <div className="flex ml-2">
              <FiChevronDown />
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-96 border border-gray-300 rounded-md shadow-lg bg-white">
          <div className="flex items-center border-b border-gray-300 py-1 px-2">
            <Input
              ref={searchInputRef}
              type="text"
              className="px-2 py-0.5 border-[0px] bg-transparent"
              placeholder="Search..."
              value={value}
              onChange={onChange}
            />
            {value && (
              <FiX
                className="cursor-pointer text-gray-500"
                onClick={onClearSearch}
                aria-label="Clear search"
              />
            )}
          </div>

          <div className="max-h-48 overflow-y-auto pb-1">
            {dataList.length > 0 ? (
              dataList.map((option, index) => {
                const imageUrl = getImageUrl(option);
                return (
                  <DropdownMenuItem
                    onClick={() => onItemSelect(option)}
                    key={index}
                    className="cursor-pointer hover:bg-gray-200 py-2"
                  >
                    <div className="flex items-center w-full">
                      {/* Show image preview for each product in dropdown list */}
                      {imageUrl ? (
                        <div className="h-8 w-8 mr-3 relative overflow-hidden rounded">
                          <Image
                            src={imageUrl}
                            alt={option.name}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        // If no image is available, add a placeholder for consistent alignment
                        <div className="h-8 w-8 mr-3 bg-gray-200 rounded"></div>
                      )}
                      <span className="text-sm flex-1">{option.name}</span>
                    </div>
                  </DropdownMenuItem>
                );
              })
            ) : (
              <span className="block text-sm py-4 px-2 text-gray-600">
                No options found
              </span>
            )}
            {noNext && (
              <div
                ref={endOfListRef}
                className="text-center py-2 flex justify-center"
              >
                <FiLoader
                  className="animate-spin text-gray-500 text-xl"
                  aria-label="Loading"
                />
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropDownProduct;
