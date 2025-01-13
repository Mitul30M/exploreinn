import BookingInfoCard from "@/components/listing-page/confirm-booking/booking-info-card";
import PaymentConfirmationCard from "@/components/listing-page/confirm-booking/payment-confirmation-card";
import { getListingById } from "@/lib/actions/listings/listings";
import { CalendarCheck, ChevronLeft, ListCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

const NewBookingConfirmationPage = async ({ params }: { params: Params }) => {
  const listingID = (await params).listingId;
  const listing = await getListingById(listingID);

  if (!listing) {
    return notFound();
  }

  return (
    <div className=" max-w-5xl py-16 m-auto px-4">
      <Link
        href={`/listings/${listing.id}`}
        className="flex items-center  hover:text-primary hover:underline hover:underline-offset-2 mb-6"
      >
        <ChevronLeft className="w-5 h-5" /> Back
      </Link>
      <h1 className="text-xl w-max font-semibold flex items-center gap-2 mb-12">
        <CalendarCheck className="text-primary" />
        Booking Confirmation
      </h1>
      <section className="w-max mx-auto  flex gap-4">
        {/* booking Info */}
        <BookingInfoCard
          listing={listing}
          className=" max-w-[400px] h-max border-border/90 border-[1px]  rounded-sm p-4"
        />

        <PaymentConfirmationCard
          listing={listing}
          className="max-w-[400px] h-max border-border/90 border-[1px]  rounded-sm p-4"
        />
      </section>
    </div>
  );
};

export default NewBookingConfirmationPage;
