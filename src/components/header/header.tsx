import React from "react";
import Input from "../custom/input";
import Button from "../custom/button";
import { HiRefresh } from "react-icons/hi";
import { LuDownload } from "react-icons/lu";
import { IoMdAdd } from "react-icons/io";

interface HeaderProps {
  onSearchChange?: (value: string) => void;
  onRefreshClick?: () => void;
  onExportClick?: () => void;
  onAddNewClick?: () => void;
  showAdd?: Boolean;
  showExport?: Boolean;
}

const Header: React.FC<HeaderProps> = ({
  onSearchChange,
  onRefreshClick,
  onExportClick,
  onAddNewClick,
  showAdd = false,
  showExport = false,
}) => {
  return (
    <div className="p-4 bg-white">
      <h1 className="font-bold text-xl">User Profile</h1>
      <div className="flex mt-2">
        <div className="flex flex-1 gap-2">
          <Input
            className="max-w-md h-9"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onSearchChange?.(e.target.value)
            }
          />
          <Button className="w-9 h-9" onClick={onRefreshClick}>
            <HiRefresh size={20} />
          </Button>
          {showExport && (
            <Button className="w-9 h-9" onClick={onExportClick}>
              <LuDownload size={16} />
            </Button>
          )}
        </div>
        {showAdd && (
          <Button
            className="px-4 h-9 ml-2 font-normal text-xs"
            onClick={onAddNewClick}
          >
            <IoMdAdd className="text-white mr-1" size={18} /> Add New
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
