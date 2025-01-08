"use client";

import {
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Handshake,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { ListingRoom } from "@/lib/utils/seed/listing/listings";
import { Room } from "@prisma/client";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { AppDispatch, RootState } from "@/lib/redux-store/store";
import {
  addRoom,
  removeRoom,
} from "@/lib/redux-store/slices/new-booking-slice";

const BookRoomBtn = ({
  room,
  className,
  ...props
}: {
  room: Room;
  className?: string;
}) => {
  const [showCounter, setShowCounter] = useState<boolean>(false);
  // const [rooms, setRooms] = useState<number>(1);
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
  const dispatch: AppDispatch = useAppDispatch();

  const currentRoom = rooms.find((_) => _.roomID === room.id);

  const incrementRooms = () => {
    // setRooms((prev) => prev + 1);
    dispatch(addRoom({ name: room.name, rate: room.price, roomID: room.id }));
  };

  const decrementRooms = () => {
    dispatch(removeRoom(room.id));
  };

  {
    console.log(currentRoom);
  }

  return (
    <div className="flex flex-col w-full gap-4">
      {!rooms.find((_) => _.roomID === room.id) ||
      rooms.find((_) => _.roomID === room.id)?.noOfRooms === 0 ? (
        <Button
          className="rounded-lg w-full"
          onClick={() => {
            incrementRooms();
            setShowCounter(true);
          }}
        >
          <Handshake />
          Book Room
        </Button>
      ) : (
        <div className="rounded-full flex flex-row py-1 gap-2 items-center justify-center">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={decrementRooms}
          >
            <Minus />
          </Button>
          {currentRoom?.noOfRooms} Room{currentRoom?.noOfRooms !== 1 && "s"}
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={incrementRooms}
            // disabled={rooms === room.maxRoomsPerBookings}
          >
            <Plus />
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookRoomBtn;
