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
import { useState } from "react";
import { ListingRoom } from "@/lib/utils/seed/listing/listings";

const BookRoomBtn = ({
  room,
  className,
  ...props
}: {
  room: ListingRoom;
  className?: string;
}) => {
  const [showCounter, setShowCounter] = useState<boolean>(false);
  const [rooms, setRooms] = useState<number>(1);

  const incrementRooms = () => {
    setRooms((prev) => prev + 1);
  };

  const decrementRooms = () => {
    if (rooms > 1) {
      setRooms((prev) => prev - 1);
    } else {
      setRooms(0);
      setShowCounter(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-4">
      {!showCounter ? (
        <Button
          className="rounded-full w-full"
          onClick={() => {
            setRooms(1);
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
          {rooms} Room{rooms !== 1 && "s"}
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={incrementRooms}
            disabled={rooms === room.maxRoomsPerBookings}
          >
            <Plus />
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookRoomBtn;
