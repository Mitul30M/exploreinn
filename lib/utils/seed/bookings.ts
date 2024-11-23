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
    paymentStatus: 'pending' | 'completed' | 'cancelled' | 'refunded';
    bookingStatus: 'active' | 'upcoming' | 'completed' | 'cancelled';
    hotelName: string;
    hotelCity: string;
};

export const bookings: Bookings[] = Array.from({ length: 20 }, () => ({
    bookingId: Math.random().toString(16).substring(2, 10),
    bookingDate: new Date().toISOString(),
    checkInDate: new Date().toISOString(),
    checkOutDate: new Date().toISOString(),
    nights: Math.floor(Math.random() * 10) + 1,
    guests: Math.floor(Math.random() * 5) + 1,
    hotelId: Math.random().toString(16).substring(2, 10),
    roomId: Math.random().toString(16).substring(2, 10),
    roomName: `Room ${Math.floor(Math.random() * 100)}`,
    roomsBooked: Math.floor(Math.random() * 3) + 1,
    bookingAmount: Math.floor(Math.random() * 5000) + 100,
    transactionId: Math.random().toString(16).substring(2, 10),
    paymentStatus: ['pending', 'completed', 'cancelled', 'refunded'][Math.floor(Math.random() * 4)] as 'pending' | 'completed' | 'cancelled' | 'refunded',
    bookingStatus: ['active', 'upcoming', 'completed', 'cancelled'][Math.floor(Math.random() * 4)] as 'active' | 'upcoming' | 'completed' | 'cancelled',
    hotelName: ['Hotel Aloha', 'Hotel New Genesis', 'Hotel Dreamline', 'Hotel Paris', 'Hotel Serenity'][Math.floor(Math.random() * 5)],
    hotelCity: ['California', 'New York', 'Paris', 'London', 'Tokyo'][Math.floor(Math.random() * 5)],
}));
