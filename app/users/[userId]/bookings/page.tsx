import { DataTable } from "@/components/ui/data-table/data-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { bookingTableColumns } from "@/components/user-page/bookings/booking-table-columns";
import { BookingsDataTableToolbar } from "@/components/user-page/bookings/bookings-data-table-toolbar";
import { bookings } from "@/lib/utils/seed/bookings";
import { TicketsPlane } from "lucide-react";
import React from "react";

const UserBookingsPage = ({
  params,
  searchParams,
}: {
  params: { userId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
  }) => {
  
  
  
  return (
    <section className="w-full space-y-4 mb-8 pb-4 border-border/90 border-b-[1px]">
      {/* Personal Info */}
      <div id="personal-info" className="space-y-4">
        <h1 className="text-md  flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight w-full px-4 py-2 border-y-[1px] border-border/90 text-foreground/90">
          <TicketsPlane size={22} className="text-primary" />
          Mitul's Booking History
        </h1>

        {/* User's Booking History */}
        <DataTable
          columns={bookingTableColumns}
          data={bookings}
          className="mx-4"
        />
      </div>
    </section>
  );
};

export default UserBookingsPage;
