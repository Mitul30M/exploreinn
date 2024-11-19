import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MapPinHouse } from "lucide-react";

const LocationInput = () => {
  return (
    <Popover>
      <PopoverTrigger asChild className="hover:text-primary">
        <Button variant="outline" className="rounded-xl rounded-r-none">
          <MapPinHouse />
          Find The Perfect Destination
        </Button>
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
};

export default LocationInput;
