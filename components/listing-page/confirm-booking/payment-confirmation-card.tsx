"use client";

import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/hooks/redux-hooks";
import { RootState } from "@/lib/redux-store/store";
import { Listing } from "@prisma/client";
import { BadgeDollarSign, Handshake, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { startTransition, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createStripeCheckoutSession } from "@/lib/actions/stripe/stripe";
import { createBookNowPayLaterBooking } from "@/lib/actions/bookings/bookings";
import { Badge } from "@/components/ui/badge";

interface PaymentConfirmationCardProps {
  className?: string;
  listing: Listing;
}

const bookingFormSchema = z.object({
  listingID: z.string(),
  checkIn: z.date(),
  checkOut: z.date(),
  nights: z.number(),
  guests: z.number(),
  rooms: z.array(
    z.object({
      roomID: z.string(),
      name: z.string(),
      rate: z.number(),
      noOfRooms: z.number(),
    })
  ),
  taxes: z.array(
    z.object({
      name: z.string(),
      rate: z.number(),
    })
  ),
  extras: z.array(
    z.object({
      name: z.string(),
      cost: z.number(),
    })
  ),
  totalWithoutTaxes: z.number(),
  tax: z.number(),
  totalPayable: z.number(),
  paymentMethod: z.enum(["book-now-pay-later", "online-payment"], {
    required_error: "Please a Payment Method",
  }),
  isOfferApplied: z.boolean().optional(),
  offerId: z.string().optional(),
});

const PaymentConfirmationCard = ({
  className,
  listing,
}: PaymentConfirmationCardProps) => {
  const {
    checkIn,
    checkOut,
    guests,
    nights,
    totalPayable,
    tax,
    extras,
    rooms,
    taxes,
    totalWithoutTaxes,
    isOfferApplied,
    couponCode,
    offerId,
    offerDescription,
    offerType,
    discountedAmount,
    discountPercentage,
    minBookingFeeToApplyOffer,
    maxAllowedDiscountAmount,
  } = useAppSelector((state: RootState) => state.newBooking);
  const roomsTotal = rooms.reduce((total, room) => {
    return total + room.rate * room.noOfRooms * nights;
  }, 0);

  const extrasTotal = extras.reduce((total, extra) => {
    return total + guests * extra.cost * nights;
  }, 0);

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      listingID: listing.id,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      nights: nights,
      guests: guests,
      rooms: rooms,
      taxes: taxes,
      extras: extras,
      totalWithoutTaxes: totalWithoutTaxes,
      tax: tax,
      totalPayable: totalPayable,
      paymentMethod: "online-payment",
      isOfferApplied: isOfferApplied,
      offerId: offerId,
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(data: z.infer<typeof bookingFormSchema>) {
    toast({
      title: "Booking Details",
      description: (
        <pre className="mt-2 w-[340px] rounded-md  border-border/90 border-[1px]">
          <ScrollArea className="h-[400px] p-4">
            <code className="">{JSON.stringify(data, null, 2)}</code>
          </ScrollArea>
        </pre>
      ),
    });
  }

  return (
    <div className={className}>
      <h1 className="text-lg font-semibold tracking-tight flex gap-2 items-center h-max w-max mb-4">
        <BadgeDollarSign className="text-primary" />
        Payment Confirmation
      </h1>
      <div className="flex gap-4 items-start ">
        <Image
          src={listing.coverImage}
          alt={listing.name}
          width={100}
          height={100}
          className="aspect-square object-cover rounded border-[1px] border-border/90 "
        />
        <div>
          <p className="font-semibold text-[16px]">{listing.name}</p>
          <p className="text-sm font-medium text-accent-foreground/90 mt-2">
            {listing.address.fullAddress}
          </p>
          <p className="text-sm font-medium text-accent-foreground/70 mt-2">
            TaxIN: {listing.taxIN}
          </p>
        </div>
      </div>
      <Separator className="my-6" />

      <p className="font-semibold text-[16px] my-2">Pricing Details</p>
      <div className="w-full ">
        {/* rooms */}
        {rooms.map((room, index) => (
          <div
            key={index}
            className="w-full flex items-center justify-between mt-2 first:mt-0"
          >
            <p className="text-sm">
              {room.noOfRooms}x {room.name} (
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(room.rate)}{" "}
              x {nights} {nights === 1 ? "night" : "nights"})
            </p>
            <p className="font-semibold text-[16px]">
              +
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(room.rate * nights * room.noOfRooms)}
            </p>
          </div>
        ))}
        {/* extras */}
        {extras.map((extra, index) => (
          <div
            key={index}
            className="w-full flex items-center justify-between mt-2 first:mt-0"
          >
            <p className="text-sm">
              {extra.name} (
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(extra.cost)}{" "}
              x {guests} {guests === 1 ? "guest" : "guests"}) x {nights}{" "}
              {nights === 1 ? "night" : "nights"})
            </p>
            <p className="font-semibold text-[16px]">
              +
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(extra.cost * guests * nights)}
            </p>
          </div>
        ))}

        {/* no offer */}
        {!isOfferApplied && (
          <>
            <div className="w-full flex items-center justify-between mt-2 border-y-[1px] border-border/90 py-2">
              <p className="text-sm">Gross Total</p>
              <p className="font-semibold text-[16px]">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(totalWithoutTaxes)}
              </p>
            </div>
          </>
        )}

        {/* offer applied but roomsTotal + extrasTotal << minBookingFeeToApplyOffer ; not enough to apply offer*/}
        {isOfferApplied &&
          roomsTotal + extrasTotal < minBookingFeeToApplyOffer && (
            <>
              <div className="w-full flex items-center justify-between mt-2 border-y-[1px] border-border/90 py-2">
                <Badge>
                  Can&apos;t Apply Offer. Add More
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(
                    minBookingFeeToApplyOffer - roomsTotal + extrasTotal
                  )}{" "}
                  to apply offer & proceed with booking.
                </Badge>
              </div>
            </>
          )}

        {/* flat discount offer*/}
        {isOfferApplied &&
          offerType === "Flat_Discount" &&
          roomsTotal + extrasTotal >= minBookingFeeToApplyOffer && (
            <>
              <div className="w-full flex items-center justify-between mt-2 border-y-[1px] border-border/90 py-2">
                <p className="text-sm">Total Before Discount</p>
                <p className="font-semibold text-[16px]">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(roomsTotal + extrasTotal)}
                </p>
              </div>
              <div className="w-full flex items-center justify-between mt-2">
                <p className="text-sm">
                  Discount{" "}
                  <span className="text-primary font-semibold">
                    {couponCode}
                  </span>
                </p>
                <p className="font-semibold text-[16px] text-primary">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(-discountedAmount)}
                </p>{" "}
              </div>
              <div className="w-full flex items-center justify-between mt-2 border-y-[1px] border-border/90 py-2">
                <p className="text-sm">Gross Total After Discount</p>
                <p className="font-semibold text-[16px]">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalWithoutTaxes)}
                </p>
              </div>
            </>
          )}

        {/* percentage discount offer*/}
        {isOfferApplied &&
          offerType === "Percentage_Discount" &&
          roomsTotal + extrasTotal >= minBookingFeeToApplyOffer && (
            <>
              <div className="w-full flex items-center justify-between mt-2 border-y-[1px] border-border/90 py-2">
                <p className="text-sm">Total Before Discount</p>
                <p className="font-semibold text-[16px]">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(roomsTotal + extrasTotal)}
                </p>
              </div>
              <div className="w-full flex items-center justify-between mt-2">
                <p className="text-sm">
                  {discountPercentage}% Discount{" "}
                  {maxAllowedDiscountAmount &&
                    `(upto ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(maxAllowedDiscountAmount)})`}{" "}
                  <span className="text-primary font-semibold">
                    {couponCode}
                  </span>
                </p>
                <p className="font-semibold text-[16px] text-primary">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(-discountedAmount)}
                </p>{" "}
              </div>

              <div className="w-full flex items-center justify-between mt-2 border-y-[1px] border-border/90 py-2">
                <p className="text-sm">Gross Total After Discount</p>
                <p className="font-semibold text-[16px]">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalWithoutTaxes)}
                </p>
              </div>
            </>
          )}

        {/* extra perks offer */}
        {isOfferApplied &&
          offerType === "Extra_Perks" &&
          roomsTotal + extrasTotal >= minBookingFeeToApplyOffer && (
            <>
              <div className="w-full flex items-center justify-between mt-2 border-y-[1px] border-border/90 py-2">
                <Badge>{offerDescription}</Badge>
              </div>

              <div className="w-full flex items-center justify-between mt-2 border-b-[1px] border-border/90 py-2">
                <p className="text-sm">Gross Total</p>
                <p className="font-semibold text-[16px]">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalWithoutTaxes)}
                </p>
              </div>
            </>
          )}
      </div>

      <p className="font-semibold text-[16px] mt-6">Taxes</p>
      <div className="w-full">
        {taxes.map((tax) => (
          <div
            key={tax.name}
            className="w-full flex items-center justify-between mt-2"
          >
            <p className="text-sm">
              {tax.name} ({tax.rate.toLocaleString()}%)
            </p>
            <p className="font-semibold text-[16px]">
              +
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(totalWithoutTaxes * (tax.rate / 100))}
            </p>
          </div>
        ))}
        <div className="w-full flex items-center justify-between mt-2 border-y-[1px] border-border/90 py-2">
          <p className="text-sm">Total Taxes</p>
          <p className="font-semibold text-[16px]">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(tax)}
          </p>
        </div>
      </div>

      <p className="font-semibold text-[16px] mt-6">Total Booking Fee</p>
      <div className="w-full flex items-center justify-between mt-4 border-y-[1px] border-border/90 py-2 ">
        <p className="text-sm">Total Payable</p>
        <p className="font-semibold text-[16px] capitalize text-primary">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(totalPayable)}
        </p>
      </div>

      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(async (formData) => {
            try {
              const validatedData = bookingFormSchema.parse(formData);
              const paymentMethod = form.getValues("paymentMethod");
              onSubmit(validatedData);
              startTransition(() => {
                if (paymentMethod === "online-payment") {
                  console.log("online-payment");
                  createStripeCheckoutSession(validatedData);
                } else if (paymentMethod === "book-now-pay-later") {
                  console.log("book-now-pay-later");
                  createBookNowPayLaterBooking(validatedData);
                }
              });
            } catch (error) {
              console.log(error);
              toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Please check your booking details",
              });
            }
          })}
          className="space-y-6 my-6"
        >
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-[16px] dark:required:text-primary">
                  Payment Method
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Payment Method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="book-now-pay-later">
                      Book Now Pay Later
                    </SelectItem>
                    <SelectItem value="online-payment">
                      Online Payment through Stripe
                    </SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={
              form.formState.isSubmitting ||
              !rooms.length ||
              !checkIn ||
              !checkOut ||
              !totalPayable ||
              (isOfferApplied &&
                roomsTotal + extrasTotal < minBookingFeeToApplyOffer)
            }
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Handshake />
            )}
            {form.formState.isSubmitting
              ? "Confirming Booking..."
              : "Confirm Booking"}
          </Button>
        </form>
      </Form>

      <p className="text-accent-foreground/70 text-sm font-medium ">
        *For Book-Now-Pay-Later bookings: Free Cancellation upto to 48hrs after
        booking. After that, a one charge of 5% of the total booking amount will
        be applicable which will be mailed as an invoice to you.
        <br />
        *For Prepaid Bookings: Free Cancellations till 24hr before check-in and
        the payment will be refunded to the respective account. Incase of
        cancellation after 24hrs before check-in, the payment will not be
        refunded whilst deducting the cancellation charges of 5% of the total
        booking amount.
        <br />
        *Incase of booking changes the same must be consulted with the
        respective Listing&apos;s managers.
        <br />
        <Link
          href={"#"}
          className="text-primary hover:underline hover:underline-offset-2"
        >
          Terms & Conditions Applied
        </Link>
      </p>
    </div>
  );
};

export default PaymentConfirmationCard;
