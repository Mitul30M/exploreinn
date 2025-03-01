import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp } from "lucide-react";
import { convertCurrency } from "@/lib/utils/currency/currency-convertor";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import ListingAmenities from "./listing-amenities";
import { TListingCard } from "@/lib/actions/listings/listings";
import Link from "next/link";

// type TListingCardProps = {
//   id: number;
//   title: string;
//   image: string;
//   startingRoomPrice: number;
//   starRating: number;
//   exploreinnRating: number;
//   exploreinnGrade: string;
//   reviews: number;
//   location: string;
//   amenities: HotelAmenities[];
// };

const ListingCard = async ({ listing }: { listing: TListingCard }) => {
  // ***currency conversion from $ -> default-user-currency
  const amount = Math.min(...listing.rooms.map((room) => room.price));
  const toCurrency = "INR"; // Convert to Indian Rupees
  const formattedCurrency = await convertCurrency({
    amount,
    toCurrency,
    fromCurrency: "USD",
  });

  return (
    <Card
      key={listing.id}
      className="flex flex-col group overflow-hidden !max-w-[300px] rounded-md border-border/90 shadow-none hover:shadow-sm"
    >
      <Link href={`/listings/${listing.id}`}>
        <CardHeader className="p-4">
          <Image
            src={listing.coverImage}
            alt={listing.name}
            width={290}
            height={200}
            className="w-full h-[200px] aspect-square object-cover rounded-sm "
          />
        </CardHeader>
        <CardContent className="flex-grow px-4 py-0">
          <CardTitle className="text-lg font-semibold mb-1 group-hover:text-primary group-hover:underline group-hover:underline-offset-2">
            {listing.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground mb-2">
            {listing.address.city}, {listing.address.state}
          </p>

          <div className="flex items-center mb-1 justify-between">
            {/* Guest Star Ratings */}
            <div className="flex items-center ">
              <Star className="w-4 h-4 text-primary mr-1" />
              <span className="text-sm font-medium">{listing.starRating}</span>
              <span className="text-sm text-muted-foreground ml-1">
                ({listing.reviews.length} reviews)
              </span>
            </div>

            {/* exploreinn Ratings */}
            <div className="flex items-center">
              <Badge
                variant="outline"
                className={
                  "flex gap-1 font-semibold " +
                  (listing.overallRating >= 9 ? "text-primary" : "")
                }
              >
                {listing.overallRating} {listing.exploreinnGrade}{" "}
                {listing.overallRating >= 9 && <ThumbsUp width={14} />}
                {}
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
            {formattedCurrency}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              /night
            </span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ListingCard;
