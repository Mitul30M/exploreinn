"use client";
import ListingAmenities from "@/components/discover-page/listing-grid/listing-amenities";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/hooks/redux-hooks";
import { RootState } from "@/lib/redux-store/store";
import { Heart, Sparkles, Star, ThumbsUp } from "lucide-react";
import Image from "next/image";

const RenderPreviewStep = () => {
  const listing = useAppSelector((state: RootState) => state.registerListing);

  return (
    <div className="space-y-14 w-full">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold  flex flex-col gap-4">
          <Badge className="rounded-full w-max">Preview</Badge>
          Let&apos;s Preview Your Listing
        </h1>
        <p className="text-[14px] text-accent-foreground">
          You can edit your listing anytime from your dashboard. If satisfied
          with your listing, you can enlist it in the next step.
        </p>
      </div>

      {/* Listing Name */}
      <div className="flex flex-col items-center justify-center w-full  gap-4">
        <Card className="flex !w-max flex-col overflow-hidden rounded-md border-border/90 shadow-none hover:shadow-sm">
          <CardHeader className="p-4 relative">
            <Image
              src={listing.coverImage}
              alt={listing.listingName}
              width={350}
              height={250}
              className="!max-w-[300px] h-[250px] object-cover rounded-sm "
            />
            <Badge className="rounded-full flex items-center gap-1 py-1  absolute top-6 left-8">
              <Sparkles strokeWidth={2.3} size={18} />
              New
            </Badge>
            <div className="rounded-full absolute top-6 right-8">
              <Heart strokeWidth={3} className="text-primary" />
            </div>
          </CardHeader>
          <CardContent className="flex-grow px-4 py-0">
            <CardTitle className="text-lg font-semibold mb-1">
              {listing.listingName}
            </CardTitle>
            <p className="text-sm text-muted-foreground mb-2">
              {listing.address.city}
            </p>

            <div className="flex items-center mb-1 justify-between">
              {/* Guest Star Ratings */}
              <div className="flex items-center ">
                <Star className="w-4 h-4 text-primary mr-1" />
                <span className="text-sm font-medium">5</span>
                <span className="text-sm text-muted-foreground ml-1">
                  (2.5K reviews)
                </span>
              </div>

              {/* exploreinn Ratings */}
              <div className="flex items-center">
                <Badge
                  variant="outline"
                  className={"flex gap-1 font-semibold text-primary"}
                >
                  Excellent
                  <ThumbsUp width={14} />
                </Badge>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Ammenities */}
            <ListingAmenities amenities={listing.amenities} />
            <Separator className="mt-4 px-4" />
          </CardContent>

          <CardFooter className="p-4 pt-4">
            <div className="text-lg font-semibold">
              <p className="text-xs text-muted-foreground font-normal mb-1">
                Rooms starting from
              </p>
              ${listing.room.basePrice}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                /night
              </span>
            </div>
          </CardFooter>
        </Card>

        <p className="text-[14px] text-accent-foreground/70">
          Look&apos;s Good, Doesn&apos;t It?
        </p>
      </div>
    </div>
  );
};

export default RenderPreviewStep;
