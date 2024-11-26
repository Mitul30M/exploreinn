"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "../../ui/data-table/data-table-view-options";
// import { priorities, statuses } from "../data/data";
import { bookingStatusArray } from "@/lib/utils/types/status/booking-status";
import { paymentStatusArray } from "@/lib/utils/types/status/payement-status";
import { DataTableFacetedFilter } from "../../ui/data-table/data-table-faceted-filter";
import React from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function BookingsDataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter Bookings..."
          value={searchQuery}
          onChange={(event) => {
            const newFilterValue = event.target.value;
            setSearchQuery(newFilterValue);
            table.setGlobalFilter(newFilterValue);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("bookingStatus") && (
          <DataTableFacetedFilter
            table={table}
            column={table.getColumn("bookingStatus")!}
            title="Booking Status"
            options={bookingStatusArray}
          />
        )}
        {table.getColumn("paymentStatus") && (
          <DataTableFacetedFilter
            table={table}
            column={table.getColumn("paymentStatus")!}
            title="Payment Status"
            options={paymentStatusArray}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} className="ml-2" />
    </div>
  );
}
