import {
  DoorOpen,
  HandCoins,
  Laugh,
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
import { Separator } from "../ui/separator";

const RatingsPanel = () => {
  return (
    <div className="w-full flex items-center px-8 gap-8">
      {/* overall ratings */}
      <div>
        <p className="text-md text-foreground/80 mb-4">
          Overall Listing Rating
        </p>

        <div className="w-[350px]  rounded-md border-border/90 border-[1px] p-4 space-y-8">
          {/* only if total reviews are more than 150 and overall rating is 8.5 and above */}
          <Badge className="flex items-center gap-1 rounded w-max">
            <Sparkles className="w-4 h-4" />
            Guest favorite
          </Badge>
          <p className="flex w-full justify-between items-center">
            <span className="text-xl font-semibold text-card-foreground">
              Excellent
            </span>
            <span className="text-3xl font-semibold text-card-foreground">
              9.8
            </span>
          </p>
          <p className="text-sm text-muted-foreground">Rated by 1,050 guests</p>
        </div>
      </div>

      <Separator orientation="vertical" className="h-56" />

      {/* individual ratings carousel */}
      <Carousel className="cursor-grab flex-1 overflow-hidden ">
        <CarouselContent className="gap-4">
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
                    Excellent
                  </span>
                  <span className="text-3xl font-semibold text-card-foreground">
                    9.8
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Rated by 1,050 guests
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
                    Excellent
                  </span>
                  <span className="text-3xl font-semibold text-card-foreground">
                    9.8
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Rated by 1,050 guests
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
                    Excellent
                  </span>
                  <span className="text-3xl font-semibold text-card-foreground">
                    9.8
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Rated by 1,050 guests
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
                    Excellent
                  </span>
                  <span className="text-3xl font-semibold text-card-foreground">
                    9.8
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Rated by 1,050 guests
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
                    Excellent
                  </span>
                  <span className="text-3xl font-semibold text-card-foreground">
                    9.8
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Rated by 1,050 guests
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
                    Excellent
                  </span>
                  <span className="text-3xl font-semibold text-card-foreground">
                    9.8
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Rated by 1,050 guests
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
