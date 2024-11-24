import { DataTable } from "@/components/ui/data-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { bookingTableColumns } from "@/components/user-page/bookings/booking-table-columns";
import { bookings } from "@/lib/utils/seed/bookings";
import { TicketsPlane } from "lucide-react";
import React from "react";

const UserBookingsPage = () => {
  return (
    <section className="w-full space-y-4 p-4 pb-8 border-border/90 border-t-[1px]">
      {/* Personal Info */}
      <div id="personal-info" className="space-y-4">
        <h1 className="text-lg rounded flex justify-start items-center gap-2 font-semibold tracking-tight w-full px-4 py-2 border-[1px] border-border/90 text-foreground/90">
          <TicketsPlane size={22} className="text-primary" />
          Mitul's Booking History
        </h1>

        {/* User's Booking History */}
          <DataTable columns={bookingTableColumns} data={bookings} />
      </div>
    </section>
  );
};

export default UserBookingsPage;
