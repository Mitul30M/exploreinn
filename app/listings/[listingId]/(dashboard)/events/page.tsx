import { EventsCalendarControl } from "@/components/events/events-calendar-control";
import { BookingClosedEventModal } from "@/components/events/newBookingClosedEventModal";
import { NewHighDemandEventModal } from "@/components/events/newHighDemandEventModal";
import { NewPriceChangeEventModal } from "@/components/events/newPriceChangeModal";
import { Separator } from "@/components/ui/separator";
import { getListingById } from "@/lib/actions/listings/listings";
import { fetchEvents } from "@/lib/actions/room-events/room-events";
import { currentUser } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { CalendarRange } from "lucide-react";
import { notFound } from "next/navigation";

const ListingEventPage = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: SearchParams;
}) => {
  const user = await currentUser();
  const userDdId = (user?.publicMetadata as PublicMetadataType).userDB_id;
  const listing = await getListingById((await params).listingId);
  if (!listing || !userDdId) {
    return notFound();
  }

  const searchDate = (await searchParams)?.date
    ? new Date((await searchParams)?.date as string)
    : undefined;

  const month = searchDate
    ? searchDate.toLocaleString("default", { month: "long" })
    : (((await searchParams)?.month as string) ??
      new Date().toLocaleString("default", { month: "long" }));

  const year = searchDate
    ? searchDate.getFullYear()
    : (Number((await searchParams)?.year) ?? new Date().getFullYear());

  const events = await fetchEvents({
    date: searchDate,
    month,
    year,
    listingId: listing.id,
  });

  return (
    <section className="w-full h-max space-y-4 mb-8 pb-4 border-border/90 border-b-[1px]">
      <div className="text-md  flex  rounded-none items-center gap-2  w-full px-4 py-2 border-y-[1px] border-border/90 text-foreground/90">
        <h1 className="flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight">
          <CalendarRange size={22} className="text-primary" />
          {listing.name}'s Events {month} {year}
        </h1>
      </div>

      <div className="rounded  !w-full px-4 flex flex-row items-start h-max  gap-4">
        {/* calendar */}
        <div className="w-max space-y-4  ">
          <EventsCalendarControl listingId={listing.id} />
          <Separator className="bg-border/90" />

          {/* dialog buttons to create highDemand, bookingClosed and priceChange events */}
          <div className="space-y-2">
            <NewHighDemandEventModal
              listingId={listing.id}
              authorId={userDdId}
              roomInfo={listing.rooms.map((room) => ({
                roomId: room.id,
                roomName: room.name,
              }))}
            />
            <NewPriceChangeEventModal
              authorId={userDdId}
              listingId={listing.id}
              roomInfo={listing.rooms.map((room) => ({
                roomId: room.id,
                roomName: room.name,
                roomBasePrice: room.basePrice,
              }))}
            />
            <BookingClosedEventModal
              authorId={userDdId}
              roomInfo={listing.rooms.map((room) => ({
                roomId: room.id,
                roomName: room.name,
              }))}
              listingId={listing.id}
            />
          </div>
        </div>
        {/* events */}
        <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
          {events.map((event) => (
            <div
              key={event.id}
              className="aspect-square rounded-md p-4 border border-border/90"
            >
              <h3 className="text-lg font-semibold text-primary">
                {event.type}
              </h3>
              <p className="text-sm text-foreground/60">
                {format(new Date(event.startDate), "dd MMM yyyy")} to
                {format(new Date(event.endDate), "dd MMM yyyy")}
              </p>
              <p>
                Created By: {event.author.firstName} {event.author.lastName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListingEventPage;
