import React from "react";
import ButtonCustom from "../custom/ButtonCustom";
import { LuDownload } from "react-icons/lu";
import { DateRangePicker } from "../custom/date_range_picker";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

interface HeaderProps {
  onSearchClick?: () => void;
  onExportClick?: () => void;
  onClearSearchClick?: () => void;
  showExport?: boolean;
  title?: string;
  selectedFromDate: string;
  handleFromDateChange: (value: string) => void;
  selectedToDate: string;
  handleToDateChange: (value: string) => void;
}

const HeaderCalender: React.FC<HeaderProps> = ({
  onSearchClick,
  onExportClick,
  onClearSearchClick,
  selectedFromDate,
  handleFromDateChange,
  selectedToDate,
  handleToDateChange,
  showExport = false,
  title = "",
}) => {
  return (
    <div className="p-4 bg-white">
      <h1 className="font-bold text-xl">{title}</h1>
      <div className="flex mt-2 gap-2">
        <DateRangePicker
          initialDate={selectedFromDate}
          onDateChange={handleFromDateChange}
          title="From date"
        />
        <DateRangePicker
          initialDate={selectedToDate}
          onDateChange={handleToDateChange}
          title="To date"
        />
        {(selectedToDate || selectedFromDate) && (
          <ButtonCustom className="w-9 h-9" onClick={onClearSearchClick}>
            <IoClose size={18} />
          </ButtonCustom>
        )}

        <ButtonCustom className="w-9 h-9" onClick={onSearchClick}>
          <FiSearch size={18} />
        </ButtonCustom>

        {showExport && (
          <ButtonCustom className="w-9 h-9" onClick={onExportClick}>
            <LuDownload size={16} />
          </ButtonCustom>
        )}
      </div>
    </div>
  );
};

export default HeaderCalender;
