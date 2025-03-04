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
  progress: z.number().min(1).max(14),
  listingName: z.string(),
  listingType: z.string(),
  email: z.string().email(),
  phone: z.string(),
  description: z.string(),
  geometry: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
  address: z.object({
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
    touristDestinations: z.array(
      z.object({
        name: z.string(),
        distance: z.number(),
      })
    ),
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
    extras: z.array(
      z.object({
        name: z.string(),
        cost: z.number(),
      })
    ),
    images: z.array(z.string()),
    coverImage: z.string(),
  }),
  taxIN: z.string(),
  taxRates: z.array(
    z.object({
      name: z.string(),
      rate: z.number(),
    })
  ),
  checkInTime: z.string(),
  checkOutTime: z.string(),
  isBookNowPayLaterAllowed: z.boolean(),
  checkInRulesAndRestrictions: z.string(),
  groundRulesAndRestrictions: z.string(),
  cancellationPolicy: z.string(),
  socialMediaLinks: z.array(
    z.object({
      name: z.string(),
      link: z.string(),
    })
  ),
  tags: z.array(z.string()),
});

// export const initialState: RegisterListing = {
//   progress: 1,
//   listingName: "",
//   listingType: "Hotel",
//   email: "",
//   phone: "",
//   description: "",
//   geometry: null, // Initialize as null
//   address: {
//     street: "",
//     neighborhood: "",
//     city: "",
//     state: "",
//     country: "",
//     zipCode: "",
//     fullAddress: "",
//     landmark: "",
//   },
//   distanceFrom: {
//     touristDestinations: [],
//     airport: { name: "", distance: 0 },
//     railwayStation: { name: "", distance: 0 },
//     busStop: { name: "", distance: 0 },
//   },
//   images: [],
//   coverImage: "",
//   amenities: [],
//   legalDocs: [],
//   room: {
//     name: "",
//     tag: "",
//     basePrice: 0,
//     totalRoomsAllocated: 0,
//     maxOccupancy: 0,
//     area: 0,
//     beds: {
//       type: "",
//       count: 0,
//     },
//     isWifiAvailable: false,
//     isAirConditioned: false,
//     hasCityView: false,
//     hasSeaView: false,
//     perks: [],
//     extras: [
//       {
//         name: "No Extras",
//         cost: 0,
//       },
//     ],
//     images: [],
//     coverImage: "",
//   },
//   taxIN: "",
//   taxRates: [{ name: "", rate: 0 }],
//   checkInTime: "",
//   checkOutTime: "",
//   isBookNowPayLaterAllowed: true,
//   checkInRulesAndRestrictions: "",
//   groundRulesAndRestrictions: "",
//   cancellationPolicy: "",
//   socialMediaLinks: [],
//   tags: [],
// };

