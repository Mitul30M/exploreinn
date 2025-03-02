"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Transaction } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Calendar1,
  ClipboardList,
  Mail,
  Phone,
  SquareUserRound,
  Tag,
  Hourglass,
  MoreHorizontal,
  Clipboard,
} from "lucide-react";
import Link from "next/link";
import { getRevenueFromTransaction } from "@/lib/actions/transactions/transactions";

export type TDashboardTransactionsColumns = Transaction & {
  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNo: string;
    profileImg: string;
  };
};

export const dashboardTransactionsTableColumns: ColumnDef<TDashboardTransactionsColumns>[] =
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
      cell: ({ row }) => {
        const guestName =
          row.original.guest.firstName + " " + row.original.guest.lastName;
        const guestProfileImg = row.original.guest.profileImg;
        const guestEmail = row.original.guest.email;
        const guestPhoneNo = row.original.guest.phoneNo;
        return (
          <div className="flex ms-2 items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg border-2">
              <AvatarImage src={guestProfileImg} alt={guestName} />
              <AvatarFallback className="rounded-lg">
                {guestName.split(" ")[0].charAt(0).toUpperCase() +
                  guestName.split(" ")[1].charAt(0).toUpperCase()}
              </AvatarFallback>{" "}
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className=" font-medium">{guestName}</span>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Phone size={12} /> {guestPhoneNo} <Mail size={12} />{" "}
                {guestEmail}
              </p>
            </div>
          </div>
        );
      },
    },
    // transaction id
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="transactionID"
          icon={ClipboardList}
          className="flex items-center gap-2 ms-4"
        />
      ),
      cell: ({ row }) => {
        const transactionId = row.original.id;
        return (
          <Link
            className="hover:text-primary hover:underline hover:underline-offset-2"
            href={`/listings/${row.original.listingId}/transactions/${transactionId}`}
          >
            {transactionId}
          </Link>
        );
      },
    },
    //   transaction date
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

        // Check if the row's paymentStatus matches any of the selected filters
        return filterValue.includes(row.getValue(columnId));
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
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <p className="">{formatted}</p>;
      },
    },

    // new revenue
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
        const amount = row.original.totalCost;
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(getRevenueFromTransaction(row.original));

        return <p className="">{formatted}</p>;
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
              <DropdownMenuSeparator />
              <Link
                href={`/listings/${transaction.listingId}/transactions/${transaction.id}`}
              >
                <DropdownMenuItem className="flex items-center gap-2">
                  <Hotel />
                  Transaction Details
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
