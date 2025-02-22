import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebars/user-listing-dashboard-sidebar/listing-dashboard-app-sidebar";
import {
  getListingById,
  isListingManager,
  isListingOwner,
} from "@/lib/actions/listings/listings";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getUser } from "@/lib/actions/user/user";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const listingID = (await params).listingId;
  const listing = await getListingById(listingID);
  if (!listing) {
    return notFound();
  }
  const clerkUser = await currentUser();
  const userDbID = (clerkUser?.publicMetadata as PublicMetadataType).userDB_id;
  const user = await getUser(userDbID);
  if (!user) {
    return notFound();
  }

  const isOwner = await isListingOwner(user.id, listing.id);
  const isManager = await isListingManager(user.id, listing.id);
  if (!(isOwner || isManager)) {
    return notFound();
  }
  console.log("Dashboard for listing with ID: ", listingID);

  return (
    <SidebarProvider className="m-auto max-w-7xl relative">
      <AppSidebar
        listingID={listingID}
        collapsible="offcanvas"
        className="border-r-[1px] mt-1 border-t-[1px] border-border/90 z-20 shadow-sm shadow-foreground/5 "
      />
      <main className="min-h-screen bg-background border-border/90  absolute top-0 left-0 w-full shrink-0">
        <SidebarTrigger className="mx-4 my-2" />
        {children}
      </main>
    </SidebarProvider>
  );
}
