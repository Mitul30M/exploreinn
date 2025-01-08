import { configureStore } from "@reduxjs/toolkit";
import { registerListingSlice } from "./slices/register-listing-slice";
import { newBookingSlice } from "./slices/new-booking-slice";
export const makeStore = () => {
  return configureStore({
    reducer: {
      registerListing: registerListingSlice.reducer,
      newBooking: newBookingSlice.reducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
