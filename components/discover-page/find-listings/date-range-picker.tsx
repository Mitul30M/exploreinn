"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { CalendarRange } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const today = new Date();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined, // Initially no range selected
  });

  // Calculate the maximum date dynamically,
  // ****Also here 30 is just a place holder, it should be replaced by the max no. days the hotel allows fro booking****
  const maxDate = date?.from ? addDays(date.from, 30) : undefined;

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-center text-foreground hover:text-primary rounded-none border-x-0",
              !date && "text-foreground"
            )}
          >
            <CalendarRange className="" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>CheckIn & CheckOut Dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from || today}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            disabled={{
              before: today, // Disable dates before today
              after: maxDate, // Disable dates beyond 30 days from `from`
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
