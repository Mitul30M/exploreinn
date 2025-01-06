import { Listing, Room } from "@prisma/client";
import { ListCheck, Receipt } from "lucide-react";
import React from "react";
import { DatePickerWithRange } from "../discover-page/find-listings/date-range-picker";
import GuestCounterInput from "../discover-page/find-listings/guest-input";
import { Separator } from "../ui/separator";
import { currentUser } from "@clerk/nextjs/server";

interface BookingDetailsProps {
  className?: string;
  listing: Listing;
  rooms: Room[];
}

const BookingDetails = async ({
  listing,
  rooms,
  className,
}: BookingDetailsProps) => {
  const user = await currentUser();

  return (
    <div className={className}>
      <h1 className="text-lg font-semibold tracking-tight flex gap-2 items-center h-max w-max">
        <ListCheck className="text-primary" />
        Booking Summary
      </h1>
      <p className="mt-4 mb-1 font-medium">{listing.name}</p>
      <p className="mb-4 text-sm">{listing.address.fullAddress}</p>

      <div className="flex items-center justify-center">
        <DatePickerWithRange className="border-[1px] border-e-0 border-border/90 rounded-e-none hover:text-primary" />
        <GuestCounterInput />
      </div>

      <Separator className="my-6" />
      {/* email */}
      <div className="w-full flex items-center justify-between">
        <p className="text-sm">Email Address</p>
        <p className="font-semibold text-[16px]">
          {user?.emailAddresses[0].emailAddress}
        </p>
      </div>
      {/* phone */}
      <div className="w-full flex items-center justify-between mt-2">
        <p className="text-sm">Phone No.</p>
        <p className="font-semibold text-[16px] ">
          {user?.phoneNumbers[0].phoneNumber}
        </p>
      </div>

      <Separator className="my-6" />
      {/* booking by */}
      <div className="w-full flex items-center justify-between">
        <p className="text-sm">Booking By</p>
        <p className="font-semibold text-[16px]">{user?.fullName}</p>
      </div>
      {/* Guests */}
      <div className="w-full flex items-center justify-between mt-2">
        <p className="text-sm">Guests</p>
        <p className="font-semibold text-[16px] ">1</p>
      </div>
      {/* Check In */}
      <div className="w-full flex items-center justify-between mt-2">
        <p className="text-sm">Check In</p>
        <p className="font-semibold text-[16px] ">22 June 2024</p>
      </div>
      {/* Check Out */}
      <div className="w-full flex items-center justify-between mt-2">
        <p className="text-sm">Check Out</p>
        <p className="font-semibold text-[16px]">25 June 2024</p>
      </div>
      {/* Nights */}
      <div className="w-full flex items-center justify-between mt-2">
        <p className="text-sm">Nights Staying</p>
        <p className="font-semibold text-[16px]">3</p>
      </div>

      <Separator className="my-6" />
      {/* room rate per night */}
      <div className="w-full flex items-center ">
        <p className="font-semibold text-[16px]">Room Rate ($/night)</p>
      </div>
      <div className="w-full flex items-center justify-between mt-2">
        <p className="text-sm">1x Deluxe Room</p>
        <p className="font-semibold text-[16px]">$1750.00</p>
      </div>

      <Separator className="my-6" />
      {/* extras */}
      <div className="w-full flex items-center ">
        <p className="font-semibold text-[16px]">Extras</p>
      </div>
      <div className="w-full flex items-center justify-between mt-2">
        <p className="text-sm">No extras</p>
        <p className="font-semibold text-[16px]">$0.00</p>
      </div>

      <Separator className="my-6" />
      {/* booking fee */}
      <div className="w-full flex items-center ">
        <p className="font-semibold text-[16px]">Booking Fee</p>
      </div>
      <div className="w-full flex items-center justify-between mt-2">
        <p className="text-sm">Deluxe Room (2 Nights)</p>
        <p className="font-semibold text-[16px]">$3500.00</p>
      </div>

      <Separator className="my-6" />
      {/* taxes */}
      <div className="w-full flex items-center ">
        <p className="font-semibold text-[16px]">Taxes</p>
      </div>
      <div className="w-full flex items-center justify-between mt-2">
        <p className="text-sm">Tax Name (0.00%)</p>
        <p className="font-semibold text-[16px]">$0.00</p>
      </div>

      <Separator className="my-6" />
      {/* total amount */}
      <div className="w-full flex items-center justify-between mt-2">
        <p className="font-semibold text-[16px]">Total Booking Amount</p>
        <p className="font-semibold text-[16px]">$3500.00</p>
      </div>

      <Separator className="my-6" />
    </div>
  );
};
export default BookingDetails;
