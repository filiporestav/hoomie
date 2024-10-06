import React from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { addDays } from "date-fns";

interface FilterBarProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onFilterApply: () => void;
}

export default function FilterBar({
  dateRange,
  onDateRangeChange,
  onFilterApply,
}: FilterBarProps) {
  const defaultSelected: DateRange = {
    from: new Date(),
    to: addDays(new Date(), 7),
  };

  return (
    <div className="bg-white p-6 shadow rounded-lg mb-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <DayPicker
          mode="range"
          selected={dateRange}
          onSelect={onDateRangeChange}
          defaultMonth={defaultSelected.from}
          className="w-full md:w-auto"
        />
        <Button
          className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          onClick={onFilterApply}
        >
          Apply Filter
        </Button>
      </div>
    </div>
  );
}
