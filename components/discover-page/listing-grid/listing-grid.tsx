import { listings } from "@/lib/utils/seed/listing/listings";
import ListingCard from "./listing-card";
import { propagateServerField } from "next/dist/server/lib/render-server";

export default function ListingGrid({ ...props }) {
  return (
    <div {...props}>
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
