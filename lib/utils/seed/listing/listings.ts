import { hotelAmenities } from "../../hotel-ammenities/hotel-amenities";

export const listings = [
  {
    id: 32631873618313,
    title: "Hotel Aloha, Boston",
    // name this ciy later
    location: "Boston, Massachusetts",
    //also add long-lat fields later
    address: "23 Serenity St, Boston, MA 02111, United States",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos quae suscipit laborum. Vero, sit, repellendus, amet beatae sapiente culpa debitis quae laudantium repudiandae necessitatibus totam! Accusantium soluta pariatur officiis minima.\nQuibusdam at atque in blanditiis natus debitis repellendus earum veritatis! Tempore ullam, dicta consectetur perferendis minus dignissimos illo repellendus provident architecto voluptatem distinctio officiis, sapiente ipsa totam cumque quis praesentium.\nAutem dolore voluptatum magni voluptates, odit dolorum ea quae optio voluptate odio quibusdam eius ipsam culpa nam, accusantium sit soluta. Corporis maxime quia qui delectus commodi beatae est voluptate officiis!\nAut at ipsam modi saepe nihil, tempora minus eligendi voluptate quis suscipit, unde esse sed debitis! Corrupti, iure nulla velit quae iusto ipsam nostrum consequatur adipisci pariatur ratione incidunt qui.",
    email: "info@hotelaloha.us",
    phoneNo: "+1 617-555-1234",
    // make this as cover-image
    image:
      "https://images.unsplash.com/photo-1723119832675-0031e0f0408c?q=80&w=1373&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    images: [
      "https://images.unsplash.com/photo-1723119832675-0031e0f0408c?q=80&w=1373&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1723119832675-0031e0f0408c?q=80&w=1373&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1723119832675-0031e0f0408c?q=80&w=1373&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1723119832675-0031e0f0408c?q=80&w=1373&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1723119832675-0031e0f0408c?q=80&w=1373&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1723119832675-0031e0f0408c?q=80&w=1373&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1723119832675-0031e0f0408c?q=80&w=1373&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    startingRoomPrice: 1750,
    // this should be a number between 0 and 5
    starRating: 4.8,
    // this should be a number between 0 and 10
    exploreinnRating: 9.6,
    // this should be grade and an enum of 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor'
    exploreinnGrade: "Excellent",
    reviews: 1280,
    amenities: hotelAmenities,
    // generated but ai beased on long,lat of the listing
    distanceFrom: {
      touristDestination: [
        {
          name: "Boston Museum of Fine Arts",
          distance: 1.2,
        },
        {
          name: "Boston Museum of Science",
          distance: 1.5,
        },
      ],
      railwayStation: [
        {
          name: "North Station",
          distance: 0.8,
        },
      ],
      airport: [
        {
          name: "Boston Logan International Airport",
          distance: 15.2,
        },
      ],
    },
    // room types & prices
    roomTypes: [
      {
        name: "Deluxe Room in Hotel Aloha",
        tag: "Great for couples!",
        // isAvailabe will be based on if any booking off exists for the room or any such event
        isAvailable: true,
        price: 1750,
        basePrice: 2000,
        maxOccupancy: 2,
        totalRooms: 50,
        availableRooms: 20,
        maxRoomsPerBookings: 5, //skippable
        beds: {
          type: "King Sized Bed",
          count: 1,
        },
        // cover image of the room
        image: "",
        images: ["", "", "", "", "", ""],
        area: 70,
        isReserveNowBookLaterAllowed: true,
        views: [
          {
            name: "City View",
            description: "Boston City skyline view from the room",
          },
          {
            name: "Garden View",
            description: "Garden view from the room",
          },
        ],
        perks: [
          {
            name: "Free Wi-Fi",
            description: "Free Wi-Fi in the room",
          },
          {
            name: "Free Welcome Drink",
            description: "Free Welcome Drink in the room",
          },
        ],
        extras: [
          {
            name: "No Add-Ons",
            cost: 0,
          },
          {
            name: "Breakfast Buffet",
            cost: 340,
          },
          {
            name: "Breakfast + Lunch Buffet",
            cost: 500,
          },
          {
            name: "Lunch Buffet",
            cost: 600,
          },
          {
            name: "Dinner Buffet",
            cost: 600,
          },
          {
            name: "Breakfast + Lunch + Dinner Buffet",
            cost: 1000,
          },
        ],
      },
    ],
    // avg of ratings
    overallRating: 9.8,
    // these ratings are out of 10 and avg of each rating for the same by all reviews
    ratings: {
      cleanliness: 9.8,
      comfort: 9.8,
      communication: 9.8,
      location: 9.8,
      valueForMoney: 9.8,
      checkIn: 9.8,
    },
  },
];

export type Listing = (typeof listings)[0];
export type ListingRoom = (typeof listings)[0]["roomTypes"][0];
export const seedListing: Listing = listings[0];
