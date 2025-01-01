import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface RegisterListing {
  // showcases the progress of the multi-stepper form
  progress: number;
  // other properties...
  listingName: string;
  listingType: string;
  email: string;
  phone: string;
  description: string;
  geometry: {
    type: "Point";
    //  lng, lat
    coordinates: [number, number];
  } | null;
  address: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    fullAddress: string;
    landmark?: string;
  };
  distanceFrom: {
    touristDestinations: {
      name: string;
      distance: number;
    }[];
    airport: {
      name: string;
      distance: number;
    };
    railwayStation: {
      name: string;
      distance: number;
    };
    busStop: {
      name: string;
      distance: number;
    };
  };
  images: string[];
  coverImage: string;
  amenities: string[];
  legalDocs: string[];
  room: {
    name: string;
    tag: string;
    basePrice: number;
    totalRoomsAllocated: number;
    maxOccupancy: number;
    area: number;
    beds: {
      type: string;
      count: number;
    };
    isWifiAvailable: boolean;
    isAirConditioned: boolean;
    hasCityView: boolean;
    hasSeaView: boolean;
    perks: string[];
    extras: {
      name: string;
      cost: number;
    }[];
    images: string[];
    coverImage: string;
  };
  taxIN: string;
  taxRates: {
    name: string;
    rate: number;
  }[];
  checkInTime: string;
  checkOutTime: string;
  isBookNowPayLaterAllowed: boolean;
  checkInRulesAndRestrictions: string;
  groundRulesAndRestrictions: string;
  cancellationPolicy: string;
  socialMediaLinks: {
    name: string;
    link: string;
  }[];
  tags: string[];
}

import { z } from "zod";

export const RegisterListingSchema = z.object({
  progress: z.number(),
  listingName: z.string(),
  listingType: z.string(),
  email: z.string().email(),
  phone: z.string(),
  description: z.string(),
  geometry: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
  }),  address: z.object({
    street: z.string(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    zipCode: z.string(),
    fullAddress: z.string(),
    landmark: z.string(),
  }),
  distanceFrom: z.object({
    touristDestinations: z.array(z.object({
      name: z.string(),
      distance: z.number(),
    })),
    airport: z.object({
      name: z.string(),
      distance: z.number(),
    }),
    railwayStation: z.object({
      name: z.string(),
      distance: z.number(),
    }),
    busStop: z.object({
      name: z.string(),
      distance: z.number(),
    }),
  }),
  images: z.array(z.string()),
  coverImage: z.string(),
  amenities: z.array(z.string()),
  legalDocs: z.array(z.string()),
  room: z.object({
    name: z.string(),
    tag: z.string(),
    basePrice: z.number(),
    totalRoomsAllocated: z.number(),
    maxOccupancy: z.number(),
    area: z.number(),
    beds: z.object({
      type: z.string(),
      count: z.number(),
    }),
    isWifiAvailable: z.boolean(),
    isAirConditioned: z.boolean(),
    hasCityView: z.boolean(),
    hasSeaView: z.boolean(),
    perks: z.array(z.string()),
    extras: z.array(z.object({
      name: z.string(),
      cost: z.number(),
    })),
    images: z.array(z.string()),
    coverImage: z.string(),
  }),
  taxIN: z.string(),
  taxRates: z.array(z.object({
    name: z.string(),
    rate: z.number(),
  })),
  checkInTime: z.string(),
  checkOutTime: z.string(),
  isBookNowPayLaterAllowed: z.boolean(),
  checkInRulesAndRestrictions: z.string(),
  groundRulesAndRestrictions: z.string(),
  cancellationPolicy: z.string(),
  socialMediaLinks: z.array(z.object({
    name: z.string(),
    link: z.string(),
  })),
  tags: z.array(z.string()),
});


