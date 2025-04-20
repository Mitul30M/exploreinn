"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hotel } from "lucide-react";
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
import { BookingStatusConfig } from "@/lib/utils/types/status/booking-status";
import { bookingStatus } from "@/lib/utils/types/status/booking-status";
import { paymentStatus } from "@/lib/utils/types/status/payement-status";
import { PaymentStatusConfig } from "@/lib/utils/types/status/payement-status";
import { ColumnDef } from "@tanstack/react-table";
import { differenceInDays, format } from "date-fns";
import {
  CalendarCheck,
  Calendar1,
  ClipboardList,
  SquareUserRound,
  CalendarMinus2,
  CalendarRange,
  Users,
  DoorOpen,
  Tag,
  Hourglass,
  MoreHorizontal,
  Clipboard,
  Wallet,
} from "lucide-react";
import { getAllBookings } from "@/lib/actions/bookings/bookings";

export type TAdminBookingsColumns = NonNullable<
  Awaited<ReturnType<typeof getAllBookings>>
>[number];

export const adminDashboardBookingsColumns: ColumnDef<TAdminBookingsColumns>[] =
  [
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
    // guest info
    {
      accessorKey: "guest",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Booking By"
          icon={SquareUserRound}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) =>
        row.original.guest.firstName + " " + row.original.guest.lastName,
    },
    {
      accessorKey: "guestID",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Guest ID"
          icon={SquareUserRound}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => row.original.guest.id,
    },

    // listing name
    {
      accessorKey: "listingName",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Listing Name"
          icon={Hotel}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => row.original.listing.name,
    },
    // listing id
    {
      accessorKey: "listingID",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Listing ID"
          icon={Hotel}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => row.original.listing.id,
    },

    // booking id
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="BookingID"
          icon={ClipboardList}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => {
        const bookingId = row.original.id;
        return bookingId;
      },
    },
    //   booking date
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Booking Date"
          icon={Calendar1}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        const formatted = format(date, "dd MMM yyyy");
        return formatted;
      },
    }, // check in date
    {
      accessorKey: "checkInDate",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="CheckIn Date"
          icon={CalendarCheck}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.checkInDate);
        const formatted = format(date, "dd MMM yyyy");
        return formatted;
      },
    },
    // check out date
    {
      accessorKey: "checkOutDate",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="CheckOut Date"
          icon={CalendarMinus2}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.checkOutDate);
        const formatted = format(date, "dd MMM yyyy");
        return formatted;
      },
    },
    // nights
    {
      accessorKey: "nights",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Nights Stay"
          icon={CalendarRange}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => {
        const checkInDate = row.original.checkInDate;
        const checkOutDate = row.original.checkOutDate;
        const nights = differenceInDays(
          new Date(checkOutDate),
          new Date(checkInDate)
        );
        return nights;
      },
    },
    // guests
    {
      accessorKey: "guests",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Guests"
          icon={Users}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => {
        const guests = row.getValue("guests");
        return guests;
      },
    },
    // rooms
    {
      accessorKey: "rooms",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Rooms"
          icon={DoorOpen}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => {
        const rooms = row.original.rooms;
        return (
          <div className="w-full flex items-center justify-center">
            <Badge
              variant="outline"
              className={
                "border-none rounded-md flex items-center justify-center gap-2 p-1 px-3 w-max"
              }
            >
              {rooms[0].noOfRooms}x {rooms[0].name}
              {rooms.length > 1 && `, +${rooms.length - 1}`}
            </Badge>
          </div>
        );
      },
    },

    // offer applied
    {
      accessorKey: "offerApplied",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Offer Applied"
          icon={Tag}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => {
        const offerApplied = row.original.offer
          ? "(Yes)" + " " + row.original.offer.id
          : "N/A";
        return offerApplied;
      },
    },

    // booking amount
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Booking Amount"
          icon={Tag}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => {
        const amount = row.original.totalCost;
        const formatted = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(amount);

        return <p className="">{formatted}</p>;
      },
    },
    // transaction id
    {
      accessorKey: "transactionId",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="TransactionID"
          icon={ClipboardList}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => {
        const transactionId = row.original.transactionId;
        return transactionId ? (
          transactionId
        ) : (
          <p className="text-primary">N/A</p>
        );
      },
    },
    // payment status
    {
      accessorKey: "paymentStatus",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Payment Status"
          icon={Hourglass}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => {
        const status: PaymentStatusConfig =
          paymentStatus[
            row.getValue("paymentStatus") as keyof typeof paymentStatus
          ];
        if (status) {
          return (
            <div className="w-full flex items-center justify-center">
              <Badge variant="outline" className={status.className}>
                {status.icon && <status.icon size={16} />} {status.label}
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
    // booking status
    {
      accessorKey: "bookingStatus",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Booking Status"
          icon={Hourglass}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => {
        const status: BookingStatusConfig =
          bookingStatus[
            row.getValue("bookingStatus") as keyof typeof bookingStatus
          ];
        if (status) {
          return (
            <div className="w-full flex items-center justify-center">
              <Badge variant="outline" className={status.className}>
                {status.icon && <status.icon size={16} />} {status.label}
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
    // actions
    {
      id: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56">
              <DropdownMenuLabel className="font-medium ">
                {booking.guest.firstName} {booking.guest.lastName},{" "}
                {booking.guest.phoneNo}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => navigator.clipboard.writeText(booking.id)}
              >
                <Clipboard />
                Copy BookingID
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {booking.transactionId && (
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onClick={() =>
                    navigator.clipboard.writeText(booking.transactionId!)
                  }
                >
                  <Wallet />
                  Copy TransactionID
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
