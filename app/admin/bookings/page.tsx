import {
  BedDouble,
  CalendarClock,
  DoorOpen,
  Mail,
  Phone,
  Users,
} from "lucide-react";
import { isAdmin } from "@/lib/actions/user/admin/admin";
import { notFound } from "next/navigation";
import {
  getAllBookings,
  getAllCurrentWeekBookings,
  getAppBookingsStatusOverview,
  getMonthlyAllBookingsComparison,
} from "@/lib/actions/bookings/bookings";
import { ListingWeekWiseBookingsGraph } from "@/components/listing-dashoard/overview/bookings-graph";
import { ListingMonthWiseYearlyBookingsGraph } from "@/components/listing-dashoard/bookings/double-line-graph";
import { Separator } from "@/components/ui/separator";
import {
  bookingStatus,
  BookingStatusConfig,
} from "@/lib/utils/types/status/booking-status";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import {
  paymentStatus,
  PaymentStatusConfig,
} from "@/lib/utils/types/status/payement-status";
import Link from "next/link";
import { AdminBookingsDataTable } from "@/components/admin-dashboard/bookings/admin-bookings-table";
import { adminDashboardBookingsColumns } from "@/components/admin-dashboard/bookings/admin-bookings-table-coulmns";

const AdminBookingsPage = async ({}: {
  params: Promise<{ listingId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const isAdminUser = await isAdmin();
  if (!isAdminUser) {
    return notFound();
  }

  // fetch all bookings
  // fetch all bookings
  const bookings = await getAllBookings();

  // fetch latest  booking & transaction
  const latestBooking = bookings[0];
  // fetch weekly bookings
  const weeklyBookings = await getAllCurrentWeekBookings();

  // fetch bookngs comparison to previous year monthwise
  const monthlyBookings = await getMonthlyAllBookingsComparison();

  // get bookings overview (by booking status)
  const bookingOverview = await getAppBookingsStatusOverview();

  return (
    <section className="w-full space-y-4 mb-8 pb-4 border-border/90 border-b-[1px]">
      {/*  Info */}
      <main className="space-y-4">
        <div className="text-md  flex justify-between rounded-none items-center gap-2  w-full px-4 py-2 border-y-[1px] border-border/90 text-foreground/90">
          <h1 className="flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight">
            <DoorOpen size={22} className="text-primary" />
            exploreinn&apos;s Bookings
          </h1>

          <p className="font-medium tracking-tight text-sm">
            Total Bookings: {"   "}
            <strong className="text-primary text-lg">{bookings.length}</strong>
          </p>
        </div>

        <div className="rounded  !w-full px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* weekly bookings graph */}
          <ListingWeekWiseBookingsGraph
            chartData={weeklyBookings}
            className="rounded-md border-border/90 border-[1px] shadow-none w-full h-max"
          />
          {/* month wise bookings compared to previous year */}
          <ListingMonthWiseYearlyBookingsGraph
            chartData={monthlyBookings}
            className="rounded-md border-border/90 border-[1px] shadow-none w-full h-max"
          />
          {/* overview of bookings according to booking status */}
          <div className="rounded-md border-border/90 border-[1px] p-4 space-y-4  !h-max mb-4 break-inside-avoid">
            <h1 className="text-md  flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight text-primary">
              <DoorOpen size={20} className="text-primary" /> Bookings Overview
            </h1>

            <Separator className="border-border/90" />

            {Object.entries(bookingOverview).map(([key, value]) => {
              const status: BookingStatusConfig =
                bookingStatus[key as keyof typeof bookingStatus];
              if (status) {
                return (
                  <div className="flex justify-between items-center" key={key}>
                    <Badge variant="outline" className={status.className}>
                      {status.icon && <status.icon size={16} />} {status.label}
                    </Badge>
                    <Badge variant="outline" className={status.className}>
                      {value}
                    </Badge>
                  </div>
                );
              }
              return null;
            })}
          </div>
          {/* latest booking card*/}
          {latestBooking && (
            <ScrollArea className="rounded-md border-border/90 border-[1px] p-4 !h-[340px] !w-full">
              <div className="!flex !flex-col gap-4">
                <h1 className="text-md  flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight text-primary">
                  <BedDouble size={20} className="text-primary" /> Recent
                  Booking
                </h1>
                <Separator className="border-border/90" />
                {/* booking by */}
                <div className="flex gap-3 items-center  ">
                  <Avatar className="w-8 h-8 rounded-xl border-border/90">
                    <AvatarImage
                      src={latestBooking.guest.profileImg}
                      alt={latestBooking.guest.firstName}
                    />
                    <AvatarFallback>
                      {latestBooking.guest.firstName[0].toUpperCase()}
                      {latestBooking.guest.lastName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="font-medium text-sm rounded-xl flex flex-col gap-1">
                    <p>
                      {latestBooking.guest.firstName}{" "}
                      {latestBooking.guest.lastName}
                    </p>
                    <small className="text-[12px] font-medium text-accent-foreground/60">
                      Booked on{" "}
                      {format(
                        new Date(latestBooking.createdAt),
                        "HH:mm dd MMM yyyy"
                      )}
                    </small>
                  </div>
                </div>
                <Separator className="border-border/90" />
                <div className="space-y-2">
                  <p className="font-medium text-sm  text-accent-foreground  flex flex-row items-center gap-3">
                    <Phone size={16} /> {latestBooking.guest.lastName}
                  </p>
                  <p className="font-medium text-sm  text-accent-foreground  flex flex-row items-center gap-3">
                    <Mail size={16} /> {latestBooking.guest.email}
                  </p>
                </div>
                <Separator className="border-border/90" />
                <div className="w-full flex items-center justify-between">
                  <p className="font-medium text-sm w-max flex gap-2 items-center">
                    <Users size={16} />
                    {latestBooking.guests === 1
                      ? `${latestBooking.guests} Guest`
                      : `${latestBooking.guests} Guests`}
                  </p>
                </div>
                {/* checkin-checkout */}
                <div className="w-full flex items-center ">
                  <p className="font-medium text-sm flex w-max items-center gap-3">
                    <CalendarClock size={16} />
                    {format(
                      new Date(latestBooking.checkInDate),
                      "dd MMM yyyy"
                    )}{" "}
                    -{" "}
                    {format(
                      new Date(latestBooking.checkOutDate),
                      "dd MMM yyyy"
                    )}
                  </p>
                </div>
                <Separator className="border-border/90" />
                {/* booking & payment status'*/}
                <div className=" flex items-center justify-between">
                  <p className="text-sm w-[150px]">Payment Status</p>
                  <div>
                    {(() => {
                      const status: PaymentStatusConfig =
                        paymentStatus[
                          latestBooking.paymentStatus as keyof typeof paymentStatus
                        ];
                      if (status) {
                        return (
                          <Badge variant="outline" className={status.className}>
                            {status.icon && <status.icon size={16} />}{" "}
                            {status.label}
                          </Badge>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
                <div className=" flex items-center justify-between">
                  <p className="text-sm">Booking Status</p>
                  <div>
                    {(() => {
                      const status: BookingStatusConfig =
                        bookingStatus[
                          latestBooking.bookingStatus as keyof typeof bookingStatus
                        ];
                      if (status) {
                        return (
                          <Badge variant="outline" className={status.className}>
                            {status.icon && <status.icon size={16} />}{" "}
                            {status.label}
                          </Badge>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
                <Separator className="border-border/90" />
                {/* rooms and extras */}
                <div className="space-y-2">
                  <p className="text-sm  flex justify-start rounded-none items-center gap-2 font-medium ">
                    Rooms Booked
                  </p>
                  <div className="flex flex-col gap-2">
                    {latestBooking.rooms.map((room) => (
                      <p key={room.roomId} className="w-max text-sm">
                        {room.noOfRooms}x {room.name} [at{" "}
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                        }).format(room.rate)}
                        /night]
                      </p>
                    ))}
                  </div>
                </div>
                <Separator className="border-border/90" />
                <div className="space-y-2">
                  <p className="text-sm flex justify-start rounded-none items-center gap-2 font-medium ">
                    Extras
                  </p>
                  <div className="space-y-2">
                    {latestBooking.extras?.length > 0 ? (
                      latestBooking.extras.map((extra) => (
                        <p key={extra.name} className="w-max text-sm">
                          {latestBooking.guests}x {extra.name}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No extras selected
                      </p>
                    )}
                  </div>
                </div>
                <Separator className="border-border/90" />
                {/* booking & Transaction ID */}
                <div className="space-y-2">
                  <p className="text-sm  flex justify-start rounded-none items-center gap-2 font-medium tracking-tight text-primary">
                    Booking ID
                  </p>
                  <p className="text-sm   font-medium ">
                    <Link
                      className="hover:text-primary hover:underline hover:underline-offset-2"
                      href={`#`}
                    >
                      {latestBooking.id}
                    </Link>
                  </p>
                </div>
                {latestBooking.transaction && (
                  <div className="space-y-2">
                    <p className="text-sm  flex justify-start rounded-none items-center gap-2 font-medium tracking-tight text-primary">
                      Transaction ID
                    </p>
                    <p className="text-sm  font-medium">
                      <Link
                        className="hover:text-primary hover:underline hover:underline-offset-2"
                        href={`#`}
                      >
                        {latestBooking.transaction?.id}
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* bookings table */}
        <AdminBookingsDataTable
          columns={adminDashboardBookingsColumns}
          data={bookings}
        />
      </main>
    </section>
  );
};

export default AdminBookingsPage;
