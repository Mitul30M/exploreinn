"use client";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { getAllListings } from "@/lib/actions/listings/listings";
import { getRevenueFromTransaction } from "@/lib/actions/transactions/transactions";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Building2,
  Calendar,
  DoorOpen,
  Hotel,
  List,
  Mail,
  Phone,
  Sparkles,
  Star,
  UserCircle2,
  UserMinus2,
} from "lucide-react";

export type TAdminDashboardListingsColumns = NonNullable<
  Awaited<ReturnType<typeof getAllListings>>
>[number];

export const adminDashboardListingsColumns: ColumnDef<TAdminDashboardListingsColumns>[] =
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
    // listing type

    {
      accessorKey: "listingType",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Type"
          icon={Sparkles}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => {
        const listingType = row.original.type;
        return (
          <div className="w-full flex items-center justify-center">
            <Badge
              variant="outline"
              className="bg-zinc-100/50 border-none text-zinc-950 dark:bg-zinc-900/50 dark:text-zinc-100   rounded-md flex items-center justify-center gap-2 p-1 px-3 w-max"
            >
              {listingType}
            </Badge>
          </div>
        );
      },
    },

    // listing name
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Listing Name"
          icon={Hotel}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => row.original.name,
    },
    // email
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Email"
          icon={Mail}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => row.original.email,
    },
    // phone number
    {
      accessorKey: "phoneNo",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Phone Number"
          icon={Phone}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => row.original.phoneNo,
    },
    //  id
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Listing ID"
          icon={List}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => row.original.id,
    },
    // city
    {
      accessorKey: "cityState",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="City, Province"
          icon={Building2}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) =>
        row.original.address.city + ", " + row.original.address.state,
    },
    // country
    {
      accessorKey: "country",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Country"
          icon={Building2}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => row.original.address.country,
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
      cell: ({ row }) => row.original.starRating,
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
      cell: ({ row }) => row.original.overallRating,
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

    // owner name
    {
      accessorKey: "ownerName",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Owner Name"
          icon={UserCircle2}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) =>
        row.original.owner.firstName + " " + row.original.owner.lastName,
    },

    // owner email
    {
      accessorKey: "ownerEmail",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Owner Email"
          icon={UserCircle2}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => row.original.owner.email,
    },

    // owner id
    {
      accessorKey: "ownerID",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Owner ID"
          icon={UserCircle2}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => row.original.owner.id,
    },

    // owner stripe connect id
    {
      accessorKey: "ownerConnectId",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Owner StripeID"
          icon={UserCircle2}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => row.original.owner.stripeId,
    },

    // lifetime bookings
    {
      accessorKey: "bookings",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Total Bookings"
          icon={DoorOpen}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => row.original.Booking.length,
    },

    // lifetime revenue
    {
      accessorKey: "revenue",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Total Revenue"
          icon={DoorOpen}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => {
        // fetch all today's bookings with payment status completed and then sum up the amount;
        // show in $ only, later inside dashboard can the user see the amount in his preferred currency
        // Reduce the totalCost by deducting a 5% from each totalCost.
        const formatted = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
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

    // is deleted
    {
      accessorKey: "isDeleted",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Is Deleted"
          icon={UserMinus2}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => {
        return (
          <p className={row.original.isDeleted ? "text-primary" : ""}>
            {row.original.isDeleted ? "Yes" : "No"}
          </p>
        );
      },
    },

    // deleted at
    {
      accessorKey: "deletedAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Deleted At"
          icon={Calendar}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => {
        if (row.original.deletedAt) {
          const date = new Date(row.original.deletedAt);
          const formatted = format(date, "dd MMM yyyy");
          return formatted;
        }
        return "N/A";
      },
    },

    // created at
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Created At"
          icon={Calendar}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        const formatted = format(date, "dd MMM yyyy");
        return formatted;
      },
    },
    // updated at
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Last Updated At"
          icon={Calendar}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.updatedAt);
        const formatted = format(date, "dd MMM yyyy");
        return formatted;
      },
    },
  ];
