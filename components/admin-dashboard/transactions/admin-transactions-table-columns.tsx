"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Hotel } from "lucide-react";
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
import { paymentStatus } from "@/lib/utils/types/status/payement-status";
import { PaymentStatusConfig } from "@/lib/utils/types/status/payement-status";
import { ColumnDef } from "@tanstack/react-table";
import {
  Calendar1,
  ClipboardList,
  SquareUserRound,
  Tag,
  Hourglass,
  MoreHorizontal,
  Clipboard,
} from "lucide-react";
import {
  getAllTransactions,
  getAppRevenueFromTransaction,
} from "@/lib/actions/transactions/transactions";
import { Transaction } from "@prisma/client";
import Link from "next/link";
import { format } from "date-fns";

export type TAdminTransactionsColumns = NonNullable<
  Awaited<ReturnType<typeof getAllTransactions>>
>[number];

export const adminDashboardTransactionsColumns: ColumnDef<TAdminTransactionsColumns>[] =
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
        const transactionId = row.original.id;
        return transactionId;
      },
    },
    // guest info
    {
      accessorKey: "guest",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Transacted By"
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

    // guest stripe ID
    {
      accessorKey: "guestStripeID",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="By Stripe ID"
          icon={SquareUserRound}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => row.original.guest.stripeId,
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

    // owner stripe ID
    {
      accessorKey: "ownerStripeID",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="To Stripe ID"
          icon={SquareUserRound}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => row.original.listing.owner.stripeId,
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
    // date
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
    },
    // total amount paid
    {
      accessorKey: "totalAmountPaid",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Transaction Amount (USD)"
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

    // net revenue
    {
      accessorKey: "newRevenue",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Net Revenue (USD)"
          icon={Tag}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => {
        const formatted = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(getAppRevenueFromTransaction(row.original as Transaction));

        return <p className="">{formatted}</p>;
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
    // actions
    {
      id: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const transaction = row.original;
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
                {transaction.guest.firstName} {transaction.guest.lastName},{" "}
                {transaction.guest.phoneNo}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => navigator.clipboard.writeText(transaction.id)}
              >
                <Clipboard />
                Copy transactionID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link href={transaction.receiptURL ?? ""}>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Download />
                  Download Invoice
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
