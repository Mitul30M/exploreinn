import { EventsCalendarControl } from "@/components/events/events-calendar-control";
import { BookingClosedEventModal } from "@/components/events/newBookingClosedEventModal";
import { NewHighDemandEventModal } from "@/components/events/newHighDemandEventModal";
import { NewPriceChangeEventModal } from "@/components/events/newPriceChangeModal";
import { DeleteEventForm } from "@/components/listing-dashoard/events/delete-event";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { getListingById } from "@/lib/actions/listings/listings";
import { fetchEvents } from "@/lib/actions/room-events/room-events";
import { currentUser } from "@clerk/nextjs/server";
import { format } from "date-fns";
import {
  ArrowUp,
  BadgeDollarSignIcon,
  CalendarOff,
  CalendarRange,
  ChartSpline,
  DoorClosed,
  DoorOpen,
} from "lucide-react";
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
          {listing.name}&apos;s Events
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
              className="aspect-square rounded-md p-4 border border-border/90 space-y-4"
            >
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button
                    variant="link"
                    className="text-[14px] font-semibold text-primary w-max flex gap-2 items-center p-0"
                  >
                    {event.type === "HighDemand" && (
                      <ChartSpline className="text-primary" size={18} />
                    )}
                    {event.type === "PriceChange" && (
                      <BadgeDollarSignIcon className="text-primary" size={18} />
                    )}
                    {event.type === "BookingClosed" && (
                      <CalendarOff className="text-primary" size={18} />
                    )}
                    {event.type.match(/[A-Z][a-z]+|[0-9]+/g)?.join(" ") ||
                      event.type}
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-max p-3 ">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[15px] font-medium  w-max flex gap-1 items-center">
                      {event.type === "HighDemand" && (
                        <ChartSpline className="text-primary" size={18} />
                      )}
                      {event.type === "PriceChange" && (
                        <BadgeDollarSignIcon
                          className="text-primary"
                          size={18}
                        />
                      )}
                      {event.type === "BookingClosed" && (
                        <CalendarOff className="text-primary" size={18} />
                      )}
                      {event.type.match(/[A-Z][a-z]+|[0-9]+/g)?.join(" ") ||
                        event.type}
                    </h3>
                    <div className="flex flex-col gap-3 border-border/90 border-[1px] p-3 rounded">
                      {event.type === "HighDemand" &&
                        event.highDemand.map((eventRoom) => (
                          <div key={eventRoom.roomId} className="flex gap-6">
                            <span className=" font-medium">
                              {eventRoom.roomName}
                            </span>
                            <span className="text-[15px] font-medium  w-max flex items-center gap-1">
                              <ArrowUp size={16} />
                              {eventRoom.priceIncrementPercentage}%
                            </span>
                          </div>
                        ))}
                      {event.type === "PriceChange" &&
                        event.priceChange.map((eventRoom) => (
                          <div key={eventRoom.roomId} className="flex gap-6">
                            <span className="font-medium">
                              {eventRoom.roomName}
                            </span>
                            <span className="text-[15px] font-medium w-max flex items-center gap-1">
                              <ArrowUp size={16} />
                              {new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                              }).format(eventRoom.newPrice)}
                            </span>
                          </div>
                        ))}
                      {event.type === "BookingClosed" &&
                        event.rooms.map((eventRoom) => (
                          <div key={eventRoom.id} className="flex gap-4">
                            <span className="font-medium">
                              {eventRoom.name}
                            </span>
                            <span className="text-[15px] font-medium w-max flex items-center gap-1">
                              <DoorClosed size={16} />
                            </span>
                          </div>
                        ))}
                    </div>
                    <DeleteEventForm eventId={event.id} />
                  </div>
                </HoverCardContent>
              </HoverCard>
              <Separator className="bg-border/90" />

              <Badge
                className="w-max flex gap-2 items-center"
                variant={"outline"}
              >
                <CalendarRange className="w-4 h-4" />
                <span>
                  Start Date: {format(new Date(event.startDate), "dd MMM yyyy")}{" "}
                </span>
              </Badge>
              <Badge
                className="w-max flex gap-2 items-center"
                variant={"outline"}
              >
                <CalendarRange className="w-4 h-4" />
                <span>
                  End Date: {format(new Date(event.endDate), "dd MMM yyyy")}{" "}
                </span>
              </Badge>
              <Badge
                className="w-max flex gap-2 items-center"
                variant="secondary"
              >
                <DoorOpen className="w-4 h-4" />
                <span>Rooms Applicable: {event.rooms.length}</span>
              </Badge>
              <Badge
                className="w-max flex gap-1 items-center"
                variant="secondary"
              >
                <Avatar className="h-max w-max border">
                  <AvatarImage
                    className="h-4 w-4"
                    src={event.author.profileImg}
                    alt="@username"
                  />
                  <AvatarFallback>{`${event.author.firstName?.[0]?.toUpperCase()}${event.author.lastName?.[0]?.toUpperCase()}`}</AvatarFallback>{" "}
                </Avatar>
                {event.author.firstName + " " + event.author.lastName}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListingEventPage;
