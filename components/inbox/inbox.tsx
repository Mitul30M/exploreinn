"use client";

import { InboxSidebar } from "../sidebars/user-inbox-sidebar/inbox-sidebar";
import { SidebarProvider } from "../ui/sidebar";
import CurrentMail from "../user-page/inbox/current-mail";
import { useState } from "react";
import { Mail } from "@prisma/client";

export type UserMails = Mail & {
  sender?: {
    firstName: string;
    lastName: string;
    email: string;
    profileImg: string | null;
  };
  receiver: {
    firstName: string;
    lastName: string;
    email: string;
    profileImg: string | null;
  };
  listing?: {
    id: string;
    name: string;
    email: string;
    coverImage: string;
  };
};
export const InboxContainer = ({
  mails,
  userId,
  userMail
}: {
    mails: UserMails[];
  userMail:string;
  userId: string;
}) => {
  // no need of this state, just use the redux for selected mail directly in the CurrentMail component
  const [selectedMail, setSelectedMail] = useState<UserMails | null>(null);

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
      {/* selected mail should not be passed down like this, instead make use of redux store to select the current mail directly in the component*/}
      {/* also update the logic to change an unread text to read when the user clicks on the mail */}
      <CurrentMail
        onMailClose={onMailClose}
        mail={selectedMail}
        userMail={userMail}
        className="max-h-[80%] w-full p-4 border border-border/90"
      />
    </SidebarProvider>
  );
};
