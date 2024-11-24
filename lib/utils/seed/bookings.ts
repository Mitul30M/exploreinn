export type Bookings = {
  bookingId: string;
  bookingDate: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guests: number;
  hotelId: string;
  roomId: string;
  roomName: string;
  roomsBooked: number;
  bookingAmount: number;
  transactionId: string;
  paymentStatus: "pending" | "completed" | "cancelled" | "refunded";
  bookingStatus: "ongoing" | "upcoming" | "completed" | "cancelled";
  hotelName: string;
  hotelCity: string;
  hotelCoverImg: string;
};

export const bookings: Bookings[] = Array.from({ length: 20 }, () => ({
  bookingId: Math.random().toString(16).substring(2, 15),
  // bookingDate: new Date().toISOString(),
  // checkInDate: new Date().toISOString(),
  // checkOutDate: new Date().toISOString(),
  // update the above dates such tht all dates are random and with different days,month
  // and years
  bookingDate: getRandomDateInRange().toISOString(),
  checkInDate: getRandomDateInRange().toISOString(),
  checkOutDate: getRandomDateInRange().toISOString(),
  nights: Math.floor(Math.random() * 10) + 1,
  guests: Math.floor(Math.random() * 5) + 1,
  hotelId: Math.random().toString(16).substring(2, 15),
  roomId: Math.random().toString(16).substring(2, 15),
  roomName: `Room ${Math.floor(Math.random() * 100)}`,
  roomsBooked: Math.floor(Math.random() * 3) + 1,
  bookingAmount: Math.floor(Math.random() * 5000) + 100,
  transactionId: Math.random().toString(16).substring(2, 15),
  paymentStatus: ["pending", "completed", "cancelled", "refunded"][
    Math.floor(Math.random() * 4)
  ] as "pending" | "completed" | "cancelled" | "refunded",
  bookingStatus: ["ongoing", "upcoming", "completed", "cancelled"][
    Math.floor(Math.random() * 4)
  ] as "ongoing" | "upcoming" | "completed" | "cancelled",
  hotelName: [
    "Hotel Aloha",
    "Hotel New Genesis",
    "Hotel Dreamline",
    "Hotel Paris",
    "Hotel Serenity",
  ][Math.floor(Math.random() * 5)],
  hotelCity: ["California", "New York", "Paris", "London", "Tokyo"][
    Math.floor(Math.random() * 5)
  ],
  hotelCoverImg: [
    "https://images.unsplash.com/photo-1690314754158-7287f2022d9d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1678963248935-dc399bf567b4?q=80&w=1355&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1681338224373-9669c2497c05?q=80&w=1407&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1725345653429-8b3926cc229c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1533794939052-03f5ea84373b?q=80&w=1414&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1474690455603-a369ec1293f9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1694362503749-dfe67a641ff6?q=80&w=1426&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1721330536639-8c4b7a4641b6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ][Math.floor(Math.random() * 7)],
}));


// A function to generate random date from 1 Jan 2022 to 31 Dec 2024 and return it
function getRandomDateInRange(): Date {
  const start = new Date(2022, 0, 1).getTime();
  const end = new Date(2024, 11, 31).getTime();
  const randomTime = Math.random() * (end - start) + start;
  return new Date(randomTime);
}
