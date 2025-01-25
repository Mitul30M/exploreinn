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
import { Review } from "@prisma/client";

interface ListingReviewsSectionProps {
  reviews: {
    author: {
      firstName: string;
      lastName: string;
      profileImg: string;
    };
    stars: number;
    cleanliness: number;
    comfort: number;
    communication: number;
    checkIn: number;
    valueForMoney: number;
    location: number;
    overallRating: number;
    createdAt: Date;
    updatedAt: Date;
    id: string;
    content: string;
    authorId: string;
  }[];
}
const ListingReviewsSection = ({ reviews }: ListingReviewsSectionProps) => {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <div className="w-full space-y-4 px-4 ">
      <div className="flex items-center gap-4">
        <Button
          variant={"outline"}
          size={"sm"}
          className="rounded shadow-none"
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
          {reviews.map((review, idx) => (
            <CarouselItem key={review.authorId} className="basis-auto">
              <div className="space-y-4 p-4 w-[350px] h-[214px] rounded-md border-border/90 border-[1px] overflow-x-hidden">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border-2">
                      <AvatarImage src={review.author.profileImg} />
                      <AvatarFallback className="text-sm text-primary bg-primary/10 dark:bg-muted">
                        {review.author.firstName[0]}
                        {review.author.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm">
                      {review.author.firstName} {review.author.lastName}
                    </p>
                  </div>
                  <p className="text-[12px] text-muted-foreground">1 day ago</p>
                </div>
                {/* star rating */}
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  Rated{" "}
                  <span className="font-semibold text-[15px] text-foreground flex gap-1 items-center space-x-1">
                    {review.stars}{" "}
                    <Star strokeWidth={2.5} className="w-4 h-4 text-primary" />
                  </span>
                </p>
                {/* review */}
                <p className="line-clamp-3 text-sm">{review.content}</p>
                {/* individual ratings */}
                <Carousel className="w-max">
                  <CarouselContent className="-ml-1">
                    <CarouselItem className="pl-1 basis-auto">
                      <Badge
                        variant={"secondary"}
                        className="flex items-center gap-1 rounded w-max"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        {review.comfort}
                      </Badge>
                    </CarouselItem>
                    <CarouselItem className="pl-1 basis-auto">
                      <Badge
                        variant={"secondary"}
                        className="flex items-center gap-1 rounded w-max"
                      >
                        <HandCoins className="w-4 h-4" />
                        {review.valueForMoney}
                      </Badge>
                    </CarouselItem>
                    <CarouselItem className="pl-1 basis-auto">
                      <Badge
                        variant={"secondary"}
                        className="flex items-center gap-1 rounded w-max"
                      >
                        <DoorOpen className="w-4 h-4" />
                        {review.checkIn}
                      </Badge>
                    </CarouselItem>
                    <CarouselItem className="pl-1 basis-auto">
                      <Badge
                        variant={"secondary"}
                        className="flex items-center gap-1 rounded w-max"
                      >
                        <Sparkles className="w-4 h-4" />
                        {review.cleanliness}
                      </Badge>
                    </CarouselItem>
                    <CarouselItem className="pl-1 basis-auto">
                      <Badge
                        variant={"secondary"}
                        className="flex items-center gap-1 rounded w-max"
                      >
                        <MessageSquareText className="w-4 h-4" />
                        {review.communication}
                      </Badge>
                    </CarouselItem>
                    <CarouselItem className="pl-1 basis-auto">
                      <Badge
                        variant={"secondary"}
                        className="flex items-center gap-1 rounded w-max"
                      >
                        <MapPinCheckInside className="w-4 h-4" />
                        {review.location}
                      </Badge>
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious className="hidden" />
                  <CarouselNext className="hidden" />
                </Carousel>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>{" "}
    </div>
  );
};

export default ListingReviewsSection;
