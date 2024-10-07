// app/annonser/FilterBar.tsx
"use client";

import React, { useState } from "react";
import WeekPicker from "./WeekPicker";

type FilterBarProps = {
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  weekFilter: string[];
  setWeekFilter: (weeks: string[]) => void;
  clearFilters: () => void;
};

const FilterBar: React.FC<FilterBarProps> = ({
  locationFilter,
  setLocationFilter,
  weekFilter,
  setWeekFilter,
  clearFilters,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleToggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
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
