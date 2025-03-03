"use client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { AppDispatch, RootState } from "@/lib/redux-store/store";
import {
  setListingName,
  setListingType,
} from "@/lib/redux-store/slices/register-listing-slice";
import { listingTypes } from "@/lib/utils/listing/listing";
import { useDebouncedCallback } from "use-debounce";

const RenderStep1 = () => {
  const { listingName, listingType } = useAppSelector(
    (state: RootState) => state.registerListing
  );
  const dispatch: AppDispatch = useAppDispatch();

  return (
    <div className="space-y-14 w-full">
      <h1 className="text-xl font-semibold  flex flex-col gap-4">
        <Badge className="rounded-full w-max">Step 1</Badge>
        Let&apos;s Get Started
      </h1>

      {/* Listing Name */}
      <div className="flex flex-col w-full max-w-lg gap-2">
        <Label
          htmlFor="listingName"
          className="text-[14px]  text-accent-foreground"
        >
          Name Of Your Listing
        </Label>

        <Input
          defaultValue={listingName.length > 0 ? listingName : ""}
          type="text"
          id="listingName"
          placeholder=""
          className="!text-[16px] font-medium h-10 valid:bg-background rounded-lg px-4"
          onChange={useDebouncedCallback((event) => {
            dispatch(setListingName(event.target.value));
          }, 150)}
        />
        <p className="text-[14px] text-accent-foreground/70">
          Listing name is how guests will see your listing on ExploreInn.
        </p>
      </div>

      {/* Listing Type */}
      <div className="flex flex-col gap-4">
        <Label
          htmlFor="listingType"
          className="text-[14px]  text-accent-foreground"
        >
          Select your listing type
        </Label>
        <RadioGroup
          defaultValue={
            listingType && listingType.length > 0 ? listingType : ""
          }
          onValueChange={(value) => {
            //   console.log("Value changed to:", value);
            dispatch(setListingType(value));
          }}
          className="flex gap-2 flex-wrap  !max-w-[700px]"
        >
          {listingTypes.map((type) => (
            <Label htmlFor={type} key={type}>
              <Badge
                variant="outline"
                key={type}
                className={`flex items-center space-x-2 w-max p-2 px-4 text-sm justify-center gap-2 cursor-pointer rounded-full hover:bg-accent ${
                  listingType === type
                    ? "bg-primary hover:bg-primary text-white"
                    : ""
                }`}
              >
                <RadioGroupItem value={type} id={type} className="hidden" />
                {type}
              </Badge>
            </Label>
          ))}
        </RadioGroup>
        <p className="text-[14px] text-accent-foreground/70">
          The Type of Accommodation your Listing is.
        </p>
      </div>
    </div>
  );
};

export default RenderStep1;
