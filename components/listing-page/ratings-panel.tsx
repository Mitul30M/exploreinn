import {
  DoorOpen,
  HandCoins,
  MapPinCheckInside,
  MessageSquareText,
  Sparkles,
  ThumbsUp,
} from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Review } from "@prisma/client";
import { getRatingLabel } from "@/lib/utils/listing/util-functions";

interface RatingsPanelProps {
  // listing: Listing;
  reviews: Review[];
  overallRating: number;
  exploreinnGrade: string;
}

const RatingsPanel = ({
  reviews,
  overallRating,
  exploreinnGrade,
}: RatingsPanelProps) => {
  return (
    <div className="w-full flex items-center px-4 ">
      {/* individual ratings carousel */}
      <Carousel className="cursor-grab overflow-hidden ">
        <CarouselContent className="">
          <CarouselItem className="max-w-[350px] mr-4">
            <div className="w-full h-max">
              <p className="text-md text-foreground/80 mb-4">
                Overall Listing Rating
              </p>

              <div className="w-[350px]  rounded-md border-border/90 border-[1px] p-4 space-y-8">
                {/* only if total reviews are more than 150 and overall rating is 8.5 and above */}
                {reviews.length > 150 && overallRating > 8.5 ? (
                  <Badge
                    className="flex items-center gap-1 rounded w-max"
                    // variant={"secondary"}
                  >
                    <Sparkles className="w-4 h-4" />
                    Guest Favorite
                  </Badge>
                ) : (
                  <Badge
                    className="flex items-center gap-1 rounded w-max"
                    variant={"secondary"}
                  >
                    {/* <ThumbsUp className="w-4 h-4" /> */}
                    Overall
                  </Badge>
                )}
                <p className="flex w-full justify-between items-center">
                  <span className="text-xl font-semibold text-card-foreground">
                    {exploreinnGrade}
                  </span>
                  <span className="text-3xl font-semibold text-card-foreground">
                    {overallRating.toFixed(1)}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Rated by {reviews.length} guests
                </p>
              </div>
            </div>
          </CarouselItem>
          {/* Comfort Rating */}
          <CarouselItem className="max-w-[350px]">
            <div className="w-full h-max">
              <p className="text-md text-foreground/80 mb-4 w-max">
                Comfort Rating
              </p>
              <div className="rounded-md border-border/90 border-[1px] p-4 space-y-8">
                {/* only if total reviews are more than 150 and overall rating is 8.5 and above */}
                <Badge
                  className="flex items-center gap-1 rounded w-max"
                  variant={"secondary"}
                >
                  <ThumbsUp className="w-4 h-4" />
                  Comfort
                </Badge>
                <p className="flex w-full justify-between items-center">
                  <span className="text-xl font-semibold text-card-foreground">
                    {getRatingLabel(
                      reviews.reduce((acc, review) => acc + review.comfort, 0) /
                        reviews.length
                    )}{" "}
                  </span>
                  <span className="text-3xl font-semibold text-card-foreground">
                    {reviews?.length > 0
                      ? (
                          reviews.reduce(
                            (acc, review) => acc + review.comfort,
                            0
                          ) / reviews.length
                        ).toFixed(1)
                      : 0}{" "}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Rated by {reviews.length} guests
                </p>
              </div>
            </div>
          </CarouselItem>
          {/* Value For Money Rating */}
          <CarouselItem className="max-w-[350px]">
            <div className="w-full h-max">
              <p className="text-md text-foreground/80 mb-4 w-max">
                Value For Money Rating
              </p>
              <div className="rounded-md border-border/90 border-[1px] p-4 space-y-8">
                {/* only if total reviews are more than 150 and overall rating is 8.5 and above */}
                <Badge
                  className="flex items-center gap-1 rounded w-max"
                  variant={"secondary"}
                >
                  <HandCoins className="w-4 h-4" />
                  Value For Money
                </Badge>
                <p className="flex w-full justify-between items-center">
                  <span className="text-xl font-semibold text-card-foreground">
                    {getRatingLabel(
                      reviews.reduce(
                        (acc, review) => acc + review.valueForMoney,
                        0
                      ) / reviews.length
                    )}{" "}
                  </span>
                  <span className="text-3xl font-semibold text-card-foreground">
                    {reviews?.length > 0
                      ? (
                          reviews.reduce(
                            (acc, review) => acc + review.valueForMoney,
                            0
                          ) / reviews.length
                        ).toFixed(1)
                      : 0}{" "}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Rated by {reviews.length} guests
                </p>
              </div>
            </div>
          </CarouselItem>
          {/* Check-in Rating */}
          <CarouselItem className="max-w-[350px]">
            <div className="w-full h-max">
              <p className="text-md text-foreground/80 mb-4 w-max">
                Check-in Rating
              </p>
              <div className="rounded-md border-border/90 border-[1px] p-4 space-y-8">
                {/* only if total reviews are more than 150 and overall rating is 8.5 and above */}
                <Badge
                  className="flex items-center gap-1 rounded w-max"
                  variant={"secondary"}
                >
                  <DoorOpen className="w-4 h-4" />
                  Check-in
                </Badge>
                <p className="flex w-full justify-between items-center">
                  <span className="text-xl font-semibold text-card-foreground">
                    {getRatingLabel(
                      reviews.reduce((acc, review) => acc + review.checkIn, 0) /
                        reviews.length
                    )}{" "}
                  </span>
                  <span className="text-3xl font-semibold text-card-foreground">
                    {reviews?.length > 0
                      ? (
                          reviews.reduce(
                            (acc, review) => acc + review.checkIn,
                            0
                          ) / reviews.length
                        ).toFixed(1)
                      : 0}{" "}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Rated by {reviews.length} guests
                </p>
              </div>
            </div>
          </CarouselItem>
          {/* Cleanliness Rating */}
          <CarouselItem className="max-w-[350px]">
            <div className="w-full h-max">
              <p className="text-md text-foreground/80 mb-4 w-max">
                Cleanliness Rating
              </p>
              <div className="rounded-md border-border/90 border-[1px] p-4 space-y-8">
                {/* only if total reviews are more than 150 and overall rating is 8.5 and above */}
                <Badge
                  className="flex items-center gap-1 rounded w-max"
                  variant={"secondary"}
                >
                  <Sparkles className="w-4 h-4" />
                  Cleanliness
                </Badge>
                <p className="flex w-full justify-between items-center">
                  <span className="text-xl font-semibold text-card-foreground">
                    {getRatingLabel(
                      reviews.reduce(
                        (acc, review) => acc + review.cleanliness,
                        0
                      ) / reviews.length
                    )}{" "}
                  </span>
                  <span className="text-3xl font-semibold text-card-foreground">
                    {reviews?.length > 0
                      ? (
                          reviews.reduce(
                            (acc, review) => acc + review.cleanliness,
                            0
                          ) / reviews.length
                        ).toFixed(1)
                      : 0}{" "}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Rated by {reviews.length} guests
                </p>
              </div>
            </div>
          </CarouselItem>
          {/* Communication Rating */}
          <CarouselItem className="max-w-[350px]">
            <div className="w-full h-max">
              <p className="text-md text-foreground/80 mb-4 w-max">
                Communication Rating
              </p>
              <div className="rounded-md border-border/90 border-[1px] p-4 space-y-8">
                {/* only if total reviews are more than 150 and overall rating is 8.5 and above */}
                <Badge
                  className="flex items-center gap-1 rounded w-max"
                  variant={"secondary"}
                >
                  <MessageSquareText className="w-4 h-4" />
                  Communication
                </Badge>
                <p className="flex w-full justify-between items-center">
                  <span className="text-xl font-semibold text-card-foreground">
                    {getRatingLabel(
                      reviews.reduce(
                        (acc, review) => acc + review.communication,
                        0
                      ) / reviews.length
                    )}{" "}
                  </span>
                  <span className="text-3xl font-semibold text-card-foreground">
                    {reviews?.length > 0
                      ? (
                          reviews.reduce(
                            (acc, review) => acc + review.communication,
                            0
                          ) / reviews.length
                        ).toFixed(1)
                      : 0}{" "}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Rated by {reviews.length} guests
                </p>
              </div>
            </div>
          </CarouselItem>
          {/* Location Rating */}
          <CarouselItem className="max-w-[350px]">
            <div className="w-full h-max">
              <p className="text-md text-foreground/80 mb-4 w-max">
                Location Rating
              </p>
              <div className="rounded-md border-border/90 border-[1px] p-4 space-y-8">
                {/* only if total reviews are more than 150 and overall rating is 8.5 and above */}
                <Badge
                  className="flex items-center gap-1 rounded w-max"
                  variant={"secondary"}
                >
                  <MapPinCheckInside className="w-4 h-4" />
                  Location
                </Badge>
                <p className="flex w-full justify-between items-center">
                  <span className="text-xl font-semibold text-card-foreground">
                    {getRatingLabel(
                      reviews.reduce(
                        (acc, review) => acc + review.location,
                        0
                      ) / reviews.length
                    )}{" "}
                  </span>
                  <span className="text-3xl font-semibold text-card-foreground">
                    {reviews?.length > 0
                      ? (
                          reviews.reduce(
                            (acc, review) => acc + review.location,
                            0
                          ) / reviews.length
                        ).toFixed(1)
                      : 0}{" "}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Rated by {reviews.length} guests
                </p>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
export default RatingsPanel;
