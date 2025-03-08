import { InboxContainer } from "@/components/inbox/inbox";
import { Inbox } from "lucide-react";

const UserInboxPage = () => {
  // fetch the user's inbox data from the server, sort them and then pass it to the InboxSidebar component
  // sort the mails by date in descending order

  return (
    <section className="w-full space-y-4 mb-8 pb-4 border-border/90 border-b-[1px]">
      <h1 className="text-md  flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight w-full px-4 py-2 border-y-[1px] border-border/90 text-foreground/90">
        <Inbox size={22} className="text-primary" />
        Mitul&apos;s Mails
      </h1>
      <InboxContainer />
    </section>
  );
};

export default UserInboxPage;
