"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "../../ui/data-table/data-table-view-options";
import { DataTableFacetedFilter } from "../../ui/data-table/data-table-faceted-filter";
import React from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { offerStatusArray } from "@/lib/utils/types/offer/offer-types";
import { NewAppWideOfferDialog } from "./new-app-wide-offer-dialog";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function AdminOffersTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  // const defaultSelectedOption = useSearchParams().get("offerType");
  // const defaultOfferType = offerStatusArray.find(
  //   (type) => type.value === defaultSelectedOption?.toLowerCase()
  // );

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);
  const isFiltered = table.getState().columnFilters.length > 0;
  const [searchQuery, setSearchQuery] = React.useState("");
  console.log(searchQuery);
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter Offers..."
          defaultValue={searchParams.get("query")?.toString()}
          onChange={useDebouncedCallback((event) => {
            const newFilterValue = event.target.value;
            if (newFilterValue === "") {
              params.delete("query");
            } else {
              params.set("query", newFilterValue);
            }
            replace(`${pathname}?${params.toString()}`);
            setSearchQuery(newFilterValue);
            table.setGlobalFilter(newFilterValue);
          }, 500)}
          className="h-8 w-[150px] lg:w-[250px] rounded-lg shadow-sm"
        />
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            table={table}
            column={table.getColumn("type")!}
            title="Offer Types"
            options={offerStatusArray}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery("");
              params.delete("bookingStatus");
              replace(`${pathname}?${params.toString()}`);
              table.resetColumnFilters();
            }}
            className="h-8 px-2 lg:px-3 rounded"
          >
            Reset
            <X />
          </Button>
        )}
        <DataTableViewOptions table={table} className="ml-2 rounded" />
        {/* new offer dialog trigger */}
        <NewAppWideOfferDialog />
      </div>
    </div>
  );
}
