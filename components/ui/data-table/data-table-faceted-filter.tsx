import * as React from "react";
import { Column, Table } from "@tanstack/react-table";
import { Check, LucideIcon, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface DataTableFacetedFilterProps<TData, TValue> {
  table: Table<TData>;
  column: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon: LucideIcon;
    className: string;
  }[];
  defaultSelectedOption?: {
    label: string;
    value: string;
    icon: LucideIcon;
    className: string;
  }[];
  applyFilterOnlyOnce?: boolean;
}

export function DataTableFacetedFilter<TData, TValue>({
  table,
  column,
  title,
  options,
  defaultSelectedOption,
  applyFilterOnlyOnce,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column!.getFacetedUniqueValues();
  const selectedValues = new Set(column.getFilterValue() as string[]);

  const [appliedDefaults, setAppliedDefaults] = React.useState(false);

  React.useEffect(() => {
    // Reapply defaults whenever defaultSelectedOption changes
    if (
      defaultSelectedOption &&
      defaultSelectedOption.length > 0 &&
      (!applyFilterOnlyOnce || !appliedDefaults)
    ) {
      const updatedValues = new Set(selectedValues);

      defaultSelectedOption.forEach((option) => {
        if (!updatedValues.has(option.value)) {
          updatedValues.add(option.value);
        }
      });

      column.setFilterValue(
        updatedValues.size > 0 ? Array.from(updatedValues) : undefined
      );

      if (applyFilterOnlyOnce) {
        setAppliedDefaults(true);
      }
    }
  }, [
    defaultSelectedOption,
    applyFilterOnlyOnce,
    appliedDefaults,
    selectedValues,
    column,
  ]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed rounded">
          <PlusCircle />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-1 h-4" />
              <Badge
                variant="outline"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden lg:flex gap-1">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="outline"
                    className="rounded-sm font-medium text-primary"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="outline"
                        key={option.value}
                        className={option.className}
                      >
                        {option.icon && (
                          <option.icon className={cn("h-4 w-4")} />
                        )}
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      column!.setFilterValue(
                        selectedValues.size > 0
                          ? Array.from(selectedValues)
                          : undefined
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check />
                    </div>
                    <Badge
                      variant="outline"
                      key={option.value}
                      className={option.className}
                    >
                      {option.icon && <option.icon className={cn("h-4 w-4")} />}
                      {option.label}
                    </Badge>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 bg-muted text-foreground w-4 items-center font-medium justify-center text-xs rounded-full">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      column?.setFilterValue(undefined);
                    }}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
