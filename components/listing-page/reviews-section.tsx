"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpDown,
  BadgeDollarSign,
  ChevronsUp,
  DoorOpen,
  HandCoins,
  MapPinCheckInside,
  MessageSquareText,
  Sparkles,
  Star,
  ThumbsUp,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Label } from "../ui/label";
import Autoplay from "embla-carousel-autoplay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const ListingReviewsSection = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );
  return (
    <div className="w-full space-y-4 px-8 ">
      <div className="flex items-center gap-4">
        <Button
          variant={"outline"}
          size={"sm"}
          className="rounded-full shadow-none"
        >
          View All
        </Button>
        {/* review sort */}
        <Select>
          <SelectTrigger
            id="sort-by"
            className="w-max flex justify-start gap-2 shadow-none"
          >
            <ArrowUpDown size={18} />
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="recent">Recent Reviews</SelectItem>
              <SelectItem value="top">Top Rated Reviews</SelectItem>
              <SelectItem value="low">Lowest Rated Reviews</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {/* reviews  */}
      <Carousel className="cursor-grab w-full" plugins={[plugin.current]}>
        <CarouselContent className="gap-4">
          <CarouselItem className="basis-auto">
            <div className="space-y-4 p-4 w-[350px] h-[214px] rounded-md border-border/90 border-[1px] overflow-x-hidden">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-sm text-primary bg-primary/10 dark:bg-muted">
                      MM
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm">Mitul Mungase</p>
                </div>
                <p className="text-[12px] text-muted-foreground">1 day ago</p>
              </div>
              {/* star rating */}
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                Rated{" "}
                <span className="font-semibold text-[15px] text-foreground flex gap-1 items-center space-x-1">
                  5 <Star strokeWidth={2.5} className="w-4 h-4 text-primary" />
                </span>
              </p>
              {/* review */}
              <p className="line-clamp-3 text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Necessitatibus distinctio facilis consectetur rem quis odit
                numquam atque. Voluptatum, perferendis accusamus.
              </p>
              {/* individual ratings */}
              <Carousel className="w-max">
                <CarouselContent className="-ml-1">
                  <CarouselItem className="pl-1 basis-auto">
                    <Badge
                      variant={"secondary"}
                      className="flex items-center gap-1 rounded w-max"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      9.8
                    </Badge>
                  </CarouselItem>
                  <CarouselItem className="pl-1 basis-auto">
                    <Badge
                      variant={"secondary"}
                      className="flex items-center gap-1 rounded w-max"
                    >
                      <HandCoins className="w-4 h-4" />
                      9.8
                    </Badge>
                  </CarouselItem>
                  <CarouselItem className="pl-1 basis-auto">
                    <Badge
                      variant={"secondary"}
                      className="flex items-center gap-1 rounded w-max"
                    >
                      <DoorOpen className="w-4 h-4" />
                      9.8
                    </Badge>
                  </CarouselItem>
                  <CarouselItem className="pl-1 basis-auto">
                    <Badge
                      variant={"secondary"}
                      className="flex items-center gap-1 rounded w-max"
                    >
                      <Sparkles className="w-4 h-4" />
                      9.8
                    </Badge>
                  </CarouselItem>
                  <CarouselItem className="pl-1 basis-auto">
                    <Badge
                      variant={"secondary"}
                      className="flex items-center gap-1 rounded w-max"
                    >
                      <MessageSquareText className="w-4 h-4" />
                      9.8
                    </Badge>
                  </CarouselItem>
                  <CarouselItem className="pl-1 basis-auto">
                    <Badge
                      variant={"secondary"}
                      className="flex items-center gap-1 rounded w-max"
                    >
                      <MapPinCheckInside className="w-4 h-4" />
                      9.8
                    </Badge>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="hidden" />
                <CarouselNext className="hidden" />
              </Carousel>
            </div>
          </CarouselItem>
          <CarouselItem className="basis-auto">
            <div className="space-y-4 p-4 w-[350px] h-[214px] rounded-md border-border/90 border-[1px] overflow-x-hidden">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-sm text-primary bg-primary/10 dark:bg-muted">
                      MM
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm">Mitul Mungase</p>
                </div>
                <p className="text-[12px] text-muted-foreground">1 day ago</p>
              </div>
              {/* star rating */}
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                Rated{" "}
                <span className="font-semibold text-[15px] text-foreground flex gap-1 items-center space-x-1">
                  5 <Star strokeWidth={2.5} className="w-4 h-4 text-primary" />
                </span>
              </p>
              {/* review */}
              <p className="line-clamp-3 text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Necessitatibus distinctio facilis consectetur rem quis odit
                numquam atque. Voluptatum, perferendis accusamus.
              </p>
              {/* individual ratings */}
              <Carousel className="w-max">
                <CarouselContent className="-ml-1">
                  <CarouselItem className="pl-1 basis-auto">
                    <Badge
                      variant={"secondary"}
                      className="flex items-center gap-1 rounded w-max"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      9.8
                    </Badge>
                  </CarouselItem>
                  <CarouselItem className="pl-1 basis-auto">
                    <Badge
                      variant={"secondary"}
                      className="flex items-center gap-1 rounded w-max"
                    >
                      <HandCoins className="w-4 h-4" />
                      9.8
                    </Badge>
                  </CarouselItem>
                  <CarouselItem className="pl-1 basis-auto">
                    <Badge
                      variant={"secondary"}
                      className="flex items-center gap-1 rounded w-max"
                    >
                      <DoorOpen className="w-4 h-4" />
                      9.8
                    </Badge>
                  </CarouselItem>
                  <CarouselItem className="pl-1 basis-auto">
                    <Badge
                      variant={"secondary"}
                      className="flex items-center gap-1 rounded w-max"
                    >
                      <Sparkles className="w-4 h-4" />
                      9.8
                    </Badge>
                  </CarouselItem>
                  <CarouselItem className="pl-1 basis-auto">
                    <Badge
                      variant={"secondary"}
                      className="flex items-center gap-1 rounded w-max"
                    >
                      <MessageSquareText className="w-4 h-4" />
                      9.8
                    </Badge>
                  </CarouselItem>
                  <CarouselItem className="pl-1 basis-auto">
                    <Badge
                      variant={"secondary"}
                      className="flex items-center gap-1 rounded w-max"
                    >
                      <MapPinCheckInside className="w-4 h-4" />
                      9.8
                    </Badge>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="hidden" />
                <CarouselNext className="hidden" />
              </Carousel>
            </div>
          </CarouselItem>
          <CarouselItem className="basis-auto">
            <div className="space-y-4 p-4 w-[350px] h-[214px] rounded-md border-border/90 border-[1px] overflow-x-hidden">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-sm text-primary bg-primary/10 dark:bg-muted">
                      MM
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm">Mitul Mungase</p>
                </div>
                <p className="text-[12px] text-muted-foreground">1 day ago</p>
              </div>
              {/* star rating */}
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                Rated{" "}
                <span className="font-semibold text-[15px] text-foreground flex gap-1 items-center space-x-1">
                  5 <Star strokeWidth={2.5} className="w-4 h-4 text-primary" />
                </span>
              </p>
              {/* review */}
              <p className="line-clamp-3 text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Necessitatibus distinctio facilis consectetur rem quis odit
                numquam atque. Voluptatum, perferendis accusamus.
              </p>
              {/* individual ratings */}
              <Carousel className="w-max">
                <CarouselContent className="-ml-1">
                  <CarouselItem className="pl-1 basis-auto">
                    <Badge
                      variant={"secondary"}
                      className="flex items-center gap-1 rounded w-max"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      9.8
                    </Badge>
                  </CarouselItem>
                  <CarouselItem className="pl-1 basis-auto">
                    <Badge
                      variant={"secondary"}
                      className="flex items-center gap-1 rounded w-max"
                    >
                      <HandCoins className="w-4 h-4" />
                      9.8
                    </Badge>
                  </CarouselItem>
                  <CarouselItem className="pl-1 basis-auto">
                    <Badge
                      variant={"secondary"}
                      className="flex items-center gap-1 rounded w-max"
                    >
                      <DoorOpen className="w-4 h-4" />
                      9.8
                    </Badge>
                  </CarouselItem>
                  <CarouselItem className="pl-1 basis-auto">
                    <Badge
                      variant={"secondary"}
                      className="flex items-center gap-1 rounded w-max"
                    >
                      <Sparkles className="w-4 h-4" />
                      9.8
                    </Badge>
                  </CarouselItem>
                  <CarouselItem className="pl-1 basis-auto">
                    <Badge
                      variant={"secondary"}
                      className="flex items-center gap-1 rounded w-max"
                    >
                      <MessageSquareText className="w-4 h-4" />
                      9.8
                    </Badge>
                  </CarouselItem>
                  <CarouselItem className="pl-1 basis-auto">
                    <Badge
                      variant={"secondary"}
                      className="flex items-center gap-1 rounded w-max"
                    >
                      <MapPinCheckInside className="w-4 h-4" />
                      9.8
                    </Badge>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="hidden" />
                <CarouselNext className="hidden" />
              </Carousel>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>{" "}
    </div>
  );
};

export default ListingReviewsSection;
