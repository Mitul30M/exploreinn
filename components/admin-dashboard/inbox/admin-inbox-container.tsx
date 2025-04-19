"use client";

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import CurrentMail from "@/components/user-page/inbox/current-mail";
import { ListingInboxSidebar } from "@/components/listing-dashoard/inbox/listing-inbox-sidebar";
import { AdminInboxSidebar } from "./admin-inbox-sidebar";

export const AdminInboxContainer = ({ mails }: { mails: TMails[] }) => {
  // no need of this state, just use the redux for selected mail directly in the CurrentMail component
  const [selectedMail, setSelectedMail] = useState<TMails | null>(null);

  const onMailClose = () => {
    setSelectedMail(null);
  };
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "320px",
        } as React.CSSProperties
      }
      className="max-h-[70vh] "
    >
      <AdminInboxSidebar
        data={mails}
        onMailClick={setSelectedMail}
        className="flex items-start justify-start rounded-md"
      />

      {/* also update the logic to change an unread text to read when the user clicks on the mail */}
      <CurrentMail
        onMailClose={onMailClose}
        mail={selectedMail}
        mailAddress={
          process.env.NEXT_PUBLIC_EXPLOREINN_SUPPORT_EMAIL ??
          "support@exploreinn.com"
        }
        className="max-h-[80%] w-full p-4 border border-border/90"
      />
    </SidebarProvider>
  );
};
