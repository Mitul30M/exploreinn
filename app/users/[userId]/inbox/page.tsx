import { InboxContainer } from "@/components/inbox/inbox";
import { getUserMails } from "@/lib/actions/mails/mails";
import { getUser } from "@/lib/actions/user/user";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Inbox } from "lucide-react";
import { notFound } from "next/navigation";

const UserInboxPage = async ({
  params,
}: {
  params: Params;
  searchParams?: SearchParams;
}) => {
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
  // fetch the user's inbox data from the server, sort them and then pass it to the InboxSidebar component
  const mails = await getUserMails(user.id);

  return (
    <section className="w-full space-y-4 mb-8 pb-4 border-border/90 border-b-[1px]">
      <h1 className="text-md  flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight w-full px-4 py-2 border-y-[1px] border-border/90 text-foreground/90">
        <Inbox size={22} className="text-primary" />
        {user.firstName}&apos;s Mails
      </h1>
      <InboxContainer
        mails={mails as TMails[]}
        userId={user.id}
        userMail={user.email}
      />
    </section>
  );
};

export default UserInboxPage;
