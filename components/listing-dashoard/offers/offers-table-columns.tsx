"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Switch } from "@/components/ui/switch";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import { deleteOffer, toggleIsActive } from "@/lib/actions/offers/offers";
import {
  offerStatus,
  OfferStatusConfig,
} from "@/lib/utils/types/offer/offer-types";
import { Offer } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  BadgeDollarSign,
  BadgePercent,
  CalendarDays,
  CalendarRange,
  Clipboard,
  MoreHorizontal,
  Save,
  Tag,
  TicketCheck,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { startTransition } from "react";

export const dashboardOffersTableColumns: ColumnDef<Offer>[] = [
  // select column
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // Offer Name
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Offer Name" icon={Tag} />
    ),
    cell: ({ row }) => {
      return row.original.name;
    },
  },
  // Offer Description
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Offer Description" />
    ),
    cell: ({ row }) => {
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <p className="w-[150px] truncate">{row.original.description}</p>
          </HoverCardTrigger>
          <HoverCardContent className="w-60 p-4">
            <div className="w-full text-wrap">{row.original.description}</div>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  //   Coupon Code
  {
    accessorKey: "couponCode",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Coupon Code"
        icon={Clipboard}
      />
    ),
    cell: ({ row }) => {
      return (
        <Badge
          className="border-none rounded-md flex items-center justify-center gap-2 p-1 px-3 w-max"
          variant={"default"}
        >
          {row.original.couponCode.toUpperCase()}
        </Badge>
      );
    },
  },
  //   isActive
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Is Active"
        icon={ToggleRight}
      />
    ),
    cell: ({ row }) => {
      return (
        <Switch
          id={row.original.id}
          checked={row.original.isActive}
          onCheckedChange={(checked) => {
            startTransition(async () => {
              await toggleIsActive(row.original.id, checked);
            });
          }}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  //   Valid to-from
  {
    accessorKey: "validity",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Validity"
        icon={CalendarRange}
      />
    ),
    cell: ({ row }) => {
      return (
        <p>
          {format(row.original.startDate, "dd MMM yyy")} -{" "}
          {format(row.original.endDate, "dd MMM yyy")}
        </p>
      );
    },
  },
  // Offer Type
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Offer Type"
        className="flex items-center gap-2 ms-4"
      />
    ),
    cell: ({ row }) => {
      const type: OfferStatusConfig =
        offerStatus[row.original.type as keyof typeof offerStatus];
      if (type) {
        return (
          <div className="w-full flex items-center justify-center">
            <Badge variant="outline" className={type.className}>
              {type.icon && <type.icon size={16} />} {type.label}
            </Badge>
          </div>
        );
      }
    },
    filterFn: (row, columnId, filterValue) => {
      // If no filter value is set, show all rows
      if (!filterValue || filterValue.length === 0) return true;

      // Check if the row's offerType matches any of the selected filters
      return filterValue.includes(row.getValue(columnId));
    },
  },
  // discount amount
  {
    accessorKey: "flatDiscount",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Discount Amount ($)"
        icon={BadgeDollarSign}
      />
    ),
    cell: ({ row }) => {
      return row.original.flatDiscount
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(row.original.flatDiscount)
        : "-";
    },
  },
  // discount percentage
  {
    accessorKey: "percentageDiscount",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Discount %"
        icon={BadgePercent}
      />
    ),
    cell: ({ row }) => {
      return row.original.percentageDiscount
        ? row.original.percentageDiscount + "%"
        : "-";
    },
  },
  // minimum booking fee
  {
    accessorKey: "minimumBookingAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Min. Booking Fee ($)" />
    ),
    cell: ({ row }) => {
      return (
        <p className="text-primary">
          {row.original.minimumBookingAmount
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(row.original.minimumBookingAmount)
            : "-"}
        </p>
      );
    },
  },
  // maximum discount amount
  {
    accessorKey: "maxDiscountAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Max. Discount ($)" />
    ),
    cell: ({ row }) => {
      return (
        <p className="text-primary">
          {row.original.maxDiscountAmount
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(row.original.maxDiscountAmount)
            : "-"}
        </p>
      );
    },
  },
  // total no of bookings made using this offer
  {
    accessorKey: "totalBookings",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Total Bookings"
        icon={TicketCheck}
      />
    ),
    cell: ({ row }) => {
      return <p className="text-primary">{row.original.bookingIds.length}</p>;
    },
  },
  // created at
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Created At"
        icon={CalendarDays}
      />
    ),
    cell: ({ row }) => {
      return <p>{format(row.original.createdAt, "dd MMM yyy")}</p>;
    },
  },
  // actions
  {
    id: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const offer = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size="icon" className="h-6 w-6">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-56">
            <DropdownMenuLabel className="font-medium ">
              {offer.name}: {offer.couponCode.toUpperCase()}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => navigator.clipboard.writeText(offer.id)}
            >
              <Clipboard />
              Copy BookingID
            </DropdownMenuItem>
            {!offer.bookingIds.length && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onClick={async () => {
                    startTransition(async () => {
                      const isOfferDeleted = await deleteOffer(offer.id);
                      if (isOfferDeleted) {
                        toast({
                          title: `*Offer Created Successfully!`,
                          description: `${offer.name} offer deleted successfully!`,
                          action: (
                            <ToastAction
                              className="text-primary text-nowrap flex items-center gap-1 justify-center"
                              altText="success"
                            >
                              <Save className="size-4 text-primary" /> Ok
                            </ToastAction>
                          ),
                        });
                      } else {
                        toast({
                          title: `*Error while deleting offer!`,
                          description:
                            "Something went wrong! Please Try Again.",
                          action: (
                            <ToastAction
                              className="text-primary text-nowrap flex items-center gap-1 justify-center"
                              altText="error"
                            >
                              <Save className="size-4 text-primary" /> Try Again
                            </ToastAction>
                          ),
                        });
                      }
                    });
                  }}
                >
                  <Trash2 />
                  Delete Offer
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
