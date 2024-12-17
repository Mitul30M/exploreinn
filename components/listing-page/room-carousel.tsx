import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { ListingRoom } from "@/lib/utils/seed/listing/listings";
import { Badge } from "../ui/badge";
import { Bed, BedDouble, Blinds, Gift, Ratio, Users } from "lucide-react";
import { AddOnsRadioGroup } from "./add-ons-radio-group";
import { convertCurrency } from "@/lib/utils/currency/currency-convertor";
import BookRoomBtn from "./book-room-btn";

export async function RoomTypesCarousel({
  rooms,
  className,
  ...props
}: {
  rooms: ListingRoom[];
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
      <CarouselContent className="w-full gap-8">
        {rooms.map(async (room, index) => {
          const formattedAddOns = await Promise.all(
            room.extras.map(async (extra) => ({
              ...extra,
              cost: (await convertCurrency({
                amount: extra.cost,
                toCurrency: "INR",
                fromCurrency: "USD",
                returnNumber: true,
              })) as number,
            }))
          );
          return (
            <CarouselItem
              key={index}
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
                    <CarouselItem key={index+10} className="w-full !h-[300px]">
                      <div className=" w-full !h-full flex items-center justify-center bg-muted">
                        {index + 1}
                        {/* <Image src={_} alt="image" width={600} height={600} className="!w-full !h-full object-cover" /> */}
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
                      key={index}
                      className="text-sm text-card-foreground font-medium flex items-center gap-2"
                    >
                      <Gift className="w-5 h-5 text-primary" />
                      {perk.description}
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
                {/* room view */}
                {room.views.length &&
                  room.views.map((views, index) => (
                    <p
                      key={index}
                      className="text-sm text-card-foreground font-medium flex items-center gap-2"
                    >
                      <Blinds className="w-5 h-5 text-primary" />
                      {views.description}
                    </p>
                  ))}
              </div>
              {/* extras */}
              <div className="flex flex-col gap-3 w-full my-4 pb-4 border-border/90 border-b-[1px]">
                <h2 className="text-md font-semibold tracking-tight mb-2">
                  Add-Ons
                </h2>
                {/* store the selected add on in the redux store and then add it to the booking  */}
                <AddOnsRadioGroup
                  extras={formattedAddOns}
                  // onSelect={(selected) => {
                  //   console.log("Selected extra:", selected);
                  // }}
                />
              </div>
              {/* priciing */}
              <div className="flex w-full justify-end items-center pb-4 border-border/90 border-b-[1px] mb-4">
                <div className=" text-[16px] font-semibold w-max flex items-center gap-3">
                  <Badge>
                    {(100 - (room.price / room.basePrice) * 100).toFixed(1)}%
                    Off
                  </Badge>
                  <span className="text-accent-foreground/70 text-sm line-through">
                    {await convertCurrency({
                      amount: room.basePrice,
                      toCurrency: "INR",
                      fromCurrency: "USD",
                    })}
                  </span>
                  {await convertCurrency({
                    amount: room.price,
                    toCurrency: "INR",
                    fromCurrency: "USD",
                  })}
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
