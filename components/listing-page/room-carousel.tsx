"use client";
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

export function RoomTypesCarousel({
  rooms,
  className,
  ...props
}: {
  rooms: ListingRoom[];
  className?: string;
}) {
//   const plugin = React.useRef(
//     Autoplay({ delay: 6000, stopOnInteraction: true })
//   );

  return (
    <Carousel
    //   plugins={[plugin.current]}
      className={className}
      {...props}
      //   onMouseEnter={plugin.current.stop}
      //   onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="w-full gap-4">
        {rooms.map((_, index) => (
          <CarouselItem
            key={index}
            className="max-w-[400px] h-[800px] bg-muted flex items-center justify-center rounded"
          >
            {index + 1}
            {/* <Image src={_} alt="image" width={600} height={600} className="!w-full !h-full object-cover" /> */}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
