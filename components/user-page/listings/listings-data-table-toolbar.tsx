"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "../../ui/data-table/data-table-view-options";
import React from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  isOwnerTable?: boolean;
}

export function ListingsDataTableToolbar<TData>({
  table,
  isOwnerTable = true,
}: DataTableToolbarProps<TData>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);
  const isFiltered = table.getState().columnFilters.length > 0;
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Find Listings..."
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
      </div>
      <DataTableViewOptions table={table} className="ml-2 rounded" />
      {isOwnerTable && (
        <Link href="/listings/new">
          <Button
            className="ml-2 rounded hover:text-primary font-semibold hover:underline hover:underline-offset-2"
            variant={"ghost"}
            size={"sm"}
          >
            Register Listing
          </Button>
        </Link>
      )}
    </div>
  );
}
