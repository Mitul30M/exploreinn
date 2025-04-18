"use client";

import { Table } from "@tanstack/react-table";
import { UserCog2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "../../ui/data-table/data-table-view-options";
// import { priorities, statuses } from "../data/data";
import { DataTableFacetedFilter } from "../../ui/data-table/data-table-faceted-filter";
import React from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function AdminDashboardUsersTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
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
          placeholder="Filter Users..."
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
        {table.getColumn("role") && (
          <DataTableFacetedFilter
            table={table}
            column={table.getColumn("role")!}
            title="Role"
            options={[
              {
                className:
                  "border-none rounded-md flex items-center justify-center gap-2 p-1 px-3 w-max bg-primary text-white",
                icon: UserCog2,
                label: "Admin",
                value: "Admin",
              },
              {
                className:
                  "border-border/90 border-2 rounded-md flex items-center justify-center gap-2 p-1 px-3 w-max",
                icon: UserCog2,
                label: "User",
                value: "User",
              },
            ]}
            applyFilterOnlyOnce={true}
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
      </div>
      <DataTableViewOptions table={table} className="ml-2 rounded" />
    </div>
  );
}
