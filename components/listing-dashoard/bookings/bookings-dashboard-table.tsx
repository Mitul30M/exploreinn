"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  VisibilityState,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CircleArrowLeft,
  CircleArrowRight,
  ChevronLeft,
  ChevronRight,
  Hotel,
  Columns3,
} from "lucide-react";
import { BookingsDataTableToolbar } from "@/components/user-page/bookings/bookings-data-table-toolbar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import Link from "next/link";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /**
   * The floating bar to render at the bottom of the table on row selection.
   * @default null
   * @type React.ReactNode | null
   * @example floatingBar={<TasksTableFloatingBar table={table} />}
   */
  floatingActionBar?: React.ReactNode | null;
  className?: string;
}

export function ListingBookingsDataTable<TData, TValue>({
  columns,
  data,
  className,
  floatingActionBar,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className={"relative z-0 !mx-4 w-full" + className}>
      {/* check if the table has a column named bookingStatus & paymentStatus. if yes thn its the bookings table from /users/[userId]/bookings else it a normal data table without any Facets Filters */}
      {table.getColumn("bookingStatus") && table.getColumn("paymentStatus") && (
        <div className="flex items-center pb-4">
          <BookingsDataTableToolbar table={table} />
        </div>
      )}

      <ScrollArea className="w-full rounded-md border-[1px] border-border/90 ">
        <Table className="rounded-md">
          <TableHeader className="bg-accent/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-nowrap text-accent-foreground text-center first:text-left last:text-right first:ps-4 last:pe-4 pr-6"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-nowrap font-medium py-[1px] text-center first:text-left last:text-right first:ps-4 last:pe-4 pr-6"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-nowrap font-semibold text-foreground/80 flex gap-1 justify-center items-center pt-5"
                ></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <DataTablePagination table={table} />
      {/* for user hotel bookings data table */}
      {table.getFilteredSelectedRowModel().rows.length > 0 && floatingActionBar}

      {/* for hotel management dashboard bookings data table  make it similar like above but instead of hotelName use guestName*/}
    </div>
  );
}
