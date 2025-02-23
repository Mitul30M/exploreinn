import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  createStripeAccountLink,
  getStripeDashboardLink,
} from "@/lib/actions/stripe/stripe";
import { getUser } from "@/lib/actions/user/user";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  ChartLine,
  CreditCard,
  ExternalLink,
} from "lucide-react";
import { notFound } from "next/navigation";

const BillingPage = async ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  const { userId } = await auth();
  const clerkUser = await currentUser();

  const userID = (await params).userId;
  if (
    userID != (clerkUser?.publicMetadata as PublicMetadataType).userDB_id ||
    !userId
  ) {
    notFound();
  }
  const user = await getUser(userID);
  if (!user) return notFound();

  return (
    <section className="w-full space-y-4 mb-8 pb-4 border-border/90 border-b-[1px]">
      <div id="personal-info" className="space-y-4">
        <h1 className="text-md  flex justify-start rounded-none items-center gap-2 font-semibold tracking-tight w-full px-4 py-2 border-y-[1px] border-border/90 text-foreground/90">
          <CreditCard size={22} className="text-primary" />
          {user?.firstName}'s Billing Page
        </h1>

        {/* User's Billing */}
        <div className="rounded-md border-[1px] border-border/90 w-max h-max  mx-4 py-4 ml-auto">
          <h1 className="font-semibold text-lg flex items-center w-max gap-2 mx-4">
            <ChartLine size={22} strokeWidth={2.2} className="text-primary" />
            Stripe Dashboard
          </h1>
          <Separator className="my-4 border-border/90" />
          <p className=" font-medium text-accent-foreground/95 mx-4">
            Access your full billing details
          </p>
          <p className="mt-8 max-w-[250px] font-medium text-sm text-accent-foreground/80 mx-4">
            For more detailed billing information and management options, visit
            your Stripe dashboard.
          </p>

          {user.isStripeConnectedAccount ? (
            <Button
              className="mx-4 mt-4 rounded"
              size={"sm"}
              onClick={getStripeDashboardLink}
            >
              <ExternalLink /> Open Stripe Dashboard
            </Button>
          ) : (
            <Button
              className="mx-4 mt-4 rounded"
              size={"sm"}
              onClick={createStripeAccountLink}
            >
              <ExternalLink /> Connect Stripe Account
            </Button>
          )}
        </div>
        {/* table of transactions by the user */}
      </div>
    </section>
  );
};

export default BillingPage;

// Stripe Dashboard
// Access your full billing details

// For more detailed billing information and management options, visit your Stripe dashboard.
// ExternalLink;
// Open Stripe Dashboard
