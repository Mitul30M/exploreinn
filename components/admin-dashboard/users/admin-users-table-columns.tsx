"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { getUsers } from "@/lib/actions/user/user";
import { Role } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  BadgeDollarSign,
  Calendar,
  DoorOpen,
  ListCheck,
  Mail,
  Phone,
  SquareUserRound,
  UserMinus2,
} from "lucide-react";

export type TAdminDashboardUsersColumns = NonNullable<
  Awaited<ReturnType<typeof getUsers>>
>[number];

export const adminDashboardUsersColumns: ColumnDef<TAdminDashboardUsersColumns>[] =
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
    // role
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Role"
          icon={ListCheck}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => {
        const role: Role = row.original.role;
        return (
          <div className="w-full flex items-center justify-center">
            <Badge variant={role === "Admin" ? "default" : "outline"}>
              {role}
            </Badge>
          </div>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        // If no filter value is set, show all rows
        if (!filterValue || filterValue.length === 0) return true;

        // Check if the row's bookingStatus matches any of the selected filters
        return filterValue.includes(row.getValue(columnId));
      },
    },
    // user name and avatar
    {
      accessorKey: "user",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Account Name"
          icon={SquareUserRound}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => {
        const name = row.original.firstName + " " + row.original.lastName;
        const profileImg = row.original.profileImg;
        return (
          <div className="flex ms-2 items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg border-2">
              <AvatarImage src={profileImg} alt={name} />
              <AvatarFallback className="rounded-lg">
                {name.split(" ")[0].charAt(0).toUpperCase() +
                  name.split(" ")[1].charAt(0).toUpperCase()}
              </AvatarFallback>{" "}
            </Avatar>
            <span className=" font-medium">{name}</span>
          </div>
        );
      },
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
    // user id
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="User ID"
          icon={SquareUserRound}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => row.original.id,
    },
    // user clerkId
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="User ClerkID"
          icon={SquareUserRound}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => row.original.clerkId,
    },
    // stripe id
    {
      accessorKey: "stripeId",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Stripe ID"
          icon={BadgeDollarSign}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => row.original.stripeId,
    },
    // country
    {
      accessorKey: "country",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Country"
          icon={SquareUserRound}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => (row.original.country ? row.original.country : "N/A"),
    },

    // total bookings
    {
      accessorKey: "totalBookings",
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

    // net spent
    {
      accessorKey: "netSpending",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Net Spending"
          icon={BadgeDollarSign}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => {
        const amount = row.original.Transaction.reduce(
          (acc, transaction) => acc + transaction.totalCost,
          0
        );
        const formatted = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(amount);

        return <p className="">{formatted}</p>;
      },
    },

    // is stripe connect connected account
    {
      accessorKey: "isStripeConnected",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Stripe Connect"
          icon={BadgeDollarSign}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => (row.original.isStripeConnectedAccount ? "Yes" : "No"),
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
