import { ListingDashboardInboxContainer } from "@/components/listing-dashoard/inbox/listing-inbox-container";
import { getListingById } from "@/lib/actions/listings/listings";
import { getListingMails } from "@/lib/actions/mails/mails";
import { Inbox } from "lucide-react";
import { notFound } from "next/navigation";

const ListingInboxPage = async ({
  params,
}: {
  params: Params;
  searchParams?: SearchParams;
}) => {
  const listing = await getListingById((await params).listingId);
  if (!listing) {
    return notFound();
  }

  const mails = await getListingMails(listing.id);

  return (
    <section className="w-full space-y-4 mb-8 pb-4 border-border/90 border-b-[1px]">
      <h1 className="text-md  flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight w-full px-4 py-2 border-y-[1px] border-border/90 text-foreground/90">
        <Inbox size={22} className="text-primary" />
        {listing.name}&apos;s Mails
      </h1>
      <ListingDashboardInboxContainer
        mails={mails as TMails[]}
        listingId={listing.id}
        listingMail={listing.email}
      />
    </section>
  );
};

export default ListingInboxPage;
