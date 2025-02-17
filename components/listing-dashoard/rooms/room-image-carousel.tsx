"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import RoomImageDialogContent from "./room-image-dialog";

interface RoomImageCarouselProps {
  roomId:string;
  roomName: string;
  images: string[];
  coverImg: string;
}

export default function RoomImageCarousel({
  roomId,
  roomName,
  images,
  coverImg
}: RoomImageCarouselProps) {
  return (
    <div className="rounded-md border-border/90 border-[1px] p-4 space-y-4 w-full !h-max mb-4 break-inside-avoid">
      <div className="space-y-2">
        <h1 className="text-md flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight">
          {roomName} Images
        </h1>
        <p className="text-muted-foreground text-sm">
          Update and/or Add New Images for the room.
        </p>
      </div>

      <Separator className="border-border/90" />

      <Carousel className="w-full max-w-xs mx-auto ">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Image
                  src={image}
                  alt={`Room image ${index + 1}`}
                  width={300}
                  height={200}
                  className="rounded-md object-cover w-full h-[200px]"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />{" "}
      </Carousel>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full ">
            Update Room Images
          </Button>
        </DialogTrigger>
        {/* Dialog content would go here */}
        <RoomImageDialogContent coverImg={coverImg} images={images} roomId={roomId} />
      </Dialog>
    </div>
  );
}
