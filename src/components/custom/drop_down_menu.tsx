import React, { useState, useEffect, useRef } from "react";
import { FiChevronDown, FiLoader, FiX } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Category } from "@/redux/model/category/category_model";
import { useInView } from "react-intersection-observer";
import Input from "./input";

interface CustomSelectProps {
  onChange: (option: Category | null) => void;
  label: string;
  dataList: Category[];
  onLoadMore?: () => void; // Callback for loading more items
  isLoading?: boolean; // Indicates if data is being loaded
}

const DropDownMenu = ({
  label,
  dataList,
  onChange,
  onLoadMore,
  isLoading = false,
}: CustomSelectProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState<Category | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const { ref: endOfListRef, inView } = useInView({
    threshold: 1.0,
    triggerOnce: false, // Trigger multiple times
  });

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectOption = (option: Category) => {
    setSelectedOption(option);
    onChange(option); // Notify parent of the selected option
  };

  // Focus on search input when dropdown opens
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Debugging: Check if inView is
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
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <FiX
                className="cursor-pointer text-gray-500"
                onClick={() => {
                  setSearchTerm("");
                }}
                aria-label="Clear search"
              />
            )}
          </div>

          <div className="max-h-48 overflow-y-auto pb-1">
            {dataList.length > 0 ? (
              dataList.map((option, index) => (
                <DropdownMenuItem
                  onClick={() => handleSelectOption(option)}
                  key={index}
                  className="cursor-pointer hover:bg-gray-200"
                >
                  <span className="text-sm">{option.name}</span>
                </DropdownMenuItem>
              ))
            ) : (
              <span className="block text-sm py-4 px-2 text-gray-600">
                No options found
              </span>
            )}

            <div
              ref={endOfListRef}
              className="text-center py-2 flex justify-center"
            >
              {isLoading && (
                <FiLoader
                  className="animate-spin text-gray-500 text-xl"
                  aria-label="Loading"
                />
              )}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropDownMenu;