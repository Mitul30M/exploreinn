import FilterSortSearchGroup from "@/components/discover-page/filter-sort-search/filter-sort-search";
import FindListingsInput from "@/components/discover-page/find-listings/find-listing";
import ListingGrid from "@/components/discover-page/listing-grid/listing-grid";
import Navbar from "@/components/discover-page/navbar/home-page-navbar";
import {
  getListingsPreview,
  TListingCard,
} from "@/lib/actions/listings/listings";

export default async function DiscoverPage() {
  const listings: TListingCard[] = await getListingsPreview();

  return (
    <main className="min-h-screen bg-background border-border/90 border-x-[1px] max-w-7xl m-auto">
      <Navbar />
      <FindListingsInput />
      <FilterSortSearchGroup />
      <ListingGrid
        listings={listings}
        className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-4 mt-4 border-border/90 border-y-[1px]"
      />
    </main>
  );
}
