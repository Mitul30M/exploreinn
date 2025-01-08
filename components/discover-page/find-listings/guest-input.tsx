"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CircleMinus, CirclePlus, Minus, Plus, Users } from "lucide-react";
import { Label } from "@/components/ui/label";

const GuestCounterInput = ({
  guestCount,
  onIncrement,
  onDecrement,
}: {
  guestCount?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
}) => {
  const [noOfGuests, setNoOfGuests] = useState<number>(
    guestCount ? guestCount : 1
  );

  // Function to increase the guest count
  const incrementGuests = () => {
    if (noOfGuests < 10) {
      guestCount && onIncrement?.();
      setNoOfGuests(noOfGuests + 1);
    }
  };

  // Function to decrease the guest count
  const decrementGuests = () => {
    if (noOfGuests > 1) {
      guestCount && onDecrement?.();
      setNoOfGuests(noOfGuests - 1);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild className="hover:text-primary">
        <Button variant="outline" className="rounded-xl rounded-l-none">
          <Users />
          {noOfGuests
            ? noOfGuests + (noOfGuests > 1 ? " Guests" : " Guest")
            : "Add No. of Guests"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-4">
        <Label
          className="flex items-center gap-1 mb-2"
          htmlFor="guests-counter"
        >
          <Users size={20} />
          Total Guests
        </Label>
        <div className="space-x-2 mt-4 flex items-center justify-center text-center">
          {/* Decrement Button */}
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={decrementGuests}
            disabled={noOfGuests === 1} // Disable if guests = 1
          >
            <Minus />
          </Button>

          {/* Display Guest Count */}
          <p className="text-3xl font-semibold" id="guests-counter">
            {noOfGuests}{" "}
            <span className="text-sm font-medium">
              {noOfGuests > 1 ? "Guests" : "Guest"}
            </span>
          </p>

          {/* Increment Button */}
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={incrementGuests}
            disabled={noOfGuests === 10} // Disable if guests = 10
          >
            <Plus />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GuestCounterInput;
