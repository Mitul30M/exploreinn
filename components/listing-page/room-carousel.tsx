// "use client";
import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Badge } from "../ui/badge";
import {
  AirVentIcon,
  BedDouble,
  Blinds,
  Gift,
  Ratio,
  Users,
  Wifi,
} from "lucide-react";
import { Extras } from "./add-ons-radio-group";
import BookRoomBtn from "./book-room-btn";
import { Room } from "@prisma/client";

export function RoomTypesCarousel({
  rooms,
  className,
  ...props
}: {
  rooms: Room[];
  className?: string;
}) {
  // const plugin = React.useRef(
  //   Autoplay({ delay: 1000, stopOnInteraction: false })
  // );

  return (
    <Carousel
      // plugins={[plugin.current]}
      className={className}
      {...props}
      // onMouseEnter={plugin.current.stop}
      //   onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="w-full">
        {rooms.map(async (room, index) => {
          return (
            <CarouselItem
              key={room.id}
              className="max-w-[400px]  p-4 border-border/90 border-[1px] first:ms-4 rounded-md"
            >
              {/* room images */}
              <Carousel
                className="!w-full border-border/90 border-[1px] rounded-sm relative mb-4"
                // plugins={[plugin.current]}
              >
                {room.tag.length && (
                  <Badge className="absolute top-4 right-4 text-sm font-medium z-20">
                    {room.tag}
                  </Badge>
                )}
                <CarouselContent className="">
                  {room.images.map((_, index) => (
                    <CarouselItem key={_ + index} className="w-full !h-[300px]">
                      <div className=" w-full !h-full flex items-center justify-center bg-muted">
                        {/* {index + 1} */}
                        <Image
                          src={_}
                          alt="image"
                          width={400}
                          height={400}
                          className="!w-full !h-full object-cover rounded"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
              {/* room name */}
              <h1 className="text-lg font-semibold tracking-tight ">
                {room.name}
              </h1>
              {/* room features */}
              <div className="flex flex-col gap-3 w-full py-4 my-4 border-border/90 border-y-[1px]">
                <h2 className="text-md font-semibold tracking-tight mb-2">
                  Room Features
                </h2>
                {/* room bed type */}
                <p className="text-sm text-card-foreground font-medium flex items-center gap-2">
                  <BedDouble className="w-5 h-5 text-primary" />
                  {room.beds.count} {room.beds.type}
                </p>
                {/* perks */}
                {room.perks.length &&
                  room.perks.map((perk, index) => (
                    <p
                      className="text-sm text-card-foreground font-medium flex items-center gap-2"
                      key={index}
                    >
                      <Gift className="w-5 h-5 text-primary" />
                      {perk}
                    </p>
                  ))}
                {/* room area */}
                <p className="text-sm text-card-foreground font-medium flex items-center gap-2">
                  <Ratio className="w-5 h-5 text-primary" />
                  {room.area} sq.ft area
                </p>
                {/* max occupancy */}
                <p className="text-sm text-card-foreground font-medium flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Best for {room.maxOccupancy} Guests
                </p>
                {/* wifi & air conditioning */}
                {room.isWifiAvailable && (
                  <p className="text-sm text-card-foreground font-medium flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-primary" />
                    Room provides Wifi Connectivity
                  </p>
                )}
                {room.isAirConditioned && (
                  <p className="text-sm text-card-foreground font-medium flex items-center gap-2">
                    <AirVentIcon className="w-5 h-5 text-primary" />
                    Room is Air Conditioned
                  </p>
                )}
                {/* room view */}
                {room.hasCityView && (
                  <p className="text-sm text-card-foreground font-medium flex items-center gap-2">
                    <Blinds className="w-5 h-5 text-primary" />
                    Room has City View
                  </p>
                )}
                {room.hasSeaView && (
                  <p className="text-sm text-card-foreground font-medium flex items-center gap-2">
                    <Blinds className="w-5 h-5 text-primary" />
                    Room has Ocean/Sea View
                  </p>
                )}
              </div>
              {/* extras */}
              <div className="flex flex-col gap-3 w-full my-4 pb-4 border-border/90 border-b-[1px]">
                <h2 className="text-md font-semibold tracking-tight mb-2">
                  Add-Ons
                </h2>
                {/* store the selected add on in the redux store and then add it to the booking  */}
                <Extras
                  roomExtras={room.extras}
                  // onSelect={(selected) => {
                  //   console.log("Selected extra:", selected);
                  // }}
                />
              </div>
              {/* pricing */}
              <div className="flex w-full justify-end items-center pb-4 border-border/90 border-b-[1px] mb-4">
                <div className=" text-[16px] font-semibold w-max flex items-center gap-3">
                  {room.basePrice > room.price && (
                    <>
                      <Badge>
                        {(100 - (room.price / room.basePrice) * 100).toFixed(1)}
                        % Off
                      </Badge>
                      <span className="text-accent-foreground/70 text-sm line-through">
                        ${room.basePrice.toFixed(2)}
                      </span>
                    </>
                  )}
                  ${room.price.toFixed(2)}
                </div>
                <span className="text-sm text-accent-foreground/80  font-medium">
                  /night
                </span>
              </div>
              {/* book room btn */}
              <BookRoomBtn room={room} />
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}
