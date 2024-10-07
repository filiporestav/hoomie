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
    <div className="mb-6 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
      <input
        type="text"
        placeholder="Sök på plats"
        className="border border-gray-300 p-3 rounded w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-amber-500"
        value={locationFilter}
        onChange={(e) => setLocationFilter(e.target.value)}
      />

      <div className="relative w-full md:w-1/3">
        <button
          onClick={handleToggleCalendar}
          className="w-full text-left border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {weekFilter.length > 0
            ? `Valda veckor: ${weekFilter.join(", ")}`
            : "Välj veckor"}
        </button>

        {isCalendarOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white p-4 rounded shadow-lg z-10">
            <WeekPicker weekFilter={weekFilter} setWeekFilter={setWeekFilter} />
          </div>
        )}
      </div>

      <button
        className="bg-amber-500 text-white p-3 rounded focus:outline-none hover:bg-amber-600 transition duration-150"
        onClick={clearFilters}
      >
        Rensa filter
      </button>
    </div>
  );
};

export default FilterBar;
