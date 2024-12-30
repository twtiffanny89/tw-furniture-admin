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
  }, [value, dataList]);

  // Debugging: Check if inView is triggered
  useEffect(() => {
    if (inView && onLoadMore && !isLoading) {
      onLoadMore();
    }
  }, [inView, onLoadMore, isLoading]);

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
            <span
              className={`text-xs whitespace-nowrap py-0.5 overflow-hidden text-ellipsis`}
            >
              {selectedOption
                ? selectedOption.name
                : `Select ${label.toLowerCase()}`}
            </span>
            <div className="flex">
              <FiChevronDown />
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-full border border-gray-300 rounded-md shadow-lg bg-white">
          <div className="flex items-center border-b border-gray-300 py-1 ">
            <Input
              ref={searchInputRef}
              type="text"
              className="w-full px-2 py-0.5 border-[0px] bg-transparent"
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
              dataList.map((option, index) => (
                <DropdownMenuItem
                  onClick={() => onItemSelect(option)}
                  key={index}
                  className="cursor-pointer hover:bg-gray-200"
                >
                  <span className="text-sm min-w-96">{option.name}</span>
                </DropdownMenuItem>
              ))
            ) : (
              <span className="block min-w-96 text-sm py-4 px-2 text-gray-600">
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
