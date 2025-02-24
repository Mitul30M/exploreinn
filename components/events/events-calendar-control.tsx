"use client";
import { useRouter } from "next/navigation";
import { Calendar } from "../ui/calendar";

const EventsCalendarControl = ({ listingId }: { listingId: string }) => {
  const router = useRouter();
  return (
    <Calendar
      className="border-border/90 border rounded-md"
      mode="single"
      defaultMonth={new Date()}
      onSelect={(date) => {
        router.push(
          `/listings/${listingId}/events?date=${date?.toISOString()}`
        );
      }}
      onMonthChange={(month) => {
        const monthName = month.toLocaleString("default", { month: "long" });
        const year = month.getFullYear();
        router.push(
          `/listings/${listingId}/events?month=${monthName}&year=${year}`
        );
      }}
    />
  );
};

export { EventsCalendarControl };
