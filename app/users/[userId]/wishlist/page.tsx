import ListingGrid from "@/components/discover-page/listing-grid/listing-grid";
import { BookHeart } from "lucide-react";

export default function WishlistPage() {
  return (
    <section className="w-full space-y-4 mb-8 pb-4 border-border/90 border-y-[1px]">
      {/* User's Wishlist */}
      <h1 className="text-md rounded-none flex justify-start items-center gap-2 font-semibold tracking-tight w-full px-4 py-2 border-b-[1px] border-border/90 text-foreground/90">
        <BookHeart size={22} className="text-primary" />
        Mitul's Wishlist
      </h1>

      <ListingGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-4 mx-4" />
    </section>
  );
}
