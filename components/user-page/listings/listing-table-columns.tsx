"use client";
import { format } from "date-fns";
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
  Star,
  Sparkles,
  DoorClosed,
  TrendingUp,
  TrendingDown,
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
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { cn } from "@/lib/utils";
import { TOwnedListing } from "@/lib/actions/listings/listings";
import Link from "next/link";
import { getRevenueFromTransaction } from "@/lib/actions/transactions/transactions";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const listingTableColumns: ColumnDef<TOwnedListing>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Listing"
        icon={Hotel}
        className="flex items-center gap-2 ms-4"
      />
    ),
    // the cell data format should be listing Name, listing City
    cell: ({ row }) => {
      const hotelName = row.original.name;
      const hotelCoverImg = row.original.coverImage;
      const hotelCity = row.original.address.city; // Access the hotelCity field from the original row data
      return (
        <div className="flex ms-2 items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-lg border-2">
            <AvatarImage src={hotelCoverImg} alt={hotelName} />
            <AvatarFallback className="rounded-lg">
              {hotelName.charAt(0).toUpperCase() +
                hotelName.charAt(1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className=" font-medium">
              <Link
                className="hover:underline hover:text-primary hover:underline-offset-2"
                href={`/listings/${row.original.id}/overview`}
              >
                {hotelName}
              </Link>
            </span>
            <span className="text-xs text-muted-foreground">{hotelCity}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="ListingID"
        icon={ClipboardList}
        className="flex items-center gap-2 ms-4"
      />
    ),
  },
  {
    accessorKey: "starRating",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Star Rating (out of 5)"
        icon={Star}
        className="flex items-center gap-2 ms-4"
      />
    ),
  },

  {
    accessorKey: "overallRating",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Overall Rating (out of 10)"
        icon={Sparkles}
        className="flex items-center gap-2 ms-4"
      />
    ),
  },

  {
    accessorKey: "exploreinnGrade",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="exploreinn Grade"
        icon={Sparkles}
        className="flex items-center gap-2 ms-4"
      />
    ),
    cell: ({ row }) => {
      const exploreinnGrade = row.original.exploreinnGrade;
      return (
        <div className="w-full flex items-center justify-center">
          <Badge
            variant="outline"
            className="bg-zinc-100/50 border-none text-zinc-950 dark:bg-zinc-900/50 dark:text-zinc-100   rounded-md flex items-center justify-center gap-2 p-1 px-3 w-max"
          >
            {exploreinnGrade}
          </Badge>
        </div>
      );
    },
  },

  {
    accessorKey: "occupiedRooms",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Occupied Rooms"
        icon={DoorClosed}
        className="flex items-center gap-2 ms-4"
      />
    ),
    cell: ({ row }) => {
      const totalRooms = row.original.rooms.reduce(
        (acc, room) => acc + room.totalRoomsAllocated,
        0
      );
      const totalAvailableRooms = row.original.rooms.reduce(
        (acc, room) => acc + room.currentlyAvailableRooms,
        0
      );
      const occupiedRooms = totalRooms - totalAvailableRooms;
      return <p className="">{occupiedRooms}</p>;
    },
  },

  {
    accessorKey: "availableRooms",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Available Rooms"
        icon={DoorOpen}
        className="flex items-center gap-2 ms-4"
      />
    ),
    cell: ({ row }) => {
      const totalAvailableRooms = row.original.rooms.reduce(
        (acc, room) => acc + room.currentlyAvailableRooms,
        0
      );
      return <p className="">{totalAvailableRooms}</p>;
    },
  },

  {
    accessorKey: "onGoingBookings",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="OnGoing Bookings"
        icon={BedDouble}
        className="flex items-center gap-2 ms-4"
      />
    ),
    cell: ({ row }) => {
      //   fetch all ongoing bookings and then sum them up

      // seed data for now
      return (
        <div className="w-full flex items-center justify-center">
          <Badge
            variant="outline"
            className="border-none rounded-md flex items-center justify-center gap-2 p-1 px-3 w-max bg-emerald-100/50 text-emerald-950 dark:bg-emerald-950/50 dark:text-emerald-100 "
          >
            {
              row.original.Booking.filter(
                (booking) => booking.bookingStatus === "ongoing"
              ).length
            }{" "}
            <BedDouble size={16} />{" "}
          </Badge>
        </div>
      );
    },
  },

  {
    accessorKey: "upcomingBookings",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Upcoming Bookings"
        icon={CalendarClock}
        className="flex items-center gap-2 ms-4"
      />
    ),
    cell: ({ row }) => {
      //   fetch all upcomingBookings and then sum them up

      // seed data for now
      return (
        <div className="w-full flex items-center justify-center">
          <Badge
            variant="outline"
            className="border-none rounded-md flex items-center justify-center gap-2 p-1 px-3 w-max bg-amber-100/50 text-amber-950 dark:bg-amber-900/50 dark:text-amber-100 "
          >
            {
              row.original.Booking.filter(
                (booking) => booking.bookingStatus === "upcoming"
              ).length
            }
            <CalendarClock size={16} />
          </Badge>
        </div>
      );
    },
  },

  {
    accessorKey: "revenueToday",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Today's Revenue"
        icon={HandCoins}
        className="flex items-center gap-2 ms-4"
      />
    ),
    cell: ({ row }) => {
      // fetch all today's transaction with payment status completed and then sum up the amount;
      // show in $ only, later inside dashboard can the user see the amount in his preferred currency
      // Reduce the totalCost by deducting a 5% from each totalCost with payment method ONLINE_PAYMENT.
      const formattedToday = row.original.Transaction.filter(
        (transaction) =>
          new Date(transaction.createdAt).toDateString() ===
          new Date().toDateString()
      ).reduce(
        (total, transaction) => total + getRevenueFromTransaction(transaction),
        0
      );

      const formattedYesterday = row.original.Transaction.filter(
        (transaction) =>
          new Date(transaction.createdAt).toDateString() ===
          new Date(Date.now() - 86400000).toDateString()
      ).reduce(
        (total, transaction) => total + getRevenueFromTransaction(transaction),
        0
      );

      return (
        <p className=" flex gap-2 items-center justify-center">
          {formattedToday > formattedYesterday ? (
            <TrendingUp size={16} className="text-green-500" />
          ) : (
            <TrendingDown size={16} className="text-red-500" />
          )}{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(formattedToday)}
        </p>
      );
    },
  },
  {
    accessorKey: "revenueOverall",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Lifetime Revenue"
        icon={HandCoins}
        className="flex items-center gap-2 ms-4"
      />
    ),
    cell: ({ row }) => {
      // fetch all today's bookings with payment status completed and then sum up the amount;
      // show in $ only, later inside dashboard can the user see the amount in his preferred currency
      // Reduce the totalCost by deducting a 5% from each totalCost.
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(
        row.original.Transaction.reduce(
          (total, transaction) =>
            total + getRevenueFromTransaction(transaction),
          0
        )
      );

      return <p className="">{formatted}</p>;
    },
  },
  {
    id: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const listing = row.original;
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
              {listing.name}, {listing.address.city}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => navigator.clipboard.writeText(listing.id)}
            >
              <Clipboard />
              Copy ListingID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2"
              //   `/listings/${listing.id}`
            >
              <Hotel />
              <Link href={`/listings/${listing.id}`}>Visit Listing's Page</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
