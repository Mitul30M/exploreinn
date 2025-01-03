import ListingCard from "./listing-card";
import { propagateServerField } from "next/dist/server/lib/render-server";
import {
  getListingsPreview,
  TListingCard,
} from "@/lib/actions/listings/listings";


interface ListingGridProps extends React.HTMLAttributes<HTMLDivElement> {
  listings: TListingCard[];
}

export default async function ListingGrid({ listings, ...props }: ListingGridProps) {
  return (
    <div {...props}>
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
