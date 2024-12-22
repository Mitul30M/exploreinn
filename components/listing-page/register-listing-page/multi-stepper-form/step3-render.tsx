"use client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { AppDispatch, RootState } from "@/lib/redux-store/store";
import {
  setAddress,
  setListingName,
  setListingType,
  setStep,
} from "@/lib/redux-store/slices/register-listing-slice";
import { listingTypes } from "@/lib/utils/listing/listing";
import { useDebouncedCallback } from "use-debounce";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useQuery } from "@tanstack/react-query";

// Set your Mapbox token
const RenderStep3 = () => {
  const { geometry, listingName, address } = useAppSelector(
    (state: RootState) => state.registerListing
  );
  const dispatch: AppDispatch = useAppDispatch();

  useEffect(() => {
    if (geometry === null) {
      toast({
        title: `*Location is Required`,
        description: `Please set ${listingName}'s coordinates before moving ahead.`,
        action: (
          <ToastAction className="text-primary text-nowrap" altText="Step 2">
            Step 2
          </ToastAction>
        ),
      });
      dispatch(setStep(2));
      return;
    }
  }, []);

  //   const {
  //     data,
  //     isLoading: queryLoading,
  //     error,
  //     isSuccess,
  //   } = useQuery({
  //     queryKey: ["address", new Date().toISOString()],
  //     queryFn: async () => await fetchAddress(),
  // });

  //   const fetchAddress = async () => {
  //     if (!TOKEN) {
  //       console.error("Mapbox API key is missing");
  //       return {};
  //     }
  //     if (geometry === null) {
  //       console.log("Coordinates not set");
  //       return {};
  //     }
  //     try {
  //       const url = new URL(`https://api.mapbox.com/search/geocode/v6/reverse`);
  //       url.searchParams.append("access_token", TOKEN);
  //       url.searchParams.append("longitude", geometry!.coordinates[0].toString());
  //       url.searchParams.append("latitude", geometry!.coordinates[1].toString());
  //       url.searchParams.append("limit", "1");
  //       url.searchParams.append("permanent", "true");

  //       const response = await fetch(url.toString());
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch Address suggestions");
  //       }
  //       const data = await response.json();
  //       dispatch(
  //         setAddress({
  //           fullAddress: data.features[0].properties.full_address,
  //           street: data.features[0].properties.full_address.split(",")[0].trim(),
  //           neighborhood: data.features[0].properties.context.neighborhood
  //             ? data.features[0].properties.context.neighborhood.name
  //             : data.features[0].properties.context.locality
  //             ? data.features[0].properties.context.locality.name
  //             : "",
  //           city: data.features[0].properties.context.city
  //             ? data.features[0].properties.context.neighborhood.city
  //             : data.features[0].properties.context.place
  //             ? data.features[0].properties.context.place.name
  //             : "",
  //           state: data.features[0].properties.context.region.name,
  //           country: data.features[0].properties.context.country.name,
  //           zipCode: data.features[0].properties.context.postcode.name,
  //         })
  //       );
  //       return data;
  //     } catch (error) {
  //       console.log("Error fetching Address suggestions:", error);
  //       return {};
  //     }
  //   };

  return (
    <div className="space-y-14 w-full">
      <div className=" flex flex-col gap-4">
        <h1 className="text-xl font-semibold  flex flex-col gap-4">
          <Badge className="rounded-full w-max">Step 3</Badge>
          {listingName}'s Address
        </h1>

        <div className="text-[14px] text-accent-foreground">
          {Object.entries(address).map(([key, value]) => (
            <p key={key}>
              <span className="font-medium">
                {key}: {JSON.stringify(value, null, 2)}
              </span>
            </p>
          ))}
        </div>
      </div>

      {/* Listing Address */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(0,300px))] w-full gap-8">
        {/* Street */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="street"
            className="text-[14px]  text-accent-foreground"
          >
            Street
          </Label>

          <Input
            defaultValue={address.street}
            type="text"
            id="street"
            placeholder=""
            className="!text-[16px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
            onChange={useDebouncedCallback((event) => {
              dispatch(
                setAddress({
                  ...address,
                  street: event.target.value,
                  fullAddress:
                    event.target.value +
                    ", " +
                    address.neighborhood +
                    ", " +
                    address.city +
                    ", " +
                    address.state +
                    ", " +
                    address.zipCode +
                    ", " +
                    address.country,
                })
              );
            }, 150)}
          />
        </div>
        {/* Neighborhood */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="neighborhood"
            className="text-[14px]  text-accent-foreground"
          >
            Neighborhood
          </Label>

          <Input
            defaultValue={address.neighborhood}
            type="text"
            id="neighborhood"
            placeholder=""
            className="!text-[16px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
            onChange={useDebouncedCallback((event) => {
              dispatch(
                setAddress({
                  ...address,
                  neighborhood: event.target.value,
                  fullAddress:
                    address.street +
                    ", " +
                    event.target.value +
                    ", " +
                    address.city +
                    ", " +
                    address.state +
                    ", " +
                    address.zipCode +
                    ", " +
                    address.country,
                })
              );
            }, 150)}
          />
        </div>
        {/* City */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="city" className="text-[14px]  text-accent-foreground">
            City
          </Label>

          <Input
            defaultValue={address.city}
            type="text"
            id="city"
            placeholder=""
            className="!text-[16px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
            onChange={useDebouncedCallback((event) => {
              dispatch(
                setAddress({
                  ...address,
                  city: event.target.value,
                  fullAddress:
                    address.street +
                    ", " +
                    address.neighborhood +
                    ", " +
                    event.target.value +
                    ", " +
                    address.state +
                    ", " +
                    address.zipCode +
                    ", " +
                    address.country,
                })
              );
            }, 150)}
          />
        </div>
        {/* State */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="state"
            className="text-[14px]  text-accent-foreground"
          >
            State/Province
          </Label>

          <Input
            defaultValue={address.state}
            type="text"
            disabled
            id="state"
            placeholder=""
            className="!text-[16px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
            onChange={useDebouncedCallback((event) => {
              dispatch(
                setAddress({
                  ...address,
                  state: event.target.value,
                  fullAddress:
                    address.street +
                    ", " +
                    address.neighborhood +
                    ", " +
                    address.city +
                    ", " +
                    event.target.value +
                    ", " +
                    address.country +
                    ", " +
                    address.zipCode,
                })
              );
            }, 150)}
          />
        </div>
        {/* Zip Code */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="zipCode"
            className="text-[14px]  text-accent-foreground"
          >
            Zip Code
          </Label>

          <Input
            defaultValue={address.zipCode}
            type="text"
            id="zipCode"
            placeholder=""
            className="!text-[16px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
            onChange={useDebouncedCallback((event) => {
              dispatch(
                setAddress({
                  ...address,
                  zipCode: event.target.value,
                  fullAddress:
                    address.street +
                    ", " +
                    address.neighborhood +
                    ", " +
                    address.city +
                    ", " +
                    address.state +
                    ", " +
                    event.target.value +
                    ", " +
                    address.country,
                })
              );
            }, 150)}
          />
        </div>
        {/* Country */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="country"
            className="text-[14px]  text-accent-foreground"
          >
            Country
          </Label>

          <Input
            defaultValue={address.country}
            type="text"
            id="country"
            disabled
            placeholder=""
            className="!text-[16px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
            onChange={useDebouncedCallback((event) => {
              dispatch(setAddress({ ...address, country: event.target.value }));
            }, 150)}
          />
        </div>
        {/* Landmark? */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="landmark"
            className="text-[14px]  text-accent-foreground"
          >
            Landmark (optional)
          </Label>

          <Input
            defaultValue={address.landmark}
            type="text"
            id="landmark"
            placeholder=""
            className="!text-[16px] font-medium h-10 valid:bg-background rounded-lg px-4 shadow-sm"
            onChange={useDebouncedCallback((event) => {
              dispatch(
                setAddress({ ...address, landmark: event.target.value })
              );
            }, 150)}
          />
        </div>
      </div>
    </div>
  );
};
export default RenderStep3;
