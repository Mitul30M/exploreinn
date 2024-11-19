import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MapPinHouse, Users } from "lucide-react";
import { DatePickerWithRange } from "./date-range-picker";
import LocationInput from "./location-input";

const FindListingsInput = () => {
  return (
    <section className="flex items-center justify-center min-h-14 w-full px-4 border-b-[1px] border-border/90">
      {/* location input popover */}
      <LocationInput />

      {/* date range Selector */}
      <DatePickerWithRange />

      {/* no. of guests input */}
      <Popover>
        <PopoverTrigger asChild className="hover:text-primary">
          <Button variant="outline" className="rounded-xl rounded-l-none">
            <Users />
            Add No. of Guests
          </Button>
        </PopoverTrigger>
        <PopoverContent>Place content for the popover here.</PopoverContent>
      </Popover>
    </section>
  );
};

export default FindListingsInput;
