"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { sv } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onFilterApply: () => void;
  onCleanFilters: () => void;
  className?: string;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  onFilterApply,
  onCleanFilters,
  className,
}: DateRangePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const handleCleanFilters = () => {
    onDateRangeChange(undefined);
    onCleanFilters();
    setIsCalendarOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "d MMM y", { locale: sv })} -{" "}
                  {format(dateRange.to, "d MMM y", { locale: sv })}
                </>
              ) : (
                format(dateRange.from, "d MMM y", { locale: sv })
              )
            ) : (
              <span>Välj datumintervall</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
            locale={sv}
          />
          <div className="flex justify-end gap-2 p-3">
            <Button
              variant="outline"
              className="text-xs"
              onClick={handleCleanFilters}
            >
              Rensa
            </Button>
            <Button
              className="text-xs"
              onClick={() => {
                onFilterApply();
                setIsCalendarOpen(false);
              }}
            >
              Välj datum
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
