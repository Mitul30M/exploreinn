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

export function ImageCarousel({
  images,
  className,
  ...props
}: {
  images: string[];
  className?: string;
}) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className={className}
      {...props}
      // onMouseEnter={plugin.current.stop}
      //   onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="">
        {images.map((_, index) => (
          <CarouselItem key={_} className="w-full h-full">
            <div className=" w-full bg-muted  h-[300px]  md:h-[400px]   lg:h-[450px]  xl:h-[500px] flex items-center justify-center">
              <Image
                src={_}
                alt="image"
                width={600}
                height={600}
                className="!w-full !h-full object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}
