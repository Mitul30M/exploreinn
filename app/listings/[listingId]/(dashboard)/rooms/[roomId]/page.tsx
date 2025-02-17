import RoomImageCarousel from "@/components/listing-dashoard/rooms/room-image-carousel";
import { Separator } from "@/components/ui/separator";
import { getRoomById } from "@/lib/actions/rooms/rooms";
import { BedDouble, ChevronLeft } from "lucide-react";
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

      <div className="!w-max px-4 mx-auto  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 justify-items-center">
        <div className="rounded-md border-border/90 border-[1px] p-4 space-y-4 w-full !h-max mb-4">
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
        </div>

        <RoomImageCarousel roomName={room.name} images={room.images} coverImg={room.coverImage} roomId={roomId} />
      </div>
    </section>
  );
};

export default RoomInfoPage;
