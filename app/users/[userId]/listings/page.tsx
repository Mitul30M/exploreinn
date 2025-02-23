import { listingTableColumns } from "@/components/user-page/listings/listing-table-columns";
import { UserListingsDataTable } from "@/components/user-page/listings/listings-data-table";
import { getOwnedListings } from "@/lib/actions/listings/listings";
import { currentUser } from "@clerk/nextjs/server";
import { HandCoins } from "lucide-react";

const UserListingsPage = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: SearchParams;
}) => {
  const user = await currentUser();
  const ownedListings = await getOwnedListings();
  // console.log(ownedListings);

  return (
    <section className="w-full space-y-4 mb-8 pb-4 border-border/90 border-b-[1px]">
      {/* Personal Info */}
      <div id="hotel-owner" className="space-y-4">
        <h1 className="text-md  flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight w-full px-4 py-2 border-y-[1px] border-border/90 text-foreground/90">
          <HandCoins size={22} className="text-primary" />
          {user?.firstName}'s Owned Listings
        </h1>

        {/* User's OwnedListings */}
        <UserListingsDataTable
          columns={listingTableColumns}
          data={ownedListings}
          className="mx-4"
        />

        {/* User Managed Listings */}
      </div>
    </section>
  );
};

export default UserListingsPage;
