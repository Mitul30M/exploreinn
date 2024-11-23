"use client";

import { Bookings } from "@/lib/utils/seed/bookings";
import { ColumnDef } from "@tanstack/react-table";
import { Clipboard, Hotel, Inbox, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const bookingTableColumns: ColumnDef<Bookings>[] = [
  {
    accessorKey: "bookingId",
    header: "Booking ID",
  },
  {
    accessorKey: "bookingDate",
    header: "Booking Date",
  },
  {
    accessorKey: "checkInDate",
    header: "Check-In Date",
  },
  {
    accessorKey: "checkOutDate",
    header: "Check-Out Date",
  },
  {
    accessorKey: "nights",
    header: "Nights",
  },
  {
    accessorKey: "guests",
    header: "Guests",
  },
  {
    accessorKey: "hotelName",
    header: "Hotel Name",
  },
  {
    accessorKey: "roomId",
    header: "Room ID",
  },
  {
    accessorKey: "roomName",
    header: "Room Name",
  },
  {
    accessorKey: "roomsBooked",
    header: "Rooms",
  },
  {
    accessorKey: "bookingAmount",
    header: "Booking Fee",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("bookingAmount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return formatted;
    },
  },
  {
    accessorKey: "transactionId",
    header: "Transaction ID",
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
  },
  {
    accessorKey: "bookingStatus",
    header: "Booking Status",
  },
  {
    accessorKey: "Actions",
    cell: ({ row }) => {
      const booking = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-6 w-6">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="font-medium ">
              {booking.hotelName}, {booking.hotelCity}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => navigator.clipboard.writeText(booking.bookingId)}
            >
              <Clipboard />
              Copy BookingID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => navigator.clipboard.writeText(booking.hotelId)}
            >
              <Hotel />
              Visit Hotel's Page
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => navigator.clipboard.writeText(booking.hotelId)}
            >
              <Clipboard />
              Copy HotelID
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
