export const userRewardPointsHistory = [
  {
    description: "Booked a Hotel",
    points: 500,
    date: new Date("24 Nov 2024"),
  },
  {
    description: "Redeemed Reward Points",
    points: -584,
    date: new Date("20 Nov 2024"),
  },
  {
    description: "Left a Review for a Hotel",
    points: 200,
    date: new Date("15 Nov 2024"),
  },
  {
    description: "Engaged with Community",
    points: 100,
    date: new Date("10 Nov 2024"),
  },
  {
    description: "Booked a Hotel",
    points: 800,
    date: new Date("5 Nov 2024"),
  },
];

// create and export types for a single offer

export type Offer = {
  id: string;
  title: string;
  description: string;
  code: string;
  discountPercentage: number | null;
  discountAmount: number | null;
  offerType: string;
  validForMonths: number;
  points: number;
  minBookingAmount: number;
  // later convert the minBookingAmount to respective user's currency using
};

export const offers: Offer[] = [
  {
    id: "a1b2c3d4e5f6",
    title: "Weekend Getaway Special",
    description: "Get 25% off on weekend hotel bookings",
    code: "WEEKEND25",
    discountPercentage: 25,
    discountAmount: null,
    offerType: "percentage discount",
    validForMonths: 3,
    points: 1000,
    minBookingAmount: 200,
    // later convert the minBookingAmount to respective user's currency using
  },
  {
    id: "f7e6d5c4b3a2",
    title: "Luxury Stay Discount",
    description: "Flat $100 off on luxury hotel bookings",
    code: "LUXURY100",
    discountPercentage: null,
    discountAmount: 100,
    offerType: "amount discount",
    validForMonths: 2,
    points: 800,
    minBookingAmount: 500,
    // later convert the minBookingAmount to respective user's currency using
  },
  {
    id: "9a8b7c6d5e4f",
    title: "Summer Holiday Deal",
    description: "15% discount on summer vacation packages",
    code: "SUMMER15",
    discountPercentage: 15,
    discountAmount: null,
    offerType: "percentage discount",
    validForMonths: 4,
    points: 600,
    minBookingAmount: 300,
    // later convert the minBookingAmount to respective user's currency using
  },
  {
    id: "1d2e3f4a5b6c",
    title: "Business Travel Offer",
    description: "Get $50 off on business hotel bookings",
    code: "BIZ50",
    discountPercentage: null,
    discountAmount: 50,
    offerType: "amount discount",
    validForMonths: 6,
    points: 500,
    minBookingAmount: 250,
    // later convert the minBookingAmount to respective user's currency using
  },
  {
    id: "7g8h9i1j2k3l",
    title: "Family Package Discount",
    description: "30% off on family room bookings",
    code: "FAMILY30",
    discountPercentage: 30,
    discountAmount: null,
    offerType: "percentage discount",
    validForMonths: 2,
    points: 1200,
    minBookingAmount: 400,
    // later convert the minBookingAmount to respective user's currency using
  },

];

export const userOffers = [
  {
    offer: offers[0],
    redeemedOn: new Date("15 Nov 2024"),
    isAvailable: true,
  },
  {
    offer: offers[2],
    redeemedOn: new Date("10 Nov 2024"),
    isAvailable: true,
  },
  {
    offer: offers[4],
    redeemedOn: new Date("5 Nov 2024"),
    isAvailable: true,
  },
];
