import React, { useState, useCallback, useEffect, useRef, use } from "react";
import Map, {
  GeolocateControl,
  MapRef,
  Marker,
  NavigationControl,
} from "react-map-gl";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { AppDispatch, RootState } from "@/lib/redux-store/store";
import { set } from "date-fns";
import {
  setAddress,
  setGeometry,
  setStep,
} from "@/lib/redux-store/slices/register-listing-slice";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

// Set your Mapbox token
const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const RenderStep2 = () => {
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

  const { geometry, listingName, address } = useAppSelector(
    (state: RootState) => state.registerListing
  );
  const dispatch: AppDispatch = useAppDispatch();

  const [defaultCoordinates, setDefaultCoordinates] = useState({
    latitude: 42.351,
    longitude: -71.067,
  });
  const mapRef = useRef<MapRef>(null);
  const [marker, setMarker] = useState(defaultCoordinates);

  const [viewport, setViewport] = useState({
    latitude: geometry?.coordinates[1]
      ? geometry?.coordinates[1]
      : defaultCoordinates.latitude,
    longitude: geometry?.coordinates[0]
      ? geometry?.coordinates[0]
      : defaultCoordinates.longitude,
    zoom: 16,
    bearing: 0,
    pitch: 0,
  });

  // Handle drag start event
  const onMarkerDragStart = useCallback((event: any) => {}, []);

  // Handle dragging event
  const onMarkerDrag = useCallback((event: any) => {}, []);

  // Handle drag end event
  const onMarkerDragEnd = useCallback((event: any) => {
    setMarker({
      latitude: event.lngLat.lat,
      longitude: event.lngLat.lng,
    });
    dispatch(
      setGeometry({
        lat: event.lngLat.lat,
        lng: event.lngLat.lng,
      })
    );
    mapRef.current?.flyTo({
      center: [event.lngLat.lng, event.lngLat.lat],
      duration: 2000,
      zoom: 17,
    });
  }, []);

  // Handle geolocation
  const handleGeolocation = (e: any) => {
    const { longitude, latitude } = e.coords;
    setDefaultCoordinates({
      latitude: latitude,
      longitude: longitude,
    });
    setMarker({ latitude, longitude });
    dispatch(
      setGeometry({
        lng: longitude,
        lat: latitude,
      })
    );
    mapRef.current?.flyTo({
      center: [longitude, latitude],
      duration: 3000,
      animate: true,
      zoom: 17,
      curve: 1,
    });
    setViewport((prevViewport) => ({
      ...prevViewport,
      latitude,
      longitude,
      zoom: 10,
    }));
  };

  // Fetch address based on coordinates
  const fetchAddress = async () => {
    try {
      const url = new URL(`https://api.mapbox.com/search/geocode/v6/reverse`);
      url.searchParams.append("access_token", TOKEN);
      url.searchParams.append("longitude", geometry!.coordinates[0].toString());
      url.searchParams.append("latitude", geometry!.coordinates[1].toString());
      url.searchParams.append("limit", "1");
      url.searchParams.append("permanent", "true");
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error("Failed to fetch Address suggestions");
      }
      const data = await response.json();
      dispatch(
        setAddress({
          fullAddress: data.features[0].properties.full_address,
          street: data.features[0].properties.full_address.split(",")[0].trim(),
          neighborhood: data.features[0].properties.context.neighborhood
            ? data.features[0].properties.context.neighborhood.name
            : data.features[0].properties.context.locality
            ? data.features[0].properties.context.locality.name
            : "",
          city: data.features[0].properties.context.city
            ? data.features[0].properties.context.neighborhood.city
            : data.features[0].properties.context.place
            ? data.features[0].properties.context.place.name
            : "",
          state: data.features[0].properties.context.region.name,
          country: data.features[0].properties.context.country.name,
          zipCode: data.features[0].properties.context.postcode.name,
        })
      );
    } catch (error) {
      console.log("Error fetching Address suggestions:", error);
      return {};
    }
  };
  useEffect(() => {
    if (geometry?.coordinates) {
      fetchAddress();
    }
  }, [geometry]);

  return (
    <div className="space-y-14 w-full">
      <h1 className="text-xl font-semibold flex flex-col gap-4">
        <Badge className="rounded-full w-max">Step 2</Badge>
        Where are you located at?
      </h1>

      <div className="flex flex-col w-full gap-4">
        <Label
          htmlFor="listingName"
          className="text-[14px] text-accent-foreground"
        >
          Place the marker at your location from the interactive map below
        </Label>

        {/* Map component */}
        <Map
          ref={mapRef}
          initialViewState={viewport}
          mapStyle={process.env.NEXT_PUBLIC_MAPBOX_MAP_STYLE as string}
          mapboxAccessToken={TOKEN}
          minZoom={8}
          style={{ width: "100%", height: "450px", borderRadius: "10px" }}
        >
          {/* Marker */}
          <Marker
            longitude={
              geometry?.coordinates ? geometry.coordinates[0] : marker.longitude
            }
            latitude={
              geometry?.coordinates ? geometry.coordinates[1] : marker.latitude
            }
            anchor="bottom"
            offset={[0, 20]}
            draggable
            color="#e11d48"
            onDragStart={onMarkerDragStart}
            onDrag={onMarkerDrag}
            onDragEnd={onMarkerDragEnd}
          >
            <div
              className="marker"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
              }}
            >
              <Image
                height={40}
                width={40}
                src="/logos/logo-rose-bg.svg"
                alt="Hotel Logo"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </Marker>

          {/* Navigation controls */}
          <NavigationControl position="top-right" />
          <GeolocateControl
            position="top-right"
            onGeolocate={handleGeolocation}
          />
        </Map>

        {/* Display coordinates */}

        <p className={"text-[14px] text-accent-foreground/70"}>
          {geometry?.coordinates?.length
            ? `Coordinates: Latitude: ${geometry.coordinates[1]}, Longitude: ${geometry.coordinates[0]}`
            : `Please drag the marker to the ${listingName}'s location`}
        </p>

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
    </div>
  );
};

export default RenderStep2;
