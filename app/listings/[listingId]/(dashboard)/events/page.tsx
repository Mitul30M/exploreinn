import { BookingClosedEventModal } from "@/components/events/newBookingClosedEventModal";
import { NewHighDemandEventModal } from "@/components/events/newHighDemandEventModal";
import { NewPriceChangeEventModal } from "@/components/events/newPriceChangeModal";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { getListingById } from "@/lib/actions/listings/listings";
import { currentUser } from "@clerk/nextjs/server";
import { CalendarRange } from "lucide-react";
import { notFound } from "next/navigation";

const ListingEventPage = async ({
  params,
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
          <Calendar
            className="border-border/90 border rounded-md"
            mode="single"
          />
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
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-md bg-primary" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListingEventPage;
