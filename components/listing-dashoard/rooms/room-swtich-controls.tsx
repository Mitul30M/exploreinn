"use client";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  updateIsAcceptingBooking,
  updateIsDynamicallyPriced,
} from "@/lib/actions/rooms/rooms";
import { startTransition, useState } from "react";

export default function RoomPricingSwitch({
  roomId,
  isAcceptingBookings,
  isDynamicallyPriced,
}: {
  roomId: string;
  isAcceptingBookings: boolean;
  isDynamicallyPriced: boolean;
}) {
  const [isPending, setIsPending] = useState(false);

  const handleAcceptingBookingsChange = (value: boolean) => {
    startTransition(async () => {
      setIsPending(true);
      await updateIsAcceptingBooking(roomId, value);
      setIsPending(false);
    });
  };

  const handleDynamicPricingChange = (value: boolean) => {
    startTransition(async () => {
      setIsPending(true);
      await updateIsDynamicallyPriced(roomId, value);
      setIsPending(false);
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Separator className="border-border/90" />

      <div className="flex items-center gap-2">
        <Switch
          id="is-accepting-bookings"
          checked={isAcceptingBookings}
          onCheckedChange={handleAcceptingBookingsChange}
          disabled={isPending}
        />
        <Label htmlFor="is-accepting-bookings" className="text-sm font-medium">Is Accepting Bookings?</Label>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="is-dynamically-priced"
          checked={isDynamicallyPriced}
          onCheckedChange={handleDynamicPricingChange}
          disabled={isPending}
        />
        <Label htmlFor="is-dynamically-priced" className="text-sm font-medium">Is Dynamically Priced?</Label>
      </div>
    </div>
  );
}
