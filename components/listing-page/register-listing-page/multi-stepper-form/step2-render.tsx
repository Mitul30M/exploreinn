import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { AppDispatch, RootState } from "@/lib/redux-store/store";
import {
  setGeometry,
  setStep,
} from "@/lib/redux-store/slices/register-listing-slice";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocateFixed } from "lucide-react";

const RenderStep2 = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const { geometry, listingName } = useAppSelector(
    (state: RootState) => state.registerListing
  );

  useEffect(() => {
    if (!listingName.length) {
      toast({
        title: "*Listing Name is Required",
        description: "Please set the Listing Name before moving ahead.",
        action: (
          <ToastAction className="text-primary" altText="Step 1">
            Step 1
          </ToastAction>
        ),
      });
      dispatch(setStep(1));
    }
  }, []);

  const [latitude, setLatitude] = useState<number>(
    geometry?.coordinates[1] ?? 42.351
  );
  const [longitude, setLongitude] = useState<number>(
    geometry?.coordinates[0] ?? -71.067
  );

  // Function to detect and update current location
  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation is not supported by your browser." });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        dispatch(setGeometry({ lat: latitude, lng: longitude }));
      },
      () => {
        toast({ title: "Unable to retrieve your location." });
      }
    );
  };

  useEffect(() => {
    dispatch(setGeometry({ lat: latitude, lng: longitude }));
  }, [latitude, longitude]);

  return (
    <div className="space-y-14 w-full">
      <h1 className="text-xl font-semibold flex flex-col gap-4">
        <Badge className="rounded-full w-max">Step 2</Badge>
        Where is your hotel located?
      </h1>

      <div className="flex flex-col w-full gap-4">
        <Label
          htmlFor="latitude"
          className="text-[14px] text-accent-foreground"
        >
          Enter your location coordinates below
        </Label>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="latitude"
              className="text-[14px]  text-accent-foreground"
            >
              Latitude
            </Label>
            <Input
              id="latitude"
              type="number"
              className="!text-[16px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
              placeholder="Enter latitude"
              value={latitude}
              onChange={(e) =>
                setLatitude(e.target.value ? parseFloat(e.target.value) : 0)
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="longitude"
              className="text-[14px] text-accent-foreground"
            >
              Longitude
            </Label>
            <Input
              id="longitude"
              type="number"
              className="!text-[16px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
              placeholder="Enter longitude"
              value={longitude}
              onChange={(e) =>
                setLongitude(e.target.value ? parseFloat(e.target.value) : 0)
              }
            />
          </div>{" "}
        </div>

        <Button
          variant={"outline"}
          onClick={detectLocation}
          className="!w-max flex items-center gap-3 mt-2"
        >
          <LocateFixed className="h-4 w-4 text-primary" />
          Detect Current Location
        </Button>

        {latitude && longitude && (
          <p className="text-[14px] text-accent-foreground/70">
            Coordinates: Latitude: {latitude}, Longitude: {longitude}
          </p>
        )}
      </div>
    </div>
  );
};

export default RenderStep2;
