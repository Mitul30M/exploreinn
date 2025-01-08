import BookingDetails from "@/components/listing-page/booking-details-card";
import { ImageCarousel } from "@/components/listing-page/image-carousel";
import RatingsPanel from "@/components/listing-page/ratings-panel";
import { RenderHTML } from "@/components/listing-page/register-listing-page/multi-stepper-form/step4-render";
import ListingReviewsSection from "@/components/listing-page/reviews-section";
import { RoomTypesCarousel } from "@/components/listing-page/room-carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getListingById } from "@/lib/actions/listings/listings";
import { hotelAmenities } from "@/lib/utils/hotel-ammenities/hotel-amenities";
// import { Listing, seedListing } from "@/lib/utils/seed/listing/listings";
import { Review, Room } from "@prisma/client";
import {
  Bus,
  BusFront,
  Check,
  DoorOpen,
  Earth,
  HandPlatter,
  Heart,
  Hotel,
  Info,
  List,
  MessageCircleHeart,
  Plane,
  PlaneTakeoff,
  Pyramid,
  Share,
  Sparkles,
  Star,
  TrainFront,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { cloneElement } from "react";

const ListingPage = async ({ params }: { params: Params }) => {
  // get the listingId from the url and then fetch data using api or server action
  const listingID = (await params).slug;
  const listing = await getListingById(listingID);

  if (!listing) {
    return notFound();
  }

  const listingAmenities = hotelAmenities.filter((amenity) =>
    listing.amenities.includes(amenity.name)
  );

  if (listing)
    return (
      <section className="w-full">
        {/* header */}
        <header className="flex justify-between items-center m-4">
          {/* only if the listing's grade is Excellent */}
          {listing.exploreinnGrade === "Excellent" && (
            <Badge
              variant={"secondary"}
              className="text-sm flex items-center gap-1"
            >
              <Sparkles className="w-4 h-4" />
              <p>One of the most highly rated listing on exploreinn!</p>
            </Badge>
          )}

          {/* share and wishlist buttons */}
          <TooltipProvider>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size={"icon"}
                    className="w-8 h-8 rounded-full"
                  >
                    <Share strokeWidth={2.5} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share Listing</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size={"icon"}
                    className="w-8 h-8 rounded-full text-primary"
                  >
                    <Heart strokeWidth={2.5} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save to Wishlist</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </header>
        {/* listing title & ratings */}
        <section className="flex justify-between items-center p-4  border-[1px] border-x-0 border-border/90 ">
          {/* listing title */}
          <div className="flex flex-col gap-1">
            <h1 className=" text-2xl font-bold tracking-tight">
              {listing.name}
            </h1>
            <p className="text-muted-foreground/95 text-sm font-medium tracking-tight">
              {listing.address.city}, {listing.address.country}
            </p>
          </div>
          {/* listing ratings */}
          <div className="flex items-center gap-2">
            {/* reviews */}
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm font-medium tracking-tight">
                {listing.reviews.length}+
              </p>
              <Link
                href={`/listings/${listing.id}/#reviews`}
                className="text-xs font-semibold hover:underline hover:underline-offset-2 text-primary/95 p-1 h-max"
              >
                Reviews
              </Link>
            </div>
            <Separator orientation="vertical" />
            {/* star rating */}
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm font-medium tracking-tight flex items-center justify-center gap-1">
                {listing.starRating}
                <Star strokeWidth={2.5} className="w-4 h-4 text-primary" />
              </p>
              <p className="text-xs font-semibold p-1 h-max">Stars</p>
            </div>
          </div>
        </section>

        {/* image carousel and collage */}
        <section className="flex gap-4 m-4 border-[1px] border-border/90 rounded-sm">
          {/* image carousel */}
          <div className="h-max flex-1  rounded-sm">
            <ImageCarousel images={listing.images} className="rounded " />
          </div>
          {/* bento grid of first 4 images */}
          <div className="hidden sm:flex flex-1  !min-h-full   rounded-sm">
            {/* on the last image there should be a button to view all images which opens a modal, try placing the button absolutely positioned */}
            <div className="!min-w-full !min-h-full grid grid-cols-2 grid-rows-2 gap-4  ">
              {listing.images.slice(0, 4).map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`Image ${index + 1}`}
                  width={400}
                  height={400}
                  className="!w-full !h-full object-cover rounded-sm"
                />
                // <div
                //   className="bg-muted w-full h-full rounded-sm text-center flex items-center justify-center"
                //   key={index}
                // >
                //   {index + 1}
                // </div>
              ))}
            </div>
          </div>
        </section>

        {/* listing & booking details */}
        <section className="flex gap-4 p-4 border-x-0 border-t-[1px] border-border/90 ">
          {/* listing details */}
          <div className="h-max flex flex-col xl:flex-row  gap-4">
            {/* listing location */}
            <div className=" h-max  border-[1px] border-border/90 rounded-sm pb-2">
              <h1 className="scroll-m-20 text-lg font-semibold tracking-tight border-border/90 border-b-[1px] p-4 flex gap-2">
                <Hotel className="text-primary mt-2" />
                <div className="flex flex-col gap-0">
                  <h1 className=" text-lg font-bold tracking-tight">
                    {listing.name}
                  </h1>
                  <p className="text-muted-foreground/95 text-sm font-medium tracking-tight">
                    {listing.address.city}, {listing.address.country}
                  </p>
                </div>
              </h1>
              {/* email */}
              <div className="w-full flex items-center justify-between p-4 pb-0">
                <p className="text-sm">Email Address</p>
                <p className="font-semibold text-[16px]">{listing.email}</p>
              </div>
              {/* phone */}
              <div className="w-full flex items-center justify-between p-4">
                <p className="text-sm">Phone No.</p>
                <p className="font-semibold text-[16px]">{listing.phoneNo}</p>
              </div>
              {/* map; for now its just an image later we will use a mapbox api */}
              <div className="w-full h-[350px] border-border/90 border-t-[1px] p-4 ">
                <Image
                  src={"/exploreinn-map.png"}
                  alt="map"
                  width={600}
                  height={600}
                  className="!w-full !h-full border-border/90 border-[1px] object-cover rounded"
                />
              </div>
              {/* listing title */}
              <h1 className="text-lg font-semibold tracking-tight px-4">
                {listing.name}
              </h1>
              {/* listing address */}
              <p className=" text-[14px] w-full h-min text-foreground/75 tracking-tight border-border/90 border-b-[1px] p-4 pt-0 line-clamp-5">
                {listing.address.fullAddress}
              </p>
              {/* nearby landmark, airport,bus stop,train station */}
              {/* landmark, tourist destination */}
              <div className="w-full space-y-2 p-4 pb-2">
                {listing.distanceFrom?.touristDestinations &&
                  listing.distanceFrom?.touristDestinations.map(
                    (destination, index) => (
                      <div
                        key={index}
                        className="w-full flex items-center  gap-2"
                      >
                        <p className="text-sm">
                          <Pyramid className="w-4 h-4 text-card-foreground/65" />
                        </p>
                        <p className="font-medium text-sm text-card-foreground/65">
                          Approx {destination.distance}Km from{" "}
                          {destination.name}.
                        </p>
                      </div>
                    )
                  )}
                {/* airport */}
                {listing.distanceFrom?.airport && (
                  <div className="w-full flex items-center  gap-2">
                    <p className="text-sm">
                      <Plane className="w-4 h-4 text-card-foreground/65" />
                    </p>
                    <p className="font-medium text-sm text-card-foreground/65">
                      Approx {listing.distanceFrom?.airport.distance}Km from{" "}
                      {listing.distanceFrom?.airport.name}.
                    </p>
                  </div>
                )}
                {/* railway station */}
                {listing.distanceFrom?.railwayStation && (
                  <div className="w-full flex items-center  gap-2">
                    <p className="text-sm">
                      <TrainFront className="w-4 h-4 text-card-foreground/65" />
                    </p>
                    <p className="font-medium text-sm text-card-foreground/65">
                      Approx {listing.distanceFrom?.railwayStation.distance}Km
                      from {listing.distanceFrom?.railwayStation.name}.
                    </p>
                  </div>
                )}
                {/* bus stop */}
                {listing.distanceFrom?.busStop && (
                  <div className="w-full flex items-center  gap-2">
                    <p className="text-sm">
                      <BusFront className="w-4 h-4 text-card-foreground/65" />
                    </p>
                    <p className="font-medium text-sm text-card-foreground/65">
                      Approx {listing.distanceFrom?.busStop.distance}Km from{" "}
                      {listing.distanceFrom?.busStop.name}.
                    </p>
                  </div>
                )}
              </div>
              {/*  
              <div className="w-full space-y-2 p-4 pt-0 flex flex-row justify-end">
                <Button variant={"outline"} className="rounded-lg text-primary">
                  Navigate to Hotel
                </Button>
              </div>*/}
            </div>
            {/* listing amenities */}
            <div className="border-[1px]  border-border/90 h-max rounded-sm">
              <h1 className=" text-lg font-semibold tracking-tight border-border/90 border-b-[1px] p-4 flex items-center gap-2">
                <HandPlatter className="text-primary" />
                Amenities & Services Provided
              </h1>
              {/* scrollable amenities */}
              <ScrollArea className="w-full h-[400px] ">
                <div className="p-4 grid grid-cols-2 md:grid-cols-2  gap-2">
                  {listingAmenities.map((amenity, index) => (
                    <Badge
                      variant="outline"
                      className="border-none rounded-md cursor-pointer flex items-center justify-center gap-2 w-max  text-card-foreground/80 "
                    >
                      <span className=" primary">
                        {cloneElement(amenity.icon, {
                          width: 18,
                          height: 18,
                          className: "text-primary ",
                        })}
                      </span>
                      <span className="text-sm ">{amenity.name}</span>
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* booking details */}
          <BookingDetails
            listing={listing}
            roomList={listing.rooms as Room[]}
            className=" max-w-[400px] h-max border-border/90 border-[1px]  rounded-sm p-4"
          />
        </section>

        {/* listing room types carousel */}
        <section className="w-full space-y-4  pb-4 border-border/90 border-y-[1px]">
          <h1 className="scroll-m-20 text-lg font-semibold tracking-tight border-border/90 border-b-[1px] p-4 flex items-center gap-2">
            <DoorOpen className="text-primary" />
            Rooms available in {listing.name}
          </h1>
          <div className="mx-4">
            <RoomTypesCarousel
              rooms={listing.rooms as Room[]}
              className="!w-full rounded-sm"
            />
          </div>
        </section>

        {/* listing ratings & reviews */}
        <section className="w-full space-y-4  border-border/90 border-b-[1px] pb-4 mb-4">
          <h1 className="scroll-m-20 text-lg font-semibold tracking-tight border-border/90 border-b-[1px] p-4 flex items-center gap-2">
            <MessageCircleHeart className="text-primary" />
            {listing.name} Ratings & Reviews
          </h1>
          <RatingsPanel
            reviews={listing.reviews as unknown as Review[]}
            overallRating={listing.overallRating}
            exploreinnGrade={listing.exploreinnGrade}
          />
          {listing.reviews.length ? (
            <ListingReviewsSection reviews={listing.reviews} />
          ) : (
            <p className="px-4 font-medium text-primary">
              No Reviews for this listing yet. Be the first to review
            </p>
          )}
        </section>

        {/* Description */}
        <section className="w-full space-y-4  border-border/90 border-t-[1px] pb-4 mb-4">
          <h1 className="scroll-m-20 text-lg font-semibold tracking-tight border-border/90 border-b-[1px] py-4 px-4 flex items-center gap-2">
            <Info className="text-primary" />
            {listing.name}, {listing.address.city}, {listing.address.state},{" "}
            {listing.address.country}
          </h1>

          <RenderHTML content={listing.description} className="px-4" />
        </section>

        {/* Rules & Regulations */}
        <section className="w-full space-y-4  border-border/90 border-t-[1px] pb-4 ">
          <h1 className="scroll-m-20 text-lg font-semibold tracking-tight border-border/90 border-b-[1px] py-4 px-4 flex items-center gap-2">
            <List className="text-primary" />
            {listing.name}, Rules & Regulations
          </h1>

          <RenderHTML
            content={listing.groundRulesAndRestrictions}
            className="px-4"
          />
        </section>

        {/* Check In Rules & Regulations */}
        <section className="w-full space-y-4  border-border/90 border-t-[1px] pb-4">
          <h1 className="scroll-m-20 text-lg font-semibold tracking-tight border-border/90 border-b-[1px] py-4 px-4 flex items-center gap-2">
            <List className="text-primary" />
            {listing.name}, Check In Rules & Regulations
          </h1>

          <RenderHTML
            content={listing.checkInRulesAndRestrictions}
            className="px-4"
          />
        </section>

        {/* Cancellation Policy */}
        <section className="w-full space-y-8  border-border/90 border-t-[1px] pb-8">
          <h1 className="scroll-m-20 text-lg font-semibold tracking-tight border-border/90 border-b-[1px] py-4 px-8 flex items-center gap-2">
            <List className="text-primary" />
            {listing.name}, Cancellation Policy
          </h1>

          <RenderHTML content={listing.cancellationPolicy} className="px-4" />
        </section>
      </section>
    );
};

export default ListingPage;
