"use client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { AppDispatch, RootState } from "@/lib/redux-store/store";
import {
  setAddress,
  setDistanceFromAirport,
  setDistanceFromBusStop,
  setDistanceFromRailwayStation,
  setStep,
} from "@/lib/redux-store/slices/register-listing-slice";
import { useDebouncedCallback } from "use-debounce";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { fetchNearbyPlaces } from "@/lib/utils/export/export";

const RenderStep3 = () => {
  const { geometry, listingName, address, distanceFrom } = useAppSelector(
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
    // fetch & set airport
    const nearestAirport = fetchNearbyPlaces(
      geometry.coordinates[1],
      geometry.coordinates[0],
      "airport"
    );
    nearestAirport
      .then((airports) => {
        if (Array.isArray(airports) && airports.length > 0) {
          dispatch(setDistanceFromAirport(airports[0]));
        }
      })
      .catch((error) => {
        console.error("Error fetching nearest airport:", error);
      });

    // fetch & set nearest railway station
    const nearestRailwayStation = fetchNearbyPlaces(
      geometry.coordinates[1],
      geometry.coordinates[0],
      "train station",
    );
    nearestRailwayStation
      .then((railwayStations) => {
        if (Array.isArray(railwayStations) && railwayStations.length > 0) {
          dispatch(setDistanceFromRailwayStation(railwayStations[0]));
        }
      })
      .catch((error) => {
        console.error("Error fetching nearest airport:", error);
      });

    // fetch & set nearest bus station
    const nearestBusStation = fetchNearbyPlaces(
      geometry.coordinates[1],
      geometry.coordinates[0],
      "bus station"
    );
    nearestBusStation
      .then((busStations) => {
        if (Array.isArray(busStations) && busStations.length > 0) {
          dispatch(setDistanceFromBusStop(busStations[0]));
        }
      })
      .catch((error) => {
        console.error("Error fetching nearest airport:", error);
      });
  }, []);


  return (
    <div className="space-y-14 w-full">
      <div className=" flex flex-col gap-4">
        <h1 className="text-xl font-semibold  flex flex-col gap-4">
          <Badge className="rounded-full w-max">Step 3</Badge>
          {listingName}&apos;s Address
        </h1>

        <div className="text-[14px] text-accent-foreground">
          {Object.entries(address).map(([key, value]) => (
            <p key={key}>
              <span className="font-medium">
                {key}: {JSON.stringify(value, null, 2)}
              </span>
            </p>
          ))}
          Nearest Airport
          {Object.entries(distanceFrom.airport).map(([key, value]) => (
            <p key={key}>
              <span className="font-medium">
                {key}: {JSON.stringify(value, null, 2)}
              </span>
            </p>
          ))}
          Nearest Railway Station
          {Object.entries(distanceFrom.railwayStation).map(([key, value]) => (
            <p key={key}>
              <span className="font-medium">
                {key}: {JSON.stringify(value, null, 2)}
              </span>
            </p>
          ))}
          Nearest Bus Stop
          {Object.entries(distanceFrom.busStop).map(([key, value]) => (
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
