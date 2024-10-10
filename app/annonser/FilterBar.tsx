import React from "react"
import { DateRange } from "react-day-picker"
import { DateRangePicker } from "./date-range-picker"

interface FilterBarProps {
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  onFilterApply: () => void
  onCleanFilters: () => void
  className?: string
}

export default function FilterBar({
  dateRange,
  onDateRangeChange,
  onFilterApply,
  onCleanFilters,
  className = "",
}: FilterBarProps) {
  return (
    <div className={`bg-white p-2 rounded-lg ${className}`}>
      <DateRangePicker
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        onFilterApply={onFilterApply}
        onCleanFilters={onCleanFilters}
      />
    </div>
  )
}