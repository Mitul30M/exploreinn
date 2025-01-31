"use client";
import * as React from "react";
import { SelectTrigger } from "@radix-ui/react-select";
import { type Table } from "@tanstack/react-table";
import {
  ArrowUp,
  CheckCircle2,
  ConciergeBell,
  Download,
  Loader,
  Trash2,
  X,
} from "lucide-react";
import { Toast, ToastAction } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Portal } from "@/components/ui/portal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";
import { exportTableToCSV } from "@/lib/utils/export/export";
import { useToast } from "@/hooks/use-toast";
import { bookingStatus } from "@/lib/utils/types/status/booking-status";
import { BookingStatusConfig } from "@/lib/utils/types/status/booking-status";
import { Badge } from "@/components/ui/badge";
import { TDashboardBookingsColumns } from "./bookings-dashboard-table-colums";
import { updateListingBookingStatus } from "@/lib/actions/bookings/bookings";
import { BookingStatus } from "@prisma/client";

interface TableFloatingBarProps<TData> {
  table: Table<TData>;
}

export function ListingDashboardFloatingActionBar<TData>({
  table,
}: TableFloatingBarProps<TData>) {
  const rows = table.getFilteredSelectedRowModel().rows;

  const [isPending, startTransition] = React.useTransition();
  const [action, setAction] = React.useState<
    "update-booking-status" | "update-transaction-status" | "export" | "cancel"
  >();

  // in future if you need add more actions, you can use this
  //   const [action, setAction] = React.useState<
  //     "update-status" | "update-priority" | "export" | "delete"
  //   >();
  const { toast } = useToast();

  // Clear selection on Escape key press
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        table.toggleAllRowsSelected(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [table]);

  return (
    <Portal>
      <div className="fixed inset-x-0 bottom-6 z-50 mx-auto w-fit px-2.5">
        <div className="w-full overflow-x-auto">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-md border bg-background p-2 text-foreground shadow">
            <div className="flex h-7 items-center rounded-md border border-dashed pl-2.5 pr-1">
              <span className="whitespace-nowrap text-xs">
                {rows.length > 1
                  ? `${rows.length} selected`
                  : `Booking ${(rows[0].original as TDashboardBookingsColumns).id}`}
              </span>
              <Separator orientation="vertical" className="ml-2 mr-1" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-5 hover:border"
                    onClick={() => table.toggleAllRowsSelected(false)}
                  >
                    <X className="size-3.5 shrink-0" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="flex items-center border bg-accent px-2 py-1 font-semibold text-foreground dark:bg-zinc-900">
                  <p className="mr-2">Clear selection</p>
                  <Kbd abbrTitle="Escape" variant="outline">
                    Esc
                  </Kbd>
                </TooltipContent>
              </Tooltip>
            </div>
            <Separator orientation="vertical" className="hidden h-5 sm:block" />
            <div className="flex items-center gap-1.5">
              {/* to update booking status */}
              <Select
                onValueChange={(value) => {
                  startTransition(async () => {
                    if (
                      Object.values(BookingStatus).includes(
                        value as BookingStatus
                      )
                    ) {
                      const error = await updateListingBookingStatus(
                        (rows[0].original as TDashboardBookingsColumns).id,
                        value as BookingStatus
                      );

                      if (error) {
                        toast({
                          title: "Error",
                          description: error.message,
                          variant: "destructive",
                        });
                        return;
                      }

                      toast({
                        title: "Booking Status Updated",
                        description: `Updated Booking Status from ${(rows[0].original as TDashboardBookingsColumns).bookingStatus?.charAt(0).toUpperCase() + (rows[0].original as TDashboardBookingsColumns).bookingStatus?.slice(1)} to: ${value.charAt(0).toUpperCase() + value.slice(1)}`,
                      });
                    }
                  });
                }}
                // defaultValue={
                //   (rows[0].original as TDashboardBookingsColumns).bookingStatus
                // }
                disabled={rows.length !== 1}
              >
                <Tooltip>
                  <SelectTrigger asChild>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="size-7 border data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                        disabled={isPending || rows.length !== 1}
                      >
                        {isPending && action === "update-booking-status" ? (
                          <Loader
                            className="size-3.5 animate-spin text-primary"
                            aria-hidden="true"
                          />
                        ) : (
                          <ConciergeBell
                            className="size-3.5 text-primary"
                            aria-hidden="true"
                          />
                        )}
                      </Button>
                    </TooltipTrigger>
                  </SelectTrigger>
                  <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                    <p>Update Booking Status</p>
                  </TooltipContent>
                </Tooltip>
                <SelectContent align="center">
                  <SelectGroup>
                    {["ongoing", "completed"].map((_status) => {
                      if (
                        _status ===
                        (rows[0].original as TDashboardBookingsColumns)
                          .bookingStatus
                      )
                        return null;

                      const status: BookingStatusConfig =
                        bookingStatus[_status as keyof typeof bookingStatus];
                      return (
                        <SelectItem
                          key={_status}
                          value={_status}
                          className="capitalize"
                        >
                          <div className="w-full flex items-center justify-center">
                            <Badge
                              variant="outline"
                              className={status.className}
                            >
                              {status.icon && <status.icon size={16} />}{" "}
                              {status.label}
                            </Badge>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>{" "}
              {/* to export mulitple rows or single row from a DataTable*/}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="size-7 border"
                    onClick={() => {
                      setAction("export");

                      startTransition(() => {
                        exportTableToCSV(table, {
                          excludeColumns: ["select", "actions"],
                          onlySelected: true,
                        });
                        toast({
                          title: "Export completed",
                          description:
                            "Your data has been exported successfully",
                          action: (
                            <ToastAction
                              altText="Try again"
                              className="flex items-center gap-1 text-primary"
                            >
                              <CheckCircle2 className="size-4" />
                              Done
                            </ToastAction>
                          ),
                        });
                      });
                    }}
                    disabled={isPending}
                  >
                    {isPending && action === "export" ? (
                      <Loader
                        className="size-3.5 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <Download className="size-3.5" aria-hidden="true" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-zinc-900">
                  <p>Export .CSV</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
