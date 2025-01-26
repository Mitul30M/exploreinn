"use client";

import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/hooks/redux-hooks";
import { RootState } from "@/lib/redux-store/store";
import { useUser } from "@clerk/nextjs";
import { Listing } from "@prisma/client";
import { format } from "date-fns";
import { ListCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface BookingInfoCardProps {
  className?: string;
  listing: Listing;
}
const BookingInfoCard = ({ className, listing }: BookingInfoCardProps) => {
  const user = useUser();
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
  } = useAppSelector((state: RootState) => state.newBooking);

  const router = useRouter();

  return (
    <div className={className}>
      <h1 className="text-lg font-semibold tracking-tight flex gap-2 items-center h-max w-max">
        <ListCheck className="text-primary" />
        Booking Info
      </h1>
      <p className="mt-4 mb-1 font-medium">{listing.name}</p>
      <p className="mb-4 text-sm">{listing.address.fullAddress}</p>

      <Separator className="my-6" />

      <div className="w-full flex items-center justify-between mt-2">
        <p className="text-sm">Booking By</p>
        <p className="font-semibold text-[16px] ">{user.user?.fullName}</p>
      </div>
      <div className="w-full flex items-center justify-between mt-2">
        <p className="text-sm">Email</p>
        <p className="font-semibold text-[16px] ">
          {user.user?.emailAddresses[0].emailAddress}
        </p>
      </div>
      <div className="w-full flex items-center justify-between mt-2">
        <p className="text-sm">Phone No.</p>
        <p className="font-semibold text-[16px] ">
          {user.user?.phoneNumbers[0].phoneNumber}
        </p>
      </div>

      <Separator className="my-6" />
      <div className="w-full flex items-center justify-between mt-2">
        <p className="text-sm">Booking Date</p>
        <p className="font-semibold text-[16px] ">
          {format(new Date(), "dd MMMM yyyy")}
        </p>
      </div>
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
      <div className="w-full flex items-center justify-between mt-2">
        <p className="text-sm">Rooms Booked</p>
        <div className="flex flex-col w-max gap-2">
          {rooms.map((room) => (
            <p key={room.roomID} className="w-max text-sm">
              {room.noOfRooms}x {room.name}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingInfoCard;
