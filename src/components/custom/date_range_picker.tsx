"use client";

import { useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface DateRangePickerProps {
  onDateChange: (date: string) => void;
  initialDate?: string; // Optional prop to set the initial date
  title?: string; // Optional prop to set the initial date
  className?: string; // Optional prop to set the initial date
}

export function DateRangePicker({
  onDateChange,
  initialDate,
  title = "",
  className = "",
}: DateRangePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (initialDate) {
      const parsedDate = new Date(initialDate);
      if (!isNaN(parsedDate.getTime())) {
        setSelectedDate(parsedDate); // Set valid date
      }
    } else {
      setSelectedDate(undefined);
    }
  }, [initialDate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onDateChange(format(date, "yyyy-MM-dd"));
    }
  };

  return (
    <div className="flex space-x-4 ">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`text-left w-[200px] ${className}`}
          >
            {selectedDate && !isNaN(selectedDate.getTime())
              ? format(selectedDate, "PPP")
              : title}
            <CalendarIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white">
          <Calendar
            mode="single"
            selected={selectedDate} // Should be `undefined` or `Date`, not `null`
            onSelect={handleDateSelect} // Handle the date selection
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
