import React from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { addDays } from "date-fns";

interface FilterBarProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onFilterApply: () => void;
  className?: string; // Optional className prop
}

export default function FilterBar({
  dateRange,
  onDateRangeChange,
  onFilterApply,
  className = "",
}: FilterBarProps) {
  const defaultSelected: DateRange = {
    from: new Date(),
    to: addDays(new Date(), 7),
  };

  return (
    <div className={`bg-white p-2 shadow-sm rounded-lg mb-2 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <DayPicker
          mode="range"
          selected={dateRange}
          onSelect={onDateRangeChange}
          defaultMonth={defaultSelected.from}
          className="w-full md:w-auto text-sm"
          style={{ fontSize: "0.8rem" }} // Reduced font size
        />
        <Button
          className="px-4 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
          onClick={onFilterApply}
        >
          Apply Filter
        </Button>
      </div>
    </div>
  );
}
