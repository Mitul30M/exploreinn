import { DatePickerWithRange } from "./date-range-picker";
import GuestCounterInput from "./guest-input";
import LocationInput from "./location-input";
import { Minus, Plus } from "lucide-react";

const FindListingsInput = () => {
  return (
    <section className="flex items-center justify-center min-h-14 w-full px-4 border-b-[1px] border-border/90">
      {/* location input popover */}
      <LocationInput />

      {/* date range Selector */}
      <DatePickerWithRange />

      {/* no. of guests input */}
      <GuestCounterInput />
    </section>
  );
};

export default FindListingsInput;
