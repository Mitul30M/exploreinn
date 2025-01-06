import FilterSortSearchGroup from "@/components/discover-page/filter-sort-search/filter-sort-search";
import FindListingsInput from "@/components/discover-page/find-listings/find-listing";
import ListingGrid from "@/components/discover-page/listing-grid/listing-grid";
import Navbar from "@/components/discover-page/navbar/home-page-navbar";
import {
  getListingsPreview,
  TListingCard,
} from "@/lib/actions/listings/listings";
import { Loader } from "lucide-react";
import { Suspense } from "react";

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = await searchParams;
  const listings: TListingCard[] = await getListingsPreview(
    JSON.stringify(query)
  );

  return (
    <main className="min-h-screen bg-background border-border/90 border-x-[1px] max-w-7xl m-auto">
      <Navbar />
      <FindListingsInput />
      <FilterSortSearchGroup />
      <Suspense
        fallback={
          <p className=" p-4 flex w-max items-center gap-2">
            <Loader className="animate-spin" />
            Loading...
          </p>
        }
      >
        <p className="p-4">{JSON.stringify(query)}</p>
      </Suspense>

      <section className="w-full  border-border/90 border-y-[1px] items-center justify-center flex">
        <Suspense
          fallback={
            <p className="px-4 pt-4 flex w-max items-center gap-2">
              <Loader className="animate-spin" />
              Loading...
            </p>
          }
        >
          <ListingGrid
            listings={listings}
            className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 !gap-4  auto-cols-auto w-max mx-auto"
          />
        </Suspense>
      </section>
    </main>
  );
}
