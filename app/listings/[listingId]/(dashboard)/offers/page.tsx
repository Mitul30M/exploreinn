import { ListingOffersDataTable } from "@/components/listing-dashoard/offers/offers-table";
import { dashboardOffersTableColumns } from "@/components/listing-dashoard/offers/offers-table-columns";
import { getListingById } from "@/lib/actions/listings/listings";
import { getListingOffers } from "@/lib/actions/offers/offers";
import { Tag } from "lucide-react";
import { notFound } from "next/navigation";

const ListingOffersPage = async ({
  params,
}: {
  params: Promise<{ listingId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const listing = await getListingById((await params).listingId);
  if (!listing) {
    return notFound();
  }

  // fetch all offers
  const offers = await getListingOffers(listing.id);
  return (
    <section className="w-full space-y-4 mb-8 pb-4 border-border/90 border-b-[1px]">
      <div className="text-md  flex  rounded-none items-center gap-2  w-full px-4 py-2 border-y-[1px] border-border/90 text-foreground/90">
        <h1 className="flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight">
          <Tag size={22} className="text-primary" />
          {listing.name}&apos;s Offers
        </h1>
      </div>

      {/* Offers table */}
      <ListingOffersDataTable
        columns={dashboardOffersTableColumns}
        data={offers}
      />
    </section>
  );
};
export default ListingOffersPage;
