"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpDown,
  DoorOpen,
  HandCoins,
  MapPinCheckInside,
  MessageCircleHeart,
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
import Autoplay from "embla-carousel-autoplay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";
import { NewReviewDialogForm } from "./new-review-dialog";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "../ui/scroll-area";
import { useRouter } from "next/navigation";

interface ListingReviewsSectionProps {
  reviews: TReviews[];
  listingId: string;
}
const ListingReviewsSection = ({
  reviews,
  listingId,
}: ListingReviewsSectionProps) => {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );
  const { replace } = useRouter();
  
  return (
    <div className="w-full space-y-4 px-4 ">
      <div className="flex items-center gap-4">
        <NewReviewDialogForm listingId={listingId} />
        {/* review sort */}
        <Select
          onValueChange={(value) => {
            const url = new URL(window.location.href);
            url.searchParams.set("reviewSort", value);
            replace(url.pathname + url.search, { scroll: false });
          }}
        >
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
        </Select>{" "}
      </div>
      {/* reviews  */}
      {reviews.length > 0 ? (
        <Carousel className="cursor-grab w-full" plugins={[plugin.current]}>
          <CarouselContent className="gap-4">
            {reviews.map((review) => (
              <CarouselItem key={review.id} className="basis-auto">
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
                    <p className="text-[12px] text-muted-foreground">
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {/* star rating */}
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    Rated{" "}
                    <span className="font-semibold text-[15px] text-foreground flex gap-1 items-center space-x-1">
                      {review.stars}{" "}
                      <Star
                        strokeWidth={2.5}
                        className="w-4 h-4 text-primary"
                      />
                    </span>
                  </p>
                  {/* review */}
                  <p className="text-sm">{review.content}</p>
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
        </Carousel>
      ) : (
        <div className="flex flex-col items-center m-4 mx-0 first:justify-center p-4 h-max rounded border-border/90 border-[1px] gap-2 py-8">
          <p className="">
            <MessageCircleHeart
              size={40}
              className="text-primary"
              strokeWidth={1.6}
            />
          </p>
          <p className="font-semibold text-primary">
            No Reviews for this listing yet. Be the first to review
          </p>
        </div>
      )}
    </div>
  );
};

export default ListingReviewsSection;
