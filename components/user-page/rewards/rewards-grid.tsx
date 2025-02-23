import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { offers } from "@/lib/utils/seed/user-rewards/user-reward-points-history";
import { BadgeCent, BadgePercent, HandCoins } from "lucide-react";
import React from "react";

const RewardsGrid = ({ ...props }) => {
  // change the data from seed data to the actual data from the Rewards collection
  //  also map the data in ascending order of redeem points
  return (
    <div {...props}>
      {offers.map((offer) => (
        <Card
          key={offer.id}
          className="w-full  rounded-md shadow-none hover:shadow-sm "
        >
          <CardHeader className="p-4">
            <CardTitle className="text-[16px] flex justify-start items-center gap-1">
              {/* <BadgeCent size={20} className="text-primary" /> */}
              {offer.offerType === "percentage discount" ? (
                <BadgePercent size={18} className="text-primary" />
              ) : (
                <BadgeCent size={18} className="text-primary" />
              )}
              {offer.title}
            </CardTitle>
          </CardHeader>
          <Separator className="" />

          <CardContent className="p-2 px-4 mt-0 text-[12px]">
            {offer.description}*
          </CardContent>
          <Separator className="" />

          <CardFooter className="p-4 flex justify-between items-center  mt-0 text-md font-medium text-foreground/90">
            <p className="text-xs text-muted-foreground">
              Offer valid for {offer.validForMonths} months after redeeming*
            </p>

            {/* button should be disabled if redeem points are not enough */}
            <Button variant="outline" size={"sm"} className="rounded-full">
              <HandCoins className="h-5 w-5 text-primary" />
              Redeem {offer.points} {" "} pts
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default RewardsGrid;
