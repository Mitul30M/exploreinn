"use client";

import { Offer } from "@prisma/client";
import { CircleX, Tag } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { AppDispatch, RootState } from "@/lib/redux-store/store";
import {
  removeDiscount,
  setDiscount,
} from "@/lib/redux-store/slices/new-booking-slice";

export function OffersList({
  listingOffers,
  listingName,
  listingId,
}: {
  listingOffers: Offer[];
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
        Exciting Offers just for you
      </h1>
      {/* scrollable offers list */}
      <ScrollArea className="w-full h-[300px] ">
        <div className="p-4 flex flex-col gap-2">
          <h1 className="text-[16px] font-semibold tracking-tight ">
            Offers from {listingName}
          </h1>
          {listingOffers.map((offer) => (
            <div
              className="flex items-center justify-between gap-2 p-2 border-[1px]  border-border/90 rounded"
              key={offer.id}
            >
              <div className="space-y-2 text-left">
                <h1 className="text-[15px] font-medium tracking-tight ">
                  {offer.name}
                </h1>
                <p className="text-wrap text-[14px]  text-muted-foreground">
                  {offer.description}
                </p>
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
                      })
                    );
                  }
                }}
              >
                {isOfferApplied && offer.id === offerId ? (
                  "Remove"
                ) : (
                  offer.couponCode.toUpperCase()
                )}
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
