import { hotelAmenities } from "@/lib/utils/hotel-ammenities/hotel-amenities";
import ListingCard from "./listing-card";

const listings = [
  {
    id: 32631873618313,
    title: "Hotel Aloha, Boston",
    location: "Boston, Massachusetts",
    image:
      "https://images.unsplash.com/photo-1723119832675-0031e0f0408c?q=80&w=1373&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    startingRoomPrice: 1750,
    starRating: 4.8,
    exploreinnRating: 9.6,
    exploreinnGrade: "Excellent",
    reviews: 128,
    amenities: hotelAmenities,
  },
];

export default function ListingGrid() {
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mt-4 border-border/90 border-y-[1px] ">
      {listings.map((listing) => (
        <>
          <ListingCard key={listing.id} listing={listing} />
          <ListingCard key={listing.id} listing={listing} />
          <ListingCard key={listing.id} listing={listing} />
          <ListingCard key={listing.id} listing={listing} />
          <ListingCard key={listing.id} listing={listing} />
          <ListingCard key={listing.id} listing={listing} />
          <ListingCard key={listing.id} listing={listing} />
        </>
      ))}
    </div>
  );
}