"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn, lowerCase } from "@/lib/utils";
import { countries } from "@/lib/utils/country/countries";
import { type CountryProps } from "@/lib/types/forms/countries";

interface CountryDropdownProps {
  disabled?: boolean;
}

const CountryDropdown = ({ disabled }: CountryDropdownProps) => {
  const [countryValue, setCountryValue] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const C = countries as CountryProps[];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[300px] justify-between rounded-[6px] border !border-[#27272a] !bg-[#0f0f11] hover:!bg-[#0f0f11] focus:!bg-[#0f0f11] focus:!outline-none focus:!ring-2 focus:!ring-[#0f0f11] focus:!ring-offset-2 focus:!ring-offset-[#0f0f11]"
          disabled={disabled}
        >
          <span>
            {countryValue ? (
              <div className="flex items-end gap-2">
                <span>
                  {
                    C.find(
                      (country) => lowerCase(country.name) === countryValue
                    )?.emoji
                  }
                </span>
                <span>
                  {
                    C.find(
                      (country) => lowerCase(country.name) === countryValue
                    )?.name
                  }
                </span>
              </div>
            ) : (
              <span>Select Country...</span>
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] rounded-[6px] border border-[#27272a] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-[300px] w-full">
              {C.map((country) => (
                <CommandItem
                  key={country.id}
                  value={country.name}
                  onSelect={(currentValue) => {
                    setCountryValue(
                      currentValue === lowerCase(country.name)
                        ? currentValue
                        : ""
                    );
                    setOpen(false);
                  }}
                  className="flex cursor-pointer items-center justify-between text-xs hover:!bg-[#27272a] hover:!text-white"
                >
                  <div className="flex items-end gap-2">
                    <span>{country.emoji}</span>
                    <span>{country.name}</span>
                  </div>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      countryValue === lowerCase(country.name)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CountryDropdown;
