import React from "react";
import { HiRefresh } from "react-icons/hi";
import { LuDownload } from "react-icons/lu";
import { IoMdAdd } from "react-icons/io";
import ButtonCustom from "../custom/ButtonCustom";
import Input from "../custom/input";

interface HeaderProps {
  onSearchChange?: (value: string) => void;
  onRefreshClick?: () => void;
  onExportClick?: () => void;
  onAddNewClick?: () => void;
  showAdd?: boolean;
  showExport?: boolean;
  title?: string;
  placeholder?: string;
}

const Header: React.FC<HeaderProps> = ({
  onSearchChange,
  onRefreshClick,
  onExportClick,
  onAddNewClick,
  showAdd = false,
  showExport = false,
  title = "User Profile",
  placeholder = "",
}) => {
  return (
    <div className="p-4 bg-white">
      <h1 className="font-bold text-xl">{title}</h1>
      <div className="flex mt-2">
        <div className="flex flex-1 gap-2">
          <Input
            className="max-w-md h-9"
            placeholder={placeholder}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onSearchChange?.(e.target.value)
            }
          />
          <ButtonCustom className="w-9 h-9" onClick={onRefreshClick}>
            <HiRefresh size={20} />
          </ButtonCustom>
          {showExport && (
            <ButtonCustom className="w-9 h-9" onClick={onExportClick}>
              <LuDownload size={16} />
            </ButtonCustom>
          )}
        </div>
        {showAdd && (
          <ButtonCustom
            className="px-4 h-9 ml-2 font-normal text-xs"
            onClick={onAddNewClick}
          >
            <IoMdAdd className="text-white mr-1" size={18} /> Add New
          </ButtonCustom>
        )}
      </div>
    </div>
  );
};

export default Header;
