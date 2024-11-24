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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const bookingTableColumns: ColumnDef<Bookings>[] = [
  {
    accessorKey: "hotelName",
    header: () => (
      <div className="flex items-center gap-2">
        <Hotel size={16} />
        Hotel
      </div>
    ),
    // the cell data format should be Hotel Name, Hotel City
    cell: ({ row }) => {
      const hotelName = row.getValue("hotelName") as string;
      const hotelCoverImg = row.original.hotelCoverImg;
      const hotelCity = row.original.hotelCity; // Access the hotelCity field from the original row data
      return (
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
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
    header: () => (
      <div className="flex items-center gap-2">
        <ClipboardList size={16} />
        Booking ID
      </div>
    ),
  },
  {
    accessorKey: "bookingDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex items-center hover:text-primary rounded"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Calendar1 size={16} />
          Booking Date
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("bookingDate"));
      const formatted = format(date, "dd MMM yyyy");
      return formatted;
    },
  },
  {
    accessorKey: "checkInDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center hover:text-primary rounded"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <CalendarCheck size={16} />
        CheckIn Date
        <ArrowUpDown className="h-4 w-4" />
      </Button>
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
      <Button
        variant="ghost"
        className="flex items-center hover:text-primary rounded"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <CalendarMinus2 size={16} />
        CheckOut Date
        <ArrowUpDown className="h-4 w-4" />
      </Button>
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
      <Button
        variant="ghost"
        className="flex items-center hover:text-primary rounded"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <CalendarRange size={16} />
        Nights
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "guests",
    header: () => (
      <div className="flex items-center gap-2">
        <Users size={16} />
        Guests
      </div>
    ),
  },
  // {
  //   accessorKey: "roomId",
  //   header: "Room ID",
  // },
  {
    accessorKey: "roomName",
    header: () => (
      <div className="flex items-center gap-2">
        <DoorOpen size={16} />
        Room No.
      </div>
    ),
  },
  {
    accessorKey: "roomsBooked",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center hover:text-primary rounded"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <BedDouble size={16} />
        Rooms
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "bookingAmount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center hover:text-primary rounded"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <Tag size={16} />
        Booking Amount
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("bookingAmount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <p className="font-semibold text-primary">{formatted}</p>;
    },
  },
  {
    accessorKey: "transactionId",
    header: () => (
      <div className="flex items-center gap-2">
        <HandCoins size={16} />
        Transaction ID
      </div>
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center hover:text-primary rounded"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <Hourglass size={16} />
        Payment Status
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const paymentStatus = row.getValue("paymentStatus");
      const isPaid = paymentStatus === "completed";
      const isPending = paymentStatus === "pending";
      const isRefunded = paymentStatus === "refunded";
      const isCancelled = paymentStatus === "cancelled";
      if (isPaid) {
        return (
          <div className="w-full flex items-center justify-center">
            <Badge
              variant="outline"
              className="bg-emerald-100/50 border-none text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-100 rounded-md flex items-center justify-center gap-2 p-1 px-3 w-max "
            >
              <ThumbsUp size={16} /> Completed
            </Badge>
          </div>
        );
      }
      if (isPending) {
        return (
          <div className="w-full flex items-center justify-center">
            <Badge
              variant="outline"
              className="bg-amber-100/50 border-none text-amber-950 dark:bg-amber-900/50 dark:text-amber-100 flex items-center rounded-md gap-2 justify-center p-1 px-3 w-max "
            >
              <CalendarClock size={16} /> Pending
            </Badge>
          </div>
        );
      }
      if (isRefunded) {
        return (
          <div className="w-full flex items-center justify-center">
            <Badge
              variant="outline"
              className="bg-zinc-100/50 border-none text-zinc-950 dark:bg-zinc-900/50 dark:text-zinc-100 flex  justify-center gap-2 rounded-md  items-center p-1 px-3 w-max "
            >
              <HandCoins size={16} /> Refunded
            </Badge>
          </div>
        );
      }
      if (isCancelled) {
        return (
          <div className="w-full flex items-center justify-center">
            <Badge
              variant="outline"
              className="bg-red-100/50 border-none text-red-950 dark:bg-red-900/50 dark:text-red-100 flex  justify-center gap-2 rounded-md  items-center p-1 px-3 w-max "
            >
              <CalendarOff size={16} /> Cancelled
            </Badge>
          </div>
        );
      }
    },
  },
  {
    accessorKey: "bookingStatus",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center hover:text-primary rounded"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <Hourglass size={16} />
        Booking Status
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const bookingStatus = row.getValue("bookingStatus");
      const isActive = bookingStatus === "ongoing";
      const isUpcoming = bookingStatus === "upcoming";
      const isCompleted = bookingStatus === "completed";
      const isCancelled = bookingStatus === "cancelled";
      if (isActive) {
        return (
          <div className="w-full flex items-center justify-center">
            <Badge
              variant="outline"
              className="bg-emerald-100/50 border-none text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-100 rounded-md flex items-center justify-center gap-2 p-1 px-3 w-max "
            >
              <BedDouble size={16} /> Ongoing
            </Badge>
          </div>
        );
      }
      if (isUpcoming) {
        return (
          <div className="w-full flex items-center justify-center">
            <Badge
              variant="outline"
              className="bg-amber-100/50 border-none text-amber-950 dark:bg-amber-900/50 dark:text-amber-100 flex items-center rounded-md gap-2 justify-center p-1 px-3 w-max "
            >
              <CalendarClock size={16} /> Upcoming
            </Badge>
          </div>
        );
      }
      if (isCompleted) {
        return (
          <div className="w-full flex items-center justify-center">
            <Badge
              variant="outline"
              className="bg-zinc-100/50 border-none text-zinc-950 dark:bg-zinc-900/50 dark:text-zinc-100 flex  justify-center gap-2 rounded-md  items-center p-1 px-3 w-max "
            >
              <CalendarCheck2 size={16} /> Completed
            </Badge>
          </div>
        );
      }
      if (isCancelled) {
        return (
          <div className="w-full flex items-center justify-center">
            <Badge
              variant="outline"
              className="bg-red-100/50 border-none text-red-950 dark:bg-red-900/50 dark:text-red-100 flex  justify-center gap-2 rounded-md  items-center p-1 px-3 w-max "
            >
              <CalendarOff size={16} /> Cancelled
            </Badge>
          </div>
        );
      }
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
            <Button variant="outline" size="icon" className="h-6 w-6">
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
