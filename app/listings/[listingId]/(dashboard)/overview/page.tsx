import { UserListingsDataTable } from "@/components/user-page/listings/listings-data-table";

import { HandCoins, Hotel } from "lucide-react";

const ListingOverviewPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ listingId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <section className="w-full space-y-4 mb-8 pb-4 border-border/90 border-b-[1px]">
      {/* Personal Info */}
      <div id="hotel-owner" className="space-y-4">
        <h1 className="text-md  flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight w-full px-4 py-2 border-y-[1px] border-border/90 text-foreground/90">
          <Hotel size={22} className="text-primary" />
          Overview {(await params).listingId}
        </h1>
      </div>
    </section>
  );
};

export default ListingOverviewPage;
