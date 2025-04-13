"use client";

import { Offer } from "@prisma/client";
import { Tag } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { AppDispatch, RootState } from "@/lib/redux-store/store";
import {
  removeDiscount,
  setDiscount,
} from "@/lib/redux-store/slices/new-booking-slice";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { getUserRedeemedOffers } from "@/lib/actions/offers/offers";
import { Separator } from "../ui/separator";

export function OffersList({
  userRedeemedOffers,
  listingOffers,
  listingName,
}: {
  listingOffers: Offer[];
  userRedeemedOffers: Awaited<ReturnType<typeof getUserRedeemedOffers>>;
  listingName: string;
  listingId: string;
}) {
  const { isOfferApplied, offerId } = useAppSelector(
    (state: RootState) => state.newBooking
  );
  const dispatch: AppDispatch = useAppDispatch();

  return (
    <div className="border-[1px]  border-border/90 h-max rounded-sm">
      <h1 className=" text-lg font-semibold tracking-tight border-border/90 border-b-[1px] p-4 flex items-center gap-2">
        <Tag className="text-primary" />
        Ongoing Offers
      </h1>
      {/* scrollable offers list */}
      <ScrollArea className="w-full h-[300px] space-y-4 ">
        <div className="p-4 flex flex-col gap-2">
          <h1 className="text-[16px] font-semibold tracking-tight mb-2 text-primary ">
            Offers from {listingName}
          </h1>
          {listingOffers.map((offer) => (
            <div
              className="flex items-center justify-between gap-2 p-2 px-3 border-[1px]  border-border/90 rounded"
              key={offer.id}
            >
              <div className="space-y-1 text-left">
                <h1 className="text-[15px] font-semibold tracking-tight ">
                  {offer.name}
                </h1>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <p className="w-[200px] truncate text-[13px]">
                      {offer.description}
                    </p>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-72 p-4">
                    <div className="w-full text-[13px] text-wrap">
                      {offer.description}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Button
                size={"sm"}
                variant={
                  isOfferApplied && offer.id === offerId ? "outline" : "default"
                }
                onClick={() => {
                  if (isOfferApplied && offer.id === offerId) {
                    // If the current offer is already applied, remove it
                    dispatch(removeDiscount());
                  } else {
                    // Remove any currently applied discount
                    dispatch(removeDiscount());
                    // Apply the new discount
                    dispatch(
                      setDiscount({
                        couponCode: offer.couponCode,
                        offerId: offer.id,
                        discountPercentage: offer.percentageDiscount!,
                        offerType: offer.type,
                        offerName: offer.name,
                        offerDescription: offer.description,
                        maxAllowedDiscountAmount:
                          offer.type === "Flat_Discount"
                            ? offer.flatDiscount!
                            : offer.type === "Percentage_Discount"
                              ? offer.maxDiscountAmount!
                              : 0,
                        minBookingFeeToApplyOffer: offer.minimumBookingAmount!,
                      })
                    );
                  }
                }}
              >
                {isOfferApplied && offer.id === offerId
                  ? "Remove"
                  : offer.couponCode.toUpperCase()}
              </Button>
            </div>
          ))}
        </div>
        {userRedeemedOffers.length > 0 && (
          <>
            <Separator className="w-full border-border/90" />
            <div className="p-4 flex flex-col gap-2">
              <h1 className="text-[16px] font-semibold tracking-tight mb-2 text-primary ">
                Your Redeemed Offers
              </h1>
              {userRedeemedOffers
                .filter((offer) => !offer.redeemedAt && !offer.bookingId)
                .map((offer) => (
                  <div
                    className="flex items-center justify-between gap-2 p-2 px-3 border-[1px]  border-border/90 rounded"
                    key={offer.id}
                  >
                    <div className="space-y-1 text-left">
                      <h1 className="text-[15px] font-semibold tracking-tight ">
                        {offer.name}
                      </h1>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <p className="w-[200px] truncate text-[13px]">
                            {offer.description}
                          </p>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-72 p-4">
                          <div className="w-full text-[13px] text-wrap">
                            {offer.description}
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    <Button
                      size={"sm"}
                      variant={
                        isOfferApplied && offer.id === offerId
                          ? "outline"
                          : "default"
                      }
                      onClick={() => {
                        if (isOfferApplied && offer.id === offerId) {
                          // If the current offer is already applied, remove it
                          dispatch(removeDiscount());
                        } else {
                          // Remove any currently applied discount
                          dispatch(removeDiscount());
                          // Apply the new discount
                          dispatch(
                            setDiscount({
                              couponCode: offer.couponCode,
                              offerId: offer.id,
                              discountPercentage: offer.percentageDiscount!,
                              offerType: offer.type,
                              offerName: offer.name,
                              offerDescription: offer.description,
                              maxAllowedDiscountAmount:
                                offer.type === "Flat_Discount"
                                  ? offer.flatDiscount!
                                  : offer.type === "Percentage_Discount"
                                    ? offer.maxDiscountAmount!
                                    : 0,
                              minBookingFeeToApplyOffer:
                                offer.minimumBookingAmount!,
                            })
                          );
                        }
                      }}
                    >
                      {isOfferApplied && offer.id === offerId
                        ? "Remove"
                        : offer.couponCode.toUpperCase()}
                    </Button>
                  </div>
                ))}
            </div>
          </>
        )}
      </ScrollArea>
    </div>
  );
}
