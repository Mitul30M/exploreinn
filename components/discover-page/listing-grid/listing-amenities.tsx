import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { HotelAmenities } from "@/lib/utils/hotel-ammenities/hotel-amenities";
import { cloneElement } from "react";

interface ListingAmenitiesProps {
  listing: HotelAmenities[];
}

const ListingAmenities = ({ listing }: ListingAmenitiesProps) => {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap justify-start items-center content-center"></div>
      {listing.slice(0, 6).map((amenity, index) => (
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
      {listing.length > 5 && (
        <Badge
          variant="outline"
          className="mr-2 -mt-2  text-xs py-1 text-muted-foreground rounded-full"
        >
          + More
        </Badge>
      )}
    </TooltipProvider>
  );
};

export default ListingAmenities;
