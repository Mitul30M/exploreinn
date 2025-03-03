"use client";
import { Listing, Room } from "@prisma/client";
import { Handshake, ListCheck } from "lucide-react";
import React, { useEffect } from "react";
import { DatePickerWithRange } from "../discover-page/find-listings/date-range-picker";
import GuestCounterInput from "../discover-page/find-listings/guest-input";
import { Separator } from "../ui/separator";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { AppDispatch, RootState } from "@/lib/redux-store/store";
import { differenceInDays, format, isValid } from "date-fns";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  calculateTax,
  calculateTotal,
  calculateTotalPayable,
  decGuests,
  incGuests,
  setCheckIn,
  setCheckOut,
  setNights,
  setTax,
} from "@/lib/redux-store/slices/new-booking-slice";
import { useRouter } from "next/navigation";

interface BookingDetailsProps {
  className?: string;
  listing: Listing;
  roomList: Room[];
}

const BookingDetails = ({ listing, className }: BookingDetailsProps) => {
  // const user = useUser();

  useEffect(() => {
    dispatch(setTax(listing.taxRates));
  }, []);

  const {
    checkIn,
    checkOut,
    guests,
    nights,
    totalPayable,
    tax,
    extras,
    rooms,
    taxes,
    totalWithoutTaxes,
    isOfferApplied,
    couponCode,
    offerId,
  } = useAppSelector((state: RootState) => state.newBooking);
  const dispatch: AppDispatch = useAppDispatch();

  const router = useRouter();
  useEffect(() => {
    console.log("guests,room,extras,nights");
    dispatch(calculateTotal());
    dispatch(calculateTax());
    dispatch(calculateTotalPayable());
  }, [rooms, extras, nights, guests, isOfferApplied, couponCode, offerId]);

  if (checkIn && checkOut && nights && rooms.length > 0)
    return (
      <div className={className}>
        <h1 className="text-lg font-semibold tracking-tight flex gap-2 items-center h-max w-max">
          <ListCheck className="text-primary" />
          Booking Summary
        </h1>
        <p className="mt-4 mb-1 font-medium">{listing.name}</p>
        <p className="mb-4 text-sm">{listing.address.fullAddress}</p>

        <div className="flex items-center justify-center">
          <DatePickerWithRange
            className="border-[1px] border-e-0 border-border/90 rounded-e-none hover:text-primary"
            to={isValid(new Date(checkOut)) ? new Date(checkOut) : undefined}
            from={isValid(new Date(checkIn)) ? new Date(checkIn) : undefined}
            onDateSelect={(date) => {
              console.log(date);
              if (date?.from && date?.to) {
                dispatch(setCheckIn(format(date.from, "LLL dd, y")));
                dispatch(setCheckOut(format(date.to, "LLL dd, y")));
                dispatch(setNights(differenceInDays(date?.to, date?.from)));
              }
            }}
          />
          <GuestCounterInput
            guestCount={guests}
            onIncrement={() => {
              dispatch(incGuests());
            }}
            onDecrement={() => dispatch(decGuests())}
          />
        </div>

        <Separator className="my-6" />
        <div className="w-full flex items-center justify-between mt-2">
          <p className="text-sm">Guests</p>
          <p className="font-semibold text-[16px] ">{guests}</p>
        </div>
        <div className="w-full flex items-center justify-between mt-2">
          <p className="text-sm">Check In</p>
          <p className="font-semibold text-[16px] ">
            {checkIn && format(checkIn, "dd MMMM yyyy")}
          </p>
        </div>
        <div className="w-full flex items-center justify-between mt-2">
          <p className="text-sm">Check Out</p>
          <p className="font-semibold text-[16px]">
            {checkOut && format(checkOut, "dd MMMM yyyy")}
          </p>
        </div>
        <div className="w-full flex items-center justify-between mt-2">
          <p className="text-sm">Nights Staying</p>
          <p className="font-semibold text-[16px]">{nights}</p>
        </div>

        <Separator className="my-6" />
        <div className="w-full flex items-center ">
          <p className="font-semibold text-[16px]">Room Rate ($/night)</p>
        </div>

        {rooms.map((room) => (
          <div
            key={room.roomID}
            className="w-full flex items-center justify-between mt-2"
          >
            <p className="text-sm">{room.name}</p>
            <p className="font-semibold text-[16px]">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(room.rate)}
              /night
            </p>
          </div>
        ))}

        <Separator className="my-6" />
        <div className="w-full flex items-center ">
          <p className="font-semibold text-[16px]">Extras</p>
        </div>

        {extras.map((extra) => (
          <div
            key={extra.name}
            className="w-full flex items-center justify-between mt-2"
          >
            <p className="text-sm">{extra.name}</p>
            <p className="font-semibold text-[16px]">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(extra.cost * nights * guests)}
            </p>
          </div>
        ))}

        {/* <div className="w-full flex items-center justify-between mt-2">
        <p className="text-sm">No extras</p>
        <p className="font-semibold text-[16px]">$0.00</p>
      </div> */}

        <Separator className="my-6" />
        <div className="w-full flex items-center ">
          <p className="font-semibold text-[16px]">Booking Fee</p>
        </div>

        {rooms.map((room) => (
          <div
            key={room.roomID}
            className="w-full flex items-center justify-between mt-2"
          >
            <p className="text-sm">
              {room.noOfRooms}x {room.name} (
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(room.rate)}
              )
            </p>
            <p className="font-semibold text-[16px]">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(room.noOfRooms * nights * room.rate)}
            </p>
          </div>
        ))}

        <div className="w-full flex items-center justify-between mt-2">
          <p className="text-sm">Total</p>
          <p className="font-semibold text-[16px]">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(totalWithoutTaxes)}
          </p>
        </div>

        <Separator className="my-6" />
        <div className="w-full flex items-center ">
          <p className="font-semibold text-[16px]">Taxes</p>
        </div>
        {taxes.map((tax) => (
          <div
            key={tax.name}
            className="w-full flex items-center justify-between mt-2"
          >
            <p className="text-sm">
              {tax.name} ({tax.rate.toLocaleString()}%)
            </p>
            <p className="font-semibold text-[16px]">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(
                (rooms.reduce(
                  (acc, room) => acc + room.noOfRooms * nights * room.rate,
                  0
                ) +
                  extras.reduce(
                    (acc, extra) => acc + extra.cost * nights * guests,
                    0
                  )) *
                  (tax.rate / 100)
              )}
            </p>
          </div>
        ))}

        <div className="w-full flex items-center justify-between mt-2">
          <p className="text-sm">Total Taxes</p>
          <p className="font-semibold text-[16px]">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(tax)}
          </p>
        </div>

        <Separator className="my-6" />
        <div className="w-full flex items-center justify-between mt-2">
          <p className="font-semibold text-[16px]">Total Booking Amount</p>
          <p className="font-semibold text-[16px]">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(totalPayable)}
          </p>
        </div>

        <p className="text-accent-foreground/70 text-sm font-medium my-6">
          *Free Cancellation upto to 48hrs before checkIn. After that, a one
          night charge will be applicable.
          <br />
          *Incase of booking changes the same must be consulted with the
          respective Listing&apos;s managers.
          <br />
          <Link
            href={"#"}
            className="text-primary hover:underline hover:underline-offset-2"
          >
            Terms & Conditions Applied
          </Link>
        </p>

        <Button
          className="w-full"
          disabled={!rooms.length || !checkIn || !checkOut || !totalPayable}
          onClick={() => router.push(`/listings/${listing.id}/confirm-booking`)}
        >
          <Handshake /> Confirm Booking
        </Button>
      </div>
    );
  else
    return (
      <div className={className}>
        <h1 className="text-lg font-semibold tracking-tight flex gap-2 items-center h-max w-max">
          <ListCheck className="text-primary" />
          Booking Summary
        </h1>
        <p className="mt-4 mb-1 font-medium">{listing.name}</p>
        <p className="mb-4 text-sm">{listing.address.fullAddress}</p>

        <div className="flex items-center justify-center">
          <DatePickerWithRange
            className="border-[1px] border-e-0 border-border/90 rounded-e-none hover:text-primary"
            to={isValid(new Date(checkOut)) ? new Date(checkOut) : undefined}
            from={isValid(new Date(checkIn)) ? new Date(checkIn) : undefined}
            onDateSelect={(date) => {
              console.log(date);
              if (date?.from && date?.to) {
                dispatch(setCheckIn(format(date.from, "LLL dd, y")));
                dispatch(setCheckOut(format(date.to, "LLL dd, y")));
                dispatch(setNights(differenceInDays(date?.to, date?.from)));
              }
            }}
          />
          <GuestCounterInput
            guestCount={guests}
            onIncrement={() => dispatch(incGuests())}
            onDecrement={() => dispatch(decGuests())}
          />
        </div>
      </div>
    );
};
export default BookingDetails;
