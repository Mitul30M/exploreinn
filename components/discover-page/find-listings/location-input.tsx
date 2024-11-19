"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Building, FerrisWheel, Globe, Loader, MapPinHouse } from "lucide-react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area"; // Import the ScrollArea component
import { Label } from "@/components/ui/label";
// Zod Schema for city input validation
const cityInputSchema = z.string();

const LocationInput = () => {
  const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
  const [cityInput, setCityInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const {
    data,
    isLoading: queryLoading,
    error,
    isSuccess,
  } = useQuery<string[], Error>({
    queryKey: ["citySuggestions", cityInput],
    queryFn: async () => await fetchCitySuggestions(cityInput),
    enabled: !!cityInput,
  });

  // UseEffect to set suggestions when query is successful
  useEffect(() => {
    if (isSuccess && data) {
      setSuggestions(data);
    }
  }, [data, isSuccess]);

  const fetchCitySuggestions = async (query: string): Promise<string[]> => {
    const validationResult = cityInputSchema.safeParse(query);
    if (!validationResult.success) {
      console.error(validationResult.error);
      setSuggestions([]);
      return [];
    }

    if (!MAPBOX_API_KEY) {
      console.error("Mapbox API key is missing");
      return [];
    }

    try {
      const url = new URL(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`
      );
      url.searchParams.append("access_token", MAPBOX_API_KEY);
      url.searchParams.append("types", "place");
      url.searchParams.append("limit", "10");

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error("Failed to fetch city suggestions");
      }

      const data = await response.json();
      return data.features.map((feature: any) => feature.place_name);
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
      return [];
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setCityInput(query);
  };

  return (
    // add the selected city to the redux store's value to maintain and make it available globally
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="rounded-xl rounded-r-none hover:text-primary">
          <MapPinHouse />
          {cityInput ? cityInput : 'Find The Perfect Destination'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-4">
        <div className="space-y-2">
          <Label htmlFor="location-search" className="flex items-center gap-1 mb-2"><Building size={20} />Cities to Explore</Label>
          <Input
            id="location-search"
            type="text"
            placeholder="Search for a city"
            value={cityInput}
            onChange={handleInputChange}
            className="w-full px-3 py-2"
          />
          {queryLoading ? (
            <p className="text-muted-foreground text-sm flex flex-col pt-4 justify-center items-center gap-2">
              <Loader className="animate-spin" size={36} strokeWidth={2} />
              Loading
            </p>
          ) : error ? (
            <p className="text-red-500">Error loading suggestions</p>
          ) : (
            <ScrollArea className="h-40">
              {suggestions.length > 0 ? (
                suggestions.map((city, index) => (
                  <div
                    key={index}
                    className="px-2 py-1 hover:bg-muted flex justify-start items-center gap-1 rounded-md text-[15px] cursor-pointer"
                    onClick={() => setCityInput(city)}
                  >
                    <Globe size={16} className="text-primary" />
                    {city}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm flex flex-col pt-8 justify-center items-center gap-2">
                  <FerrisWheel size={48} />
                  No Such City found!
                </p>
              )}
            </ScrollArea>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LocationInput;
