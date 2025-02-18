import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { getListingById } from "@/lib/actions/listings/listings";
import { getListingRooms } from "@/lib/actions/rooms/rooms";
import { BedDouble, Copy, DoorOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const ListingRoomsPage = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: SearchParams;
}) => {
  const listing = await getListingById((await params).listingId);
  if (!listing) {
    return notFound();
  }
  const rooms = listing.rooms;

  return (
    <section className="w-full space-y-4 border-border/90 border-b-[1px]">
      {/* Personal Info */}
      <div id="hotel-owner" className="space-y-4">
        <h1 className="text-md  flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight w-full px-4 py-2 border-y-[1px] border-border/90 text-foreground/90">
          <BedDouble size={22} className="text-primary" />
          {listing.name}'s Rooms
        </h1>
        <div className="w-full px-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {/* new room dialog card */}
          <section className="w-full rounded-md border-border/90 border-[1px] p-4   h-max flex flex-col gap-4 justify-center items-center">
            <Link
              href={`/listings/${listing.id}/rooms/new`}
              className="w-full rounded-md border-border/90 border-[1px] p-4   h-max flex flex-col gap-4 justify-center items-center"
            >
              <DoorOpen size={60} className="text-primary" />

              <h1 className="text-md  text-center font-semibold tracking-tight text-primary">
                Add New Room
              </h1>
            </Link>
          </section>

          {/* rooms cards */}
          {rooms.map((room) => (
            <Link
              href={`/listings/${listing.id}/rooms/${room.id}`}
              key={room.id}
            >
              <section className="rounded-md border-border/90 border-[1px] p-4 space-y-4  h-max mb-4 ">
                <h1 className="text-md  flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight text-primary">
                  {room.name}
                </h1>
                <Separator className="border-border/90" />
                <p className="text-[15px]">{room.tag}</p>

                <Image
                  alt={room.name}
                  src={room.coverImage}
                  width={250}
                  height={350}
                  className="aspect-video w-full object-cover rounded-md"
                />
                <Separator className="border-border/90" />

                {room.isAvailable ? (
                  <div className="text-sm  font-medium text-accent-foreground flex  !w-full items-center gap-3">
                    <span className="w-5 h-3  rounded-full bg-primary animate-pulse "></span>
                    <div>
                      Accepting Bookings at{" "}
                      <span className="font-semibold text-primary">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(room.price)}
                      </span>{" "}
                      per room per night
                    </div>
                  </div>
                ) : (
                  <div className="text-sm  font-medium text-muted-foreground flex  !w-full items-center gap-3">
                    <div>
                      Not Accepting Bookings at{" "}
                      <span className="font-semibold text-primary">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(room.price)}
                      </span>{" "}
                      per room per night
                    </div>
                  </div>
                )}
                <Separator className="border-border/90" />

                <div className="flex items-center space-x-3">
                  <Switch
                    id="is-dynamically-priced"
                    checked={room.isDynamicallyPriced}
                    disabled
                  />
                  <Label className="text-sm  font-medium">
                    Is Dynamically Priced?
                  </Label>
                </div>

                <Separator className="border-border/90" />
                {/* available rooms */}
                <p className="text-sm  font-medium">
                  Available Rooms:{" "}
                  <span className="font-semibold text-primary">
                    {room.currentlyAvailableRooms}/{room.totalRoomsAllocated}
                  </span>
                </p>
              </section>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListingRoomsPage;
