import { Inbox } from "lucide-react";
import { isAdmin } from "@/lib/actions/user/admin/admin";
import { notFound } from "next/navigation";
import { getExploreinnAdminMails } from "@/lib/actions/mails/mails";
import { AdminInboxContainer } from "@/components/admin-dashboard/inbox/admin-inbox-container";

const AdminInboxPage = async ({}: {
  params: Promise<{ listingId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const isAdminUser = await isAdmin();
  if (!isAdminUser) {
    return notFound();
  }

  const mails = await getExploreinnAdminMails();

  return (
    <section className="w-full space-y-4 mb-8 pb-4 border-border/90 border-b-[1px]">
      {/*  Info */}
      <div className="space-y-4">
        <div className="text-md  flex justify-between rounded-none items-center gap-2  w-full px-4 py-2 border-y-[1px] border-border/90 text-foreground/90">
          <h1 className="flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight">
            <Inbox size={22} className="text-primary" />
            exploreinn&apos;s Inbox
          </h1>

          <p className="font-medium tracking-tight text-sm">
            exploreinn&apos;s Email: {"   "}
            <strong className="text-primary text-lg">
              {process.env.NEXT_PUBLIC_EXPLOREINN_SUPPORT_EMAIL}
            </strong>
          </p>
        </div>
      </div>

      {/*  Mails */}
      <AdminInboxContainer mails={mails as TMails[]} />
    </section>
  );
};

export default AdminInboxPage;
