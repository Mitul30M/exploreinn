import { offerType } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface NewBooking {
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  rooms: {
    roomID: string;
    name: string;
    rate: number;
    noOfRooms: number;
  }[];
  taxes: { name: string; rate: number }[];
  extras: {
    name: string;
    cost: number;
  }[];
  totalWithoutTaxes: number;
  isOfferApplied: boolean;
  couponCode?: string;
  offerId?: string;
  offerType?: offerType | null;
  offerName?: string;
  offerDescription?: string;
  discountPercentage?: number;
  maxAllowedDiscountAmount: number;
  discountedAmount: number;
  minBookingFeeToApplyOffer: number;
  tax: number;
  totalPayable: number;
}

const initialState: NewBooking = {
  checkIn: "",
  checkOut: "",
  nights: 0,
  guests: 1,
  rooms: [],
  taxes: [],
  extras: [{ name: "No Extras", cost: 0 }],
  totalWithoutTaxes: 0,
  tax: 0,
  totalPayable: 0,
  isOfferApplied: false,
  couponCode: "",
  offerId: "",
  offerType: null,
  offerName: "",
  offerDescription: "",
  discountPercentage: 0,
  maxAllowedDiscountAmount: 0,
  discountedAmount: 0,
  minBookingFeeToApplyOffer: 0,
};

export const newBookingSlice = createSlice({
  name: "new-booking",
  initialState,
  reducers: {
    //   set checkIn & checkOut
    setCheckIn: (state, action: PayloadAction<string>) => {
      state.checkIn = action.payload;
    },
    setCheckOut: (state, action: PayloadAction<string>) => {
      state.checkOut = action.payload;
    },
    // set nigths
    setNights: (state, action: PayloadAction<number>) => {
      state.nights = action.payload;
    },
    //   add guests
    incGuests: (state) => {
      state.guests = ++state.guests;
    },
    decGuests: (state) => {
      state.guests = --state.guests;
    },
    //   add rooms
    addRoom: (
      state,
      action: PayloadAction<{ roomID: string; name: string; rate: number }>
    ) => {
      const existingRoom = state.rooms.find(
        (room) => room.roomID === action.payload.roomID
      );
      if (existingRoom) {
        existingRoom.noOfRooms++;
      } else {
        state.rooms.push({ ...action.payload, noOfRooms: 1 });
      }
    },
    //   remove room
    removeRoom: (state, action: PayloadAction<string>) => {
      const existingRoom = state.rooms.find(
        (room) => room.roomID === action.payload
      );
      if (existingRoom) {
        if (existingRoom.noOfRooms > 1) {
          existingRoom.noOfRooms--;
        } else {
          state.rooms = state.rooms.filter(
            (room) => room.roomID !== action.payload
          );
        }
      }
    },
    // add discount
    setDiscount: (
      state,
      action: PayloadAction<{
        couponCode: string;
        offerId: string;
        offerType: offerType | null;
        offerName: string;
        offerDescription: string;
        discountPercentage: number;
        maxAllowedDiscountAmount: number;
        minBookingFeeToApplyOffer: number;
      }>
    ) => {
      state.couponCode = action.payload.couponCode.toUpperCase();
      state.offerId = action.payload.offerId;
      state.offerType = action.payload.offerType;
      state.offerName = action.payload.offerName;
      state.offerDescription = action.payload.offerDescription;
      state.discountPercentage = action.payload.discountPercentage;
      state.maxAllowedDiscountAmount = action.payload.maxAllowedDiscountAmount;
      state.minBookingFeeToApplyOffer =
        action.payload.minBookingFeeToApplyOffer;
      state.isOfferApplied = true;
    },
    //   remove discount
    removeDiscount: (state) => {
      state.couponCode = "";
      state.offerId = "";
      state.offerType = null;
      state.offerName = "";
      state.offerDescription = "";
      state.discountPercentage = 0;
      state.maxAllowedDiscountAmount = 0;
      state.discountedAmount = 0;
      state.isOfferApplied = false;
      state.minBookingFeeToApplyOffer = 0;
    },
    //   add taxes
    setTax: (
      state,
      action: PayloadAction<{ name: string; rate: number }[]>
    ) => {
      state.taxes = action.payload;
    },
    // add extras
    addExtra: (
      state,
      action: PayloadAction<{ name: string; cost: number }>
    ) => {
      state.extras.push(action.payload);
    },
    // remove extra
    removeExtra: (state, action: PayloadAction<string>) => {
      state.extras = state.extras.filter(
        (extra) => extra.name !== action.payload
      );
    },
    // reset extras
    resetExtras: (state) => {
      state.extras = [{ name: "No Extras", cost: 0 }];
    },
    // total without taxes
    calculateTotal: (state) => {
      const roomsTotal = state.rooms.reduce((total, room) => {
        return total + room.rate * room.noOfRooms * state.nights;
      }, 0);

      const extrasTotal = state.extras.reduce((total, extra) => {
        return total + state.guests * extra.cost * state.nights;
      }, 0);

      if (state.isOfferApplied) {
        if (roomsTotal + extrasTotal >= state.minBookingFeeToApplyOffer) {
          switch (state.offerType) {
            case "Flat_Discount":
              state.discountedAmount = state.maxAllowedDiscountAmount;
              break;
            case "Percentage_Discount":
              const discountedAmount =
                (roomsTotal + extrasTotal) * (state.discountPercentage! / 100);
              state.discountedAmount =
                state.maxAllowedDiscountAmount > discountedAmount
                  ? discountedAmount
                  : state.maxAllowedDiscountAmount;
              break;
            default:
              state.discountedAmount = 0;
          }
        }
      }

      state.totalWithoutTaxes =
        roomsTotal + extrasTotal - state.discountedAmount;
    },

    // calculate tax
    calculateTax: (state) => {
      const tax = state.taxes.reduce((total, tax) => {
        return total + tax.rate;
      }, 0);
      state.tax = (tax * state.totalWithoutTaxes) / 100;
    },
    // calculate total payable
    calculateTotalPayable: (state) => {
      state.totalPayable = state.totalWithoutTaxes + state.tax;
    },
  },
});

export const {
  setCheckIn,
  setCheckOut,
  setNights,
  incGuests,
  decGuests,
  addRoom,
  removeRoom,
  setTax,
  addExtra,
  removeExtra,
  setDiscount,
  removeDiscount,
  calculateTotal,
  calculateTax,
  calculateTotalPayable,
} = newBookingSlice.actions;
export default newBookingSlice.reducer;