const initialState: RegisterListing = {
  progress: 14,
  listingName: "",
  listingType: "Hotel",
  email: "",
  phone: "",
  description: "",
  geometry: null, // Initialize as null
  address: {
    street: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    fullAddress: "",
    landmark: "",
  },
  distanceFrom: {
    touristDestinations: [],
    airport: { name: "", distance: 0 },
    railwayStation: { name: "", distance: 0 },
    busStop: { name: "", distance: 0 },
  },
  images: [],
  coverImage: "",
  amenities: [],
  legalDocs: [],
  room: {
    name: "",
    tag: "",
    basePrice: 0,
    totalRoomsAllocated: 0,
    maxOccupancy: 0,
    area: 0,
    beds: {
      type: "",
      count: 0,
    },
    isWifiAvailable: false,
    isAirConditioned: false,
    hasCityView: false,
    hasSeaView: false,
    perks: [],
    extras: [
      {
        name: "No Extras",
        cost: 0,
      },
    ],
    images: [],
    coverImage: "",
  },
  taxIN: "",
  taxRates: [{ name: "", rate: 0 }],
  checkInTime: "",
  checkOutTime: "",
  isBookNowPayLaterAllowed: true,
  checkInRulesAndRestrictions: "",
  groundRulesAndRestrictions: "",
  cancellationPolicy: "",
  socialMediaLinks: [],
  tags: [],
};



