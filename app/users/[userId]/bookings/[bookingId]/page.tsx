import { BookingFloatingActionBar } from "@/components/listing-dashoard/bookings/_booingID/floating-action-bar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getUserBooking } from "@/lib/actions/bookings/bookings";
import {
  bookingStatus,
  BookingStatusConfig,
} from "@/lib/utils/types/status/booking-status";
import {
  paymentStatus,
  PaymentStatusConfig,
} from "@/lib/utils/types/status/payement-status";
import { format } from "date-fns";
import {
  BadgeDollarSign,
  CalendarClock,
  ChevronLeft,
  CreditCard,
  Mail,
  Phone,
  Users,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

const UserBookingDetailPage = async ({ params }: { params: Params }) => {
  const bookingId = (await params).bookingId;
  const booking = await getUserBooking(bookingId);
  if (!booking) {
    return notFound();
  }
  return (
    <section className="w-full space-y-4 mb-8 pb-4 border-border/90 border-b-[1px]">
      <div className="text-md  flex justify-start rounded-none items-center gap-4  w-full px-4 py-2 border-y-[1px] border-border/90 text-foreground/90">
        <Link
          href={`/users/${booking.guestId}/bookings`}
          className="flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight hover:text-primary hover:underline hover:underline-offset-2"
        >
          <ChevronLeft className="text-primary" size={22} />
          {booking.guest.firstName}&apos;s Booking Details
        </Link>
      </div>
      <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div className="!flex !flex-col gap-4 rounded-md border-border/90 border-[1px]  p-4 h-max ">
          {/* booking by */}
          <div className="flex gap-3 items-center  ">
            <Avatar className="w-8 h-8 rounded-xl border-border/90">
              <AvatarImage
                src={booking.guest.profileImg}
                alt={booking.guest.firstName}
              />
              <AvatarFallback>
                {booking.guest.firstName[0].toUpperCase()}
                {booking.guest.lastName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="font-medium text-sm rounded-xl flex flex-col gap-1">
              <p>
                {booking.guest.firstName} {booking.guest.lastName}
              </p>
              <small className="text-[12px] font-medium text-accent-foreground/60">
                Booked on{" "}
                {format(new Date(booking.createdAt), "HH:mm dd MMM yyyy")}
              </small>
            </div>
          </div>
          <Separator className="border-border/90" />
          <div className="space-y-2">
            <p className="font-medium text-sm  text-accent-foreground  flex flex-row items-center gap-3">
              <Phone size={16} /> {booking.guest.phoneNo}
            </p>
            <p className="font-medium text-sm  text-accent-foreground  flex flex-row items-center gap-3">
              <Mail size={16} /> {booking.guest.email}
            </p>
          </div>
          <Separator className="border-border/90" />
          <div className="w-full flex items-center justify-between">
            <p className="font-medium text-sm w-max flex gap-2 items-center">
              <Users size={16} />
              {booking.guests === 1
                ? `${booking.guests} Guest`
                : `${booking.guests} Guests`}
            </p>
          </div>
          {/* checkin-checkout */}
          <div className="w-full flex items-center ">
            <p className="font-medium text-sm flex w-max items-center gap-3">
              <CalendarClock size={16} />
              {format(new Date(booking.checkInDate), "dd MMM yyyy")} -{" "}
              {format(new Date(booking.checkOutDate), "dd MMM yyyy")}
            </p>
          </div>
          <Separator className="border-border/90" />
          {/* rooms and extras */}
          <div className="space-y-2">
            <p className="text-sm  flex justify-start rounded-none items-center gap-2 font-medium ">
              Rooms Booked
            </p>
            <div className="flex flex-col gap-2">
              {booking.rooms.map((room) => (
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
              {booking.extras?.length > 0 ? (
                booking.extras.map((extra) => (
                  <p key={extra.name} className="w-max text-sm">
                    {booking.guests}x {extra.name}
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
          {/* booking & payment status'*/}
          <div className=" flex items-center justify-between">
            <p className="text-sm w-[150px]">Payment Status</p>
            <div>
              {(() => {
                const status: PaymentStatusConfig =
                  paymentStatus[
                    booking.paymentStatus as keyof typeof paymentStatus
                  ];
                if (status) {
                  return (
                    <Badge variant="outline" className={status.className}>
                      {status.icon && <status.icon size={16} />} {status.label}
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
                    booking.bookingStatus as keyof typeof bookingStatus
                  ];
                if (status) {
                  return (
                    <Badge variant="outline" className={status.className}>
                      {status.icon && <status.icon size={16} />} {status.label}
                    </Badge>
                  );
                }
                return null;
              })()}
            </div>
          </div>
          <Separator className="border-border/90" />

          {/* booking & Transaction ID */}
          <div className="space-y-2">
            <p className="text-sm  flex justify-start rounded-none items-center gap-2 font-medium tracking-tight text-primary">
              Booking ID
            </p>
            <p className="text-sm   font-medium ">{booking.id}</p>
          </div>
          {booking.transaction && (
            <div className="space-y-2">
              <p className="text-sm  flex justify-start rounded-none items-center gap-2 font-medium tracking-tight text-primary">
                Transaction ID
              </p>
              <p className="text-sm  font-medium">{booking.transaction?.id}</p>
            </div>
          )}
        </div>

        {booking.transaction?.id && (
          <div className="!flex !flex-col gap-4 rounded-md border-border/90 border-[1px] h-max  p-4 ">
            <h1 className="text-md  flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight text-primary">
              <BadgeDollarSign size={20} className="text-primary" />
              Transaction Details
            </h1>
            <Separator className="border-border/90" />
            <div className="flex gap-3 items-center  ">
              <Avatar className="w-8 h-8 rounded-xl border-border/90">
                <AvatarImage
                  src={booking.guest.profileImg}
                  alt={booking.guest.firstName}
                />
                <AvatarFallback>
                  {booking.guest.firstName[0].toUpperCase()}
                  {booking.guest.lastName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="font-medium text-sm rounded-xl flex flex-col gap-1">
                <p>
                  {booking.guest.firstName} {booking.guest.lastName}
                </p>
                <small className="text-[12px] font-medium text-accent-foreground/60">
                  Transaction on{" "}
                  {format(
                    new Date(booking.transaction.createdAt),
                    "HH:mm dd MMM yyyy"
                  )}
                </small>
              </div>
            </div>
            <Separator className="border-border/90" />
            <div className="text-sm font-medium ">
              Total Amount:{" "}
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(booking.transaction.totalCost)}
              <p className="text-foreground/75 mb-4">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(
                  booking.transaction.totalCost - booking.transaction.tax
                )}{" "}
                +{" "}
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(booking.transaction.tax)}{" "}
                (tax)
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm  flex justify-start rounded-none items-center gap-2 font-medium tracking-tight text-primary">
                Transaction ID
              </p>
              <p className="text-sm  font-medium">{booking.transaction.id}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm  flex justify-start rounded-none items-center gap-2 font-medium tracking-tight text-primary">
                Booking ID
              </p>
              <p className="text-sm   font-medium ">
                {booking.transaction.bookingId}
              </p>
            </div>
            <Separator className="border-border/90" />
            <div className="space-y-2">
              {booking.transaction.paymentMethod === "ONLINE_PAYMENT" ? (
                <p className="font-medium text-sm  text-accent-foreground  flex flex-row items-center gap-3">
                  <CreditCard size={16} />{" "}
                  {booking.transaction.card?.cardBrand
                    ? booking.transaction.card.cardBrand
                        .charAt(0)
                        .toUpperCase() +
                      booking.transaction.card.cardBrand.slice(1).toLowerCase()
                    : ""}{" "}
                  ending with {booking.transaction.card?.last4}
                </p>
              ) : (
                <p className="font-medium text-sm  text-accent-foreground  flex flex-row items-center gap-3">
                  <Wallet size={16} /> During Check In
                </p>
              )}
              <p className="font-medium text-sm  text-accent-foreground  flex flex-row items-center gap-3">
                <Mail size={16} />{" "}
                {booking.transaction.paymentMethod === "ONLINE_PAYMENT"
                  ? booking.transaction.card?.billingEmail
                  : booking.guest.email}
              </p>
            </div>
            <Separator className="border-border/90" />
            <div className=" flex items-center justify-between">
              <p className="text-sm w-[150px]">Payment Status</p>
              <div>
                {(() => {
                  const status: PaymentStatusConfig =
                    paymentStatus[
                      booking.transaction
                        .paymentStatus as keyof typeof paymentStatus
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
          </div>
        )}

        {/* chat when bookingStatus === ongoing */}
        {/* <div className="!flex !flex-col gap-4 rounded-md border-border/90 border-[1px]  p-4 h-max "></div> */}

        {/* listing card */}
        <div className="rounded-md border-border/90 border-[1px] p-4 space-y-4  h-max ">
          <h1 className="ext-md  flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight text-primary">
            {booking.listing.name}
          </h1>

          <p className="leading-6 text-[15px]">
            {booking.listing.address.fullAddress}
          </p>

          <Image
            alt={booking.listing.name}
            src={booking.listing.coverImage}
            width={250}
            height={250}
            className="aspect-video w-full object-cover rounded-md"
          />
          <Separator className="border-border/90" />
          <div className="space-y-2">
            <p className="text-sm font-medium text-accent-foreground  flex flex-row items-center gap-2">
              <Phone size={16} /> {booking.listing.phoneNo}
            </p>
            <p className="text-sm font-medium text-accent-foreground  flex flex-row items-center gap-2">
              <Mail size={16} /> {booking.listing.email}
            </p>
          </div>
        </div>
      </div>
      <BookingFloatingActionBar isOwnerOrManager={false} booking={booking} />
    </section>
  );
};

export default UserBookingDetailPage;
