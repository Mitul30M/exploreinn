import { BadgeCent, Gift, HandCoins, TicketCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { userRewardPointsHistory } from "@/lib/utils/seed/user-rewards/user-reward-points-history";
// import { format } from "date-fns";
import RewardsGrid from "@/components/user-page/rewards/rewards-grid";
import RedeemedOffers from "@/components/user-page/rewards/redeemed-offers";
import { notFound } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getUser } from "@/lib/actions/user/user";
import {
  getExploreinnOffers,
  getUserRedeemedOffers,
} from "@/lib/actions/offers/offers";

export default async function RewardsPage({
  params,
}: {
  params: Params;
  searchParams?: SearchParams;
}) {
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

  const userRedeemedOffers = await getUserRedeemedOffers(user.id);
  const exploreinnOffers = await getExploreinnOffers(true,false);
  return (
    <section className="w-full pb-4 overscroll-y-none space-y-4 mb-8 border-border/90 border-y-[1px]">
      {/* User's Reward Points and Offers */}
      <h1 className="text-md rounded-none flex justify-start items-center gap-2 font-semibold tracking-tight w-full px-4 py-2 border-b-[1px] border-border/90 text-foreground/90">
        <Gift size={22} className="text-primary" />
        {user.firstName}&apos;s Rewards
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-4 h-full w-full px-4">
        <div className=" w-[400px] rounded-md" id="reward-points">
          {/* Reward Points Balance */}
          <Card className="p-0 rounded-md border-[1px] border-border/90 shadow-none">
            <CardHeader className="p-4">
              <CardTitle className="text-[18px] flex justify-start items-center gap-1">
                <BadgeCent size={20} className="text-primary" />
                Reward Points
              </CardTitle>
              <CardDescription className="">
                <Alert className="border-0 bg-zinc-100/50 dark:bg-zinc-900/50 mt-2">
                  <HandCoins className="h-5 w-5 text-primary" />
                  <AlertTitle>Heads up!</AlertTitle>
                  <AlertDescription className="text-muted-foreground">
                    Reward Points Can be Collected by Booking Hotels.
                  </AlertDescription>
                </Alert>
              </CardDescription>
            </CardHeader>
            <Separator className="" />

            <CardContent className="p-4 mt-0">
              <div className="flex justify-between items-center">
                <p className="text-[16px] font-medium leading-none">
                  Reward Points Balance
                </p>
                <p className="text-2xl font-semibold tracking-tight">
                  {user.rewardPoints}{" "}
                  <span className="text-sm font-semibold tracking-tight text-primary">
                    pts
                  </span>
                </p>
              </div>
            </CardContent>
            <Separator className="" />

            <CardFooter className="p-4 mt-0 flex flex-col gap-4">
              {/* All the offers the user has redeemed */}
              <RedeemedOffers
                offers={userRedeemedOffers}
                className="h-max w-full rounded-md border p-4"
              />
            </CardFooter>
          </Card>
        </div>

        <ScrollArea
          className="h-[calc(100vh-200px)] min-h-[525px] w-[100%] rounded-md border p-4"
          id="redeem"
        >
          {/* Offers and Coupons Store */}
          <h1 className="text-md rounded-none flex justify-start items-center gap-2 font-semibold tracking-tight w-full  text-foreground/90">
            <TicketCheck size={22} className="text-primary" />
            Redeem Reward Points
          </h1>
          <Alert className="border-0 bg-zinc-100/50 dark:bg-zinc-900/50 mt-4">
            <HandCoins className="h-5 w-5 text-primary" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              Reward Points Can be Redeemed for Discount Coupons which can be
              used during your next Booking*. Each Redeemed Coupon can be used
              only once and has a validity*.
            </AlertDescription>
          </Alert>

          {/* create a div of grid cols-2 and gap-4, make this a separate component */}
          <RewardsGrid
            offers={exploreinnOffers}
            userId={user.id}
            userRewardPoints={user.rewardPoints}
            className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4 h-full w-full"
          />
        </ScrollArea>
      </div>
    </section>
  );
}
