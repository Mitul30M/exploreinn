"use client";
import { format } from "date-fns";
import { Bookings } from "@/lib/utils/seed/bookings";
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
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const bookingTableColumns: ColumnDef<Bookings>[] = [
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
    accessorKey: "hotelName",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Hotel"
        icon={Hotel}
        className="flex items-center gap-2 ms-4"
      />
    ),
    // the cell data format should be Hotel Name, Hotel City
    cell: ({ row }) => {
      const hotelName = row.getValue("hotelName") as string;
      const hotelCoverImg = row.original.hotelCoverImg;
      const hotelCity = row.original.hotelCity; // Access the hotelCity field from the original row data
      return (
        <div className="flex ms-2 items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-lg">
            {/* <AvatarImage src={hotelCoverImg} alt={hotelName} /> */}
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
      const date = new Date(row.getValue("bookingDate"));
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
      const date = new Date(row.getValue("checkInDate"));
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
      const date = new Date(row.getValue("checkOutDate"));
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
  },
  // {
  //   accessorKey: "roomId",
  //   header: "Room ID",
  // },
  {
    accessorKey: "roomName",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Room"
        icon={DoorOpen}
        className="flex items-center gap-2 ms-4"
      />
    ),
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
      const amount = parseFloat(row.getValue("bookingAmount"));
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
        title="BookingID"
        icon={ClipboardList}
        className="flex items-center gap-2 ms-4"
      />
    ),
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