export const registerListingSlice = createSlice({
  name: "new-listing",
  initialState,
  reducers: {
    // for the multi-stepper form progress steps
    nextStep: (state) => {
      state.progress += 1;
    },
    prevStep: (state) => {
      state.progress -= 1;
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    // to set listingName
    setListingName: (state, action: PayloadAction<string>) => {
      state.listingName = action.payload;
    },
    // to set listingType
    setListingType: (state, action: PayloadAction<string>) => {
      state.listingType = action.payload;
    },
    // to set email
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    // to set phone
    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },
    // to set description
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    // to set geometry
    setGeometry: (
      state,
      action: PayloadAction<{ lng: number; lat: number }>
    ) => {
      state.geometry = {
        type: "Point",
        coordinates: [action.payload.lng, action.payload.lat],
      };
    },
    // to set distanceFrom.touristDestination
    setDistanceFromTouristDestinations: (
      state,
      action: PayloadAction<{ name: string; distance: number }[]>
    ) => {
      state.distanceFrom.touristDestinations = action.payload;
    },
    // to set distanceFrom.airport
    setDistanceFromAirport: (
      state,
      action: PayloadAction<{ name: string; distance: number }>
    ) => {
      state.distanceFrom.airport = action.payload;
    },
    // to set distanceFrom.railwayStation
    setDistanceFromRailwayStation: (
      state,
      action: PayloadAction<{ name: string; distance: number }>
    ) => {
      state.distanceFrom.railwayStation = action.payload;
    },
    // to set distanceFrom.busStop
    setDistanceFromBusStop: (
      state,
      action: PayloadAction<{ name: string; distance: number }>
    ) => {
      state.distanceFrom.busStop = action.payload;
    },
    // to set address
    setAddress: (
      state,
      action: PayloadAction<{
        street: string;
        neighborhood: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
        fullAddress: string;
        landmark?: string;
      }>
    ) => {
      state.address = {
        street: action.payload.street,
        neighborhood: action.payload.neighborhood,
        city: action.payload.city,
        state: action.payload.state,
        country: action.payload.country,
        zipCode: action.payload.zipCode,
        landmark: action.payload.landmark,
        fullAddress: action.payload.fullAddress,
      };
    },
    // to push new images
    pushImage: (state, action: PayloadAction<string>) => {
      state.images.push(action.payload);
    },
    // to remove images
    removeImage: (state, action: PayloadAction<string>) => {
      state.images = state.images.filter((img) => img !== action.payload);
    },
    // to set cover image
    setCoverImage: (state, action: PayloadAction<string>) => {
      state.coverImage = action.payload;
    },
    // to set amenities
    pushAmenity: (state, action: PayloadAction<string>) => {
      state.amenities.push(action.payload);
    },
    // to remove amenities
    removeAmenity: (state, action: PayloadAction<string>) => {
      state.amenities = state.amenities.filter(
        (amenity) => amenity !== action.payload
      );
    },
    // to set legalDocs
    pushLegalDocs: (state, action: PayloadAction<string>) => {
      state.legalDocs.push(action.payload);
    },
    // to remove legalDocs
    removeLegalDocs: (state, action: PayloadAction<string>) => {
      state.legalDocs = state.legalDocs.filter(
        (legalDoc) => legalDoc !== action.payload
      );
    },
    // to set room details
    setRoom: (state, action: PayloadAction<typeof state.room>) => {
      state.room = action.payload;
    },
    // to push room images
    pushRoomImage: (state, action: PayloadAction<string>) => {
      state.room.images.push(action.payload);
    },
    // to remove room images
    removeRoomImage: (state, action: PayloadAction<string>) => {
      state.room.images = state.room.images.filter(
        (img) => img !== action.payload
      );
    },
    // to set room cover image
    setRoomCoverImage: (state, action: PayloadAction<string>) => {
      state.room.coverImage = action.payload;
    },
    // to set taxIN
    setTaxIN: (state, action: PayloadAction<string>) => {
      state.taxIN = action.payload;
    },
    // to set taxRates
    setTaxRates: (state, action: PayloadAction<typeof state.taxRates>) => {
      state.taxRates = action.payload;
    },
    // to set checkInTime
    setCheckInTime: (state, action: PayloadAction<string>) => {
      state.checkInTime = action.payload;
    },
    // to set checkOutTime
    setCheckOutTime: (state, action: PayloadAction<string>) => {
      state.checkOutTime = action.payload;
    },
    // to set checkInRulesAndRestrictions
    setCheckInRulesAndRestrictions: (state, action: PayloadAction<string>) => {
      state.checkInRulesAndRestrictions = action.payload;
    },
    // to set groundRulesAndRestrictions
    setGroundRulesAndRestrictions: (state, action: PayloadAction<string>) => {
      state.groundRulesAndRestrictions = action.payload;
    },
    // to set cancellationPolicy
    setCancellationPolicy: (state, action: PayloadAction<string>) => {
      state.cancellationPolicy = action.payload;
    },
    // to set socialMediaLinks
    setSocialMediaLinks: (
      state,
      action: PayloadAction<typeof state.socialMediaLinks>
    ) => {
      state.socialMediaLinks = action.payload;
    },
    // to set tags
    setTags: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload;
    },
    // to set isBookNowPayLaterAllowed
    setIsBookNowPayLater: (state, action: PayloadAction<boolean>) => {
      state.isBookNowPayLaterAllowed = action.payload;
    },
    // initialize the store with default values
    loadRegisterListingSlice: (
      state,
      action: PayloadAction<RegisterListing>
    ) => {
      state = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  loadRegisterListingSlice,
  nextStep,
  prevStep,
  setStep,
  setListingName,
  setListingType,
  setEmail,
  setPhone,
  setDescription,
  setGeometry,
  setAddress,
  setDistanceFromBusStop,
  setDistanceFromTouristDestinations,
  setDistanceFromAirport,
  setDistanceFromRailwayStation,
  pushImage,
  removeImage,
  setCoverImage,
  pushAmenity,
  removeAmenity,
  pushLegalDocs,
  removeLegalDocs,
  setRoom,
  pushRoomImage,
  removeRoomImage,
  setRoomCoverImage,
  setTaxIN,
  setTaxRates,
  setCheckInTime,
  setCheckOutTime,
  setCheckInRulesAndRestrictions,
  setGroundRulesAndRestrictions,
  setCancellationPolicy,
  setSocialMediaLinks,
  setTags,
  setIsBookNowPayLater,
} = registerListingSlice.actions;export default registerListingSlice.reducer;
