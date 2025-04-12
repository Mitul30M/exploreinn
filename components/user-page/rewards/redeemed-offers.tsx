"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getUserRedeemedOffers } from "@/lib/actions/offers/offers";
import { format } from "date-fns";
import { CalendarOff, Clipboard, Tag, TicketCheck } from "lucide-react";
import React from "react";

interface RedeemedOffersProps {
  offers: Awaited<ReturnType<typeof getUserRedeemedOffers>>;
  className?: string;
}

const RedeemedOffers = ({ offers, className }: RedeemedOffersProps) => {
  return (
    <ScrollArea className={className ?? ""}>
      <h2 className="text-[14px] font-medium flex justify-start items-center gap-1">
        <Tag size={18} className="text-primary" />
        Your Redeemed Offers
      </h2>
      <Separator className="my-4" />

      {/* Reward Points History */}
      {offers.map((offer) => (
        <div
          key={offer.id}
          className="flex justify-between items-center  gap-2 border-[1px] rounded border-border/90 p-4 mb-4"
        >
          <p className="text-[15px] font-medium tracking-tight">{offer.name}</p>
          <div className="text-[14px] leading-none text-secondary-foreground font-medium">
            {offer.description}
            <p className="text-primary my-4">
              {offer.couponCode.toUpperCase()}
            </p>
            <p className="text-xs text-muted-foreground ">
              Valid till {format(new Date(offer.endDate), "dd MMM yyyy")}.
              Minimum Booking Fee Rs {offer.minimumBookingAmount}.*
            </p>
          </div>
          <p className="text-[16px] font-medium tracking-tight">
            <Button
              className="hover:text-primary bg-accent rounded-full"
              variant={"outline"}
              size={"sm"}
              disabled={
                offer.redeemedAt instanceof Date ||
                new Date(offer.endDate) < new Date()
              }
              onClick={() => navigator.clipboard.writeText(offer.couponCode)}
            >
              {offer.redeemedAt instanceof Date ? (
                <>
                  Redeemed <TicketCheck size={16} />
                </>
              ) : new Date(offer.endDate) < new Date() ? (
                <>
                  Expired <CalendarOff size={16} />
                </>
              ) : (
                <>
                  Copy <Clipboard size={16} />
                </>
              )}
            </Button>
          </p>
        </div>
      ))}
    </ScrollArea>
  );
};

export default RedeemedOffers;
