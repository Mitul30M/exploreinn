import { DataTable } from "@/components/ui/data-table/data-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { bookingTableColumns } from "@/components/user-page/bookings/booking-table-columns";
import { UserBookingsDataTable } from "@/components/user-page/bookings/bookings-data-table";
import { BookingsDataTableToolbar } from "@/components/user-page/bookings/bookings-data-table-toolbar";
import { getUserBookings } from "@/lib/actions/bookings/bookings";
import { bookings } from "@/lib/utils/seed/bookings";
import { currentUser } from "@clerk/nextjs/server";
import { TicketsPlane } from "lucide-react";
import React from "react";

import { Booking } from "@prisma/client";

export type UserBookings = Booking & {
  listing: {
    id: string;
    name: string;
    coverImage: string;
    address: {
      street: string;
      neighborhood: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
      fullAddress: string;
      landmark: string;
    };
  };
};

const UserBookingsPage = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: SearchParams;
}) => {
  const user = await currentUser();
  const userBookings = await getUserBookings();

  return (
    <section className="w-full space-y-4 mb-8 pb-4 border-border/90 border-b-[1px]">
      {/* Personal Info */}
      <div id="personal-info" className="space-y-4">
        <h1 className="text-md  flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight w-full px-4 py-2 border-y-[1px] border-border/90 text-foreground/90">
          <TicketsPlane size={22} className="text-primary" />
          {user?.firstName}'s Booking History
        </h1>

        {/* User's Booking History */}
        <UserBookingsDataTable
          columns={bookingTableColumns}
          data={
            userBookings.map((booking) => ({
              ...booking,
              listing: {
                ...booking.listing,
              },
            })) as UserBookings[]
          }
          className="mx-4"
        />
      </div>
    </section>
  );
};

export default UserBookingsPage;
