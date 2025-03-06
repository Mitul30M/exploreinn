"use client";
import { InboxSidebar } from "@/components/sidebars/user-inbox-sidebar/inbox-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Inbox } from "lucide-react";
import React from "react";
import CurrentMail from "@/components/user-page/inbox/current-mail";
import { Mail, mails } from "@/lib/utils/seed/user-inbox/mails";
import { getListingById } from "@/lib/actions/listings/listings";
import { notFound } from "next/navigation";

const ListingInboxPage = async ({
  params,
}: {
  params: Params;
  searchParams?: SearchParams;
}) => {
  const listingID = (await params).listingId;
  const listing = await getListingById(listingID);
  if (!listing) {
    return notFound();
  }
  // fetch the user's inbox data from the server, sort them and then pass it to the InboxSidebar component
  // sort the mails by date in descending order
  const sortedMails = mails.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // no need of this state, just use the redux for selected mail directly in the CurrentMail component
  const [selectedMail, setSelectedMail] = React.useState<Mail | null>(null);

  return (
    <section className="w-full space-y-4 mb-8 pb-4 border-border/90 border-b-[1px]">
      <h1 className="text-md  flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight w-full px-4 py-2 border-y-[1px] border-border/90 text-foreground/90">
        <Inbox size={22} className="text-primary" />
        {listing.name}&apos;s Mails
      </h1>

      <SidebarProvider
        style={
          {
            "--sidebar-width": "320px",
          } as React.CSSProperties
        }
        className="max-h-[70vh] "
      >
        <InboxSidebar
          data={sortedMails}
          onMailClick={setSelectedMail}
          className="flex items-start justify-start rounded-md"
        />
        {/* selected mail should not be passed down like this, instead make use of redux store to select the current mail directly in the component*/}
        {/* also update the logic to change an unread text to read when the user clicks on the mail */}
        <CurrentMail
          mail={selectedMail}
          className="max-h-[80%] w-full p-4 border border-border/90"
        />
      </SidebarProvider>
    </section>
  );
};

export default ListingInboxPage;
