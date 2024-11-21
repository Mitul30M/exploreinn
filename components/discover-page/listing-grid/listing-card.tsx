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

type TListingCardProps = {
  id: number;
  title: string;
  image: string;
  startingRoomPrice: number;
  starRating: number;
  exploreinnRating: number;
  exploreinnGrade: string;
  reviews: number;
  location: string;
};

const ListingCard = async ({ listing }: { listing: TListingCardProps }) => {
  // ***currency conversion from $ -> default-user-currency
  const amount = listing.startingRoomPrice; // $baseRoomPrice
  const toCurrency = "INR"; // Convert to Indian Rupees
  const formattedCurrency = await convertCurrency({ amount, toCurrency });

  return (
    <Card
      key={listing.id}
      className="flex flex-col overflow-hidden rounded-md border-border/90 shadow-none hover:shadow-sm "
    >
      <CardHeader className="p-4">
        <Image
          src={listing.image}
          alt={listing.title}
          width={290}
          height={200}
          className="w-full h-[200px] rounded-sm "
        />
      </CardHeader>
      <CardContent className="flex-grow px-4 py-0">
        <CardTitle className="text-lg font-semibold mb-1">
          {listing.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground mb-2">{listing.location}</p>

        <div className="flex items-center mb-1 justify-between">
          {/* Guest Star Ratings */}
          <div className="flex items-center ">
            <Star className="w-4 h-4 text-primary mr-1" />
            <span className="text-sm font-medium">{listing.starRating}</span>
            <span className="text-sm text-muted-foreground ml-1">
              ({listing.reviews} reviews)
            </span>
          </div>

          {/* exploreinn Ratings */}
          <div className="flex items-center">
            <Badge
              variant="outline"
              className={
                "flex gap-1 font-semibold " +
                (listing.exploreinnRating >= 9 ? "text-primary" : "")
              }
            >
              {listing.exploreinnRating} {listing.exploreinnGrade}{" "}
              {listing.exploreinnRating >= 9 && <ThumbsUp width={14} />}
              {}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-2">
        <div className="text-lg font-semibold">
          <p className="text-sm text-muted-foreground font-normal mb-1">
            Rooms starting from
          </p>
          {formattedCurrency}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            /night
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
