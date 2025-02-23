"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCouponValidity } from "@/hooks/use-coupon-validity";
import { userOffers } from "@/lib/utils/seed/user-rewards/user-reward-points-history";
import { Clipboard, Tag } from "lucide-react";
import React from "react";

const RedeemedOffers = ({ ...props }) => {
  const { getCouponValidity } = useCouponValidity();

  return (
    <ScrollArea {...props}>
      <h2 className="text-[14px] font-medium flex justify-start items-center gap-1">
        <Tag size={18} className="text-primary" />
        Your Redeemed Offers
      </h2>
      <Separator className="my-4" />

      {/* Reward Points History */}
      {userOffers.map((coupon) => (
        <div
          key={coupon.redeemedOn.toString()}
          className="flex justify-between items-center  gap-2 border-[1px] rounded border-border/90 p-4 mb-4"
        >
          <div className="text-[14px] leading-none text-secondary-foreground font-medium">
            {coupon.offer.description}
            <p className="text-primary my-4">{coupon.offer.code}</p>
            <p className="text-xs text-muted-foreground ">
              {getCouponValidity(
                coupon.redeemedOn,
                coupon.offer.validForMonths
              )}
              . Minimum spend ${coupon.offer.minBookingAmount}.*
            </p>
          </div>
          <p className="text-[16px] font-medium tracking-tight">
            <Button
              className="hover:text-primary bg-accent rounded-full"
              variant={"outline"}
              size={"icon"}
              onClick={() => navigator.clipboard.writeText(coupon.offer.code)}
            >
              <Clipboard size={16} />
            </Button>
          </p>
        </div>
      ))}
    </ScrollArea>
  );
};

export default RedeemedOffers;
