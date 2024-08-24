// app/annonser/WeekPicker.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  format,
  startOfWeek,
  addWeeks,
  subMonths,
  addMonths,
  getWeek,
  getMonth,
  startOfMonth,
  endOfMonth,
  isAfter,
  isSameWeek,
} from "date-fns";
import { sv } from "date-fns/locale";

type WeekPickerProps = {
  weekFilter: string[];
  setWeekFilter: (weeks: string[]) => void;
};

const WeekPicker: React.FC<WeekPickerProps> = ({
  weekFilter,
  setWeekFilter,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  useEffect(() => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  }, []);

  const weeksInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const weeks = [];
    let current = startOfWeek(start, { weekStartsOn: 1 });

    while (current <= end) {
      weeks.push(current);
      current = addWeeks(current, 1);
    }

    return weeks;
  };

  const handleWeekClick = (weekStart: Date) => {
    if (
      isAfter(weekStart, currentWeekStart) ||
      isSameWeek(weekStart, currentWeekStart, { weekStartsOn: 1 })
    ) {
      const weekString = format(weekStart, "yyyy-'V'ww");
      if (weekFilter.includes(weekString)) {
        setWeekFilter(weekFilter.filter((week) => week !== weekString));
      } else {
        setWeekFilter([...weekFilter, weekString]);
      }
    }
  };

  const renderWeeks = () => {
    const weeks = weeksInMonth();
    return weeks.map((weekStart) => {
      const weekString = format(weekStart, "yyyy-'V'ww");
      const isSelected = weekFilter.includes(weekString);
      const isCurrentMonth = getMonth(weekStart) === getMonth(currentDate);
      const isPastWeek =
        !isAfter(weekStart, currentWeekStart) &&
        !isSameWeek(weekStart, currentWeekStart, { weekStartsOn: 1 });

      return (
        <div
          key={weekString}
          className={`cursor-pointer p-2 text-center border rounded-lg ${
            isSelected
              ? "bg-blue-500 text-white"
              : isPastWeek
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : isCurrentMonth
              ? "bg-gray-100"
              : "bg-gray-50 text-gray-400"
          }`}
          onClick={() => !isPastWeek && handleWeekClick(weekStart)}
        >
          {`V${getWeek(weekStart, { weekStartsOn: 1 })}`}
        </div>
      );
    });
  };

  const changeMonth = (amount: number) => {
    setCurrentDate((prevDate) =>
      amount > 0
        ? addMonths(prevDate, amount)
        : subMonths(prevDate, Math.abs(amount))
    );
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => changeMonth(-1)}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          Föregående
        </button>
        <h2 className="text-xl font-bold text-center mx-6">
          {format(currentDate, "MMMM yyyy", { locale: sv })}
        </h2>
        <button
          onClick={() => changeMonth(1)}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          Nästa
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">{renderWeeks()}</div>
    </div>
  );
};

export default WeekPicker;
