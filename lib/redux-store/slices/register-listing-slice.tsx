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
}

const initialState: RegisterListing = {
  progress: 1,
  listingName: "",
  listingType: "Hotel",
  email: "",
  phone: "",
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
  },
});

// Action creators are generated for each case reducer function
export const {
  nextStep,
  prevStep,
  setStep,
  setListingName,
  setListingType,
  setEmail,
  setPhone,
  setGeometry,
  setAddress,
} = registerListingSlice.actions;

export default registerListingSlice.reducer;
