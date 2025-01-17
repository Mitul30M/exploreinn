"use client";
import { differenceInDays, format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import {
  BedDouble,
  Calendar1,
  CalendarCheck,
  CalendarCheck2,
  CalendarClock,
  CalendarMinus2,
  CalendarOff,
  CalendarRange,
  Clipboard,
  ClipboardList,
  DoorOpen,
  HandCoins,
  Hotel,
  Hourglass,
  Inbox,
  MoreHorizontal,
  Tag,
  ThumbsUp,
  Users,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  paymentStatus,
  PaymentStatus,
  PaymentStatusConfig,
} from "@/lib/utils/types/status/payement-status";
import {
  bookingStatus,
  BookingStatusConfig,
} from "@/lib/utils/types/status/booking-status";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { cn } from "@/lib/utils";
import { BookedRooms, Booking } from "@prisma/client";
import { prisma } from "@/lib/prisma-client";
import { UserBookings } from "@/app/users/[userId]/bookings/page";
import Link from "next/link";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const bookingTableColumns: ColumnDef<UserBookings>[] = [
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
    // the cell data format should be Hotel Name, Hotel City
    cell: ({ row }) => {
      const hotelName = row.original.listing.name;
      const hotelCoverImg = row.original.listing.coverImage;
      const hotelCity = row.original.listing.address.city as string; // Access the hotelCity field from the original row data
      return (
        <div className="flex ms-2 items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-lg border-2">
            <AvatarImage src={hotelCoverImg} alt={hotelName} />
            <AvatarFallback className="rounded-lg">
              {hotelCity.charAt(0).toUpperCase() +
                hotelCity.charAt(1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className=" font-medium">{hotelName}</span>
            <span className="text-xs text-muted-foreground">{hotelCity}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "bookingId",
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
  {
    accessorKey: "bookingDate",
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
    enableHiding: false,
  },
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
  // {
  //   accessorKey: "roomId",
  //   header: "Room ID",
  // },
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
  {
    accessorKey: "roomsBooked",

    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Rooms Booked"
        icon={BedDouble}
        className="flex items-center gap-2 ms-4"
      />
    ),
    cell: ({ row }) => {
      const rooms = row.original.rooms;
      return rooms.reduce((total, room) => total + room.noOfRooms, 0);
    },
  },
  {
    accessorKey: "bookingAmount",
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
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <p className="">{formatted}</p>;
    },
  },
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
              {booking.listing?.name}, {booking.listing.address.city}
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
            <Link href={`/listings/${booking.listingId}`}>
              <DropdownMenuItem className="flex items-center gap-2">
                <Hotel />
                Visit Listing's Page
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => navigator.clipboard.writeText(booking.listingId)}
            >
              <Clipboard />
              Copy ListingID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2">
              <Inbox />
              Mail Invoice
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
