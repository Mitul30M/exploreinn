import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  hotelAmenities,
  HotelAmenities,
} from "@/lib/utils/hotel-ammenities/hotel-amenities";
import { cloneElement } from "react";

interface ListingAmenitiesProps {
  amenities: string[];
}

const ListingAmenities = ({ amenities }: ListingAmenitiesProps) => {
  const listingAmenities = hotelAmenities.filter((amenity) =>
    amenities.includes(amenity.name)
  );
  return (
    <TooltipProvider>
      <div className="flex flex-wrap justify-start items-center content-center"></div>
      {listingAmenities.slice(0, 5).map((amenity, index) => (
        <Tooltip key={index}>
          <TooltipTrigger>
            <Badge
              variant="outline"
              className="p-2 mr-1 mb-1 rounded-full text-muted-foreground"
            >
              <span className="text-xs primary">
                {cloneElement(amenity.icon, {
                  width: 16,
                  height: 16,
                  className: "text-muted-foreground hover:text-primary",
                })}
              </span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{amenity.name}</p>
          </TooltipContent>
        </Tooltip>
      ))}
      {amenities.length > 5 && (
        <Badge
          variant="outline"
          className="mr-2 -mt-2   text-xs py-1 text-muted-foreground rounded-full"
        >
          + More
        </Badge>
      )}
    </TooltipProvider>
  );
};

export default ListingAmenities;
