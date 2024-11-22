import FilterSortSearchGroup from "@/components/discover-page/filter-sort-search/filter-sort-search";
import FindListingsInput from "@/components/discover-page/find-listings/find-listing";
import ListingGrid from "@/components/discover-page/listing-grid/listing-grid";
import Navbar from "@/components/discover-page/navbar/home-page-navbar";

export default function DiscoverPage() {
  return (
    <main className="min-h-screen bg-background border-border/90 border-x-[1px] max-w-7xl m-auto">
      <Navbar />
      <FindListingsInput />
      <FilterSortSearchGroup />
      <ListingGrid />
    </main>
  );
}
