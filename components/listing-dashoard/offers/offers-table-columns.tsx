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
import { toggleIsActive } from "@/lib/actions/offers/offers";
import {
  offerStatusArray,
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
  Code2,
  MoreHorizontal,
  Tag,
  TicketCheck,
  ToggleLeft,
  ToggleRight,
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
            <p className="w-[80px] truncate">{row.original.description}</p>
          </HoverCardTrigger>
          <HoverCardContent className="w-60 p-4">
            <div className="flex justify-between border-border/90 border-[1px] items-center">
              {row.original.description}
            </div>
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
  //   Valid ro-from
  {
    accessorKey: "validity",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Valid From"
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
    accessorKey: "offerType",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Offer Type"
        className="flex items-center gap-2 ms-4"
      />
    ),
    cell: ({ row }) => {
      const type: OfferStatusConfig = offerStatusArray.find(
        (item) => item.value === row.original.type
      )!;
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

      // Check if the row's bookingStatus matches any of the selected filters
      return filterValue.includes(row.getValue(columnId));
    },
  },
  // discount amount
  {
    accessorKey: "flatDiscount",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Discount Amount($)"
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
    header: ({ column }: { column: any }) => (
      <DataTableColumnHeader
        column={column}
        title="Discount %"
        icon={BadgePercent}
      />
    ),
    cell: ({ row }: { row: any }) => {
      return row.original.percentageDiscount
        ? row.original.percentageDiscount + "%"
        : "-";
    },
  },
  // minimum booking fee
  {
    accessorKey: "minimumBookingAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Min. Booking Fee($)" />
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
      <DataTableColumnHeader column={column} title="Max. Discount($)" />
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
      return (
        <p className="text-primary">
          {format(row.original.createdAt, "dd MMM yyy")}
        </p>
      );
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
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
