"use client";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { AppDispatch, RootState } from "@/lib/redux-store/store";
import {
  pushAmenity,
  removeAmenity,
  setStep,
} from "@/lib/redux-store/slices/register-listing-slice";
import { listingAmenities } from "@/lib/utils/listing/listing";
import { cloneElement, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const RenderStep6 = () => {
  const { listingName, amenities, images,coverImage } = useAppSelector(
    (state: RootState) => state.registerListing
  );
  const dispatch: AppDispatch = useAppDispatch();
  useEffect(() => {
    if (!images.length) {
      toast({
        title: `*Images are required`,
        description: `Please upload ${listingName}'s images before proceeding.`,
        action: (
          <ToastAction className="text-primary text-nowrap" altText="Step 4">
            Step 5
          </ToastAction>
        ),
      });
      dispatch(setStep(5));
      return;
    }
    if (!coverImage || !coverImage.length) {
      toast({
        title: `*Please Set a Cover Image.`,
        description: `Set Cover Image for ${listingName} by clicking on the Image Button on the preview.`,
        action: (
          <ToastAction className="text-primary text-nowrap" altText="Step 4">
            Step 5
          </ToastAction>
        ),
      });
      dispatch(setStep(5));
      return;
    }
  }, []);

  return (
    <div className="space-y-14 w-full">
      <div className=" flex flex-col gap-4">
        <h1 className="text-xl font-semibold  flex flex-col gap-4">
          <Badge className="rounded-full w-max">Step 6</Badge>
          {listingName}'s Amenities
        </h1>
        <p className="text-sm text-accent-foreground">
          Select Amenities & Services offered by {listingName}. You can edit
          this later as well.
        </p>
      </div>

      {/* Listing Amenities */}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {listingAmenities.map((amenity, index) => (
          <div
            key={index}
            className={`border h-[150px] w-full rounded cursor-pointer flex items-center justify-center gap-4 text-foreground hover:bg-accent/75 ${
              amenities.includes(amenity.name)
                ? "text-primary border-primary border-2 bg-accent/10"
                : ""
            }`}
            onClick={() => {
              !amenities.includes(amenity.name)
                ? dispatch(pushAmenity(amenity.name))
                : dispatch(removeAmenity(amenity.name));
            }}
          >
            <span className=" primary">
              {cloneElement(amenity.icon, {
                width: 35,
                height: 35,
                className: "text-primary ",
              })}
            </span>
            <span className="text-[16px] font-semibold ">{amenity.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RenderStep6;