export const initialState: RegisterListing = {
  progress: 14,
  listingName: "Hotel Aloha, Boston",
  listingType: "Hotel",
  email: "info@hotelaloha.us",
  phone: "+16175551234",
  description:
    "<p><strong>Hotel Aloha Boston</strong> is a modern and stylish retreat in the heart of Boston, offering a perfect blend of comfort and convenience for travelers. Located just minutes away from popular attractions like Fenway Park, Quincy Market, and the Boston Common, our hotel provides easy access to the city's vibrant culture and historic landmarks.</p><p>Guests can enjoy well-appointed rooms with plush bedding, high-speed Wi-Fi, and stunning city views. Our on-site restaurant serves a variety of delicious dishes, while the rooftop bar offers a relaxing space to unwind with handcrafted cocktails. Additional amenities include a fitness center, business lounge, and 24/7 concierge service to ensure a seamless stay.</p><p>Whether you're visiting for business or leisure, <strong>Hotel Aloha Boston</strong> promises a memorable experience with top-notch hospitality and modern comforts.</p>",
  geometry: {
    type: "Point",
    coordinates: [-71.06826600265539, 42.35107928945507],
  },
  address: {
    street: "91-95 Church Street",
    neighborhood: "Boston Common",
    city: "Boston",
    state: "Massachusetts",
    country: "United States",
    zipCode: "02116",
    fullAddress:
      "91-95 Church Street, Boston, Massachusetts 02116, United States",
  },
  distanceFrom: {
    touristDestinations: [
      {
        name: "Boston Musuem",
        distance: 1.2,
      },
      {
        name: "Boston City Center",
        distance: 1.8,
      },
    ],
    airport: {
      name: "Boston Logan International Airport (BOS)",
      distance: 4.34,
    },
    railwayStation: {
      name: "Mbta West Medford",
      distance: 9.52,
    },
    busStop: {
      name: "Plymouth & Brockton Park Plaza Bus Stop",
      distance: 0.08,
    },
  },
  images: [
    "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-db976088b8a35ce11791ff1fa73575e256ed71447cb669e55091b6907c364b73",
    "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-651b368ada4092b2753c9b0a5b19f2a0f69279fe55b80101522c0fdc936d5bb3",
    "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-b994f4becfd57b42c3c26801bc1d0e25040044b670c263675c614667057ee582",
    "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-54860f4b1dfa675d2526f8aba026a01935f055b05a6ea7ab81a1c47f3445ba03",
    "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-6c493b2cae7599a4f9b5112151ce43c9a73816a7a41be266c0508232f4bec801",
    "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-7887421b8eb06b5aa4ec6606d3cb10f0c4046f4ad284af417b7983884fb8307c",
    "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-65ef293bf368d8b83f5d54dbd7d14c0e66585fb711d09acaef351bba98f95b3a",
    "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-997c16b9ddfdfd26c881a59d1a18336d0335a118242c224b3247f407a29f5730",
    "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-bbab97ce70b6a7fc708c3646f5e214b95dfa5a553652b83e4b14ffb56989d92f",
  ],
  coverImage:
    "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-65ef293bf368d8b83f5d54dbd7d14c0e66585fb711d09acaef351bba98f95b3a",
  amenities: [
    "WiFi",
    "King-Size Bed",
    "Restaurant",
    "24/7 Room Service",
    "Air Conditioning",
    "Swimming Pool",
    "Local Dining",
    "Housekeeping",
    "Bath/Shower",
    "Free Parking",
    "Spa",
    "Laundry Service",
    "Play Area",
    "Microwave",
    "Refrigerator",
    "TV",
    "Hair Dryer",
    "Baggage Storage",
    "Smoking Allowed",
    "Bar",
    "Power Backup",
    "Safe Locker",
    "24/7 Help Desk",
    "Security Alarm",
    "Smoke Detector",
    "CCTV Camera",
    "Key Card Access",
    "Fire Extinguisher",
    "Elevator",
    "Wheelchair Accessible",
    "Conference Room",
    "Business Center",
    "Meeting Room",
    "Concierge Service",
    "Tour Assistance",
    "Multi Linguage Staff",
    "ATM",
    "Currency Exchange",
    "Airport Shuttle",
  ],
  legalDocs: [
    "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-222620598239c0ee7f2b34b2f9d0cc1b0410959b86e8d26f8ffedb802a70cc07",
    "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-ac241100fee2513b399dfb411ec8c87849281ccfc5e21a043482a2749f6e1369",
    "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-1bccbd7abb5a1f409c3b084254f550e0d5042812d92a21b083049e71509ca96e",
    "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-7d2a2722078670e84c5cf66ff9fe9dd7bbc3855eeff4fb919d44acab212ccf8b",
    "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-99f92bf2d00d0e112cf764b7be94751563dcce52fa3e436ce72028acc2cd1faf",
    "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-9b41e84d28e47d7c926f6cd83ecf104fcff474f76ec179244904533b523121b4",
    "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-73cc9a29056666f871dc1008d072cded96d5807984df7419ef9121df261b4dec",
    "https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-fd5ad7117c4264f5e0ba61fa956f33b6d42b566161651fc2464d3f977765bebb",
  ],
  room: {
    name: "Deluxe Room",
    tag: "Best for business travellers.",
    basePrice: 1000,
    totalRoomsAllocated: 50,
    maxOccupancy: 2,
    area: 150,
    beds: {
      type: "King Size Bed",
      count: 1,
    },
    isWifiAvailable: true,
    isAirConditioned: true,
    hasCityView: true,
    hasSeaView: false,
    perks: ["Free Welcome Drink"],
    extras: [
      {
        name: "No Extras",
        cost: 0,
      },
      {
        name: "Breakfast Buffet",
        cost: 650,
      },
      {
        name: "Lunch Buffet",
        cost: 750,
      },
      {
        name: "Dinner Buffet",
        cost: 850,
      },
      {
        name: "Breakfast + Lunch + Dinner Buffet",
        cost: 2000,
      },
    ],
    images: [
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/room-12ff351abd8ba4aa5a78a70b5b36dab300297cec4dc76ddd7fc3d349e6a4c190",
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/room-8b6c8a6c966523943dc56bddbbbf4f957c239b301c78d5e366c438cdb16b5748",
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/room-1f875d4952f8f3a3a34df0d880d4c4dc64c1651dc7967b9cd7b334c11fa0006c",
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/room-ab54e924e18667cf1babfdfe4a5ccaff74615dc1c3128594f9df23cd343d88e7",
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/room-15cb99a68df05276c1ed2347122fba64c3033ffa446e4cd13bf2926c534f385f",
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/room-4b8ae1bbe6ad627f8c142a4d9722a3b8440d8532c8a499b891a2abd2111f7de3",
    ],
    coverImage:
      "https://exploreinn-local.s3.ap-south-1.amazonaws.com/room-1f875d4952f8f3a3a34df0d880d4c4dc64c1651dc7967b9cd7b334c11fa0006c",
  },
  taxIN: "NWDN2EREQNJKO2",
  taxRates: [
    {
      name: "State Room Occupancy Excise Tax",
      rate: 5.7,
    },
    {
      name: "Local Option Room Occupancy Tax",
      rate: 2.5,
    },
    {
      name: "Convention Center Financing Fee",
      rate: 2.2,
    },
    {
      name: "Tourism Assessment Fee",
      rate: 1.5,
    },
  ],
  checkInTime: "10:30",
  checkOutTime: "09:30",
  isBookNowPayLaterAllowed: true,
  checkInRulesAndRestrictions:
    '<h3 class=" text-base lg:text-lg font-semibold"><strong>Check-in Instructions</strong></h3><ul class="mt-2 ml-6 list-disc [&amp;>li]:mt-2"><li><p>Check-in time: <strong>3:00 PM</strong></p></li><li><p>Check-out time: <strong>11:00 AM</strong></p></li><li><p>A valid government-issued ID and credit/debit card are required at check-in.</p></li><li><p>Early check-in is subject to availability and may incur additional charges.</p></li><li><p>Guests must be <strong>18 years or older</strong> to check in.</p><p>By booking a stay at <strong>Hotel Aloha Boston</strong>, guests agree to abide by these rules and regulations.</p></li></ul>',
  groundRulesAndRestrictions:
    '<h3 class=" text-base lg:text-lg font-semibold"><strong>Hotel Rules &amp; Regulations</strong></h3><ol class="mt-2 ml-6 list-decimal [&amp;>li]:mt-2"><li><p><strong>No Smoking</strong> – This is a smoke-free property. A cleaning fee of <strong>$250</strong> will be charged for violations.</p></li><li><p><strong>No Pets Allowed</strong> – Service animals are welcome with proper documentation.</p></li><li><p><strong>Quiet Hours</strong> – Maintain low noise levels between <strong>10:00 PM and 7:00 AM</strong>.</p></li><li><p><strong>Guest Limit</strong> – Maximum of <strong>2 guests per room</strong> unless specified otherwise.</p></li><li><p><strong>Damage Policy</strong> – Any damages to the property will be charged to the guest’s registered payment method.</p></li><li><p><strong>Lost &amp; Found</strong> – The hotel is not responsible for lost or stolen items.</p></li><li><p><strong>Visitors Policy</strong> – Unregistered visitors are not allowed in guest rooms after <strong>10:00 PM</strong>.</p></li><li><p><strong>Alcohol &amp; Drug Policy</strong> – Consumption of alcohol is permitted only in designated areas. Illegal substances are strictly prohibited.</p><p>By booking a stay at <strong>Hotel Aloha Boston</strong>, guests agree to abide by these rules and regulations.</p></li></ol>',
  cancellationPolicy:
    '<h3 class=" text-base lg:text-lg font-semibold"><strong>Cancellation Policy for Hotel Aloha Boston</strong></h3><ol class="mt-2 ml-6 list-decimal [&amp;>li]:mt-2"><li><p><strong>Flexible Cancellation</strong> – Free cancellation if canceled <strong>at least 48 hours</strong> before the check-in date.</p></li><li><p><strong>Late Cancellation Fee</strong> – If canceled within <strong>48 hours of check-in</strong>, a fee equal to <strong>the first night\'s stay</strong> will be charged.</p></li><li><p><strong>No-Show Policy</strong> – If a guest does not check in and fails to cancel, they will be charged <strong>100% of the total booking amount</strong>.</p></li><li><p><strong>Non-Refundable Rates</strong> – Certain discounted bookings may be <strong>non-refundable</strong>, meaning no refunds will be issued upon cancellation.</p></li><li><p><strong>Modifications</strong> – Date changes are allowed <strong>up to 24 hours</strong> before check-in, subject to availability and possible rate adjustments.</p></li></ol><p>For any cancellations or modifications, guests must contact customer support or manage their booking through the<strong> exploreInn</strong> platform.</p>',
  socialMediaLinks: [
    {
      name: "Instagram",
      link: "https://instagram/accounts/hotel-aloha-boston",
    },
    {
      name: "Twitter",
      link: "https://twitter/accounts/hotel-aloha-boston",
    },
  ],
  tags: ["Luxury Stay", "Urban Retreat", "Downtown Boston"],
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
} = registerListingSlice.actions;
export default registerListingSlice.reducer;
