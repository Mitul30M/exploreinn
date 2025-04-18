"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import { redeemOffer } from "@/lib/actions/offers/offers";
import { Offer } from "@prisma/client";
import { format } from "date-fns";
import {
  BadgeCent,
  BadgePercent,
  CheckSquare,
  Gift,
  HandCoins,
  Loader2,
} from "lucide-react";
import React, { useState } from "react";

const RewardsGrid = ({
  offers,
  userId,
  userRewardPoints,
  className,
  ...props
}: {
  offers: Offer[];
  userId: string;
  userRewardPoints: number;
  className?: string;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  // change the data from seed data to the actual data from the Rewards collection
  //  also map the data in ascending order of redeem points
  return (
    <div className={className} {...props}>
      {offers.map((offer) => (
        <Card
          key={offer.id}
          className="w-full  rounded-md shadow-none hover:shadow-sm "
        >
          <CardHeader className="p-4">
            <CardTitle className="text-[16px] flex justify-start items-center gap-1">
              {/* <BadgeCent size={20} className="text-primary" /> */}
              {offer.type === "Percentage_Discount" ? (
                <BadgePercent size={18} className="text-primary" />
              ) : offer.type === "Flat_Discount" ? (
                <BadgeCent size={18} className="text-primary" />
              ) : (
                <Gift size={18} className="text-primary" />
              )}
              {offer.name}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-2 px-4 mt-0 text-[14px]">
            {offer.description}*
          </CardContent>

          <CardFooter className="p-4 flex justify-between items-center  mt-0 text-md font-medium text-foreground/90">
            <p className="text-xs text-muted-foreground">
              Offer Valid till {format(new Date(offer.endDate), "dd MMM yyyy")}.
            </p>

            {/* button should be disabled if redeem points are not enough */}
            <Button
              variant="outline"
              size={"sm"}
              className="rounded"
              disabled={
                (typeof offer.redeemForPoints === "number" &&
                  offer.redeemForPoints > userRewardPoints) ||
                loading
              }
              onClick={async () => {
                setLoading(true);
                const res = await redeemOffer(offer.id, userId);
                if (res.type === "error") {
                  toast({
                    title: `*An Error Occurred!`,
                    description: res.message,
                    action: (
                      <ToastAction
                        className="text-primary text-nowrap flex items-center gap-1 justify-center"
                        altText="error"
                      >
                        <Loader2 className="size-4 text-primary" /> OK
                      </ToastAction>
                    ),
                  });
                } else if (res.type === "success") {
                  toast({
                    title: `*Offer Redeemed!`,
                    description: res.message,
                    action: (
                      <ToastAction
                        className="text-primary text-nowrap flex items-center gap-1 justify-center"
                        altText="error"
                      >
                        <CheckSquare className="size-4 text-primary" /> OK
                      </ToastAction>
                    ),
                  });
                }
                setLoading(false);
              }}
            >
              <HandCoins className="h-5 w-5 text-primary" />
              Redeem for {offer.redeemForPoints} pts
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default RewardsGrid;
