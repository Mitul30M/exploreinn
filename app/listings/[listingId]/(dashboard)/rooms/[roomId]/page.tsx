import RoomImageCarousel from "@/components/listing-dashoard/rooms/room-image-carousel";
import RoomPricingSwitch from "@/components/listing-dashoard/rooms/room-swtich-controls";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getRoomsBookingStatusOverview } from "@/lib/actions/bookings/bookings";
import { getRoomById } from "@/lib/actions/rooms/rooms";
import {
  bookingStatus,
  BookingStatusConfig,
} from "@/lib/utils/types/status/booking-status";
import { format } from "date-fns";
import { BedDouble, ChevronLeft, DoorClosed, DoorOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const RoomInfoPage = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: SearchParams;
}) => {
  const roomId = (await params).roomId;
  const room = await getRoomById(roomId);

  if (!room) {
    return notFound();
  }
  const roomBookingsOverview = await getRoomsBookingStatusOverview(roomId);
  return (
    <section className="w-full space-y-4 mb-4 pb-4 border-border/90 border-b-[1px]">
      <div className="text-md  flex justify-start rounded-none items-center gap-4  w-full px-4 py-2 border-y-[1px] border-border/90 text-foreground/90">
        <Link
          href={`/listings/${room.listingId}/rooms`}
          className="flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight hover:text-primary hover:underline hover:underline-offset-2"
        >
          <ChevronLeft className="text-primary" size={22} />
          {room?.name}
        </Link>
      </div>

      <div className="!w-full px-4 mb-0 mx-auto  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
        <div className="rounded-md border-border/90 border-[1px] p-4 space-y-4 w-full !h-max ">
          <div className="space-y-2">
            <h1 className="text-md  flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight text-primary">
              <BedDouble size={20} className="text-primary" /> {room.name}
            </h1>
            <p className="text-muted-foreground text-sm">Room ID: {room.id}</p>
          </div>

          <Separator className="border-border/90" />
          <Image
            alt={room.name}
            src={room.coverImage}
            width={250}
            height={250}
            className="aspect-video w-full object-cover rounded-md"
          />
          <Separator className="border-border/90" />

          {Object.entries(roomBookingsOverview).map(([key, value]) => {
            const status: BookingStatusConfig =
              bookingStatus[key as keyof typeof bookingStatus];
            if (status) {
              return (
                <div className="flex justify-between items-center" key={key}>
                  <Badge variant="outline" className={status.className}>
                    {status.icon && <status.icon size={16} />} {status.label}
                  </Badge>
                  <Badge variant="outline" className={status.className}>
                    {value}
                  </Badge>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* current rate of the room */}
        <Card
          className={
            "rounded-md border-border/90 border-[1px] shadow-none w-full h-max space-y-2 !p-0"
          }
        >
          <CardHeader className="p-4 m-0">
            <CardTitle>Current Room Rate per night</CardTitle>
            <CardDescription>
              {format(new Date(), "dd MMMM yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 py-0 text-3xl font-semibold text-primary m-0">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(room.price)}
          </CardContent>
          <CardFooter className="p-4 m-0 flex flex-col gap-4">
            <RoomPricingSwitch
              isAcceptingBookings={room.isAvailable}
              roomId={roomId}
              isDynamicallyPriced={room.isDynamicallyPriced}
            />
            <Separator className="border-border/90" />
            <div className="flex w-full gap-2 items-center p-1 border-border/90 border-[1px] rounded-md">
              <p className="font-medium text-sm w-max flex gap-1 items-center text-primary">
                <DoorOpen className="" size={18} />
                {room.totalRoomsAllocated - room.currentlyAvailableRooms}
              </p>
              <Progress
                value={room.totalRoomsAllocated - room.currentlyAvailableRooms}
                max={room.totalRoomsAllocated}
                className="h-[6px] flex-1"
              />
              <p className="font-medium text-sm w-max flex gap-1 items-center">
                <DoorClosed className="" size={18} /> {room.totalRoomsAllocated}
              </p>
            </div>
          </CardFooter>
        </Card>

        <RoomImageCarousel
          roomName={room.name}
          images={room.images}
          coverImg={room.coverImage}
          roomId={roomId}
        />
      </div>
    </section>
  );
};

export default RoomInfoPage;
