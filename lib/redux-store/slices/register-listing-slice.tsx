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
  listingName: z.string(),  listingType: z.string(),
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

// const initialState: RegisterListing = {
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

// export const initialState: RegisterListing = {
//   progress: 14,
//   listingName: "Hotel Aloha Boston",
//   listingType: "Hotel",
//   email: "contact@hotelalohaboston.com",
//   phone: "+1-617-555-0123",
//   description:
//     "Experience the perfect blend of Hawaiian hospitality and Boston charm at Hotel Aloha Boston. Located in the heart of downtown, our luxury hotel offers stunning city views and easy access to major attractions.",
//   geometry: {
//     type: "Point",
//     coordinates: [-71.0589, 42.3601], // Boston coordinates
//   },
//   address: {
//     street: "123 Beacon Street",
//     neighborhood: "Financial District",
//     city: "Boston",
//     state: "Massachusetts",
//     country: "United States",
//     zipCode: "02108",
//     fullAddress: "123 Beacon Street, Boston, MA 02108",
//     landmark: "Near Boston Common",
//   },
//   distanceFrom: {
//     touristDestinations: [
//       { name: "Fenway Park", distance: 2.5 },
//       { name: "Freedom Trail", distance: 0.5 },
//       { name: "Boston Common", distance: 0.3 },
//     ],
//     airport: { name: "Boston Logan International Airport", distance: 4.2 },
//     railwayStation: { name: "South Station", distance: 1.5 },
//     busStop: { name: "Beacon Street Station", distance: 0.2 },
//   },
//   images: ["hotel-front.jpg", "lobby.jpg", "restaurant.jpg", "pool.jpg"],
//   coverImage: "hotel-front.jpg",
//   amenities: [
//     "Swimming Pool",
//     "Fitness Center",
//     "Spa",
//     "Restaurant",
//     "Bar/Lounge",
//     "Business Center",
//     "Valet Parking",
//     "24/7 Room Service",
//   ],
//   legalDocs: [
//     "business-license.pdf",
//     "safety-certificate.pdf",
//     "insurance-doc.pdf",
//   ],
//   room: {
//     name: "Ocean Deluxe King",
//     tag: "premium",
//     basePrice: 299,
//     totalRoomsAllocated: 50,
//     maxOccupancy: 3,
//     area: 400,
//     beds: {
//       type: "King",
//       count: 1,
//     },
//     isWifiAvailable: true,
//     isAirConditioned: true,
//     hasCityView: true,
//     hasSeaView: false,
//     perks: ["Complimentary Breakfast", "Mini Bar", "Smart TV", "Coffee Maker"],
//     extras: [
//       {
//         name: "Airport Transfer",
//         cost: 75,
//       },
//       {
//         name: "Spa Package",
//         cost: 120,
//       },
//     ],
//     images: ["room-1.jpg", "bathroom-1.jpg", "view-1.jpg"],
//     coverImage: "room-1.jpg",
//   },
//   taxIN: "82-1234567",
//   taxRates: [
//     { name: "State Tax", rate: 5.7 },
//     { name: "City Tax", rate: 6.0 },
//   ],
//   checkInTime: "15:00",
//   checkOutTime: "11:00",
//   isBookNowPayLaterAllowed: true,
//   checkInRulesAndRestrictions:
//     "Valid government-issued ID required. Credit card required for incidental charges.",
//   groundRulesAndRestrictions:
//     "No smoking. No pets allowed. Quiet hours from 10 PM to 7 AM.",
//   cancellationPolicy:
//     "Free cancellation up to 48 hours before check-in. One night charge for later cancellations.",
//   socialMediaLinks: [
//     {
//       name: "Instagram",
//       link: "https://instagram.com/hotelalohaboston",
//     },
//     {
//       name: "Twitter",
//       link: "https://twitter.com/hotelalohaMA",
//     },
//   ],
//   tags: [
//     "Luxury",
//     "Business",
//     "City Center",
//     "Family Friendly",
//     "Historic District",
//   ],
// };

  export const initialState: RegisterListing = {
    progress: 14,
    listingName: 'Hotel Aloha, Boston',
    listingType: 'Hotel',
    email: 'info@hotelaloha.us',
    phone: '+16175551234',
    description: '<p>Pellentesque ac leo nulla. Suspendisse et mattis eros, volutpat tempor velit. Aenean placerat eros eu dui porttitor sollicitudin. Sed eu convallis nisi. Vivamus bibendum enim quis ante lobortis, sit amet porttitor urna malesuada. Nunc faucibus malesuada ex consectetur convallis. In tellus mauris, pulvinar ut ipsum at, vestibulum commodo ipsum. Nulla non turpis mauris. Aliquam et risus et tellus malesuada accumsan. Nunc a ante sed tellus maximus interdum. Nam condimentum sollicitudin mi, eget rhoncus quam tincidunt porta. Aliquam dignissim ullamcorper dolor sit amet malesuada. Morbi eu est vehicula magna consectetur condimentum. Nam rutrum nec justo eu euismod.</p><p>Maecenas sit amet vehicula leo. Nulla rhoncus sodales eros. Cras placerat ut sapien nec efficitur. Donec magna purus, imperdiet in aliquam id, laoreet pharetra ex. Suspendisse vulputate eget arcu vel scelerisque. Cras nec lorem id odio ultricies vestibulum. Etiam luctus ut urna eget placerat. Morbi eu enim turpis. Morbi vel ultrices lacus. Sed in volutpat orci. Duis semper massa sed velit dapibus elementum. Nulla vel elementum nulla. Nullam vel elit eget neque vehicula dapibus in non eros. In non odio et odio commodo molestie.</p><p>Quisque commodo, ex eget auctor sollicitudin, diam arcu lobortis metus, a feugiat felis mi in mi. Suspendisse potenti. Nunc ornare volutpat felis in egestas. Nunc vitae quam congue velit iaculis scelerisque. Etiam aliquam libero ac eros rhoncus, in mattis justo fermentum. Nulla facilisi. Aliquam ac pellentesque enim, non pretium dui. Donec eget lectus auctor, ultrices augue vitae, vulputate ipsum. Etiam at aliquet enim. Aenean semper consectetur risus, non pharetra magna rutrum non. Duis justo lorem, semper sit amet lacus sit amet, vulputate pulvinar turpis.</p>',
    geometry: {
      type: 'Point',
      coordinates: [
        -71.07463251661498,
        42.35129882553639
      ]
    },
    address: {
      street: '501b Boylston Street',
      neighborhood: 'Newbury Street',
      city: 'Boston',
      state: 'Massachusetts',
      country: 'United States',
      zipCode: '02116',
      fullAddress: '501b Boylston Street, Boston, Massachusetts 02116, United States'
    },
    distanceFrom: {
      touristDestinations: [
        {
          name: 'Boston Musuem',
          distance: 1.2
        },
        {
          name: 'Boston City Center',
          distance: 1.8
        }
      ],
      airport: {
        name: 'Boston Logan International Airport (BOS)',
        distance: 4.83
      },
      railwayStation: {
        name: 'Mbta West Medford',
        distance: 9.22
      },
      busStop: {
        name: 'Boylston',
        distance: 0.13
      }
    },
    images: [
      'https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-eb8b628efb9e19d27314a47e588d64e8a59a9fec382c4bc28c805013cc8b77a1',
      'https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-b2199d4c4e1d13f8e56077ab64df9f8645fee3a7d7f9e186a9804d0037059e47',
      'https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-247ddd60813cb8b8d65bf7f6917af3986289e6bdb828865c7451b85fdb264b2a',
      'https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-01d34a247018e18bec799603191924e2915bb073fb6e084f3164efbdaf2390f4',
      'https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-dd27ba8d6a6e27802be30ac704ad103639a8ad33c5725c641be2fbf8d0f2b599',
      'https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-cbb7c24eb83714e9dc08dda5f33146a82386be58d2f898d971598cb6de9750f3',
      'https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-6dc512dc2cd85ba38c6bc5bb9c69d06675486f6018b59b2f52255f6d1d707d55',
      'https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-08365c4607b6d1ea16e17f0c4545e5dc6baa27355fc3d29986262ae2aa09eaba',
      'https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-6411f71a591df05726132f76f88e5b537cb5619a947195c89529d0023ae84533',
      'https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-d810c0daef4908e9abb4bf20205eaa7c6de12cf01587044c49d2ec97a6047d56'
    ],
    coverImage: 'https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-6411f71a591df05726132f76f88e5b537cb5619a947195c89529d0023ae84533',
    amenities: [
      'WiFi',
      'King-Size Bed',
      'Restaurant',
      '24/7 Room Service',
      'Air Conditioning',
      'Swimming Pool',
      'Local Dining',
      'Housekeeping',
      'Bath/Shower',
      'Free Parking',
      'Spa',
      'Laundry Service',
      'Play Area',
      'Microwave',
      'TV',
      'Hair Dryer',
      'Baggage Storage',
      'Smoking Allowed',
      'Bar',
      'Power Backup',
      'Safe Locker',
      '24/7 Help Desk',
      'Security Alarm',
      'Smoke Detector',
      'CCTV Camera',
      'Key Card Access',
      'Fire Extinguisher',
      'Elevator',
      'Wheelchair Accessible',
      'Conference Room',
      'Meeting Room',
      'Concierge Service',
      'Tour Assistance',
      'Multi Linguage Staff',
      'ATM',
      'Currency Exchange',
      'Car Rental',
      'Airport Shuttle',
      'In-house Casino'
    ],
    legalDocs: [
      'https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-5891a01fa628227fe6d590f58a022731498ce43b86ac74d78bec939b06a25632',
      'https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-0d09c51f5e5fdec786caad1878078027fc0279af322491824f841b66f722245a',
      'https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-e4ee6ef16b2e882e6d621201d44be164d808c07a8416e8a075bf8739e14fa448',
      'https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-a57521199cb29f0af9dd641fa72c92eff750930aa5c214b426bd995b72e5a45d',
      'https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-a3d479a3b5f2d8c87c344d74e44d8ca8ce01cdde99c108359d055ad6ae368c3c',
      'https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-247ea57587020896f817e3e69110830ca639de4db73e52e8cee525a4c9aa2cb8',
      'https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-7f255e70a7df8f25d62d6042edfbae611ac53cc0f4f655a76c548685aef2f4fc',
      'https://exploreinn-local.s3.ap-south-1.amazonaws.com/listing-legalDoc-49846f274bc69d6086334daa6b3e7005e662a356016c4fe17364ff4a78244e0f'
    ],
    room: {
      name: 'Deluxe Room',
      tag: 'Best for business travellers.',
      basePrice: 1000,
      totalRoomsAllocated: 50,
      maxOccupancy: 2,
      area: 100,
      beds: {
        type: 'King Size Bed',
        count: 1
      },
      isWifiAvailable: true,
      isAirConditioned: true,
      hasCityView: true,
      hasSeaView: false,
      perks: [
        'Free Welcome Drink'
      ],
      extras: [
        {
          name: 'No Extras',
          cost: 0
        },
        {
          name: 'Breakfast Buffet',
          cost: 650
        },
        {
          name: 'Lunch Buffet',
          cost: 750
        },
        {
          name: 'Dinner Buffet',
          cost: 850
        },
        {
          name: 'Breakfast + Lunch + Dinner Buffet',
          cost: 1550
        }
      ],
      images: [
        'https://exploreinn-local.s3.ap-south-1.amazonaws.com/room-2703c0883a35fd57dd173c648ea556c3ab82ea4ccd163978d4e56537cf380389',
        'https://exploreinn-local.s3.ap-south-1.amazonaws.com/room-c0786cd1e659981f197a9c88d6fe13daa08fd2b7fa749d1face4fd2de0aaf1f6',
        'https://exploreinn-local.s3.ap-south-1.amazonaws.com/room-952ebea588b8f19aa0fcd95824530df6a5b76f9ed3a1f6b0f57cfc6f85f3b50f',
        'https://exploreinn-local.s3.ap-south-1.amazonaws.com/room-f9ee081914fd0342c68ecf3e4aed78c6952edd95a57ee527b1d5b51a011df005',
        'https://exploreinn-local.s3.ap-south-1.amazonaws.com/room-b77df334c5f7003dd3fc1dce137e17f324eea1bca986857dfa9d65a1235cc891',
        'https://exploreinn-local.s3.ap-south-1.amazonaws.com/room-a382393ead658c63550fcbf2070379c7933c495e50b190eec9797c5606fcc8ac'
      ],
      coverImage: 'https://exploreinn-local.s3.ap-south-1.amazonaws.com/room-c0786cd1e659981f197a9c88d6fe13daa08fd2b7fa749d1face4fd2de0aaf1f6'
    },
    taxIN: 'NWDN2EREQNJKO2',
    taxRates: [
      {
        name: 'State Room Occupancy Excise Tax',
        rate: 5.7
      },
      {
        name: 'Local Option Room Occupancy Tax',
        rate: 2.5
      },
      {
        name: 'Convention Center Financing Fee',
        rate: 2.2
      },
      {
        name: 'Tourism Assessment Fee',
        rate: 4
      }
    ],
    checkInTime: '11:00',
    checkOutTime: '10:30',
    isBookNowPayLaterAllowed: true,
    checkInRulesAndRestrictions: '<p>Pellentesque ac leo nulla. Suspendisse et mattis eros, volutpat tempor velit. Aenean placerat eros eu dui porttitor sollicitudin. Sed eu convallis nisi. Vivamus bibendum enim quis ante lobortis, sit amet porttitor urna malesuada. Nunc faucibus malesuada ex consectetur convallis. In tellus mauris, pulvinar ut ipsum at, vestibulum commodo ipsum. Nulla non turpis mauris. Aliquam et risus et tellus malesuada accumsan. Nunc a ante sed tellus maximus interdum. Nam condimentum sollicitudin mi, eget rhoncus quam tincidunt porta. Aliquam dignissim ullamcorper dolor sit amet malesuada. Morbi eu est vehicula magna consectetur condimentum. Nam rutrum nec justo eu euismod.</p><p>Maecenas sit amet vehicula leo. Nulla rhoncus sodales eros. Cras placerat ut sapien nec efficitur. Donec magna purus, imperdiet in aliquam id, laoreet pharetra ex. Suspendisse vulputate eget arcu vel scelerisque. Cras nec lorem id odio ultricies vestibulum. Etiam luctus ut urna eget placerat. Morbi eu enim turpis. Morbi vel ultrices lacus. Sed in volutpat orci. Duis semper massa sed velit dapibus elementum. Nulla vel elementum nulla. Nullam vel elit eget neque vehicula dapibus in non eros. In non odio et odio commodo molestie.</p><p>Quisque commodo, ex eget auctor sollicitudin, diam arcu lobortis metus, a feugiat felis mi in mi. Suspendisse potenti. Nunc ornare volutpat felis in egestas. Nunc vitae quam congue velit iaculis scelerisque. Etiam aliquam libero ac eros rhoncus, in mattis justo fermentum. Nulla facilisi. Aliquam ac pellentesque enim, non pretium dui. Donec eget lectus auctor, ultrices augue vitae, vulputate ipsum. Etiam at aliquet enim. Aenean semper consectetur risus, non pharetra magna rutrum non. Duis justo lorem, semper sit amet lacus sit amet, vulputate pulvinar turpis.</p>',
    groundRulesAndRestrictions: '<p>Pellentesque ac leo nulla. Suspendisse et mattis eros, volutpat tempor velit. Aenean placerat eros eu dui porttitor sollicitudin. Sed eu convallis nisi. Vivamus bibendum enim quis ante lobortis, sit amet porttitor urna malesuada. Nunc faucibus malesuada ex consectetur convallis. In tellus mauris, pulvinar ut ipsum at, vestibulum commodo ipsum. Nulla non turpis mauris. Aliquam et risus et tellus malesuada accumsan. Nunc a ante sed tellus maximus interdum. Nam condimentum sollicitudin mi, eget rhoncus quam tincidunt porta. Aliquam dignissim ullamcorper dolor sit amet malesuada. Morbi eu est vehicula magna consectetur condimentum. Nam rutrum nec justo eu euismod.</p><p>Maecenas sit amet vehicula leo. Nulla rhoncus sodales eros. Cras placerat ut sapien nec efficitur. Donec magna purus, imperdiet in aliquam id, laoreet pharetra ex. Suspendisse vulputate eget arcu vel scelerisque. Cras nec lorem id odio ultricies vestibulum. Etiam luctus ut urna eget placerat. Morbi eu enim turpis. Morbi vel ultrices lacus. Sed in volutpat orci. Duis semper massa sed velit dapibus elementum. Nulla vel elementum nulla. Nullam vel elit eget neque vehicula dapibus in non eros. In non odio et odio commodo molestie.</p><p>Quisque commodo, ex eget auctor sollicitudin, diam arcu lobortis metus, a feugiat felis mi in mi. Suspendisse potenti. Nunc ornare volutpat felis in egestas. Nunc vitae quam congue velit iaculis scelerisque. Etiam aliquam libero ac eros rhoncus, in mattis justo fermentum. Nulla facilisi. Aliquam ac pellentesque enim, non pretium dui. Donec eget lectus auctor, ultrices augue vitae, vulputate ipsum. Etiam at aliquet enim. Aenean semper consectetur risus, non pharetra magna rutrum non. Duis justo lorem, semper sit amet lacus sit amet, vulputate pulvinar turpis.</p>',
    cancellationPolicy: '<p>Pellentesque ac leo nulla. Suspendisse et mattis eros, volutpat tempor velit. Aenean placerat eros eu dui porttitor sollicitudin. Sed eu convallis nisi. Vivamus bibendum enim quis ante lobortis, sit amet porttitor urna malesuada. Nunc faucibus malesuada ex consectetur convallis. In tellus mauris, pulvinar ut ipsum at, vestibulum commodo ipsum. Nulla non turpis mauris. Aliquam et risus et tellus malesuada accumsan. Nunc a ante sed tellus maximus interdum. Nam condimentum sollicitudin mi, eget rhoncus quam tincidunt porta. Aliquam dignissim ullamcorper dolor sit amet malesuada. Morbi eu est vehicula magna consectetur condimentum. Nam rutrum nec justo eu euismod.</p><p>Maecenas sit amet vehicula leo. Nulla rhoncus sodales eros. Cras placerat ut sapien nec efficitur. Donec magna purus, imperdiet in aliquam id, laoreet pharetra ex. Suspendisse vulputate eget arcu vel scelerisque. Cras nec lorem id odio ultricies vestibulum. Etiam luctus ut urna eget placerat. Morbi eu enim turpis. Morbi vel ultrices lacus. Sed in volutpat orci. Duis semper massa sed velit dapibus elementum. Nulla vel elementum nulla. Nullam vel elit eget neque vehicula dapibus in non eros. In non odio et odio commodo molestie.</p><p>Quisque commodo, ex eget auctor sollicitudin, diam arcu lobortis metus, a feugiat felis mi in mi. Suspendisse potenti. Nunc ornare volutpat felis in egestas. Nunc vitae quam congue velit iaculis scelerisque. Etiam aliquam libero ac eros rhoncus, in mattis justo fermentum. Nulla facilisi. Aliquam ac pellentesque enim, non pretium dui. Donec eget lectus auctor, ultrices augue vitae, vulputate ipsum. Etiam at aliquet enim. Aenean semper consectetur risus, non pharetra magna rutrum non. Duis justo lorem, semper sit amet lacus sit amet, vulputate pulvinar turpis.</p>',
    socialMediaLinks: [
      {
        name: 'Instagram',
        link: 'https://instagram/accounts/hotel-aloha-boston'
      },
      {
        name: 'Twitter',
        link: 'https://twitter/accounts/hotel-aloha-boston'
      }
    ],
    tags: [
      'Enchanting',
      'Modern',
      'Premium'
    ]
  }


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
