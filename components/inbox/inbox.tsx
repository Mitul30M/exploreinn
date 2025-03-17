"use client";

import { InboxSidebar } from "../sidebars/user-inbox-sidebar/inbox-sidebar";
import { SidebarProvider } from "../ui/sidebar";
import CurrentMail from "../user-page/inbox/current-mail";
import { useState } from "react";

export const InboxContainer = ({
  mails,
  userId,
  userMail,
}: {
  mails: TMails[];
  userMail: string;
  userId: string;
}) => {
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
      <InboxSidebar
        userId={userId}
        data={mails}
        onMailClick={setSelectedMail}
        className="flex items-start justify-start rounded-md"
      />

      {/* also update the logic to change an unread text to read when the user clicks on the mail */}
      <CurrentMail
        onMailClose={onMailClose}
        mail={selectedMail}
        mailAddress={userMail}
        className="max-h-[80%] w-full p-4 border border-border/90"
      />
    </SidebarProvider>
  );
};
