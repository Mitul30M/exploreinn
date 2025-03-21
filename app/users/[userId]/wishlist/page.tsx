import ListingGrid from "@/components/discover-page/listing-grid/listing-grid";
import { getWishListedListings } from "@/lib/actions/listings/listings";
import { getUser } from "@/lib/actions/user/user";
import { auth, currentUser } from "@clerk/nextjs/server";
import { BookHeart } from "lucide-react";
import { notFound } from "next/navigation";

export default async function WishlistPage({
  params,
}: {
  params: Params;
  searchParams?: SearchParams;
}) {
  const { userId } = await auth();
  const clerkUser = await currentUser();
  // this has been implemented so tht no one other than the one authorized can see their profile. to safeguard the user's data
  const userID = (await params).userId;
  if (
    userID != (clerkUser?.publicMetadata as PublicMetadataType).userDB_id ||
    !userId
  ) {
    notFound();
  }
  const user = await getUser(userID);

  if (!user) {
    notFound();
  }

  const wishListedListings = await getWishListedListings(user.id);

  return (
    <section className="w-full space-y-4 mb-8 pb-4 border-border/90 border-y-[1px]">
      {/* User's Wishlist */}
      <h1 className="text-md rounded-none flex justify-start items-center gap-2 font-semibold tracking-tight w-full px-4 py-2 border-b-[1px] border-border/90 text-foreground/90">
        <BookHeart size={22} className="text-primary" />
        {user.firstName}&apos;s Wishlist
      </h1>

      <ListingGrid
        listings={wishListedListings}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-4 mx-4"
      />
    </section>
  );
}
